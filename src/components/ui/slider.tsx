import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  displayValue?: string
  onValueChange?: (value: number) => void
}

export function Slider({ className, label, displayValue, onValueChange, ...props }: SliderProps) {
  return (
    <div className="space-y-1.5">
      {(label || displayValue) && (
        <div className="flex items-center justify-between">
          {label && <label className="text-sm font-medium text-foreground">{label}</label>}
          {displayValue && <span className="text-sm font-mono text-muted-foreground">{displayValue}</span>}
        </div>
      )}
      <input
        type="range"
        className={cn(
          'w-full h-2 rounded-lg appearance-none cursor-pointer',
          'bg-secondary accent-fire',
          className,
        )}
        onChange={(e) => onValueChange?.(Number(e.target.value))}
        {...props}
      />
    </div>
  )
}
