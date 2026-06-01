'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Current session check
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Auth state change detection
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: any, session: any) => {
        const u = session?.user ?? null
        setUser(u)
        // 로그인된 사용자가 있으면 profiles 테이블에 업서트하여 레코드가 없을 때 자동 생성합니다.
        if (u && u.id) {
          ;(async () => {
            try {
              const username = u.email ? u.email.split('@')[0] : 'user'
              await supabase.from('profiles').upsert({ id: u.id, username }).throwOnError()
            } catch (err) {
              // 실패해도 사용자 경험에는 영향이 없도록 콘솔에만 기록
              console.warn('ensure profile upsert failed:', err)
            }
          })()
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
