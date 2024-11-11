"use client"

import React, {useState, useMemo, useEffect} from "react"
import { useGetBanksWithAccountsQuery, useDeleteBankMutation } from "@/lib/services/bankApi";
import {useToast} from "@/hooks/use-toast";
import CreateBankDialog from "@/components/bank/CreateBankDialog";
import {Toaster} from "@/components/ui/toaster"
import {Button} from "@/components/ui/button"
import {Loader2, RefreshCcw} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {useRefresh} from "@/components/contexts/RefreshContext";
import { SearchInput } from "@/components/link/SearchInput";

export default function BanksPage() {
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);
	const [searchTerm, setSearchterm] = useState("");
	const {toast} = useToast();
	const {triggerRefresh} = useRefresh();

	const {
		data: banks,
		isLoading,
		error,
		refetch
	} = useGetBanksWithAccountsQuery();

	const [deleteBank] = useDeleteBankMutation();

	const filteredBanks = useMemo(() => {
		if (!banks) return [];
		return banks.filter(bank => bank.nom.toLowerCase().includes(searchTerm.toLowerCase()));
	}, [banks, searchTerm]);

	useEffect(() => {
		refetch();
	}, [triggerRefresh, refetch]);

	const handleDelete = async (id: number) => {
		try {
			await deleteBank(id).unwrap();
			toast({
				title: "Succès",
				description: `La banque a été supprimée avec succès`
			})
			refetch();
		}
		catch (error: any) {
			toast({
				title: "Erreur",
				description: "Une erreur est survenue lors de la suppression de la banque",
				variant: "destructive"
			})
		}
	}

	const handleNextPage = () => {
		if (banks && page < Math.ceil(banks.length / pageSize)) {
			setPage(page + 1);
		}
	}

	const handlePreviousPage = () => {
		if (page > 1) {
			setPage(page - 1);
		}
	}

	const handleBankCreated = (success: boolean, message: string) => {
		if (success) {
			toast({
				title: "Banque créée avec succès",
				description: message
			})
			refetch();
		}
		else {
			toast({
				title: "Erreur",
				description: message,
				variant: "destructive"
			})
		}
	}

	if (isLoading) {
		return (
		  <div className="flex-1 flex h-full items-center justify-center">
			<div className="relative flex-1 h-full w-full bg-gray-200 animate-pulse">
			  <Loader2 className="absolute inset-0 m-auto h-12 w-12 text-gray-900 animate-spin" />
			</div>
		  </div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center flex-1 h-full bg-gray-50">
				<div className="text-center">
					<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
					<h2 className="mt-2 text-lg font-semibold text-gray-900">Erreur de chargement</h2>
					<p className="mt-2 text-sm text-gray-500">Impossible de charger les rapprochements. Veuillez réessayer.</p>
					<div className="mt-6">
						<Button
							onClick={() => window.location.reload()}
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
						>
							<RefreshCcw className="mr-1" size={14} />
							Réessayer
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<main className="flex flex-1 h-full">
			<Toaster />
			<Card className="flex-1 rounded-none shadow-none border-0">
				<CardHeader className="border-b">
					<CardTitle className="uppercase">Banques</CardTitle>
					<CardDescription>
						Gestion des banques
					</CardDescription>
				</CardHeader>
				<CardContent className="p-6">
					<div className="flex items-center justify-between mb-4">
						<SearchInput value={searchTerm} onChange={setSearchterm} />
						<CreateBankDialog onBankCreated={handleBankCreated} />
					</div>
				</CardContent>
			</Card>
		</main>
	);
}
