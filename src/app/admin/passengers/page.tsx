'use client'

import { type Passenger } from '@/types'
import { useQuery } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState
} from '@tanstack/react-table'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useMemo, useState, type FC } from 'react'

const PassengersPage: FC = () => {
  const router = useRouter()

  const columns = useMemo<Array<ColumnDef<Passenger>>>(
    () => [
      {
        header: 'id',
        accessorKey: 'id',
        cell: info => info.getValue()
      },
      {
        header: 'Nombre',
        accessorKey: 'name',
        cell: info => info.getValue()
      },
      {
        header: 'Genero',
        accessorKey: 'gender',
        cell: info => (info.getValue() === 'Male' ? 'Hombre' : 'Mujer')
      },
      {
        header: 'Celular',
        accessorKey: 'phone',
        cell: info => info.getValue()
      },
      {
        header: 'Fecha de creación',
        accessorKey: 'created_at',
        cell: info =>
          Intl.DateTimeFormat('es-CO', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'America/Bogota'
          }).format(new Date(info.getValue() as string))
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

  const fetchPassengers = async (options: {
    pageIndex: number
    pageSize: number
  }) => {
    const { data } = await axios.get(
      `/api/passengers?page=${options.pageIndex}&pageSize=${options.pageSize}`
    )

    return data
  }

  const dataQuery = useQuery(
    ['passengers', fetchDataOptions],
    async () => await fetchPassengers(fetchDataOptions),
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
    data: dataQuery.data?.passengers ?? defaultData,
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

  return (
    <>
      <h1 className='text-4xl font-bold dark:text-gray-200 mb-10'>Pasajeros</h1>

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
              onClick={() => {
                router.push(`/admin/passengers/${row.original.id}`)
              }}
              key={row.id}
              className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
            >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  )
}

export default PassengersPage
