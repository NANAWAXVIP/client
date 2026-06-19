import { cn } from '@/lib/utils'

interface Props {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  inverted?: boolean
}

const sizes = {
  sm: { text: 'text-[10px]', disc: 'w-6 h-6', discText: 'text-[8px]' },
  md: { text: 'text-sm', disc: 'w-8 h-8', discText: 'text-[11px]' },
  lg: { text: 'text-xl', disc: 'w-11 h-11', discText: 'text-sm' },
}

export function NanawaxLogo({ className, size = 'md', inverted = false }: Props) {
  const s = sizes[size]
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span
        className={cn(
          s.text,
          'font-display font-thin tracking-[0.22em] uppercase',
          inverted ? 'text-nw-white' : 'text-nw-black'
        )}
      >
        nana
      </span>
      <div
        className={cn(
          s.disc,
          'rounded-full flex items-center justify-center shrink-0',
          inverted ? 'bg-nw-white' : 'bg-nw-black'
        )}
      >
        <span
          className={cn(
            s.discText,
            'font-display font-thin tracking-[0.18em] uppercase',
            inverted ? 'text-nw-black' : 'text-nw-white'
          )}
        >
          wax
        </span>
      </div>
    </div>
  )
}
