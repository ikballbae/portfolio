'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

interface LoadingContextType {
    isLoaded: boolean
    markLoaded: () => void
}

const LoadingContext = createContext<LoadingContextType>({
    isLoaded: false,
    markLoaded: () => {},
})

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false)

    const markLoaded = useCallback(() => {
        setIsLoaded(true)
    }, [])

    return (
        <LoadingContext.Provider value={{ isLoaded, markLoaded }}>
            {children}
        </LoadingContext.Provider>
    )
}

export function useLoading() {
    return useContext(LoadingContext)
}
