import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Plus, X } from 'lucide-react'
import type { LifeEvent, LifeEventType } from '@/types'

interface Props {
  events: LifeEvent[]
  onChange: (events: LifeEvent[]) => void
}

const EVENT_TYPES: LifeEventType[] = [
  'one_time_income',
  'one_time_expense',
  'income_change',
  'expense_change',
  'passive_income',
]

const EVENT_TYPE_KEYS: Record<LifeEventType, string> = {
  one_time_income: 'lifeEvents.oneTimeIncome',
  one_time_expense: 'lifeEvents.oneTimeExpense',
  income_change: 'lifeEvents.incomeChange',
  expense_change: 'lifeEvents.expenseChange',
  passive_income: 'lifeEvents.passiveIncome',
}

export function LifeEvents({ events, onChange }: Props) {
  const { t } = useTranslation()

  const addEvent = () => {
    onChange([
      ...events,
      {
        id: crypto.randomUUID(),
        name: '',
        type: 'one_time_income',
        amount: 0,
        age: 35,
      },
    ])
  }

  const removeEvent = (id: string) => {
    onChange(events.filter((e) => e.id !== id))
  }

  const updateEvent = (id: string, updates: Partial<LifeEvent>) => {
    onChange(events.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="rounded-lg border p-3 space-y-2 bg-background">
          <div className="flex items-center justify-between">
            <Input
              className="border-0 p-0 h-auto text-sm font-medium shadow-none focus-visible:ring-0"
              placeholder={t('lifeEvents.name')}
              value={event.name}
              onChange={(e) => updateEvent(event.id, { name: e.target.value })}
            />
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeEvent(event.id)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Select
              options={EVENT_TYPES.map((t_type) => ({
                value: t_type,
                label: t(EVENT_TYPE_KEYS[t_type]),
              }))}
              value={event.type}
              onChange={(e) => updateEvent(event.id, { type: e.target.value as LifeEventType })}
            />
            <Input
              type="number"
              placeholder={t('lifeEvents.amount')}
              value={event.amount || ''}
              onChange={(e) => updateEvent(event.id, { amount: parseFloat(e.target.value) || 0 })}
            />
            <Input
              type="number"
              placeholder={t('lifeEvents.age')}
              suffix={t('inputs.years')}
              value={event.age}
              onChange={(e) => updateEvent(event.id, { age: parseInt(e.target.value) || 30 })}
            />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full" onClick={addEvent}>
        <Plus className="mr-1 h-4 w-4" />
        {t('lifeEvents.addEvent')}
      </Button>
    </div>
  )
}
