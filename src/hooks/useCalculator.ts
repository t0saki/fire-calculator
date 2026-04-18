import { useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { calculateFire } from '@/lib/calculator'
import { calculateFireTypes } from '@/lib/fire-types'
import { DEFAULT_INPUTS } from '@/types'
import type { CalculatorInputs } from '@/types'

export function useCalculator() {
  const [inputs, setInputs] = useLocalStorage<CalculatorInputs>('fire-calc-inputs', DEFAULT_INPUTS)

  const result = useMemo(() => calculateFire(inputs), [inputs])
  const fireTypes = useMemo(() => calculateFireTypes(inputs), [inputs])

  return { inputs, setInputs, result, fireTypes }
}
