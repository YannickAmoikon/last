"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Equal,
  Merge,
  Loader2,
  Check,
  X,
  RefreshCcw,
} from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ReleveDetailDialog } from "./ReleveDetailDialog";
import { formatMontant } from "@/utils/formatters";
import { useCreerLigneRapprochementMutation } from "@/lib/services/rapprochementsApi";
import { useGetNonRapprochesGrandLivresQuery } from "@/lib/services/grandsLivresApi";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { GrandLivreDetailDialog } from './GrandLivreDetailDialog';

export default function CreateOptionMatchDialog({ releve }: { releve: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [creerLigneRapprochement] = useCreerLigneRapprochementMutation();
  const [isCreating, setIsCreating] = useState(false);

  const { data: nonRapprochesGrandLivres, isLoading, error, refetch } = useGetNonRapprochesGrandLivresQuery(
    releve.rapprochement_id,
    { skip: !isOpen }
  );

  const handleCheckboxChange = useCallback((id: string) => {
    setSelectedItem(prev => prev === id ? null : id);
  }, []);

  const handleMatch = async () => {
    if (!selectedItem) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un grand livre à matcher.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      const result = await creerLigneRapprochement({
        rapprochement_id: releve.rapprochement_id,
        body: {
          releve_bancaire_id: releve.id.toString(),
          grand_livre_id: selectedItem,
          commentaire: "Rapprochement manuel",
        },
      }).unwrap();

      console.log("Résultat de la création de ligne:", result);
      toast({
        title: "Match réussi",
        description: `La ligne ID: ${result.ligne_id} de rapprochement a été créée avec succès. `,
        className: "bg-green-600 text-white",
      });
      setIsOpen(false);
      setIsConfirmDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Erreur lors de la création de la ligne:", error);
      toast({
        title: "Erreur de matching",
        description: "Une erreur est survenue lors du matching.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const filteredGrandLivres = useMemo(() => {
    return nonRapprochesGrandLivres?.filter(
      (item: any) =>
        (item?.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (item?.id?.toString().includes(searchTerm) ?? false)
    ) || [];
  }, [nonRapprochesGrandLivres, searchTerm]);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedItem(null);
      setSearchTerm("");
    }
  }, []);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="bg-blue-600 rounded-sm my-2 hover:bg-blue-700 text-white"
          >
            <Equal size={14} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1100px] h-[750px] flex flex-col">
          <div className="flex flex-col h-full pt-5">
            <div className="flex-none mb-4">
              {releve && (
                <Card className="w-full bg-orange-100 rounded-sm shadow-sm border-l-4 border-l-orange-500">
                  <div className="flex items-center h-24">
                    <div className="flex-grow ml-9 flex flex-col justify-center py-2 px-4">
                      <CardTitle className="text-sm font-semibold text-orange-700">{`ID: ${releve.id}`}</CardTitle>
                      <CardDescription className="text-xs mt-1 text-gray-600">{`Compte: ${releve.numero_compte}`}</CardDescription>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Date: </span>
                          <span className="font-medium text-gray-900">
                            {new Date(releve.date_operation).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Montant: </span>
                          <span className="font-medium text-gray-900">
                            {releve.debit
                              ? `-${formatMontant(releve.debit)}`
                              : releve.credit
                              ? formatMontant(releve.credit)
                              : formatMontant(0)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Description: </span>
                          <span className="font-medium text-gray-900">
                            {releve.description}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <ReleveDetailDialog
                        title={`Relevé : ${releve.id}`}
                        entity={releve}
                      />
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <div className="flex-none mb-4 flex justify-end">
              <div className="relative w-1/2">
                <Input
                  type="text"
                  placeholder="Faire une recherche précise pour matcher..."
                  className="py-2 rounded-sm w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex-1 flex min-h-screen mt-60">
                  <div className="relative flex-1 h-full w-full bg-gray-200 animate-pulse">
                    <Loader2 className="absolute inset-0 m-auto h-12 w-12 text-gray-900 animate-spin" />
                  </div>
                </div>
              ) : error ? (
                <div className="flex justify-center min-h-screen flex-1 bg-gray-50">
                  <div className="text-center mt-40">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <h2 className="mt-2 text-lg font-semibold text-gray-900">
                      Erreur de chargement
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      Impossible de charger les grands livres. Veuillez
                      réessayer.
                    </p>
                    <div className="mt-6">
                      <Button
                        onClick={() => refetch()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                      >
                        <RefreshCcw className="mr-1" size={14} />
                        Réessayer
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredGrandLivres.map((item: any) => (
                    <Card
                      key={item.id}
                      className="w-full rounded-sm mb-2 shadow-sm bg-blue-100 border-l-4 border-l-blue-500 hover:shadow-md cursor-pointer transition-shadow duration-200"
                    >
                      <div className="flex items-center h-24">
                        <div className="p-2 flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedItem === item.id.toString()}
                            onChange={() => handleCheckboxChange(item.id.toString())}
                            className="h-5 w-5 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex-grow flex flex-col justify-center py-2 px-4">
                          <CardTitle className="text-sm font-semibold text-blue-700">{`ID: ${item.id}`}</CardTitle>
                          <CardDescription className="text-xs mt-1 text-gray-600">
                            Compte: {item.compte || item.cpte_alt || "N/A"}
                          </CardDescription>
                          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-gray-600">Date: </span>
                              <span className="font-medium text-gray-900">
                                {new Date(item.date_ecriture).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Montant: </span>
                              <span className="font-medium text-gray-900">
                                {item.debit
                                  ? `-${formatMontant(item.debit)}`
                                  : formatMontant(item.credit)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Libellé: </span>
                              <span className="font-medium text-gray-900">
                                {item.libelle}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <GrandLivreDetailDialog title={`Grand Livre : ${item.id}`} entity={item} />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-none mt-8 flex justify-end">
              <Button
                className="bg-blue-600 rounded-sm hover:bg-blue-600 text-white"
                size="sm"
                onClick={() => setIsConfirmDialogOpen(true)}
                disabled={!selectedItem}
              >
                <Merge size={14} className="mr-1" />
                Matcher
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Faire un matching</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-600">
            Êtes-vous sûr de vouloir matcher le grand livre{" "}
            <span className="font-medium text-blue-600">{selectedItem}</span> au
            Relevé{" "}
            <span className="font-medium text-orange-600">{releve.id}</span> ?
          </DialogDescription>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              size="sm"
              className="rounded-sm"
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
              disabled={isCreating}
            >
              <X className="mr-1 rounded-sm" size={14} />
              Annuler
            </Button>
            <Button
              size="sm"
              className="bg-green-600 rounded-sm hover:bg-green-600 text-white"
              onClick={handleMatch}
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Check className="mr-1" size={14} />
              )}
              Oui
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
