import { webkit } from 'playwright'
import fs from 'fs'
import path from 'path'

const OUT_DIR = path.resolve('test-screenshots/mobile-density-v2')
fs.mkdirSync(OUT_DIR, { recursive: true })

const VIEWPORTS = [
    { name: 'iPhone-14', width: 390, height: 664 },
    { name: 'iPhone-SE', width: 375, height: 548 },
    { name: 'iPhone-15-Pro-Max', width: 430, height: 740 },
]

const SCROLL_POSITIONS = [0, 80, 160, 320]

async function runTests() {
    const browser = await webkit.launch()
    const results = {}

    for (const vp of VIEWPORTS) {
        const context = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            isMobile: true,
            hasTouch: true,
            colorScheme: 'dark',
        })
        const page = await context.newPage()

        const consoleErrors = []
        page.on('console', (msg) => {
            if (msg.type() === 'error') consoleErrors.push(msg.text())
        })
        page.on('pageerror', (err) => {
            consoleErrors.push(err.message)
        })

        await page.route('**/*supabase.co/**', (r) =>
            r.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
        )

        await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
        await page.goto('http://localhost:3000/?load=0', { waitUntil: 'load' })
        await page.waitForFunction(
            () => {
                const main = document.querySelector('main')
                if (!main) return false
                const cs = getComputedStyle(main)
                return (
                    cs.visibility === 'visible' &&
                    parseFloat(cs.opacity) >= 0.99 &&
                    document.querySelectorAll('.hl-char').length === 52
                )
            },
            { timeout: 10000 }
        )
        await page.waitForTimeout(500)

        const screenshots = {}
        const logoCleanAtScrolls = {}

        for (const scrollY of SCROLL_POSITIONS) {
            await page.evaluate((y) => window.scrollTo(0, y), scrollY)
            await page.waitForTimeout(300)

            const shotPath = path.join(OUT_DIR, `${vp.name}-${vp.width}x${vp.height}-scroll${scrollY}.png`)
            await page.screenshot({ path: shotPath })
            screenshots[`scroll${scrollY}`] = shotPath

            // Cek kebersihan area logo di scroll 80, 160, 320
            if (scrollY > 0) {
                const logoEval = await page.evaluate(() => {
                    const nav = document.querySelector('[data-testid="navbar"]')
                    const logo = nav ? nav.querySelector('a[href="/"]') : null
                    if (!logo) return { hasLogo: false }
                    const r = logo.getBoundingClientRect()
                    const navCs = getComputedStyle(nav)

                    // Cek apakah ada elemen headline yang berada di atas navbar
                    const hl = document.querySelector('[data-testid="hero-headline"]')
                    const hlRect = hl ? hl.getBoundingClientRect() : null

                    // Ambil elemen di titik tengah logo
                    const elAtLogoCenter = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
                    const elIsInsideNav = nav.contains(elAtLogoCenter)

                    return {
                        hasLogo: true,
                        navIsScrolledClass: nav.classList.contains('is-scrolled'),
                        navBg: navCs.backgroundColor,
                        navBackdrop: navCs.backdropFilter || navCs.webkitBackdropFilter,
                        navBorderBottom: navCs.borderBottomColor,
                        logoRect: { top: r.top, bottom: r.bottom, left: r.left, right: r.right },
                        hlRect: hlRect ? { top: hlRect.top, bottom: hlRect.bottom } : null,
                        elAtLogoCenterTag: elAtLogoCenter ? elAtLogoCenter.tagName : null,
                        elIsInsideNav,
                    }
                })
                logoCleanAtScrolls[`scroll${scrollY}`] = logoEval
            }
        }

        // Kembali ke scroll 0 untuk evaluasi metrik layout awal
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.waitForTimeout(300)

        const metrics0 = await page.evaluate(() => {
            const vw = window.innerWidth
            const vh = window.innerHeight

            const rectOf = (sel) => {
                const el = document.querySelector(sel)
                if (!el) return null
                const cs = getComputedStyle(el)
                if (cs.display === 'none' || cs.visibility === 'hidden') return null
                const r = el.getBoundingClientRect()
                return {
                    top: Number(r.top.toFixed(2)),
                    bottom: Number(r.bottom.toFixed(2)),
                    left: Number(r.left.toFixed(2)),
                    right: Number(r.right.toFixed(2)),
                    width: Number(r.width.toFixed(2)),
                    height: Number(r.height.toFixed(2)),
                }
            }

            const inViewport = (r) =>
                r !== null && r.top >= -0.5 && r.bottom <= vh + 0.5 && r.left >= -0.5 && r.right <= vw + 0.5

            const nav = rectOf('nav')
            const badge = rectOf('[data-testid="hero-badge"]')
            const headline = rectOf('[data-testid="hero-headline"]')
            const avatar = rectOf('[data-testid="hero-avatar"]')
            const role = rectOf('[data-testid="hero-role"]')
            const subtext = rectOf('[data-testid="hero-subtext"]')
            const ctaPrimary = rectOf('[data-testid="cta-primary"]')
            const ctaSecondary = rectOf('[data-testid="cta-secondary"]')
            const scrollCue = rectOf('[data-testid="hero-scroll-cue"]')

            // Hitung jarak vertikal antar elemen berurutan
            const gaps = {
                badgeToHeadline: headline && badge ? Number((headline.top - badge.bottom).toFixed(2)) : null,
                headlineToRole: role && headline ? Number((role.top - headline.bottom).toFixed(2)) : null,
                roleToSubtext: subtext && role ? Number((subtext.top - role.bottom).toFixed(2)) : null,
                subtextToCtaPrimary: ctaPrimary && subtext ? Number((ctaPrimary.top - subtext.bottom).toFixed(2)) : null,
                ctaPrimaryToSecondary: ctaSecondary && ctaPrimary ? Number((ctaSecondary.top - ctaPrimary.bottom).toFixed(2)) : null,
            }

            const allGapsUnder40 = Object.values(gaps).every((g) => g !== null && g <= 40)

            // Cek apakah ada elemen orb di tengah halaman (mobile orb)
            const mobileOrb = document.querySelector('[data-testid="hero-orb-mobile-1"]')
            const block2 = document.querySelector('[data-testid="hero-block-2"]')

            const csSubtext = subtext ? getComputedStyle(document.querySelector('[data-testid="hero-subtext"]')) : null
            const csHeadline = headline ? getComputedStyle(document.querySelector('[data-testid="hero-headline"]')) : null
            const csRole = role ? getComputedStyle(document.querySelector('[data-testid="hero-role"]')) : null

            return {
                vw,
                vh,
                rects: { nav, badge, headline, avatar, role, subtext, ctaPrimary, ctaSecondary, scrollCue },
                gaps,
                allGapsUnder40,
                hasMobileOrb: !!mobileOrb,
                hasBlock2: !!block2,
                visibilityAt0: {
                    headlineInViewport: inViewport(headline),
                    roleInViewport: inViewport(role),
                    subtextInViewport: inViewport(subtext),
                    ctaPrimaryInViewport: inViewport(ctaPrimary),
                    ctaPrimaryTopVisible: ctaPrimary ? ctaPrimary.top < vh : false,
                },
                computedStyles: {
                    hlFontSize: csHeadline ? csHeadline.fontSize : null,
                    hlLineHeight: csHeadline ? csHeadline.lineHeight : null,
                    roleFontSize: csRole ? csRole.fontSize : null,
                    subtextFontSize: csSubtext ? csSubtext.fontSize : null,
                    subtextLineHeight: csSubtext ? csSubtext.lineHeight : null,
                    subtextMaxWidth: csSubtext ? csSubtext.maxWidth : null,
                    ctaPrimaryHeight: ctaPrimary ? ctaPrimary.height : null,
                    ctaSecondaryHeight: ctaSecondary ? ctaSecondary.height : null,
                },
                overflowX: document.documentElement.scrollWidth > window.innerWidth,
            }
        })

        results[vp.name] = {
            ...metrics0,
            screenshots,
            logoCleanAtScrolls,
            consoleErrors,
        }

        await context.close()
    }

    await browser.close()
    console.log(JSON.stringify(results, null, 2))
}

runTests().catch((err) => {
    console.error(err)
    process.exit(1)
})

