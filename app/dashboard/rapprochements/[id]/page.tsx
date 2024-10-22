"use client"

import React, { useState, useCallback, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Eye, Merge, Loader2, Info, Check, X, Filter, ChevronDown, CheckSquare, Square, AlertTriangle, ListFilter } from 'lucide-react';
import { useGetRapprochementLignesQuery, useValiderLigneRapprochementMutation, useGetRapprochementRapportQuery } from '@/lib/services/rapprochementsApi';
import { toast, useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileDown, FileSpreadsheet } from 'lucide-react';

// Définir le type d'exportation
type ExportType = 'Pas_rapproche' | 'Rapprochement_Match' | null;

// Fonction utilitaire pour formater le nom du fichier
const getExportFileName = (type: ExportType): string => {
  const date = new Date().toISOString().split('T')[0];
  const typeLabel = type === 'Pas_rapproche' ? 'non-rapproche' : 'rapprochement-match';
  return `rapport-${typeLabel}-${date}.xlsx`;
};

const StatCard = ({ title, value }: { title: string, value: string }) => (
  <Card className="bg-gray-100 border shadow-sm">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-lg font-bold text-gray-600">{value}</div>
    </CardContent>
  </Card>
);

const DetailButton = ({ onClick }: { onClick: () => void }) => (
  <Button 
    size="sm" 
    variant="outline" 
    onClick={onClick}
    className="text-xs py-1.5 px-3 h-7 bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200"
  >
    <Eye className="mr-1" size={14} />
    Voir les détails
  </Button>
);

const DetailDialog = ({ title, entity }: { title: string, entity: any }) => {
  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Oui" : "Non";
    if (typeof value === "number") return value.toLocaleString();
    if (value instanceof Date) return value.toLocaleString();
    return String(value);
  };

  const renderReleveDetails = (releve: any) => {
    const releveKeys = [
      'rapprochement_id', 'date_operation', 'numero_compte', 'description',
      'reference', 'date_valeur', 'devise', 'debit', 'credit', 'solde_courant', 'id'
    ];

    return (
      <div className="grid gap-2">
        {releveKeys.map(key => (
          <div key={key} className="grid grid-cols-3 gap-2 items-center">
            <span className="text-sm font-medium text-gray-600">{key}:</span>
            <span className="col-span-2 text-sm">{formatValue(releve[key])}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DetailButton onClick={() => {}} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {renderReleveDetails(entity)}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const GrandLivreDetailDialog = ({ title, entity }: { title: string, entity: any }) => {
  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Oui" : "Non";
    if (typeof value === "number") return value.toLocaleString();
    if (value instanceof Date) return value.toLocaleString();
    return String(value);
  };

  const renderGrandLivreDetails = (grandLivre: any) => {
    const rapprochementKeys = ['id', 'rapprochement_id', 'statut', 'type_match', 'commentaire', 'decision', 'flag'];
    const grandLivreKeys = ['rapprochement_id', 'numero_piece', 'date_ecriture', 'libelle', 'debit', 'credit', 'cpte_alt', 'exercice', 'compte', 'cpte_gen', 'id'];

    return (
      <div className="grid gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Informations de rapprochement</h3>
          <div className="grid gap-2">
            {rapprochementKeys.map(key => (
              <div key={key} className="grid grid-cols-3 gap-2 items-center">
                <span className="text-sm font-medium text-gray-600">{key}:</span>
                <span className="col-span-2 text-sm">{formatValue(grandLivre[key])}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Détails du Grand Livre</h3>
          <div className="grid gap-2">
            {grandLivreKeys.map(key => (
              <div key={key} className="grid grid-cols-3 gap-2 items-center">
                <span className="text-sm font-medium text-gray-600">{key}:</span>
                <span className="col-span-2 text-sm">{formatValue(grandLivre.grand_livre[key])}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DetailButton onClick={() => {}} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {renderGrandLivreDetails(entity)}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TransactionCard = ({ 
  title, 
  description, 
  details, 
  entity, 
  isGrandLivre = false,
  DetailDialogComponent = DetailDialog 
}: { 
  title: string, 
  description: string, 
  details: { date: string, montant: string, statut: string }[], 
  entity: any, 
  isGrandLivre?: boolean,
  DetailDialogComponent?: React.ComponentType<{ title: string, entity: any }>
}) => (
  <Card className="w-full mb-2 shadow-md">
    <CardHeader className="pb-2 pt-3">
      <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      <CardDescription className="text-xs">{description}</CardDescription>
    </CardHeader>
    <CardContent className="pt-1 pb-2">
      {details.map((detail, index) => (
        <div key={index} className="py-1.5 border-b last:border-b-0">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium">{detail.date}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Montant:</span>
            <span className="font-medium">{detail.montant}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Statut:</span>
            <span className="font-medium">{detail.statut}</span>
          </div>
        </div>
      ))}
    </CardContent>
    <CardFooter className="pt-2 pb-3">
     <div className="flex justify-end w-full space-x-2">
       <DetailDialogComponent title={title} entity={entity} />
       {isGrandLivre && <Button size="sm" className="text-xs py-1.5 px-3 h-7">Matcher</Button>}
     </div>
    </CardFooter>
  </Card>
);

const Releve = ({ releve }: { releve: any }) => (
  <Card className="w-full mb-2 bg-orange-100 rounded-none shadow-sm border-l-4 border-l-orange-500">
    <div className="flex items-center ml-8 h-28">
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
              {releve.debit ? `-${releve.debit.toFixed(2)} FCFA` : 
               releve.credit ? `${releve.credit.toFixed(2)} FCFA` : 
               "0.00 FCFA"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Description: </span>
            <span className="font-medium text-gray-900">{releve.description}</span>
          </div>
        </div>
      </div>
      <div className="p-4 h-full flex items-center">
        <DetailDialog title={`RELEVE : ${releve.id}`} entity={releve} />
      </div>
    </div>
  </Card>
);

const GrandLivres = ({ grandLivres, releveId, onMatchSuccess }: { grandLivres: any[], releveId: string, onMatchSuccess: () => void }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validerLigneRapprochement] = useValiderLigneRapprochementMutation();
  const { toast } = useToast()

  const handleCheckboxChange = useCallback((id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);

  const handleMatchSelected = async () => {
    setIsLoading(true);
    try {
      await validerLigneRapprochement({ rapprochement_id: parseInt(releveId), ligne_id: parseInt(selectedItems[0]) });
      console.log("Matching réussi pour les éléments:", selectedItems); 
      setIsDialogOpen(false);
      setSelectedItems([]);
      onMatchSuccess(); // Appel de la fonction pour rafraîchir les données
      toast({
        title: "Matching réussi",
        description: `${selectedItems.length} élément(s) ont été matchés avec succès.`,
        className: "bg-green-600 text-white"
      })
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
      {grandLivres.map((grandLivre, idx) => (
        <Card key={idx} className="w-full rounded-none mb-2 shadow-sm bg-blue-100 border-l-4 border-l-blue-500">
          <div className="flex items-center h-28">
            <div className="p-4 h-full flex items-center">
              <input
                type="checkbox"
                checked={selectedItems.includes(grandLivre.id)}
                onChange={() => handleCheckboxChange(grandLivre.id)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="flex-grow h-full flex flex-col justify-center py-3">
              <CardTitle className="text-sm font-semibold text-blue-700">{`ID: ${grandLivre.grand_livre.id}`}</CardTitle>
              <CardDescription className="text-xs mt-1 text-gray-600">{grandLivre.grand_livre.libelle}</CardDescription>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Date: </span>
                  <span className="font-medium text-gray-900">{new Date(grandLivre.grand_livre.date_ecriture).toLocaleDateString()}</span>
                  <span className="text-gray-600 flex items-center mt-2">
                    <Info className="mr-1 text-orange-500" size={14} />
                    {grandLivre.commentaire}
                    </span>
                </div>
                <div>
                  <span className="text-gray-600">Montant: </span>
                  <span className="font-medium text-gray-900">
                    {grandLivre.grand_livre.debit ? 
                      `-${grandLivre.grand_livre.debit.toFixed(2)} FCFA` : 
                      `${grandLivre.grand_livre.credit.toFixed(2)} FCFA`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Statut: </span>
                  <span className="font-medium text-gray-900">{grandLivre.statut}</span>
                </div>
              </div>
            </div>
            <div className="p-4 h-full flex items-center">
              <GrandLivreDetailDialog title={`Grand Livre : ${grandLivre.grand_livre.id}`} entity={grandLivre} />
            </div>
          </div>
        </Card>
      ))}
      
      <div className="flex justify-center mt-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              className="bg-blue-600 my-2 hover:bg-blue-700 text-white"
              disabled={selectedItems.length === 0 || isLoading}
            >
              <Merge className="mr-1" size={14} />
              Matcher {selectedItems.length} élément{selectedItems.length > 1 ? 's' : ''}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Faire un matching</DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-gray-600">
              Êtes-vous sûr de vouloir matcher {selectedItems.length} élément(s) au Relevé {releveId} ?
            </DialogDescription>
            <div className="flex justify-end space-x-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                <X className="mr-1" size={14} />
                Annuler
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-600 text-white" onClick={handleMatchSelected} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                <Check className="mr-1" size={14} />
                Oui
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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

const Rapprochement = ({ rapprochement }: { rapprochement: any }) => (
  <div className="border-2 border-gray-200 p-4 rounded-md w-full">
    <span className="text-gray-600 text-xs">{`#${rapprochement.id}`}</span>
    <Releve releve={rapprochement} />
    <GrandLivres grandLivres={rapprochement.lignes_rapprochement} releveId={rapprochement.id} onMatchSuccess={() => {}} />
  </div>
);

export default function RapprochementDetails({params}: {params: {id: string}}) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [exportType, setExportType] = useState<ExportType>(null);

  const rapprochementId = parseInt(params.id);

  const { data, error, isLoading, refetch } = useGetRapprochementLignesQuery({
    statut: statusFilter || "Rapprochement partiel",
    rapprochement_id: rapprochementId,
    page: currentPage,
    page_size: pageSize
  });

  const { data: rapportData, isFetching: isExporting, error: rapportError } = useGetRapprochementRapportQuery(
    { rapprochement_id: rapprochementId, statut: exportType || '' },
    { skip: !exportType }
  );

  const handlePrevious = () => {
    setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage(prev => (prev < (data?.total_pages || 1) ? prev + 1 : prev));
  };

  const handleMatchSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleExportClick = (type: ExportType) => {
    setExportType(type);
  };

  useEffect(() => {
    if (rapportData && exportType) {
      const fileName = getExportFileName(exportType);
      saveAs(rapportData, fileName); // rapportData est déjà un Blob, pas besoin de le convertir
      setExportType(null);
      toast({
        title: "Export réussi",
        description: `Le rapport a été téléchargé avec succès.`,
        className: "bg-green-600 text-white",
      });
    }
  }, [rapportData, exportType]);

  useEffect(() => {
    if (rapportError) {
      console.error("Erreur lors du chargement du rapport:", rapportError);
      toast({
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de l'export des données.",
        variant: "destructive",
      });
    }
  }, [rapportError]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-2 text-gray-600">Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500">Une erreur est survenue lors du chargement des données.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full p-1 space-y-4 bg-gray-50">
      <Toaster />
      <Card className="w-full shadow-md border border-gray-200">
        <CardHeader className="border-b border-gray-200 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">Détails du Rapprochement</CardTitle>
            <CardDescription className="text-gray-600">Informations générales et statistiques</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="ml-auto">
                <ListFilter className="mr-1" size={14} />
                Filtrer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => handleStatusFilter(null)}>
                <Filter className="mr-2 h-4 w-4" />
                <span>Tous les statuts</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("Rapprochement partiel")}>
                <Filter className="mr-2 h-4 w-4" />
                <span>Rapprochement partiel</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("Rapprochement total")}>
                <Filter className="mr-2 h-4 w-4" />
                <span>Rapprochement total</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("Non rapproché")}>
                <Filter className="mr-2 h-4 w-4" />
                <span>Non rapproché</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="ml-2" disabled={isExporting}>
                {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-1" size={14} />}
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => handleExportClick('Pas_rapproche')} disabled={isExporting}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                <span>Non rapproché</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportClick('Rapprochement_Match')} disabled={isExporting}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                <span>Rapprochement Match</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-4 gap-4">
            <StatCard title="Total de lignes" value={data?.total_ligne.toString() || "0"} />
            <StatCard title="Total de matchs" value={data?.total_match.toString() || "0"} />
            <StatCard title="En attente de validation" value={data?.total.toString() || "0"} />
            <StatCard 
              title="Taux de progression" 
              //@ts-ignore
              value={`${(((data?.total_ligne - data?.total) / data?.total_ligne) * 100).toFixed(1)}%`}
            />
          </div>
          {data?.items.map((rapprochement, idx) => (
            <Rapprochement rapprochement={rapprochement} key={idx} />
          ))}
        </CardContent>
        <CardFooter className="flex justify-between p-4 items-center bg-gray-50 border-t border-gray-200">
          <Button size="sm" variant="outline" onClick={handlePrevious} disabled={currentPage === 1} className="text-gray-600 border-gray-300 hover:bg-gray-100">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>
          <div className="text-xs text-gray-600">
            Affichage {currentPage} - {data?.total_pages || 1}
          </div>
          <Button size="sm" variant="outline" onClick={handleNext} disabled={currentPage === (data?.total_pages || 1)} className="text-gray-600 border-gray-300 hover:bg-gray-100">
            Suivant
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
