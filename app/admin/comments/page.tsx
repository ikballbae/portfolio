'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { updateCommentStatus, deleteComment, getAllComments } from '../../actions/admin'

type CommentAdminType = {
    id: string
    article_slug: string
    author_name: string
    content: string
    status: 'approved' | 'pending' | 'rejected'
    moderation_reason: string | null
    created_at: string
}

export default function AdminCommentsPage() {
    const [passcode, setPasscode] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [comments, setComments] = useState<CommentAdminType[]>([])
    const [loading, setLoading] = useState(false)

    const fetchAllComments = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setComments(data)
        }
        setLoading(false)
    }

    // Since RLS blocks reading pending/rejected comments for public, we actually need to fetch via a server action or API route.
    // Wait! Supabase client uses anon key. RLS policy will block anon users from reading ALL comments.
    // Let me update this to fetch from a Server Action using Admin key.
    return <AdminDashboard />
}

// Separate component to handle the logic properly
function AdminDashboard() {
    const [passcode, setPasscode] = useState('')
    const [authError, setAuthError] = useState('')
    const [comments, setComments] = useState<CommentAdminType[]>([])
    const [loading, setLoading] = useState(false)

    const loadComments = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        setLoading(true)
        setAuthError('')
        
        try {
            const data = await getAllComments(passcode)
            
            if (data.success && data.comments) {
                setComments(data.comments as CommentAdminType[])
            } else {
                setAuthError(data.error || 'Invalid passcode')
            }
        } catch (err) {
            setAuthError('Connection error')
        }
        setLoading(false)
    }

    const handleAction = async (id: string, action: 'approved' | 'rejected' | 'delete') => {
        setLoading(true)
        try {
            let res;
            if (action === 'delete') {
                res = await deleteComment(id, passcode)
            } else {
                res = await updateCommentStatus(id, action, passcode)
            }

            if (res.success) {
                await loadComments() // refresh
            } else {
                alert(res.error)
            }
        } catch (err) {
            alert('Error performing action')
        }
        setLoading(false)
    }

    if (comments.length === 0 && !loading && !authError && passcode === '') {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center p-4">
                <form onSubmit={loadComments} className="lab-card p-8 rounded-xl w-full max-w-sm flex flex-col gap-4 border border-text/10">
                    <h1 className="font-syne font-bold text-2xl text-center mb-2">Admin Login</h1>
                    <input
                        type="password"
                        placeholder="Secret Passcode"
                        value={passcode}
                        onChange={e => setPasscode(e.target.value)}
                        className="bg-bg/50 border border-text/10 px-4 py-2 rounded-lg text-text focus:outline-none focus:border-accent"
                    />
                    <button type="submit" className="bg-accent text-bg px-4 py-2 rounded-lg font-bold">
                        Login
                    </button>
                    {authError && <p className="text-red-400 text-sm text-center mt-2">{authError}</p>}
                </form>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="font-syne font-bold text-3xl">Comment Moderation</h1>
                    <button onClick={() => loadComments()} className="px-4 py-2 border border-text/10 rounded hover:bg-text/5 text-sm font-mono">
                        Refresh
                    </button>
                </div>
                
                {authError && <p className="text-red-400 mb-4">{authError}</p>}
                
                <div className="flex flex-col gap-4">
                    {comments.map(c => (
                        <div key={c.id} className="lab-card p-5 rounded-xl border border-text/10 flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex gap-3 items-center mb-2">
                                    <span className="font-bold text-lg">{c.author_name}</span>
                                    <span className="text-text-muted text-xs font-mono">{c.article_slug}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                                        c.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                        c.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                        'bg-amber-500/10 text-amber-500'
                                    }`}>
                                        {c.status}
                                    </span>
                                </div>
                                <p className="text-text-muted mb-3 break-words whitespace-pre-wrap">{c.content}</p>
                                {c.moderation_reason && (
                                    <p className="text-xs text-amber-500/80 bg-amber-500/10 p-2 rounded mb-2">
                                        Reason: {c.moderation_reason}
                                    </p>
                                )}
                                <div className="text-[10px] font-mono text-text-muted/50">
                                    {new Date(c.created_at).toLocaleString()}
                                </div>
                            </div>
                            
                            <div className="flex sm:flex-col gap-2 justify-center shrink-0">
                                {c.status !== 'approved' && (
                                    <button onClick={() => handleAction(c.id, 'approved')} disabled={loading} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded text-xs font-bold transition">
                                        Approve
                                    </button>
                                )}
                                {c.status !== 'rejected' && (
                                    <button onClick={() => handleAction(c.id, 'rejected')} disabled={loading} className="px-3 py-1.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded text-xs font-bold transition">
                                        Reject
                                    </button>
                                )}
                                <button onClick={() => { if(confirm('Hapus permanen?')) handleAction(c.id, 'delete') }} disabled={loading} className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded text-xs font-bold transition">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {comments.length === 0 && !loading && !authError && (
                        <p className="text-center py-10 text-text-muted">No comments found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
