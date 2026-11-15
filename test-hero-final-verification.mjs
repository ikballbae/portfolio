import { chromium } from 'playwright'
import fs from 'fs'

async function runTests() {
    console.log('--- Starting Playwright Verification ---')
    const browser = await chromium.launch({ headless: true })
    const results = {
        mobile360: {},
        iphone14: {},
        desktop: {},
        checks: []
    }

    if (!fs.existsSync('test-screenshots')) {
        fs.mkdirSync('test-screenshots', { recursive: true })
    }

    // 1. Mobile 360px check (Smallest standard mobile viewport)
    console.log('\nTesting 360px Viewport...')
    const ctx360 = await browser.newContext({
        viewport: { width: 360, height: 640 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2
    })
    const page360 = await ctx360.newPage()
    await page360.goto('http://127.0.0.1:3000?load=0', { waitUntil: 'networkidle' })
    await page360.waitForTimeout(1000)

    const overflow360 = await page360.evaluate(() => {
        return {
            bodyScrollWidth: document.body.scrollWidth,
            windowInnerWidth: window.innerWidth,
            hasHScroll: document.body.scrollWidth > window.innerWidth
        }
    })
    console.log('360px Overflow Check:', overflow360)
    results.mobile360.overflow = overflow360

    await page360.screenshot({ path: 'test-screenshots/mobile-360-viewport.png' })
    await ctx360.close()

    // 2. iPhone 14 Viewport (390 x 844)
    console.log('\nTesting iPhone 14 Viewport...')
    const ctxMobile = await browser.newContext({
        viewport: { width: 390, height: 664 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 3
    })
    const page = await ctxMobile.newPage()
    await page.goto('http://127.0.0.1:3000?load=0', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)

    // Capture screenshot right after entrance
    await page.screenshot({ path: 'test-screenshots/iphone14-entrance.png' })

    // Wait until 4s for idle state
    await page.waitForTimeout(3000)
    await page.screenshot({ path: 'test-screenshots/iphone14-idle-4s.png' })

    const mobileAudit = await page.evaluate(() => {
        const hero = document.getElementById('hero')
        const roleEl = document.querySelector('[data-testid="mobile-role"]')
        const headlineBox = document.querySelector('[data-testid="mobile-headline-box"]')
        const line1 = headlineBox?.querySelector('.mobile-stmt-verb')
        const line2 = headlineBox?.querySelector('.mobile-stmt-kw')
        const lineMasks = headlineBox?.querySelectorAll('.hl-line-mask')
        const subtext = document.querySelector('[data-testid="mobile-subtext"]')
        const primaryCta = document.querySelector('[data-testid="mobile-cta-primary"]')
        const secondaryCta = document.querySelector('[data-testid="mobile-cta-secondary"]')
        const badge = document.querySelector('[data-testid="mobile-badge"]')

        // Check for removed elements
        const progressBars = document.querySelectorAll('[data-testid^="mobile-prog-"]')
        const divider = document.querySelector('.mobile-divider, [style*="border-bottom"], [style*="height: 1px"]')
        const customCursor = document.querySelector('canvas[class*="z-[9998]"]')
        const cursorRing = document.querySelector('div[class*="z-[9999]"]')
        const cursorDot = document.querySelector('div[class*="z-[10000]"]')
        const mobileOrb = hero?.querySelector('div[style*="radial-gradient"][style*="blur(32px)"]')

        // Check for forbidden text
        const heroText = hero ? hero.innerText : ''
        const hasTechLeader = heroText.includes('Tech Leader') || heroText.includes('TECH LEADER')
        const hasLeadCommunities = heroText.includes('Communities') || heroText.includes('I Lead')

        // Distances & Bounding Boxes
        const roleRect = roleEl?.getBoundingClientRect()
        const headlineRect = headlineBox?.getBoundingClientRect()
        const line2Rect = line2?.getBoundingClientRect()
        const subtextRect = subtext?.getBoundingClientRect()

        const gapRoleHeadline = headlineRect && roleRect ? (headlineRect.top - roleRect.bottom) : null
        const gapHeadlineSubtext = subtextRect && headlineRect ? (subtextRect.top - headlineRect.bottom) : null

        // Check descender mask styles
        const maskStyles = Array.from(lineMasks || []).map(m => {
            const cs = window.getComputedStyle(m)
            return {
                overflow: cs.overflow,
                paddingBottom: cs.paddingBottom,
                marginBottom: cs.marginBottom
            }
        })

        // Check chars computed styles
        const chars = Array.from(headlineBox?.querySelectorAll('.hl-char') || []).map(c => {
            const cs = window.getComputedStyle(c)
            return {
                opacity: cs.opacity,
                transform: cs.transform,
                color: cs.color,
                stroke: cs.webkitTextStroke
            }
        })

        return {
            roleText: roleEl?.innerText.trim(),
            line1Text: line1?.innerText.trim(),
            line2Text: line2?.innerText.trim(),
            line2Width: line2Rect?.width,
            gapRoleHeadline,
            gapHeadlineSubtext,
            hasProgressBars: progressBars.length > 0,
            hasCustomCursor: !!(customCursor || cursorRing || cursorDot),
            hasMobileOrb: !!mobileOrb,
            hasTechLeader,
            hasLeadCommunities,
            maskStyles,
            allCharsSolid: chars.every(c => c.opacity === '1' && (c.transform === 'none' || c.transform === 'matrix(1, 0, 0, 1, 0, 0)')),
            totalChars: chars.length
        }
    })

    console.log('\niPhone 14 Audit Results:', mobileAudit)
    results.iphone14 = mobileAudit
    await ctxMobile.close()

    // 3. Desktop Viewport (1536 x 864)
    console.log('\nTesting Desktop Viewport...')
    const ctxDesktop = await browser.newContext({
        viewport: { width: 1536, height: 864 },
        isMobile: false,
        hasTouch: false
    })
    const pageDesk = await ctxDesktop.newPage()
    await pageDesk.goto('http://127.0.0.1:3000?load=0', { waitUntil: 'networkidle' })
    await pageDesk.waitForTimeout(2000)

    await pageDesk.screenshot({ path: 'test-screenshots/desktop-1536.png' })

    const desktopAudit = await pageDesk.evaluate(() => {
        const hero = document.getElementById('hero')
        const headline = document.querySelector('[data-testid="hero-headline"]')
        const line1 = document.querySelector('[data-testid="headline-line-1"]')
        const line2 = document.querySelector('[data-testid="headline-line-2"]')
        const line3 = document.querySelector('[data-testid="headline-line-3"]')
        const role = document.querySelector('[data-testid="hero-role"]')
        const avatar = document.querySelector('[data-testid="hero-avatar"]')

        const heroText = hero ? hero.innerText : ''
        const hasTechLeader = heroText.includes('Tech Leader') || heroText.includes('TECH LEADER')

        return {
            line1Text: line1?.innerText.trim(),
            line2Text: line2?.innerText.trim(),
            hasLine3: !!line3,
            roleText: role?.innerText.trim(),
            hasAvatar: !!avatar,
            hasTechLeader,
            headlineFontSize: window.getComputedStyle(headline).fontSize
        }
    })

    console.log('\nDesktop Audit Results:', desktopAudit)
    results.desktop = desktopAudit
    await ctxDesktop.close()

    await browser.close()
    fs.writeFileSync('test-hero-audit-results.json', JSON.stringify(results, null, 2))
    console.log('\nVerification Completed! Results saved to test-hero-audit-results.json')
}

runTests().catch(err => {
    console.error('Test execution failed:', err)
    process.exit(1)
})

