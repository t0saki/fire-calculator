import { useTranslation } from 'react-i18next'
import { Slider } from '@/components/ui/slider'
import type { CalculatorInputs } from '@/types'

interface Props {
  inputs: CalculatorInputs
  onChange: <K extends keyof CalculatorInputs>(field: K, value: CalculatorInputs[K]) => void
}

export function InvestmentInputs({ inputs, onChange }: Props) {
  const { t } = useTranslation()

  return (
    <div className="space-y-5">
      <Slider
        label={t('inputs.annualReturnRate')}
        displayValue={`${inputs.annualReturnRate}%`}
        min={0}
        max={20}
        step={0.5}
        value={inputs.annualReturnRate}
        onValueChange={(v) => onChange('annualReturnRate', v)}
      />
      <Slider
        label={t('inputs.inflationRate')}
        displayValue={`${inputs.inflationRate}%`}
        min={0}
        max={15}
        step={0.5}
        value={inputs.inflationRate}
        onValueChange={(v) => onChange('inflationRate', v)}
      />
      <Slider
        label={t('inputs.safeWithdrawalRate')}
        displayValue={`${inputs.safeWithdrawalRate}%`}
        min={1}
        max={10}
        step={0.5}
        value={inputs.safeWithdrawalRate}
        onValueChange={(v) => onChange('safeWithdrawalRate', v)}
      />
      <Slider
        label={t('inputs.capitalGainsTaxRate')}
        displayValue={`${inputs.capitalGainsTaxRate}%`}
        min={0}
        max={40}
        step={1}
        value={inputs.capitalGainsTaxRate}
        onValueChange={(v) => onChange('capitalGainsTaxRate', v)}
      />
    </div>
  )
}
