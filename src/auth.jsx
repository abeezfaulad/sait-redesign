import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Kbd, useToast } from './ui.jsx'
import { useLocalStorage } from './hooks.js'

const AuthCtx = createContext({ user: null, login: () => {}, logout: () => {}, signup: () => {} })
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('sait.user', null)

  const login = useCallback((email, name) => {
    const u = { email, name: name || email.split('@')[0], joined: new Date().toISOString() }
    setUser(u)
    return u
  }, [setUser])

  const signup = useCallback((name, email) => {
    const u = { email, name, joined: new Date().toISOString(), fresh: true }
    setUser(u)
    return u
  }, [setUser])

  const logout = useCallback(() => setUser(null), [setUser])

  return (
    <AuthCtx.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthCtx.Provider>
  )
}

/* ============================================================
   AUTH MODAL
   ============================================================ */
export function AuthModal({ open, onClose, initialMode = 'login' }) {
  const { login, signup } = useAuth()
  const toast = useToast()
  const [mode, setMode] = useState(initialMode)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (open) {
      setMode(initialMode)
      setForm({ name: '', email: '', password: '', confirm: '' })
      setErrors({})
      setBusy(false)
    }
  }, [open, initialMode])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  function validate() {
    const e = {}
    if (mode === 'signup' && !form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
    if (mode === 'signup') {
      if (!form.confirm) e.confirm = 'Confirm your password'
      else if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function submit(ev) {
    ev.preventDefault()
    if (!validate()) return
    setBusy(true)
    setTimeout(() => {
      if (mode === 'login') {
        login(form.email)
        toast.push({
          title: 'Signed in',
          body: `Welcome back, ${form.email.split('@')[0]}.`,
        })
      } else {
        signup(form.name, form.email)
        toast.push({
          title: 'Account created',
          body: `Welcome to SAIT, ${form.name.split(' ')[0]}.`,
        })
      }
      setBusy(false)
      onClose()
    }, 650)
  }

  return (
    <div className="drawer-root" role="dialog" aria-modal="true" aria-label={mode === 'login' ? 'Sign in' : 'Create account'} onClick={onClose}>
      <div className="drawer-backdrop" />
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} aria-label="Close">×</button>

        <div className="auth-visual">
          <div className="auth-visual-mark">SAIT</div>
          <div className="auth-visual-tag">
            Students Association of<br />
            Information Technology
          </div>
          <div className="auth-visual-grid" aria-hidden="true" />
          <div className="auth-visual-orb" aria-hidden="true" />
        </div>

        <div className="auth-form-wrap">
          <div className="auth-tabs" role="tablist">
            <button
              role="tab"
              data-active={mode === 'login'}
              onClick={() => { setMode('login'); setErrors({}) }}
            >
              Sign in
            </button>
            <button
              role="tab"
              data-active={mode === 'signup'}
              onClick={() => { setMode('signup'); setErrors({}) }}
            >
              Create account
            </button>
          </div>

          <h3 className="auth-title">
            {mode === 'login' ? 'Welcome back.' : 'Join the association.'}
          </h3>
          <p className="auth-sub">
            {mode === 'login'
              ? 'Sign in to access the activity logger and personalised notices.'
              : 'Create an account to log activities, save events, and track your points.'}
          </p>

          <form className="form" onSubmit={submit} noValidate>
            {mode === 'signup' && (
              <div className="field">
                <label htmlFor="auth-name">Full name</label>
                <input id="auth-name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Aravind Krishnan" autoComplete="name" />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
            )}

            <div className="field">
              <label htmlFor="auth-email">College email</label>
              <input id="auth-email" type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@cusat.ac.in" autoComplete="email" />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="field">
              <label htmlFor="auth-pass">Password</label>
              <input id="auth-pass" type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            {mode === 'signup' && (
              <div className="field">
                <label htmlFor="auth-confirm">Confirm password</label>
                <input id="auth-confirm" type="password" value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  placeholder="••••••••" autoComplete="new-password" />
                {errors.confirm && <span className="field-error">{errors.confirm}</span>}
              </div>
            )}

            {mode === 'login' && (
              <div className="auth-row">
                <label className="auth-check">
                  <input type="checkbox" /> Remember me
                </label>
                <button type="button" className="auth-link">Forgot password?</button>
              </div>
            )}

            <button className={`btn auth-submit ${busy ? 'is-busy' : ''}`} type="submit" disabled={busy}>
              {busy
                ? <span className="auth-spinner" aria-label="Loading" />
                : (mode === 'login' ? 'Sign in' : 'Create account')}
              {!busy && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <div className="auth-alt">
            <span>or continue with</span>
            <div className="auth-social">
              <button type="button" onClick={() => { login('demo@cusat.ac.in', 'Demo'); onClose() }}>
                <span aria-hidden="true">G</span> Google
              </button>
              <button type="button" onClick={() => { login('demo@cusat.ac.in', 'Demo'); onClose() }}>
                <span aria-hidden="true">⌘</span> GitHub
              </button>
            </div>
          </div>

          <p className="auth-note">
            This is a prototype — credentials are stored locally in your browser only.
            <br />Press <Kbd>Esc</Kbd> to close.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   USER MENU (nav dropdown)
   ============================================================ */
export function UserMenu({ onOpenAuth }) {
  const { user, logout } = useAuth()
  const toast = useToast()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    const onClick = (e) => {
      if (!e.target.closest('.user-menu')) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  if (!user) {
    return (
      <button className="nav-auth-btn" onClick={onOpenAuth}>
        <span>Sign in</span>
        <span className="nav-auth-arrow" aria-hidden="true">→</span>
      </button>
    )
  }

  const initials = user.name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()

  return (
    <div className="user-menu">
      <button className="user-trigger" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="user-avatar">{initials}</span>
        <span className="user-name">{user.name.split(' ')[0]}</span>
        <span className={`user-caret ${open ? 'open' : ''}`} aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="user-drop">
          <div className="user-drop-head">
            <div className="user-drop-avatar">{initials}</div>
            <div>
              <div className="user-drop-name">{user.name}</div>
              <div className="user-drop-email">{user.email}</div>
            </div>
          </div>
          <div className="user-drop-body">
            <button onClick={() => { onOpenAuth && onOpenAuth(); setOpen(false) }}>
              <span>Profile</span>
              <span className="user-drop-hint">Coming soon</span>
            </button>
            <button onClick={() => setOpen(false)}>
              <span>My activities</span>
              <span className="user-drop-hint">Logger</span>
            </button>
            <button onClick={() => setOpen(false)}>
              <span>Saved events</span>
              <span className="user-drop-hint">Events</span>
            </button>
          </div>
          <div className="user-drop-foot">
            <button
              className="user-logout"
              onClick={() => {
                logout()
                toast.push({ title: 'Signed out', body: 'See you soon.' })
                setOpen(false)
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}