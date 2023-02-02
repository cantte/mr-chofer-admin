import React from 'react'
import { type NextPage } from 'next'
import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

const AdminPage: NextPage = () => {
  return (
    <main className={inter.className}>
      <h1 className="text-4xl font-bold dark:text-gray-200">
        Conductores
      </h1>
    </main>
  )
}

export default AdminPage
