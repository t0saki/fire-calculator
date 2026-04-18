import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { CurrencySelector } from '@/components/calculator/CurrencySelector'
import { formatCurrency } from '@/lib/currency'
import { Copy, Trash2 } from 'lucide-react'
import type { Scenario, CalculatorInputs, FireResult } from '@/types'

interface Props {
  scenario: Scenario
  result: FireResult
  canRemove: boolean
  canDuplicate: boolean
  onRemove: () => void
  onDuplicate: () => void
  onUpdateInput: <K extends keyof CalculatorInputs>(field: K, value: CalculatorInputs[K]) => void
  onUpdateName: (name: string) => void
}

export function ScenarioCard({
  scenario,
  result,
  canRemove,
  canDuplicate,
  onRemove,
  onDuplicate,
  onUpdateInput,
  onUpdateName,
}: Props) {
  const { t } = useTranslation()
  const { inputs } = scenario

  const handleNum = (field: keyof CalculatorInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    if (!isNaN(v)) onUpdateInput(field, v as never)
  }

  return (
    <Card className="border-l-4" style={{ borderLeftColor: scenario.color }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <input
            className="bg-transparent text-lg font-semibold outline-none border-none focus:ring-0 p-0 w-full"
            value={scenario.name}
            onChange={(e) => onUpdateName(e.target.value)}
          />
          <div className="flex gap-1">
            {canDuplicate && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDuplicate} title={t('scenarios.duplicate')}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
            )}
            {canRemove && (
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onRemove} title={t('scenarios.remove')}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
        {/* Quick result summary */}
        <div className="flex gap-4 text-sm mt-1">
          <span className="text-muted-foreground">
            {t('results.fireNumber')}: <span className="text-foreground font-mono">{formatCurrency(result.fireNumber, inputs.currency)}</span>
          </span>
          <span className="text-muted-foreground">
            {t('results.yearsToFire')}: <span className="text-foreground font-mono">{result.yearsToFire}{t('results.year')}</span>
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CurrencySelector value={inputs.currency} onChange={(v) => onUpdateInput('currency', v)} />
        <div className="grid grid-cols-2 gap-2">
          <Input
            label={t('inputs.currentAge')}
            type="number"
            value={inputs.currentAge}
            onChange={handleNum('currentAge')}
          />
          <Input
            label={t('inputs.targetRetireAge')}
            type="number"
            value={inputs.targetRetireAge}
            onChange={handleNum('targetRetireAge')}
          />
          <Input
            label={t('inputs.currentSavings')}
            type="number"
            value={inputs.currentSavings}
            onChange={handleNum('currentSavings')}
          />
          <Input
            label={t('inputs.monthlyIncome')}
            type="number"
            value={inputs.monthlyIncome}
            onChange={handleNum('monthlyIncome')}
          />
          <Input
            label={t('inputs.monthlyExpenses')}
            type="number"
            value={inputs.monthlyExpenses}
            onChange={handleNum('monthlyExpenses')}
          />
        </div>
        <Slider
          label={t('inputs.annualReturnRate')}
          displayValue={`${inputs.annualReturnRate}%`}
          min={0} max={20} step={0.5}
          value={inputs.annualReturnRate}
          onValueChange={(v) => onUpdateInput('annualReturnRate', v)}
        />
        <Slider
          label={t('inputs.inflationRate')}
          displayValue={`${inputs.inflationRate}%`}
          min={0} max={15} step={0.5}
          value={inputs.inflationRate}
          onValueChange={(v) => onUpdateInput('inflationRate', v)}
        />
        <Slider
          label={t('inputs.safeWithdrawalRate')}
          displayValue={`${inputs.safeWithdrawalRate}%`}
          min={1} max={10} step={0.5}
          value={inputs.safeWithdrawalRate}
          onValueChange={(v) => onUpdateInput('safeWithdrawalRate', v)}
        />
      </CardContent>
    </Card>
  )
}
