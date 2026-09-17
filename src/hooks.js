import { useEffect, useState, useCallback } from 'react'

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value])
  return [value, setValue]
}

export function useHotkeys(map) {
  useEffect(() => {
    function onKey(e) {
      const tag = (e.target && e.target.tagName) || ''
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target && e.target.isContentEditable)
      const mod = e.ctrlKey || e.metaKey
      const parts = []
      if (mod) parts.push('mod')
      if (e.shiftKey) parts.push('shift')
      if (e.altKey) parts.push('alt')
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (!['Control', 'Meta', 'Shift', 'Alt'].includes(e.key)) parts.push(k)
      const combo = parts.join('+')
      if (map[combo]) {
        if (typing && !mod && combo !== 'escape') return
        e.preventDefault()
        map[combo](e)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [map])
}

export function useQueryParam(key, initial) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initial
    const p = new URLSearchParams(window.location.search)
    return p.get(key) ?? initial
  })
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (value === initial) p.delete(key)
    else p.set(key, value)
    const qs = p.toString()
    const next = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash
    window.history.replaceState(null, '', next)
  }, [key, value, initial])
  return [value, setValue]
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const h = (e) => setReduced(e.matches)
    m.addEventListener('change', h)
    return () => m.removeEventListener('change', h)
  }, [])
  return reduced
}