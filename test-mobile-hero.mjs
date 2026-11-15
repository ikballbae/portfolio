import { webkit } from 'playwright'
import fs from 'fs'

const devices = [
    { name: 'iphone-14', width: 390, height: 664, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
    { name: 'iphone-se', width: 375, height: 548, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
    { name: 'iphone-15-promax', width: 430, height: 740, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
]

if (!fs.existsSync('mobile-test-results')) {
    fs.mkdirSync('mobile-test-results')
}

const browser = await webkit.launch({ headless: true })
const report = { timestamp: new Date().toISOString(), devices: {} }

for (const dev of devices) {
    console.log(`\n=== Testing ${dev.name} (${dev.width}x${dev.height}) ===`)
    const context = await browser.newContext({
        viewport: { width: dev.width, height: dev.height },
        userAgent: dev.userAgent,
        hasTouch: true,
        isMobile: true,
    })

    const downloadedImages = []
    const page = await context.newPage()
    page.on('request', req => {
        const url = req.url()
        if (url.includes('/mascots/')) {
            downloadedImages.push(url)
        }
    })
    await page.route('**/*supabase.co/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))

    // 1. ENTRANCE STAGES SCREENSHOTS
    console.log('Capturing entrance stages...')
    const loadPromise = page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(300)
    await page.screenshot({ path: `mobile-test-results/${dev.name}-01-entrance-0.3s.png` })
    await page.waitForTimeout(500) // total 800ms
    await page.screenshot({ path: `mobile-test-results/${dev.name}-02-entrance-0.8s.png` })
    await page.waitForTimeout(700) // total 1500ms
    await page.screenshot({ path: `mobile-test-results/${dev.name}-03-entrance-1.5s.png` })
    await page.waitForTimeout(1500) // total 3000ms
    await page.screenshot({ path: `mobile-test-results/${dev.name}-04-entrance-3.0s.png` })
    await loadPromise

    // Verify avatar NOT in DOM & NOT downloaded
    const avatarEl = await page.$('[data-testid="hero-avatar"]')
    const scrollCueEl = await page.$('[data-testid="hero-scroll-cue"]')
    const avatarInDOM = avatarEl !== null
    const scrollCueInDOM = scrollCueEl !== null

    // 2. IDLE 8 SECONDS STABILITY
    console.log('Waiting for 8s idle stability...')
    await page.waitForTimeout(5000) // total ~8s from start

    const charMetrics = await page.evaluate(() => {
        const chars = Array.from(document.querySelectorAll('.hl-char'))
        const metrics = chars.map(c => {
            const cs = window.getComputedStyle(c)
            return {
                text: c.textContent,
                color: cs.color,
                opacity: cs.opacity,
                transform: cs.transform,
                webkitTextStroke: cs.webkitTextStroke || cs.textStroke,
                varT: c.style.getPropertyValue('--t')
            }
        })
        const nonSolid = metrics.filter(m => m.opacity !== '1' || m.varT !== '0')
        return {
            totalChars: chars.length,
            nonSolidCount: nonSolid.length,
            sampleSolid: metrics[0],
            sampleKw: metrics.find(m => m.text === 'S')
        }
    })

    // 3. TOUCH BLUEPRINT TEST ON LINE 2
    console.log('Testing touch blueprint on statement 2...')
    const line2 = await page.$('[data-testid="headline-line-2"]')
    let touchOutlineActive = false
    let touchResetSuccess = false

    if (line2) {
        const box = await line2.boundingBox()
        if (box) {
            const touchX = box.x + box.width * 0.4
            const touchY = box.y + box.height * 0.5

            // Pointer touch down
            await page.touchscreen.tap(touchX, touchY)
            // Dispatch pointerdown & pointermove specifically
            await page.evaluate(({ x, y }) => {
                const target = document.elementFromPoint(x, y) || document.getElementById('hero-headline')
                target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerType: 'touch' }))
            }, { x: touchX, y: touchY })

            await page.waitForTimeout(100)
            await page.screenshot({ path: `mobile-test-results/${dev.name}-05-touch-active.png` })

            touchOutlineActive = await page.evaluate(() => {
                const chars = Array.from(document.querySelectorAll('.hl-char'))
                return chars.some(c => {
                    const t = parseFloat(c.style.getPropertyValue('--t') || '0')
                    return t > 0.05
                })
            })

            // Release touch
            await page.evaluate(({ x, y }) => {
                window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: x, clientY: y, pointerType: 'touch' }))
            }, { x: touchX, y: touchY })

            // Wait 1.0s after release
            await page.waitForTimeout(1000)
            await page.screenshot({ path: `mobile-test-results/${dev.name}-06-touch-released.png` })

            touchResetSuccess = await page.evaluate(() => {
                const chars = Array.from(document.querySelectorAll('.hl-char'))
                return chars.every(c => {
                    const t = parseFloat(c.style.getPropertyValue('--t') || '0')
                    const cs = window.getComputedStyle(c)
                    return t === 0 && (cs.transform === 'none' || cs.transform === 'matrix(1, 0, 0, 1, 0, 0)')
                })
            })
        }
    }

    // 4. SCROLL TO 0, 80, 160, 320
    console.log('Testing scrolls at 0, 80, 160, 320...')
    const scrollResults = {}
    for (const s of [0, 80, 160, 320]) {
        await page.evaluate(y => window.scrollTo(0, y), s)
        await page.waitForTimeout(300)
        await page.screenshot({ path: `mobile-test-results/${dev.name}-07-scroll-${s}.png` })

        scrollResults[`scroll_${s}`] = await page.evaluate(() => {
            const html = document.documentElement
            const nav = document.querySelector('header')
            const navBox = nav ? nav.getBoundingClientRect() : null
            const hl = document.getElementById('hero-headline')
            const hlBox = hl ? hl.getBoundingClientRect() : null

            return {
                overflowX: html.scrollWidth > html.clientWidth,
                scrollWidth: html.scrollWidth,
                clientWidth: html.clientWidth,
                navBottom: navBox ? Math.round(navBox.bottom) : 0,
                headlineTop: hlBox ? Math.round(hlBox.top) : 0,
            }
        })
    }
    await page.evaluate(() => window.scrollTo(0, 0))

    // 5. FIVE ROLE CYCLES
    console.log('Monitoring 5 role cycles...')
    const roleHistory = []
    for (let c = 0; c < 5; c++) {
        const role = await page.waitForFunction(() => {
            const el = document.querySelector('[data-testid="role-text"]')
            const status = el?.getAttribute('data-role-status')
            if (status === 'holding') return el.textContent
            return null
        }, { timeout: 8000 }).catch(() => null)

        if (role) {
            const val = await role.jsonValue()
            if (!roleHistory.includes(val) || roleHistory[roleHistory.length - 1] !== val) {
                roleHistory.push(val)
            }
        }
        await page.waitForTimeout(1600)
    }

    report.devices[dev.name] = {
        viewport: `${dev.width}x${dev.height}`,
        avatarInDOM,
        scrollCueInDOM,
        downloadedImagesCount: downloadedImages.length,
        downloadedImages,
        charMetricsAt8s: charMetrics,
        touchBlueprint: {
            outlineActivated: touchOutlineActive,
            resetSolidAfter1s: touchResetSuccess
        },
        scrollResults,
        roleCyclesCaptured: roleHistory
    }

    await context.close()
}

await browser.close()
fs.writeFileSync('mobile-test-results/summary.json', JSON.stringify(report, null, 2))
console.log('\n=== MOBILE TEST REPORT ===')
console.log(JSON.stringify(report, null, 2))
