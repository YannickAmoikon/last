// components/providers/auth-provider.tsx
"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// Composant pour gérer l'état de l'authentification
function AuthStateListener({ children }: { children: React.ReactNode }) {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { toast } = useToast();

	useEffect(() => {
		// Vérifier les erreurs de session
		if (session?.error === "RefreshAccessTokenError") {
			toast({
				title: "Session expirée",
				description: "Veuillez vous reconnecter",
				variant: "destructive",
			});
			router.push("/login");
		}
	}, [session, router, toast]);

	return <>{children}</>;
}

export default function AuthProvider({ 
	children 
}: { 
	children: React.ReactNode 
}) {
	return (
		<SessionProvider>
			<AuthStateListener>{children}</AuthStateListener>
		</SessionProvider>
	);
}