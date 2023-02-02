import { type FC, useEffect, useState } from 'react'
import { type Driver } from '@/types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Image from 'next/image'

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
      driver.license_photo_url_back
    ])
  }, [avatarUrl])

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
        </div>

        <div className="m-auto flex-1">
          <div className="flex justify-end">
            <button
              className="w-auto text-lg px-4 py-3 mt-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 focus:ring-0 outline-none w-full disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
              Aceptar conductor
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverCard
