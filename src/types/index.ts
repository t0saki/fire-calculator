export type CurrencyCode = 'CNY' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'HKD' | 'SGD' | 'AUD' | 'CAD'

export type TaxRegion = 'CN' | 'US' | 'HK' | 'SG' | 'NONE'

export type FireType = 'lean' | 'regular' | 'fat' | 'coast' | 'barista'

export type LifeEventType =
  | 'one_time_income'
  | 'one_time_expense'
  | 'income_change'
  | 'expense_change'
  | 'passive_income'

export interface LifeEvent {
  id: string
  name: string
  type: LifeEventType
  amount: number
  age: number
}

export interface CalculatorInputs {
  currentAge: number
  targetRetireAge: number
  currentSavings: number
  monthlyIncome: number
  monthlyExpenses: number
  annualReturnRate: number
  inflationRate: number
  safeWithdrawalRate: number
  currency: CurrencyCode
  taxRegion: TaxRegion
  salaryGrowthRate: number
  capitalGainsTaxRate: number
  retiredExpenseRatio: number
  lifeEvents: LifeEvent[]
}

export interface FireResult {
  fireNumber: number
  yearsToFire: number
  fireDate: Date
  savingsRate: number
  yearlyData: YearlyDataPoint[]
}

export interface YearlyDataPoint {
  year: number
  age: number
  savings: number
  totalContributions: number
  totalReturns: number
  fireTarget: number
  preTaxIncome: number
  afterTaxIncome: number
  taxPaid: number
  events: LifeEvent[]
}

export interface FireTypeResult {
  type: FireType
  label: string
  fireNumber: number
  yearsToFire: number
  monthlyExpenseUsed: number
}

export interface MonteCarloResult {
  successRate: number
  percentiles: {
    p10: number[]
    p25: number[]
    p50: number[]
    p75: number[]
    p90: number[]
  }
  simulations: number
}

export interface MonteCarloConfig {
  simulations: number
  volatility: number
}

export interface Scenario {
  id: string
  name: string
  inputs: CalculatorInputs
  color: string
}

export const DEFAULT_INPUTS: CalculatorInputs = {
  currentAge: 30,
  targetRetireAge: 65,
  currentSavings: 100000,
  monthlyIncome: 20000,
  monthlyExpenses: 10000,
  annualReturnRate: 7,
  inflationRate: 3,
  safeWithdrawalRate: 4,
  currency: 'CNY',
  taxRegion: 'CN',
  salaryGrowthRate: 5,
  capitalGainsTaxRate: 0,
  retiredExpenseRatio: 80,
  lifeEvents: [],
}

export const DEFAULT_MONTE_CARLO: MonteCarloConfig = {
  simulations: 1000,
  volatility: 15,
}

export const SCENARIO_COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a855f7']
