"use client"

import React, { useState } from 'react';
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
import { ChevronLeft, ChevronRight, Eye, Merge, Loader2, Info } from 'lucide-react';
import { useGetRapprochementLignesQuery } from '@/lib/services/rapprochementsApi';

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

const GrandLivres = ({ grandLivres, releveId }: { grandLivres: any[], releveId: string }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCheckboxChange = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleMatchSelected = () => {
    console.log("Matching selected items:", selectedItems);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-2">
      {grandLivres.map((grandLivre, idx) => (
        <Card key={idx} className="w-full rounded-none mb-2 shadow-sm bg-blue-100 border-l-4 border-l-blue-500">
          <div className="flex items-center h-28">
            <div className="p-4 h-full flex items-center">
              <input
                type="checkbox"
                checked={selectedItems.includes(grandLivre.grand_livre.id)}
                onChange={() => handleCheckboxChange(grandLivre.grand_livre.id)}
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={selectedItems.length === 0}
            >
				<Merge className="mr-1" size={14} />
              Matcher {selectedItems.length} élément{selectedItems.length > 1 ? 's' : ''}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-blue-700">Faire un matching</DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-gray-600">
              Matcher le Grand Livre {grandLivres[0].grand_livre.id} au Relevé {releveId} ?
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const Rapprochement = ({ rapprochement }: { rapprochement: any }) => (
  <div className="border-2 border-gray-200 p-4 rounded-md w-full">
    <span className="text-gray-600 text-xs">{`#${rapprochement.id}`}</span>
    <Releve releve={rapprochement} />
    <GrandLivres grandLivres={rapprochement.lignes_rapprochement} releveId={rapprochement.id} />
  </div>
);

export default function RapprochementDetails() {
  const [currentRapprochementIndex, setCurrentRapprochementIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const rapprochementId = 1;

  const { data, error, isLoading } = useGetRapprochementLignesQuery({
    statut: "Rapprochement partiel",
    rapprochement_id: rapprochementId,
    page: currentPage,
    page_size: pageSize
  });

  const handlePrevious = () => {
    setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage(prev => (prev < (data?.total_pages || 1) ? prev + 1 : prev));
  };

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
      <Card className="w-full shadow-md border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-lg font-bold text-gray-900">Détails du Rapprochement {rapprochementId}</CardTitle>
          <CardDescription className="text-gray-600">Informations générales et statistiques</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-3 gap-4">
            <StatCard title="Total Lignes" value={data?.total.toString() || "0"} />
            <StatCard title="Taux de matchs positifs" value="98%" />
            <StatCard title="Taux de matchs négatifs" value="2%" />
          </div>

          {/* {data && data.items.length > 0 && (
            <Rapprochement rapprochement={data.items[currentRapprochementIndex]} />
          )} */}

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
