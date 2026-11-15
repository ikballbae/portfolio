import { webkit } from 'playwright'
import fs from 'fs'
import path from 'path'

const SHOT_DIR = path.resolve('test-screenshots/iphone-validation')
fs.mkdirSync(SHOT_DIR, { recursive: true })

const TARGETS = [
    { name: 'iPhone-14', width: 390, height: 664 },
    { name: 'iPhone-SE', width: 375, height: 548 },
    { name: 'iPhone-15-Pro-Max', width: 430, height: 740 },
]

const ROLES = ['Full-Stack Dev', 'UI/UX Designer', 'Tech Leader']

async function testMobile() {
    console.log('=== RUNNING WEBKIT IPHONE VALIDATION ===')
    const browser = await webkit.launch()
    const results = []

    for (const t of TARGETS) {
        console.log(`\nTesting ${t.name} (${t.width}x${t.height})...`)
        const context = await browser.newContext({
            viewport: { width: t.width, height: t.height },
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

        // Mock external Supabase
        await page.route('**/*supabase.co/**', (r) =>
            r.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
        )

        await page.goto('http://localhost:3000/?load=0', { waitUntil: 'load' })
        await page.waitForTimeout(1000)

        // 1. Screenshot scroll 0%
        const shot0 = path.join(SHOT_DIR, `${t.name}-0pct.png`)
        await page.screenshot({ path: shot0 })
        console.log(`Saved screenshot 0%: ${shot0}`)

        // 2. Evaluasi metrik DOM di scroll 0%
        const metrics = await page.evaluate((tInfo) => {
            const vh = window.innerHeight
            const vw = window.innerWidth

            const nav = document.querySelector('nav')
            const badge = document.querySelector('[data-testid="hero-badge"]')
            const hl = document.querySelector('[data-testid="hero-headline"]')
            const l1 = document.querySelector('[data-testid="headline-line-1"]')
            const l2 = document.querySelector('[data-testid="headline-line-2"]')
            const l3 = document.querySelector('[data-testid="headline-line-3"]')
            const av = document.querySelector('[data-testid="hero-avatar"]')
            const role = document.querySelector('[data-testid="hero-role"]')
            const cta1 = document.querySelector('[data-testid="cta-primary"]')
            const subMobile = document.querySelector('[data-testid="hero-subtext-block2"]')
            const cta2Mobile = document.querySelector('[data-testid="cta-secondary-block2"]')
            const cue = document.querySelector('[data-testid="hero-scroll-cue"]')

            const R = (el) => el ? el.getBoundingClientRect() : null
            const navR = R(nav)
            const badgeR = R(badge)
            const hlR = R(hl)
            const l1R = R(l1)
            const l2R = R(l2)
            const l3R = R(l3)
            const avR = R(av)
            const roleR = R(role)
            const cta1R = R(cta1)
            const subMobileR = R(subMobile)
            const cta2MobileR = R(cta2Mobile)
            const cueR = R(cue)

            // Cek apakah elemen ada dalam layar (scroll 0%)
            const isInScreen = (r) => r && r.top < vh && r.bottom > 0 && r.left < vw && r.right > 0

            // 6 hal di layar pertama
            const initialElements = {
                navbar: isInScreen(navR),
                badge: isInScreen(badgeR),
                headline: isInScreen(hlR),
                avatar: isInScreen(avR),
                role: isInScreen(roleR),
                ctaPrimary: isInScreen(cta1R),
            }

            // Elemen yang dipindah ke blok 2 (TIDAK boleh di dalam viewport awal)
            const block2ElementsInInitialViewport = {
                subtextInInitial: isInScreen(subMobileR),
                ctaSecondaryInInitial: isInScreen(cta2MobileR),
            }

            // Jarak vertikal antar blok
            const navToBadge = badgeR.top - navR.bottom
            const badgeToHl = l1R.top - badgeR.bottom
            const l1ToL2 = l2R.top - l1R.bottom
            const l2ToL3 = l3R.top - l2R.bottom
            const hlToRole = roleR.top - hlR.bottom
            const roleToCta1 = cta1R.top - roleR.bottom

            // Posisi blok headline
            const hlCenter = hlR.top + hlR.height / 2
            const hlCenterPct = (hlCenter / vh) * 100
            const hlTopPct = (hlR.top / vh) * 100

            // Ukuran & style
            const cta1H = cta1R.height
            const cta1Bottom = cta1R.bottom
            const badgeH = badgeR.height
            const csBadgeSpan = getComputedStyle(badge.querySelector('span:last-child'))
            const badgeFs = csBadgeSpan.fontSize
            const csHl = getComputedStyle(hl)
            const hlFs = csHl.fontSize

            // Overlap check
            const rectsIntersect = (a, b, tol = 1) => {
                if (!a || !b) return false
                return !(
                    a.right <= b.left + tol ||
                    a.left >= b.right - tol ||
                    a.bottom <= b.top + tol ||
                    a.top >= b.bottom - tol
                )
            }

            // Avatar collision dengan karakter headline
            const chars = Array.from(hl.querySelectorAll('.hl-char'))
            let avCollision = 0
            for (const c of chars) {
                const cr = c.getBoundingClientRect()
                if (rectsIntersect(cr, avR)) {
                    avCollision++
                }
            }

            const overflowX = document.documentElement.scrollWidth > window.innerWidth

            return {
                vh,
                vw,
                initialElements,
                block2ElementsInInitialViewport,
                gaps: {
                    navToBadge,
                    badgeToHl,
                    l1ToL2,
                    l2ToL3,
                    hlToRole,
                    roleToCta1,
                },
                hlCenterPct,
                hlTopPct,
                cta1H,
                cta1Bottom,
                badgeH,
                badgeFs,
                hlFs,
                avCollision,
                overflowX,
                subMobileTop: subMobileR ? subMobileR.top : null,
                cta2MobileTop: cta2MobileR ? cta2MobileR.top : null,
            }
        }, t)

        // 3. Scroll ke Blok Kedua dan screenshot
        await page.evaluate(() => {
            const b2 = document.querySelector('#hero-block-2')
            if (b2) b2.scrollIntoView({ behavior: 'instant', block: 'center' })
        })
        await page.waitForTimeout(500)
        const shotB2 = path.join(SHOT_DIR, `${t.name}-block2-visible.png`)
        await page.screenshot({ path: shotB2 })
        console.log(`Saved screenshot Block 2: ${shotB2}`)

        // Periksa visibilitas blok 2 setelah scroll
        const block2Status = await page.evaluate(() => {
            const b2 = document.querySelector('#hero-block-2')
            const sub = document.querySelector('[data-testid="hero-subtext-block2"]')
            const cta2 = document.querySelector('[data-testid="cta-secondary-block2"]')
            const subOp = sub ? parseFloat(getComputedStyle(sub).opacity) : 0
            const cta2Op = cta2 ? parseFloat(getComputedStyle(cta2).opacity) : 0
            return {
                subVisible: subOp >= 0.9,
                cta2Visible: cta2Op >= 0.9,
                subOp,
                cta2Op,
            }
        })

        results.push({
            target: t.name,
            viewport: `${t.width}x${t.height}`,
            metrics,
            block2Status,
            consoleErrors,
        })

        await context.close()
    }

    // 4. Test Role Switcher 5 Cycles
    console.log('\n--- Testing Role Switcher 5 Complete Cycles ---')
    const roleContext = await browser.newContext({
        viewport: { width: 390, height: 664 },
        isMobile: true,
        hasTouch: true,
        colorScheme: 'dark',
    })
    const rolePage = await roleContext.newPage()
    await rolePage.route('**/*supabase.co/**', (r) =>
        r.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    )
    await rolePage.goto('http://localhost:3000/?load=0', { waitUntil: 'load' })

    const roleCycles = await rolePage.evaluate(async (expectedRoles) => {
        const el = document.querySelector('[data-testid="role-text"]')
        if (!el) return { error: 'role-text element not found' }

        const cycles = []
        let lastText = el.textContent.trim()
        let holdStartTime = performance.now()

        // Ambil 5 siklus transisi selesai
        while (cycles.length < 5) {
            await new Promise((resolve) => setTimeout(resolve, 100))
            const currentText = el.textContent.trim()
            if (expectedRoles.includes(currentText) && currentText !== lastText) {
                // Teks baru settled
                const now = performance.now()
                const holdDuration = (now - holdStartTime) / 1000
                cycles.push({
                    roleIndex: cycles.length,
                    role: currentText,
                    previousRole: lastText,
                    previousHoldDurationSec: Number(holdDuration.toFixed(2)),
                    timestamp: Math.round(now),
                })
                lastText = currentText
                holdStartTime = now
            }
        }
        return { cycles }
    }, ROLES)

    console.log('Role Cycles Captured:', JSON.stringify(roleCycles, null, 2))
    await roleContext.close()
    await browser.close()

    return { results, roleCycles }
}

testMobile()
    .then((out) => {
        fs.writeFileSync('mobile-iphone-results.json', JSON.stringify(out, null, 2))
        console.log('\nTest completed successfully. Results saved to mobile-iphone-results.json')
    })
    .catch((err) => {
        console.error('Test error:', err)
        process.exit(1)
    })
