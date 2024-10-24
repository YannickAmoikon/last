"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Equal, Merge, Loader2, Info } from "lucide-react"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { DetailDialog } from './DetailDialog'
import { formatMontant } from "@/utils/formatters"
import { useCreerLigneRapprochementMutation } from "@/lib/services/rapprochementsApi"
import { useGetNonRapprochesGrandLivresQuery } from "@/lib/services/grandsLivresApi"
import { useToast } from "@/hooks/use-toast"

export default function CreateOptionMatchDialog({ releve, buttonClassName }: { releve: any, buttonClassName: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const [nonRapprochesGrandLivres, setNonRapprochesGrandLivres] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [creerLigneRapprochement] = useCreerLigneRapprochementMutation();
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const { toast } = useToast();

	const { refetch } = useGetNonRapprochesGrandLivresQuery(releve.rapprochement_id);

	useEffect(() => {
		if (isOpen) {
			setIsLoading(true);
			refetch()
				.then((result) => {
					if (result.data) {
						setNonRapprochesGrandLivres(result.data);
					} else if (result.error) {
						setError("Une erreur est survenue lors du chargement des grands livres.");
					}
				})
				.finally(() => setIsLoading(false));
		}
	}, [isOpen, refetch]);

	const handleCheckboxChange = useCallback((id: string) => {
		setSelectedItems(prev => 
			prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
		);
	}, []);

	const handleMatch = async () => {
		if (selectedItems.length === 0) {
			toast({
				title: "Erreur",
				description: "Veuillez sélectionner au moins un grand livre à matcher.",
				variant: "destructive",
			});
			return;
		}

		try {
			const result = await creerLigneRapprochement({
				rapprochement_id: releve.rapprochement_id,
				body: {
					releve_bancaire_id: releve.id,
					grand_livre_id: selectedItems[0],
					commentaire: "Match manuel"
				}
			}).unwrap();
			console.log("Résultat de la création de ligne:", result);
			toast({
				title: "Matching réussi",
				description: "La ligne de rapprochement a été créée avec succès.",
				className: "bg-green-600 text-white"
			});
			setIsOpen(false);
		} catch (error) {
			console.error("Erreur lors de la création de la ligne:", error);
			toast({
				title: "Erreur de matching",
				description: "Une erreur est survenue lors du matching.",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button 
					size="sm" 
					className={buttonClassName || "bg-blue-600 my-2 hover:bg-blue-700 text-white"}
				>
					<Equal size={14} />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[1000px] h-[700px] flex flex-col">
				<div className="flex flex-col h-full py-5">
					<div className="flex-1 overflow-y-auto">
						{releve && (
							<Card className="w-full mb-2 bg-orange-100 rounded-sm shadow-sm border-l-4 border-l-orange-500 hover:shadow-md cursor-pointer transition-shadow duration-200">
								<div className="flex items-center ml-9 h-28">
									<div className="flex-grow h-full flex flex-col justify-center py-4 px-4">
										<CardTitle className="text-sm font-semibold text-orange-700">{`ID: ${releve.id}`}</CardTitle>
										<CardDescription className="text-xs mt-1 text-gray-600">{`Compte: ${releve.numero_compte}`}</CardDescription>
										<div className="mt-3 grid grid-cols-3 gap-2 text-xs">
											<div>
												<span className="text-gray-600">Date: </span>
												<span className="font-medium text-gray-900">{new Date(releve.date_operation).toLocaleDateString()}</span>
											</div>
											<div>
												<span className="text-gray-600">Montant: </span>
												<span className="font-medium text-gray-900">
													{releve.debit ? `-${formatMontant(releve.debit)}` : 
													releve.credit ? formatMontant(releve.credit) : 
													formatMontant(0)}
												</span>
											</div>
											<div>
												<span className="text-gray-600">Description: </span>
												<span className="font-medium text-gray-900">{releve.description}</span>
											</div>
										</div>
									</div>
									<div className="p-4 h-full flex items-center">
										<DetailDialog title={`Relevé : ${releve.id}`} entity={releve} />
									</div>
								</div>
							</Card>
						)}
					</div>
					<div className="flex-1 overflow-y-auto mt-4">
						{isLoading ? (
							<div className="flex justify-center items-center h-full">
								<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2">Chargement des grands livres...</span>
							</div>
						) : error ? (
							<div className="text-red-500">{error}</div>
						) : (
							<div className="space-y-2">
								{nonRapprochesGrandLivres.map((item: any, idx: number) => (
									<Card key={idx} className="w-full rounded-sm mb-2 shadow-sm bg-blue-100 border-l-4 border-l-blue-500 hover:shadow-md cursor-pointer transition-shadow duration-200">
										<div className="flex items-center h-28">
											<div className="p-4 h-full flex items-center">
												<input
													type="checkbox"
													checked={selectedItems.includes(item.id.toString())}
													onChange={() => handleCheckboxChange(item.id.toString())}
													className="h-5 w-5 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
												/>
											</div>
											<div className="flex-grow h-full flex flex-col justify-center py-3">
												<CardTitle className="text-sm font-semibold text-blue-700">{`ID: ${item.id}`}</CardTitle>
												<CardDescription className="text-xs mt-1 text-gray-600">{item.libelle}</CardDescription>
												<div className="mt-2 grid grid-cols-3 gap-2 text-xs">
													<div>
														<span className="text-gray-600">Date: </span>
														<span className="font-medium text-gray-900">{new Date(item.date_ecriture).toLocaleDateString()}</span>
													</div>
													<div>
														<span className="text-gray-600">Montant: </span>
														<span className="font-medium text-gray-900">
															{item.debit ? 
																`-${formatMontant(item.debit)}` : 
																formatMontant(item.credit)}
														</span>
													</div>
													<div>
														<span className="text-gray-600">Compte: </span>
														<span className="font-medium text-gray-900">{item.compte || item.cpte_alt || 'N/A'}</span>
													</div>
												</div>
											</div>
											<div className="p-4 h-full flex items-center">
												<DetailDialog title={`Grand Livre : ${item.id}`} entity={item} />
											</div>
										</div>
									</Card>
								))}
							</div>
						)}
					</div>
				</div>
				<DialogFooter>
					<Button 
						className="bg-green-600 my-2 hover:bg-green-600 text-white" 
						size="sm" 
						onClick={handleMatch}
						disabled={selectedItems.length === 0}
					>
						<Merge size={14} className="mr-1" />
						Matcher
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
