'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

type MenuOption = {
  label?: string
  icon?: LucideIcon
  onClick?: () => void
  disabled?: boolean
  visible?: boolean | (() => boolean)
  isHidden?: boolean | (() => boolean)
  render?: () => React.ReactNode
}

interface GlobalDropdownProps {
  label: string | React.ReactNode
  items: MenuOption[]
  buttonClassName?: string
  iconButton?: boolean
  leftIcon?: LucideIcon
}

export default function GlobalDropdown({
  label,
  items,
  buttonClassName,
  iconButton = false,
  leftIcon: LeftIcon,
}: GlobalDropdownProps) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  const checkProp = (prop?: boolean | (() => boolean)) => {
    try {
      if (typeof prop === 'function') return prop()
      return prop ?? false
    } catch {
      return false
    }
  }

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {iconButton ? (
          <Button
            variant="ghost"
            className={cn(
              'rounded-full p-2 text-[var(--primaryColor)] hover:bg-[var(--primaryBg)] transition-colors',
              buttonClassName
            )}
          >
            <div className="flex items-center gap-1">
              {label}
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </Button>
        ) : (
          <Button
            variant="outline"
            className={cn(
              'flex items-center justify-between gap-2 rounded-full border border-[var(--secondaryColor)] bg-[var(--primaryBg)] text-[var(--primaryColor)] hover:bg-[var(--secondaryBg)] transition-all',
              buttonClassName
            )}
          >
            <div className="flex items-center gap-2">
              {LeftIcon && <LeftIcon size={18} className="opacity-80" />}
              <span>{label}</span>
            </div>
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="rounded-2xl min-w-[180px] bg-[var(--primaryBg)] border border-[var(--secondaryColor)] shadow-lg"
      >
        <div className="px-3 py-2 border-b border-[var(--secondaryColor)] mb-1">
          <p className="text-sm text-[var(--secondaryColor)]">{t('Filter.View Options')}</p>
        </div>

        {items
          .filter((item) => {
            const visible = item.visible === undefined || checkProp(item.visible)
            const hidden = checkProp(item.isHidden)
            return visible && !hidden
          })
          .map((item, idx) => {
            const Icon = item.icon
            if (item.render) {
              return (
                <div key={idx} className="p-1">
                  {item.render()}
                </div>
              )
            }

            return (
              <DropdownMenuItem
                key={idx}
                disabled={item.disabled}
                onClick={item.onClick}
                className={cn(
                  'flex items-center gap-2 text-sm cursor-pointer text-[var(--primaryColor)] hover:bg-[var(--secondaryBg)] transition-all rounded-lg px-2 py-1.5',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {Icon && <Icon size={16} />}
                {item.label}
              </DropdownMenuItem>
            )
          })}

        <DropdownMenuSeparator className="my-1 bg-[var(--secondaryColor)] opacity-50" />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
