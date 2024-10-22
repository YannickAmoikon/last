"use client"
import React, {useState, useMemo} from 'react';
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
import {MoreHorizontal, Trash2Icon, Loader2, ListCollapse} from 'lucide-react';
import {useGetRapprochementsQuery, useDeleteRapprochementMutation} from '@/lib/services/rapprochementsApi';
import {useToast} from '@/hooks/use-toast';
import CreateRapprochementDialog from "@/components/forms&dialogs/rapprochementDialog";
import Link from 'next/link';
import { Toaster } from '@/components/ui/toaster';
import { Badge } from "@/components/ui/badge";

function convertirTempsTraitement(tempsEnSecondes: number): string {
	const heures = Math.floor(tempsEnSecondes / 3600);
	const minutes = Math.floor((tempsEnSecondes % 3600) / 60);

	if (heures > 0) {
		return `${heures}h ${minutes}min`;
	} else {
		return `${minutes}min`;
	}
}

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
				description: "Le rapprochement a été supprimé avec succès.",
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
			<div className="flex flex-col items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
				<p className="mt-2 text-gray-600">Chargement des rapprochements...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<p className="text-red-500">Une erreur est survenue lors du chargement des rapprochements.</p>
			</div>
		);
	}

	return (
		<main className="flex flex-1 py-4 items-start justify-center">
			<Toaster />
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
							<CreateRapprochementDialog onRapprochementCreated={handleRapprochementCreated}/>
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
								{filteredRapprochements.map((rapprochement) => (
									<TableRow key={rapprochement.id}>
										<TableCell>{formatDate(rapprochement.date)}</TableCell>
										<TableCell>{rapprochement.banque.nom}</TableCell>
										<TableCell className="w-32">
											<div className="flex justify-start">
												{(() => {
													switch (rapprochement.statut) {
														case "En cours de traitement":
															return (
																<Badge variant="secondary" className="text-blue-600 w-24 justify-center">
																	<Loader2 className="mr-1 h-3 w-3 animate-spin" />
																	En cours
																</Badge>
															);
														case "Terminé":
															return (
																<Badge variant="secondary" className="text-green-600 w-24 justify-center">
																	Terminé
																</Badge>
															);
														case "Erreur":
															return (
																<Badge variant="secondary" className="text-red-600 w-24 justify-center">
																	Erreur
																</Badge>
															);
														case "En attente":
															return (
																<Badge variant="secondary" className="text-yellow-600 w-24 justify-center">
																	En attente
																</Badge>
															);
														default:
															return (
																<Badge variant="secondary" className="text-gray-600 w-24 justify-center">
																	{rapprochement.statut}
																</Badge>
															);
														}
													})()}
											</div>
										</TableCell>
										<TableCell>{rapprochement.etape_actuelle}</TableCell>
										{/* @ts-ignore */}
										<TableCell>{convertirTempsTraitement(rapprochement.temps_traitement)}</TableCell>
										<TableCell className="text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" className="h-8 w-8 p-0">
														<MoreHorizontal className="h-4 w-4"/>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem asChild>
														<Link href={`/dashboard/rapprochements/${rapprochement.id}`}>
															<ListCollapse className="mr-1" size={14} />
															Details
														</Link>
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
								))}
							</TableBody>
						</Table>
					</CardContent>
					<CardFooter className="flex justify-between items-center">
						<div className="text-xs text-muted-foreground">
							{rapprochements && `Affichage ${(page - 1) * pageSize + 1} - ${Math.min(page * pageSize, filteredRapprochements.length)} sur ${filteredRapprochements.length} rapprochements`}
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
