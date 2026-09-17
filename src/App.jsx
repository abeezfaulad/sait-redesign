import React, { useEffect, useMemo, useState } from 'react'
import { NAV, NOTICE, UPCOMING_EVENTS, ALUMNI, EXEC } from './data.js'
import {
  Home, About, People, Events, Placements,
  Alumni, Achievements, ActivityLogger, Notifications,
} from './sections.jsx'
import { ToastProvider, ShortcutHelp, Kbd } from './ui.jsx'
import { useHotkeys, useLocalStorage } from './hooks.js'
import CommandPalette from './CommandPalette.jsx'
import { ThemeProvider, ScrollProgress, FloatingDock, useCounters } from './panel.jsx'

function Shell() {
  const [page, setPage] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [readNotices] = useLocalStorage('sait.notices.read', [])
  const [gPending, setGPending] = useState(false)

  useCounters(page)

  const unreadNotices = Math.max(0, 4 - readNotices.length)

  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace('#', '')
      if (NAV.some((n) => n.id === h) || h === 'notifications') setPage(h || 'home')
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  function navigate(id) {
    setPage(id)
    setMenuOpen(false)
    window.location.hash = id
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const commands = useMemo(() => {
    const list = []
    const pg = (id, label, keywords) => list.push({
      id: 'page-' + id, group: 'Pages', label, hint: 'Page', keywords,
      run: () => navigate(id),
    })

    pg('home', 'Home', 'landing start')
    pg('about', 'About the department', 'vision mission history faculty')
    pg('people', 'Association & people', 'committee members teams')
    pg('events', 'Events & activities', 'hackathon workshop talk')
    pg('placements', 'Placements & careers', 'jobs recruiters packages')
    pg('alumni', 'Alumni', 'graduates batches')
    pg('achievements', 'Achievements', 'hall of fame awards')
    pg('logger', 'Activity logger', 'submit record points')
    pg('notifications', 'Notices & announcements', 'updates reminders')

    UPCOMING_EVENTS.forEach((e) => list.push({
      id: 'event-' + e.title,
      group: 'Events',
      label: e.title,
      hint: e.date,
      keywords: e.category + ' ' + e.venue,
      run: () => navigate('events'),
    }))

    EXEC.slice(0, 6).forEach((p) => list.push({
      id: 'person-' + p.name,
      group: 'People',
      label: p.name,
      hint: p.role,
      keywords: 'committee executive',
      run: () => navigate('people'),
    }))

    ALUMNI.slice(0, 4).forEach((a) => list.push({
      id: 'alum-' + a.name,
      group: 'Alumni',
      label: a.name,
      hint: `Class of ${a.year}`,
      keywords: a.role,
      run: () => navigate('alumni'),
    }))

    list.push({
      id: 'action-logs',
      group: 'Actions',
      label: 'Open activity logger',
      hint: 'Action',
      run: () => navigate('logger'),
    })
    list.push({
      id: 'action-help',
      group: 'Actions',
      label: 'Show keyboard shortcuts',
      hint: '?',
      run: () => setHelpOpen(true),
    })

    return list
  }, [])

  useHotkeys(useMemo(() => ({
    'mod+k': () => setPaletteOpen((v) => !v),
    '/': () => setPaletteOpen(true),
    '?': () => setHelpOpen(true),
    'escape': () => { setPaletteOpen(false); setHelpOpen(false) },
    'g': () => {
      setGPending(true)
      setTimeout(() => setGPending(false), 900)
    },
    'h': () => { if (gPending) { navigate('home'); setGPending(false) } },
    'a': () => { if (gPending) { navigate('about'); setGPending(false) } },
    'p': () => { if (gPending) { navigate('people'); setGPending(false) } },
    'e': () => { if (gPending) { navigate('events'); setGPending(false) } },
    'l': () => { if (gPending) { navigate('logger'); setGPending(false) } },
    'n': () => { if (gPending) { navigate('notifications'); setGPending(false) } },
  }), [gPending]))

  const shortcuts = [
    { label: 'Open command palette', keys: ['Ctrl', 'K'] },
    { label: 'Quick search', keys: ['/'] },
    { label: 'Toggle control panel', keys: ['\\'] },
    { label: 'Show shortcuts', keys: ['?'] },
    { label: 'Close any dialog', keys: ['Esc'] },
    { label: 'Go to Home', keys: ['G', 'H'] },
    { label: 'Go to About', keys: ['G', 'A'] },
    { label: 'Go to People', keys: ['G', 'P'] },
    { label: 'Go to Events', keys: ['G', 'E'] },
    { label: 'Go to Logger', keys: ['G', 'L'] },
    { label: 'Go to Notices', keys: ['G', 'N'] },
  ]

  return (
    <>
      <ScrollProgress />

      <div className="ticker">
        <div className="container">
          <b>Notice</b>
          <a href={NOTICE.href} onClick={(e) => { e.preventDefault(); navigate(NOTICE.href.replace('#', '')) }}>
            {NOTICE.text}
          </a>
        </div>
      </div>

      <header className="nav">
        <div className="container nav-inner">
          <button className="wordmark" onClick={() => navigate('home')} style={{ background: 'none', border: 0, padding: 0 }}>
            SAIT <small>CUSAT · IT Division</small>
          </button>

          <nav className="nav-links">
            {NAV.map((n) => (
              <button key={n.id} data-active={page === n.id} onClick={() => navigate(n.id)}>{n.label}</button>
            ))}
            <button data-active={page === 'notifications'} onClick={() => navigate('notifications')} className="nav-notices">
              Notices
              {unreadNotices > 0 && <span className="badge">{unreadNotices}</span>}
            </button>
          </nav>

          <div className="nav-right">
            <button className="palette-trigger" onClick={() => setPaletteOpen(true)} aria-label="Open command palette">
              <span>Search</span>
              <span className="palette-keys"><Kbd>Ctrl</Kbd><Kbd>K</Kbd></span>
            </button>
            <button className="nav-toggle" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="container nav-mobile">
            {[...NAV, { id: 'notifications', label: 'Notices' }].map((n) => (
              <button key={n.id} data-active={page === n.id} onClick={() => navigate(n.id)}>{n.label}</button>
            ))}
          </div>
        )}
      </header>

      <main>
        {page === 'home' && <Home onNavigate={navigate} onOpenPalette={() => setPaletteOpen(true)} />}
        {page === 'about' && <About />}
        {page === 'people' && <People />}
        {page === 'events' && <Events />}
        {page === 'placements' && <Placements />}
        {page === 'alumni' && <Alumni />}
        {page === 'achievements' && <Achievements />}
        {page === 'logger' && <ActivityLogger />}
        {page === 'notifications' && <Notifications />}
      </main>

      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-grid">
            <div>
              <span className="label">Contact</span>
              <h3 style={{ marginTop: 14 }}>Students Association of Information Technology</h3>
              <p style={{ color: 'var(--footer-text)', maxWidth: '38ch', margin: 0 }}>
                Division of Information Technology<br />
                School of Engineering, CUSAT<br />
                Kochi, Kerala — 682 022
              </p>
              <p style={{ marginTop: 20, fontFamily: 'var(--mono)', fontSize: 13 }}>
                <a href="mailto:sait@cusat.ac.in">sait@cusat.ac.in</a>
              </p>
            </div>
            <div>
              <span className="label">Navigate</span>
              <div className="footer-links" style={{ marginTop: 14 }}>
                {NAV.map((n) => (
                  <a key={n.id} href={`#${n.id}`} onClick={(e) => { e.preventDefault(); navigate(n.id) }}>{n.label}</a>
                ))}
                <a href="#notifications" onClick={(e) => { e.preventDefault(); navigate('notifications') }}>Notices</a>
              </div>
            </div>
            <div>
              <span className="label">Elsewhere</span>
              <div className="footer-links" style={{ marginTop: 14 }}>
                <a href="#">Instagram</a>
                <a href="#">LinkedIn</a>
                <a href="#">GitHub</a>
                <a href="#">YouTube</a>
              </div>
              <div className="map-block" style={{ marginTop: 24 }}>
                SOE, CUSAT — South Kalamassery<br />
                Kochi, Kerala 682022<br />
                10.0467° N, 76.3283° E
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 SAIT, CUSAT. All rights reserved.</span>
            <span>
              <button className="footer-link-btn" onClick={() => setHelpOpen(true)}>
                Keyboard shortcuts <Kbd>?</Kbd>
              </button>
            </span>
          </div>
        </div>
      </footer>

      <FloatingDock
        navigate={navigate}
        route={page}
        onOpenPalette={() => setPaletteOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
      />

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
      <ShortcutHelp open={helpOpen} onClose={() => setHelpOpen(false)} items={shortcuts} />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </ThemeProvider>
  )
}