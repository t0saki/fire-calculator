import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Play, Loader2 } from 'lucide-react'
import { runMonteCarlo } from '@/lib/monteCarlo'
import { formatCompact } from '@/lib/currency'
import { DEFAULT_MONTE_CARLO } from '@/types'
import type { CalculatorInputs, MonteCarloConfig, MonteCarloResult } from '@/types'

interface Props {
  inputs: CalculatorInputs
}

export function MonteCarloSection({ inputs }: Props) {
  const { t } = useTranslation()
  const [config, setConfig] = useState<MonteCarloConfig>(DEFAULT_MONTE_CARLO)
  const [result, setResult] = useState<MonteCarloResult | null>(null)
  const [running, setRunning] = useState(false)

  const handleRun = useCallback(() => {
    setRunning(true)
    // Use setTimeout to allow UI to update before heavy computation
    setTimeout(() => {
      const r = runMonteCarlo(inputs, config)
      setResult(r)
      setRunning(false)
    }, 50)
  }, [inputs, config])

  const chartData = result
    ? result.percentiles.p50.map((_, i) => ({
        year: i,
        age: inputs.currentAge + i,
        p10: result.percentiles.p10[i],
        p25: result.percentiles.p25[i],
        p50: result.percentiles.p50[i],
        p75: result.percentiles.p75[i],
        p90: result.percentiles.p90[i],
      }))
    : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('monteCarlo.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Slider
            label={t('monteCarlo.simulations')}
            displayValue={config.simulations.toLocaleString()}
            min={100}
            max={10000}
            step={100}
            value={config.simulations}
            onValueChange={(v) => setConfig((c) => ({ ...c, simulations: v }))}
          />
          <Slider
            label={t('monteCarlo.volatility')}
            displayValue={`${config.volatility}%`}
            min={5}
            max={40}
            step={1}
            value={config.volatility}
            onValueChange={(v) => setConfig((c) => ({ ...c, volatility: v }))}
          />
        </div>

        <Button variant="fire" className="w-full" onClick={handleRun} disabled={running}>
          {running ? (
            <>
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              {t('monteCarlo.running')}
            </>
          ) : (
            <>
              <Play className="mr-1 h-4 w-4" />
              {t('monteCarlo.run')}
            </>
          )}
        </Button>

        {result && (
          <>
            <div className="rounded-lg bg-secondary p-4 text-center">
              <p className="text-sm text-muted-foreground">{t('monteCarlo.successDesc')}</p>
              <p className={`text-3xl font-bold mt-1 ${
                result.successRate >= 80 ? 'text-success' : result.successRate >= 50 ? 'text-warning' : 'text-destructive'
              }`}>
                {result.successRate}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {result.simulations.toLocaleString()} {t('monteCarlo.simulations').toLowerCase()}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">{t('monteCarlo.percentiles')}</h4>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="age" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                  <YAxis
                    tickFormatter={(v: number) => formatCompact(v, inputs.currency)}
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
                  <Area type="monotone" dataKey="p90" name={t('monteCarlo.p90')} stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} strokeWidth={1} />
                  <Area type="monotone" dataKey="p75" name={t('monteCarlo.p75')} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={1} />
                  <Area type="monotone" dataKey="p50" name={t('monteCarlo.p50')} stroke="#f97316" fill="#f97316" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="p25" name={t('monteCarlo.p25')} stroke="#eab308" fill="#eab308" fillOpacity={0.1} strokeWidth={1} />
                  <Area type="monotone" dataKey="p10" name={t('monteCarlo.p10')} stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
