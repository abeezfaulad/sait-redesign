import React, { useEffect, useMemo, useState } from 'react'
import { Section, SubHead, SearchInput, Empty, Kbd, useToast } from './ui.jsx'
import { useLocalStorage } from './hooks.js'
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
   LIBRARY
   ============================================================ */
const LIBRARY_HOURS = [
  { day: 'Monday – Friday',    time: '09:30 – 16:30' },
  { day: 'Saturday',           time: '09:30 – 13:00' },
  { day: 'Sunday & holidays',  time: 'Closed' },
]

const LIBRARY_RULES = [
  { title: 'Borrowing limit',  body: 'Undergraduate students may borrow up to 3 books at a time. Duration: 14 days, renewable once in person.' },
  { title: 'Late returns',     body: 'A fine of ₹2 per day is charged for late returns. Borrowing is suspended until the fine is cleared.' },
  { title: 'Reference only',   body: 'Reference books, bound journals and the project report archive are not for loan. In-library use only.' },
  { title: 'Silence',          body: 'The reading room is a silent zone. Calls and group discussions belong outside.' },
  { title: 'Food & drink',     body: 'Not permitted inside the library. Water bottles are allowed.' },
  { title: 'Book care',        body: 'Report damage or missing pages before borrowing. Damage is charged at replacement cost.' },
]

const LIBRARY_COLLECTIONS = [
  { name: 'Core CS & IT texts',       count: '~1,200 titles',  note: 'Algorithms, systems, networks, databases, ML, compilers, security.' },
  { name: 'Reference collection',     count: '~300 titles',    note: 'Handbooks, dictionaries, syllabus-mapped reference books.' },
  { name: 'Bound journals',           count: '1995 – present', note: 'Back issues of IEEE, ACM, Springer publications.' },
  { name: 'Project reports',          count: '2003 – 2025',    note: 'Archived UG project reports. Useful for final-year students.' },
  { name: 'Previous question papers', count: 'Last 10 years',  note: 'University exam papers for the IT programme.' },
  { name: 'General reading',          count: '~200 titles',    note: 'Non-technical books — fiction, biography, current affairs.' },
]

const LIBRARY_ERESOURCES = [
  { name: 'IEEE Xplore',              access: 'Campus network', note: 'Full-text access to IEEE journals and conference proceedings.' },
  { name: 'ACM Digital Library',      access: 'Campus network', note: 'All ACM publications, including SIGCOMM, SIGGRAPH, SOSP.' },
  { name: 'Springer Link',            access: 'Campus network', note: 'Springer journals and LNCS volumes.' },
  { name: 'NPTEL / SWAYAM',           access: 'Public',         note: 'Free online lectures and courses from IITs and IISc.' },
  { name: 'DELNET',                   access: 'On request',     note: 'Inter-library loan and remote access. Ask the librarian.' },
  { name: 'CUSAT Digital Repository', access: 'Public',         note: 'Theses, dissertations and old project reports.' },
]

export function Library() {
  return (
    <Section id="library" num="15" kicker="Resources" title="Division Library"
      lede="The IT Division maintains its own reference library alongside the central CUSAT library — smaller, focused on computing and IT, and open to all students of the department.">

      <div className="cols">
        <div>
          <SubHead>Opening hours</SubHead>
          <div className="lib-hours">
            {LIBRARY_HOURS.map((h) => (
              <div className="lib-hour-row" key={h.day}>
                <span>{h.day}</span>
                <strong>{h.time}</strong>
              </div>
            ))}
          </div>
          <p className="muted small" style={{ marginTop: 16 }}>
            The library is closed during semester breaks, public holidays and
            university exam weeks.
          </p>
        </div>

        <div>
          <SubHead>Where to find it</SubHead>
          <div className="map-block">
            <div className="label" style={{ marginBottom: 10 }}>Location</div>
            Ground floor, IT Block<br />
            Division of Information Technology<br />
            School of Engineering, CUSAT<br />
            South Kalamassery, Kochi — 682 022
          </div>
          <p className="muted small" style={{ marginTop: 16 }}>
            Entry from the corridor opposite the S5 classroom. Bring your college
            ID — the librarian logs every visit.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 64 }}>
        <SubHead>Collection</SubHead>
        <div className="home-grid-2">
          {LIBRARY_COLLECTIONS.map((c) => (
            <div className="home-card" key={c.name}>
              <div className="home-card-title">{c.name}</div>
              <div className="lib-count">{c.count}</div>
              <p className="home-card-body" style={{ marginTop: 10 }}>{c.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 64 }}>
        <SubHead>Online resources</SubHead>
        <p className="muted small" style={{ marginBottom: 20 }}>
          Most journals are accessible from any campus-network computer. Off-campus
          access requires a CUSAT proxy account — ask the department office.
        </p>
        <div className="lib-eresources">
          {LIBRARY_ERESOURCES.map((r) => (
            <div className="lib-eresource" key={r.name}>
              <div>
                <div className="lib-eresource-name">{r.name}</div>
                <div className="lib-eresource-note">{r.note}</div>
              </div>
              <span className="lib-eresource-access">{r.access}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 64 }}>
        <SubHead>Rules</SubHead>
        <div className="row-list">
          {LIBRARY_RULES.map((r) => (
            <div className="row" key={r.title}>
              <span className="row-date">Rule</span>
              <div>
                <div className="row-title">{r.title}</div>
                <div className="row-meta" style={{ marginTop: 6 }}>{r.body}</div>
              </div>
              <span className="row-meta" />
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 56 }}>
        <SubHead>Contact the librarian</SubHead>
        <div className="contact-card" style={{ maxWidth: 480 }}>
          <div className="label">Library desk</div>
          <a href="mailto:library.it@cusat.ac.in">library.it@cusat.ac.in</a>
          <div className="label" style={{ marginTop: 20 }}>Phone</div>
          <div>+91 484 2577 215</div>
          <div className="label" style={{ marginTop: 20 }}>Walk-in hours</div>
          <div>Mon–Fri, 10:00 – 16:00</div>
        </div>
      </div>
    </Section>
  )
}

/* ============================================================
   EVENT COUNTDOWN HOOK
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
    return {
      past: false,
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    }
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
    if (step === 1) { if (!validateStep1()) return; setStep(2) }
    else { onConfirm(); onClose() }
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
          <div className="reg-step" data-active={step >= 1}><span className="reg-step-num">01</span> Your details</div>
          <div className="reg-step" data-active={step >= 2}><span className="reg-step-num">02</span> Confirm</div>
        </div>
        <div className="reg-body">
          {step === 1 && (
            <div className="form">
              <div className="field">
                <label htmlFor="reg-name">Full name</label>
                <input id="reg-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name as it appears on college records" />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="reg-email">Email</label>
                <input id="reg-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="reg-college">College</label>
                  <input id="reg-college" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
                </div>
                <div className="field">
                  <label htmlFor="reg-team">Team name (optional)</label>
                  <input id="reg-team" value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} placeholder="If this is a team event" />
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="reg-summary">
                <div className="reg-summary-row"><span className="label">Event</span><span>{event.title}</span></div>
                <div className="reg-summary-row"><span className="label">When</span><span>{event.date} at {event.time}</span></div>
                <div className="reg-summary-row"><span className="label">Where</span><span>{event.venue}</span></div>
                <div className="reg-summary-row"><span className="label">Name</span><span>{form.name}</span></div>
                <div className="reg-summary-row"><span className="label">Email</span><span>{form.email}</span></div>
                {form.team && <div className="reg-summary-row"><span className="label">Team</span><span>{form.team}</span></div>}
              </div>
              <p className="muted small">By registering you agree to receive event updates by email. You can withdraw at any time by writing to the association.</p>
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