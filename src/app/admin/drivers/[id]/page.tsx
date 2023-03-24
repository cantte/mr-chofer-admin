'use client'

import { type Driver } from '@/types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState, type FC } from 'react'

type Props = {
  params: {
    id: string
  }
}

const DriverPage: FC<Props> = ({ params }) => {
  const { data: driver, isLoading } = useQuery<Driver>(
    ['drivers', params.id],
    async () => {
      const { data } = await axios.get(`/api/drivers/${params.id}`)
      return data
    }
  )

  const [avatar, setAvatar] = useState<string | null>(null)
  const [idPhotoUrlBack, setIdPhotoUrlBack] = useState<string | null>(null)
  const supabase = useSupabaseClient()
  useEffect(() => {
    if (driver === undefined) {
      return
    }

    if (driver.photo_url === null) {
      setAvatar(null)
      return
    }

    const url = supabase.storage.from('avatars').getPublicUrl(driver.photo_url)
      .data.publicUrl
    setAvatar(url)

    supabase.storage
      .from('documents')
      .createSignedUrl(driver.id_photo_url_back, 60 * 60 * 24)
      .then(({ data, error }) => {
        if (error != null) {
          console.error(error)
          return
        }
        setIdPhotoUrlBack(data.signedUrl)
      })
  }, [driver])

  return (
    <section>
      <h1 className='text-4xl font-bold dark:text-gray-200 mb-10'>
        Información del conductor
      </h1>
      {isLoading && <p>Cargando...</p>}

      {!isLoading && driver != null && (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='col-span-2 h-full w-full'>
            <div className='bg-white overflow-hidden shadow rounded-lg border'>
              <div className='px-4 py-5 sm:p-6'>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>
                  Datos básicos
                </h3>
              </div>

              <div className='border-t border-gray-200 items-center flex justify-center py-2'>
                <img
                  src={avatar ?? ''}
                  alt='Avatar'
                  className='w-24 h-24 rounded-full'
                />
              </div>

              <div className='border-t border-gray-200'>
                <dl>
                  <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                    <dt className='text-sm font-medium text-gray-500'>
                      Nombre
                    </dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                      {driver.name}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className='border-t border-gray-200'>
                <dl>
                  <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                    <dt className='text-sm font-medium text-gray-500'>
                      Ciudad
                    </dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                      {driver.city}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className='border-t border-gray-200'>
                <dl>
                  <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                    <dt className='text-sm font-medium text-gray-500'>
                      Calificación
                    </dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                      {driver.rating}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className='border-t border-gray-200'>
                <dl>
                  <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                    <dt className='text-sm font-medium text-gray-500'>
                      <a href={idPhotoUrlBack ?? ''} target='_blank' rel='noreferrer'>
                        Ver foto de cédula (Atras)
                      </a>
                    </dt>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg col-span-2 border h-full w-full'>
            <div className='px-4 py-5 sm:p-6'>
              <h3 className='text-lg leading-6 font-medium text-gray-900'>
                Vehículo{' '}
                {driver?.vehicles !== null
                  ? `${driver?.vehicles.license_plate ?? ''}, ${
                      driver?.vehicles.brand ?? ''
                    } ${driver?.vehicles.line ?? ''} ${
                      driver?.vehicles.model ?? ''
                    } - CC ${driver?.vehicles.engine_displacement ?? ''}`
                  : 'No disponible'}
              </h3>
            </div>

            <div className='border-t border-gray-200'>
              <dl>
                <div className='bg-gray-50 px-4 py-5'>
                  <dt className='text-sm font-medium text-gray-500'>
                    Ver foto tarjeta de propiedad (En construcción)
                  </dt>
                </div>
              </dl>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg col-span-4 border h-full w-full'>
            <div className='px-4 py-5 sm:p-6'>
              <h3 className='text-lg leading-6 font-medium text-gray-900'>
                Historial de viajes (En construcción)
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default DriverPage
