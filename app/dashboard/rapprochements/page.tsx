"use client"
import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {Edit, MoreHorizontal, Trash2Icon} from 'lucide-react';
import {useGetRapprochementsQuery, useDeleteRapprochementMutation} from '@/lib/services/rapprochementsApi';
import {useToast} from '@/hooks/use-toast';

export default function Rapprochements() {
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);
	const [searchTerm, setSearchTerm] = useState('');
	const {toast} = useToast();

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

	const handleDelete = async (id: string) => {
		try {
			await deleteRapprochement(id).unwrap();
			toast({
				title: "Suppression réussie",
				description: "Le rapprochement a été supprimé avec succès.",
			});
			refetch(); // Rafraîchir la liste
		} catch (error) {
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

	return (
		<main className="flex flex-1 py-4 items-start justify-center">
			<div className="grid flex-1 gap-4 p-8 sm:px-6 sm:py-0 md:gap-8">
				<Card>
					<CardHeader>
						<CardTitle>Rapprochements</CardTitle>
						<CardDescription>
							Liste des rapprochements bancaires
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between mb-4">
							<Input
								placeholder="Rechercher..."
								className="w-60"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Banque</TableHead>
									<TableHead>Statut</TableHead>
									<TableHead>Étape actuelle</TableHead>
									<TableHead>Temps de traitement</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center">Chargement...</TableCell>
									</TableRow>
								) : error ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center text-red-500">Une erreur est survenue</TableCell>
									</TableRow>
								) : (
									rapprochements?.items.map((rapprochement) => (
										<TableRow key={rapprochement.id}>
											<TableCell>{formatDate(rapprochement.date)}</TableCell>
											<TableCell>{rapprochement.banque.nom}</TableCell>
											<TableCell>{rapprochement.status}</TableCell>
											<TableCell>{rapprochement.etape_actuelle}</TableCell>
											<TableCell>{rapprochement.temps_traitement}</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="h-8 w-8 p-0">
															<MoreHorizontal className="h-4 w-4"/>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() => {
																// Navigation vers la page d'édition
																window.location.href = `/rapprochements/${rapprochement.id}/edit`;
															}}
														>
															<Edit className="mr-2 h-4 w-4"/>
															Modifier
														</DropdownMenuItem>
														<DropdownMenuItem
															className="text-red-600"
															onClick={() => handleDelete(rapprochement.id)}
														>
															<Trash2Icon className="mr-2 h-4 w-4"/>
															Supprimer
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</CardContent>
					<CardFooter className="flex justify-between items-center">
						<div className="text-xs text-muted-foreground">
							{rapprochements && `Affichage ${(page - 1) * pageSize + 1} - ${Math.min(page * pageSize, rapprochements.total)} sur ${rapprochements.total} rapprochements`}
						</div>
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={handlePreviousPage}
								disabled={page === 1}
							>
								Précédent
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleNextPage}
								disabled={rapprochements && page >= rapprochements.total_pages}
							>
								Suivant
							</Button>
						</div>
					</CardFooter>
				</Card>
			</div>
		</main>
	);
}