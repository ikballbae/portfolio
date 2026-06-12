'use server'

import { headers } from 'next/headers'
import crypto from 'crypto'
import { supabaseAdmin } from '../../lib/supabase/admin'
import { CommentSchema, moderateComment } from '../../lib/utils/moderation'

// Fungsi untuk membuat hash MD5 sederhana dari IP untuk menjaga privasi
function hashIp(ip: string) {
    return crypto.createHash('md5').update(ip).digest('hex')
}

export async function submitComment(prevState: any, formData: FormData) {
    try {
        const rawData = {
            author_name: formData.get('author_name'),
            content: formData.get('content'),
            article_slug: formData.get('article_slug'),
        }

        // 1. Validasi Zod Schema
        const validated = CommentSchema.safeParse(rawData)
        if (!validated.success) {
            return {
                error: validated.error.issues[0].message,
                success: false
            }
        }

        const { author_name, content, article_slug } = validated.data

        // 2. Dapatkan IP Address untuk Rate Limiting
        const headersList = await headers()
        const forwardedFor = headersList.get('x-forwarded-for')
        const realIp = headersList.get('x-real-ip')
        const ip = forwardedFor?.split(',')[0] || realIp || 'unknown-ip'
        const ipHash = hashIp(ip)

        // 3. Cek Rate Limiting (Maks 1 komentar setiap 30 detik per IP)
        const { data: recentComments, error: rateLimitError } = await supabaseAdmin
            .from('comments')
            .select('created_at')
            .eq('ip_hash', ipHash)
            .order('created_at', { ascending: false })
            .limit(1)

        if (!rateLimitError && recentComments && recentComments.length > 0) {
            const lastCommentTime = new Date(recentComments[0].created_at).getTime()
            const now = new Date().getTime()
            const diffSeconds = (now - lastCommentTime) / 1000

            if (diffSeconds < 30) {
                return {
                    error: `Tunggu ${Math.ceil(30 - diffSeconds)} detik lagi untuk berkomentar.`,
                    success: false
                }
            }
        }

        // 4. Moderasi Konten (Filter toxic, script, link, dll)
        const moderation = moderateComment(content, author_name)

        if (moderation.status === 'rejected') {
            return {
                // Beri pesan sopan tanpa memberi tahu detail bypass
                error: 'Komentar tidak dapat dipublikasikan karena melanggar pedoman komunitas.',
                success: false
            }
        }

        // 5. Simpan ke Supabase (Bypass RLS dengan Service Role)
        const { error: insertError } = await supabaseAdmin
            .from('comments')
            .insert({
                article_slug,
                author_name: author_name.trim(),
                content: content.trim(),
                status: moderation.status,
                moderation_reason: moderation.reason,
                ip_hash: ipHash
            })

        if (insertError) {
            console.error('Error saving comment:', insertError)
            return {
                error: 'Terjadi kesalahan sistem saat menyimpan komentar.',
                success: false
            }
        }

        return {
            success: true,
            message: moderation.status === 'pending'
                ? 'Komentar Anda sedang menunggu moderasi.'
                : 'Komentar berhasil dipublikasikan!',
            status: moderation.status
        }

    } catch (e) {
        console.error('Unexpected error in submitComment:', e)
        return {
            error: 'Terjadi kesalahan yang tidak terduga.',
            success: false
        }
    }
}
