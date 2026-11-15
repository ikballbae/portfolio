// Snapshot metrik layout desktop untuk memastikan desktop tidak berubah (dibandingkan sebelum/sesudah)
import { chromium } from 'playwright'
import fs from 'fs'
const out = process.argv[2] || 'desktop-baseline.json'
const b = await chromium.launch()
const res = {}
for (const [w, h] of [[1536, 735], [1920, 1080]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage()
    await p.route('**/*supabase.co/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))
    await p.goto('http://localhost:3000/?load=0', { waitUntil: 'load' })
    await p.waitForTimeout(1800)
    res[`${w}x${h}`] = await p.evaluate(() => {
        const ids = ['hero-badge', 'hero-headline', 'headline-line-1', 'headline-line-2', 'headline-line-3', 'hero-role', 'hero-subtext', 'cta-primary', 'cta-secondary', 'hero-avatar', 'bg-ikbal', 'hud-top-left', 'scroll-indicator']
        const o = {}
        for (const id of ids) {
            const el = document.querySelector(`[data-testid="${id}"]`)
            const r = el.getBoundingClientRect()
            const cs = getComputedStyle(el)
            o[id] = [r.left, r.top, r.width, r.height].map((v) => Math.round(v)).join(',') + ` fs=${cs.fontSize} op=${cs.opacity}`
        }
        return o
    })
}
fs.writeFileSync(out, JSON.stringify(res, null, 1))
console.log(JSON.stringify(res, null, 1))
await b.close()

