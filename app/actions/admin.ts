'use server'

import { supabaseAdmin } from '../../lib/supabase/admin'
import { revalidatePath } from 'next/cache'

// Secret token for admin actions (in a real app, use proper session auth)
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'admin123'

export async function getAllComments(passcode: string) {
    if (passcode !== ADMIN_PASSCODE) {
        return { success: false, error: 'Unauthorized: Invalid Passcode' }
    }

    const { data, error } = await supabaseAdmin
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return { success: false, error: 'Failed to fetch comments' }
    }

    return { success: true, comments: data }
}

export async function updateCommentStatus(commentId: string, newStatus: 'approved' | 'rejected', passcode: string) {
    if (passcode !== ADMIN_PASSCODE) {
        return { success: false, error: 'Unauthorized: Invalid Passcode' }
    }

    const { error } = await supabaseAdmin
        .from('comments')
        .update({ status: newStatus })
        .eq('id', commentId)

    if (error) {
        console.error('Error updating comment status:', error)
        return { success: false, error: 'Failed to update status' }
    }

    // Optionally revalidate blog paths to refresh ISR cache if used
    revalidatePath('/blog/[slug]', 'page')
    
    return { success: true }
}

export async function deleteComment(commentId: string, passcode: string) {
    if (passcode !== ADMIN_PASSCODE) {
        return { success: false, error: 'Unauthorized: Invalid Passcode' }
    }

    const { error } = await supabaseAdmin
        .from('comments')
        .delete()
        .eq('id', commentId)

    if (error) {
        console.error('Error deleting comment:', error)
        return { success: false, error: 'Failed to delete comment' }
    }

    revalidatePath('/blog/[slug]', 'page')
    
    return { success: true }
}
