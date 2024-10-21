// app/dashboard/page.tsx
"use client";

import {useSession} from "next-auth/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
	const {data: session} = useSession();

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<Card>
				<CardHeader>
					<CardTitle>Bienvenue</CardTitle>
					<CardDescription>
						Connecté en tant que {session?.user?.name || session?.user?.email || "Utilisateur"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p>Votre tableau de bord est prêt !</p>
				</CardContent>
			</Card>
		</div>
	);
}