// app/dashboard/layout.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import SideBar from "@/components/blocks/SideBar";
import { useEffect } from "react";
import { Loader2 } from "lucide-react"; // ou votre composant de loading préféré

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const router = useRouter();

  useEffect(() => {
    // Vérifier si la session a une erreur
    if (session?.error === "RefreshAccessTokenError") {
      router.push("/login");
    }
  }, [session, router]);

  // Afficher un loader pendant la vérification de la session
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
