import React from 'react';
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info, X, Check, Loader2, Split } from 'lucide-react';
import { formatMontant } from "@/utils/formatters"
import { DetailDialog } from './DetailDialog'
import { GrandLivreDetailDialog } from './GrandLivreDetailDialog'
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface HistoriqueRapprochementProps {
  items: any[];
  onDematch: (rapprochementId: string, ligneId: number) => void;
}

const Releve = ({ releve }: { releve: any }) => (
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
        <DetailDialog title={`Relevé #${releve.id}`} entity={releve} />
      </div>
    </div>
  </Card>
);

const GrandLivres = ({ grandLivres, rapprochementId, onDematch }: { 
  grandLivres: any[], 
  rapprochementId: string, 
  onDematch: (rapprochementId: string, ligneId: number) => void 
}) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDematch = async () => {
    setIsLoading(true);
    const ligneId = parseInt(grandLivres[0].id);
    if (!isNaN(ligneId)) {
      await onDematch(rapprochementId, ligneId);
    } else {
      console.error("L'ID de la ligne n'est pas un nombre valide");
    }
    setIsLoading(false);
    setIsConfirmDialogOpen(false);
  };

  return (
    <div className="space-y-2 relative">
      {grandLivres.map((item, idx) => (
        <Card key={idx} className="w-full rounded-sm mb-2 shadow-sm bg-blue-100 border-l-4 border-l-blue-500 hover:shadow-md cursor-pointer transition-shadow duration-200">
          <div className="flex items-center ml-9 h-28">
            <div className="flex-grow h-full flex flex-col justify-center py-3 ml-4">
              <CardTitle className="text-sm font-semibold text-blue-700">{`ID: ${item.grand_livre.id}`}</CardTitle>
              <CardDescription className="text-xs mt-1 text-gray-600">{item.grand_livre.libelle}</CardDescription>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Date: </span>
                  <span className="font-medium text-gray-900">{new Date(item.grand_livre.date_ecriture).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Montant: </span>
                  <span className="font-medium text-gray-900">
                    {item.grand_livre.debit ? 
                      `-${formatMontant(item.grand_livre.debit)}` : 
                      formatMontant(item.grand_livre.credit)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Statut: </span>
                  <span className="font-medium text-gray-900">{item.statut}</span>
                </div>
              </div>
              {item.commentaire && (
                <div className="mt-2 flex items-center text-xs text-gray-600">
                  <Info size={14} className="mr-1 text-blue-500" />
                  <span>{item.commentaire}</span>
                </div>
              )}
            </div>
            <div className="p-4 h-full flex items-center">
              <GrandLivreDetailDialog title={`Grand Livre : ${item.grand_livre.id}`} entity={item} />
            </div>
          </div>
        </Card>
      ))}
      <div className="flex items-center space-x-2 justify-end mt-4">
        <Button 
          size="sm" 
          className="bg-red-600 rounded-sm my-2 hover:bg-red-600 text-white"
          onClick={() => setIsConfirmDialogOpen(true)}
        >
          <Split className="mr-1" size={14} />
          Dématcher
        </Button>
      </div>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirmer le dématchage</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-600">
            Êtes-vous sûr de vouloir dématcher le grand livre <span className="font-medium text-blue-600">{grandLivres[0]?.grand_livre.id}</span> du Relevé <span className="font-medium text-orange-600">{rapprochementId}</span> ?
          </DialogDescription>
          <div className="flex justify-end space-x-2 mt-4">
            <Button size="sm" className="rounded-sm" variant="outline" onClick={() => setIsConfirmDialogOpen(false)} disabled={isLoading}>
              <X className="mr-1" size={14} />
              Annuler
            </Button>
            <Button size="sm" className="bg-green-600 rounded-sm hover:bg-green-600 text-white" onClick={handleDematch} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              <Check className="mr-1" size={14} />
              Oui
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const HistoriqueRapprochement: React.FC<HistoriqueRapprochementProps> = ({ items, onDematch }) => {
  return (
    <div className="space-y-2 w-full">
      {items.map((rapprochement, idx) => (
        <div key={idx} className="border-2 border-gray-200 p-4 rounded-sm w-full">
          <span className="text-gray-600 text-xs">{`#${rapprochement.id}`}</span>
          <Releve releve={rapprochement} />
          <GrandLivres 
            grandLivres={rapprochement.lignes_rapprochement} 
            rapprochementId={rapprochement.id}
            onDematch={onDematch}
          />
        </div>
      ))}
    </div>
  );
};