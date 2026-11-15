import { webkit } from 'playwright'
import fs from 'fs'
import path from 'path'

const OUT_DIR = path.resolve('test-screenshots/mobile-density')
fs.mkdirSync(OUT_DIR, { recursive: true })

const VIEWPORTS = [
    { name: 'iPhone-14', width: 390, height: 664 },
    { name: 'iPhone-SE', width: 375, height: 548 },
    { name: 'iPhone-15-Pro-Max', width: 430, height: 740 },
]

const EXPECTED_ROLES = ['Full-Stack Dev', 'UI/UX Designer', 'Tech Leader']

function rectsOverlap(a, b, eps = 0.5) {
    return !(
        a.right <= b.left + eps ||
        a.left >= b.right - eps ||
        a.bottom <= b.top + eps ||
        a.top >= b.bottom - eps
    )
}

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

        // Screenshot di scroll 0%
        const shot0 = path.join(OUT_DIR, `${vp.name}-${vp.width}x${vp.height}-scroll0.png`)
        await page.screenshot({ path: shot0 })

        // Evaluasi semua metrik di scroll 0%
        const metrics0 = await page.evaluate(() => {
            const vw = window.innerWidth
            const vh = window.innerHeight

            const rectOf = (sel) => {
                const el = document.querySelector(sel)
                if (!el) return null
                const cs = getComputedStyle(el)
                if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) {
                    return null
                }
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

            const intersectsViewport = (r) =>
                r !== null && r.bottom > 0.5 && r.top < vh - 0.5 && r.right > 0.5 && r.left < vw - 0.5

            const nav = rectOf('nav')
            const badge = rectOf('[data-testid="hero-badge"]')
            const headline = rectOf('[data-testid="hero-headline"]')
            const avatar = rectOf('[data-testid="hero-avatar"]')
            const role = rectOf('[data-testid="hero-role"]')
            const ctaPrimary = rectOf('[data-testid="cta-primary"]')
            const scrollCue = rectOf('[data-testid="hero-scroll-cue"]')

            // Elemen yang tidak boleh tampil di layar pertama
            const desktopSubtext = rectOf('[data-testid="hero-subtext"]')
            const desktopCta2 = rectOf('[data-testid="cta-secondary"]')
            const block2 = document.querySelector('[data-testid="hero-block-2"]')
            const block2Rect = block2 ? block2.getBoundingClientRect() : null
            const block2Subtext = document.querySelector('[data-testid="hero-subtext-block2"]')?.getBoundingClientRect()
            const block2Cta = document.querySelector('[data-testid="cta-secondary-block2"]')?.getBoundingClientRect()

            // Pernyataan headline
            const line1 = rectOf('[data-testid="headline-line-1"]')
            const line2 = rectOf('[data-testid="headline-line-2"]')
            const line3 = rectOf('[data-testid="headline-line-3"]')

            const hlEl = document.querySelector('[data-testid="hero-headline"]')
            const hlFontSize = parseFloat(getComputedStyle(hlEl).fontSize)

            const innerGaps = [1, 2, 3].map((idx) => {
                const lineEl = document.querySelector(`[data-testid="headline-line-${idx}"]`)
                const solid = lineEl.querySelector('.hl-solid').getBoundingClientRect()
                const kw = lineEl.querySelector('.hl-kw').getBoundingClientRect()
                return Number((kw.top - solid.bottom).toFixed(2))
            })

            const contentArea = document.querySelector('[data-testid="hero-content-area"]')
            const csContent = getComputedStyle(contentArea)

            const badgeEl = document.querySelector('[data-testid="hero-badge"]')
            const csBadge = getComputedStyle(badgeEl)

            const solidEl = document.querySelector('.hl-line > .hl-solid')
            const csSolid = getComputedStyle(solidEl)
            const kwEl = document.querySelector('.hl-line > .hl-kw')
            const csKw = getComputedStyle(kwEl)

            const ctaEl = document.querySelector('[data-testid="cta-primary"]')
            const csCta = getComputedStyle(ctaEl)

            const cueEl = document.querySelector('[data-testid="hero-scroll-cue"]')
            const cueText = cueEl ? cueEl.textContent.trim() : ''

            // Cek tabrakan karakter headline dengan avatar
            const chars = Array.from(hlEl.querySelectorAll('.hl-char'))
            let avatarCharCollisions = 0
            for (const c of chars) {
                const cr = c.getBoundingClientRect()
                if (
                    !(
                        cr.right <= avatar.left ||
                        cr.left >= avatar.right ||
                        cr.bottom <= avatar.top ||
                        cr.top >= avatar.bottom
                    )
                ) {
                    avatarCharCollisions++
                }
            }

            const hlCenterRatio = Number((((headline.top + headline.bottom) / 2 / vh) * 100).toFixed(1))
            const hlHeightRatio = Number(((headline.height / vh) * 100).toFixed(1))

            return {
                vw,
                vh,
                rects: { nav, badge, headline, avatar, role, ctaPrimary, scrollCue, line1, line2, line3 },
                sixInViewport: {
                    nav: inViewport(nav),
                    badge: inViewport(badge),
                    headline: inViewport(headline),
                    avatar: inViewport(avatar),
                    role: inViewport(role),
                    ctaPrimary: inViewport(ctaPrimary),
                },
                excludedFromViewport1: {
                    desktopSubtextVisible: intersectsViewport(desktopSubtext),
                    desktopCta2Visible: intersectsViewport(desktopCta2),
                    block2SubtextInViewport:
                        block2Subtext ? block2Subtext.top < vh && block2Subtext.bottom > 0 : false,
                    block2CtaInViewport: block2Cta ? block2Cta.top < vh && block2Cta.bottom > 0 : false,
                    block2Top: block2Rect ? Number(block2Rect.top.toFixed(2)) : null,
                },
                gaps: {
                    navToBadgeCssPx: parseFloat(csContent.paddingTop),
                    navToBadgeRenderedPx: Number((badge.top - nav.bottom).toFixed(2)),
                    badgeToHeadlinePx: Number((headline.top - badge.bottom).toFixed(2)),
                    stmt1To2Px: Number((line2.top - line1.bottom).toFixed(2)),
                    stmt2To3Px: Number((line3.top - line2.bottom).toFixed(2)),
                    expectedStmtGapPx: Number((0.6 * hlFontSize).toFixed(2)),
                    innerStmtGapsPx: innerGaps,
                    headlineToRolePx: Number((role.top - headline.bottom).toFixed(2)),
                    roleToCtaPx: Number((ctaPrimary.top - role.bottom).toFixed(2)),
                    paddingBottomPx: parseFloat(csContent.paddingBottom),
                },
                headlineRatios: {
                    hlFontSize: Number(hlFontSize.toFixed(2)),
                    hlCenterPct: hlCenterRatio,
                    hlHeightPct: hlHeightRatio,
                },
                styles: {
                    badgeHeight: badge.height,
                    badgeFontPx: parseFloat(csBadge.fontSize),
                    verbOpacity: parseFloat(csSolid.opacity),
                    verbWeight: csSolid.fontWeight,
                    kwWeight: csKw.fontWeight,
                    ctaHeight: ctaPrimary.height,
                    ctaWidth: ctaPrimary.width,
                    ctaRadiusPx: parseFloat(csCta.borderRadius),
                    cueText,
                },
                avatarCharCollisions,
                overflowX: document.documentElement.scrollWidth > window.innerWidth,
            }
        })

        // Cek tabrakan antar elemen utama di Layar 1
        const r = metrics0.rects
        const mainPairs = [
            ['nav', r.nav, 'badge', r.badge],
            ['badge', r.badge, 'headline', r.headline],
            ['badge', r.badge, 'avatar', r.avatar],
            ['headline', r.headline, 'role', r.role],
            ['avatar', r.avatar, 'role', r.role],
            ['role', r.role, 'ctaPrimary', r.ctaPrimary],
            ['ctaPrimary', r.ctaPrimary, 'scrollCue', r.scrollCue],
        ]
        const overlaps = []
        for (const [n1, b1, n2, b2] of mainPairs) {
            if (b1 && b2 && rectsOverlap(b1, b2)) {
                overlaps.push(`${n1} overlaps ${n2}`)
            }
        }

        // Scroll ke Blok Kedua dan ambil screenshot saat terlihat penuh
        await page.evaluate(() => {
            const b2 = document.querySelector('[data-testid="hero-block-2"]')
            if (b2) {
                b2.scrollIntoView({ behavior: 'instant', block: 'center' })
            }
        })
        await page.waitForTimeout(900)

        const block2State = await page.evaluate(() => {
            const sub = document.querySelector('[data-testid="hero-subtext-block2"]')
            const btn = document.querySelector('[data-testid="cta-secondary-block2"]')
            const csSub = getComputedStyle(sub)
            const csBtn = getComputedStyle(btn)
            const rSub = sub.getBoundingClientRect()
            const rBtn = btn.getBoundingClientRect()
            return {
                subOpacity: parseFloat(csSub.opacity),
                btnOpacity: parseFloat(csBtn.opacity),
                subInViewport: rSub.top >= 0 && rSub.bottom <= window.innerHeight,
                btnInViewport: rBtn.top >= 0 && rBtn.bottom <= window.innerHeight,
            }
        })

        const shotBlock2 = path.join(OUT_DIR, `${vp.name}-${vp.width}x${vp.height}-block2.png`)
        await page.screenshot({ path: shotBlock2 })

        results[vp.name] = {
            ...metrics0,
            overlaps,
            block2State,
            consoleErrors,
            screenshots: { shot0, shotBlock2 },
        }

        await context.close()
    }

    // Uji Role Switcher: 5 siklus penuh + tahan 3 detik di tiap siklus (di WebKit iPhone 14)
    {
        const context = await browser.newContext({
            viewport: { width: 390, height: 664 },
            isMobile: true,
            hasTouch: true,
            colorScheme: 'dark',
        })
        const page = await context.newPage()
        await page.route('**/*supabase.co/**', (r) =>
            r.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
        )
        await page.goto('http://localhost:3000/?load=0', { waitUntil: 'load' })
        await page.waitForFunction(() => {
            const main = document.querySelector('main')
            return (
                main &&
                getComputedStyle(main).visibility === 'visible' &&
                document.querySelector('[data-testid="role-text"]') !== null
            )
        })

        const roleCycles = []
        for (let cycle = 1; cycle <= 5; cycle++) {
            const expectedTarget = EXPECTED_ROLES[cycle % EXPECTED_ROLES.length]

            // Tunggu siklus ke-N selesai (data-role-cycle === String(cycle) dan status === 'holding')
            await page.waitForFunction(
                (c) => {
                    const el = document.querySelector('[data-testid="role-text"]')
                    return (
                        el &&
                        Number(el.getAttribute('data-role-cycle')) >= c &&
                        el.getAttribute('data-role-status') === 'holding'
                    )
                },
                cycle,
                { timeout: 10000 }
            )

            const at0s = await page.evaluate(() => {
                const el = document.querySelector('[data-testid="role-text"]')
                const roleBox = document.querySelector('[data-testid="hero-role"]').getBoundingClientRect()
                return { text: el.textContent, width: Number(roleBox.width.toFixed(2)) }
            })

            // Tunggu 3.0 detik (3000ms) dan ambil textContent lagi
            await page.waitForTimeout(3000)

            const at3s = await page.evaluate(() => {
                const el = document.querySelector('[data-testid="role-text"]')
                const roleBox = document.querySelector('[data-testid="hero-role"]').getBoundingClientRect()
                return { text: el.textContent, width: Number(roleBox.width.toFixed(2)) }
            })

            roleCycles.push({
                cycle,
                expectedTarget,
                textAtCompletion: at0s.text,
                textAfter3sHold: at3s.text,
                widthAt0s: at0s.width,
                widthAt3s: at3s.width,
                matchAtCompletion: at0s.text === expectedTarget,
                matchAfter3sHold: at3s.text === expectedTarget,
            })
        }

        results.roleVerification = roleCycles
        await context.close()
    }

    await browser.close()
    console.log(JSON.stringify(results, null, 2))
}

runTests().catch((err) => {
    console.error(err)
    process.exit(1)
})
