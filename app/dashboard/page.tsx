"use client";

import { useSession } from "next-auth/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCircle, TrendingUp, Wallet, Percent, BookCheck, ChartLine, Loader2 } from "lucide-react";
import {useGetBanksQuery} from "@/lib/services/bankApi";

// Graphique	
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const data = [
  { name: 'Jan', rapprochements: 1500 },
  { name: 'Fév', rapprochements: 1400 },
  { name: 'Mar', rapprochements: 2200 },
  { name: 'Avr', rapprochements: 2100 },
  { name: 'Mai', rapprochements: 1700 },
  { name: 'Jun', rapprochements: 2050 },
  { name: 'Jul', rapprochements: 2200 },
  { name: 'Aou', rapprochements: 2300 },
  { name: 'Sep', rapprochements: 2400 },
  { name: 'Oct', rapprochements: 1500 },
  { name: 'Nov', rapprochements: 2200 },
  { name: 'Dec', rapprochements: 2600 },
];

const DashboardChart = () => {
	return (
	  <div className="w-full h-[calc(100vh-470px)] py-5 px-2">
		<ResponsiveContainer width="100%" height="100%">
		  <BarChart data={data}>
			<XAxis dataKey="name" tick={{fill: 'black'}} />
			<YAxis type="number" domain={[0, 'dataMax']} tick={{fill: 'black'}} />
			<Tooltip contentStyle={{color: 'black'}} />
			<Legend wrapperStyle={{color: 'black'}} />
			<Bar dataKey="rapprochements" fill="#5d6d7e" barSize={60} radius={2}/>
		  </BarChart>
		</ResponsiveContainer>
	  </div>
	);
  };


  const DashboardTable = () => {
	return (
		<div className="w-full h-[calc(100vh-470px)] py-5 px-2">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Date</TableHead>
						<TableHead>Rapprocheur</TableHead>
						<TableHead>Banques</TableHead>
						<TableHead>Volume</TableHead>
						<TableHead>Taux de match</TableHead>
						<TableHead>Taux de match manuel</TableHead>
						<TableHead>Nombre total de matchs</TableHead>
						<TableHead>Temps de traitement</TableHead>
					</TableRow>
				</TableHeader>
			</Table>
		</div>
	);
  };

export default function DashboardPage() {
	const { data: session } = useSession();
	const {data: banks} = useGetBanksQuery();
	const dataBanks = banks;

	return (
		<main className="flex flex-1 w-full h-full">
			<Card className="flex-1 rounded-none shadow-none border-0 w-full">
				<CardHeader className="border-b">
					<CardTitle className="uppercase">TABLEAU DE BORD</CardTitle>
					<CardDescription>
						Accéder à une vue générale de l'application
					</CardDescription>
				</CardHeader>
				<CardContent className="p-4 w-full flex flex-col">
					<div className="flex justify-end">
						<div className="flex justify-end w-full max-w-[200px]">
							<Select defaultValue={dataBanks?.[0].id.toString()}>
								<SelectTrigger>
									<SelectValue placeholder="Toutes les banques" />
								</SelectTrigger>
								<SelectContent>
								{dataBanks?.map((dataBank) => (
									<SelectItem key={dataBank.id} value={dataBank.id.toString()}>{dataBank.nom}</SelectItem>
								))}
								</SelectContent>
							</Select>
						</div>
					</div>
					{/* Stats Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
						<Card className="bg-white hover:shadow-md rounded-sm cursor-pointer transition-shadow duration-200 border shadow-sm">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-gray-700">
									Taux de match
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-lg flex items-center justify-between font-bold text-gray-600">
									<span><Loader2 className="w-6 h-6 animate-spin" /></span>
									<TrendingUp className="w-6 h-6" />
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white hover:shadow-md rounded-sm cursor-pointer transition-shadow duration-200 border shadow-sm">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-gray-700">
									Taux de match manuel
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-lg flex items-center justify-between font-bold text-gray-600">
									<span><Loader2 className="w-6 h-6 animate-spin" /></span>
									<ChartLine className="w-6 h-6" />
								</div>
							</CardContent>
						</Card>
		
						<Card className="bg-white hover:shadow-md rounded-sm cursor-pointer transition-shadow duration-200 border shadow-sm">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-gray-700">
									Nombre total de matchs
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-lg flex items-center justify-between font-bold text-gray-600">
									<span><Loader2 className="w-6 h-6 animate-spin" /></span>
									<BookCheck className="w-6 h-6" />
								</div>
							</CardContent>
						</Card>
						<Card className="bg-white hover:shadow-md rounded-sm cursor-pointer transition-shadow duration-200 border shadow-sm">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-gray-700">
									Volume total
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-lg flex items-center justify-between font-bold text-gray-600">
									<span><Loader2 className="w-6 h-6 animate-spin" /></span>
									<Wallet className="w-6 h-6" />
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
						<Card className="bg-white flex items-center justify-center rounded-sm cursor-pointer hover:shadow-md transition-shadow duration-200 h-[calc(100vh-750px)] border shadow-sm">
							<span className="text-md font-medium text-gray-700">1 500  passés par SALAM-ALIANZ</span>
						</Card>
						<Card className="bg-white rounded-sm justify-center items-center flex cursor-pointer hover:shadow-md transition-shadow duration-200 h-[calc(100vh-750px)] border shadow-sm">
							<span className="text-md font-medium text-gray-700">1 900 passés par BANQUE 1</span>
						</Card>
					</div>

					{/* Graphique */}
					<div className="mt-3">
						<Card className="bg-white rounded-sm p-6 cursor-pointer hover:shadow-md transition-shadow duration-200 h-[calc(100vh-400px)] border shadow-sm">
							{/* Contenu */}
							<CardContent>
								{/* Tabs */}
								<Tabs defaultValue="graphique" className="rounded-sm">
									<div className="flex justify-end rounded-sm">
										<TabsList>
											<TabsTrigger className="text-sm rounded-sm" value="graphique">Graphique</TabsTrigger>
											<TabsTrigger className="text-sm rounded-sm" value="tableau">Tableau</TabsTrigger>
										</TabsList>
									</div>
									<TabsContent value="graphique">
										<DashboardChart />
								</TabsContent>
								<TabsContent value="tableau">
									<DashboardTable />
									</TabsContent>
								</Tabs>
							</CardContent>
						</Card>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}