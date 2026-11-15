import { webkit, chromium } from 'playwright'
import fs from 'fs'

const devices = [
    { name: 'iphone-14', width: 390, height: 664, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
    { name: 'iphone-se', width: 375, height: 548, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
    { name: 'iphone-15-promax', width: 430, height: 740, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
]

if (!fs.existsSync('mobile-focus-results')) {
    fs.mkdirSync('mobile-focus-results')
}

// Prefer webkit, fallback to chromium if webkit has issues
let browser
try {
    browser = await webkit.launch({ headless: true })
} catch (e) {
    console.log('WebKit launch failed, using Chromium:', e.message)
    browser = await chromium.launch({ headless: true })
}

const summary = { timestamp: new Date().toISOString(), devices: {} }

for (const dev of devices) {
    console.log(`\n========================================`)
    console.log(`Testing ${dev.name} (${dev.width}x${dev.height})`)
    console.log(`========================================`)

    const context = await browser.newContext({
        viewport: { width: dev.width, height: dev.height },
        userAgent: dev.userAgent,
        hasTouch: true,
        isMobile: true,
    })

    const downloadedMascots = []
    const page = await context.newPage()
    page.on('request', req => {
        const u = req.url()
        if (u.includes('/mascots/')) downloadedMascots.push(u)
    })
    await page.route('**/*supabase.co/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))

    // 1. Load Page with load=0 (instant entrance)
    await page.goto('http://localhost:3000/?load=0', { waitUntil: 'load' })
    await page.waitForTimeout(500)
    await page.screenshot({ path: `mobile-focus-results/${dev.name}-01-entrance.png` })

    // 2. Verify Avatar & Chevron NOT rendered on mobile
    const avatarEl = await page.$('.hero-avatar-box')
    const scrollChevronEl = await page.$('[data-testid="hero-scroll-cue"]')
    const avatarInDOM = avatarEl !== null
    const scrollChevronInDOM = scrollChevronEl !== null

    // 3. Inspect Mobile Container & Fit within Viewport
    const layoutMetrics = await page.evaluate(() => {
        const container = document.querySelector('[data-testid="mobile-hero-container"]')
        const badge = document.querySelector('[data-testid="mobile-badge"]')
        const role = document.querySelector('[data-testid="mobile-role"]')
        const hlBox = document.querySelector('[data-testid="mobile-headline-box"]')
        const subtext = document.querySelector('[data-testid="mobile-subtext"]')
        const ctaPrimary = document.querySelector('[data-testid="mobile-cta-primary"]')
        const ctaSecondary = document.querySelector('[data-testid="mobile-cta-secondary"]')
        const h1SrOnly = document.querySelector('h1.sr-only')

        const vpHeight = window.innerHeight
        const ctaSecRect = ctaSecondary ? ctaSecondary.getBoundingClientRect() : null
        const hlRect = hlBox ? hlBox.getBoundingClientRect() : null

        return {
            vpHeight,
            containerExists: !!container,
            badgeExists: !!badge,
            roleText: role ? role.textContent : '',
            subtextExists: !!subtext,
            ctaPrimaryExists: !!ctaPrimary,
            ctaSecondaryExists: !!ctaSecondary,
            h1Text: h1SrOnly ? h1SrOnly.textContent.trim() : '',
            headlineBoxHeight: hlRect ? Math.round(hlRect.height) : 0,
            ctaSecondaryBottom: ctaSecRect ? Math.round(ctaSecRect.bottom) : 0,
            allPointsFitInViewport: ctaSecRect ? ctaSecRect.bottom <= vpHeight + 20 : false,
        }
    })

    console.log(`Layout check: Role="${layoutMetrics.roleText}", HL Box Height=${layoutMetrics.headlineBoxHeight}px, Bottom CTA=${layoutMetrics.ctaSecondaryBottom}px / Viewport=${layoutMetrics.vpHeight}px`)

    // 4. Test 3.4s Auto-Cycle
    console.log('Testing auto-cycle (waiting 3.8s for transition to statement 2)...')
    await page.waitForTimeout(3800)
    await page.screenshot({ path: `mobile-focus-results/${dev.name}-02-cycle-stmt2.png` })

    const stmt2Role = await page.evaluate(() => {
        const role = document.querySelector('[data-testid="mobile-role"]')
        const activeBar1 = document.querySelector('[data-testid="mobile-prog-1"] div > div')
        return {
            roleText: role ? role.textContent : '',
            activeBar1Transform: activeBar1 ? activeBar1.style.transform : '',
        }
    })
    console.log(`After 3.8s: Role="${stmt2Role.roleText}"`)

    // 5. Test Manual Interaction: Tap on Progress Indicator 2 (Index 2 -> Statement 3)
    console.log('Testing tap on progress indicator 2 (Pernyataan 3)...')
    const progBtn2 = await page.$('[data-testid="mobile-prog-2"]')
    if (progBtn2) {
        await progBtn2.click()
    }
    await page.waitForTimeout(600)
    await page.screenshot({ path: `mobile-focus-results/${dev.name}-03-manual-tap-stmt3.png` })

    const stmt3State = await page.evaluate(() => {
        const role = document.querySelector('[data-testid="mobile-role"]')
        const activeProg2 = document.querySelector('[data-testid="mobile-prog-2"]')
        const bar2 = activeProg2 ? activeProg2.querySelector('div > div') : null
        const hlBox = document.querySelector('[data-testid="mobile-headline-box"]')
        const hlRect = hlBox ? hlBox.getBoundingClientRect() : null

        return {
            roleText: role ? role.textContent : '',
            ariaSelected: activeProg2 ? activeProg2.getAttribute('aria-selected') : '',
            bar2Transform: bar2 ? bar2.style.transform : '',
            headlineBoxHeight: hlRect ? Math.round(hlRect.height) : 0,
        }
    })
    console.log(`After manual tap: Role="${stmt3State.roleText}", Prog2 aria-selected="${stmt3State.ariaSelected}", Bar2 Transform="${stmt3State.bar2Transform}"`)

    // 6. Test Swipe Gesture on Headline Box
    console.log('Testing swipe gesture on headline box (to cycle next)...')
    const hlBoxEl = await page.$('[data-testid="mobile-headline-box"]')
    if (hlBoxEl) {
        const box = await hlBoxEl.boundingBox()
        if (box) {
            const startX = box.x + box.width * 0.8
            const endX = box.x + box.width * 0.2
            const startY = box.y + box.height * 0.5

            await page.mouse.move(startX, startY)
            await page.mouse.down()
            await page.mouse.move(endX, startY, { steps: 6 })
            await page.mouse.up()
        }
    }
    await page.waitForTimeout(600)
    await page.screenshot({ path: `mobile-focus-results/${dev.name}-04-after-swipe.png` })
    const roleAfterSwipe = await page.$eval('[data-testid="mobile-role"]', el => el.textContent)
    console.log(`After swipe: Role="${roleAfterSwipe}"`)

    // 7. Test Navbar Glass Blur on Scroll
    console.log('Testing navbar scroll blur...')
    await page.evaluate(() => window.scrollTo(0, 40))
    await page.waitForTimeout(300)
    const navGlassMetrics = await page.evaluate(() => {
        const nav = document.querySelector('nav')
        const cs = nav ? window.getComputedStyle(nav) : null
        return {
            hasIsScrolledClass: nav ? nav.classList.contains('is-scrolled') : false,
            backgroundColor: cs ? cs.backgroundColor : '',
            backdropFilter: cs ? (cs.backdropFilter || cs.webkitBackdropFilter) : '',
        }
    })
    await page.screenshot({ path: `mobile-focus-results/${dev.name}-05-scrolled-navbar.png` })
    await page.evaluate(() => window.scrollTo(0, 0))

    summary.devices[dev.name] = {
        viewport: `${dev.width}x${dev.height}`,
        avatarInDOM,
        scrollChevronInDOM,
        downloadedMascotsCount: downloadedMascots.length,
        layoutMetrics,
        stmt2AfterCycle: stmt2Role,
        stmt3AfterManualTap: stmt3State,
        navGlassMetrics,
    }

    await context.close()
}

await browser.close()
fs.writeFileSync('mobile-focus-results/summary.json', JSON.stringify(summary, null, 2))
console.log('\n=== MOBILE FOCUS REPORT SUMMARY ===')
console.log(JSON.stringify(summary, null, 2))
