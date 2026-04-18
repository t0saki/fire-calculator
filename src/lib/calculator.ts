import type { CalculatorInputs, FireResult, YearlyDataPoint } from '@/types'
import { calculateMonthlyTax } from './tax'

export function calculateFire(inputs: CalculatorInputs): FireResult {
  const {
    currentAge,
    monthlyExpenses,
    currentSavings,
    monthlyIncome,
    annualReturnRate,
    inflationRate,
    safeWithdrawalRate,
    taxRegion,
    salaryGrowthRate,
    capitalGainsTaxRate,
    lifeEvents,
  } = inputs

  const realReturn = (1 + annualReturnRate / 100) / (1 + inflationRate / 100) - 1
  const annualExpenses = monthlyExpenses * 12
  const fireNumber = annualExpenses / (safeWithdrawalRate / 100)

  const yearlyData: YearlyDataPoint[] = []
  let savings = currentSavings
  let totalContributions = currentSavings
  let yearsToFire = -1
  let currentPreTaxMonthlyIncome = monthlyIncome
  let currentMonthlyExpenses = monthlyExpenses
  let annualPassiveIncome = 0

  const maxYears = 80

  for (let year = 0; year <= maxYears; year++) {
    const age = currentAge + year
    const eventsThisYear = lifeEvents.filter((e) => e.age === age)

    // Apply life events
    for (const event of eventsThisYear) {
      switch (event.type) {
        case 'one_time_income':
          savings += event.amount
          totalContributions += event.amount
          break
        case 'one_time_expense':
          savings -= event.amount
          break
        case 'income_change':
          currentPreTaxMonthlyIncome += event.amount
          break
        case 'expense_change':
          currentMonthlyExpenses += event.amount
          break
        case 'passive_income':
          annualPassiveIncome += event.amount
          break
      }
    }

    // Calculate tax on current income
    const taxResult = calculateMonthlyTax(currentPreTaxMonthlyIncome, taxRegion)
    const afterTaxMonthlyIncome = taxResult.afterTaxMonthly

    const currentAnnualExpenses = currentMonthlyExpenses * 12
    const currentFireTarget = currentAnnualExpenses / (safeWithdrawalRate / 100)

    yearlyData.push({
      year,
      age,
      savings: Math.round(savings),
      totalContributions: Math.round(totalContributions),
      totalReturns: Math.round(savings - totalContributions),
      fireTarget: Math.round(currentFireTarget),
      preTaxIncome: Math.round(currentPreTaxMonthlyIncome),
      afterTaxIncome: Math.round(afterTaxMonthlyIncome),
      taxPaid: Math.round(taxResult.monthlyTax),
      events: eventsThisYear,
    })

    if (yearsToFire === -1 && savings >= currentFireTarget && year > 0) {
      yearsToFire = year
    }

    // Grow for next year
    if (year < maxYears) {
      // Investment returns (after capital gains tax)
      const grossReturn = savings * realReturn
      const netReturn = grossReturn > 0
        ? grossReturn * (1 - capitalGainsTaxRate / 100)
        : grossReturn

      // Annual savings from after-tax income
      const annualSavings = (afterTaxMonthlyIncome - currentMonthlyExpenses) * 12 + annualPassiveIncome

      savings = savings + netReturn + annualSavings
      totalContributions += annualSavings

      // Apply salary growth (pre-tax income grows)
      currentPreTaxMonthlyIncome *= (1 + salaryGrowthRate / 100)
    }
  }

  if (yearsToFire === -1) {
    yearsToFire = currentSavings >= fireNumber ? 0 : maxYears
  }

  const fireDate = new Date()
  fireDate.setFullYear(fireDate.getFullYear() + yearsToFire)

  // Savings rate based on after-tax income
  const initialTax = calculateMonthlyTax(monthlyIncome, taxRegion)
  const afterTaxIncome = initialTax.afterTaxMonthly
  const savingsRate = afterTaxIncome > 0 ? ((afterTaxIncome - monthlyExpenses) / afterTaxIncome) * 100 : 0

  return {
    fireNumber: Math.round(fireNumber),
    yearsToFire,
    fireDate,
    savingsRate: Math.round(savingsRate * 10) / 10,
    yearlyData,
  }
}
