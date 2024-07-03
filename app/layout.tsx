import './globals.css'
import { Inter as FontSans } from 'next/font/google'
import type { Metadata } from 'next'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'Server Actions Upload',
  description: 'Advanced next.js server-side file form validation and upload'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'w-full bg-background bg-gradient-to-r from-background to-teal-400/10 font-sans antialiased',
          fontSans.variable
        )}
      >
        <main className="container mt-6 lg:w-1/2 md:w-2/3 sm:w-full">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
