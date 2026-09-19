import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react'
import { Section, Kbd, useToast } from './ui.jsx'
import { useLocalStorage } from './hooks.js'
import { useConfetti } from './fancy.jsx'

/* ============================================================
   TIME-OF-DAY GREETING
   ============================================================ */
export function useGreeting() {
  const [greeting, setGreeting] = useState('Welcome')
  useEffect(() => {
    const h = new Date().getHours()
    if (h < 5) setGreeting('Still up?')
    else if (h < 12) setGreeting('Good morning')
    else if (h < 17) setGreeting('Good afternoon')
    else if (h < 21) setGreeting('Good evening')
    else setGreeting('Good night')
  }, [])
  return greeting
}

/* ============================================================
   POMODORO TIMER
   ============================================================ */
const PHASES = {
  work:  { label: 'Focus',       total: 25 * 60 },
  break: { label: 'Short break', total: 5  * 60 },
  long:  { label: 'Long break',  total: 15 * 60 },
}

export function PomodoroTimer({ compact = false }) {
  const [phase, setPhase] = useLocalStorage('sait.pomo.phase', 'work')
  const [secondsLeft, setSecondsLeft] = useLocalStorage('sait.pomo.left', 25 * 60)
  const [running, setRunning] = useLocalStorage('sait.pomo.running', false)
  const [sessions, setSessions] = useLocalStorage('sait.pomo.sessions', 0)
  const toast = useToast()
  const confetti = useConfetti()

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id)
          if (phase === 'work') {
            const next = (sessions + 1) % 4 === 0 ? 'long' : 'break'
            setSessions((n) => n + 1)
            setPhase(next)
            toast.push({
              title: 'Focus session complete',
              body: `Time for a ${next === 'long' ? 'long' : 'short'} break.`,
            })
            confetti(30)
            return PHASES[next].total
          } else {
            setPhase('work')
            toast.push({ title: 'Break over', body: 'Back to focus.' })
            return PHASES.work.total
          }
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running, phase, sessions, setSecondsLeft, setPhase, setSessions, toast, confetti])

  const total = PHASES[phase].total
  const pct = 1 - secondsLeft / total
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  function reset() {
    setRunning(false)
    setSecondsLeft(PHASES[phase].total)
  }
  function skip() {
    setRunning(false)
    if (phase === 'work') {
      const next = (sessions + 1) % 4 === 0 ? 'long' : 'break'
      setSessions((n) => n + 1)
      setPhase(next)
      setSecondsLeft(PHASES[next].total)
    } else {
      setPhase('work')
      setSecondsLeft(PHASES.work.total)
    }
  }

  const R = 44
  const C = 2 * Math.PI * R

  if (compact) {
    return (
      <div className="pomo-compact">
        <div className="pomo-compact-dot" data-running={running} />
        <span className="pomo-compact-label">{PHASES[phase].label}</span>
        <span className="pomo-compact-time">{mm}:{ss}</span>
        <button onClick={() => setRunning((r) => !r)} aria-label={running ? 'Pause' : 'Start'}>
          {running ? '❚❚' : '▶'}
        </button>
      </div>
    )
  }

  return (
    <div className="pomo">
      <div className="pomo-svg">
        <svg viewBox="0 0 100 100" width="120" height="120">
          <circle cx="50" cy="50" r={R} fill="none" stroke="var(--border)" strokeWidth="4" />
          <circle
            cx="50" cy="50" r={R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct)}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="pomo-svg-time">{mm}:{ss}</div>
      </div>
      <div className="pomo-label">{PHASES[phase].label} · {sessions} {sessions === 1 ? 'session' : 'sessions'} today</div>
      <div className="pomo-actions">
        <button className="btn" onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button className="btn ghost" onClick={reset}>Reset</button>
        <button className="btn ghost" onClick={skip}>Skip</button>
      </div>
    </div>
  )
}

/* ============================================================
   ACHIEVEMENTS — context so all instances share state
   ============================================================ */
const ACHIEVEMENTS_LIST = [
  { id: 'first-visit', label: 'First visit',    desc: 'You opened the site.',           icon: '👋' },
  { id: 'konami',      label: 'Secret finder',  desc: 'You entered the Konami code.',   icon: '🎮' },
  { id: 'dark-mode',   label: 'Night owl',      desc: 'Switched to dark mode.',         icon: '🌙' },
  { id: 'light-mode',  label: 'Early bird',     desc: 'Switched to light mode.',        icon: '☀️' },
  { id: 'mascot',      label: 'Said hello',     desc: 'You clicked the mascot.',        icon: '🤖' },
  { id: 'wishwall',    label: 'Left a mark',    desc: 'Posted on the wish wall.',       icon: '📝' },
  { id: 'bookmark',    label: 'Bookmarked',     desc: 'Saved an event.',                icon: '⭐' },
  { id: 'logger',      label: 'Record keeper',  desc: 'Submitted an activity.',         icon: '📚' },
  { id: 'explorer',    label: 'Explorer',       desc: 'Visited 6 different pages.',     icon: '🧭' },
  { id: 'all-pages',   label: 'Completionist',  desc: 'Visited every page.',            icon: '🏆' },
]

const AchCtx = createContext(null)

export function AchievementsProvider({ children }) {
  const [unlocked, setUnlocked] = useLocalStorage('sait.achievements', [])
  const toast = useToast()

  const unlock = useCallback((id) => {
    setUnlocked((prev) => {
      if (prev.includes(id)) return prev
      const a = ACHIEVEMENTS_LIST.find((x) => x.id === id)
      if (a) {
        setTimeout(() => {
          toast.push({
            title: `${a.icon} Achievement unlocked`,
            body: a.label,
            duration: 5000,
          })
        }, 100)
      }
      return [...prev, id]
    })
  }, [setUnlocked, toast])

  const value = useMemo(
    () => ({ unlocked, unlock, all: ACHIEVEMENTS_LIST }),
    [unlocked, unlock]
  )

  return <AchCtx.Provider value={value}>{children}</AchCtx.Provider>
}

export function useAchievements() {
  const ctx = useContext(AchCtx)
  return ctx || { unlocked: [], unlock: () => {}, all: ACHIEVEMENTS_LIST }
}

export function AchievementsPanel() {
  const { unlocked, all } = useAchievements()
  const pct = Math.round((unlocked.length / all.length) * 100)
  return (
    <div className="ach-panel">
      <div className="ach-head">
        <div>
          <div className="label">Your achievements</div>
          <div className="ach-pct">{unlocked.length} / {all.length}</div>
        </div>
        <div className="ach-ring" style={{ '--pct': pct }}>
          <span>{pct}%</span>
        </div>
      </div>
      <div className="ach-grid">
        {all.map((a) => {
          const on = unlocked.includes(a.id)
          return (
            <div className="ach-item" key={a.id} data-on={on} title={a.desc}>
              <div className="ach-item-icon">{on ? a.icon : '🔒'}</div>
              <div className="ach-item-label">{a.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ============================================================
   MASCOT
   ============================================================ */
const MASCOT_TIPS = [
  'Press Ctrl + K to search anything.',
  'Try the \\ key to open the control panel.',
  'Bookmark events you care about.',
  'Log your activities to climb the leaderboard.',
  'Press ? to see all keyboard shortcuts.',
  'Click the accent swatches in the dock.',
  'The gallery has a lightbox — try arrow keys.',
  'G + E jumps straight to Events.',
  'Notices can be marked read or unread.',
  'Your session stays logged in across reloads.',
]

export function Mascot() {
  const [mood, setMood] = useState('idle')
  const [tip, setTip] = useState(null)
  const { unlock } = useAchievements()

  const IDLE_MOODS = ['idle', 'blink', 'idle', 'blink', 'idle', 'wave']

  useEffect(() => {
    const id = setInterval(() => {
      setMood(IDLE_MOODS[Math.floor(Math.random() * IDLE_MOODS.length)])
      setTimeout(() => setMood('idle'), 900)
    }, 5200)
    return () => clearInterval(id)
  }, [])

  function say() {
    setTip(MASCOT_TIPS[Math.floor(Math.random() * MASCOT_TIPS.length)])
    setTimeout(() => setTip(null), 4200)
    unlock('mascot')
  }

  return (
    <div className="mascot-wrap">
      {tip && <div className="mascot-tip" role="status">{tip}</div>}
      <button
        className={`mascot mascot-${mood}`}
        onClick={say}
        aria-label="Ask the mascot for a tip"
      >
        <svg viewBox="0 0 80 80" width="56" height="56" aria-hidden="true">
          <rect x="22" y="26" width="36" height="34" rx="6" fill="var(--accent)" />
          <rect x="28" y="32" width="24" height="18" rx="2" fill="var(--bg)" />
          {mood === 'blink' ? (
            <>
              <line x1="33" y1="41" x2="37" y2="41" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="43" y1="41" x2="47" y2="41" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="35" cy="41" r="1.8" fill="var(--accent)" />
              <circle cx="45" cy="41" r="1.8" fill="var(--accent)" />
            </>
          )}
          <path d="M36 46 Q40 49 44 46" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="40" y1="26" x2="40" y2="18" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="40" cy="16" r="3" fill="var(--accent)" className="mascot-antenna" />
          <rect x="28" y="60" width="8" height="4" rx="1.5" fill="var(--accent)" />
          <rect x="44" y="60" width="8" height="4" rx="1.5" fill="var(--accent)" />
          {mood === 'wave' && (
            <line x1="60" y1="38" x2="68" y2="30" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" className="mascot-hand" />
          )}
        </svg>
      </button>
    </div>
  )
}

/* ============================================================
   DAILY QUOTE
   ============================================================ */
const QUOTES = [
  { text: 'The best way to predict the future is to invent it.', who: 'Alan Kay' },
  { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', who: 'SICP' },
  { text: 'Talk is cheap. Show me the code.', who: 'Linus Torvalds' },
  { text: 'Simplicity is the ultimate sophistication.', who: 'Leonardo da Vinci' },
  { text: 'First, solve the problem. Then, write the code.', who: 'John Johnson' },
  { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', who: 'Martin Fowler' },
  { text: 'Make it work, make it right, make it fast.', who: 'Kent Beck' },
  { text: 'You do not rise to the level of your goals. You fall to the level of your systems.', who: 'James Clear' },
  { text: 'The only way to learn a new programming language is by writing programs in it.', who: 'Dennis Ritchie' },
  { text: 'Deleted code is debugged code.', who: 'Jeff Sickel' },
  { text: 'Premature optimization is the root of all evil.', who: 'Donald Knuth' },
  { text: 'If you cannot explain something simply, you do not understand it well enough.', who: 'Albert Einstein' },
  { text: 'The computer was born to solve problems that did not exist before.', who: 'Bill Gates' },
  { text: 'One day, you will look back and realize that small daily gains added up to something unrecognizable.', who: 'Anonymous' },
]

export function DailyQuote() {
  const quote = useMemo(() => {
    const day = Math.floor(Date.now() / 86400000)
    return QUOTES[day % QUOTES.length]
  }, [])
  return (
    <div className="quote-card">
      <div className="quote-mark" aria-hidden="true">"</div>
      <p className="quote-text">{quote.text}</p>
      <div className="quote-who">— {quote.who}</div>
    </div>
  )
}

/* ============================================================
   WEATHER WIDGET (mock)
   ============================================================ */
export function WeatherWidget() {
  const w = useMemo(() => {
    const day = new Date().getDate()
    const conditions = [
      { icon: '☀️', label: 'Clear',           temp: 31 },
      { icon: '⛅', label: 'Partly cloudy',    temp: 29 },
      { icon: '🌧️', label: 'Light rain',      temp: 27 },
      { icon: '⛈️', label: 'Thunderstorms',   temp: 26 },
      { icon: '🌤️', label: 'Mostly sunny',    temp: 30 },
    ]
    return conditions[day % conditions.length]
  }, [])
  return (
    <div className="weather">
      <div className="weather-icon" aria-hidden="true">{w.icon}</div>
      <div className="weather-body">
        <div className="weather-temp">{w.temp}<span>°C</span></div>
        <div className="weather-meta">
          <span className="weather-place">Kochi</span>
          <span className="weather-label">{w.label}</span>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   ONLINE COUNTER
   ============================================================ */
export function OnlineCounter() {
  const [n, setN] = useState(() => 40 + Math.floor(Math.random() * 30))
  useEffect(() => {
    const id = setInterval(() => {
      setN((v) => {
        const delta = Math.floor(Math.random() * 5) - 2
        return Math.max(18, Math.min(120, v + delta))
      })
    }, 3200)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="online">
      <span className="online-dot" aria-hidden="true" />
      <span className="online-n">{n}</span>
      <span className="online-label">students online</span>
    </div>
  )
}

/* ============================================================
   EMOJI REACTIONS
   ============================================================ */
const REACTIONS_LIST = [
  { id: 'fire',  emoji: '🔥', label: 'Fire' },
  { id: 'like',  emoji: '👍', label: 'Like' },
  { id: 'clap',  emoji: '👏', label: 'Clap' },
  { id: 'heart', emoji: '❤️', label: 'Love' },
  { id: 'mind',  emoji: '🤯', label: 'Mind blown' },
]

export function Reactions({ id }) {
  const [store, setStore] = useLocalStorage('sait.reactions', {})
  const item = store[id] || {}

  function toggle(rid) {
    setStore((prev) => {
      const curr = prev[id] || {}
      const r = curr[rid] || { count: 0, mine: false }
      const next = r.mine
        ? { count: Math.max(0, r.count - 1), mine: false }
        : { count: r.count + 1, mine: true }
      return { ...prev, [id]: { ...curr, [rid]: next } }
    })
  }

  return (
    <div className="reactions" onClick={(e) => e.stopPropagation()}>
      {REACTIONS_LIST.map((r) => {
        const entry = item[r.id] || { count: 0, mine: false }
        return (
          <button
            key={r.id}
            className={`reaction ${entry.mine ? 'active' : ''}`}
            onClick={() => toggle(r.id)}
            aria-label={`React with ${r.label}`}
          >
            <span className="reaction-emoji">{r.emoji}</span>
            {entry.count > 0 && <span className="reaction-count">{entry.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

/* ============================================================
   WISH WALL
   ============================================================ */
const SEED_WISHES = [
  { id: 1, name: 'Aditya',    message: 'Good luck to everyone for the endsems. 🍀',                     at: '2h ago' },
  { id: 2, name: 'Meenakshi', message: 'HackIT 2026 was incredible. Best two days of the semester.',    at: '5h ago' },
  { id: 3, name: 'Anonymous', message: 'Thank you to the Tech team for fixing the lab wifi. Heroes.',   at: 'Yesterday' },
  { id: 4, name: 'Rohan',     message: 'Any second years want to pair up for CodeFest? DM me.',         at: 'Yesterday' },
]

export function WishWall() {
  const [wishes, setWishes] = useLocalStorage('sait.wishes', SEED_WISHES)
  const [form, setForm] = useState({ name: '', message: '' })
  const toast = useToast()
  const confetti = useConfetti()
  const { unlock } = useAchievements()

  function submit(e) {
    e.preventDefault()
    if (!form.message.trim()) return
    setWishes((prev) => [
      {
        id: Date.now(),
        name: form.name.trim() || 'Anonymous',
        message: form.message.trim(),
        at: 'just now',
      },
      ...prev,
    ])
    setForm({ name: '', message: '' })
    toast.push({ title: 'Posted', body: 'Your wish is on the wall.' })
    confetti(20)
    unlock('wishwall')
  }

  return (
    <Section
      id="wishwall"
      num="14"
      kicker="Community"
      title="The wish wall."
      lede="Leave a message for the department. Anonymous is fine. Keep it kind."
    >
      <form className="wish-form" onSubmit={submit}>
        <input
          className="wish-input-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Your name (optional)"
          maxLength={30}
        />
        <input
          className="wish-input-msg"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Write something nice…"
          maxLength={140}
        />
        <button className="btn" type="submit" disabled={!form.message.trim()}>Post</button>
      </form>

      <div className="wish-grid">
        {wishes.map((w) => (
          <div className="wish-card" key={w.id}>
            <div className="wish-header">
              <div className="wish-avatar" aria-hidden="true">
                {w.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="wish-name">{w.name}</div>
            </div>
            <p className="wish-message">{w.message}</p>
            <div className="wish-foot">{w.at}</div>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ============================================================
   KONAMI CODE
   ============================================================ */
export function useKonami(onUnlock) {
  useEffect(() => {
    const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
    let idx = 0
    const onKey = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (k === seq[idx]) {
        idx += 1
        if (idx === seq.length) {
          idx = 0
          onUnlock()
        }
      } else {
        idx = k === seq[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onUnlock])
}

/* ============================================================
   CONSOLE EASTER EGG
   ============================================================ */
export function ConsoleEasterEgg() {
  useEffect(() => {
    if (window.__saitEgg) return
    window.__saitEgg = true
    console.log(
      '%c SAIT · CUSAT ',
      'background:#F0A500;color:#0B0D12;font-family:monospace;font-size:18px;font-weight:bold;padding:8px 16px;border-radius:4px'
    )
    console.log(
      '%cStudents Association of Information Technology',
      'color:#F0A500;font-family:monospace;font-size:14px;font-weight:bold'
    )
    console.log(
      '%cCurious? So are we. Write to sait@cusat.ac.in and tell us what you want to build.',
      'color:#A0A4AE;font-family:monospace;font-size:11px'
    )
    console.log(
      '%cHint: try the Konami code.',
      'color:#A0A4AE;font-family:monospace;font-size:11px'
    )
  }, [])
  return null
}

/* ============================================================
   CLICK PARTICLES
   ============================================================ */
export function ClickParticles() {
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onDown = (e) => {
      if (e.target.closest('input, textarea, select, [contenteditable]')) return
      const N = 6
      for (let i = 0; i < N; i++) {
        const p = document.createElement('span')
        p.className = 'click-particle'
        p.style.left = e.clientX + 'px'
        p.style.top = e.clientY + 'px'
        const angle = (Math.PI * 2 * i) / N + Math.random() * 0.4
        const dist = 30 + Math.random() * 40
        p.style.setProperty('--dx', Math.cos(angle) * dist + 'px')
        p.style.setProperty('--dy', Math.sin(angle) * dist + 'px')
        document.body.appendChild(p)
        setTimeout(() => p.remove(), 700)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])
  return null
}

/* ============================================================
   KONAMI OVERLAY
   ============================================================ */
export function KonamiOverlay({ open, onClose }) {
  const confetti = useConfetti()
  useEffect(() => {
    if (!open) return
    confetti(80)
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose, confetti])
  if (!open) return null
  return (
    <div className="konami-overlay" onClick={onClose}>
      <div className="konami-inner" onClick={(e) => e.stopPropagation()}>
        <div className="konami-badge">↑↑↓↓←→←→ B A</div>
        <h3 className="konami-title">You found it.</h3>
        <p className="konami-body">
          The secret menu. Nothing here does anything except make us happy that you
          were curious enough to try. Close this and get back to work — or stay
          and play with the theme switcher for a while.
        </p>
        <button className="btn" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}