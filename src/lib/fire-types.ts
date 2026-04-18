import type { CalculatorInputs, FireType, FireTypeResult } from '@/types'
import { calculateMonthlyTax } from './tax'

interface FireTypeConfig {
  type: FireType
  labelKey: string
  expenseMultiplier: number
}

const FIRE_TYPES: FireTypeConfig[] = [
  { type: 'lean', labelKey: 'fireTypes.lean', expenseMultiplier: 0.6 },
  { type: 'regular', labelKey: 'fireTypes.regular', expenseMultiplier: 1.0 },
  { type: 'fat', labelKey: 'fireTypes.fat', expenseMultiplier: 1.5 },
]

function simulateYearsToTarget(
  currentSavings: number,
  fireTarget: number,
  monthlyIncome: number,
  monthlyExpenses: number,
  realReturn: number,
  salaryGrowthRate: number,
  capitalGainsTaxRate: number,
  taxRegion: CalculatorInputs['taxRegion'],
): number {
  let savings = currentSavings
  let preTaxMonthly = monthlyIncome
  let years = 0
  const maxYears = 80

  while (savings < fireTarget && years < maxYears) {
    const taxResult = calculateMonthlyTax(preTaxMonthly, taxRegion)
    const afterTax = taxResult.afterTaxMonthly
    const annualSavings = (afterTax - monthlyExpenses) * 12

    const grossReturn = savings * realReturn
    const netReturn = grossReturn > 0 ? grossReturn * (1 - capitalGainsTaxRate / 100) : grossReturn

    savings = savings + netReturn + annualSavings
    preTaxMonthly *= (1 + salaryGrowthRate / 100)
    years++
  }
  return years
}

export function calculateFireTypes(inputs: CalculatorInputs): FireTypeResult[] {
  const {
    currentAge,
    currentSavings,
    monthlyIncome,
    monthlyExpenses,
    annualReturnRate,
    inflationRate,
    safeWithdrawalRate,
    taxRegion,
    salaryGrowthRate,
    capitalGainsTaxRate,
  } = inputs

  const realReturn = (1 + annualReturnRate / 100) / (1 + inflationRate / 100) - 1
  const results: FireTypeResult[] = []

  for (const config of FIRE_TYPES) {
    const adjustedMonthlyExpense = monthlyExpenses * config.expenseMultiplier
    const annualExpenses = adjustedMonthlyExpense * 12
    const fireNumber = annualExpenses / (safeWithdrawalRate / 100)

    const years = simulateYearsToTarget(
      currentSavings, fireNumber, monthlyIncome, monthlyExpenses,
      realReturn, salaryGrowthRate, capitalGainsTaxRate, taxRegion,
    )

    results.push({
      type: config.type,
      label: config.labelKey,
      fireNumber: Math.round(fireNumber),
      yearsToFire: years,
      monthlyExpenseUsed: Math.round(adjustedMonthlyExpense),
    })
  }

  // Coast FIRE
  const regularFireNumber = (monthlyExpenses * 12) / (safeWithdrawalRate / 100)
  const yearsToRetire = inputs.targetRetireAge - currentAge
  const coastNumber = regularFireNumber / Math.pow(1 + realReturn, yearsToRetire)

  const coastYears = currentSavings >= coastNumber
    ? 0
    : simulateYearsToTarget(
        currentSavings, coastNumber, monthlyIncome, monthlyExpenses,
        realReturn, salaryGrowthRate, capitalGainsTaxRate, taxRegion,
      )

  results.push({
    type: 'coast',
    label: 'fireTypes.coast',
    fireNumber: Math.round(coastNumber),
    yearsToFire: coastYears,
    monthlyExpenseUsed: Math.round(monthlyExpenses),
  })

  // Barista FIRE (part-time covers 50% expenses)
  const baristaExpenses = monthlyExpenses * 0.5
  const baristaFireNumber = (baristaExpenses * 12) / (safeWithdrawalRate / 100)
  const baristaYears = simulateYearsToTarget(
    currentSavings, baristaFireNumber, monthlyIncome, monthlyExpenses,
    realReturn, salaryGrowthRate, capitalGainsTaxRate, taxRegion,
  )

  results.push({
    type: 'barista',
    label: 'fireTypes.barista',
    fireNumber: Math.round(baristaFireNumber),
    yearsToFire: baristaYears,
    monthlyExpenseUsed: Math.round(baristaExpenses),
  })

  return results
}
