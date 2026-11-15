import { webkit } from 'playwright'
import fs from 'fs'
import path from 'path'

const SHOT_DIR = path.resolve('test-screenshots/iphone-final')
fs.mkdirSync(SHOT_DIR, { recursive: true })

const TARGETS = [
    { name: 'iPhone-14', width: 390, height: 664 },
    { name: 'iPhone-SE', width: 375, height: 548 },
    { name: 'iPhone-15-Pro-Max', width: 430, height: 740 },
]

const EXPECTED_ROLES = ['Full-Stack Dev', 'UI/UX Designer', 'Tech Leader']

async function runValidation() {
    console.log('=== STARTING WEBKIT IPHONE FINAL VALIDATION ===\n')
    const browser = await webkit.launch()
    const reportData = []

    for (const t of TARGETS) {
        console.log(`Checking ${t.name} (${t.width}x${t.height})...`)
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

        await page.route('**/*supabase.co/**', (r) =>
            r.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
        )

        await page.goto('http://localhost:3000/?load=0', { waitUntil: 'load' })
        await page.waitForTimeout(600)

        // 1. Screenshot scroll 0%
        const shot0Path = path.join(SHOT_DIR, `${t.name}-0pct.png`)
        await page.screenshot({ path: shot0Path })
        console.log(`  -> Screenshot 0%: ${shot0Path}`)

        // 2. Evaluasi viewport awal
        const initialCheck = await page.evaluate((vp) => {
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
            const sub2 = document.querySelector('[data-testid="hero-subtext-block2"]')
            const cta2 = document.querySelector('[data-testid="cta-secondary-block2"]')

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
            const sub2R = R(sub2)
            const cta2R = R(cta2)

            const isBoxInViewport = (r) => {
                if (!r) return false
                return r.top < vh && r.bottom > 0 && r.left < vw && r.right > 0
            }

            // Daftar 6 elemen wajib di layar pertama
            const sixElements = [
                { name: 'Navbar', inViewport: isBoxInViewport(navR), rect: navR },
                { name: 'Badge', inViewport: isBoxInViewport(badgeR), rect: badgeR },
                { name: 'Headline (3 Pernyataan)', inViewport: isBoxInViewport(hlR), rect: hlR },
                { name: 'Avatar', inViewport: isBoxInViewport(avR), rect: avR },
                { name: 'Baris Role', inViewport: isBoxInViewport(roleR), rect: roleR },
                { name: 'Tombol Utama (View My Work)', inViewport: isBoxInViewport(cta1R), rect: cta1R },
            ]

            // Elemen blok kedua (TIDAK boleh di viewport awal)
            const block2InViewport = {
                subtextInViewport: isBoxInViewport(sub2R),
                cta2InViewport: isBoxInViewport(cta2R),
                sub2Top: sub2R ? Math.round(sub2R.top) : null,
                cta2Top: cta2R ? Math.round(cta2R.top) : null,
            }

            // Jarak vertikal antar blok
            const navToBadge = Math.round(badgeR.top - navR.bottom)
            const badgeToHl = Math.round(l1R.top - badgeR.bottom)
            const l1ToL2 = Math.round(l2R.top - l1R.bottom)
            const l2ToL3 = Math.round(l3R.top - l2R.bottom)
            const hlToRole = Math.round(roleR.top - hlR.bottom)
            const roleToCta1 = Math.round(cta1R.top - roleR.bottom)

            // Posisi blok headline
            const hlCenter = (hlR.top + hlR.height / 2)
            const hlCenterPct = Number(((hlCenter / vh) * 100).toFixed(1))

            // Tombol utama utuh
            const cta1FullyVisible = cta1R.top >= 0 && cta1R.bottom <= vh && Math.round(cta1R.height) === 52

            // Cek collision karakter vs avatar
            const chars = Array.from(hl.querySelectorAll('.hl-char'))
            const rectsIntersect = (a, b) => !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom)
            let avCollision = 0
            for (const c of chars) {
                if (rectsIntersect(c.getBoundingClientRect(), avR)) avCollision++
            }

            // Cek overflow horizontal
            const overflowX = document.documentElement.scrollWidth > window.innerWidth

            return {
                vh,
                vw,
                sixElements,
                block2InViewport,
                gaps: {
                    navToBadge,
                    badgeToHl,
                    l1ToL2,
                    l2ToL3,
                    hlToRole,
                    roleToCta1,
                },
                hlCenterPct,
                cta1FullyVisible,
                cta1Rect: { top: Math.round(cta1R.top), bottom: Math.round(cta1R.bottom), height: Math.round(cta1R.height) },
                badgeHeight: Math.round(badgeR.height),
                avCollision,
                overflowX,
            }
        }, t)

        // 3. Scroll ke Blok Kedua
        await page.evaluate(() => {
            const b2 = document.querySelector('#hero-block-2')
            if (b2) b2.scrollIntoView({ behavior: 'instant', block: 'center' })
        })
        await page.waitForTimeout(500)

        // Screenshot Blok Kedua
        const shotB2Path = path.join(SHOT_DIR, `${t.name}-block2-visible.png`)
        await page.screenshot({ path: shotB2Path })
        console.log(`  -> Screenshot Block 2: ${shotB2Path}`)

        const block2Check = await page.evaluate(() => {
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

        reportData.push({
            target: t.name,
            viewport: `${t.width}x${t.height}`,
            initialCheck,
            block2Check,
            consoleErrors,
        })

        await context.close()
    }

    // 4. Test Role Switcher 5 Cycles
    console.log('\nTesting Role Switcher (5 Cycles with >= 2.5s hold each)...')
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
    await rolePage.waitForTimeout(500)

    const recordedCycles = []
    let lastSeenText = ''
    let lastChangeTime = Date.now()

    // Poll text content outside evaluate loop to observe cycles
    const startTime = Date.now()
    while (recordedCycles.length < 5 && (Date.now() - startTime) < 30000) {
        await rolePage.waitForTimeout(200)
        const currentText = await rolePage.evaluate(() => {
            const el = document.querySelector('[data-testid="role-text"]')
            return el ? el.textContent.trim() : ''
        })

        if (EXPECTED_ROLES.includes(currentText) && currentText !== lastSeenText) {
            const now = Date.now()
            const holdSec = lastSeenText ? Number(((now - lastChangeTime) / 1000).toFixed(2)) : 0
            recordedCycles.push({
                cycle: recordedCycles.length + 1,
                role: currentText,
                heldPreviousSec: holdSec,
            })
            console.log(`  -> Cycle ${recordedCycles.length}: "${currentText}" (held previous: ${holdSec}s)`)
            lastSeenText = currentText
            lastChangeTime = now
        }
    }

    await roleContext.close()
    await browser.close()

    const finalReport = {
        targets: reportData,
        roleCycles: recordedCycles,
    }

    fs.writeFileSync('mobile-final-report.json', JSON.stringify(finalReport, null, 2))
    console.log('\n=== VALIDATION COMPLETED. Saved report to mobile-final-report.json ===')
    return finalReport
}

runValidation().catch((err) => {
    console.error('Validation failed:', err)
    process.exit(1)
})
