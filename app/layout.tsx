// app/layout.tsx
import {Inter} from "next/font/google";
import "@/styles/globals.css";
import AuthProvider from "@/components/providers/auth-provider";
import ReduxProvider from "@/components/providers/redux-provider";

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
    <body className={inter.className}>
    <AuthProvider>
      <ReduxProvider>
        {children}
      </ReduxProvider>
    </AuthProvider>
    </body>
    </html>
  );
}