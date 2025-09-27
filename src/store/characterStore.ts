import {create} from 'zustand'

// --- Data definitions ---
export const ARENAS = {
  Physical: ['Might', 'Dexterity', 'Stamina'] as const,
  Social: ['Presence', 'Manipulation', 'Composure'] as const,
  Mental: ['Intellect', 'Cunning', 'Resolve'] as const,
}

export const SKILLS = [
  'Academics', 'Athletics', 'Culture', 'Close Combat', 'Empathy', 'Firearms', 'Integrity', 'Leadership',
  'Medicine', 'Occult', 'Persuasion', 'Pilot', 'Science', 'Subterfuge', 'Survival', 'Technology'
] as const

export type ArenaName = keyof typeof ARENAS
export type PathKey = 'Origin' | 'Role' | 'Pantheon'
export const PATH_ORDER: PathKey[] = ['Origin', 'Role', 'Pantheon']
export const MAX_DOTS = 5

export type AttributesState = Record<string, number>
export type SkillDots = Record<string, number>

function clamp(n: number, min = 0, max = MAX_DOTS) {
  return Math.max(min, Math.min(max, n))
}

export type Path = { name: string; skills: string[] }

interface CharacterState {
  // Character Info
  name: string
  pantheon: string
  concept: string

  // Paths
  paths: Record<PathKey, Path>
  setPathName: (key: PathKey, name: string) => void
  setPathSkills: (key: PathKey, skills: string[]) => void
  // Path Priorities
  primaryPath: PathKey
  secondaryPath: PathKey
  tertiaryPath: PathKey
  setPrimaryPath: (p: PathKey) => void
  setSecondaryPath: (p: PathKey) => void
  setTertiaryPath: (p: PathKey) => void

  // Arenas
  primaryArena: ArenaName
  secondaryArena: ArenaName
  tertiaryArena: ArenaName
  setPrimaryArena: (a: ArenaName) => void
  setSecondaryArena: (a: ArenaName) => void
  setTertiaryArena: (a: ArenaName) => void


  // Attributes manual values
  attrManual: AttributesState
  setAttribute: (attr: string, value: number) => void

  // Skills manual bonus allocation (5 dots pool)
  skillManualAdjust: SkillDots
  incSkill: (s: string) => void
  decSkill: (s: string) => void

  // Specialties
  specialties: Record<string, string>
  setSpecialty: (skill: string, text: string) => void

  // Calling & Knacks
  calling: string
  setCalling: (v: string) => void
  knacks: string[]
  addKnack: () => void
  removeKnack: (idx: number) => void
  setKnack: (idx: number, val: string) => void

  // Other info
  legend: number
  setLegend: (n: number) => void
  birthrights: string
  setBirthrights: (s: string) => void
  notes: string
  setNotes: (s: string) => void

  // Derived/selectors (as functions using get())
  baseAttr: () => AttributesState
  attributes: () => AttributesState
  arenaBudgets: () => Record<ArenaName, number>
  arenaRemaining: () => Record<ArenaName, number>
  autoSkillDots: () => SkillDots
  totalBonusUsed: () => number
  remainingBonus: () => number
  finalSkills: () => SkillDots
}

export const useCharacterStore = create<CharacterState>()((set, get) => ({
  // Character Info
  name: '',
  pantheon: '',
  concept: '',

  // Paths
  paths: {
    Origin: {name: '', skills: []},
    Role: {name: '', skills: []},
    Pantheon: {name: '', skills: []},
  },
  setPathName: (key, name) => set((s) => ({paths: {...s.paths, [key]: {...s.paths[key], name}}})),
  setPathSkills: (key, skills) => set((s) => {
    const next = Array.isArray(skills) ? skills.slice(0, 3) : []
    return {paths: {...s.paths, [key]: {...s.paths[key], skills: next}}}
  }),

  // Path Priorities
  primaryPath: 'Origin',
  secondaryPath: 'Role',
  tertiaryPath: 'Pantheon',
  setPrimaryPath: (p) => set((s) => {
    const all = PATH_ORDER
    const secondary = s.secondaryPath === p ? (all.find((x) => x !== p && x !== s.tertiaryPath) || s.secondaryPath) as PathKey : s.secondaryPath
    const tertiary = (all.find((x) => x !== p && x !== secondary) || s.tertiaryPath) as PathKey
    return {primaryPath: p, secondaryPath: secondary, tertiaryPath: tertiary}
  }),
  setSecondaryPath: (p) => set((s) => {
    if (p === s.primaryPath) return {}
    const tertiary = (PATH_ORDER.find((x) => x !== s.primaryPath && x !== p) || s.tertiaryPath) as PathKey
    return {secondaryPath: p, tertiaryPath: tertiary}
  }),
  setTertiaryPath: (p) => set((s) => {
    if (p === s.primaryPath) return {}
    const secondary = (PATH_ORDER.find((x) => x !== s.primaryPath && x !== p) || s.secondaryPath) as PathKey
    return {tertiaryPath: p, secondaryPath: secondary}
  }),

  // Arenas
  primaryArena: 'Physical',
  secondaryArena: 'Social',
  tertiaryArena: 'Mental',
  setPrimaryArena: (a) => set((s) => {
    // Swap-only behavior: selecting a as Primary swaps it with whichever rank currently holds it.
    let primary = s.primaryArena
    let secondary = s.secondaryArena
    let tertiary = s.tertiaryArena

    if (a === primary) {
      // no change
    } else if (a === secondary) {
      // swap primary <-> secondary
      const prevPrimary = primary
      primary = secondary
      secondary = prevPrimary
    } else if (a === tertiary) {
      // swap primary <-> tertiary
      const prevPrimary = primary
      primary = tertiary
      tertiary = prevPrimary
    }

    // Enforce budgets after arena change by trimming overspend
    const budgets: Record<ArenaName, number> = {Physical: 0, Social: 0, Mental: 0}
    budgets[primary] = 6
    budgets[secondary] = 4
    budgets[tertiary] = 2

    const manual = {...s.attrManual}
    const arenas = Object.keys(ARENAS) as ArenaName[]
    for (const arena of arenas) {
      const attrs = ARENAS[arena]
      // compute spent above base 1
      let spent = 0
      for (const attr of attrs) {
        const v = manual[attr] ?? 1
        spent += Math.max(0, v - 1)
      }
      const budget = budgets[arena]
      let over = Math.max(0, spent - budget)
      if (over > 0) {
        // create an order: highest values first
        const order = [...attrs].sort((a1, a2) => ((manual[a2] ?? 1) - (manual[a1] ?? 1)))
        while (over > 0) {
          // pick the attribute with currently highest value > 1
          let reduced = false
          for (const attr of order) {
            const cur = manual[attr] ?? 1
            if (cur > 1) {
              const next = cur - 1
              if (next <= 1) delete manual[attr]
              else manual[attr] = next
              over -= 1
              reduced = true
              if (over <= 0) break
            }
          }
          if (!reduced) break // safety: nothing to reduce
          // re-sort as values changed to keep targeting highest
          order.sort((a1, a2) => ((manual[a2] ?? 1) - (manual[a1] ?? 1)))
        }
      }
    }

    return {primaryArena: primary, secondaryArena: secondary, tertiaryArena: tertiary, attrManual: manual}
  }),
  setSecondaryArena: (a) => set((s) => {
    // Swap-only behavior: selecting a as Secondary swaps it with whichever rank currently holds it.
    let primary = s.primaryArena
    let secondary = s.secondaryArena
    let tertiary = s.tertiaryArena

    if (a === secondary) {
      // no change
    } else if (a === primary) {
      // swap primary <-> secondary
      const prevSecondary = secondary
      secondary = primary
      primary = prevSecondary
    } else if (a === tertiary) {
      // swap secondary <-> tertiary
      const prevSecondary = secondary
      secondary = tertiary
      tertiary = prevSecondary
    }

    // Enforce budgets after arena change by trimming overspend
    const budgets: Record<ArenaName, number> = {Physical: 0, Social: 0, Mental: 0}
    budgets[primary] = 6
    budgets[secondary] = 4
    budgets[tertiary] = 2

    const manual = {...s.attrManual}
    const arenas = Object.keys(ARENAS) as ArenaName[]
    for (const arena of arenas) {
      const attrs = ARENAS[arena]
      let spent = 0
      for (const attr of attrs) {
        const v = manual[attr] ?? 1
        spent += Math.max(0, v - 1)
      }
      const budget = budgets[arena]
      let over = Math.max(0, spent - budget)
      if (over > 0) {
        const order = [...attrs].sort((a1, a2) => ((manual[a2] ?? 1) - (manual[a1] ?? 1)))
        while (over > 0) {
          let reduced = false
          for (const attr of order) {
            const cur = manual[attr] ?? 1
            if (cur > 1) {
              const next = cur - 1
              if (next <= 1) delete manual[attr]
              else manual[attr] = next
              over -= 1
              reduced = true
              if (over <= 0) break
            }
          }
          if (!reduced) break
          order.sort((a1, a2) => ((manual[a2] ?? 1) - (manual[a1] ?? 1)))
        }
      }
    }

    return {primaryArena: primary, secondaryArena: secondary, tertiaryArena: tertiary, attrManual: manual}
  }),
  setTertiaryArena: (a) => set((s) => {
    // Swap-only behavior: selecting a as Tertiary swaps it with whichever rank currently holds it.
    let primary = s.primaryArena
    let secondary = s.secondaryArena
    let tertiary = s.tertiaryArena

    if (a === tertiary) {
      // no change
    } else if (a === primary) {
      // swap primary <-> tertiary
      const prevTertiary = tertiary
      tertiary = primary
      primary = prevTertiary
    } else if (a === secondary) {
      // swap secondary <-> tertiary
      const prevTertiary = tertiary
      tertiary = secondary
      secondary = prevTertiary
    }

    // Enforce budgets after arena change by trimming overspend
    const budgets: Record<ArenaName, number> = {Physical: 0, Social: 0, Mental: 0}
    budgets[primary] = 6
    budgets[secondary] = 4
    budgets[tertiary] = 2

    const manual = {...s.attrManual}
    const arenas = Object.keys(ARENAS) as ArenaName[]
    for (const arena of arenas) {
      const attrs = ARENAS[arena]
      let spent = 0
      for (const attr of attrs) {
        const v = manual[attr] ?? 1
        spent += Math.max(0, v - 1)
      }
      const budget = budgets[arena]
      let over = Math.max(0, spent - budget)
      if (over > 0) {
        const order = [...attrs].sort((a1, a2) => ((manual[a2] ?? 1) - (manual[a1] ?? 1)))
        while (over > 0) {
          let reduced = false
          for (const attr of order) {
            const cur = manual[attr] ?? 1
            if (cur > 1) {
              const next = cur - 1
              if (next <= 1) delete manual[attr]
              else manual[attr] = next
              over -= 1
              reduced = true
              if (over <= 0) break
            }
          }
          if (!reduced) break
          order.sort((a1, a2) => ((manual[a2] ?? 1) - (manual[a1] ?? 1)))
        }
      }
    }

    return {primaryArena: primary, secondaryArena: secondary, tertiaryArena: tertiary, attrManual: manual}
  }),


  // Attributes manual values
  attrManual: {},
  setAttribute: (attr, value) => set((s) => {
    const base = get().baseAttr()
    const target = clamp(Math.max(base[attr] ?? 1, value), 1, MAX_DOTS)

    // Determine current value (manual or base)
    const current = s.attrManual[attr] ?? base[attr]

    // If decreasing or staying the same, apply directly (freeing pool is always allowed)
    if (target <= current) {
      const nextManual = {...s.attrManual}
      if (target <= base[attr]) {
        // Remove manual override if we're back to base
        delete nextManual[attr]
      } else {
        nextManual[attr] = target
      }
      return {attrManual: nextManual}
    }

    // Increasing: enforce arena pool constraints
    const arena = (Object.keys(ARENAS) as ArenaName[]).find((a) => (ARENAS[a] as readonly string[]).includes(attr)) as ArenaName

    const currentAbove = Math.max(0, current - base[attr])
    const desiredAbove = Math.max(0, target - base[attr])
    const additionalNeeded = Math.max(0, desiredAbove - currentAbove)

    const remaining = get().arenaRemaining()[arena]
    const allowedAdditional = Math.min(additionalNeeded, remaining)
    const finalAbove = currentAbove + allowedAdditional
    const finalValue = clamp(base[attr] + finalAbove, 1, MAX_DOTS)

    return {attrManual: {...s.attrManual, [attr]: finalValue}}
  }),

  // Skills manual bonus allocation
  skillManualAdjust: {},
  incSkill: (skill) => set((s) => {
    const base = get().autoSkillDots()[skill] ?? 0
    const curr = clamp(base + (s.skillManualAdjust[skill] ?? 0), 0, MAX_DOTS)
    const remaining = get().remainingBonus()
    if (curr >= MAX_DOTS || remaining <= 0) return {}
    return {skillManualAdjust: {...s.skillManualAdjust, [skill]: (s.skillManualAdjust[skill] ?? 0) + 1}}
  }),
  decSkill: (skill) => set((s) => {
    const nextVal = (s.skillManualAdjust[skill] ?? 0) - 1
    const copy = {...s.skillManualAdjust}
    if (nextVal <= 0) delete copy[skill]
    else copy[skill] = nextVal
    return {skillManualAdjust: copy}
  }),

  // Specialties
  specialties: {},
  setSpecialty: (skill, text) => set((s) => ({specialties: {...s.specialties, [skill]: text}})),

  // Calling & Knacks
  calling: '',
  setCalling: (v) => set({calling: v}),
  knacks: [''],
  addKnack: () => set((s) => ({knacks: [...s.knacks, '']})),
  removeKnack: (idx) => set((s) => ({knacks: s.knacks.filter((_, i) => i !== idx)})),
  setKnack: (idx, val) => set((s) => ({knacks: s.knacks.map((v, i) => (i === idx ? val : v))})),

  // Other info
  legend: 1,
  setLegend: (n) => set({legend: Math.max(1, n || 1)}),
  birthrights: '',
  setBirthrights: (s) => set({birthrights: s}),
  notes: '',
  setNotes: (s) => set({notes: s}),

  // Derived/selectors
  baseAttr: () => {
    const base: AttributesState = {}
    Object.values(ARENAS).flat().forEach((attr) => (base[attr] = 1))
    return base
  },
  attributes: () => {
    const base = get().baseAttr()
    const manual = get().attrManual
    const out: AttributesState = {...base}
    Object.keys(out).forEach((k) => (out[k] = clamp(Math.max(out[k], manual[k] ?? 1), 1, MAX_DOTS)))
    return out
  },
  arenaBudgets: () => {
    const {primaryArena, secondaryArena, tertiaryArena} = get()
    const budgets: Record<ArenaName, number> = {
      Physical: 0,
      Social: 0,
      Mental: 0,
    }
    budgets[primaryArena] = 6
    budgets[secondaryArena] = 4
    budgets[tertiaryArena] = 2
    return budgets
  },
  arenaRemaining: () => {
    const manual = get().attrManual
    const budgets = get().arenaBudgets()
    const spent: Record<ArenaName, number> = {Physical: 0, Social: 0, Mental: 0}
    ;(Object.keys(ARENAS) as ArenaName[]).forEach((arena) => {
      const attrs = ARENAS[arena]
      let sum = 0
      attrs.forEach((attr) => {
        // Count only user-assigned dots above the default base of 1
        const manualAboveOne = Math.max(0, (manual[attr] ?? 1) - 1)
        sum += manualAboveOne
      })
      spent[arena] = sum
    })
    const remaining: Record<ArenaName, number> = {Physical: 0, Social: 0, Mental: 0}
    ;(Object.keys(ARENAS) as ArenaName[]).forEach((arena) => {
      remaining[arena] = clamp(budgets[arena] - spent[arena], 0, budgets[arena])
    })
    return remaining
  },
  autoSkillDots: () => {
    const res: SkillDots = {}
    SKILLS.forEach((s) => (res[s] = 0))

    const {paths, primaryPath, secondaryPath, tertiaryPath} = get()
    const weightFor: Record<PathKey, number> = {
      [primaryPath]: 3,
      [secondaryPath]: 2,
      [tertiaryPath]: 1,
    } as Record<PathKey, number>

    // First pass: sum weights from each path selection
    const selectedUnion = new Set<string>()
    ;([primaryPath, secondaryPath, tertiaryPath] as PathKey[]).forEach((pk) => {
      const w = weightFor[pk]
      paths[pk].skills.forEach((sk) => {
        selectedUnion.add(sk)
        res[sk] = (res[sk] ?? 0) + w
      })
    })

    // Cap at MAX_DOTS and compute surplus
    let surplus = 0
    for (const sk of selectedUnion) {
      const v = res[sk] ?? 0
      if (v > MAX_DOTS) {
        surplus += v - MAX_DOTS
        res[sk] = MAX_DOTS
      }
    }

    if (surplus > 0) {
      // Redistribute surplus to other selected skills below cap, round-robin by current value ascending
      const skillsList = Array.from(selectedUnion)
      while (surplus > 0) {
        // find candidates still below 5
        const candidates = skillsList.filter((sk) => (res[sk] ?? 0) < MAX_DOTS)
        if (candidates.length === 0) break
        // sort ascending to even out totals
        candidates.sort((a, b) => (res[a] ?? 0) - (res[b] ?? 0))
        for (const sk of candidates) {
          if (surplus <= 0) break
          if ((res[sk] ?? 0) < MAX_DOTS) {
            res[sk] = (res[sk] ?? 0) + 1
            surplus -= 1
          }
        }
      }
    }

    // Ensure non-selected skills remain 0
    SKILLS.forEach((s) => (res[s] = clamp(res[s] ?? 0, 0, MAX_DOTS)))
    return res
  },
  totalBonusUsed: () => {
    const base = get().autoSkillDots()
    const adj = get().skillManualAdjust
    let used = 0
    SKILLS.forEach((s) => {
      const b = base[s] ?? 0
      const a = adj[s] ?? 0
      const fin = clamp(b + a, 0, MAX_DOTS)
      used += Math.max(0, fin - b)
    })
    return used
  },
  remainingBonus: () => clamp(5 - get().totalBonusUsed(), 0, 5),
  finalSkills: () => {
    const res: SkillDots = {...get().autoSkillDots()}
    const adj = get().skillManualAdjust
    SKILLS.forEach((s) => {
      res[s] = clamp((res[s] ?? 0) + (adj[s] ?? 0), 0, MAX_DOTS)
    })
    return res
  },
  exportData: () => {
    const {name, pantheon, concept, paths, calling, knacks, legend, birthrights, notes} = get()
    const final = get().finalSkills()
    const specs = get().specialties
    // Build skills map tying specialty to each skill entry
    const skills: Record<string, { name: string; value: number; specialty?: string }> = {}
    Object.keys(final).forEach((sk) => {
      const val = final[sk] ?? 0
      const spec = (specs[sk] ?? '').trim()
      skills[sk] = spec ? {name: sk, value: val, specialty: spec} : {name: sk, value: val}
    })
    return {
      name,
      pantheon,
      concept,
      paths,
      attributes: get().attributes(),
      skills,
      calling,
      knacks: knacks.filter((k) => k.trim().length > 0),
      legend,
      birthrights,
      notes,
    }
  },
}))
