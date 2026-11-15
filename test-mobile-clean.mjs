// Uji komprehensif HERO MOBILE (< 768px) dengan engine WebKit & Chromium.
import { webkit, chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const DIR = path.resolve('test-screenshots/mobile-clean')
fs.mkdirSync(DIR, { recursive: true })

const TARGETS = [
    { name: 'iPhone-14-WebKit', browserType: 'webkit', width: 390, height: 664, isPhone390: true, foldCheck: true },
    { name: 'iPhone-15-Pro-Max-WebKit', browserType: 'webkit', width: 430, height: 740 },
    { name: 'iPhone-SE-WebKit', browserType: 'webkit', width: 375, height: 548 },
    { name: 'Chromium-360x740', browserType: 'chromium', width: 360, height: 740 },
]

async function runTest() {
    const report = []
    let allPassed = true

    for (const t of TARGETS) {
        const browserLauncher = t.browserType === 'webkit' ? webkit : chromium
        const browser = await browserLauncher.launch()

        for (const theme of ['dark', 'light']) {
            const context = await browser.newContext({
                viewport: { width: t.width, height: t.height },
                isMobile: true,
                hasTouch: true,
                colorScheme: theme,
            })
            const page = await context.newPage()

            const consoleErrors = []
            page.on('console', (msg) => {
                if (msg.type() === 'error') consoleErrors.push(msg.text())
            })
            page.on('pageerror', (err) => {
                consoleErrors.push(err.message)
            })

            // Mock external supabase if any
            await page.route('**/*supabase.co/**', (r) =>
                r.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
            )

            await page.addInitScript((th) => localStorage.setItem('theme', th), theme)
            await page.goto('http://localhost:3000/?load=0', { waitUntil: 'load' })
            await page.evaluate((th) => document.documentElement.setAttribute('data-theme', th), theme)

            // Tunggu SplitText selesai memecah karakter (52 karakter) & animasi entrance stabil
            await page.waitForFunction(() => document.querySelectorAll('.hl-char').length === 52, { timeout: 5000 })
            await page.waitForTimeout(500)

            // Screenshot 0%
            const shot0Path = path.join(DIR, `${t.name}-${theme}-0pct.png`)
            const shot0Buffer = await page.screenshot({ path: shot0Path })

            // Metrik DOM utama
            const domData = await page.evaluate(() => {
                const vw = window.innerWidth
                const vh = window.innerHeight
                const hl = document.querySelector('[data-testid="hero-headline"]')
                const csHl = getComputedStyle(hl)
                const hlFontSize = parseFloat(csHl.fontSize)

                // Elemen headline terlebar
                const hlElements = Array.from(hl.querySelectorAll('.hl-line, .hl-word, .hl-kw, .hl-solid'))
                let maxHlWidth = 0
                let widestText = ''
                for (const el of hlElements) {
                    const r = el.getBoundingClientRect()
                    if (r.width > maxHlWidth) {
                        maxHlWidth = r.width
                        widestText = el.textContent.trim()
                    }
                }
                const widestRatio = maxHlWidth / vw

                // Avatar bounding box & Headline characters collision
                const avEl = document.querySelector('[data-testid="hero-avatar"]')
                const avRect = avEl.getBoundingClientRect()
                const chars = Array.from(hl.querySelectorAll('.hl-char'))

                let collisionCount = 0
                const collidingChars = []
                for (const c of chars) {
                    const cr = c.getBoundingClientRect()
                    // Check intersection
                    const intersects = !(
                        cr.right <= avRect.left ||
                        cr.left >= avRect.right ||
                        cr.bottom <= avRect.top ||
                        cr.top >= avRect.bottom
                    )
                    if (intersects) {
                        collisionCount++
                        collidingChars.push({ text: c.textContent, charRect: cr, avRect })
                    }
                }

                // CTA utama terlihat tanpa scroll
                const cta1 = document.querySelector('[data-testid="cta-primary"]')
                const cta1Rect = cta1.getBoundingClientRect()

                // Horizontal overflow
                const overflowX = document.documentElement.scrollWidth > window.innerWidth

                // Karakter headline: warna penuh dan opacity 1 saat diam
                let nonSolidCharCount = 0
                for (const c of chars) {
                    const cs = getComputedStyle(c)
                    const op = parseFloat(cs.opacity)
                    const tVar = cs.getPropertyValue('--t').trim()
                    if (op < 0.99 || tVar === '1') {
                        nonSolidCharCount++
                    }
                }

                // Periksa elemen tersembunyi
                const hudStatus = document.querySelector('[data-testid="hud-mobile-status"]')
                const hudHidden = !hudStatus || getComputedStyle(hudStatus).display === 'none'
                const scrollInd = document.querySelector('[data-testid="scroll-indicator-wrapper"]')
                const scrollIndHidden = !scrollInd || getComputedStyle(scrollInd).display === 'none'

                return {
                    vw,
                    vh,
                    hlFontSize,
                    maxHlWidth,
                    widestRatio,
                    widestText,
                    avRect: { left: avRect.left, top: avRect.top, width: avRect.width, height: avRect.height },
                    collisionCount,
                    collidingChars,
                    cta1Bottom: cta1Rect.bottom,
                    cta1Top: cta1Rect.top,
                    cta1Height: cta1Rect.height,
                    overflowX,
                    nonSolidCharCount,
                    totalChars: chars.length,
                    hudHidden,
                    scrollIndHidden,
                }
            })

            // Luminansi latar: ambil sampel dari lapisan latar murni (tanpa teks/avatar) di 5 titik X, 4 tinggi Y
            await page.evaluate(() => {
                const textCol = document.querySelector('.hero-text-col')
                const avatarCol = document.querySelector('.hero-avatar-col')
                if (textCol) textCol.style.visibility = 'hidden'
                if (avatarCol) avatarCol.style.visibility = 'hidden'
            })
            const bgBuffer = await page.locator('[data-testid="hero-bg-wrapper"]').screenshot()
            await page.evaluate(() => {
                const textCol = document.querySelector('.hero-text-col')
                const avatarCol = document.querySelector('.hero-avatar-col')
                if (textCol) textCol.style.visibility = 'visible'
                if (avatarCol) avatarCol.style.visibility = 'visible'
            })
            const luminanceData = await page.evaluate(async (base64) => {
                const img = new Image()
                img.src = 'data:image/png;base64,' + base64
                await new Promise((res) => {
                    img.onload = res
                })
                const canvas = document.createElement('canvas')
                canvas.width = img.width
                canvas.height = img.height
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0)

                const xFractions = [0.1, 0.3, 0.5, 0.7, 0.9]
                const yFractions = [0.2, 0.4, 0.6, 0.8]
                const xPoints = xFractions.map((f) => Math.round(f * img.width))
                const yPoints = yFractions.map((f) => Math.round(f * img.height))

                const rows = []
                let maxStepDiff = 0

                for (const y of yPoints) {
                    const rowLums = []
                    for (const x of xPoints) {
                        const px = ctx.getImageData(x, y, 1, 1).data
                        const lum = 0.2126 * px[0] + 0.7152 * px[1] + 0.0722 * px[2]
                        rowLums.push(+lum.toFixed(1))
                    }
                    for (let i = 0; i < rowLums.length - 1; i++) {
                        const diff = Math.abs(rowLums[i + 1] - rowLums[i])
                        if (diff > maxStepDiff) maxStepDiff = diff
                    }
                    rows.push(rowLums)
                }

                return { rows, maxStepDiff: +maxStepDiff.toFixed(1) }
            }, bgBuffer.toString('base64'))

            // Screenshot 50%
            const heroHeight = await page.evaluate(() => document.getElementById('hero').offsetHeight)
            await page.evaluate((y) => window.scrollTo(0, y), Math.round(heroHeight * 0.5))
            await page.waitForTimeout(400)
            const shot50Path = path.join(DIR, `${t.name}-${theme}-50pct.png`)
            await page.screenshot({ path: shot50Path })

            // Screenshot akhir hero (100%)
            await page.evaluate((y) => window.scrollTo(0, y), heroHeight)
            await page.waitForTimeout(400)
            const shot100Path = path.join(DIR, `${t.name}-${theme}-akhir-hero.png`)
            await page.screenshot({ path: shot100Path })

            // Evaluasi kriteria
            const passFontSize = t.isPhone390 ? domData.hlFontSize >= 36 && domData.hlFontSize <= 44 : true
            const passWidest = domData.widestRatio <= 0.72
            const passCollision = domData.collisionCount === 0
            const passFold = t.foldCheck ? domData.cta1Bottom <= t.height : true
            const passOverflow = !domData.overflowX
            const passLuminance = luminanceData.maxStepDiff <= 32 // gradien halus tanpa strip / garis keras
            const passSolidChars = domData.nonSolidCharCount === 0
            const passErrors = consoleErrors.length === 0

            const itemPassed =
                passFontSize &&
                passWidest &&
                passCollision &&
                passFold &&
                passOverflow &&
                passLuminance &&
                passSolidChars &&
                passErrors

            if (!itemPassed) allPassed = false

            report.push({
                target: `${t.name} (${theme})`,
                fontSize: `${domData.hlFontSize}px (target: 36-44px di 390)`,
                passFontSize,
                widestRatio: `${(domData.widestRatio * 100).toFixed(1)}% [${domData.widestText}] (target: <= 72%)`,
                passWidest,
                collisionCount: domData.collisionCount,
                passCollision,
                cta1Bottom: `${Math.round(domData.cta1Bottom)}px <= ${t.height}px`,
                passFold,
                overflowX: domData.overflowX,
                passOverflow,
                lumMaxDiff: `${luminanceData.maxStepDiff} (smooth)`,
                passLuminance,
                nonSolidChars: `${domData.nonSolidCharCount} / ${domData.totalChars}`,
                passSolidChars,
                errors: consoleErrors,
                passErrors,
                itemPassed,
            })

            await context.close()
        }
        await browser.close()
    }

    console.log(JSON.stringify({ allPassed, report }, null, 2))
    process.exit(allPassed ? 0 : 1)
}

runTest().catch((e) => {
    console.error(e)
    process.exit(1)
})
