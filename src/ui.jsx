import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

/* -------- Section shell -------- */
export function Section({ id, num, kicker, title, lede, children }) {
  return (
    <section id={id} className="section">
      <div className="container">
        <div className="section-grid">
          <div className="section-rail">
            <span className="label">§ {num}</span>
            <span className="label">{kicker}</span>
          </div>
          <div className="section-main">
            {title && <h2 className="display-l">{title}</h2>}
            {lede && <p className="lede">{lede}</p>}
            <div className="section-content">{children}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------- Links -------- */
export function ArrowLink({ href = '#', children, onClick }) {
  return (
    <a className="arrow-link" href={href}
       onClick={(e) => { if (onClick) { e.preventDefault(); onClick() } }}>
      {children} <span aria-hidden="true">→</span>
    </a>
  )
}

/* -------- Avatars -------- */
export function Initials({ name, className = 'initials' }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
  return <div className={className} aria-hidden="true">{initials}</div>
}

export function SubHead({ children, action }) {
  return (
    <div className="subhead-row">
      <h3 className="subhead">{children}</h3>
      {action}
    </div>
  )
}

/* -------- Kbd -------- */
export function Kbd({ children }) {
  return <kbd className="kbd">{children}</kbd>
}

/* -------- Empty -------- */
export function Empty({ children }) {
  return <p className="empty">{children}</p>
}

/* -------- SearchInput -------- */
export function SearchInput({ value, onChange, placeholder = 'Search…', label = 'Search' }) {
  return (
    <div className="search">
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className="search-icon">
        <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="11" y1="11" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <input
        type="search"
        aria-label={label}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="search-clear" onClick={() => onChange('')} aria-label="Clear">
          ×
        </button>
      )}
    </div>
  )
}

/* -------- Drawer -------- */
export function Drawer({ open, onClose, title, eyebrow, children }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setTimeout(() => ref.current?.focus(), 0)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="drawer-root" role="dialog" aria-modal="true" aria-label={title}>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" ref={ref} tabIndex={-1}>
        <div className="drawer-head">
          <div>
            {eyebrow && <span className="label">{eyebrow}</span>}
            <h3 className="drawer-title">{title}</h3>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close">
            Close <Kbd>Esc</Kbd>
          </button>
        </div>
        <div className="drawer-body">{children}</div>
      </aside>
    </div>
  )
}

/* -------- Toasts -------- */
const ToastCtx = createContext(null)
export function useToast() { return useContext(ToastCtx) }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const push = useCallback((toast) => {
    const id = ++idRef.current
    setToasts((t) => [...t, { id, ...toast }])
    const ttl = toast.duration ?? 4500
    if (ttl > 0) setTimeout(() => dismiss(id), ttl)
    return id
  }, [dismiss])

  return (
    <ToastCtx.Provider value={{ push, dismiss }}>
      {children}
      <div className="toasts" role="region" aria-label="Notifications">
        {toasts.map((t) => (
          <div className="toast" key={t.id} role="status">
            <div className="toast-body">
              <div className="toast-title">{t.title}</div>
              {t.body && <div className="toast-text">{t.body}</div>}
            </div>
            <div className="toast-actions">
              {t.action && (
                <button
                  className="toast-action"
                  onClick={() => { t.action.onClick(); dismiss(t.id) }}
                >
                  {t.action.label}
                </button>
              )}
              <button className="toast-dismiss" onClick={() => dismiss(t.id)} aria-label="Dismiss">×</button>
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

/* -------- Shortcut help dialog -------- */
export function ShortcutHelp({ open, onClose, items }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="drawer-root" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="modal">
        <div className="drawer-head">
          <h3 className="drawer-title">Keyboard shortcuts</h3>
          <button className="drawer-close" onClick={onClose} aria-label="Close">
            Close <Kbd>Esc</Kbd>
          </button>
        </div>
        <dl className="shortcut-list">
          {items.map((it) => (
            <div className="shortcut-row" key={it.label}>
              <dt>{it.label}</dt>
              <dd>{it.keys.map((k) => <Kbd key={k}>{k}</Kbd>)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}