"use client"
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetRapprochementsQuery, useDeleteRapprochementMutation } from '@/lib/services/rapprochementsApi';
import { useToast } from '@/hooks/use-toast';
import CreateRapprochementDialog from "@/components/rapprochement/RapprochementDialog";
import { Toaster } from '@/components/ui/toaster';
import { RapprochementTable } from '@/components/rapprochement/RapprochementTable';
import { Pagination } from '@/components/rapprochement/Pagination';
import { SearchInput } from '@/components/rapprochement/SearchInput';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw } from 'lucide-react';

export default function Rapprochements() {
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);
	const [searchTerm, setSearchTerm] = useState('');
	const { toast } = useToast();

	const {
		data: rapprochements,
		isLoading,
		error,
		refetch
	} = useGetRapprochementsQuery({
		page,
		page_size: pageSize,
	});

	const [deleteRapprochement] = useDeleteRapprochementMutation();

	const filteredRapprochements = useMemo(() => {
		if (!rapprochements) return [];
		return rapprochements.items.filter(rapprochement =>
			rapprochement.banque.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
			rapprochement.statut.toLowerCase().includes(searchTerm.toLowerCase()) ||
			rapprochement.etape_actuelle.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [rapprochements, searchTerm]);

	const handleDelete = async (id: string) => {
		try {
			await deleteRapprochement(id).unwrap();
			toast({
				title: "Suppression réussie",
				description: `Le rapprochement ${id} a été supprimé avec succès.`,
			});
			refetch();
		} catch (error: any) {
			toast({
				title: "Erreur",
				description: "Une erreur est survenue lors de la suppression.",
				variant: "destructive",
			});
		}
	};

	const handleNextPage = () => {
		if (rapprochements && page < rapprochements.total_pages) {
			setPage(page + 1);
		}
	};

	const handlePreviousPage = () => {
		if (page > 1) {
			setPage(page - 1);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	const handleRapprochementCreated = (success: boolean, message: string) => {
		if (success) {
			toast({
				title: "Rapprochement créé avec succès",
				description: message,
				className: "bg-green-600 text-white",
			});
			refetch();
		} else {
			toast({
				title: "Erreur",
				description: message,
				variant: "destructive",
			});
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen w-full">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin text-gray-900 mx-auto" />
					<p className="mt-2 text-gray-600">Chargement des rapprochements...</p>
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
					<CardTitle className="uppercase">Rapprochements</CardTitle>
					<CardDescription>
						Gestion des rapprochements bancaires
					</CardDescription>
				</CardHeader>
				<CardContent className="p-6">
					<div className="flex items-center justify-between mb-4">
						<SearchInput value={searchTerm} onChange={setSearchTerm} />
						<CreateRapprochementDialog onRapprochementCreated={handleRapprochementCreated}/>
					</div>
					<RapprochementTable
						rapprochements={filteredRapprochements}
						onDelete={handleDelete}
						formatDate={formatDate}
					/>
				</CardContent>
				<CardFooter className="flex justify-between items-center border-t py-4">
					<div className="text-sm text-muted-foreground">
						{rapprochements && `Affichage ${(page - 1) * pageSize + 1} - ${Math.min(page * pageSize, filteredRapprochements.length)} sur ${filteredRapprochements.length} rapprochements`}
					</div>
					<Pagination
						currentPage={page}
						totalPages={rapprochements?.total_pages || 1}
						onPreviousPage={handlePreviousPage}
						onNextPage={handleNextPage}
					/>
				</CardFooter>
			</Card>
		</main>
	);
}
