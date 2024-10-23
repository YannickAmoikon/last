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
		<main className="flex flex-1 h-full">
			<Card className="flex-1 rounded-none shadow-none border-0">
				<CardHeader className="border-b">
					<CardTitle>Tableau de bord</CardTitle>
					<CardDescription>
						Accéder à une vue générale de l'application
					</CardDescription>
				</CardHeader>
			</Card>
		</main>
	);
}