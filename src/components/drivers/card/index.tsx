import { type FC, useEffect, useState } from 'react'
import { type Driver, DriverStatus } from '@/types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Image from 'next/image'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

type Props = {
  driver: Driver
}

const DriverCard: FC<Props> = ({ driver }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [signedUrls, setSignedUrls] = useState<string[]>([])

  const supabase = useSupabaseClient()

  async function downloadImage (path: string) {
    try {
      const {
        data,
        error
      } = await supabase.storage.from('avatars').download(path)

      if (error !== null) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error)
    }
  }

  async function loadDocumentsUrls (documents: string[]) {
    if (documents.length === 0) {
      return
    }

    try {
      const {
        data,
        error
      } = await supabase.storage.from('documents').createSignedUrls(documents, 3600)

      if (error !== null) {
        throw error
      }

      const urls = data?.map(d => d.signedUrl)

      setSignedUrls(urls)
    } catch (error) {
      console.log('Error downloading image: ', error)
    }
  }

  useEffect(() => {
    if (avatarUrl === null) {
      void downloadImage(driver.photo_url)
    }

    void loadDocumentsUrls([
      driver.id_photo_url_front,
      driver.id_photo_url_back,
      driver.license_photo_url_front,
      driver.license_photo_url_back,
      driver.vehicle?.property_card_photo_url_front ?? '',
      driver.vehicle?.property_card_photo_url_back ?? ''
    ])
  }, [avatarUrl])

  const queryClient = useQueryClient()
  const { mutate } = useMutation(async (data: { driver_id: string, status: DriverStatus }) => {
    await axios.post(`/api/drivers/process/${data.driver_id}?status=${data.status}`)
  }, {
    onSuccess: () => {
      void queryClient.invalidateQueries(['drivers'])
    }
  })

  const performAccept = () => {
    mutate({
      driver_id: driver.id,
      status: DriverStatus.accepted
    })
  }

  const performReject = () => {
    mutate({
      driver_id: driver.id,
      status: DriverStatus.rejected
    })
  }

  return (
    <div
      className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow">
      <div className="flex flex-row px-4 py-4 space-x-5">
        <div className="relative w-[100px] h-[100px]">
          <Image
            src={avatarUrl ?? ''}
            fill
            className="rounded-full"
            alt="Foto de usuatio"/>
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-medium text-gray-900 dark:text-gray-300">
            {driver.id}, {driver.name}
          </p>
          <span className="text-base text-gray-700 dark:text-gray-400">
            Teléfono: {driver.phone}
          </span>
          <span className="text-base text-gray-700 dark:text-gray-400">
            Genero: {driver.gender === 'Male' ? 'Hombre' : 'Mujer'}
          </span>
          <span className="text-base text-gray-700 dark:text-gray-400">
            Ciudad: {driver.city}
          </span>

          <div>
            <div className="flex flex-row pt-3 space-x-5">
              <p className="text-gray-900 dark:text-gray-300">
                {driver.vehicle?.brand}, {driver.vehicle?.line} {driver.vehicle?.model} -
                CC {driver.vehicle?.engine_displacement}
              </p>
              <span className="text-base text-gray-700 dark:text-gray-400">
                Placa: {driver.vehicle?.license_plate}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex flex-row space-x-3 justify-between">
            <a
              className="text-xs text-gray-700 dark:text-gray-400 underline"
              href={signedUrls.at(0)}
              target="_blank" rel="noreferrer">
              Foto de identificación (Frontal)
            </a>

            <a
              className="text-xs text-gray-700 dark:text-gray-400 underline"
              href={signedUrls.at(1)}
              target="_blank" rel="noreferrer">
              Foto de identificación (Atras)
            </a>
          </div>

          <div className="flex flex-row space-x-3 justify-between">
            <a
              className="text-xs text-gray-700 dark:text-gray-400 underline"
              href={signedUrls.at(2)}
              target="_blank" rel="noreferrer">
              Foto de licencia (Frontal)
            </a>

            <a
              className="text-xs text-gray-700 dark:text-gray-400 underline"
              href={signedUrls.at(3)}
              target="_blank" rel="noreferrer">
              Foto de licencia (Atras)
            </a>
          </div>

          <div className="flex flex-row space-x-3 justify-between">
            <a
              className="text-xs text-gray-700 dark:text-gray-400 underline"
              href={signedUrls.at(4)}
              target="_blank" rel="noreferrer">
              Foto de tarjeta de propiedad (Frontal)
            </a>

            <a
              className="text-xs text-gray-700 dark:text-gray-400 underline"
              href={signedUrls.at(5)}
              target="_blank" rel="noreferrer">
              Foto de tarjeta de propiedad (Atras)
            </a>
          </div>
        </div>

        <div className="m-auto flex-1">
          <div className="flex justify-end">
            <div className="flex flex-col">
              <button
                onClick={performAccept}
                className="w-auto px-3 py-2 text-sm font-medium mt-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 focus:ring-0 outline-none w-full disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                Aceptar
              </button>
              <button
                onClick={performReject}
                className="w-auto px-3 py-2 text-sm font-medium mt-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:bg-red-700 focus:ring-0 outline-none w-full disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                Rechazar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverCard
