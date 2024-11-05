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
import { 
	Users, 
	ArrowUpRight, 
	ArrowDownRight, 
	DollarSign, 
	FileText, 
	TrendingUp,
	Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";

// Données factices pour le graphique
const chartData = [
	{ name: 'Jan', montant: 4000, matches: 2400 },
	{ name: 'Fév', montant: 3000, matches: 1398 },
	{ name: 'Mar', montant: 2000, matches: 9800 },
	{ name: 'Avr', montant: 2780, matches: 3908 },
	{ name: 'Mai', montant: 1890, matches: 4800 },
	{ name: 'Jun', montant: 2390, matches: 3800 },
];

export default function DashboardPage() {
	const {data: session} = useSession();

	return (
		<main className="flex flex-1 h-full">
			<Card className="flex-1 rounded-none shadow-none border-0">
				<CardHeader className="border-b">
					<CardTitle className="uppercase">TABLEAU DE BORD</CardTitle>
					<CardDescription	>
						Accéder à une vue générale de l'application
					</CardDescription>
				</CardHeader>
				<CardContent className="p-4">
					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<Card className="bg-white transition-shadow hover:shadow-md cursor-pointer rounded-sm h-[150px]  border shadow-sm">
							
						</Card>

						<Card className="bg-white transition-shadow hover:shadow-md cursor-pointer rounded-sm h-[150px]  border shadow-sm">
							
						</Card>

						<Card className="bg-white transition-shadow hover:shadow-md cursor-pointer rounded-sm h-[150px] border shadow-sm">
							
						</Card>

						<Card className="bg-white transition-shadow hover:shadow-md cursor-pointer rounded-sm h-[150px] border shadow-sm">
							
						</Card>
					</div>

					{/* Graphique */}
					<div className="mt-4">
						<Card className="bg-white rounded-sm h-[500px] border shadow-sm">
							
						</Card>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}