import { useTranslation } from 'react-i18next'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScenarioCard } from './ScenarioCard'
import { useScenarios } from '@/hooks/useScenarios'
import { formatCompact, formatCurrency } from '@/lib/currency'
import { Plus } from 'lucide-react'

export function ScenarioManager() {
  const { t } = useTranslation()
  const {
    scenarios,
    results,
    addScenario,
    removeScenario,
    duplicateScenario,
    updateScenarioInputs,
    updateScenario,
  } = useScenarios()

  // Build chart data: combine all scenarios by year
  const maxYears = Math.min(
    Math.max(...results.map((r) => r.result.yearsToFire + 10), 20),
    50,
  )

  const chartData = Array.from({ length: maxYears + 1 }, (_, i) => {
    const point: Record<string, number> = { year: i }
    results.forEach(({ scenario, result }) => {
      const dp = result.yearlyData[i]
      if (dp) {
        point[scenario.id] = dp.savings
      }
    })
    return point
  })

  const currency = scenarios[0]?.inputs.currency ?? 'CNY'

  return (
    <div className="space-y-6">
      {/* Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('scenarios.comparisonChart')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
              <YAxis
                tickFormatter={(v: number) => formatCompact(v, currency)}
                tick={{ fontSize: 12 }}
                width={70}
                className="fill-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend />
              {results.map(({ scenario }) => (
                <Area
                  key={scenario.id}
                  type="monotone"
                  dataKey={scenario.id}
                  name={scenario.name}
                  stroke={scenario.color}
                  fill={scenario.color}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('scenarios.comparisonTable')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-muted-foreground"></th>
                  {results.map(({ scenario }) => (
                    <th key={scenario.id} className="text-right py-2 font-medium" style={{ color: scenario.color }}>
                      {scenario.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 text-muted-foreground">{t('results.fireNumber')}</td>
                  {results.map(({ scenario, result }) => (
                    <td key={scenario.id} className="text-right py-2 font-mono">
                      {formatCurrency(result.fireNumber, scenario.inputs.currency)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-muted-foreground">{t('results.yearsToFire')}</td>
                  {results.map(({ scenario, result }) => (
                    <td key={scenario.id} className="text-right py-2 font-mono">
                      {result.yearsToFire} {t('results.years')}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-muted-foreground">{t('results.savingsRate')}</td>
                  {results.map(({ scenario, result }) => (
                    <td key={scenario.id} className="text-right py-2 font-mono">
                      {result.savingsRate}%
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 text-muted-foreground">{t('inputs.monthlyExpenses')}</td>
                  {results.map(({ scenario }) => (
                    <td key={scenario.id} className="text-right py-2 font-mono">
                      {formatCurrency(scenario.inputs.monthlyExpenses, scenario.inputs.currency)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            result={results.find((r) => r.scenario.id === scenario.id)!.result}
            canRemove={scenarios.length > 1}
            canDuplicate={scenarios.length < 4}
            onRemove={() => removeScenario(scenario.id)}
            onDuplicate={() => duplicateScenario(scenario.id)}
            onUpdateInput={(field, value) => updateScenarioInputs(scenario.id, field, value)}
            onUpdateName={(name) => updateScenario(scenario.id, { name })}
          />
        ))}
      </div>

      {scenarios.length < 4 && (
        <Button variant="outline" className="w-full" onClick={addScenario}>
          <Plus className="mr-1 h-4 w-4" />
          {t('scenarios.addScenario')}
        </Button>
      )}
      {scenarios.length >= 4 && (
        <p className="text-center text-sm text-muted-foreground">{t('scenarios.maxScenarios')}</p>
      )}
    </div>
  )
}
