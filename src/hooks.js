import { useEffect, useState } from 'react'

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
    let lastLetter = ''
    let lastLetterAt = 0

    function onKey(e) {
      const tag = (e.target && e.target.tagName) || ''
      const typing =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        (e.target && e.target.isContentEditable)

      const mod = e.ctrlKey || e.metaKey
      const parts = []
      if (mod) parts.push('mod')
      if (e.shiftKey) parts.push('shift')
      if (e.altKey) parts.push('alt')
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (!['Control', 'Meta', 'Shift', 'Alt'].includes(e.key)) parts.push(k)
      const combo = parts.join('+')

      const isLetter = k.length === 1 && /[a-z]/.test(k)
      const now = performance.now()
      const recentLetter = isLetter && lastLetter !== '' && (now - lastLetterAt) < 400

      if (map[combo]) {
        if (typing && !mod && combo !== 'escape') {
          if (isLetter) { lastLetter = k; lastLetterAt = now }
          return
        }
        if (combo === 'g' && recentLetter) {
          if (isLetter) { lastLetter = k; lastLetterAt = now }
          return
        }
        e.preventDefault()
        map[combo](e)
      }

      if (isLetter) {
        lastLetter = k
        lastLetterAt = now
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
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const h = (e) => setReduced(e.matches)
    m.addEventListener('change', h)
    return () => m.removeEventListener('change', h)
  }, [])
  return reduced
}

export function useDevice() {
  const read = () => {
    if (typeof window === 'undefined') {
      return { touch: false, mobile: false, tablet: false, desktop: true, width: 1280 }
    }
    const touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    const width = window.innerWidth
    return {
      touch,
      mobile: width < 768,
      tablet: width >= 768 && width < 1024,
      desktop: width >= 1024,
      width,
    }
  }

  const [device, setDevice] = useState(read)

  useEffect(() => {
    let raf = 0
    const update = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        setDevice(read())
      })
    }
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    const hover = window.matchMedia('(hover: none) and (pointer: coarse)')
    hover.addEventListener('change', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
      hover.removeEventListener('change', update)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const el = document.documentElement
    el.dataset.device = device.touch ? 'touch' : 'pointer'
    el.dataset.layout = device.mobile ? 'mobile' : device.tablet ? 'tablet' : 'desktop'
  }, [device])

  return device
}
