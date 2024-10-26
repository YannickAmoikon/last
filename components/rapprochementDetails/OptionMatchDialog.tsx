"use client";

import React, {useEffect, useCallback, useMemo, useReducer } from "react";
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
import { DetailButton } from "./DetailButton";

// Définition du reducer
const initialState = {
  isOpen: false,
  isConfirmDialogOpen: false,
  nonRapprochesGrandLivres: [],
  isLoading: false,
  error: null,
  selectedItem: null,
  searchTerm: "",
  detailItem: null,
};

function reducer(state: typeof initialState, action: any) {
  switch (action.type) {
    case 'SET_OPEN':
      return { ...state, isOpen: action.payload };
    case 'SET_CONFIRM_DIALOG_OPEN':
      return { ...state, isConfirmDialogOpen: action.payload };
    case 'SET_NON_RAPPROCHES_GRAND_LIVRES':
      return { ...state, nonRapprochesGrandLivres: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SELECTED_ITEM':
      return { ...state, selectedItem: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_DETAIL_ITEM':
      return { ...state, detailItem: action.payload };
    default:
      return state;
  }
}

// Composants extraits
const ReleveCard = React.memo(({ releve }: { releve: any }) => (
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
));

const GrandLivreCard = React.memo(({ item, isSelected, onSelect, onDetailClick }: { item: any, isSelected: boolean, onSelect: (id: string) => void, onDetailClick: (item: any) => void }) => (
  <Card
    className="w-full rounded-sm mb-2 shadow-sm bg-blue-100 border-l-4 border-l-blue-500 hover:shadow-md cursor-pointer transition-shadow duration-200"
  >
    <div className="flex items-center h-24">
      <div className="p-2 flex items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(item.id.toString())}
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
        <DetailButton onClick={() => onDetailClick(item)} />
      </div>
    </div>
  </Card>
));

export default function CreateOptionMatchDialog({ releve }: { releve: any }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { toast } = useToast();
  const [creerLigneRapprochement] = useCreerLigneRapprochementMutation();

  const { refetch } = useGetNonRapprochesGrandLivresQuery(
    releve.rapprochement_id,
  );

  const fetchGrandLivres = useCallback(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    refetch()
      .then((result) => {
        if (result.data) {
          dispatch({ type: 'SET_NON_RAPPROCHES_GRAND_LIVRES', payload: result.data });
        } else if (result.error) {
          dispatch({ type: 'SET_ERROR', payload: "Une erreur est survenue lors du chargement des grands livres." });
        }
      })
      .finally(() => dispatch({ type: 'SET_LOADING', payload: false }));
  }, [refetch]);

  useEffect(() => {
    if (state.isOpen) {
      fetchGrandLivres();
    }
  }, [state.isOpen, fetchGrandLivres]);

  const handleCheckboxChange = useCallback((id: string) => {
    dispatch({ type: 'SET_SELECTED_ITEM', payload: state.selectedItem === id ? null : id });
  }, [state.selectedItem]);

  const handleMatch = useCallback(async () => {
    if (!state.selectedItem) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un grand livre à matcher.",
        variant: "destructive",
      });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await creerLigneRapprochement({
        rapprochement_id: releve.rapprochement_id,
        body: {
          releve_bancaire_id: releve.id.toString(),
          grand_livre_id: state.selectedItem,
          commentaire: "Rapprochement manuel",
        },
      }).unwrap();

      console.log("Résultat de la création de ligne:", result);
      toast({
        title: "Match réussi",
        description: `La ligne ID: ${result.ligne_id} de rapprochement a été créée avec succès. `,
        className: "bg-green-600 text-white",
      });
      dispatch({ type: 'SET_OPEN', payload: false });
      dispatch({ type: 'SET_CONFIRM_DIALOG_OPEN', payload: false });
      dispatch({ type: 'SET_SELECTED_ITEM', payload: null });
      fetchGrandLivres();
    } catch (error) {
      console.error("Erreur lors de la création de la ligne:", error);
      toast({
        title: "Erreur de matching",
        description: "Une erreur est survenue lors du matching.",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.selectedItem, releve, creerLigneRapprochement, toast, fetchGrandLivres]);

  const filteredGrandLivres = useMemo(() => {
    return state.nonRapprochesGrandLivres.filter(
      (item: any) =>
        (item?.libelle?.toLowerCase().includes(state.searchTerm.toLowerCase()) ?? false) ||
        (item?.id?.toString().includes(state.searchTerm) ?? false)
    );
  }, [state.nonRapprochesGrandLivres, state.searchTerm]);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    dispatch({ type: 'SET_OPEN', payload: open });
    if (!open) {
      dispatch({ type: 'SET_SELECTED_ITEM', payload: null });
      dispatch({ type: 'SET_SEARCH_TERM', payload: "" });
    }
  }, []);

  return (
    <>
      <Dialog open={state.isOpen} onOpenChange={handleDialogOpenChange}>
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
              {releve && <ReleveCard releve={releve} />}
            </div>

            <div className="flex-none mb-4 flex justify-end">
              <div className="relative w-1/2">
                <Input
                  type="text"
                  placeholder="Faire une recherche précise pour matcher..."
                  className="py-2 rounded-sm w-full"
                  value={state.searchTerm}
                  onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {state.isLoading ? (
                <div className="flex-1 flex min-h-screen mt-60">
                  <div className="relative flex-1 h-full w-full bg-gray-200 animate-pulse">
                    <Loader2 className="absolute inset-0 m-auto h-12 w-12 text-gray-900 animate-spin" />
                  </div>
                </div>
              ) : state.error ? (
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
                        onClick={fetchGrandLivres}
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
                    <GrandLivreCard
                      key={item.id}
                      item={item}
                      isSelected={state.selectedItem === item.id.toString()}
                      onSelect={handleCheckboxChange}
                      onDetailClick={(item) => dispatch({ type: 'SET_DETAIL_ITEM', payload: item })}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex-none mt-8 flex justify-end">
              <Button
                className="bg-blue-600 rounded-sm hover:bg-blue-600 text-white"
                size="sm"
                onClick={() => dispatch({ type: 'SET_CONFIRM_DIALOG_OPEN', payload: true })}
                disabled={!state.selectedItem}
              >
                <Merge size={14} className="mr-1" />
                Matcher
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={state.isConfirmDialogOpen} onOpenChange={(open) => dispatch({ type: 'SET_CONFIRM_DIALOG_OPEN', payload: open })}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Faire un matching</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-600">
            Êtes-vous sûr de vouloir matcher le grand livre{" "}
            <span className="font-medium text-blue-600">{state.selectedItem}</span> au
            Relevé{" "}
            <span className="font-medium text-orange-600">{releve.id}</span> ?
          </DialogDescription>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              size="sm"
              className="rounded-sm"
              variant="outline"
              onClick={() => dispatch({ type: 'SET_CONFIRM_DIALOG_OPEN', payload: false })}
              disabled={state.isLoading}
            >
              <X className="mr-1 rounded-sm" size={14} />
              Annuler
            </Button>
            <Button
              size="sm"
              className="bg-green-600 rounded-sm hover:bg-green-600 text-white"
              onClick={handleMatch}
              disabled={state.isLoading}
            >
              {state.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              <Check className="mr-1" size={14} />
              Oui
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!state.detailItem} onOpenChange={() => dispatch({ type: 'SET_DETAIL_ITEM', payload: null })}>
        <DialogContent className="sm:max-w-[425px] bg-blue-50">
          <DialogTitle>Grand Livre : {state.detailItem?.id}</DialogTitle>
          <DialogDescription>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">ID:</span> {state.detailItem?.id}
              </div>
              <div>
                <span className="font-semibold">Libellé:</span>{" "}
                {state.detailItem?.libelle}
              </div>
              <div>
                <span className="font-semibold">Date d'écriture:</span>{" "}
                {new Date(state.detailItem?.date_ecriture).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold">Montant:</span>{" "}
                {state.detailItem?.debit
                  ? `-${formatMontant(state.detailItem.debit)}`
                  : formatMontant(state.detailItem?.credit)}
              </div>
              <div>
                <span className="font-semibold">Compte:</span>{" "}
                {state.detailItem?.compte || state.detailItem?.cpte_alt || "N/A"}
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}