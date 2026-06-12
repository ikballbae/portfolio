import { v4 as uuidv4 } from 'uuid'

const SESSION_KEY = 'portfolio_user_session_id'

export function getSessionId(): string {
    if (typeof window === 'undefined') {
        // Return a generic fallback or empty if called on server without cookies
        // But this function should primarily be used on the client
        return ''
    }

    let sessionId = localStorage.getItem(SESSION_KEY)
    
    if (!sessionId) {
        sessionId = uuidv4()
        localStorage.setItem(SESSION_KEY, sessionId)
    }
    
    return sessionId
}
