import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SettingsProvider } from '@/contexts/settings-context';
import { ThemeProvider } from '@/components/theme-provider';
import { GlobalLoadingProvider } from '@/components/global-loading';

export const metadata: Metadata = {
  title: 'Laboratorio di Fisica',
  description: 'Laboratorio virtuale per la propagazione degli errori',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,500;0,6..12,700;1,6..12,400;1,6..12,500;1,6..12,700&family=Poppins:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SettingsProvider>
          <ThemeProvider>
            <GlobalLoadingProvider>
              <main className="min-h-screen flex flex-col items-center">
                <div className="w-full max-w-7xl p-4 sm:p-6 md:p-8">{children}</div>
              </main>
            </GlobalLoadingProvider>
            <Toaster />
          </ThemeProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
