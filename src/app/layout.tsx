'use client'

import './globals.css'
import { type FC, type PropsWithChildren, useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  const [supabase] = useState(() => createBrowserSupabaseClient())

  return (
    <html lang="en">
    <head/>
    <body>
    <main className="lg:overflow-x-hidden">
      <SessionContextProvider supabaseClient={supabase}>
        <QueryClientProvider client={queryClient}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pt-10 sm:pt-16 lg:pt-0 lg:pb-14">
              <div className="mt-8">{children}</div>
            </div>
          </div>
        </QueryClientProvider>
      </SessionContextProvider>
    </main>
    </body>
    </html>
  )
}

export default RootLayout
