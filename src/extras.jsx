import React, { useEffect, useMemo, useState } from 'react'
import { Section, SubHead, SearchInput, Empty, Kbd, useToast } from './ui.jsx'
import { FAQ_ITEMS, GALLERY_ITEMS, BLOG_POSTS, CONTACT } from './data.js'

/* ============================================================
   FAQ
   ============================================================ */
export function FAQ() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(0)
  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase()
    if (!n) return FAQ_ITEMS
    return FAQ_ITEMS.filter((x) => (x.q + ' ' + x.a).toLowerCase().includes(n))
  }, [q])

  return (
    <Section id="faq" num="10" kicker="Questions" title="Frequently asked questions."
      lede="Common questions from students about SAIT, membership, events, and the activity logger.">
      <div className="search-row">
        <SearchInput value={q} onChange={setQ} placeholder="Search questions…" label="Search FAQ" />
      </div>
      {filtered.length === 0 && <Empty>No questions match "{q}".</Empty>}
      {filtered.map((item, i) => {
        const isOpen = open === i
        return (
          <div className="acc-item" key={item.q} data-open={isOpen}>
            <button className="acc-head" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
              <div><div className="acc-title">{item.q}</div></div>
              <span className="acc-plus" aria-hidden="true">+</span>
            </button>
            {isOpen && <div className="acc-body">{item.a}</div>}
          </div>
        )
      })}
    </Section>
  )
}

/* ============================================================
   GALLERY
   ============================================================ */
export function Gallery() {
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState(null)
  const tags = useMemo(() => ['All', ...Array.from(new Set(GALLERY_ITEMS.map((g) => g.tag)))], [])
  const items = useMemo(
    () => (filter === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((g) => g.tag === filter)),
    [filter]
  )

  useEffect(() => {
    if (active === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null)
      else if (e.key === 'ArrowRight') setActive((c) => (c + 1) % items.length)
      else if (e.key === 'ArrowLeft') setActive((c) => (c - 1 + items.length) % items.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active, items.length])

  useEffect(() => { setActive(null) }, [filter])

  return (
    <Section id="gallery" num="11" kicker="Gallery" title="Moments from the division."
      lede="Selected photographs from SAIT events, workshops, orientations and department activities.">
      <div className="filters" style={{ marginBottom: 24 }}>
        {tags.map((t) => (
          <button key={t} data-active={filter === t} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>

      <div className="gallery-grid">
        {items.map((g, i) => (
          <button
            className={`gallery-cell ${g.size === 'large' ? 'gallery-cell-large' : ''}`}
            key={g.id}
            onClick={() => setActive(i)}
          >
            <div className="gallery-thumb">
              <span className="gallery-num">{String(g.id).padStart(2, '0')}</span>
              <span className="gallery-tag">{g.tag}</span>
            </div>
            <div className="gallery-caption">{g.title}</div>
          </button>
        ))}
      </div>

      {active !== null && items[active] && (
        <div className="drawer-root" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <div className="drawer-backdrop" />
          <div className="lightbox" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setActive(null)}>
              Close <Kbd>Esc</Kbd>
            </button>
            <div className="lightbox-image">
              <span className="lightbox-num">{String(items[active].id).padStart(2, '0')}</span>
            </div>
            <div className="lightbox-meta">
              <div>
                <div className="lightbox-tag">{items[active].tag}</div>
                <div className="lightbox-title">{items[active].title}</div>
              </div>
              <div className="lightbox-nav">
                <button onClick={() => setActive((active - 1 + items.length) % items.length)} aria-label="Previous">←</button>
                <span className="lightbox-count">{active + 1} / {items.length}</span>
                <button onClick={() => setActive((active + 1) % items.length)} aria-label="Next">→</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}

/* ============================================================
   NEWSROOM
   ============================================================ */
export function Blog() {
  const [filter, setFilter] = useState('All')
  const tags = useMemo(() => ['All', ...Array.from(new Set(BLOG_POSTS.map((b) => b.tag)))], [])
  const posts = useMemo(
    () => (filter === 'All' ? BLOG_POSTS : BLOG_POSTS.filter((b) => b.tag === filter)),
    [filter]
  )

  return (
    <Section id="blog" num="12" kicker="Newsroom" title="Recent updates from SAIT."
      lede="Short posts from the association, the department office, and the placement cell.">
      <div className="filters" style={{ marginBottom: 24 }}>
        {tags.map((t) => (
          <button key={t} data-active={filter === t} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>
      <div className="blog-list">
        {posts.map((b) => (
          <article className="blog-card" key={b.title}>
            <div className="blog-meta">
              <span className="blog-date">{b.date}</span>
              <span className="tag accent">{b.tag}</span>
            </div>
            <h3 className="blog-title">{b.title}</h3>
            <p className="blog-excerpt">{b.excerpt}</p>
            <div className="blog-foot">
              <span className="blog-author">{b.author}</span>
              <span className="arrow-link">Read more →</span>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

/* ============================================================
   CONTACT
   ============================================================ */
export function Contact() {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', subject: 'General enquiry', message: '' })
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter your name.'
    if (!form.email.trim()) e.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'That does not look like a valid email.'
    if (form.message.trim().length < 10) e.message = 'Please write at least 10 characters.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function submit(ev) {
    ev.preventDefault()
    if (!validate()) return
    toast.push({
      title: 'Message sent',
      body: `Thanks ${form.name}. We will reply within a few days.`,
    })
    setForm({ name: '', email: '', subject: 'General enquiry', message: '' })
    setErrors({})
  }

  return (
    <Section id="contact" num="13" kicker="Contact" title="Get in touch."
      lede="Questions about events, membership, placements or collaborations — write to the association and we will respond within a few days.">
      <div className="cols wide-left">
        <div>
          <SubHead>Send a message</SubHead>
          <form className="form" onSubmit={submit} noValidate>
            <div className="field-row">
              <div className="field">
                <label htmlFor="ct-name">Your name</label>
                <input id="ct-name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="ct-email">Email</label>
                <input id="ct-email" type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
            </div>
            <div className="field">
              <label htmlFor="ct-subject">Subject</label>
              <select id="ct-subject" value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                <option>General enquiry</option>
                <option>Event registration</option>
                <option>Membership</option>
                <option>Placements</option>
                <option>Alumni network</option>
                <option>Collaboration proposal</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="ct-message">Message</label>
              <textarea id="ct-message" rows="6" value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })} />
              {errors.message && <span className="field-error">{errors.message}</span>}
            </div>
            <div className="form-actions">
              <button className="btn" type="submit">Send message</button>
              <span className="form-hint">We reply Mon-Fri</span>
            </div>
          </form>
        </div>

        <div>
          <SubHead>Direct</SubHead>
          <div className="contact-card">
            <div className="label">General enquiries</div>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <div className="label" style={{ marginTop: 20 }}>Department office</div>
            <a href={`mailto:${CONTACT.altEmail}`}>{CONTACT.altEmail}</a>
            <div className="label" style={{ marginTop: 20 }}>Phone</div>
            <div>{CONTACT.phone}</div>
            <div className="label" style={{ marginTop: 20 }}>Office hours</div>
            <div>{CONTACT.hours}</div>
          </div>

          <div className="map-block" style={{ marginTop: 24 }}>
            <div className="label" style={{ marginBottom: 10 }}>Visit</div>
            {CONTACT.address.line1}<br />
            {CONTACT.address.line2}<br />
            {CONTACT.address.line3}<br />
            {CONTACT.address.line4}
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ============================================================
   EVENT COUNTDOWN
   ============================================================ */
export function useEventCountdown(dateStr) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  return useMemo(() => {
    const m = (dateStr || '').match(/(\d+)\s+([A-Za-z]+)\s+(\d+)/)
    if (!m) return null
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const mon = months.indexOf(m[2].slice(0, 3))
    if (mon === -1) return null
    const target = new Date(parseInt(m[3]), mon, parseInt(m[1])).getTime()
    const diff = target - now
    if (diff <= 0) return { past: true }
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    const mm = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return { past: false, days: d, hours: h, minutes: mm, seconds: s }
  }, [dateStr, now])
}

/* ============================================================
   REGISTRATION MODAL
   ============================================================ */
export function RegistrationModal({ event, onClose, onConfirm }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', college: 'CUSAT', team: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!event) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [event, onClose])

  if (!event) return null

  function validateStep1() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() {
    if (step === 1) {
      if (!validateStep1()) return
      setStep(2)
    } else {
      onConfirm()
      onClose()
    }
  }

  return (
    <div className="drawer-root" role="dialog" aria-modal="true" aria-label="Register for event" onClick={onClose}>
      <div className="drawer-backdrop" />
      <div className="reg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="reg-head">
          <div>
            <span className="label">Register · Step {step} of 2</span>
            <h3 className="reg-title">{event.title}</h3>
            <div className="reg-meta">{event.date} · {event.time} · {event.venue}</div>
          </div>
          <button className="drawer-close" onClick={onClose}>Close <Kbd>Esc</Kbd></button>
        </div>

        <div className="reg-steps">
          <div className="reg-step" data-active={step >= 1}>
            <span className="reg-step-num">01</span> Your details
          </div>
          <div className="reg-step" data-active={step >= 2}>
            <span className="reg-step-num">02</span> Confirm
          </div>
        </div>

        <div className="reg-body">
          {step === 1 && (
            <div className="form">
              <div className="field">
                <label htmlFor="reg-name">Full name</label>
                <input id="reg-name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name as it appears on college records" />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="reg-email">Email</label>
                <input id="reg-email" type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="reg-college">College</label>
                  <input id="reg-college" value={form.college}
                    onChange={(e) => setForm({ ...form, college: e.target.value })} />
                </div>
                <div className="field">
                  <label htmlFor="reg-team">Team name (optional)</label>
                  <input id="reg-team" value={form.team}
                    onChange={(e) => setForm({ ...form, team: e.target.value })}
                    placeholder="If this is a team event" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="reg-confirm">
              <div className="reg-summary">
                <div className="reg-summary-row"><span className="label">Event</span><span>{event.title}</span></div>
                <div className="reg-summary-row"><span className="label">When</span><span>{event.date} at {event.time}</span></div>
                <div className="reg-summary-row"><span className="label">Where</span><span>{event.venue}</span></div>
                <div className="reg-summary-row"><span className="label">Name</span><span>{form.name}</span></div>
                <div className="reg-summary-row"><span className="label">Email</span><span>{form.email}</span></div>
                {form.team && (
                  <div className="reg-summary-row"><span className="label">Team</span><span>{form.team}</span></div>
                )}
              </div>
              <p className="muted small">
                By registering you agree to receive event updates by email.
                You can withdraw from the event at any time by writing to the association.
              </p>
            </div>
          )}
        </div>

        <div className="reg-foot">
          <button className="btn ghost" onClick={() => (step === 1 ? onClose() : setStep(1))}>
            {step === 1 ? 'Cancel' : '← Back'}
          </button>
          <button className="btn" onClick={next}>
            {step === 1 ? 'Continue →' : 'Confirm registration'}
          </button>
        </div>
      </div>
    </div>
  )
}