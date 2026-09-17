import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Kbd } from './ui.jsx'
import { useHotkeys, useLocalStorage } from './hooks.js'
import { NAV, UPCOMING_EVENTS } from './data.js'

/* ---------- Theme ---------- */
const ThemeCtx = createContext({ theme: 'light', toggle: () => {} })
export const useTheme = () => useContext(ThemeCtx)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('sait.theme', 'light')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  const toggle = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }, [setTheme])
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>
}

/* ---------- Scroll progress bar ---------- */
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

/* ---------- Live clock ---------- */
function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

/* ---------- Rotator ---------- */
function useRotator(length, ms = 5000) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (length < 2) return
    const id = setInterval(() => setI((x) => (x + 1) % length), ms)
    return () => clearInterval(id)
  }, [length, ms])
  return [i, setI]
}

/* ---------- Animated stat counters ---------- */
export function useCounters(route) {
  useEffect(() => {
    const els = document.querySelectorAll('.stat .value')
    if (!els.length) return

    const animate = (el) => {
      const original = el.textContent || ''
      const m = original.match(/^([^\d]*)([\d,]+)(.*)$/)
      if (!m) return
      const prefix = m[1]
      const numStr = m[2]
      const suffix = m[3]
      const target = parseInt(numStr.replace(/,/g, ''), 10)
      if (isNaN(target)) return
      const dur = 950
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur)
        const eased = 1 - Math.pow(1 - t, 3)
        const val = Math.round(target * eased)
        el.textContent = prefix + val.toLocaleString('en-IN') + suffix
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

    els.forEach((el) => {
      delete el.dataset.counted
      io.observe(el)
    })
    return () => io.disconnect()
  }, [route])
}

/* ---------- Floating control dock ---------- */
export function FloatingDock({ navigate, route, onOpenPalette, onOpenHelp }) {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const now = useNow()
  const [liveIdx, setLiveIdx] = useRotator(UPCOMING_EVENTS.length, 5000)
  const live = UPCOMING_EVENTS[liveIdx]

  useHotkeys(useMemo(() => ({
    '\\': () => setOpen((v) => !v),
  }), []))

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  })
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })

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
            <button className="dock-close" onClick={() => setOpen(false)} aria-label="Close">
              <Kbd>Esc</Kbd>
            </button>
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
                <button
                  key={e.title}
                  role="tab"
                  aria-selected={i === liveIdx}
                  className={`dot ${i === liveIdx ? 'on' : ''}`}
                  onClick={() => setLiveIdx(i)}
                  aria-label={`Event ${i + 1}: ${e.title}`}
                />
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
              {NAV.map((n) => (
                <button
                  key={n.id}
                  data-active={route === n.id}
                  onClick={() => { navigate(n.id); setOpen(false) }}
                >
                  {n.label}
                </button>
              ))}
              <button
                data-active={route === 'notifications'}
                onClick={() => { navigate('notifications'); setOpen(false) }}
              >
                Notices
              </button>
            </nav>
          </div>

          <div className="dock-section">
            <span className="label">Appearance</span>
            <div className="theme-toggle" role="group" aria-label="Theme">
              <button
                data-active={theme === 'light'}
                onClick={() => theme !== 'light' && toggle()}
              >
                Light
              </button>
              <button
                data-active={theme === 'dark'}
                onClick={() => theme !== 'dark' && toggle()}
              >
                Dark
              </button>
            </div>
          </div>

          <div className="dock-foot">
            <span>SAIT · CUSAT</span>
            <span>v1.0</span>
          </div>
        </aside>
      )}

      <button
        className="dock-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close control panel' : 'Open control panel'}
      >
        <span className="dock-trigger-icon" aria-hidden="true">{open ? '×' : '≡'}</span>
        <span className="dock-trigger-label">{open ? 'Close' : 'Menu'}</span>
        <span className="dock-trigger-key"><Kbd>{'\\'}</Kbd></span>
      </button>
    </div>
  )
}