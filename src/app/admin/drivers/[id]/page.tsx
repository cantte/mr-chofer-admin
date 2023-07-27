'use client'

import { DriverStatus, type Driver, type PassengerRideHistory } from '@/types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import clsx from 'clsx'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type FC } from 'react'
import WhatsappIcon from '@/components/icons/whatsapp'

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
  const [signedUrls, setSignedUrls] = useState<string[]>([])

  const loadDocumentsUrls = async (documents: string[]) => {
    if (documents.length === 0) {
      return
    }

    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrls(documents, 3600)

      if (error !== null) {
        throw error
      }

      const urls = data?.map(d => d.signedUrl)

      setSignedUrls(urls)
    } catch (error) {
      console.log('Error downloading image: ', error)
    }
  }

  const supabase = useSupabaseClient()
  useEffect(() => {
    if (driver === undefined) {
      return
    }

    if (driver.photo_url === null) {
      setAvatar(null)
      return
    }

    const url = supabase.storage
      .from('avatars')
      .createSignedUrl(driver.photo_url, 3600)

    url.then(({ data, error }) => {
      if (error !== null) {
        throw error
      }

      setAvatar(data?.signedUrl ?? null)
    })

    void loadDocumentsUrls([
      driver.id_photo_url_front,
      driver.id_photo_url_back,
      driver.license_photo_url_front,
      driver.license_photo_url_back,
      driver.vehicles?.property_card_photo_url_front ?? '',
      driver.vehicles?.property_card_photo_url_back ?? '',
      driver.contract_url ?? '',
      driver.notary_power_url ?? ''
    ])
  }, [driver])

  const router = useRouter()
  const { mutate } = useMutation(
    async (data: { driver_id: string, status: DriverStatus }) => {
      await axios.post(
        `/api/drivers/process/${data.driver_id}?status=${data.status}`
      )
    },
    {
      onSuccess: () => {
        router.push('/admin')
      }
    }
  )

  const performAccept = () => {
    mutate({
      driver_id: driver?.id ?? '',
      status: DriverStatus.accepted
    })
  }

  const performReject = () => {
    mutate({
      driver_id: driver?.id ?? '',
      status: DriverStatus.rejected
    })
  }

  const performArchive = () => {
    mutate({
      driver_id: driver?.id ?? '',
      status: DriverStatus.archived
    })
  }

  const { data: rideHistory, isLoading: isLoadingRideHistory } = useQuery(
    ['passengers', params.id, 'rideHistory'],
    async () => {
      const { data } = await axios.get<PassengerRideHistory[]>(
        `/api/drivers/${params.id}/ride-history`
      )
      return data
    }
  )

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
                      Cédula
                    </dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                      {driver.id}
                    </dd>
                  </div>
                </dl>
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
                      <a
                        href={signedUrls.at(0) ?? ''}
                        target='_blank'
                        rel='noreferrer'
                      >
                        Ver foto de cédula (Frente)
                      </a>
                    </dt>

                    <dt className='text-sm font-medium text-gray-500'>
                      <a
                        href={signedUrls.at(1) ?? ''}
                        target='_blank'
                        rel='noreferrer'
                      >
                        Ver foto de cédula (Atras)
                      </a>
                    </dt>

                    <dt className='text-sm font-medium text-gray-500'>
                      <a
                        href={signedUrls.at(2) ?? ''}
                        target='_blank'
                        rel='noreferrer'
                      >
                        Ver foto de licencia (Frente)
                      </a>
                    </dt>

                    <dt className='text-sm font-medium text-gray-500'>
                      <a
                        href={signedUrls.at(3) ?? ''}
                        target='_blank'
                        rel='noreferrer'
                      >
                        Ver foto de licencia (Atras)
                      </a>
                    </dt>

                    {driver.contract_url !== null && (
                      <dt className='text-sm font-medium text-gray-500'>
                        <a
                          href={signedUrls.at(6) ?? ''}
                          target='_blank'
                          rel='noreferrer'
                        >
                          Ver contrato
                        </a>
                      </dt>
                    )}

                    {driver.notary_power_url !== null && (
                      <dt className='text-sm font-medium text-gray-500'>
                        <a
                          href={signedUrls.at(7) ?? ''}
                          target='_blank'
                          rel='noreferrer'
                        >
                          Ver poder notarial
                        </a>
                      </dt>
                    )}
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
                  ? `Placa(${driver?.vehicles.license_plate ?? ''}) Marca(${
                      driver?.vehicles.brand ?? ''
                    }) Línea(${driver?.vehicles.line ?? ''}) Modelo(${
                      driver?.vehicles.model ?? ''
                    }) Color(${driver?.vehicles.color ?? ''}) Cilindraje(CC ${
                      driver?.vehicles.engine_displacement ?? ''
                    })`
                  : 'No disponible'}
              </h3>
            </div>

            <div className='border-t border-gray-200'>
              <dl>
                <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>
                    <a
                      href={signedUrls.at(4) ?? ''}
                      target='_blank'
                      rel='noreferrer'
                    >
                      Ver foto de tarjeta de propiedad (Frente)
                    </a>
                  </dt>

                  <dt className='text-sm font-medium text-gray-500'>
                    <a
                      href={signedUrls.at(5) ?? ''}
                      target='_blank'
                      rel='noreferrer'
                    >
                      Ver foto de tarjeta de propiedad (Atras)
                    </a>
                  </dt>
                </div>
              </dl>
            </div>

            <div className='border-t border-gray-200'>
              <dl>
                <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>
                    Número de cédula en la tarjeta de propiedad
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                    {driver.vehicles?.owner_id ?? 'No disponible'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className='px-4 py-5 sm:p-6'>
              <h3 className='text-lg leading-6 font-medium text-gray-900'>
                Acciones
              </h3>
            </div>

            <div className='border-t border-gray-200'>
              <div className='px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                {driver.status !== DriverStatus.accepted && (
                  <button
                    onClick={performAccept}
                    disabled={isLoading}
                    className='px-3 py-2 text-sm font-medium mt-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 focus:ring-0 outline-none w-full disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                  >
                    Aceptar
                  </button>
                )}
                {driver.status !== DriverStatus.rejected && (
                  <button
                    onClick={performReject}
                    disabled={isLoading}
                    className='px-3 py-2 text-sm font-medium mt-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:bg-red-700 focus:ring-0 outline-none w-full disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                  >
                    Rechazar
                  </button>
                )}
                {driver.status !== DriverStatus.archived && (
                  <button
                    onClick={performArchive}
                    disabled={isLoading}
                    className='px-3 py-2 text-sm font-medium mt-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 focus:bg-yellow-600 focus:ring-0 outline-none w-full disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                  >
                    Archivar
                  </button>
                )}
              </div>

              <div className="mt-3 flex flex-row justify-start px-3 items-center w-full">
                <a
                  href={`https://wa.me/+57${driver.phone}`}
                  target='_blank'
                  className='flex flex-row space-x-5 items-center px-2 py-1 text-sm border border-gray-200 font-medium leading-5 hover:bg-slate-100 rounded-md w-full'
                  rel='noreferrer'
                >
                  <span>
                    Contactar por Whatsapp
                  </span>
                  <span>
                    <WhatsappIcon />
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg col-span-2 lg:col-span-4 border h-full w-full'>
            <div className='px-4 py-5 sm:p-6'>
              <h3 className='text-lg leading-6 font-medium text-gray-900'>
                Historial de viajes
              </h3>
            </div>

            <div className='border-t border-gray-200 max-h-[30rem] overflow-auto'>
              {isLoadingRideHistory
                ? (
                <div className='flex justify-center items-center'>
                  <div className='loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4'></div>
                </div>
                  )
                : (
                <div className='bg-white overflow-hidden'>
                  <ul>
                    {rideHistory?.map(ride => (
                      <li key={ride.id}>
                        <NextLink
                          href={`/admin/rides/${ride.id}`}
                          className='block hover:bg-gray-50'
                        >
                          <div className='px-4 py-4 sm:px-6'>
                            <div className='flex items-center justify-between'>
                              <div className='flex flex-col'>
                                <p className='text-sm truncate'>
                                  Fecha:{' '}
                                  {Intl.DateTimeFormat('es-CO', {
                                    dateStyle: 'long',
                                    timeStyle: 'short',
                                    timeZone: 'America/Bogota'
                                  }).format(new Date(ride.request_time))}
                                </p>

                                <p className='text-sm truncate'>
                                  Origen: {ride.pickup_location}
                                </p>

                                <p className='text-sm truncate'>
                                  Destino: {ride.destination}
                                </p>

                                <p className='text-sm truncate'>
                                  Genero: {ride.gender}
                                </p>

                                <p className='text-sm truncate'>
                                  Precio:{' '}
                                  {Intl.NumberFormat('es-CO', {
                                    style: 'currency',
                                    currency: 'COP'
                                  }).format(ride.final_price)}
                                </p>
                              </div>
                              <div className='ml-2 flex-shrink-0 flex'>
                                <p
                                  className={clsx(
                                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                    ride.status === 'completed' &&
                                      'bg-green-100 text-green-800',
                                    ride.status === 'canceled' &&
                                      'bg-red-100 text-red-800',
                                    ride.status === 'ignored' &&
                                      'bg-yellow-100 text-yellow-800'
                                  )}
                                >
                                  {ride.status}
                                </p>
                              </div>
                            </div>
                          </div>
                        </NextLink>
                      </li>
                    ))}
                  </ul>
                </div>
                  )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default DriverPage
