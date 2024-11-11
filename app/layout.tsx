// app/layout.tsx
import "@/styles/globals.css";
import AuthProvider from "@/components/providers/auth-provider";
import ReduxProvider from "@/components/providers/redux-provider";
import LocalFont from 'next/font/local'
import { RefreshProvider } from "@/components/contexts/RefreshContext";
import { Toaster } from "@/components/ui/toaster";

const font = LocalFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist',
  weight: '100 900',
})

const fontMono = LocalFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${font.variable} ${fontMono.variable} antialiased font-normal`}
      >
        <AuthProvider>
          <ReduxProvider>
            <RefreshProvider>
              {children}
              <Toaster />
            </RefreshProvider>
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
