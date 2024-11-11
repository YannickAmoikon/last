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
import { LineLink as LineLinkType } from '@/types/lineLink';

interface LineLinkProps {
  linesLinks: LineLinkType[];
  bankStatementId: string;
  onMatchSuccess?: () => void;
  bankStatement: any; // À typer selon vos besoins
  isClotured?: boolean;
  showMatchButtons?: boolean;
  showDematchButton?: boolean;
}

interface EcartCalculation {
  totalGrandLivre: number;
  totalReleve: number;
  ecart: number;
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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validateLineLink] = useValidateLineLinkMutation();
  const [dematchLineLink] = useDematchLineLinkMutation();
  const { toast } = useToast()
  const [ecartCalculation, setEcartCalculation] = useState<EcartCalculation | null>(null);
  const [isDematchDialogOpen, setIsDematchDialogOpen] = useState(false);

  const calculateEcart = useCallback((selectedIds: string[]) => {
    const selectedLines = linesLinks.filter(line => 
      selectedIds.includes(line.id.toString())
    );

    const totalGrandLivre = selectedLines.reduce((sum, line) => {
      const montant = line.grands_livres[0]?.credit || -line.grands_livres[0]?.debit || 0;
      return sum + montant;
    }, 0);

    const montantReleve = bankStatement.credit || -bankStatement.debit || 0;
    
    const ecart = totalGrandLivre + montantReleve;
    
    setEcartCalculation({
      totalGrandLivre,
      totalReleve: montantReleve,
      ecart: Math.abs(ecart)
    });

    return Math.abs(ecart);
  }, [linesLinks, bankStatement]);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === linesLinks.length) {
      setSelectedItems([]);
      setEcartCalculation(null);
    } else {
      const allIds = linesLinks.map(link => link.id.toString());
      setSelectedItems(allIds);
      calculateEcart(allIds);
    }
  }, [linesLinks, selectedItems.length, calculateEcart]);

  const handleCheckboxChange = useCallback((id: string) => {
    setSelectedItems(prev => {
      const newSelection = prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id];
      
      if (newSelection.length > 0) {
        calculateEcart(newSelection);
      } else {
        setEcartCalculation(null);
      }
      
      return newSelection;
    });
  }, [calculateEcart]);

  const handleMatchSelected = async () => {
    if (!onMatchSuccess) return;
    
    const ecart = calculateEcart(selectedItems);
    
    if (ecart > 1000 && !ecartCalculation) {
      setEcartCalculation({
        totalGrandLivre: ecart,
        totalReleve: bankStatement.credit || -bankStatement.debit || 0,
        ecart: Math.abs(ecart)
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await validateLineLink({ 
        rapprochement_id: parseInt(bankStatementId),
        ligne_ids: selectedItems.map(id => parseInt(id)),
        ecart_accepte: ecart > 1000
      }).unwrap();
      
      setIsDialogOpen(false);
      setSelectedItems([]);
      setEcartCalculation(null);
      
      onMatchSuccess();

      toast({
        title: "Match réussi",
        description: "Les éléments ont été matchés avec succès.",
        className: "bg-green-600 text-white"
      });
    } catch (error) {
      console.error("Erreur lors du match:", error);
      toast({
        title: "Erreur de match",
        description: "Une erreur est survenue lors du match.",
        variant: "destructive",
      });
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
      await dematchLineLink({ 
        rapprochement_id: parseInt(rapprochementId), 
        ligne_id: ligneId 
      }).unwrap();

      setIsDematchDialogOpen(false);
      setSelectedItems([]);

      setTimeout(() => {
        if (onMatchSuccess) {
          onMatchSuccess();
        }
      }, 500);

      toast({ 
        title: "Dématchage réussi", 
        description: "L'élément a été dématché avec succès.", 
        className: "bg-green-600 text-white" 
      });
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
      <div className="flex justify-between items-center mb-4">
        <Button
          size="sm"
          variant="outline"
          onClick={handleSelectAll}
          className="text-xs rounded-sm"
        >
          {selectedItems.length === linesLinks.length ? "Tout désélectionner" : "Tout sélectionner"}
        </Button>
        <span className="text-sm text-gray-600 ">
          {selectedItems.length} élément(s) sélectionné(s)
        </span>
      </div>

      {linesLinks.map((lineLink) => (
        <Card 
          key={lineLink.id} 
          className={`w-full rounded-sm mb-2 shadow-sm hover:shadow-md transition-shadow duration-200 ${
            selectedItems.includes(lineLink.id.toString()) 
              ? 'bg-blue-200 border-l-4 border-l-blue-600' 
              : 'bg-blue-100 border-l-4 border-l-blue-500'
          }`}
        >
          <div className="flex items-center h-28">
            <div className="p-4 h-full flex items-center">
              <input
                type="checkbox"
                checked={selectedItems.includes(lineLink.id.toString())}
                onChange={(e) => {
                  e.stopPropagation();
                  handleCheckboxChange(lineLink.id.toString());
                }}
                className="h-5 w-5 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div 
              className="flex-grow h-full flex flex-col justify-center py-3 cursor-pointer"
              onClick={() => handleCheckboxChange(lineLink.id.toString())}
            >
              <CardTitle className="text-sm font-semibold text-blue-700">
                {`ID: ${lineLink.grands_livres[0]?.id}`}
              </CardTitle>
              <CardDescription className="text-xs mt-1 text-gray-600">
                {lineLink.grands_livres[0]?.libelle}
              </CardDescription>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Date: </span>
                  <span className="font-medium text-gray-900">
                    {new Date(lineLink.grands_livres[0]?.date_ecriture).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Montant: </span>
                  <span className="font-medium text-gray-900">
                    {lineLink.grands_livres[0]?.debit ? 
                      `-${formatMontant(lineLink.grands_livres[0].debit)}` : 
                      formatMontant(lineLink.grands_livres[0]?.credit)}
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
              <LineLinkDetailDialog 
                title={`Grand Livre : ${lineLink.grands_livres[0]?.id}`} 
                entity={lineLink} 
              />
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
                  disabled={selectedItems.length === 0 || isLoading}
                >
                  <Merge className="mr-1" size={14} />
                  Matcher ({selectedItems.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Faire un matching</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-gray-600">
                  <div className="space-y-4">
                    <p>
                      Êtes-vous sûr de vouloir matcher {selectedItems.length} élément(s) au Relevé <span className="font-medium text-orange-600">{bankStatementId}</span> ?
                    </p>
                    
                    {ecartCalculation && ecartCalculation.ecart > 0 && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Info className="h-5 w-5 text-yellow-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              {ecartCalculation.ecart > 1000 ? 
                                "Attention : Un écart important a été détecté" : 
                                "Un écart a été détecté"}
                            </p>
                            <ul className="mt-2 text-sm text-yellow-700">
                              <li>Total Grand Livre : {formatMontant(ecartCalculation.totalGrandLivre)} XOF</li>
                              <li>Total Relevé : {formatMontant(ecartCalculation.totalReleve)} XOF</li>
                              <li>Écart : {formatMontant(ecartCalculation.ecart)} XOF</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogDescription>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button 
                    size="sm" 
                    className="rounded-sm" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEcartCalculation(null);
                    }} 
                    disabled={isLoading}
                  >
                    <X className="mr-1" size={14} />
                    Annuler
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-green-600 rounded-sm hover:bg-green-600 text-white" 
                    onClick={handleMatchSelected} 
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    <Check className="mr-1" size={14} />
                    {/* @ts-ignore */}
                    {ecartCalculation?.ecart > 1000 ? "Confirmer malgré l'écart" : "Confirmer"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <ManuelMatchDialog bankStatement={bankStatement} />
          </>
        )}
        {showDematchButton && !isClotured && selectedItems.length > 0 && (
          <Dialog open={isDematchDialogOpen} onOpenChange={setIsDematchDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="bg-red-600 rounded-sm my-2 hover:bg-red-600 text-white"
                disabled={isLoading}
              >
                <Split className="mr-1" size={14} />
                Dématcher ({selectedItems.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Confirmer le dématchage multiple</DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-gray-600">
                Êtes-vous sûr de vouloir dématcher {selectedItems.length} élément(s) ?
              </DialogDescription>
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  size="sm" 
                  className="rounded-sm" 
                  variant="outline" 
                  onClick={() => setIsDematchDialogOpen(false)} 
                  disabled={isLoading}
                >
                  <X className="mr-1" size={14} />
                  Annuler
                </Button>
                <Button 
                  size="sm" 
                  className="bg-red-600 rounded-sm hover:bg-red-600 text-white" 
                  onClick={() => handleDematch(bankStatementId, parseInt(selectedItems[0]!))} 
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
