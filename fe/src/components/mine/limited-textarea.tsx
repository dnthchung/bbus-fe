/* components/mine/limited-textarea.tsx */
import { useState, ChangeEvent, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'

interface LimitedTextareaProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  placeholder?: string
  disabled?: boolean
}

export function LimitedTextarea({ value, onChange, maxLength = 3000, placeholder, disabled }: LimitedTextareaProps) {
  const [touched, setTouched] = useState(false)

  /* ⬇️ reset khi value trống (form.reset) */
  useEffect(() => {
    if (value.trim() === '') setTouched(false)
  }, [value])

  const error = touched && value.trim() === ''

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    if (val.length <= maxLength) onChange(val)
    if (!touched) setTouched(true)
  }

  return (
    <div className='mt-2'>
      <Textarea placeholder={placeholder} value={value} onChange={handleChange} disabled={disabled} className={`min-h-[100px] ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`} />

      <div className='mt-1 flex justify-end'>
        <span className={`text-xs ${value.length > maxLength * 0.9 ? 'text-red-500' : 'text-muted-foreground'}`}>
          {value.length}/{maxLength}
        </span>
      </div>

      {error && <p className='text-xs text-red-500'>Trường này không thể để trống.</p>}
    </div>
  )
}
