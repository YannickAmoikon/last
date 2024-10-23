// app/layout.tsx
import "@/styles/globals.css";
import AuthProvider from "@/components/providers/auth-provider";
import ReduxProvider from "@/components/providers/redux-provider";
import LocalFont from 'next/font/local'

const font = LocalFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist',
  weight: '100 900', // Ceci permet d'utiliser tous les poids de 100 à 900
})

const fontMono = LocalFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900', // Même chose pour la version mono
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
        {children}
      </ReduxProvider>
    </AuthProvider>
    </body>
    </html>
  );
}
