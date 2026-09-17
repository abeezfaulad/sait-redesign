import React, { useMemo, useState } from 'react'
import { Section, ArrowLink, Initials, SubHead, Drawer, SearchInput, Empty, Kbd, useToast } from './ui.jsx'
import { useLocalStorage, useQueryParam } from './hooks.js'
import {
  STATS, QUICK_LINKS, FACULTY, EXEC, TEAMS,
  EVENT_CATEGORIES, UPCOMING_EVENTS, PAST_EVENTS,
  PLACEMENT_STATS, RECRUITERS, CAREER_RESOURCES,
  ALUMNI, ACHIEVEMENTS,
  ACTIVITY_TYPES, SEED_ACTIVITIES, LEADERBOARD,
  NOTIFICATIONS,
} from './data.js'

/* ============================================================
   HOME
   ============================================================ */
export function Home({ onNavigate, onOpenPalette }) {
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-inner">
          <span className="label">CUSAT · School of Engineering · Division of Information Technology</span>
          <h1 className="display-xl">Students Association of Information&nbsp;Technology</h1>
          <p className="lede">
            SAIT represents the students of the IT Division at CUSAT — running
            events, publishing notices, connecting students with industry, and
            keeping a record of what this department's students build.
          </p>
          <div className="hero-actions">
            <button className="btn" onClick={() => onNavigate('events')}>Upcoming events <span aria-hidden="true">→</span></button>
            <button className="btn ghost" onClick={() => onNavigate('logger')}>Open activity logger</button>
            <button className="btn ghost" onClick={onOpenPalette}>
              <span>Search</span> <Kbd>Ctrl</Kbd><Kbd>K</Kbd>
            </button>
          </div>
          <div className="stat-row">
            {STATS.map((s) => (
              <div className="stat" key={s.key}>
                <div className="value">{s.value}</div>
                <div className="key">{s.key}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section id="quick" num="01" kicker="Start here" title="The four things students come here for.">
        <div className="row-list">
          {QUICK_LINKS.map((l) => (
            <div className="row" key={l.label}>
              <span className="row-date">Shortcut</span>
              <span className="row-title">{l.label}</span>
              <span className="row-meta">
                <ArrowLink href={l.href} onClick={() => onNavigate(l.href.slice(1))}>Go</ArrowLink>
              </span>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

/* ============================================================
   ABOUT
   ============================================================ */
const RESOURCES = [
  { title: 'B.Tech IT curriculum — 2022 scheme', note: 'Full course structure, credits, and electives for all eight semesters.' },
  { title: 'Academic calendar, Odd Semester 2026', note: 'Term dates, holidays, internal exam windows, and result publication dates.' },
  { title: 'Examination guidelines and timetable', note: 'University exam rules, hall ticket instructions, and the current timetable.' },
  { title: 'Division library and lab access rules', note: 'Access hours, borrowing limits, and lab equipment policy.' },
  { title: 'Scholarship and fee notifications', note: 'State and central scholarship schemes, deadlines, and required documents.' },
]

export function About() {
  const [open, setOpen] = useState(0)
  return (
    <Section id="about" num="02" kicker="About" title="The department and the association."
      lede="The Division of Information Technology was established within the School of Engineering to build strong foundations in computing, systems and software. SAIT is its student body.">
      <div className="cols">
        <div>
          <SubHead>Vision</SubHead>
          <p className="muted">To be a division known for students who build — technically rigorous, professionally prepared, and useful to the communities they go on to serve.</p>
        </div>
        <div>
          <SubHead>Mission</SubHead>
          <ul className="muted" style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
            <li>Run a consistent calendar of technical and cultural events.</li>
            <li>Maintain an open record of student activity and achievement.</li>
            <li>Support placement preparation through structured resources.</li>
            <li>Keep the alumni network connected to the department.</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: 56 }}>
        <SubHead>Brief history</SubHead>
        <p className="muted" style={{ maxWidth: '68ch' }}>
          The IT Division at SOE, CUSAT has run an undergraduate programme in Information Technology for over two decades. SAIT was formed by the students of the division as a coordinating body for events, industry interaction and department publications. It has since grown into an elected committee with dedicated sub-teams for technology, media, events, public relations and content.
        </p>
      </div>

      <div style={{ marginTop: 56 }}>
        <SubHead>Faculty and administration</SubHead>
        <div className="people-grid">
          {FACULTY.map((f) => (
            <div className="person" key={f.name}>
              <Initials name={f.name} />
              <div>
                <div className="p-name">{f.name}</div>
                <div className="p-role">{f.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 56 }}>
        <SubHead>Academic resources</SubHead>
        <div>
          {RESOURCES.map((r, i) => {
            const isOpen = open === i
            return (
              <div className="acc-item" key={r.title} data-open={isOpen}>
                <button className="acc-head" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <div>
                    <div className="acc-title">{r.title}</div>
                    <div className="acc-date" style={{ marginTop: 4 }}>Resource</div>
                  </div>
                  <span className="acc-plus" aria-hidden="true">+</span>
                </button>
                {isOpen && (
                  <div className="acc-body">
                    {r.note}
                    <div style={{ marginTop: 14 }}><ArrowLink>Open resource</ArrowLink></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

/* ============================================================
   PEOPLE
   ============================================================ */
export function People() {
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const filter = (arr) => !needle ? arr : arr.filter((p) =>
    (p.name + ' ' + p.role).toLowerCase().includes(needle)
  )
  const exec = filter(EXEC)
  const facultyShown = filter(FACULTY)

  return (
    <Section id="people" num="03" kicker="Association & people" title="Who runs SAIT."
      lede="The executive committee is elected annually. Sub-teams are open to all students of the division and run throughout the academic year.">
      <div className="search-row">
        <SearchInput value={q} onChange={setQ} placeholder="Search by name or role…" label="Search people" />
      </div>

      {facultyShown.length > 0 && (
        <>
          <SubHead>Faculty</SubHead>
          <div className="people-grid" style={{ marginBottom: 48 }}>
            {facultyShown.map((f) => (
              <div className="person" key={f.name}>
                <Initials name={f.name} />
                <div>
                  <div className="p-name">{f.name}</div>
                  <div className="p-role">{f.role}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <SubHead>Executive committee 2026–27</SubHead>
      {exec.length === 0 ? (
        <Empty>No committee members match "{q}".</Empty>
      ) : (
        <div className="people-grid">
          {exec.map((p) => (
            <div className="person" key={p.name}>
              <Initials name={p.name} />
              <div>
                <div className="p-name">{p.name}</div>
                <div className="p-role">{p.role}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 64 }}>
        <SubHead>Sub-teams</SubHead>
        <div className="cols">
          {TEAMS.map((t) => (
            <div key={t.name}>
              <div className="display-m" style={{ marginBottom: 14 }}>{t.name}</div>
              <div className="mono" style={{ color: 'var(--text-3)', marginBottom: 10 }}>Lead — {t.lead}</div>
              <div className="muted small" style={{ lineHeight: 1.9 }}>{t.members.join(' · ')}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ============================================================
   EVENTS
   ============================================================ */
function eventDateParts(d) {
  const m = d.match(/(\d+)\s+([A-Za-z]+)\s+(\d+)/)
  if (!m) return null
  return { day: m[1], mon: m[2].slice(0, 3).toUpperCase(), year: m[3] }
}

export function Events() {
  const [filter, setFilter] = useQueryParam('eventcat', 'All')
  const [view, setView] = useQueryParam('eventview', 'list')
  const [active, setActive] = useState(null)

  const upcoming = useMemo(
    () => (filter === 'All' ? UPCOMING_EVENTS : UPCOMING_EVENTS.filter((e) => e.category === filter)),
    [filter]
  )

  const pastWithDetails = useMemo(
    () => PAST_EVENTS.map((e) => ({ ...e, kind: 'past' })),
    []
  )

  return (
    <Section id="events" num="04" kicker="Events & activities" title="What's on, and what's already happened."
      lede="Upcoming events list venue, time and registration details. The archive is organised by year and category.">

      <div className="toolbar">
        <div className="filters">
          {EVENT_CATEGORIES.map((c) => (
            <button key={c} data-active={filter === c} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
        <div className="view-toggle" role="tablist" aria-label="View">
          <button role="tab" aria-selected={view === 'list'} data-active={view === 'list'} onClick={() => setView('list')}>List</button>
          <button role="tab" aria-selected={view === 'calendar'} data-active={view === 'calendar'} onClick={() => setView('calendar')}>Calendar</button>
        </div>
      </div>

      <SubHead>Upcoming</SubHead>

      {view === 'list' && (
        <div className="row-list">
          {upcoming.length === 0 && <Empty>No upcoming events in this category.</Empty>}
          {upcoming.map((e) => (
            <button className="row row-btn" key={e.title} onClick={() => setActive({ ...e, kind: 'upcoming' })}>
              <div>
                <div className="row-date">{e.date}</div>
                <div className="row-date" style={{ marginTop: 4, color: 'var(--text-3)' }}>{e.time}</div>
              </div>
              <div>
                <div className="row-title">{e.title}</div>
                <div className="row-meta" style={{ marginTop: 8 }}>{e.venue} · {e.note}</div>
              </div>
              <div className="row-meta"><span className="tag accent">{e.category}</span></div>
            </button>
          ))}
        </div>
      )}

      {view === 'calendar' && (
        <div className="cal-grid">
          {upcoming.length === 0 && <Empty>No upcoming events in this category.</Empty>}
          {upcoming.map((e) => {
            const p = eventDateParts(e.date)
            return (
              <button className="cal-cell" key={e.title} onClick={() => setActive({ ...e, kind: 'upcoming' })}>
                <div className="cal-date">
                  <span className="cal-day">{p?.day}</span>
                  <span className="cal-mon">{p?.mon}</span>
                </div>
                <div className="cal-title">{e.title}</div>
                <div className="cal-meta">{e.time} · {e.venue}</div>
              </button>
            )
          })}
        </div>
      )}

      <div style={{ marginTop: 64 }}>
        <SubHead>Archive — past events</SubHead>
        <div className="row-list">
          {pastWithDetails.map((e) => (
            <button className="row row-btn" key={e.title} onClick={() => setActive(e)}>
              <span className="row-date">{e.date}</span>
              <span className="row-title">{e.title}</span>
              <span className="row-meta">{e.category}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 48 }}>
        <SubHead>Flagship events</SubHead>
        <div className="cols">
          {[
            { t: 'HackIT', d: "The division's annual 24-hour hackathon. Team event, open to all years and to students from other colleges in Kerala." },
            { t: 'CodeFest', d: "An inter-college programming contest run in three rounds — screening, online round and an on-campus final." },
            { t: 'InnoVIT', d: "Project expo for final-year students, judged by faculty and industry guests from Kochi's technology sector." },
          ].map((x) => (
            <div key={x.t}>
              <div className="display-m">{x.t}</div>
              <p className="muted small" style={{ marginTop: 10 }}>{x.d}</p>
            </div>
          ))}
        </div>
      </div>

      <Drawer
        open={!!active}
        onClose={() => setActive(null)}
        eyebrow={active ? (active.kind === 'upcoming' ? 'Upcoming event' : 'Past event') : ''}
        title={active?.title || ''}
      >
        {active && <EventDetail event={active} />}
      </Drawer>
    </Section>
  )
}

function EventDetail({ event }) {
  const toast = useToast()
  const isPast = event.kind === 'past'
  return (
    <div className="stack-32">
      <div className="detail-grid">
        <div>
          <div className="label">Date</div>
          <div className="detail-value">{event.date}</div>
        </div>
        {event.time && (
          <div>
            <div className="label">Time</div>
            <div className="detail-value">{event.time}</div>
          </div>
        )}
        {event.venue && (
          <div>
            <div className="label">Venue</div>
            <div className="detail-value">{event.venue}</div>
          </div>
        )}
        {event.category && (
          <div>
            <div className="label">Category</div>
            <div className="detail-value">{event.category}</div>
          </div>
        )}
      </div>

      {event.note && <p className="muted">{event.note}</p>}

      {!isPast && (
        <>
          <div className="rule" />
          <div>
            <div className="label" style={{ marginBottom: 10 }}>Registration</div>
            <p className="muted small">
              Register through the department portal. Bring your college ID on the day.
              Team events require all members to be registered together.
            </p>
          </div>
          <div className="detail-actions">
            <button
              className="btn"
              onClick={() => toast.push({
                title: 'Registration link copied',
                body: 'This is a prototype — no real link exists.',
              })}
            >
              Register
            </button>
            <button
              className="btn ghost"
              onClick={() => toast.push({
                title: 'Added to calendar',
                body: `${event.title} · ${event.date}`,
                action: { label: 'Undo', onClick: () => toast.push({ title: 'Removed from calendar' }) },
              })}
            >
              Add to calendar
            </button>
          </div>
        </>
      )}

      {isPast && (
        <>
          <div className="rule" />
          <div>
            <div className="label" style={{ marginBottom: 10 }}>Report</div>
            <p className="muted small">
              Photos and the event report will be published in the department archive.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

/* ============================================================
   PLACEMENTS
   ============================================================ */
export function Placements() {
  const toast = useToast()
  return (
    <Section id="placements" num="05" kicker="Placements & careers" title="Placement records and preparation."
      lede="Figures below reflect the most recent completed placement cycle. Contact the placement cell for verification and detailed reports.">
      <div className="stat-row" style={{ marginTop: 0 }}>
        {PLACEMENT_STATS.map((s) => (
          <div className="stat" key={s.key}>
            <div className="value">{s.value}</div>
            <div className="key">{s.key}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 64 }}>
        <SubHead>Recruiters on campus</SubHead>
        <div className="chip-cloud">
          {RECRUITERS.map((r) => (
            <span className="chip" key={r}>{r}</span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 56 }}>
        <SubHead>Resources</SubHead>
        <div className="row-list">
          {CAREER_RESOURCES.map((r) => (
            <button
              className="row row-btn"
              key={r.label}
              onClick={() => toast.push({
                title: 'Opening resource',
                body: `${r.label} — prototype only.`,
              })}
            >
              <span className="row-date">Document</span>
              <span className="row-title">{r.label}</span>
              <span className="row-meta"><ArrowLink>Open</ArrowLink></span>
            </button>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ============================================================
   ALUMNI
   ============================================================ */
export function Alumni() {
  const [q, setQ] = useState('')
  const [year, setYear] = useState('All')
  const years = useMemo(() => {
    const set = new Set(ALUMNI.map((a) => a.year))
    return ['All', ...Array.from(set).sort((a, b) => b - a)]
  }, [])

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return ALUMNI.filter((a) => {
      if (year !== 'All' && a.year !== year) return false
      if (!needle) return true
      return (a.name + ' ' + a.role + ' ' + a.note).toLowerCase().includes(needle)
    })
  }, [q, year])

  return (
    <Section id="alumni" num="06" kicker="Alumni" title="Where the division's graduates go."
      lede="A rotating spotlight of alumni across batches. If you would like to be listed or to mentor current students, write to the association.">
      <div className="toolbar" style={{ marginBottom: 24 }}>
        <div className="filters">
          {years.map((y) => (
            <button key={y} data-active={year === y} onClick={() => setYear(y)}>
              {y === 'All' ? 'All batches' : `Class of ${y}`}
            </button>
          ))}
        </div>
        <SearchInput value={q} onChange={setQ} placeholder="Search alumni…" label="Search alumni" />
      </div>

      {list.length === 0 ? (
        <Empty>No alumni match the current filter.</Empty>
      ) : (
        <div className="people-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
          {list.map((a) => (
            <div className="person" key={a.name}>
              <Initials name={a.name} />
              <div>
                <div className="p-name">{a.name}</div>
                <div className="p-role">Class of {a.year} · {a.role}</div>
                <p className="muted small" style={{ marginTop: 8 }}>{a.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

/* ============================================================
   ACHIEVEMENTS
   ============================================================ */
export function Achievements() {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return ACHIEVEMENTS
    return ACHIEVEMENTS.filter((a) =>
      (a.title + ' ' + a.who + ' ' + a.year).toLowerCase().includes(needle)
    )
  }, [q])

  const grouped = useMemo(() => {
    const m = new Map()
    for (const a of filtered) {
      if (!m.has(a.year)) m.set(a.year, [])
      m.get(a.year).push(a)
    }
    return Array.from(m.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])

  return (
    <Section id="achievements" num="07" kicker="Achievements" title="Hall of fame."
      lede="Selected achievements by students of the IT Division. The full record is maintained by the department office.">
      <div className="search-row">
        <SearchInput value={q} onChange={setQ} placeholder="Search by title, student, or year…" label="Search achievements" />
      </div>

      {grouped.length === 0 && <Empty>Nothing matches "{q}".</Empty>}

      {grouped.map(([year, items]) => (
        <div key={year} className="year-block">
          <div className="year-rail">
            <span className="year">{year}</span>
          </div>
          <div className="year-items">
            {items.map((a) => (
              <div className="achievement" key={a.title}>
                <div className="ach-title">{a.title}</div>
                <div className="ach-who">{a.who}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Section>
  )
}

/* ============================================================
   ACTIVITY LOGGER
   ============================================================ */
export function ActivityLogger() {
  const toast = useToast()
  const [activities, setActivities] = useLocalStorage('sait.activities', SEED_ACTIVITIES)
  const [typeFilter, setTypeFilter] = useState('All')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: '', date: '', type: 'hackathon', role: '', proof: '' })

  const typeLabel = (id) => ACTIVITY_TYPES.find((t) => t.id === id)?.label ?? id
  const filtered = useMemo(
    () => (typeFilter === 'All' ? activities : activities.filter((a) => a.type === typeFilter)),
    [activities, typeFilter]
  )
  const totals = useMemo(() => {
    const verified = activities.filter((a) => a.status === 'verified')
    return {
      logged: activities.length,
      verified: verified.length,
      points: verified.reduce((s, a) => s + a.points, 0),
    }
  }, [activities])

  function reset() {
    setForm({ title: '', date: '', type: 'hackathon', role: '', proof: '' })
    setEditingId(null)
  }

  function submit(e) {
    e.preventDefault()
    if (!form.title || !form.date || !form.role) return
    const points = ACTIVITY_TYPES.find((t) => t.id === form.type)?.points ?? 10

    if (editingId != null) {
      setActivities((prev) => prev.map((a) =>
        a.id === editingId ? { ...a, ...form, points } : a
      ))
      toast.push({ title: 'Activity updated' })
      reset()
      return
    }

    setActivities((prev) => [
      { id: Date.now(), ...form, status: 'pending', points, who: 'You' },
      ...prev,
    ])
    toast.push({
      title: 'Submitted for verification',
      body: `${form.title} · ${typeLabel(form.type)}`,
    })
    reset()
  }

  function edit(a) {
    setEditingId(a.id)
    setForm({
      title: a.title, date: a.date, type: a.type, role: a.role, proof: a.proof || '',
    })
    window.scrollTo({ top: document.getElementById('logger')?.offsetTop ?? 0, behavior: 'smooth' })
  }

  function remove(a) {
    setActivities((prev) => prev.filter((x) => x.id !== a.id))
    toast.push({
      title: 'Activity removed',
      body: a.title,
      action: {
        label: 'Undo',
        onClick: () => {
          setActivities((prev) => [a, ...prev])
          toast.push({ title: 'Restored' })
        },
      },
    })
  }

  return (
    <Section id="logger" num="08" kicker="Student activity logger" title="Record what you do outside class."
      lede="Submit hackathons, workshops, publications, internships and other activities. Verified entries appear on your profile and count towards the department leaderboard.">
      <div className="cols wide-left">
        <div>
          <SubHead action={editingId && (
            <button className="inline-cancel" onClick={reset}>Cancel edit</button>
          )}>
            {editingId ? 'Edit activity' : 'Submit an activity'}
          </SubHead>
          <form className="form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="al-title">Activity title</label>
              <input id="al-title" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. HackIT 2026 — 2nd place" required />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="al-date">Date</label>
                <input id="al-date" type="date" value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="field">
                <label htmlFor="al-type">Type</label>
                <select id="al-type" value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {ACTIVITY_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label} · {t.points} pts</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="al-role">Your role</label>
              <input id="al-role" value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Team lead, Participant, Co-author" required />
            </div>
            <div className="field">
              <label htmlFor="al-proof">Proof link (optional)</label>
              <input id="al-proof" value={form.proof}
                onChange={(e) => setForm({ ...form, proof: e.target.value })}
                placeholder="Certificate URL, repository, or Drive link" />
            </div>
            <div className="form-actions">
              <button className="btn" type="submit">
                {editingId ? 'Save changes' : 'Submit for verification'}
              </button>
              <span className="form-hint">
                <Kbd>Enter</Kbd> to submit
              </span>
            </div>
          </form>
        </div>

        <div>
          <SubHead>Your dashboard</SubHead>
          <div className="stat-row" style={{ marginTop: 0, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="stat">
              <div className="value" style={{ fontSize: '2rem' }}>{totals.logged}</div>
              <div className="key">Logged</div>
            </div>
            <div className="stat">
              <div className="value" style={{ fontSize: '2rem' }}>{totals.verified}</div>
              <div className="key">Verified</div>
            </div>
            <div className="stat">
              <div className="value" style={{ fontSize: '2rem' }}>{totals.points}</div>
              <div className="key">Points</div>
            </div>
          </div>

          <div className="filters" style={{ marginTop: 40 }}>
            {['All', ...ACTIVITY_TYPES.map((t) => t.id)].map((t) => (
              <button key={t} data-active={typeFilter === t} onClick={() => setTypeFilter(t)}>
                {t === 'All' ? 'All' : typeLabel(t)}
              </button>
            ))}
          </div>

          <div className="row-list" style={{ borderTop: 0, marginTop: 8 }}>
            {filtered.length === 0 && <Empty>No activities in this category.</Empty>}
            {filtered.map((a) => (
              <div className="feed-item" key={a.id}>
                <div className="fi-top">
                  <span className="fi-title">{a.title}</span>
                  <span className={`status ${a.status === 'verified' ? 'verified' : ''}`}>{a.status}</span>
                </div>
                <div className="fi-meta">{a.date} · {typeLabel(a.type)} · {a.role} · +{a.points} pts</div>
                <div className="fi-bottom">
                  <span className="fi-meta" style={{ color: 'var(--text-3)' }}>Submitted by {a.who}</span>
                  {a.who === 'You' && (
                    <span className="fi-actions">
                      <button onClick={() => edit(a)}>Edit</button>
                      <button onClick={() => remove(a)} className="danger">Delete</button>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 72 }}>
        <Leaderboard />
      </div>
    </Section>
  )
}

function Leaderboard() {
  const [sortKey, setSortKey] = useState('points')
  const [dir, setDir] = useState('desc')
  const rows = useMemo(() => {
    const copy = [...LEADERBOARD]
    copy.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey]
      if (sortKey === 'points') { va = +va; vb = +vb }
      else { va = String(va).toLowerCase(); vb = String(vb).toLowerCase() }
      if (va < vb) return dir === 'asc' ? -1 : 1
      if (va > vb) return dir === 'asc' ? 1 : -1
      return 0
    })
    return copy
  }, [sortKey, dir])

  function toggle(k) {
    if (sortKey === k) setDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(k); setDir(k === 'points' ? 'desc' : 'asc') }
  }

  const indicator = (k) => sortKey === k ? (dir === 'asc' ? ' ↑' : ' ↓') : ''

  return (
    <>
      <SubHead>Department leaderboard — 2026–27</SubHead>
      <table>
        <thead>
          <tr>
            <th style={{ width: 60 }}>#</th>
            <th>
              <button className="th-btn" onClick={() => toggle('name')}>
                Student{indicator('name')}
              </button>
            </th>
            <th style={{ textAlign: 'right' }}>
              <button className="th-btn" onClick={() => toggle('points')}>
                Points{indicator('points')}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((l, i) => (
            <tr key={l.rank}>
              <td className="mono">{String(i + 1).padStart(2, '0')}</td>
              <td>{l.name}</td>
              <td className="mono" style={{ textAlign: 'right' }}>{l.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

/* ============================================================
   NOTIFICATIONS
   ============================================================ */
export function Notifications() {
  const [open, setOpen] = useState(0)
  const [read, setRead] = useLocalStorage('sait.notices.read', [])

  function toggleRead(idx) {
    setRead((prev) => prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx])
  }
  function markAllRead() {
    setRead(NOTIFICATIONS.map((_, i) => i))
  }
  function markAllUnread() { setRead([]) }

  const unread = NOTIFICATIONS.length - read.length

  return (
    <Section id="notifications" num="09" kicker="Notifications & announcements" title="Notices from the department and the association.">
      <div className="notices-head">
        <span className="label">{unread} unread of {NOTIFICATIONS.length}</span>
        <div className="notices-actions">
          {unread > 0 && <button className="btn ghost" onClick={markAllRead}>Mark all read</button>}
          {read.length > 0 && <button className="btn ghost" onClick={markAllUnread}>Mark all unread</button>}
        </div>
      </div>
      <div>
        {NOTIFICATIONS.map((n, i) => {
          const isOpen = open === i
          const isRead = read.includes(i)
          return (
            <div className="acc-item" key={n.title} data-open={isOpen} data-read={isRead}>
              <div className="acc-row">
                <button className="acc-head" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <div>
                    <div className="acc-title">
                      {!isRead && <span className="unread-dot" aria-label="Unread" />}
                      {n.title}
                    </div>
                    <div className="acc-date" style={{ marginTop: 6 }}>{n.date}</div>
                  </div>
                  <span className="acc-plus" aria-hidden="true">+</span>
                </button>
                <button
                  className="acc-read-toggle"
                  onClick={() => toggleRead(i)}
                  aria-label={isRead ? 'Mark unread' : 'Mark read'}
                >
                  {isRead ? 'Unread' : 'Read'}
                </button>
              </div>
              {isOpen && <div className="acc-body">{n.body}</div>}
            </div>
          )
        })}
      </div>
    </Section>
  )
}