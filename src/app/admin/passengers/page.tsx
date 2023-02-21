'use client'

import { type FC, useEffect, useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Inter } from '@next/font/google'
import NextLink from 'next/link'
import { type PassengersTableData } from '@/types'

const inter = Inter({ subsets: ['latin'] })

const PassengersPage: FC = () => {
  const session = useSession()

  const router = useRouter()
  useEffect(() => {
    if (session === null) {
      router.push('/')
    }
  }, [session])

  const fetchPassengers = async (page = 0) => {
    const { data } = await axios.get<PassengersTableData>(
      `/api/passengers?page=${page}`
    )
    return data
  }

  const [page] = useState(0)
  const { data, isLoading } = useQuery(
    ['passengers', page],
    async () => await fetchPassengers(page),
    {
      keepPreviousData: true
    }
  )

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
      <nav className='bg-transparent'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-end h-16'>
            <div className='flex items-center'>
              <div className='block'>
                <div className='flex items-baseline space-x-4'>
                  <NextLink
                    href='/admin/reports'
                    className='bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
                  >
                    Reportes
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

      <h1 className='text-4xl font-bold dark:text-gray-200 mb-10'>
      Pasajeros que han viajado
      </h1>

      {isLoading
        ? (
        <p>Cargando...</p>
          )
        : (
        <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Nombre
                </th>
                <th scope='col' className='px-6 py-3'>
                  Teléfono
                </th>
                <th scope='col' className='px-6 py-3'>
                  {''}
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.passengers.map(passenger => (
                <tr
                  key={passenger.phone}
                  className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                >
                  <th
                    scope='row'
                    className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                  >
                    {passenger.name}
                  </th>
                  <td className='px-6 py-4'>{passenger.phone}</td>
                  <td className='px-6 py-4'>
                    <a
                      href={`tel:${passenger.phone}`}
                      className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                    >
                      Llamar
                    </a>

                    <a
                      href={`https://wa.me/${passenger.phone}`}
                      className='font-medium text-green-600 dark:text-green-500 hover:underline ml-2'
                    >
                      WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          )}
    </main>
  )
}

export default PassengersPage
