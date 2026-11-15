import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const VIEWPORTS = [
    { name: '1536x735', width: 1536, height: 735, isDesktop: true },
    { name: '1920x1080', width: 1920, height: 1080, isDesktop: true },
    { name: '390x844', width: 390, height: 844, isDesktop: false, isMobile: true },
]

const SCROLL_STEPS = [0, 25, 50, 75, 100]
const VALID_ROLES = ['Full-Stack Dev', 'UI/UX Designer', 'Tech Leader']

const SCREENSHOT_DIR = path.resolve('test-screenshots')
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
}

function rectsOverlap(a, b, tolerance = 1.5) {
    return !(
        a.right <= b.left + tolerance ||
        a.left >= b.right - tolerance ||
        a.bottom <= b.top + tolerance ||
        a.top >= b.bottom - tolerance
    )
}

async function setupPage(context, theme = 'dark') {
    const page = await context.newPage()

    // Mock external Supabase calls in offline headless environment
    await page.route('**/*supabase.co/**', (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
        })
    )

    const consoleErrors = []
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text())
        }
    })
    page.on('pageerror', (err) => {
        consoleErrors.push(err.message)
    })

    await page.addInitScript((t) => {
        window.localStorage.setItem('theme', t)
    }, theme)

    await page.goto('http://localhost:3000/?load=0', { waitUntil: 'domcontentloaded' })
    await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t)
    }, theme)

    // Wait for fonts + entrance timeline + 150ms post-entrance debounce
    await page.waitForTimeout(1300)

    return { page, consoleErrors }
}

async function scrollToY(page, y) {
    await page.evaluate((targetY) => {
        if (window.__lenis) {
            window.__lenis.scrollTo(targetY, { immediate: true })
        }
        window.scrollTo(0, targetY)
    }, y)
}

async function runTests() {
    console.log('=== Starting Playwright Verification: FLY THROUGH THE BLUEPRINT ===')
    const browser = await chromium.launch({ headless: true })
    const summaryRows = []
    let hasFailure = false

    for (const vp of VIEWPORTS) {
        const context = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            colorScheme: 'dark',
            isMobile: !!vp.isMobile,
            hasTouch: !!vp.isMobile,
        })

        const { page, consoleErrors } = await setupPage(context, 'dark')

        // 1. Check Navbar alignment & initial bounding boxes at 0%
        const initialCheck = await page.evaluate(() => {
            const navLogo = document.querySelector('nav a[href="/"]')
            const badge = document.querySelector('[data-testid="hero-badge"]')
            const line1 = document.querySelector('[data-testid="headline-line-1"]')
            const role = document.querySelector('[data-testid="hero-role"]')
            const subtext = document.querySelector('[data-testid="hero-subtext"]')
            const ctaPrimary = document.querySelector('[data-testid="cta-primary"]')
            const hudTopLeft = document.querySelector('[data-testid="hud-top-left"]')

            const logoLeft = navLogo ? navLogo.getBoundingClientRect().left : 0
            const badgeLeft = badge ? badge.getBoundingClientRect().left : 0
            const line1Left = line1 ? line1.getBoundingClientRect().left : 0
            const roleLeft = role ? role.getBoundingClientRect().left : 0
            const subtextLeft = subtext ? subtext.getBoundingClientRect().left : 0
            const ctaLeft = ctaPrimary ? ctaPrimary.getBoundingClientRect().left : 0
            const hudLeft = hudTopLeft ? hudTopLeft.getBoundingClientRect().left : 0

            const maxAlignDiff = Math.max(
                Math.abs(logoLeft - badgeLeft),
                Math.abs(logoLeft - line1Left),
                Math.abs(logoLeft - roleLeft),
                Math.abs(logoLeft - subtextLeft),
                Math.abs(logoLeft - ctaLeft),
                Math.abs(logoLeft - hudLeft)
            )

            const selectors = [
                'hud-top-left',
                'hud-top-right',
                'hud-bottom-left',
                'hero-badge',
                'headline-line-1',
                'headline-line-2',
                'headline-line-3',
                'hero-role',
                'hero-subtext',
                'cta-primary',
                'cta-secondary',
                'hero-avatar',
                'scroll-indicator',
            ]
            const rects = selectors.map((id) => {
                const el = document.querySelector(`[data-testid="${id}"]`)
                const r = el.getBoundingClientRect()
                return { id, left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height }
            })

            return {
                logoLeft: Math.round(logoLeft),
                maxAlignDiff: Number(maxAlignDiff.toFixed(2)),
                rects,
            }
        })

        const overlaps = []
        for (let i = 0; i < initialCheck.rects.length; i++) {
            for (let j = i + 1; j < initialCheck.rects.length; j++) {
                if (rectsOverlap(initialCheck.rects[i], initialCheck.rects[j], 1.5)) {
                    overlaps.push(`${initialCheck.rects[i].id} <-> ${initialCheck.rects[j].id}`)
                }
            }
        }

        // 2. Scroll through 0%, 25%, 50%, 75%, 100% and take screenshots
        const maxScrollY = vp.isDesktop ? Math.round(vp.height * 1.2) : vp.height
        const stepStates = {}
        let anyOverflowX = false

        for (const pct of SCROLL_STEPS) {
            const targetY = Math.round((pct / 100) * maxScrollY)
            await scrollToY(page, targetY)
            // Wait 1.15s for scrub: 1 to catch up smoothly
            await page.waitForTimeout(1150)

            const shotPath = path.join(SCREENSHOT_DIR, `hero-scroll-${vp.name}-${pct}pct.png`)
            await page.screenshot({ path: shotPath, fullPage: false })

            const state = await page.evaluate(() => {
                const hudText = document.querySelector('[data-testid="hud-coords-text"]')?.textContent || ''
                const l1Op = parseFloat(window.getComputedStyle(document.querySelector('[data-testid="headline-line-1"]')).opacity)
                const metaOp = parseFloat(window.getComputedStyle(document.querySelector('[data-testid="hero-meta-scroll"]')).opacity)
                const avatarOp = parseFloat(window.getComputedStyle(document.querySelector('[data-testid="hero-avatar"]')).opacity)
                const indOp = parseFloat(window.getComputedStyle(document.querySelector('[data-testid="scroll-indicator-wrapper"]')).opacity)
                const overflowX = document.documentElement.scrollWidth > document.documentElement.clientWidth
                return {
                    hudText,
                    l1Op: Number(l1Op.toFixed(2)),
                    metaOp: Number(metaOp.toFixed(2)),
                    avatarOp: Number(avatarOp.toFixed(2)),
                    indOp: Number(indOp.toFixed(2)),
                    overflowX,
                }
            })

            if (state.overflowX) anyOverflowX = true
            stepStates[`${pct}%`] = state
            console.log(`[${vp.name}] Scroll ${pct}% (y=${targetY}) ->`, state)
        }

        // 3. Check pin release smoothness around 100% -> 105% on desktop
        let pinReleaseJumpPx = 0
        if (vp.isDesktop) {
            await scrollToY(page, maxScrollY - 10)
            await page.waitForTimeout(400)
            const aboutTopBefore = await page.evaluate(() => {
                const about = document.querySelector('#about')
                return about ? about.getBoundingClientRect().top : 0
            })
            await scrollToY(page, maxScrollY + 10)
            await page.waitForTimeout(400)
            const aboutTopAfter = await page.evaluate(() => {
                const about = document.querySelector('#about')
                return about ? about.getBoundingClientRect().top : 0
            })
            pinReleaseJumpPx = Math.abs((aboutTopBefore - aboutTopAfter) - 20)
        }

        // 4. Scroll back to 0% and verify Hero restores 100% to initial state
        await scrollToY(page, 0)
        await page.waitForTimeout(1250)

        const restoredShot = path.join(SCREENSHOT_DIR, `hero-scroll-${vp.name}-restored-0pct.png`)
        await page.screenshot({ path: restoredShot, fullPage: false })

        const restoredCheck = await page.evaluate(() => {
            const l1 = document.querySelector('[data-testid="headline-line-1"]')
            const l2 = document.querySelector('[data-testid="headline-line-2"]')
            const l3 = document.querySelector('[data-testid="headline-line-3"]')
            const meta = document.querySelector('[data-testid="hero-meta-scroll"]')
            const badge = document.querySelector('[data-testid="hero-badge"]')?.parentElement
            const avatar = document.querySelector('[data-testid="hero-avatar"]')
            const ind = document.querySelector('[data-testid="scroll-indicator-wrapper"]')
            const stage = document.querySelector('[data-testid="hero-stage"]')

            const opacities = [l1, l2, l3, meta, badge, avatar, ind].map((el) =>
                el ? parseFloat(window.getComputedStyle(el).opacity) : 0
            )
            const minOpacity = Math.min(...opacities)

            const charsStuck = Array.from(document.querySelectorAll('#hero .hl-char')).some(
                (c) => parseFloat(c.style.getPropertyValue('--t') || '0') > 0.05
            )

            const clipPath = stage ? window.getComputedStyle(stage).clipPath : ''

            return {
                minOpacity: Number(minOpacity.toFixed(2)),
                charsStuck,
                clipPath,
            }
        })

        // 5. Pure Scroll Performance Pass (measure Long Tasks >50ms & React Re-renders without CDP screenshot overhead)
        await page.waitForTimeout(300)
        await page.evaluate(() => {
            window.__longTasks = []
            if (typeof PerformanceObserver !== 'undefined') {
                const obs = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) {
                            window.__longTasks.push({
                                name: entry.name,
                                duration: Number(entry.duration.toFixed(1)),
                            })
                        }
                    }
                })
                try {
                    obs.observe({ entryTypes: ['longtask'], buffered: false })
                    window.__longTaskObserver = obs
                } catch { }
            }
        })

        const rendersBefore = await page.evaluate(() => window.__heroRenderCount || 0)

        for (const pct of SCROLL_STEPS) {
            const targetY = Math.round((pct / 100) * maxScrollY)
            await scrollToY(page, targetY)
            await page.waitForTimeout(250)
        }
        await scrollToY(page, 0)
        await page.waitForTimeout(600)

        const { rendersAfter, longTasks } = await page.evaluate(() => {
            if (window.__longTaskObserver) {
                window.__longTaskObserver.disconnect()
            }
            return {
                rendersAfter: window.__heroRenderCount || 0,
                longTasks: window.__longTasks || [],
            }
        })
        const scrollReRenders = rendersAfter - rendersBefore

        const row = {
            viewport: vp.name,
            navAlignDiffPx: initialCheck.maxAlignDiff,
            overlapsAt0: overlaps.length,
            hudAt50: stepStates['50%'].hudText,
            hudAt100: stepStates['100%'].hudText,
            restoredMinOp: restoredCheck.minOpacity,
            charsStuck: restoredCheck.charsStuck,
            pinJumpPx: Number(pinReleaseJumpPx.toFixed(1)),
            overflowX: anyOverflowX,
            scrollReRenders,
            longTasksGt50ms: longTasks.length,
            consoleErrors: consoleErrors.length,
        }
        summaryRows.push(row)

        if (
            initialCheck.maxAlignDiff > 2 ||
            overlaps.length > 0 ||
            !stepStates['50%'].hudText.startsWith('SCROLL //') ||
            restoredCheck.minOpacity < 0.98 ||
            restoredCheck.charsStuck ||
            pinReleaseJumpPx > 5 ||
            anyOverflowX ||
            scrollReRenders > 0 ||
            longTasks.length > 0 ||
            consoleErrors.length > 0
        ) {
            hasFailure = true
            console.error(`FAILURE on ${vp.name}:`, {
                row,
                overlaps,
                stepStates,
                restoredCheck,
                longTasks,
                consoleErrors,
            })
        }

        await context.close()
    }

    // 6. Role Switcher Verification (3 full transitions)
    console.log('\n--- Testing Role Switcher Cycles ---')
    const roleContext = await browser.newContext({
        viewport: { width: 1536, height: 735 },
        colorScheme: 'dark',
    })
    const { page: rolePage } = await setupPage(roleContext, 'dark')

    const roleReport = await rolePage.evaluate(async (validRoles) => {
        const el = document.querySelector('[data-testid="role-text"]')
        if (!el) return { transitions: [] }

        const transitions = []
        let lastSettledRole = el.textContent || ''
        let lastSettledStart = performance.now()
        let scrambleStart = null

        return await new Promise((resolve) => {
            const check = () => {
                const now = performance.now()
                const txt = el.textContent || ''
                const isSettled = validRoles.includes(txt)

                if (!isSettled && scrambleStart === null) {
                    scrambleStart = now
                    const holdDurationSec = (now - lastSettledStart) / 1000
                    transitions.push({
                        type: 'hold',
                        role: lastSettledRole,
                        durationSec: Number(holdDurationSec.toFixed(2)),
                    })
                } else if (isSettled && scrambleStart !== null && txt !== lastSettledRole) {
                    const scrambleDurationSec = (now - scrambleStart) / 1000
                    transitions.push({
                        type: 'scramble-complete',
                        from: lastSettledRole,
                        to: txt,
                        scrambleSec: Number(scrambleDurationSec.toFixed(2)),
                    })
                    lastSettledRole = txt
                    lastSettledStart = now
                    scrambleStart = null

                    const completed = transitions.filter((t) => t.type === 'scramble-complete')
                    if (completed.length >= 3) {
                        resolve({ transitions })
                        return
                    }
                }
                requestAnimationFrame(check)
            }
            requestAnimationFrame(check)
        })
    }, VALID_ROLES)

    console.log('Role Switcher Transitions:', roleReport.transitions)
    let seenFirstScramble = false
    for (const item of roleReport.transitions || []) {
        if (item.type === 'hold' && seenFirstScramble && item.durationSec < 2.5) {
            hasFailure = true
            console.error(`Role hold too short (< 2.5s):`, item)
        }
        if (item.type === 'scramble-complete') {
            seenFirstScramble = true
            if (item.scrambleSec > 0.72 || !VALID_ROLES.includes(item.to)) {
                hasFailure = true
                console.error(`Role scramble invalid:`, item)
            }
        }
    }

    await roleContext.close()
    await browser.close()

    console.log('\n=== SCROLL & PERFORMANCE SUMMARY TABLE ===')
    console.table(summaryRows)

    if (hasFailure) {
        console.error('\n❌ ONE OR MORE CHECKS FAILED!')
        process.exit(1)
    } else {
        console.log('\n✅ ALL SCROLL, ALIGNMENT, RESTORATION & PERFORMANCE CHECKS PASSED!')
    }
}

runTests().catch((err) => {
    console.error('Test script error:', err)
    process.exit(1)
})
