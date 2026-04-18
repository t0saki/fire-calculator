import type { TaxRegion } from '@/types'

interface TaxBracket {
  upper: number  // upper bound of this bracket (Infinity for last)
  rate: number   // tax rate as decimal
}

interface TaxConfig {
  brackets: TaxBracket[]
  monthlyDeduction: number  // standard deduction per month
  annualBasis: boolean      // true = annual brackets, false = monthly
}

// China 2024: monthly taxable income brackets, 5000/month standard deduction
const CN_TAX: TaxConfig = {
  brackets: [
    { upper: 3000, rate: 0.03 },
    { upper: 12000, rate: 0.10 },
    { upper: 25000, rate: 0.20 },
    { upper: 35000, rate: 0.25 },
    { upper: 55000, rate: 0.30 },
    { upper: 80000, rate: 0.35 },
    { upper: Infinity, rate: 0.45 },
  ],
  monthlyDeduction: 5000,
  annualBasis: false,
}

// US 2024 single filer, annual brackets
const US_TAX: TaxConfig = {
  brackets: [
    { upper: 11600, rate: 0.10 },
    { upper: 47150, rate: 0.12 },
    { upper: 100525, rate: 0.22 },
    { upper: 191950, rate: 0.24 },
    { upper: 243725, rate: 0.32 },
    { upper: 609350, rate: 0.35 },
    { upper: Infinity, rate: 0.37 },
  ],
  monthlyDeduction: 14600 / 12, // standard deduction / 12
  annualBasis: true,
}

// Hong Kong 2024/25: progressive rates on net chargeable income
const HK_TAX: TaxConfig = {
  brackets: [
    { upper: 50000, rate: 0.02 },
    { upper: 100000, rate: 0.06 },
    { upper: 150000, rate: 0.10 },
    { upper: 200000, rate: 0.14 },
    { upper: Infinity, rate: 0.17 },
  ],
  monthlyDeduction: 132000 / 12, // basic allowance / 12
  annualBasis: true,
}

// Singapore 2024: annual progressive rates
const SG_TAX: TaxConfig = {
  brackets: [
    { upper: 20000, rate: 0 },
    { upper: 30000, rate: 0.02 },
    { upper: 40000, rate: 0.035 },
    { upper: 80000, rate: 0.07 },
    { upper: 120000, rate: 0.115 },
    { upper: 160000, rate: 0.15 },
    { upper: 200000, rate: 0.18 },
    { upper: 240000, rate: 0.19 },
    { upper: 280000, rate: 0.195 },
    { upper: 320000, rate: 0.20 },
    { upper: Infinity, rate: 0.22 },
  ],
  monthlyDeduction: 0,
  annualBasis: true,
}

const TAX_CONFIGS: Record<Exclude<TaxRegion, 'NONE'>, TaxConfig> = {
  CN: CN_TAX,
  US: US_TAX,
  HK: HK_TAX,
  SG: SG_TAX,
}

function calcProgressiveTax(taxableIncome: number, brackets: TaxBracket[]): number {
  let tax = 0
  let prev = 0
  for (const bracket of brackets) {
    if (taxableIncome <= prev) break
    const taxable = Math.min(taxableIncome, bracket.upper) - prev
    tax += taxable * bracket.rate
    prev = bracket.upper
  }
  return tax
}

export interface TaxResult {
  monthlyTax: number
  afterTaxMonthly: number
  effectiveRate: number // as percentage
}

export function calculateMonthlyTax(preTaxMonthly: number, region: TaxRegion): TaxResult {
  if (region === 'NONE' || preTaxMonthly <= 0) {
    return { monthlyTax: 0, afterTaxMonthly: preTaxMonthly, effectiveRate: 0 }
  }

  const config = TAX_CONFIGS[region]
  let monthlyTax: number

  if (config.annualBasis) {
    // Convert to annual, calculate, divide by 12
    const annualIncome = preTaxMonthly * 12
    const annualDeduction = config.monthlyDeduction * 12
    const taxableIncome = Math.max(annualIncome - annualDeduction, 0)
    const annualTax = calcProgressiveTax(taxableIncome, config.brackets)
    monthlyTax = annualTax / 12
  } else {
    // Monthly calculation (China)
    const taxableIncome = Math.max(preTaxMonthly - config.monthlyDeduction, 0)
    monthlyTax = calcProgressiveTax(taxableIncome, config.brackets)
  }

  const afterTaxMonthly = preTaxMonthly - monthlyTax
  const effectiveRate = preTaxMonthly > 0 ? (monthlyTax / preTaxMonthly) * 100 : 0

  return {
    monthlyTax: Math.round(monthlyTax * 100) / 100,
    afterTaxMonthly: Math.round(afterTaxMonthly * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 10) / 10,
  }
}

export const TAX_REGION_LABELS: Record<TaxRegion, { name: string; nameZh: string }> = {
  CN: { name: 'China', nameZh: '中国大陆' },
  US: { name: 'United States', nameZh: '美国' },
  HK: { name: 'Hong Kong', nameZh: '中国香港' },
  SG: { name: 'Singapore', nameZh: '新加坡' },
  NONE: { name: 'No Tax', nameZh: '不计算税' },
}
