'use client'

import { type Report } from '@/types'
import { Inter } from '@next/font/google'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { type FC } from 'react'

const inter = Inter({ subsets: ['latin'] })

const ReportsPage: FC = () => {
  const { data, isLoading } = useQuery(['reports'], async () => {
    const { data } = await axios.get<Report>('/api/reports/today')
    return data
  })

  return (
    <main className={inter.className}>
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
