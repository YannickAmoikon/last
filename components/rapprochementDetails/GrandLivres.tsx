import React, { useState, useCallback } from 'react';
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Merge, Loader2, Info, Check, X } from 'lucide-react';
import { useValiderLigneRapprochementMutation } from '@/lib/services/rapprochementsApi';
import { useToast } from "@/hooks/use-toast"
import { GrandLivreDetailDialog } from './GrandLivreDetailDialog'
import { formatMontant } from '@/utils/formatters'
import OptionMatchDialog from './OptionMatchDialog';

export const GrandLivres = ({ grandLivres, releveId, onMatchSuccess, releve }: { grandLivres: any[], releveId: string, onMatchSuccess: () => void, releve: any }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validerLigneRapprochement] = useValiderLigneRapprochementMutation();
  const { toast } = useToast()

  const handleCheckboxChange = useCallback((id: string) => {
    setSelectedItem(prev => prev === id ? null : id);
  }, []);

  const handleMatchSelected = async () => {
    setIsLoading(true);
    try {
      if (selectedItem) {
        await validerLigneRapprochement({ rapprochement_id: parseInt(releveId), ligne_id: parseInt(selectedItem) });
        setIsDialogOpen(false);
        setSelectedItem(null);
        onMatchSuccess();
        toast({
          title: "Matching réussi",
          description: "L'élément a été matché avec succès.",
          className: "bg-green-600 text-white"
        })
      }
    } catch (error) {
      console.error("Erreur lors du matching:", error);
      toast({
        title: "Erreur de matching",
        description: "Une erreur est survenue lors du matching.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2 relative">
      {grandLivres.map((item, idx) => (
        <Card key={idx} className="w-full rounded-sm mb-2 shadow-sm bg-blue-100 border-l-4 border-l-blue-500 hover:shadow-md cursor-pointer transition-shadow duration-200">
          <div className="flex items-center h-28">
            <div className="p-4 h-full flex items-center">
              <input
                type="checkbox"
                checked={selectedItem === item.id.toString()}
                onChange={() => handleCheckboxChange(item.id.toString())}
                className="h-5 w-5 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="flex-grow h-full flex flex-col justify-center py-3">
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              className="bg-blue-600 rounded-sm my-2 hover:bg-blue-600 text-white"
              disabled={!selectedItem || isLoading}
            >
              <Merge className="mr-1" size={14} />
              Matcher
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Faire un matching</DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-gray-600">
              Êtes-vous sûr de vouloir matcher le grand livre <span className="font-medium text-blue-600">{grandLivres[0].grand_livre.id}</span> au Relevé <span className="font-medium text-orange-600">{releveId}</span> ?
            </DialogDescription>
            <div className="flex justify-end space-x-2 mt-4">
              <Button size="sm" className="rounded-sm" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                <X className="mr-1" size={14} />
                Annuler
              </Button>
              <Button size="sm" className="bg-green-600 rounded-sm hover:bg-green-600 text-white" onClick={handleMatchSelected} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                <Check className="mr-1" size={14} />
                Oui
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <OptionMatchDialog 
          releve={releve}
        />
      </div>
      {(isDialogOpen || isLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" aria-hidden="true">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
