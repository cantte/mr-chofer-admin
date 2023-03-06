'use client'

import { type Report } from '@/types'
import { Inter } from '@next/font/google'
import { useSession } from '@supabase/auth-helpers-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, type FC } from 'react'

const inter = Inter({ subsets: ['latin'] })

const ReportsPage: FC = () => {
  const session = useSession()

  const router = useRouter()
  useEffect(() => {
    if (session === null) {
      router.push('/')
    }
  }, [session])

  const { mutate } = useMutation(async () => {
    const { data } = await axios.post('/api/auth/sign-out')
    return data
  })

  const signOut = async () => {
    mutate()
    router.refresh()
  }

  const { data, isLoading } = useQuery(['reports'], async () => {
    const { data } = await axios.get<Report>('/api/reports/today')
    return data
  })

  return (
    <main className={inter.className}>
      <nav className='bg-transparent'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-end h-16'>
            <div className='flex items-center'>
              <div className='block'>
                <div className='flex items-baseline space-x-4'>
                  <NextLink
                    href='/admin'
                    className='bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
                  >
                    Conductores
                  </NextLink>

                  <NextLink
                    href='/admin/rides'
                    className='bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
                  >
                    Solicitudes
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

      <h1 className='text-4xl font-bold dark:text-gray-200 mb-10'>Reportes</h1>

      <div className='flex flex-col'>
        {isLoading
          ? (
          <div className='text-2xl font-bold dark:text-gray-200 mb-10'>
            Cargando...
          </div>
            )
          : (
          <div className='block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'>
            <h5 className='mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white'>
              {data?.rides ?? 0}
            </h5>
            <p className='text-gray-600 dark:text-gray-400'>Carreras del día</p>
          </div>
            )}
      </div>
    </main>
  )
}

export default ReportsPage
