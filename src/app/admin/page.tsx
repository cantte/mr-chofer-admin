'use client'

import PhoneIcon from '@/components/icons/phone'
import WhatsappIcon from '@/components/icons/whatsapp'
import { DriverStatus, type Driver } from '@/types'
import { Tab } from '@headlessui/react'
import { Inter } from '@next/font/google'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useQuery } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState
} from '@tanstack/react-table'
import axios from 'axios'
import NextLink from 'next/link'
import { useMemo, useState, type FC } from 'react'

const inter = Inter({ subsets: ['latin'] })

function classNames (...classes: Array<string | boolean>) {
  return classes.filter(Boolean).join(' ')
}

const AdminPage: FC = () => {
  const columns = useMemo<Array<ColumnDef<Driver>>>(
    () => [
      {
        header: 'Cédula',
        accessorKey: 'id',
        cell: info => info.getValue()
      },
      {
        header: 'Nombre',
        accessorKey: 'name',
        cell: info => info.getValue()
      },
      {
        header: 'Ciudad',
        accessorKey: 'city',
        cell: info => info.getValue()
      },
      {
        header: 'Saldo',
        accessorKey: 'balance',
        cell: info =>
          Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
          }).format(Number(info.getValue()))
      },
      {
        header: 'Número de carreras',
        accessorKey: 'rides',
        cell: info => info.getValue()
      },
      {
        header: 'Acciones',
        cell: info => (
          <div className='flex items-center space-x-3'>
            <a
              href={`https://wa.me/+57${info.row.original.phone}`}
              target='_blank'
              className='px-2 py-1 text-sm font-medium leading-5 text-white hover:bg-slate-100 rounded-md'
              rel='noreferrer'
            >
              <WhatsappIcon />
            </a>

            <a
              href={`tel:${info.row.original.phone}`}
              target='_blank'
              className='px-2 py-1 text-sm font-medium leading-5 text-white hover:bg-slate-100 rounded-md'
              rel='noreferrer'
            >
              <PhoneIcon />
            </a>

            <NextLink href={`/admin/drivers/${info.row.original.id}`}>
              <span className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg px-3.5 py-3 text-md text-center dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600'>
                Ver
              </span>
            </NextLink>
          </div>
        )
      }
    ],
    []
  )

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const fetchDataOptions = {
    pageIndex,
    pageSize
  }

  const supabase = useSupabaseClient()
  const fetchDrivers = async (
    filter: DriverStatus,
    options: {
      pageIndex: number
      pageSize: number
    }
  ) => {
    const { data } = await axios.get<Driver[]>(
      `/api/drivers?status=${filter}&page=${options.pageIndex}&pageSize=${options.pageSize}`
    )

    const transformedData = data.map(driver => {
      const { data: photoUrl } = supabase.storage
        .from('avatars')
        .getPublicUrl(driver.photo_url)
      return {
        ...driver,
        photo_url: photoUrl.publicUrl
      }
    })

    return transformedData
  }

  const [filter, setFilter] = useState<DriverStatus>(DriverStatus.pending)
  const { data, isLoading } = useQuery(
    ['drivers', filter, fetchDataOptions],
    async () => await fetchDrivers(filter, fetchDataOptions),
    {
      keepPreviousData: true
    }
  )

  const defaultData = useMemo(() => [], [])

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize
    }),
    [pageIndex, pageSize]
  )

  const table = useReactTable({
    data: data ?? defaultData,
    columns,
    state: {
      pagination,
      columnVisibility: {
        id: false
      }
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true
  })

  // const queryClient = useQueryClient()
  // const onUpdated = async () => {
  //  await queryClient.refetchQueries(['drivers', filter])
  // }

  return (
    <main className={inter.className}>
      <h1 className='text-4xl font-bold dark:text-gray-200 mb-10'>
        Conductores
      </h1>

      <Tab.Group>
        <Tab.List className='text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700'>
          <Tab
            onClick={() => {
              setFilter(DriverStatus.pending)
            }}
            className={({ selected }) =>
              classNames(
                'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
                selected && 'text-blue-600 border-b-2 border-blue-600'
              )
            }
          >
            Solicitudes
          </Tab>
          <Tab
            onClick={() => {
              setFilter(DriverStatus.accepted)
            }}
            className={({ selected }) =>
              classNames(
                'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
                selected && 'text-blue-600 border-b-2 border-blue-600'
              )
            }
          >
            Activos
          </Tab>
          <Tab
            onClick={() => {
              setFilter(DriverStatus.rejected)
            }}
            className={({ selected }) =>
              classNames(
                'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
                selected && 'text-blue-600 border-b-2 border-blue-600'
              )
            }
          >
            Rechazados
          </Tab>
          <Tab
            onClick={() => {
              setFilter(DriverStatus.archived)
            }}
            className={({ selected }) =>
              classNames(
                'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
                selected && 'text-blue-600 border-b-2 border-blue-600'
              )
            }
          >
            Archivados
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel className='p-3'></Tab.Panel>
          <Tab.Panel className='p-3'></Tab.Panel>
          <Tab.Panel className='p-3'></Tab.Panel>
          <Tab.Panel className='p-3'></Tab.Panel>
        </Tab.Panels>

        {isLoading && <div>Cargando...</div>}
        {!isLoading && data !== undefined && (
          <>
            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th scope='col' className='px-6 py-3' key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                  >
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className='px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className='h-2' />

            <nav aria-label='Page navigation example'>
              <ul className='inline-flex items-center -space-x-px'>
                <li>
                  <button
                    onClick={() => {
                      table.previousPage()
                    }}
                    className='block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                  >
                    <span className='sr-only'>Anterior</span>
                    <svg
                      aria-hidden='true'
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                  </button>
                </li>
                {}
                <li>
                  <button
                    onClick={() => {
                      table.nextPage()
                    }}
                    className='block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                  >
                    <span className='sr-only'>Siguiente</span>
                    <svg
                      aria-hidden='true'
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </>
        )}
      </Tab.Group>
    </main>
  )
}

export default AdminPage
