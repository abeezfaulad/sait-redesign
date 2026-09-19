import React, { useEffect, useMemo, useState } from 'react'
import { Kbd } from './ui.jsx'

/* ============================================================
   Shared utilities
   ============================================================ */
function useTypedTrigger(word, onFire) {
  useEffect(() => {
    let buf = ''
    const w = word.toLowerCase()
    const onKey = (e) => {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return
      const k = e.key.toLowerCase()
      if (k.length !== 1) return
      buf = (buf + k).slice(-w.length)
      if (buf === w) {
        buf = ''
        onFire()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [word, onFire])
}

function Overlay({ onClose, title, eyebrow, wide, children }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="drawer-root" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="drawer-backdrop" />
      <div className={`egg-panel ${wide ? 'egg-panel-wide' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="egg-panel-head">
          <div>
            {eyebrow && <span className="label">{eyebrow}</span>}
            <h3 className="egg-panel-title">{title}</h3>
          </div>
          <button className="drawer-close" onClick={onClose}>
            Close <Kbd>Esc</Kbd>
          </button>
        </div>
        <div className="egg-panel-body">{children}</div>
      </div>
    </div>
  )
}

/* ============================================================
   1. ATTENDANCE CALCULATOR — type "attendance"
   ============================================================ */
function AttendanceEgg() {
  const [open, setOpen] = useState(false)
  const [attended, setAttended] = useState(42)
  const [total, setTotal] = useState(58)
  const [required, setRequired] = useState(75)

  useTypedTrigger('attendance', () => setOpen(true))

  const pct = total > 0 ? (attended / total) * 100 : 0
  const safe = pct >= required

  const need = useMemo(() => {
    if (total === 0 || safe) return 0
    const x = (required * total - 100 * attended) / (100 - required)
    return Math.max(0, Math.ceil(x))
  }, [attended, total, required, safe])

  const canSkip = useMemo(() => {
    if (total === 0 || !safe) return 0
    const x = (100 * attended - required * total) / required
    return Math.max(0, Math.floor(x))
  }, [attended, total, required, safe])

  if (!open) return null

  return (
    <Overlay onClose={() => setOpen(false)} eyebrow="Utility" title="Attendance Calculator">
      <p className="egg-intro">
        Enter your attended and total classes for a subject. CUSAT requires
        a minimum of 75% attendance to sit for university exams.
      </p>

      <div className="egg-inputs">
        <div className="egg-field">
          <label htmlFor="att-a">Classes attended</label>
          <input
            id="att-a"
            type="number"
            min="0"
            value={attended}
            onChange={(e) => setAttended(Math.max(0, +e.target.value || 0))}
          />
        </div>
        <div className="egg-field">
          <label htmlFor="att-t">Total classes held</label>
          <input
            id="att-t"
            type="number"
            min="1"
            value={total}
            onChange={(e) => setTotal(Math.max(1, +e.target.value || 1))}
          />
        </div>
        <div className="egg-field">
          <label htmlFor="att-r">Required %</label>
          <input
            id="att-r"
            type="number"
            min="1"
            max="100"
            value={required}
            onChange={(e) => setRequired(Math.min(100, Math.max(1, +e.target.value || 1)))}
          />
        </div>
      </div>

      <div className={`att-result ${safe ? 'safe' : 'shortage'}`}>
        <div className="att-result-pct">
          {pct.toFixed(2)}
          <span>%</span>
        </div>
        <div className="att-result-status">
          {safe
            ? `Safe — you can skip up to ${canSkip} more class${canSkip === 1 ? '' : 'es'}.`
            : `Shortage — attend ${need} more class${need === 1 ? '' : 'es'} in a row to reach ${required}%.`}
        </div>
        <div className="att-bar">
          <span style={{ width: `${Math.min(100, pct)}%` }} />
          <i style={{ left: `${required}%` }} title={`Required ${required}%`} />
        </div>
        <div className="att-bar-legend">
          <span>0%</span>
          <span>Required {required}%</span>
          <span>100%</span>
        </div>
      </div>
    </Overlay>
  )
}

/* ============================================================
   2. CGPA CALCULATOR — type "cgpa"
   ============================================================ */
const GRADE_POINTS = {
  'S': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0,
}
const GRADE_LIST = Object.keys(GRADE_POINTS)

function CgpaEgg() {
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState([
    { id: 1, name: 'Data Structures', credits: 4, grade: 'A' },
    { id: 2, name: 'Operating Systems', credits: 4, grade: 'A+' },
    { id: 3, name: 'DBMS', credits: 4, grade: 'B+' },
    { id: 4, name: 'Computer Networks', credits: 3, grade: 'A' },
    { id: 5, name: 'SE Lab', credits: 2, grade: 'S' },
  ])

  useTypedTrigger('cgpa', () => setOpen(true))

  const totals = useMemo(() => {
    let credits = 0
    let weighted = 0
    rows.forEach((r) => {
      credits += Number(r.credits) || 0
      weighted += (Number(r.credits) || 0) * (GRADE_POINTS[r.grade] ?? 0)
    })
    return { credits, weighted, sgpa: credits > 0 ? weighted / credits : 0 }
  }, [rows])

  function update(id, patch) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }
  function addRow() {
    setRows((prev) => [...prev, { id: Date.now(), name: '', credits: 3, grade: 'A' }])
  }
  function removeRow(id) {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  if (!open) return null

  return (
    <Overlay onClose={() => setOpen(false)} eyebrow="Utility" title="SGPA / CGPA Calculator" wide>
      <p className="egg-intro">
        CUSAT B.Tech grades follow the 10-point system: S = 10, A+ = 9,
        A = 8, B+ = 7, B = 6, C = 5, P = 4, F = 0. Your SGPA for a
        semester is the credit-weighted average of your grade points.
      </p>

      <div className="cgpa-table">
        <div className="cgpa-head">
          <span>Subject</span>
          <span>Credits</span>
          <span>Grade</span>
          <span />
        </div>
        {rows.map((r) => (
          <div className="cgpa-row" key={r.id}>
            <input
              type="text"
              value={r.name}
              placeholder="Subject name"
              onChange={(e) => update(r.id, { name: e.target.value })}
            />
            <input
              type="number"
              min="0"
              max="10"
              value={r.credits}
              onChange={(e) => update(r.id, { credits: +e.target.value || 0 })}
            />
            <select value={r.grade} onChange={(e) => update(r.id, { grade: e.target.value })}>
              {GRADE_LIST.map((g) => (
                <option key={g} value={g}>{g} · {GRADE_POINTS[g]}</option>
              ))}
            </select>
            <button className="cgpa-remove" onClick={() => removeRow(r.id)} aria-label="Remove row">×</button>
          </div>
        ))}
      </div>

      <div className="cgpa-actions">
        <button className="btn ghost" onClick={addRow}>+ Add subject</button>
      </div>

      <div className="cgpa-result">
        <div>
          <span className="label">Total credits</span>
          <strong>{totals.credits}</strong>
        </div>
        <div>
          <span className="label">Your SGPA</span>
          <strong className="big">{totals.sgpa.toFixed(2)}</strong>
        </div>
        <div>
          <span className="label">Percentage</span>
          <strong>{((totals.sgpa - 0.75) * 10).toFixed(1)}%</strong>
        </div>
      </div>

      <p className="egg-note">
        Percentage conversion: (SGPA − 0.75) × 10, per KTU/CUSAT convention.
      </p>
    </Overlay>
  )
}

/* ============================================================
   3. TIMETABLE — type "timetable"
   ============================================================ */
const PERIODS = [
  { n: 1, time: '09:00–09:55' },
  { n: 2, time: '09:55–10:50' },
  { n: 3, time: '11:00–11:55' },
  { n: 4, time: '11:55–12:50' },
  { n: 5, time: '13:40–14:35' },
  { n: 6, time: '14:35–15:30' },
  { n: 7, time: '15:30–16:25' },
]

const TIMETABLE = {
  Mon: ['Data Structures', 'Operating Systems', 'DBMS', '—', 'Computer Networks', 'SE Lab', 'SE Lab'],
  Tue: ['Operating Systems', 'Data Structures', '—', 'Computer Networks', 'Machine Learning', '—', '—'],
  Wed: ['DBMS', 'Machine Learning', '—', 'OS Lab', 'OS Lab', 'CN Lab', 'CN Lab'],
  Thu: ['Data Structures', 'Computer Networks', 'DBMS', '—', 'Software Engg.', '—', '—'],
  Fri: ['Machine Learning', 'Operating Systems', 'Data Structures', '—', 'DBMS', 'Workshop', 'Workshop'],
}

function TimetableEgg() {
  const [open, setOpen] = useState(false)
  useTypedTrigger('timetable', () => setOpen(true))
  if (!open) return null

  return (
    <Overlay onClose={() => setOpen(false)} eyebrow="Utility" title="Semester 5 Timetable" wide>
      <p className="egg-intro">
        Weekly schedule for the IT Division, Semester 5, 2026–27. Lunch break
        12:50–13:40. Lab sessions are held in the IT Block labs.
      </p>

      <div className="tt-wrap">
        <table className="tt-table">
          <thead>
            <tr>
              <th className="tt-corner">Day</th>
              {PERIODS.map((p) => (
                <th key={p.n}>
                  <div>P{p.n}</div>
                  <div className="tt-time">{p.time}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(TIMETABLE).map(([day, classes]) => (
              <tr key={day}>
                <th className="tt-day">{day}</th>
                {classes.map((c, i) => (
                  <td key={i} className={c === '—' ? 'tt-empty' : ''}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Overlay>
  )
}

/* ============================================================
   4. EXAM COUNTDOWN — type "exams"
   ============================================================ */
const EXAMS = [
  { name: 'S5 Internal Assessment 1', start: '2026-10-20', end: '2026-10-25', kind: 'Internal' },
  { name: 'S5 Internal Assessment 2', start: '2026-11-17', end: '2026-11-22', kind: 'Internal' },
  { name: 'S5 University Exam', start: '2026-12-08', end: '2026-12-22', kind: 'University' },
  { name: 'S5 Practical / Viva', start: '2026-12-23', end: '2026-12-28', kind: 'University' },
]

function ExamEgg() {
  const [open, setOpen] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  useTypedTrigger('exams', () => setOpen(true))

  useEffect(() => {
    if (!open) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [open])

  const upcoming = useMemo(() => {
    return EXAMS
      .map((e) => {
        const start = new Date(e.start + 'T00:00:00').getTime()
        const diff = start - now
        return { ...e, startMs: start, diff }
      })
      .sort((a, b) => a.startMs - b.startMs)
  }, [now])

  if (!open) return null

  const next = upcoming.find((e) => e.diff > 0)

  return (
    <Overlay onClose={() => setOpen(false)} eyebrow="Utility" title="Exam Schedule">
      {next && (
        <div className="exam-next">
          <div className="label">Next exam</div>
          <div className="exam-next-title">{next.name}</div>
          <div className="exam-countdown">
            <div className="ec-cell">
              <strong>{Math.floor(next.diff / 86400000)}</strong>
              <span>days</span>
            </div>
            <div className="ec-cell">
              <strong>{Math.floor((next.diff % 86400000) / 3600000)}</strong>
              <span>hours</span>
            </div>
            <div className="ec-cell">
              <strong>{Math.floor((next.diff % 3600000) / 60000)}</strong>
              <span>minutes</span>
            </div>
            <div className="ec-cell">
              <strong>{Math.floor((next.diff % 60000) / 1000)}</strong>
              <span>seconds</span>
            </div>
          </div>
          <div className="exam-next-date">Starts {next.start}</div>
        </div>
      )}

      <div className="exam-list">
        <div className="label" style={{ marginTop: 8, marginBottom: 12 }}>Full schedule · Semester 5</div>
        {upcoming.map((e) => (
          <div className="exam-row" key={e.name}>
            <div>
              <div className="exam-name">{e.name}</div>
              <div className="exam-dates">{e.start} → {e.end}</div>
            </div>
            <span className={`tag ${e.kind === 'University' ? 'accent' : ''}`}>{e.kind}</span>
          </div>
        ))}
      </div>

      <p className="egg-note">
        Dates are indicative. Confirm from the official department notice board or the
        CUSAT exam portal before planning travel.
      </p>
    </Overlay>
  )
}

/* ============================================================
   5. DEPARTMENT CONTACTS — type "contact"
   ============================================================ */
const CONTACTS = [
  { role: 'Head of Division', name: 'Dr. S. Ramanathan', email: 'hod.it@cusat.ac.in', phone: '+91 484 2577 201' },
  { role: 'Staff Coordinator, SAIT', name: 'Dr. Priya Nair', email: 'priya.nair@cusat.ac.in', phone: '+91 484 2577 204' },
  { role: 'Faculty, Placement Cell', name: 'Dr. Joseph K. Thomas', email: 'placement.it@cusat.ac.in', phone: '+91 484 2577 208' },
  { role: 'Department Office', name: 'IT Division Office', email: 'office.it@cusat.ac.in', phone: '+91 484 2577 200' },
  { role: 'SAIT Student Body', name: 'Executive Committee', email: 'sait@cusat.ac.in', phone: '—' },
]

function ContactEgg() {
  const [open, setOpen] = useState(false)
  useTypedTrigger('contact', () => setOpen(true))
  if (!open) return null

  return (
    <Overlay onClose={() => setOpen(false)} eyebrow="Utility" title="Department Contacts" wide>
      <p className="egg-intro">
        Direct lines to the IT Division. Office hours are 09:30–16:30 on
        working days. For urgent matters, call the department office.
      </p>
      <div className="contact-list">
        {CONTACTS.map((c) => (
          <div className="contact-item" key={c.role}>
            <div className="contact-role">{c.role}</div>
            <div className="contact-name">{c.name}</div>
            <div className="contact-links">
              <a href={`mailto:${c.email}`}>{c.email}</a>
              {c.phone !== '—' && <span className="contact-phone">{c.phone}</span>}
            </div>
          </div>
        ))}
      </div>
    </Overlay>
  )
}

/* ============================================================
   6. CREDITS STRUCTURE — type "credits"
   ============================================================ */
const CREDIT_STRUCTURE = [
  { category: 'Core theory courses', credits: 76, note: 'Maths, DS, OS, DBMS, CN, ML, Compilers, etc.' },
  { category: 'Laboratory & workshop', credits: 34, note: 'Programming, OS, DBMS, CN, ML, Hardware labs' },
  { category: 'Elective courses', credits: 24, note: 'Four electives across S6 and S7' },
  { category: 'Humanities & management', credits: 12, note: 'Communication, Economics, Management' },
  { category: 'Capstone project', credits: 16, note: 'Two semesters, S7 and S8' },
  { category: 'Internship', credits: 4, note: 'Summer internship between S6 and S7' },
  { category: 'Open / general electives', credits: 12, note: 'Cross-department' },
]

function CreditsEgg() {
  const [open, setOpen] = useState(false)
  useTypedTrigger('credits', () => setOpen(true))
  const total = CREDIT_STRUCTURE.reduce((s, c) => s + c.credits, 0)

  if (!open) return null

  return (
    <Overlay onClose={() => setOpen(false)} eyebrow="Utility" title="B.Tech IT — Credit Structure" wide>
      <p className="egg-intro">
        The 2022 scheme B.Tech IT programme requires a total of {total} credits
        to graduate. Below is the breakdown by category.
      </p>

      <div className="credits-list">
        {CREDIT_STRUCTURE.map((c) => (
          <div className="credit-row" key={c.category}>
            <div>
              <div className="credit-cat">{c.category}</div>
              <div className="credit-note">{c.note}</div>
            </div>
            <div className="credit-num">
              <strong>{c.credits}</strong>
              <span>credits</span>
            </div>
          </div>
        ))}
      </div>

      <div className="credit-total">
        <span>Total required</span>
        <strong>{total}</strong>
      </div>

      <div className="credit-bar">
        {CREDIT_STRUCTURE.map((c, i) => {
          const colors = ['var(--accent)', 'var(--accent-2)', '#14B8A6', '#7C7CF0', '#F26457', '#84CC16', '#6B7080']
          return (
            <span
              key={c.category}
              style={{
                width: `${(c.credits / total) * 100}%`,
                background: colors[i % colors.length],
              }}
              title={`${c.category}: ${c.credits}`}
            />
          )
        })}
      </div>
    </Overlay>
  )
}

/* ============================================================
   7. LIBRARY — type "library" to navigate to the Library page
   ============================================================ */
function LibraryEgg() {
  useTypedTrigger('library', () => {
    window.dispatchEvent(new CustomEvent('sait:navigate', { detail: { page: 'library' } }))
  })
  return null
}

/* ============================================================
   Mount
   ============================================================ */
export function EasterEggs() {
  return (
    <>
      <AttendanceEgg />
      <CgpaEgg />
      <TimetableEgg />
      <ExamEgg />
      <ContactEgg />
      <CreditsEgg />
      <LibraryEgg />
    </>
  )
}

/* ============================================================
   Hints panel
   ============================================================ */
const EGG_LIST = [
  { word: 'attendance', desc: 'Attendance calculator + shortage warning' },
  { word: 'cgpa',       desc: 'SGPA / CGPA calculator with credit weighting' },
  { word: 'timetable',  desc: 'Semester 5 weekly timetable' },
  { word: 'exams',      desc: 'Exam schedule with live countdown' },
  { word: 'contact',    desc: 'Department contacts — HoD, office, placement' },
  { word: 'credits',    desc: 'B.Tech IT credit structure breakdown' },
  { word: 'library',    desc: 'Jump to the Division Library page' },
]

export function EggHints() {
  const [open, setOpen] = useState(false)

  return (
    <div className={`egg-hints ${open ? 'on' : ''}`}>
      <button
        className="egg-hints-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Hide shortcuts' : 'Show shortcuts'}
        title="Utility shortcuts"
      >
        {open ? '×' : '⌘'}
      </button>
      {open && (
        <div className="egg-hints-panel">
          <div className="egg-hints-title">Student utilities</div>
          <div className="egg-hints-sub">Click anywhere outside a form, then type:</div>
          <ul className="egg-hints-list">
            {EGG_LIST.map((e) => (
              <li key={e.word}>
                <code>{e.word}</code>
                <span>{e.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}