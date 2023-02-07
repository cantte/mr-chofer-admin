'use client'

import { Inter } from '@next/font/google'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { type Driver } from '@/types'
import DriverCard from '@/components/drivers/card'
import { useSession } from '@supabase/auth-helpers-react'
import { type FC, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

const AdminPage: FC = () => {
  const session = useSession()

  const router = useRouter()
  useEffect(() => {
    if (session === null) {
      router.push('/')
    }
  }, [session])

  const { data, isLoading } = useQuery(['drivers'], async () => {
    const { data } = await axios.get<Driver[]>('/api/drivers')
    return data.map(driver => ({
      ...driver,
      vehicle: driver.vehicles.at(0)
    }))
  })

  const { mutate } = useMutation(async () => {
    const { data } = await axios.post('/api/auth/sign-out')
    return data
  })

  const signOut = async () => {
    mutate()
    router.refresh()
  }

  return (
    <main className={inter.className}>
      <nav className="shadow bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-16">
            <div className="flex items-center">
              <div className="block">
                <div className="flex items-baseline space-x-4">
                  <button
                    onClick={signOut}
                    className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

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
