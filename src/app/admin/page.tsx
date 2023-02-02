'use client'

import { type NextPage } from 'next'
import { Inter } from '@next/font/google'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { type Driver } from '@/types'
import DriverCard from '@/components/drivers/card'

const inter = Inter({ subsets: ['latin'] })

const AdminPage: NextPage = () => {
  const { data, isLoading } = useQuery(['drivers'], async () => {
    const { data } = await axios.get<Driver[]>('/api/drivers')
    return data
  })

  return (
    <main className={inter.className}>
      <h1 className="text-4xl font-bold dark:text-gray-200 mb-10">
        Conductores
      </h1>

      {
        isLoading && (
          <div>Cargando...</div>
        )
      }

      {
        !isLoading && data !== undefined && (
          <div
            className="flex flex-col space-y-3">
            {
              data.map(driver => (
                <DriverCard key={driver.id} driver={driver}/>
              ))
            }
          </div>
        )
      }
    </main>
  )
}

export default AdminPage
