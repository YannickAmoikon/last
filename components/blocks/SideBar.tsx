"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  HelpCircle,
  LogOut,
  FileSpreadsheet,
  Landmark,
  ArrowDown10,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

const items = [
  { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
  { title: "Rapprochements", url: "/dashboard/links", icon: FileSpreadsheet },
  { title: "Banques", url: "/dashboard/banks", icon: Landmark },
];

export default function SideBar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === url;
    }
    return pathname.startsWith(url);
  };

  const handleLogout = async () => {
    try {
      // 1. Construire l'URL de déconnexion Keycloak avec les bons paramètres
      const keycloakUrl = "https://iam.sanlamconnect.com";
      const realm = "e-sama";
      const clientId = "rapprochement-bancaire-dev";
      const redirectUri = `${window.location.origin}/login`;

      // 2. Déconnexion de NextAuth
      await signOut({ redirect: false });

      // 3. Construire l'URL complète de déconnexion
      const logoutUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/logout?client_id=${clientId}&post_logout_redirect_uri=${encodeURIComponent(redirectUri)}`;

      // 4. Redirection vers Keycloak
      window.location.replace(logoutUrl);

    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const LinkItem = ({ item }: { item: (typeof items)[0] }) => (
    <Link
      href={item.url}
      className={`flex rounded-sm text-sm items-center gap-3 px-3 py-2.5 transition-all
        ${
          isActive(item.url)
            ? "bg-gray-700 text-white font-medium"
            : "text-gray-400 hover:bg-gray-700 hover:text-white"
        }`}
    >
      <item.icon className="h-5 w-5" />
      <span>{item.title}</span>
    </Link>
  );

  return (
    <aside
      className={`bg-gray-900 text-gray-100 w-64 min-h-screen flex-col shadow-lg hidden md:flex ${className}`}
    >
      <div className="flex h-16 items-center px-4 border-b border-gray-700">
        <span className="flex items-center gap-2 font-semibold">
          <ArrowDown10 className="h-6 w-6 mr-1" />
          <span className="uppercase text-lg uppercase">
            S A C I {"-"} R A P B
          </span>
        </span>
      </div>
      <nav className="flex-1 overflow-auto py-6 px-3">
        <div className="space-y-1">
          {items.map((item) => (
            <LinkItem key={item.title} item={item} />
          ))}
        </div>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Link
          href="/dashboard/help"
          className="flex rounded-sm text-sm items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
        >
          <HelpCircle className="h-5 w-5" />
          <span>Aide</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex rounded-sm text-sm items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-all w-full mt-2"
        >
          <LogOut className="h-5 w-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
