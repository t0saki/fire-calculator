import type { CalculatorInputs, MonteCarloConfig, MonteCarloResult } from '@/types'
import { calculateMonthlyTax } from './tax'

function gaussianRandom(): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

export function runMonteCarlo(
  inputs: CalculatorInputs,
  config: MonteCarloConfig,
): MonteCarloResult {
  const {
    currentAge,
    targetRetireAge,
    currentSavings,
    monthlyIncome,
    monthlyExpenses,
    annualReturnRate,
    inflationRate,
    taxRegion,
    salaryGrowthRate,
    capitalGainsTaxRate,
    retiredExpenseRatio,
  } = inputs

  const { simulations, volatility } = config
  const meanReturn = annualReturnRate / 100
  const vol = volatility / 100
  const inflation = inflationRate / 100
  const yearsToRetire = Math.max(targetRetireAge - currentAge, 1)
  const retirementYears = 30
  const totalYears = yearsToRetire + retirementYears
  const retiredAnnualExpenses = monthlyExpenses * (retiredExpenseRatio / 100) * 12

  // Pre-compute after-tax savings for each accumulation year (salary grows)
  const annualAfterTaxSavings: number[] = []
  let preTaxMonthly = monthlyIncome
  for (let y = 0; y < yearsToRetire; y++) {
    const tax = calculateMonthlyTax(preTaxMonthly, taxRegion)
    annualAfterTaxSavings.push((tax.afterTaxMonthly - monthlyExpenses) * 12)
    preTaxMonthly *= (1 + salaryGrowthRate / 100)
  }

  const allPaths: number[][] = []
  let successCount = 0

  for (let sim = 0; sim < simulations; sim++) {
    const path: number[] = [currentSavings]
    let balance = currentSavings
    let failed = false

    for (let year = 1; year <= totalYears; year++) {
      const randomReturn = meanReturn + gaussianRandom() * vol
      const realReturn = (1 + randomReturn) / (1 + inflation) - 1

      // Investment returns (after capital gains tax)
      const grossReturn = balance * realReturn
      const netReturn = grossReturn > 0
        ? grossReturn * (1 - capitalGainsTaxRate / 100)
        : grossReturn

      if (year <= yearsToRetire) {
        balance = balance + netReturn + annualAfterTaxSavings[year - 1]
      } else {
        balance = balance + netReturn - retiredAnnualExpenses
      }

      if (balance < 0) {
        balance = 0
        failed = true
      }

      path.push(Math.round(balance))
    }

    allPaths.push(path)
    if (!failed) successCount++
  }

  const percentiles: MonteCarloResult['percentiles'] = {
    p10: [],
    p25: [],
    p50: [],
    p75: [],
    p90: [],
  }

  for (let year = 0; year <= totalYears; year++) {
    const values = allPaths.map((p) => p[year]).sort((a, b) => a - b)
    const getPercentile = (p: number) => values[Math.floor(p * values.length / 100)] ?? 0
    percentiles.p10.push(getPercentile(10))
    percentiles.p25.push(getPercentile(25))
    percentiles.p50.push(getPercentile(50))
    percentiles.p75.push(getPercentile(75))
    percentiles.p90.push(getPercentile(90))
  }

  return {
    successRate: Math.round((successCount / simulations) * 1000) / 10,
    percentiles,
    simulations,
  }
}
