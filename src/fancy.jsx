import React, { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './hooks.js'

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

export function Grain() {
  return <div className="grain" aria-hidden="true" />
}

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