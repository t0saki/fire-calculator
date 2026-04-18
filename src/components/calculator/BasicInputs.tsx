import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { calculateMonthlyTax, TAX_REGION_LABELS } from '@/lib/tax'
import { formatCurrency } from '@/lib/currency'
import type { CalculatorInputs, TaxRegion } from '@/types'

interface Props {
  inputs: CalculatorInputs
  onChange: <K extends keyof CalculatorInputs>(field: K, value: CalculatorInputs[K]) => void
}

const TAX_REGIONS: TaxRegion[] = ['CN', 'US', 'HK', 'SG', 'NONE']

export function BasicInputs({ inputs, onChange }: Props) {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const handleNum = (field: keyof CalculatorInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    if (!isNaN(v)) onChange(field, v as never)
  }

  const taxResult = calculateMonthlyTax(inputs.monthlyIncome, inputs.taxRegion)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input
          id="currentAge"
          label={t('inputs.currentAge')}
          type="number"
          min={18}
          max={100}
          value={inputs.currentAge}
          onChange={handleNum('currentAge')}
          suffix={t('inputs.years')}
        />
        <Input
          id="targetRetireAge"
          label={t('inputs.targetRetireAge')}
          type="number"
          min={inputs.currentAge + 1}
          max={100}
          value={inputs.targetRetireAge}
          onChange={handleNum('targetRetireAge')}
          suffix={t('inputs.years')}
        />
      </div>

      <Input
        id="currentSavings"
        label={t('inputs.currentSavings')}
        type="number"
        min={0}
        step={10000}
        value={inputs.currentSavings}
        onChange={handleNum('currentSavings')}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="monthlyIncome"
          label={t('inputs.monthlyIncome')}
          type="number"
          min={0}
          step={1000}
          value={inputs.monthlyIncome}
          onChange={handleNum('monthlyIncome')}
        />
        <Input
          id="monthlyExpenses"
          label={t('inputs.monthlyExpenses')}
          type="number"
          min={0}
          step={1000}
          value={inputs.monthlyExpenses}
          onChange={handleNum('monthlyExpenses')}
        />
      </div>

      {/* Tax Region */}
      <Select
        id="taxRegion"
        label={t('inputs.taxRegion')}
        options={TAX_REGIONS.map((r) => ({
          value: r,
          label: isZh ? TAX_REGION_LABELS[r].nameZh : TAX_REGION_LABELS[r].name,
        }))}
        value={inputs.taxRegion}
        onChange={(e) => onChange('taxRegion', e.target.value as TaxRegion)}
      />

      {/* Tax Summary */}
      {inputs.taxRegion !== 'NONE' && inputs.monthlyIncome > 0 && (
        <div className="rounded-lg bg-secondary p-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('inputs.monthlyTax')}</span>
            <span className="font-mono text-destructive">-{formatCurrency(taxResult.monthlyTax, inputs.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('inputs.afterTaxIncome')}</span>
            <span className="font-mono font-medium">{formatCurrency(taxResult.afterTaxMonthly, inputs.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('inputs.effectiveTaxRate')}</span>
            <span className="font-mono">{taxResult.effectiveRate}%</span>
          </div>
        </div>
      )}

      {/* Salary Growth */}
      <Input
        id="salaryGrowthRate"
        label={t('inputs.salaryGrowthRate')}
        type="number"
        min={0}
        max={30}
        step={0.5}
        value={inputs.salaryGrowthRate}
        onChange={handleNum('salaryGrowthRate')}
        suffix="%"
      />
    </div>
  )
}
