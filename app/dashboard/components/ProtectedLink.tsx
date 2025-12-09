'use client'

import Link from 'next/link'

interface ProtectedLinkProps {
  href: string
  isEmailVerified: boolean
  className?: string
  children: React.ReactNode
}

export default function ProtectedLink({ 
  href, 
  isEmailVerified, 
  className = '',
  children 
}: ProtectedLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isEmailVerified) {
      e.preventDefault()
      alert('Пожалуйста, подтвердите ваш email для доступа к этой функции')
    }
  }

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}