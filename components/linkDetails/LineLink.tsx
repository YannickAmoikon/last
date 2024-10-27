import React, { useState, useCallback } from 'react';
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Merge, Loader2, Info, Check, X, Split } from 'lucide-react';
import { useValidateLineLinkMutation } from '@/lib/services/linkApi';
import { useDematchLineLinkMutation } from '@/lib/services/lineLinkApi';
import { useToast } from "@/hooks/use-toast"
import { LineLinkDetailDialog } from './LineLinkDetailDialog'
import { formatMontant } from '@/utils/formatters'
import ManuelMatchDialog from './CreateManuelMatchDialog';

interface LineLinkProps {
  linesLinks: any[];
  bankStatementId: string;
  onMatchSuccess?: () => void;
  bankStatement: any;
  isClotured?: boolean;
  showMatchButtons?: boolean;
  showDematchButton?: boolean;
}

export const LineLink: React.FC<LineLinkProps> = ({ 
  linesLinks, 
  bankStatementId, 
  onMatchSuccess,
  bankStatement, 
  isClotured,
  showMatchButtons,
  showDematchButton
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validateLineLink] = useValidateLineLinkMutation();
  const [dematchLineLink] = useDematchLineLinkMutation();
  const { toast } = useToast()

  const handleCheckboxChange = useCallback((id: string) => {
    setSelectedItem(prev => prev === id ? null : id);
  }, []);

  const handleMatchSelected = async () => {
    if (!onMatchSuccess) return;
    setIsLoading(true);
    try {
      if (selectedItem) {
        await validateLineLink({ rapprochement_id: parseInt(bankStatementId), ligne_id: parseInt(selectedItem) });
        setIsDialogOpen(false);
        setSelectedItem(null);
        onMatchSuccess();
        toast({
          title: "Match réussi",
          description: "L'élément a été matché avec succès.",
          className: "bg-green-600 text-white"
        })
      }
    } catch (error) {
      console.error("Erreur lors du match:", error);
      toast({
        title: "Erreur de match",
        description: "Une erreur est survenue lors du match.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleDematch = async (rapprochementId: string, ligneId: number) => {
    if (isClotured) {
      toast({ 
        title: "Action non autorisée", 
        description: "Le dématchage n'est pas possible sur un rapprochement clôturé.", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    try {
      await dematchLineLink({ rapprochement_id: parseInt(rapprochementId), ligne_id: ligneId }).unwrap();
      toast({ 
        title: "Dématchage réussi", 
        description: "L'élément a été dématché avec succès.", 
        className: "bg-green-600 text-white" 
      });
      if (onMatchSuccess) onMatchSuccess();
    } catch (error) {
      console.error("Erreur lors du dématchage:", error);
      toast({ 
        title: "Erreur de dématchage", 
        description: "Une erreur est survenue lors du dématchage de l'élément.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2 relative">
      {linesLinks.map((lineLink, idx) => (
        <Card key={idx} className="w-full rounded-sm mb-2 shadow-sm bg-blue-100 border-l-4 border-l-blue-500 hover:shadow-md cursor-pointer transition-shadow duration-200">
          <div className="flex items-center h-28">
            <div className="p-4 h-full flex items-center">
              <input
                type="checkbox"
                checked={selectedItem === lineLink.id.toString()}
                onChange={() => handleCheckboxChange(lineLink.id.toString())}
                className="h-5 w-5 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="flex-grow h-full flex flex-col justify-center py-3">
              <CardTitle className="text-sm font-semibold text-blue-700">{`ID: ${lineLink.grand_livre.id}`}</CardTitle>
              <CardDescription className="text-xs mt-1 text-gray-600">{lineLink.grand_livre.libelle}</CardDescription>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Date: </span>
                  <span className="font-medium text-gray-900">{new Date(lineLink.grand_livre.date_ecriture).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Montant: </span>
                  <span className="font-medium text-gray-900">
                    {lineLink.grand_livre.debit ? 
                      `-${formatMontant(lineLink.grand_livre.debit)}` : 
                      formatMontant(lineLink.grand_livre.credit)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Statut: </span>
                  <span className="font-medium text-gray-900">{lineLink.statut}</span>
                </div>
              </div>
              {lineLink.commentaire && (
                <div className="mt-2 flex items-center text-xs text-gray-600">
                  <Info size={14} className="mr-1 text-blue-500" />
                  <span>{lineLink.commentaire}</span>
                </div>
              )}
            </div>
            <div className="p-4 h-full flex items-center">
              <LineLinkDetailDialog title={`Grand Livre : ${lineLink.grand_livre.id}`} entity={lineLink} />
            </div>
          </div>
        </Card>
      ))}
      
      <div className="flex items-center space-x-2 justify-end mt-4">
        {showMatchButtons && (
          <>
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
                  Êtes-vous sûr de vouloir matcher le grand livre <span className="font-medium text-blue-600">{linesLinks[0]?.grand_livre.id}</span> au Relevé <span className="font-medium text-orange-600">{bankStatementId}</span> ?
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
            <ManuelMatchDialog bankStatement={bankStatement} />
          </>
        )}
        {showDematchButton && !isClotured && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="bg-red-600 rounded-sm my-2 hover:bg-red-600 text-white"
                disabled={!selectedItem || isLoading}
              >
                <Split className="mr-1" size={14} />
                Dématcher
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Confirmer le dématchage</DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-gray-600">
                Êtes-vous sûr de vouloir dématcher cet élément ?
              </DialogDescription>
              <div className="flex justify-end space-x-2 mt-4">
                <Button size="sm" className="rounded-sm" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                  <X className="mr-1" size={14} />
                  Annuler
                </Button>
                <Button 
                  size="sm" 
                  className="bg-red-600 rounded-sm hover:bg-red-600 text-white" 
                  onClick={() => handleDematch(bankStatementId, parseInt(selectedItem!))} 
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  <Check className="mr-1" size={14} />
                  Confirmer le dématchage
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
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
