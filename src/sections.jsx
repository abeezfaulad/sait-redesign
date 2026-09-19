import React, { useMemo, useState } from 'react'
import { Section, ArrowLink, Initials, SubHead, Drawer, SearchInput, Empty, Kbd, useToast } from './ui.jsx'
import { useLocalStorage, useQueryParam } from './hooks.js'
import { useEventCountdown, RegistrationModal } from './extras.jsx'
import { Constellation, Marquee, Typewriter, MagneticButton, Parallax } from './fancy.jsx'
import { useAuth } from './auth.jsx'
import {
  DailyQuote, WeatherWidget, OnlineCounter, AchievementsPanel,
  WishWall, useGreeting,
} from './widgets.jsx'
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
export function Home({ onNavigate, onOpenPalette, onOpenAuth }) {
  const greeting = useGreeting()

  return (
    <>
      <section className="hero" id="home">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-grid" />
          <Parallax speed={0.08} className="hero-glow">
            <div className="hero-glow-orb" />
          </Parallax>
        </div>
        <Constellation />
        <div className="container hero-inner">
          <span className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            {greeting} · CUSAT · Division of Information Technology
          </span>
          <h1 className="display-xl">
            Students<br />
            Association of<br />
            <em>
              <Typewriter phrases={[
                'Information Technology',
                'builders & researchers',
                'the IT Division',
                'SAIT · CUSAT',
              ]} />
            </em>
          </h1>
          <p className="lede">
            SAIT is the elected student body of the IT Division at the School of
            Engineering, CUSAT. We run technical events, publish department notices,
            connect students with industry, and keep an open record of everything
            this department's students build.
          </p>
          <div className="hero-actions">
            <MagneticButton className="btn" onClick={() => onNavigate('events')}>
              Upcoming events <span aria-hidden="true">→</span>
            </MagneticButton>
            <MagneticButton className="btn ghost" onClick={onOpenAuth}>
              Create account
            </MagneticButton>
            <button className="btn ghost" onClick={onOpenPalette}>
              <span>Search</span> <Kbd>Ctrl</Kbd><Kbd>K</Kbd>
            </button>
          </div>
          <div className="stat-row">
            {STATS.map((s) => (
              <div className="stat" key={s.key}>
                <div className="value">{s.value}{s.suffix}</div>
                <div className="key">{s.key}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee items={[
        'HackIT 2026', 'Registrations open', 'CodeFest', 'Placement season',
        'InnoVIT', 'Alumni network', 'TechTalks', 'Workshops every month',
        'Activity logger open', 'Department notices',
      ]} />

      <Section id="daily" num="01" kicker="Today" title="A snapshot of the day.">
        <div className="dash-row">
          <DailyQuote />
          <WeatherWidget />
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <OnlineCounter />
        </div>
        <div style={{ marginTop: 24 }}>
          <AchievementsPanel />
        </div>
      </Section>

      <Section id="quick" num="02" kicker="Start here" title="The four things students come here for.">
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

      <Section id="what-we-do" num="03" kicker="What we do" title="Four things SAIT does for the IT Division.">
        <div className="home-grid-2">
          <div className="home-card">
            <div className="home-card-num">01</div>
            <div className="home-card-title">Run the events calendar</div>
            <p className="home-card-body">
              From HackIT — our 24-hour annual hackathon — to monthly workshops, industry
              TechTalks, CodeFest, and the InnoVIT project expo. Over 30 events a year,
              all open to students of the division.
            </p>
          </div>
          <div className="home-card">
            <div className="home-card-num">02</div>
            <div className="home-card-title">Keep an open record</div>
            <p className="home-card-body">
              Every hackathon win, paper publication, internship and workshop is logged
              in the Activity Logger — verified, timestamped, and tied to the student who
              did the work. A public leaderboard tracks department-wide standings.
            </p>
          </div>
          <div className="home-card">
            <div className="home-card-num">03</div>
            <div className="home-card-title">Connect with industry</div>
            <p className="home-card-body">
              SAIT works with the placement cell to bring recruiters to campus, organise
              mock interviews, publish placement statistics, and maintain a directory of
              alumni willing to refer and mentor current students.
            </p>
          </div>
          <div className="home-card">
            <div className="home-card-num">04</div>
            <div className="home-card-title">Publish the department's voice</div>
            <p className="home-card-body">
              Notices, deadlines, announcements, the annual department journal, and
              short-form updates from the executive committee — all in one place,
              written by students, for students.
            </p>
          </div>
        </div>
      </Section>

      <Section id="home-notices" num="04" kicker="Latest" title="Recent notices.">
        <div className="row-list">
          {NOTIFICATIONS.slice(0, 4).map((n) => (
            <div className="row" key={n.title}>
              <span className="row-date">{n.date}</span>
              <div>
                <div className="row-title">{n.title}</div>
                <div className="row-meta" style={{ marginTop: 6 }}>{n.body.slice(0, 120)}…</div>
              </div>
              <span className="row-meta">
                <ArrowLink onClick={() => onNavigate('notifications')}>Read</ArrowLink>
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <ArrowLink onClick={() => onNavigate('notifications')}>All notices →</ArrowLink>
        </div>
      </Section>

      <Section id="home-events" num="05" kicker="Coming up" title="Next on the calendar.">
        <div className="row-list">
          {UPCOMING_EVENTS.slice(0, 3).map((e) => (
            <div className="row" key={e.title}>
              <span className="row-date">{e.date}</span>
              <div>
                <div className="row-title">{e.title}</div>
                <div className="row-meta" style={{ marginTop: 6 }}>{e.venue} · {e.time}</div>
              </div>
              <span className="row-meta">
                <span className="tag accent">{e.category}</span>
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <ArrowLink onClick={() => onNavigate('events')}>See all events →</ArrowLink>
        </div>
      </Section>

      <Section id="why" num="06" kicker="Why SAIT" title="What the association is actually for.">
        <div className="cols">
          <div>
            <SubHead>For first years</SubHead>
            <p className="muted">
              SAIT is where you find out what the department is really about — beyond
              the syllabus. Your first hackathon, your first Git workshop, your first
              time presenting something you built. The people who run these events
              were first years twelve months ago.
            </p>
          </div>
          <div>
            <SubHead>For second and third years</SubHead>
            <p className="muted">
              This is where you build a public record. Every activity you log is
              evidence — for placements, for higher studies, for internships. The
              leaderboard isn't a competition; it's a running list of who has been
              doing the work, visible to faculty and recruiters.
            </p>
          </div>
          <div>
            <SubHead>For alumni</SubHead>
            <p className="muted">
              The alumni network page is the beginning of a longer directory. If you
              would like to mentor current students, speak at a TechTalk, or list
              your company as a recruiter, write to the association.
            </p>
          </div>
          <div>
            <SubHead>For the department</SubHead>
            <p className="muted">
              SAIT maintains the historical record that the department office does not
              have bandwidth for — who won what, when, and against whom. It exists to
              make the division's students visible.
            </p>
          </div>
        </div>
      </Section>

      <WishWall />
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

const FACILITIES = [
  { name: 'Computing Labs', detail: 'Three labs with 120+ workstations, running Linux and Windows. Available for project use outside class hours.' },
  { name: 'GPU Server', detail: 'Shared access to a GPU node for machine learning and computer vision coursework and projects.' },
  { name: 'Division Library', detail: 'Reference collection focused on systems, networks, algorithms and software engineering. Open 09:30–16:30 on working days.' },
  { name: 'Seminar Hall', detail: '100-seat hall used for TechTalks, workshops, and student presentations.' },
  { name: 'Project Rooms', detail: 'Shared workspace for final-year project teams during their project semesters.' },
  { name: 'High-speed Network', detail: 'Campus-wide fibre backbone. Wi-Fi available across the IT block and library.' },
]

const TIMELINE = [
  { year: '2001', event: 'Division of Information Technology established within SOE, CUSAT.' },
  { year: '2003', event: 'First B.Tech IT batch graduates. Department grows to four faculty members.' },
  { year: '2008', event: 'Formal student body formed — coordinating committee for department events.' },
  { year: '2012', event: 'First HackIT. Twenty-two students across four teams participate.' },
  { year: '2015', event: "SAIT given official recognition as the division's student association." },
  { year: '2018', event: 'Launch of InnoVIT project expo. Alumni network formally established.' },
  { year: '2021', event: 'First fully online HackIT during the pandemic. 82 teams from Kerala participate.' },
  { year: '2024', event: 'Alumni mentorship program begins. Placement cell and SAIT formalise collaboration.' },
  { year: '2026', event: 'Activity Logger goes live. Open record of department achievements.' },
]

const CURRICULUM = [
  { semester: '1–2', focus: 'Foundations', detail: 'Programming in C, Discrete Mathematics, Digital Systems, Data Structures, basic electronics and communication.' },
  { semester: '3–4', focus: 'Core systems', detail: 'Operating Systems, Computer Networks, Database Systems, Object-Oriented Programming, Automata Theory, Design & Analysis of Algorithms.' },
  { semester: '5–6', focus: 'Applied computing', detail: 'Software Engineering, Web Technologies, Machine Learning, Computer Graphics, Compiler Design, elective streams begin.' },
  { semester: '7–8', focus: 'Specialisation & project', detail: 'Electives across systems, AI, security, and cloud. Two-semester capstone project and internship.' },
]

const TABS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="5" height="5" rx="1" />
        <rect x="9" y="2" width="5" height="5" rx="1" />
        <rect x="2" y="9" width="5" height="5" rx="1" />
        <rect x="9" y="9" width="5" height="5" rx="1" />
      </svg>
    ),
  },
  {
    id: 'facilities',
    label: 'Facilities',
    icon: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 14V5l6-3 6 3v9" />
        <rect x="6" y="9" width="4" height="5" />
        <line x1="5" y1="6" x2="5" y2="7" />
        <line x1="11" y1="6" x2="11" y2="7" />
      </svg>
    ),
  },
  {
    id: 'curriculum',
    label: 'Curriculum',
    icon: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h6a2 2 0 0 1 2 2v8H5a2 2 0 0 0-2 2V3z" />
        <path d="M13 3h-2a2 2 0 0 0-2 2v10a2 2 0 0 1 2-2h2V3z" />
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'History',
    icon: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="6" />
        <polyline points="8,4 8,8 11,10" />
      </svg>
    ),
  },
]

export function About() {
  const [open, setOpen] = useState(0)
  const [tab, setTab] = useState('overview')
  const tabIndex = TABS.findIndex((t) => t.id === tab)

  return (
    <Section id="about" num="02" kicker="About" title="The department and the association."
      lede="The Division of Information Technology was established within the School of Engineering, CUSAT, to build strong foundations in computing, systems and software. SAIT is its student body.">

      <div
        className="about-tabs"
        style={{ '--tab-index': tabIndex, '--tab-count': TABS.length }}
        role="tablist"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            data-active={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            <span className="about-tab-icon">{t.icon}</span>
            <span className="about-tab-label">{t.label}</span>
          </button>
        ))}
        <span className="about-tabs-indicator" aria-hidden="true" />
      </div>

      <div className="about-tab-content" key={tab}>
        {tab === 'overview' && (
          <>
            <div className="cols">
              <div>
                <SubHead>Vision</SubHead>
                <p className="muted">
                  To be a division known for students who build — technically rigorous,
                  professionally prepared, and useful to the communities they go on to
                  serve.
                </p>
              </div>
              <div>
                <SubHead>Mission</SubHead>
                <ul className="muted" style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
                  <li>Run a consistent calendar of technical and cultural events.</li>
                  <li>Maintain an open record of student activity and achievement.</li>
                  <li>Support placement preparation through structured resources.</li>
                  <li>Keep the alumni network connected to the department.</li>
                  <li>Publish honest, useful information in one place.</li>
                </ul>
              </div>
            </div>

            <div style={{ marginTop: 56 }}>
              <SubHead>The department</SubHead>
              <p className="muted" style={{ maxWidth: '72ch' }}>
                The Division of Information Technology sits within the School of Engineering
                at Cochin University of Science and Technology. It offers a four-year
                B.Tech programme in Information Technology, admitting 60 students per year
                through the Kerala state engineering entrance. The division has graduated
                over two thousand engineers since its first batch in 2003.
              </p>
              <p className="muted" style={{ maxWidth: '72ch', marginTop: 16 }}>
                The department's research spans systems, distributed computing, machine
                learning, information security and data engineering. Faculty publish
                regularly and supervise both undergraduate capstone projects and PhD
                candidates under the university's research programmes.
              </p>
            </div>

            <div style={{ marginTop: 56 }}>
              <SubHead>The association</SubHead>
              <p className="muted" style={{ maxWidth: '72ch' }}>
                SAIT — the Students Association of Information Technology — is the elected
                student body of the division. It exists for three purposes: to run the
                events calendar, to maintain the historical record of what the division's
                students achieve, and to act as a bridge between students, faculty,
                alumni, and industry.
              </p>
              <p className="muted" style={{ maxWidth: '72ch', marginTop: 16 }}>
                The association is led by an elected executive committee, supported by
                five sub-teams (Tech, Media, Events, PR, Content), and advised by a staff
                coordinator. Elections happen annually at the start of the academic year.
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
          </>
        )}

        {tab === 'facilities' && (
          <>
            <p className="muted" style={{ maxWidth: '72ch', marginBottom: 32 }}>
              The IT Division occupies its own block within the School of Engineering,
              with dedicated teaching labs, a seminar hall, project rooms and a small
              reference library. All facilities are available to students of the division
              during working hours.
            </p>
            <div className="home-grid-2">
              {FACILITIES.map((f, i) => (
                <div className="home-card" key={f.name} style={{ '--i': i }}>
                  <div className="home-card-title">{f.name}</div>
                  <p className="home-card-body">{f.detail}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'curriculum' && (
          <>
            <p className="muted" style={{ maxWidth: '72ch', marginBottom: 32 }}>
              The B.Tech IT programme runs over eight semesters and follows the 2022
              scheme. The first two years build mathematical and systems foundations;
              the last two shift into specialisation, electives, and a two-semester
              capstone project.
            </p>
            <div className="row-list">
              {CURRICULUM.map((c, i) => (
                <div className="row" key={c.semester} style={{ '--i': i }}>
                  <span className="row-date">Sem {c.semester}</span>
                  <div>
                    <div className="row-title">{c.focus}</div>
                    <div className="row-meta" style={{ marginTop: 8 }}>{c.detail}</div>
                  </div>
                  <span className="row-meta" />
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'history' && (
          <div className="timeline">
            {TIMELINE.map((t, i) => (
              <div className="timeline-item" key={t.year} style={{ '--i': i }}>
                <div className="timeline-year">{t.year}</div>
                <div className="timeline-dot" aria-hidden="true" />
                <div className="timeline-body">{t.event}</div>
              </div>
            ))}
          </div>
        )}
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
  const filter = (arr) => !needle ? arr : arr.filter((p) => (p.name + ' ' + p.role).toLowerCase().includes(needle))
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
  const toast = useToast()
  const [filter, setFilter] = useQueryParam('eventcat', 'All')
  const [view, setView] = useQueryParam('eventview', 'list')
  const [active, setActive] = useState(null)
  const [registering, setRegistering] = useState(null)
  const [bookmarks, setBookmarks] = useLocalStorage('sait.bookmarks', [])

  const upcoming = useMemo(
    () => (filter === 'All' ? UPCOMING_EVENTS : UPCOMING_EVENTS.filter((e) => e.category === filter)),
    [filter]
  )
  const pastWithDetails = useMemo(() => PAST_EVENTS.map((e) => ({ ...e, kind: 'past' })), [])

  const nextEvent = upcoming[0]
  const countdown = useEventCountdown(nextEvent?.date || '')

  function toggleBookmark(title) {
    setBookmarks((prev) => {
      const has = prev.includes(title)
      if (!has) {
        try { window.dispatchEvent(new CustomEvent('sait:bookmark')) } catch {}
      }
      return has ? prev.filter((x) => x !== title) : [...prev, title]
    })
  }

  return (
    <Section id="events" num="04" kicker="Events & activities" title="What's on, and what's already happened."
      lede="Upcoming events list venue, time and registration details. Bookmark an event to save it for later.">

      {nextEvent && countdown && !countdown.past && (
        <div className="countdown-card">
          <div className="countdown-label">
            <span className="live-dot" aria-hidden="true" />
            <span className="label">Next event</span>
          </div>
          <div className="countdown-title">{nextEvent.title}</div>
          <div className="countdown-meta">{nextEvent.date} · {nextEvent.time} · {nextEvent.venue}</div>
          <div className="countdown-grid">
            <div className="countdown-cell"><div className="countdown-value">{String(countdown.days).padStart(2, '0')}</div><div className="countdown-key">Days</div></div>
            <div className="countdown-cell"><div className="countdown-value">{String(countdown.hours).padStart(2, '0')}</div><div className="countdown-key">Hours</div></div>
            <div className="countdown-cell"><div className="countdown-value">{String(countdown.minutes).padStart(2, '0')}</div><div className="countdown-key">Minutes</div></div>
            <div className="countdown-cell"><div className="countdown-value">{String(countdown.seconds).padStart(2, '0')}</div><div className="countdown-key">Seconds</div></div>
          </div>
          <div className="countdown-actions">
            <button className="btn" onClick={() => setRegistering(nextEvent)}>Register now</button>
            <button className="btn ghost" onClick={() => toggleBookmark(nextEvent.title)}>
              {bookmarks.includes(nextEvent.title) ? '★ Saved' : '☆ Save'}
            </button>
          </div>
        </div>
      )}

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
          {upcoming.map((e) => {
            const saved = bookmarks.includes(e.title)
            return (
              <div className="event-row" key={e.title}>
                <button className="event-main" onClick={() => setActive({ ...e, kind: 'upcoming' })}>
                  <div>
                    <div className="row-date">{e.date}</div>
                    <div className="row-date" style={{ marginTop: 4, color: 'var(--text-3)' }}>{e.time}</div>
                  </div>
                  <div>
                    <div className="row-title">{e.title}</div>
                    <div className="row-meta" style={{ marginTop: 8 }}>{e.venue} · {e.note}</div>
                  </div>
                </button>
                <div className="event-side">
                  <span className="tag accent">{e.category}</span>
                  <button className="bookmark-btn" onClick={() => toggleBookmark(e.title)}
                    aria-label={saved ? 'Remove bookmark' : 'Save event'}>
                    {saved ? '★' : '☆'}
                  </button>
                </div>
              </div>
            )
          })}
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

      {bookmarks.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <SubHead>Saved events ({bookmarks.length})</SubHead>
          <div className="filters" style={{ marginBottom: 12 }}>
            {bookmarks.map((title) => (
              <button key={title} onClick={() => toggleBookmark(title)}>{title} ×</button>
            ))}
          </div>
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
        {active && <EventDetail event={active} onRegister={() => { setActive(null); setRegistering(active) }} />}
      </Drawer>

      <RegistrationModal
        event={registering}
        onClose={() => setRegistering(null)}
        onConfirm={() => toast.push({ title: 'Registration confirmed', body: `${registering?.title} · ${registering?.date}` })}
      />
    </Section>
  )
}

function EventDetail({ event, onRegister }) {
  const toast = useToast()
  const isPast = event.kind === 'past'
  return (
    <div className="stack-32">
      <div className="detail-grid">
        <div><div className="label">Date</div><div className="detail-value">{event.date}</div></div>
        {event.time && <div><div className="label">Time</div><div className="detail-value">{event.time}</div></div>}
        {event.venue && <div><div className="label">Venue</div><div className="detail-value">{event.venue}</div></div>}
        {event.category && <div><div className="label">Category</div><div className="detail-value">{event.category}</div></div>}
      </div>
      {event.note && <p className="muted">{event.note}</p>}
      {!isPast && (
        <>
          <div className="rule" />
          <div>
            <div className="label" style={{ marginBottom: 10 }}>Registration</div>
            <p className="muted small">Register through the department portal. Bring your college ID on the day. Team events require all members to be registered together.</p>
          </div>
          <div className="detail-actions">
            <button className="btn" onClick={onRegister}>Register</button>
            <button className="btn ghost" onClick={() => toast.push({
              title: 'Added to calendar',
              body: `${event.title} · ${event.date}`,
              action: { label: 'Undo', onClick: () => toast.push({ title: 'Removed from calendar' }) },
            })}>
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
            <p className="muted small">Photos and the event report will be published in the department archive.</p>
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
            <div className="value">{s.prefix || ''}{s.value}{s.suffix || ''}</div>
            <div className="key">{s.key}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 64 }}>
        <SubHead>Recruiters on campus</SubHead>
        <div className="chip-cloud">
          {RECRUITERS.map((r) => <span className="chip" key={r}>{r}</span>)}
        </div>
      </div>
      <div style={{ marginTop: 56 }}>
        <SubHead>Resources</SubHead>
        <div className="row-list">
          {CAREER_RESOURCES.map((r) => (
            <button className="row row-btn" key={r.label}
              onClick={() => toast.push({ title: 'Opening resource', body: `${r.label} — prototype only.` })}>
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
    return ACHIEVEMENTS.filter((a) => (a.title + ' ' + a.who + ' ' + a.year).toLowerCase().includes(needle))
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
          <div className="year-rail"><span className="year">{year}</span></div>
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
export function ActivityLogger({ onOpenAuth }) {
  const toast = useToast()
  const { user } = useAuth()
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
    return { logged: activities.length, verified: verified.length, points: verified.reduce((s, a) => s + a.points, 0) }
  }, [activities])

  function reset() {
    setForm({ title: '', date: '', type: 'hackathon', role: '', proof: '' })
    setEditingId(null)
  }

  function submit(e) {
    e.preventDefault()
    if (!user) { onOpenAuth && onOpenAuth(); return }
    if (!form.title || !form.date || !form.role) return
    const points = ACTIVITY_TYPES.find((t) => t.id === form.type)?.points ?? 10
    if (editingId != null) {
      setActivities((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form, points } : a)))
      toast.push({ title: 'Activity updated' })
      reset()
      return
    }
    setActivities((prev) => [{ id: Date.now(), ...form, status: 'pending', points, who: user.name }, ...prev])
    toast.push({ title: 'Submitted for verification', body: `${form.title} · ${typeLabel(form.type)}` })
    try { window.dispatchEvent(new CustomEvent('sait:logger')) } catch {}
    reset()
  }

  function edit(a) {
    setEditingId(a.id)
    setForm({ title: a.title, date: a.date, type: a.type, role: a.role, proof: a.proof || '' })
    window.scrollTo({ top: document.getElementById('logger')?.offsetTop ?? 0, behavior: 'smooth' })
  }

  function remove(a) {
    setActivities((prev) => prev.filter((x) => x.id !== a.id))
    toast.push({
      title: 'Activity removed',
      body: a.title,
      action: { label: 'Undo', onClick: () => { setActivities((prev) => [a, ...prev]); toast.push({ title: 'Restored' }) } },
    })
  }

  function exportCsv() {
    const rows = [
      ['Date', 'Title', 'Type', 'Role', 'Status', 'Points', 'Submitted by'],
      ...activities.map((a) => [a.date, a.title, typeLabel(a.type), a.role, a.status, a.points, a.who]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `sait-activities-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.push({ title: 'Exported to CSV', body: `${activities.length} activities downloaded` })
  }

  return (
    <Section id="logger" num="08" kicker="Student activity logger" title="Record what you do outside class."
      lede="Submit hackathons, workshops, publications, internships and other activities. Verified entries appear on your profile and count towards the department leaderboard.">

      {!user && (
        <div className="auth-required">
          <div className="auth-required-inner">
            <div className="auth-required-icon" aria-hidden="true">🔒</div>
            <div>
              <div className="auth-required-title">Sign in to log activities</div>
              <div className="auth-required-sub">Your activity history, points and leaderboard rank are tied to your account.</div>
            </div>
            <button className="btn" onClick={onOpenAuth}>Sign in</button>
          </div>
        </div>
      )}

      <div className="cols wide-left">
        <div>
          <SubHead action={editingId && (<button className="inline-cancel" onClick={reset}>Cancel edit</button>)}>
            {editingId ? 'Edit activity' : 'Submit an activity'}
          </SubHead>
          <form className="form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="al-title">Activity title</label>
              <input id="al-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. HackIT 2026 — 2nd place" required />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="al-date">Date</label>
                <input id="al-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="field">
                <label htmlFor="al-type">Type</label>
                <select id="al-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {ACTIVITY_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label} · {t.points} pts</option>)}
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="al-role">Your role</label>
              <input id="al-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Team lead, Participant, Co-author" required />
            </div>
            <div className="field">
              <label htmlFor="al-proof">Proof link (optional)</label>
              <input id="al-proof" value={form.proof} onChange={(e) => setForm({ ...form, proof: e.target.value })} placeholder="Certificate URL, repository, or Drive link" />
            </div>
            <div className="form-actions">
              <button className="btn" type="submit">{editingId ? 'Save changes' : 'Submit for verification'}</button>
              <span className="form-hint"><Kbd>Enter</Kbd> to submit</span>
            </div>
          </form>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button className="btn ghost" onClick={exportCsv}>Export CSV</button>
          </div>
          <SubHead>Your dashboard</SubHead>
          <div className="stat-row" style={{ marginTop: 0, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="stat"><div className="value" style={{ fontSize: '2rem' }}>{totals.logged}</div><div className="key">Logged</div></div>
            <div className="stat"><div className="value" style={{ fontSize: '2rem' }}>{totals.verified}</div><div className="key">Verified</div></div>
            <div className="stat"><div className="value" style={{ fontSize: '2rem' }}>{totals.points}</div><div className="key">Points</div></div>
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
                  {user && a.who === user.name && (
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
      <div style={{ marginTop: 72 }}><Leaderboard /></div>
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
            <th><button className="th-btn" onClick={() => toggle('name')}>Student{indicator('name')}</button></th>
            <th style={{ textAlign: 'right' }}><button className="th-btn" onClick={() => toggle('points')}>Points{indicator('points')}</button></th>
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
  const toggleRead = (idx) => setRead((prev) => prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx])
  const markAllRead = () => setRead(NOTIFICATIONS.map((_, i) => i))
  const markAllUnread = () => setRead([])
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
                <button className="acc-read-toggle" onClick={() => toggleRead(i)}
                  aria-label={isRead ? 'Mark unread' : 'Mark read'}>
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