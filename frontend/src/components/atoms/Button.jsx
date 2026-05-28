import React from 'react'
import { Link } from 'react-router-dom'

export default function Button({ to, children, variant = 'primary', className = '', icon, ...props }) {
  const base = 'inline-flex items-center justify-center gap-3 rounded-[12px] px-8 py-4 text-[15px] font-semibold transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00450d]/30'
  const variants = {
    primary: 'bg-primary text-white shadow-[0_14px_40px_rgba(4,69,13,0.18)] hover:-translate-y-[1px] hover:shadow-[0_16px_44px_rgba(4,69,13,0.22)]',
    secondary: 'bg-secondary text-white shadow-[0_14px_40px_rgba(3,69,110,0.14)] hover:-translate-y-[1px] hover:shadow-[0_16px_44px_rgba(3,69,110,0.18)]',
    ghost: 'bg-secondary-fixed text-[#071e27] border border-[#cfe6f2] hover:-translate-y-[1px] hover:bg-white',
    neutral: 'bg-[#dbf1fe] text-[#071e27] border border-[#cfe6f2]'
  }
  const cls = `${base} ${variants[variant] || variants.primary} ${className}`

  const content = (
    <>
      {icon ? <span className="inline-flex items-center justify-center w-5 h-5">{icon}</span> : null}
      <span className="leading-none">{children}</span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <button className={cls} {...props}>
      {content}
    </button>
  )
}
