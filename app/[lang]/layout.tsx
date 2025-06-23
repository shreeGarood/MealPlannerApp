import { Inter } from 'next/font/google'
import { ReduxProvider } from '@/lib/redux/provider'
import { Toaster } from '@/components/ui/toaster'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }]
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: 'en' | 'ar' }
}) {
  const direction = params.lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={params.lang} dir={direction} suppressHydrationWarning>
      <body className={inter.className}>
        <ReduxProvider>
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  )
}
