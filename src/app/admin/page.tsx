'use client'

import { Inter } from '@next/font/google'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { type Driver, DriverStatus } from '@/types'
import { useSession } from '@supabase/auth-helpers-react'
import { type FC, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tab } from '@headlessui/react'
import DriverCard from '@/components/drivers/card'
import SimpleDriverCard from '@/components/drivers/card/simple'

const inter = Inter({ subsets: ['latin'] })

function classNames (...classes: Array<string | boolean>) {
  return classes.filter(Boolean).join(' ')
}

const AdminPage: FC = () => {
  const session = useSession()

  const router = useRouter()
  useEffect(() => {
    if (session === null) {
      router.push('/')
    }
  }, [session])

  const [filter, setFilter] = useState<DriverStatus>(DriverStatus.pending)
  const { data, isLoading } = useQuery(['drivers', filter], async () => {
    const { data } = await axios.get<Driver[]>(`/api/drivers?status=${filter}`)
    return data
  })

  const queryClient = useQueryClient()
  const onUpdated = async () => {
    await queryClient.refetchQueries(['drivers', filter])
  }

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

      <Tab.Group>
        <Tab.List
          className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <Tab
            onClick={() => {
              setFilter(DriverStatus.pending)
            }}
            className={
              ({ selected }) => classNames('inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
                selected && 'text-blue-600 border-b-2 border-blue-600')
            }>
            Solicitudes
          </Tab>
          <Tab
            onClick={() => {
              setFilter(DriverStatus.accepted)
            }}
            className={
              ({ selected }) => classNames('inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
                selected && 'text-blue-600 border-b-2 border-blue-600')
            }>
            Activos
          </Tab>
          <Tab
            onClick={() => {
              setFilter(DriverStatus.rejected)
            }}
            className={
              ({ selected }) => classNames('inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
                selected && 'text-blue-600 border-b-2 border-blue-600')
            }>
            Rechazados
          </Tab>
          <Tab
            onClick={() => {
              setFilter(DriverStatus.archived)
            }}
            className={
              ({ selected }) => classNames('inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
                selected && 'text-blue-600 border-b-2 border-blue-600')
            }>
            Archivados
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel className="p-3">
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
                      <DriverCard key={driver.id} driver={driver} onUpdated={onUpdated}/>
                    ))
                  }
                </div>
              )
            }
          </Tab.Panel>
          <Tab.Panel className="p-3">
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
                      <SimpleDriverCard key={driver.id} driver={driver}/>
                    ))
                  }
                </div>
              )
            }
          </Tab.Panel>
          <Tab.Panel className="p-3">
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
                      <SimpleDriverCard key={driver.id} driver={driver}/>
                    ))
                  }
                </div>
              )
            }
          </Tab.Panel>
          <Tab.Panel className="p-3">
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
                      <SimpleDriverCard key={driver.id} driver={driver}/>
                    ))
                  }
                </div>
              )
            }
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </main>
  )
}

export default AdminPage
