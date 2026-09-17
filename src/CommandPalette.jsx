import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Kbd } from './ui.jsx'

export default function CommandPalette({ open, onClose, commands }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return commands.slice(0, 12)
    return commands
      .map((c) => {
        const hay = (c.label + ' ' + (c.keywords || '') + ' ' + (c.group || '')).toLowerCase()
        const idx = hay.indexOf(needle)
        return { c, score: idx === -1 ? Infinity : idx }
      })
      .filter((r) => r.score !== Infinity)
      .sort((a, b) => a.score - b.score)
      .slice(0, 20)
      .map((r) => r.c)
  }, [q, commands])

  useEffect(() => { setActive(0) }, [q])

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((a) => Math.min(a + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((a) => Math.max(a - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const pick = results[active]
        if (pick) { pick.run(); onClose() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, results, active, onClose])

  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]')
    if (el) el.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  // group contiguous results by group label
  const groups = []
  for (const r of results) {
    const last = groups[groups.length - 1]
    if (last && last.name === r.group) last.items.push(r)
    else groups.push({ name: r.group || 'Results', items: [r] })
  }

  let flatIndex = -1

  return (
    <div className="drawer-root palette-root" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="palette">
        <div className="palette-input">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="11" y1="11" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Jump to a page, event, person, or action…"
            aria-label="Command palette search"
          />
          <Kbd>Esc</Kbd>
        </div>

        <div className="palette-list" ref={listRef}>
          {results.length === 0 && (
            <div className="palette-empty">No matches for "{q}"</div>
          )}
          {groups.map((g) => (
            <div className="palette-group" key={g.name}>
              <div className="palette-group-label">{g.name}</div>
              {g.items.map((item) => {
                flatIndex++
                const idx = flatIndex
                return (
                  <button
                    key={item.id}
                    data-active={idx === active}
                    className="palette-item"
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => { item.run(); onClose() }}
                  >
                    <span className="palette-item-label">{item.label}</span>
                    {item.hint && <span className="palette-item-hint">{item.hint}</span>}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="palette-foot">
          <span><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
          <span><Kbd>↵</Kbd> open</span>
          <span><Kbd>Esc</Kbd> close</span>
        </div>
      </div>
    </div>
  )
}