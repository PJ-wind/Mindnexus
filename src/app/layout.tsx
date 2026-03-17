import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindNexus — Virtual Counselling Platform',
  description: "Nigeria's leading virtual counselling platform. Professional mental health support, available to everyone, anywhere.",
  keywords: 'counselling, therapy, mental health, Nigeria, online therapy, psychologist',
  openGraph: {
    title: 'MindNexus',
    description: 'Professional mental health support from anywhere',
    type: 'website'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="bottom-center" toastOptions={{
            style: { borderRadius: '8px', background: '#185FA5', color: '#fff', fontSize: '13px' },
            duration: 3000
          }} />
        </Providers>
      </body>
    </html>
  )
}
