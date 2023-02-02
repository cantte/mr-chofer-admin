import { Inter } from '@next/font/google'
import { type NextPage } from 'next'
import SignInForm from '@/components/auth/sign-in'

const inter = Inter({ subsets: ['latin'] })

const Home: NextPage = () => {
  return (
    <main className={inter.className}>
      <h1 className="text-4xl font-bold dark:text-gray-200">
        MrChoffer - Admin
      </h1>

      <div className="w-full px-7 py-7 my-10 rounded dark:bg-neutral-800">
        <h2 className="text-4xl font-bold dark:text-gray-200">
          Iniciar sesión
        </h2>

        <SignInForm/>
      </div>
    </main>
  )
}

export default Home
