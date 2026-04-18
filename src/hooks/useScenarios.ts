import { useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { calculateFire } from '@/lib/calculator'
import { DEFAULT_INPUTS, SCENARIO_COLORS } from '@/types'
import type { Scenario, CalculatorInputs, FireResult } from '@/types'

function createScenario(index: number): Scenario {
  return {
    id: crypto.randomUUID(),
    name: `Scenario ${String.fromCharCode(65 + index)}`,
    inputs: { ...DEFAULT_INPUTS },
    color: SCENARIO_COLORS[index % SCENARIO_COLORS.length],
  }
}

export function useScenarios() {
  const [scenarios, setScenarios] = useLocalStorage<Scenario[]>('fire-calc-scenarios', [
    createScenario(0),
    createScenario(1),
  ])

  const results = useMemo(
    () => scenarios.map((s) => ({ scenario: s, result: calculateFire(s.inputs) })),
    [scenarios],
  )

  const addScenario = () => {
    if (scenarios.length >= 4) return
    setScenarios((prev) => [...prev, createScenario(prev.length)])
  }

  const removeScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id))
  }

  const duplicateScenario = (id: string) => {
    if (scenarios.length >= 4) return
    setScenarios((prev) => {
      const source = prev.find((s) => s.id === id)
      if (!source) return prev
      const newS: Scenario = {
        id: crypto.randomUUID(),
        name: `${source.name} (copy)`,
        inputs: { ...source.inputs, lifeEvents: [...source.inputs.lifeEvents] },
        color: SCENARIO_COLORS[prev.length % SCENARIO_COLORS.length],
      }
      return [...prev, newS]
    })
  }

  const updateScenario = (id: string, updates: Partial<Scenario>) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    )
  }

  const updateScenarioInputs = <K extends keyof CalculatorInputs>(
    id: string,
    field: K,
    value: CalculatorInputs[K],
  ) => {
    setScenarios((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, inputs: { ...s.inputs, [field]: value } } : s,
      ),
    )
  }

  return {
    scenarios,
    results: results as { scenario: Scenario; result: FireResult }[],
    addScenario,
    removeScenario,
    duplicateScenario,
    updateScenario,
    updateScenarioInputs,
  }
}
