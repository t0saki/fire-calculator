import { useTranslation } from 'react-i18next'
import { Select } from '@/components/ui/select'
import { CURRENCIES } from '@/lib/currency'
import type { CurrencyCode } from '@/types'

interface Props {
  value: CurrencyCode
  onChange: (value: CurrencyCode) => void
}

export function CurrencySelector({ value, onChange }: Props) {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const options = Object.values(CURRENCIES).map((c) => ({
    value: c.code,
    label: `${c.symbol} ${c.code} - ${isZh ? c.nameZh : c.name}`,
  }))

  return (
    <Select
      id="currency"
      label={t('inputs.currency')}
      options={options}
      value={value}
      onChange={(e) => onChange(e.target.value as CurrencyCode)}
    />
  )
}
