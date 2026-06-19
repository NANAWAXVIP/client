import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-display font-light tracking-[0.08em] uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'text-xs py-3 px-4': size === 'sm',
            'text-[11px] py-4 px-6': size === 'md',
            'text-xs py-5 px-8': size === 'lg',
          },
          {
            'bg-nw-camel text-nw-white hover:bg-[#a3744e] active:scale-[0.99]': variant === 'primary',
            'bg-nw-black text-nw-white hover:bg-[#333] active:scale-[0.99]': variant === 'secondary',
            'bg-transparent text-nw-black hover:text-nw-camel underline underline-offset-4 decoration-[0.5px]': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {children}
          </span>
        ) : children}
      </button>
    )
  }
)

Button.displayName = 'Button'
