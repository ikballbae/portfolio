// Uji polesan HERO ponsel (< 768px): komposisi avatar, headline, ritme, kontras, aturan tinggi layar.
import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const VIEWPORTS = [
    { name: '360x740', width: 360, height: 740 },
    { name: '390x680', width: 390, height: 680, foldRule: true }, // Safari dengan bar tampil
    { name: '390x844', width: 390, height: 844, foldRule: true },
    { name: '412x915', width: 412, height: 915 },
    { name: '430x932', width: 430, height: 932 },
    { name: '844x390', width: 844, height: 390, landscape: true },
]
const DIR = path.resolve('test-screenshots/mobile-polish')
fs.mkdirSync(DIR, { recursive: true })

async function open(browser, vp, theme) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: true, hasTouch: true, colorScheme: theme })
    const page = await ctx.newPage()
    await page.route('**/*supabase.co/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))
    const errors = []
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    page.on('pageerror', (e) => errors.push(e.message))
    await page.addInitScript((t) => localStorage.setItem('theme', t), theme)
    await page.goto('http://localhost:3000/?load=0', { waitUntil: 'load' })
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme)
    await page.waitForFunction(() => {
        const cta = document.querySelector('[data-testid="hero-cta-group"]')
        return cta && parseFloat(getComputedStyle(cta).opacity) >= 0.99 && parseFloat(getComputedStyle(document.querySelector('main')).opacity) >= 0.99
    }, { timeout: 4000 })
    await page.waitForTimeout(300)
    return { ctx, page, errors }
}

const browser = await chromium.launch()
const rows = []
let fail = false

for (const vp of VIEWPORTS) {
    for (const theme of ['dark', 'light']) {
        const { ctx, page, errors } = await open(browser, vp, theme)
        const m = await page.evaluate(() => {
            const vw = innerWidth, vh = innerHeight
            const q = (id) => document.querySelector(`[data-testid="${id}"]`)
            const R = (el) => el.getBoundingClientRect()
            const hl = q('hero-headline'), l1 = q('headline-line-1')
            const av = R(q('hero-avatar')), badge = R(q('hero-badge')), role = R(q('hero-role'))
            const sub = q('hero-subtext'), subR = R(sub), c1 = R(q('cta-primary')), c2 = R(q('cta-secondary'))
            const kw = [...hl.querySelectorAll('.hl-kw')].map(R)
            const comm = kw[2]
            const padL = parseFloat(getComputedStyle(hl.closest('.hero-safe-px')).paddingLeft)
            const contentW = vw - padL * 2
            const fs = parseFloat(getComputedStyle(hl).fontSize)
            // Avatar tidak boleh menutupi teks: titik tengah tiap huruf headline & badge harus mengenai teks itu sendiri
            const covered = [...hl.querySelectorAll('.hl-char'), q('hero-badge')].filter((el) => {
                const r = R(el)
                const x = r.left + r.width / 2, y = r.top + r.height / 2
                if (x < 0 || x > vw || y < 0 || y > vh) return false
                const hit = document.elementFromPoint(x, y)
                return !(hit && (el.contains(hit) || hit.contains(el) || hit.closest('#hero-headline,[data-testid="hero-badge"]')))
            }).length
            const ik = R(q('bg-ikbal'))
            const hlR = R(hl)
            const lh = parseFloat(getComputedStyle(sub).lineHeight)
            const pulse = getComputedStyle(document.querySelector('#hero .scroll-indicator-line')).animationName
            return {
                vw, vh, fs: +fs.toFixed(1), fsVw: +(fs / vw * 100).toFixed(1),
                commRatio: +(comm.width / contentW).toFixed(3),
                commClipped: comm.right > vw - padL + 1 || comm.left < padL - 1,
                avW: Math.round(av.width), avCrop: +((av.right - vw) / av.width).toFixed(3),
                avSink: +((av.bottom - R(l1).top) / av.width).toFixed(3),
                covered,
                gaps: [badge.top - av.top, R(l1).top - badge.bottom, role.top - hlR.bottom, subR.top - role.bottom, c1.top - subR.bottom, c2.top - c1.bottom].map((v) => Math.round(v)),
                subLines: Math.round(subR.height / lh),
                ctaH: [Math.round(c1.height), Math.round(c2.height)],
                foldOk: badge.top >= 60 && hlR.bottom <= vh && role.bottom <= vh && c1.bottom <= vh,
                c1Bottom: Math.round(c1.bottom),
                ikbalW: +(ik.width / vw).toFixed(2), ikbalCy: Math.round(ik.top + ik.height / 2), hlCy: Math.round(hlR.top + hlR.height / 2),
                ikbalOp: getComputedStyle(q('bg-ikbal')).opacity,
                hudOp: getComputedStyle(q('hud-mobile-status')).opacity, hudFs: getComputedStyle(q('hud-mobile-status')).fontSize,
                pulse,
                overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            }
        })
        await page.screenshot({ path: path.join(DIR, `hero-${vp.name}-${theme}-0pct.png`) })
        const heroH = await page.evaluate(() => document.getElementById('hero').offsetHeight)
        await page.evaluate((y) => scrollTo(0, y), Math.round(heroH * 0.5))
        await page.waitForTimeout(600)
        if (theme === 'dark') await page.screenshot({ path: path.join(DIR, `hero-${vp.name}-${theme}-50pct.png`) })
        const ovf50 = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)

        const checks = vp.landscape
            ? { noOverflow: !m.overflowX && !ovf50, notCovered: m.covered === 0, noErrors: errors.length === 0, c1Visible: m.c1Bottom <= m.vh }
            : {
                commFits: !m.commClipped && m.commRatio >= 0.85 && m.commRatio <= 0.91,
                notCovered: m.covered === 0,
                avSink: m.avSink >= 0.12 && m.avSink <= 0.24,
                avCrop: m.avCrop >= 0 && m.avCrop <= 0.07,
                avSize: m.avW <= 211 && (m.vh < 740 || m.avW >= 150),
                fold: !vp.foldRule || m.foldOk,
                c1Visible: m.c1Bottom <= m.vh,
                subLines: m.subLines <= 4,
                ctaH: m.ctaH[0] === 50 && m.ctaH[1] === 46 && m.gaps[5] === 10,
                ikbal: m.ikbalW >= 0.9 && m.ikbalW <= 1.1 && Math.abs(m.ikbalCy - m.hlCy) < m.vh * 0.12 && m.ikbalOp === '0.05',
                contrast: m.hudOp === '0.75' && m.hudFs === '11px' && m.pulse === 'heroScrollPulse',
                noOverflow: !m.overflowX && !ovf50,
                noErrors: errors.length === 0,
            }
        const failed = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k)
        if (failed.length) { fail = true; console.error(`FAIL ${vp.name} ${theme}:`, failed, m, errors) }
        rows.push({ vp: `${vp.name} ${theme}`, fs: `${m.fs}px (${m.fsVw}vw)`, comm: m.commRatio, avW: m.avW, sink: m.avSink, crop: m.avCrop, gaps: m.gaps.join('/'), sub: m.subLines, c1: `${m.c1Bottom}/${m.vh}`, ikbal: m.ikbalW, covered: m.covered, ovf: m.overflowX || ovf50, err: errors.length, result: failed.length ? 'FAIL ' + failed.join(',') : 'OK' })
        await ctx.close()
    }
}
await browser.close()
console.table(rows)
if (fail) { console.error('❌ FAILED'); process.exit(1) }
console.log('✅ ALL MOBILE POLISH CHECKS PASSED')

