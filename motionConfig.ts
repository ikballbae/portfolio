export const motionConfig = {
    // Lenis Smooth Scroll
    lenis: {
        lerp: 0.08,
        wheelMultiplier: 0.9,
        smoothWheel: true,
        syncTouch: false,
        anchorScrollDuration: 1.4,
        anchorScrollEase: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential out
    },

    // Preloader
    preloader: {
        counterDuration: 0.8,
        counterEase: 'power2.out',
        nameExitDuration: 0.35,
        nameExitEase: 'power2.in',
        revealDuration: 0.65,
        revealEase: 'expo.inOut',
        revealOverlap: -0.3,
    },

    // Hero Entry Animation (SplitText & Components)
    hero: {
        // Headline Lines & Chars
        headline: {
            duration: 1.0,
            ease: 'expo.out',
            charStagger: 0.02,
            lineDelay: 0.12,
            initialYPercent: 110,
            initialRotate: 4,
        },
        // Description paragraph
        description: {
            duration: 0.9,
            ease: 'power3.out',
            lineStagger: 0.08,
            initialYPercent: 100,
        },
        // Badges, Role Stack & Coordinate Labels
        microDetails: {
            duration: 0.7,
            ease: 'power2.out',
            yDistance: 16,
            stagger: 0.08,
        },
        // CTA Buttons
        cta: {
            duration: 0.8,
            ease: 'back.out(1.5)',
            scaleInitial: 0.9,
            stagger: 0.1,
        },
        // Mascot
        mascot: {
            entranceDuration: 1.0,
            entranceEase: 'back.out(1.7)',
            initialScale: 0.85,
            initialRotate: -6,
            floatDuration: 3.0,
            floatY: -10,
            floatEase: 'sine.inOut',
        },
        // Spinning Outline Box
        rotatingBox: {
            duration: 24,
            ease: 'none',
        },
    },

    // ScrollTrigger Parallax & Scrub Effects
    scrollTrigger: {
        parallaxScrub: 1.2,
        mascotYPercent: -15,
        gridYPercent: 8,
        headlineExitScrub: true,
        headlineExitYPercent: -12,
        headlineExitOpacity: 0.15,
        headlineRandomYRange: 20,
    },
}
