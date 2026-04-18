import { useTranslation } from 'react-i18next'
import type { FireType } from '@/types'

const FIRE_TYPES: { type: FireType; icon: string }[] = [
  { type: 'lean', icon: '&#x1F331;' },
  { type: 'regular', icon: '&#x1F525;' },
  { type: 'fat', icon: '&#x1F451;' },
  { type: 'coast', icon: '&#x26F5;' },
  { type: 'barista', icon: '&#x2615;' },
]

export function FireTypeSelector() {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      {FIRE_TYPES.map(({ type, icon }) => (
        <div
          key={type}
          className="flex items-start gap-3 rounded-lg border p-3 bg-background"
        >
          <span className="text-lg" dangerouslySetInnerHTML={{ __html: icon }} />
          <div>
            <div className="text-sm font-medium">{t(`fireTypes.${type}`)}</div>
            <div className="text-xs text-muted-foreground">{t(`fireTypes.${type}Desc`)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
