"use client"

import { SessionProvider } from "next-auth/react"
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from "react-hot-toast"


const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  )
}