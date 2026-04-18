import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/currency'
import type { FireTypeResult, CurrencyCode } from '@/types'

interface Props {
  types: FireTypeResult[]
  currency: CurrencyCode
}

const TYPE_COLORS: Record<string, string> = {
  lean: 'bg-green-500/10 text-green-600 dark:text-green-400',
  regular: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  fat: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  coast: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  barista: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
}

export function FireTypeComparison({ types, currency }: Props) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('results.fireTypeComparison')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium text-muted-foreground">{t('fireTypes.title')}</th>
                <th className="text-right py-2 font-medium text-muted-foreground">{t('results.targetAmount')}</th>
                <th className="text-right py-2 font-medium text-muted-foreground">{t('results.yearsNeeded')}</th>
                <th className="text-right py-2 font-medium text-muted-foreground">{t('results.monthlyExpense')}</th>
              </tr>
            </thead>
            <tbody>
              {types.map((ft) => (
                <tr key={ft.type} className="border-b last:border-0">
                  <td className="py-2.5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[ft.type]}`}>
                      {t(ft.label)}
                    </span>
                  </td>
                  <td className="text-right py-2.5 font-mono">
                    {formatCurrency(ft.fireNumber, currency)}
                  </td>
                  <td className="text-right py-2.5 font-mono">
                    {ft.yearsToFire} {t('results.years')}
                  </td>
                  <td className="text-right py-2.5 font-mono">
                    {formatCurrency(ft.monthlyExpenseUsed, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
