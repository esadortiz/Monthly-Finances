'use client'

import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AuthFloatingInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'placeholder'> {
  id: string
  label: string
  icon: ReactNode
  endAdornment?: ReactNode
  wrapperClassName?: string
}

export function AuthFloatingInput({
  id,
  label,
  icon,
  endAdornment,
  wrapperClassName,
  className,
  ...props
}: AuthFloatingInputProps) {
  return (
    <div className={cn('relative mb-[35px] group', wrapperClassName)}>
      <i className="absolute left-0 top-3 text-gray-400 dark:text-white/60 text-base transition-colors duration-300 group-focus-within:text-black">
        {icon}
      </i>
      <input
        id={id}
        placeholder=" "
        className={cn(
          'peer w-full pt-3 pb-3 pl-8 text-base text-gray-900 dark:text-white bg-transparent border-none border-b border-b-gray-300 dark:border-b-white/30 outline-none transition-all duration-300 focus:border-b-black valid:border-b-black',
          endAdornment ? 'pr-10' : 'pr-2',
          className
        )}
        {...props}
      />
      {endAdornment}
      <label
        htmlFor={id}
        className="absolute top-3 left-8 text-gray-500 dark:text-white/70 pointer-events-none transition-all duration-300 group-focus-within:top-[-18px] group-focus-within:left-0 group-focus-within:text-xs group-focus-within:text-black group-focus-within:font-medium peer-[:not(:placeholder-shown)]:top-[-18px] peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-black peer-[:not(:placeholder-shown)]:font-medium"
      >
        {label}
      </label>
    </div>
  )
}
