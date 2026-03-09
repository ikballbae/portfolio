'use client'
import { motion } from 'framer-motion'

export default function BlueprintGrid() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Blueprint grid */}
            <div className="absolute inset-0 blueprint-grid" />

            {/* Accent glow orbs — very subtle */}
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, var(--grid-color-bright) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    top: '-10%',
                    left: '-5%',
                }}
                animate={{
                    x: [0, 30, -20, 0],
                    y: [0, -20, 15, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, var(--grid-color) 0%, transparent 70%)',
                    filter: 'blur(100px)',
                    bottom: '5%',
                    right: '-5%',
                }}
                animate={{
                    x: [0, -20, 15, 0],
                    y: [0, 15, -20, 0],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Coordinate markers */}
            <div className="absolute top-4 left-4 coord-label hidden md:block">
                [0, 0]
            </div>
            <div className="absolute top-4 right-4 coord-label hidden md:block">
                [1920, 0]
            </div>
            <div className="absolute bottom-4 left-4 coord-label hidden md:block">
                [0, 1080]
            </div>
        </div>
    )
}
