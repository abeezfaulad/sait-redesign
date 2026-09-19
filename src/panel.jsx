import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Kbd } from './ui.jsx'
import { useHotkeys, useLocalStorage } from './hooks.js'
import { NAV, EXTRA_NAV, UPCOMING_EVENTS } from './data.js'

const ThemeCtx = createContext({ theme: 'dark', toggle: () => {} })
export const useTheme = () => useContext(ThemeCtx)

const ACCENTS = [
  { id: 'amber',  label: 'Amber',  primary: '#F0A500', secondary: '#D97706' },
  { id: 'coral',  label: 'Coral',  primary: '#F26457', secondary: '#C74B3E' },
  { id: 'teal',   label: 'Teal',   primary: '#14B8A6', secondary: '#0D9488' },
  { id: 'indigo', label: 'Indigo', primary: '#7C7CF0', secondary: '#5B5BD6' },
  { id: 'lime',   label: 'Lime',   primary: '#84CC16', secondary: '#65A30D' },
]

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('sait.theme', 'dark')
  const [accent, setAccent] = useLocalStorage('sait.accent', 'amber')

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])

  useEffect(() => {
    const a = ACCENTS.find((x) => x.id === accent) || ACCENTS[0]
    document.documentElement.style.setProperty('--accent', a.primary)
    document.documentElement.style.setProperty('--accent-2', a.secondary)
    document.documentElement.style.setProperty('--accent-glow',
      `color-mix(in oklab, ${a.primary} 30%, transparent)`)
  }, [accent])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [setTheme])

  return (
    <ThemeCtx.Provider value={{ theme, toggle, accent, setAccent, accents: ACCENTS }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export function ScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const h = document.documentElement.scrollHeight - window.innerHeight
        const y = window.scrollY || document.documentElement.scrollTop
        setP(h > 0 ? Math.min(1, Math.max(0, y / h)) : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-bar" style={{ transform: `scaleX(${p})` }} />
    </div>
  )
}

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function useRotator(length, ms = 5000) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (length < 2) return
    const id = setInterval(() => setI((x) => (x + 1) % length), ms)
    return () => clearInterval(id)
  }, [length, ms])
  return [i, setI]
}

export function useCounters(route) {
  useEffect(() => {
    const els = document.querySelectorAll('.stat .value')
    if (!els.length) return

    const animate = (el) => {
      const original = el.textContent || ''
      const m = original.match(/^([^\d]*)([\d,.]+)(.*)$/)
      if (!m) return
      const prefix = m[1]
      const target = parseFloat(m[2].replace(/,/g, ''))
      const suffix = m[3]
      if (isNaN(target)) return
      const isFloat = String(target).includes('.')
      const dur = 1100
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur)
        const eased = 1 - Math.pow(1 - t, 3)
        const val = target * eased
        el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.round(val).toLocaleString('en-IN')) + suffix
        if (t < 1) requestAnimationFrame(tick)
        else el.textContent = original
      }
      requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !e.target.dataset.counted) {
          e.target.dataset.counted = '1'
          animate(e.target)
        }
      })
    }, { threshold: 0.4 })

    els.forEach((el) => { delete el.dataset.counted; io.observe(el) })
    return () => io.disconnect()
  }, [route])
}

export function FloatingDock({ navigate, route, onOpenPalette, onOpenHelp }) {
  const [open, setOpen] = useState(false)
  const { theme, toggle, accent, setAccent, accents } = useTheme()
  const now = useNow()
  const [liveIdx, setLiveIdx] = useRotator(UPCOMING_EVENTS.length, 5000)
  const live = UPCOMING_EVENTS[liveIdx]

  useHotkeys(useMemo(() => ({ '\\': () => setOpen((v) => !v) }), []))

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })

  const allNav = [...NAV, ...EXTRA_NAV]

  return (
    <div className={`dock ${open ? 'dock-open' : ''}`}>
      {open && <div className="dock-scrim" onClick={() => setOpen(false)} />}
      {open && (
        <aside className="dock-panel" role="dialog" aria-label="Control panel">
          <div className="dock-head">
            <div>
              <span className="label">Control panel</span>
              <div className="dock-clock">{timeStr}</div>
              <div className="dock-date">{dateStr}</div>
            </div>
            <button className="dock-close" onClick={() => setOpen(false)} aria-label="Close"><Kbd>Esc</Kbd></button>
          </div>

          <div className="dock-live">
            <div className="dock-live-head">
              <span className="live-dot" aria-hidden="true" />
              <span className="label">Happening soon</span>
            </div>
            <div className="dock-live-title">{live.title}</div>
            <div className="dock-live-meta">{live.date} · {live.time} · {live.venue}</div>
            <div className="dock-live-dots" role="tablist" aria-label="Upcoming events">
              {UPCOMING_EVENTS.map((e, i) => (
                <button key={e.title} role="tab" aria-selected={i === liveIdx}
                  className={`dot ${i === liveIdx ? 'on' : ''}`}
                  onClick={() => setLiveIdx(i)}
                  aria-label={`Event ${i + 1}: ${e.title}`} />
              ))}
            </div>
          </div>

          <div className="dock-section">
            <span className="label">Quick actions</span>
            <div className="dock-actions">
              <button onClick={() => { onOpenPalette(); setOpen(false) }}>
                <span>Search</span>
                <span className="dock-keys"><Kbd>Ctrl</Kbd><Kbd>K</Kbd></span>
              </button>
              <button onClick={() => { onOpenHelp(); setOpen(false) }}>
                <span>Shortcuts</span>
                <span className="dock-keys"><Kbd>?</Kbd></span>
              </button>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <span>Back to top</span>
                <span className="dock-keys">↑</span>
              </button>
            </div>
          </div>

          <div className="dock-section">
            <span className="label">Sections</span>
            <nav className="dock-nav">
              {allNav.map((n) => (
                <button key={n.id} data-active={route === n.id} onClick={() => { navigate(n.id); setOpen(false) }}>
                  {n.label}
                </button>
              ))}
              <button data-active={route === 'notifications'} onClick={() => { navigate('notifications'); setOpen(false) }}>
                Notices
              </button>
            </nav>
          </div>

          <div className="dock-section">
            <span className="label">Accent</span>
            <div className="accent-picker" role="group" aria-label="Accent color">
              {accents.map((a) => (
                <button key={a.id} data-active={accent === a.id} onClick={() => setAccent(a.id)}
                  title={a.label} aria-label={a.label}
                  style={{ '--swatch': a.primary, '--swatch-2': a.secondary }} />
              ))}
            </div>
          </div>

          <div className="dock-section">
            <span className="label">Appearance</span>
            <div className="theme-toggle" role="group" aria-label="Theme">
              <button data-active={theme === 'light'} onClick={() => theme !== 'light' && toggle()}>Light</button>
              <button data-active={theme === 'dark'} onClick={() => theme !== 'dark' && toggle()}>Dark</button>
            </div>
          </div>

          <div className="dock-foot">
            <span>SAIT · CUSAT</span>
            <span>v2.0</span>
          </div>
        </aside>
      )}

      <button className="dock-trigger" onClick={() => setOpen((v) => !v)} aria-expanded={open}
        aria-label={open ? 'Close control panel' : 'Open control panel'}>
        <span className="dock-trigger-icon" aria-hidden="true">{open ? '×' : '≡'}</span>
        <span className="dock-trigger-label">{open ? 'Close' : 'Menu'}</span>
        <span className="dock-trigger-key"><Kbd>{'\\'}</Kbd></span>
      </button>
    </div>
  )
}