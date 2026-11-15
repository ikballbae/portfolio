import React from 'react'

export default function BlueprintGrid() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Ambient subtle glow gradients */}
            <div
                className="absolute top-1/4 -left-48 w-96 h-96 rounded-full opacity-20 blur-3xl"
                style={{
                    background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
                }}
            />
            <div
                className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full opacity-10 blur-3xl"
                style={{
                    background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
                }}
            />

            {/* Subtle Blueprint grid texture */}
            <div
                className="blueprint-grid absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, var(--text) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--text) 1px, transparent 1px)
                    `,
                    backgroundSize: '48px 48px',
                }}
            />
        </div>
    )
}
