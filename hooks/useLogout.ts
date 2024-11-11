import { signOut } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "@/lib/services/auth-service";

export function useLogout() {
  const { toast } = useToast();

  const logout = async () => {
    try {
      // 1. Nettoyer toutes les données d'authentification
      AuthService.clearAuthData();

      // 2. Déconnexion de NextAuth
      await signOut({
        redirect: false,
      });

      // 3. Rediriger vers la déconnexion Keycloak
      const logoutUrl = AuthService.getKeycloakLogoutUrl();
      window.location.href = logoutUrl;

      toast({
        title: "Déconnexion en cours",
        description: "Veuillez patienter...",
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  return { logout };
} 