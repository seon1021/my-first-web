"use client"

import React from 'react'
import { useTheme } from '@/lib/ThemeContext'
import { Button } from '@/components/ui/button'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <Button size="sm" variant="outline" onClick={toggle} className="h-8">
      {theme === 'dark' ? '다크 모드' : '라이트 모드'}
    </Button>
  )
}
