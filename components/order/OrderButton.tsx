'use client'

import Button from '@/components/Button'
import { useLanguage } from '@/components/LanguageProvider'
import { useOrder, type OrderPreset } from './OrderProvider'

/** The site's one call to action. Same label, same panel, wherever it appears; the floating header keeps one in reach on every page. */
export function OrderButton({ preset, variant = 'solid', size = 'md', className = '' }: { preset?: OrderPreset; variant?: 'solid' | 'ghost'; size?: 'md' | 'lg'; className?: string }) {
  const { language } = useLanguage()
  const { openOrder } = useOrder()
  return (
    <Button variant={variant} size={size} className={className} aria-haspopup="dialog" onClick={() => openOrder(preset)}>
      {language === 'zh' ? '免费评估' : 'Free assessment'} <span aria-hidden className="btn-arrow">↗</span>
    </Button>
  )
}
