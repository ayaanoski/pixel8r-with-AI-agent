import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import { CopilotKit } from '@copilotkit/react-core'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Pixel8r',
  description: 'Convert your images into 8-bit pixelated art',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
      </body>
    </html>
  )
}