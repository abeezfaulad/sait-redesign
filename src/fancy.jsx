import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useReducedMotion } from './hooks.js'

/* ============================================================
   Cursor glow
   ============================================================ */
export function CursorGlow() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (reduced) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(hover: none)').matches) return
    if (window.innerWidth < 900) return
    setEnabled(true)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    let mx = window.innerWidth / 2, my = window.innerHeight / 2
    let cx = mx, cy = my, raf = 0
    const onMove = (e) => { mx = e.clientX; my = e.clientY }
    const tick = () => {
      cx += (mx - cx) * 0.18
      cy += (my - cy) * 0.18
      if (el) el.style.transform = `translate3d(${cx - 150}px, ${cy - 150}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    document.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [enabled])

  if (!enabled) return null
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />
}

/* ============================================================
   Spotlight
   ============================================================ */
export function Spotlight() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    let raf = 0, mx = window.innerWidth / 2, my = window.innerHeight / 3, cx = mx, cy = my
    const onMove = (e) => { mx = e.clientX; my = e.clientY }
    const tick = () => {
      cx += (mx - cx) * 0.09
      cy += (my - cy) * 0.09
      el.style.setProperty('--mx', cx + 'px')
      el.style.setProperty('--my', cy + 'px')
      raf = requestAnimationFrame(tick)
    }
    document.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [reduced])
  if (reduced) return null
  return <div ref={ref} className="spotlight" aria-hidden="true" />
}

/* ============================================================
   Constellation canvas
   ============================================================ */
export function Constellation() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf = 0, w = 0, h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const particles = []
    const N = window.innerWidth < 900 ? 30 : 55

    function resize() {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * 1000, y: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.4,
      })
    }

    function draw() {
      if (!w) resize()
      ctx.clearRect(0, 0, w, h)
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#F0A500'
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        p.x = Math.max(0, Math.min(w, p.x))
        p.y = Math.max(0, Math.min(h, p.y))
      }
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy
          if (d2 < 130 * 130) {
            ctx.strokeStyle = accent
            ctx.globalAlpha = (1 - Math.sqrt(d2) / 130) * 0.22
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 0.5
      ctx.fillStyle = accent
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf) }
  }, [reduced])
  if (reduced) return null
  return <canvas ref={ref} className="constellation" aria-hidden="true" />
}

/* ============================================================
   Scroll reveal
   ============================================================ */
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll(
      '.section, .hero-inner > *, .row, .person, .achievement, .blog-card, .cal-cell, .event-row, .gallery-cell'
    )
    if (!els.length) return
    const seen = new WeakSet()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || seen.has(entry.target)) return
        seen.add(entry.target)
        entry.target.classList.add('reveal-in')
        io.unobserve(entry.target)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
    els.forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal')
        el.style.setProperty('--reveal-delay', `${Math.min(i % 8, 8) * 40}ms`)
        io.observe(el)
      }
    })
    return () => io.disconnect()
  }, deps)
}

/* ============================================================
   Tilt
   ============================================================ */
export function useTilt() {
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    const els = document.querySelectorAll('.person, .blog-card, .achievement, .cal-cell, .gallery-cell')
    if (!els.length) return
    const cleanups = []
    els.forEach((el) => {
      const onMove = (e) => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        el.style.transform = `perspective(800px) rotateY(${px * 4}deg) rotateX(${-py * 4}deg) translateY(-3px)`
        el.style.setProperty('--mx', `${(px + 0.5) * 100}%`)
        el.style.setProperty('--my', `${(py + 0.5) * 100}%`)
      }
      const onLeave = () => { el.style.transform = '' }
      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
      })
    })
    return () => cleanups.forEach((c) => c())
  }, [])
}

/* ============================================================
   Marquee
   ============================================================ */
export function Marquee({ items }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items].map((it, i) => (
          <span className="marquee-item" key={i}>
            <span className="marquee-dot">◆</span> {it}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ============================================================
   Grain
   ============================================================ */
export function Grain() {
  return <div className="grain" aria-hidden="true" />
}

/* ============================================================
   Splash
   ============================================================ */
export function Splash({ duration = 900 }) {
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setGone(true), duration)
    return () => clearTimeout(t)
  }, [duration])
  if (gone) return null
  return (
    <div className="splash" aria-hidden="true">
      <div className="splash-mark">SAIT</div>
      <div className="splash-sub">Students Association of Information Technology</div>
      <div className="splash-bar"><span /></div>
    </div>
  )
}

/* ============================================================
   Scroll to top
   ============================================================ */
export function ScrollTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      className={`scroll-top ${show ? 'on' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >
      <span aria-hidden="true">↑</span>
      <span className="scroll-top-label">Top</span>
    </button>
  )
}

/* ============================================================
   Typewriter
   ============================================================ */
export function Typewriter({ phrases, speed = 55, pause = 1800 }) {
  const [i, setI] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[i % phrases.length]
    let t
    if (!deleting && text === current) {
      t = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && text === '') {
      setDeleting(false)
      setI((x) => (x + 1) % phrases.length)
    } else {
      t = setTimeout(() => {
        setText(deleting
          ? current.slice(0, text.length - 1)
          : current.slice(0, text.length + 1))
      }, deleting ? speed / 2 : speed)
    }
    return () => clearTimeout(t)
  }, [text, deleting, i, phrases, speed, pause])

  return (
    <>
      {text}
      <span className="typewriter-caret" aria-hidden="true">|</span>
    </>
  )
}

/* ============================================================
   Magnetic button
   ============================================================ */
export function MagneticButton({ children, className = '', strength = 0.35, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    const el = ref.current
    if (!el) return
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0
    const tick = () => {
      cx += (tx - cx) * 0.2
      cy += (ty - cy) * 0.2
      el.style.transform = `translate(${cx}px, ${cy}px)`
      if (Math.abs(tx - cx) > 0.2 || Math.abs(ty - cy) > 0.2) raf = requestAnimationFrame(tick)
      else raf = 0
    }
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      tx = (e.clientX - (r.left + r.width / 2)) * strength
      ty = (e.clientY - (r.top + r.height / 2)) * strength
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const onLeave = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick) }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [strength])

  return (
    <button ref={ref} className={`magnetic ${className}`} {...rest}>
      <span className="magnetic-inner">{children}</span>
    </button>
  )
}

/* ============================================================
   Parallax
   ============================================================ */
export function Parallax({ children, speed = 0.15, className = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = el.getBoundingClientRect()
        const vh = window.innerHeight
        const centre = r.top + r.height / 2
        const offset = (centre - vh / 2) * -speed
        el.style.transform = `translate3d(0, ${offset}px, 0)`
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
  }, [speed, reduced])
  return <div ref={ref} className={className}>{children}</div>
}

/* ============================================================
   Confetti
   ============================================================ */
export function useConfetti() {
  return useCallback((count = 40) => {
    const container = document.createElement('div')
    container.className = 'confetti-layer'
    document.body.appendChild(container)
    const colors = ['#F0A500', '#D97706', '#22C55E', '#7C7CF0', '#F26457']
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span')
      piece.className = 'confetti-piece'
      piece.style.left = Math.random() * 100 + '%'
      piece.style.background = colors[Math.floor(Math.random() * colors.length)]
      piece.style.animationDelay = Math.random() * 0.3 + 's'
      piece.style.animationDuration = 1.4 + Math.random() * 0.8 + 's'
      piece.style.transform = `rotate(${Math.random() * 360}deg)`
      container.appendChild(piece)
    }
    setTimeout(() => container.remove(), 2600)
  }, [])
}

/* ============================================================
   Page fade transition
   ============================================================ */
export function PageFade({ children, pageKey }) {
  const [key, setKey] = useState(pageKey)
  const [show, setShow] = useState(true)
  useEffect(() => {
    if (pageKey === key) return
    setShow(false)
    const t = setTimeout(() => {
      setKey(pageKey)
      setShow(true)
    }, 140)
    return () => clearTimeout(t)
  }, [pageKey, key])
  return (
    <div className={`page-fade ${show ? 'in' : ''}`} key={key}>
      {children}
    </div>
  )
}