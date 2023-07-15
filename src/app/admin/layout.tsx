'use client'

import { useMutation } from '@tanstack/react-query'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC, type PropsWithChildren } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  const supabase = useSupabaseClient()
  const router = useRouter()

  const { mutate } = useMutation(async () => {
    const { error } = await supabase.auth.signOut()
    if (error != null) throw error
  }, {
    onSuccess: () => {
      router.replace('/')
      router.refresh()
      window.location.reload()
    }
  })

  const signOut = async () => {
    mutate()
  }

  return (
    <main className='lg:overflow-x-hidden'>
      <nav className='bg-transparent'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-end h-16'>
            <div className='flex items-center'>
              <div className='block'>
                <div className='flex items-baseline space-x-4'>
                  <NextLink
                    href='/admin/passengers'
                    className='bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
                  >
                    Pasajeros
                  </NextLink>

                  <NextLink
                    href='/admin/rides'
                    className='bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
                  >
                    Solicitudes
                  </NextLink>

                  <NextLink
                    href='/admin'
                    className='bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
                  >
                    Conductores
                  </NextLink>

                  <button
                    onClick={signOut}
                    className='bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {children}
    </main>
  )
}

export default RootLayout
