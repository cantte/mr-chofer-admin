'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { type FC, useEffect } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

const SignInSchema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
})

type SignInFormValues = z.infer<typeof SignInSchema>

const SignInForm: FC = () => {
  const router = useRouter()

  const session = useSession()
  useEffect(() => {
    if (session !== null) {
      router.replace('/admin')
    }
  }, [session])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema)
  })

  const supabase = useSupabaseClient()
  const { mutate, isLoading } = useMutation(async (data: SignInFormValues) => {
    const { data: response } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })

    return response
  }, {
    onSuccess: () => {
      router.replace('/admin')
      router.refresh()
      window.location.reload()
    }
  })

  const onSubmit: SubmitHandler<SignInFormValues> = (data) => {
    mutate(data)
  }

  const isDisabled = isSubmitting || isLoading

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        className="flex flex-col items-center justify-center w-full mt-7 space-y-7">
        <div className="w-full">
          <span className="block font-medium">Email</span>
          <input
            type="text"
            className="block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 dark:border-neutral-600 focus:bg-white dark:focus:bg-neutral-700 text-gray-900 dark:text-gray-100 focus:border-blue-600 dark:focus:border-blue-300 focus:ring-0 outline-none w-full disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            {...register('email')}
            disabled={isDisabled}
          />

          {errors.email !== undefined && (
            <p
              className="text-sm text-red-700 dark:text-red-500 font-medium mt-2">{errors.email.message}</p>
          )}
        </div>

        <div className="w-full">
          <span className="block font-medium">Contraseña</span>
          <input
            type="password"
            className="block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 dark:border-neutral-600 focus:bg-white dark:focus:bg-neutral-700 text-gray-900 dark:text-gray-100 focus:border-blue-600 dark:focus:border-blue-300 focus:ring-0 outline-none w-full disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            {...register('password')}
            disabled={isDisabled}
          />

          {errors.password !== undefined && (
            <p
              className="text-sm text-red-700 dark:text-red-500 font-medium mt-2">{errors.password.message}</p>
          )}
        </div>

        <div className="w-full">
          <button
            type="submit"
            disabled={isDisabled}
            className="block text-lg px-4 py-3 mt-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 focus:ring-0 outline-none w-full disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </form>
  )
}

export default SignInForm
