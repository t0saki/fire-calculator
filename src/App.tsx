import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from '@/components/layout/Header'
import { BasicInputs } from '@/components/calculator/BasicInputs'
import { InvestmentInputs } from '@/components/calculator/InvestmentInputs'
import { CurrencySelector } from '@/components/calculator/CurrencySelector'
import { FireTypeSelector } from '@/components/calculator/FireTypeSelector'
import { LifeEvents } from '@/components/calculator/LifeEvents'
import { Summary } from '@/components/results/Summary'
import { WealthChart } from '@/components/results/WealthChart'
import { FireTypeComparison } from '@/components/results/FireTypeComparison'
import { MonteCarloSection } from '@/components/results/MonteCarloSection'
import { ScenarioManager } from '@/components/comparison/ScenarioManager'
import { useCalculator } from '@/hooks/useCalculator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeftRight } from 'lucide-react'
import type { CalculatorInputs } from '@/types'

export default function App() {
  const { t } = useTranslation()
  const [showComparison, setShowComparison] = useState(false)
  const { inputs, setInputs, result, fireTypes } = useCalculator()

  const updateField = <K extends keyof CalculatorInputs>(field: K, value: CalculatorInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{t('app.subtitle')}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
          >
            <ArrowLeftRight className="mr-1 h-4 w-4" />
            {t('nav.comparison')}
          </Button>
        </div>

        {showComparison ? (
          <ScenarioManager />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            {/* Left: Inputs */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('inputs.basicInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CurrencySelector value={inputs.currency} onChange={(v) => updateField('currency', v)} />
                  <BasicInputs inputs={inputs} onChange={updateField} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('inputs.investmentParams')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <InvestmentInputs inputs={inputs} onChange={updateField} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('fireTypes.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FireTypeSelector />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('lifeEvents.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <LifeEvents
                    events={inputs.lifeEvents}
                    onChange={(events) => updateField('lifeEvents', events)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right: Results */}
            <div className="space-y-4">
              <Summary result={result} currency={inputs.currency} />
              <WealthChart data={result.yearlyData} currency={inputs.currency} />
              <FireTypeComparison types={fireTypes} currency={inputs.currency} />
              <MonteCarloSection inputs={inputs} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
