import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/currency'
import { formatDate } from '@/lib/formatters'
import type { FireResult, CurrencyCode } from '@/types'

interface Props {
  result: FireResult
  currency: CurrencyCode
}

export function Summary({ result, currency }: Props) {
  const { t, i18n } = useTranslation()

  const cards = [
    {
      label: t('results.fireNumber'),
      value: formatCurrency(result.fireNumber, currency),
      color: 'text-fire',
    },
    {
      label: t('results.yearsToFire'),
      value: `${result.yearsToFire} ${t('results.years')}`,
      color: 'text-foreground',
    },
    {
      label: t('results.fireDate'),
      value: formatDate(result.fireDate, i18n.language),
      color: 'text-foreground',
    },
    {
      label: t('results.savingsRate'),
      value: `${result.savingsRate}%`,
      color: result.savingsRate >= 50 ? 'text-success' : result.savingsRate >= 25 ? 'text-warning' : 'text-destructive',
    },
  ]

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold">{t('results.summary')}</h2>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className={`text-xl font-bold ${card.color} mt-1`}>{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
