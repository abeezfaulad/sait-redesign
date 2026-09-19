import React, { useEffect, useState } from 'react'
import { EXTRA_NAV } from './data.js'

/* ---------- icons ---------- */
const IconHome = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10h14V10" />
  </svg>
)
const IconCal = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="8" y1="3" x2="8" y2="7" />
    <line x1="16" y1="3" x2="16" y2="7" />
  </svg>
)
const IconPeople = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c.7-4 3.4-6 6.5-6s5.8 2 6.5 6" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M15 20c.4-3 1.8-5 4-5 1.6 0 2.8 1 3.5 3" />
  </svg>
)
const IconLog = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h13l3 3v13H4z" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="12" y2="18" />
  </svg>
)
const IconGrid = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
)
const IconSearch = () => (
  <svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="7" cy="7" r="5" />
    <line x1="11" y1="11" x2="15" y2="15" />
  </svg>
)

const TABS = [
  { id: 'home',   label: 'Home',   icon: <IconHome /> },
  { id: 'events', label: 'Events', icon: <IconCal /> },
  { id: 'people', label: 'People', icon: <IconPeople /> },
  { id: 'logger', label: 'Logger', icon: <IconLog /> },
]

export function MobileNav({ route, navigate }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const moreList = [...EXTRA_NAV, { id: 'notifications', label: 'Notices' }]
  const moreActive = moreOpen || moreList.some((n) => n.id === route)

  useEffect(() => {
    if (!moreOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') setMoreOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [moreOpen])

  return (
    <>
      <nav className="mtab" aria-label="Primary navigation">
        {TABS.map((t) => (
          <button
            key={t.id}
            data-active={route === t.id}
            onClick={() => navigate(t.id)}
            aria-label={t.label}
          >
            <span className="mtab-icon">{t.icon}</span>
            <span className="mtab-label">{t.label}</span>
          </button>
        ))}
        <button
          data-active={moreActive}
          onClick={() => setMoreOpen(true)}
          aria-label="More sections"
        >
          <span className="mtab-icon"><IconGrid /></span>
          <span className="mtab-label">More</span>
        </button>
      </nav>

      {moreOpen && (
        <div className="msheet-root" role="dialog" aria-modal="true" aria-label="All sections">
          <div className="msheet-backdrop" onClick={() => setMoreOpen(false)} />
          <div className="msheet" onClick={(e) => e.stopPropagation()}>
            <div className="msheet-handle" aria-hidden="true" />
            <div className="msheet-head">
              <span className="label">All sections</span>
              <button className="msheet-close" onClick={() => setMoreOpen(false)} aria-label="Close">
                Close
              </button>
            </div>
            <div className="msheet-grid">
              {moreList.map((n) => (
                <button
                  key={n.id}
                  data-active={route === n.id}
                  onClick={() => { navigate(n.id); setMoreOpen(false) }}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function MobileSearchButton({ onClick }) {
  return (
    <button
      className="msearch"
      onClick={onClick}
      aria-label="Search"
      title="Search"
    >
      <IconSearch />
    </button>
  )
}