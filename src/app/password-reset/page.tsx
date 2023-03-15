'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useMutation } from '@tanstack/react-query'
import { type FC } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })

type PasswordResetFormValues = z.infer<typeof schema>

const PasswordResetPage: FC = () => {
  const { register, handleSubmit, formState } =
    useForm<PasswordResetFormValues>({
      resolver: zodResolver(schema)
    })

  const client = useSupabaseClient()

  const { mutate } = useMutation(
    async (data: PasswordResetFormValues) => {
      const { data: result, error } = await client.auth.updateUser({
        password: data.password
      })

      if (error != null) {
        throw error
      }

      return result
    },
    {
      onSuccess: () => {
        alert('Contraseña actualizada')
      }
    }
  )

  const onSubmit: SubmitHandler<PasswordResetFormValues> = data => {
    mutate(data)
  }

  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      <div className='w-full max-w-lg'>
        <div className='flex flex-col items-center justify-center w-full space-y-7'>
          <h1 className='text-4xl font-bold'>Restablecer contraseña</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='w-full'>
              <span className='block font-medium'>Nueva contraseña</span>
              <input
                type='password'
                className='block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 dark:border-neutral-600 focus:bg-white dark:focus:bg-neutral-700 text-gray-900 dark:text-gray-100 focus:border-blue-600 dark:focus:border-blue-300 focus:ring-0 outline-none w-full disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                {...register('password')}
                disabled={formState.isSubmitting}
              />
              {
                (formState.errors.password != null) && (
                  <span className='block text-red-500 text-sm mt-1'>
                    {formState.errors.password.message}
                  </span>
                )
              }
            </div>
            <div className='w-full'>
              <span className='block font-medium'>Confirmar contraseña</span>
              <input
                type='password'
                className='block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 dark:border-neutral-600 focus:bg-white dark:focus:bg-neutral-700 text-gray-900 dark:text-gray-100 focus:border-blue-600 dark:focus:border-blue-300 focus:ring-0 outline-none w-full disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                {...register('confirmPassword')}
                disabled={formState.isSubmitting}
              />

              {
                (formState.errors.confirmPassword != null) && (
                  <span className='block text-red-500 text-sm mt-1'>
                    {formState.errors.confirmPassword.message}
                  </span>
                )
              }
            </div>
            <div className='w-full'>
              <button
                type='submit'
                className='block bg-blue-600 text-white text-lg px-4 py-3 mt-2 rounded-lg focus:bg-blue-700 focus:ring-0 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                disabled={formState.isSubmitting}
              >
                Restablecer contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PasswordResetPage
