import type { CurrencyCode } from '@/types'

interface CurrencyInfo {
  code: CurrencyCode
  symbol: string
  name: string
  nameZh: string
  locale: string
  rate: number // relative to USD
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  CNY: { code: 'CNY', symbol: '\u00a5', name: 'Chinese Yuan', nameZh: '\u4eba\u6c11\u5e01', locale: 'zh-CN', rate: 7.24 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', nameZh: '\u7f8e\u5143', locale: 'en-US', rate: 1 },
  EUR: { code: 'EUR', symbol: '\u20ac', name: 'Euro', nameZh: '\u6b27\u5143', locale: 'de-DE', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '\u00a3', name: 'British Pound', nameZh: '\u82f1\u938a', locale: 'en-GB', rate: 0.79 },
  JPY: { code: 'JPY', symbol: '\u00a5', name: 'Japanese Yen', nameZh: '\u65e5\u5143', locale: 'ja-JP', rate: 154.5 },
  HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', nameZh: '\u6e2f\u5e01', locale: 'zh-HK', rate: 7.82 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', nameZh: '\u65b0\u52a0\u5761\u5143', locale: 'en-SG', rate: 1.34 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', nameZh: '\u6fb3\u5143', locale: 'en-AU', rate: 1.53 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', nameZh: '\u52a0\u5143', locale: 'en-CA', rate: 1.36 },
}

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const info = CURRENCIES[currency]
  return new Intl.NumberFormat(info.locale, {
    style: 'currency',
    currency: info.code,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCompact(amount: number, currency: CurrencyCode): string {
  const info = CURRENCIES[currency]
  if (amount >= 1e8) {
    return info.symbol + (amount / 1e8).toFixed(1) + (currency === 'CNY' ? '\u4ebf' : 'B')
  }
  if (amount >= 1e4 && currency === 'CNY') {
    return info.symbol + (amount / 1e4).toFixed(1) + '\u4e07'
  }
  if (amount >= 1e6) {
    return info.symbol + (amount / 1e6).toFixed(1) + 'M'
  }
  if (amount >= 1e3) {
    return info.symbol + (amount / 1e3).toFixed(1) + 'K'
  }
  return info.symbol + amount.toFixed(0)
}
