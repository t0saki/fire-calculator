import { useTranslation } from 'react-i18next'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCompact, formatCurrency } from '@/lib/currency'
import type { YearlyDataPoint, CurrencyCode } from '@/types'

interface Props {
  data: YearlyDataPoint[]
  currency: CurrencyCode
}

export function WealthChart({ data, currency }: Props) {
  const { t } = useTranslation()

  // Only show up to FIRE achievement + some buffer, max 50 years
  const fireYear = data.find((d) => d.savings >= d.fireTarget && d.year > 0)
  const displayYears = Math.min(
    Math.max((fireYear?.year ?? 30) + 10, 20),
    50,
  )
  const chartData = data.slice(0, displayYears + 1)

  const eventsWithData = chartData.filter((d) => d.events.length > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('results.wealthChart')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="age"
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <YAxis
              tickFormatter={(v: number) => formatCompact(v, currency)}
              tick={{ fontSize: 12 }}
              width={70}
              className="fill-muted-foreground"
            />
            <Tooltip
              formatter={(value: unknown, name: unknown) => [
                formatCurrency(Number(value), currency),
                String(name),
              ]}
              labelFormatter={(label: unknown) => `${t('inputs.currentAge')}: ${label}`}
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="savings"
              name={t('results.savings')}
              stroke="#f97316"
              fill="url(#savingsGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="fireTarget"
              name={t('results.fireTarget')}
              stroke="#ef4444"
              fill="none"
              strokeWidth={1.5}
              strokeDasharray="5 5"
            />
            {eventsWithData.map((d) => (
              <ReferenceDot
                key={d.age}
                x={d.age}
                y={d.savings}
                r={4}
                fill="#3b82f6"
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
