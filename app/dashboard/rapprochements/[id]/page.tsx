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
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetRapprochementLignesQuery } from '@/lib/services/rapprochementsApi';

const StatCard = ({ title, value }: { title: string, value: string }) => (
  <Card className="">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-lg font-bold">{value}</div>
    </CardContent>
  </Card>
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
        <Button size="sm" variant="outline" className="text-xs py-1.5 px-3 h-7">Voir les détails</Button>
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
        <Button size="sm" variant="outline" className="text-xs py-1.5 px-3 h-7">Voir les détails</Button>
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
  <TransactionCard 
    title="RELEVE"
    description={`Compte: ${releve.numero_compte}`}
    details={[
      { 
        date: new Date(releve.date_operation).toLocaleDateString(), 
        montant: releve.debit ? `-${releve.debit.toFixed(2)} ${releve.devise}` : 
                 releve.credit ? `${releve.credit.toFixed(2)} ${releve.devise}` : 
                 "0.00 " + releve.devise,
        statut: releve.description
      }
    ]}
    entity={releve}
  />
);

const GrandLivres = ({ grandLivres }: { grandLivres: any[] }) => (
  <div className="space-y-4">
    {grandLivres.map((grandLivre, idx) => (
      <TransactionCard 
        key={idx}
        title={`Grand Livre ${idx + 1}`}
        description={grandLivre.grand_livre.libelle}
        details={[
          {
            date: new Date(grandLivre.grand_livre.date_ecriture).toLocaleDateString(),
            montant: grandLivre.grand_livre.debit ? 
              `-${grandLivre.grand_livre.debit.toFixed(2)}` : 
              `${grandLivre.grand_livre.credit.toFixed(2)}`,
            statut: grandLivre.statut
          }
        ]}
        entity={grandLivre}
        isGrandLivre={true}
        DetailDialogComponent={GrandLivreDetailDialog}
      />
    ))}
    {grandLivres.length > 0 && (
      <div className="text-sm text-muted-foreground mt-2">
        Commentaire: {grandLivres[0].commentaire}
      </div>
    )}
  </div>
);

const Rapprochement = ({ rapprochement }: { rapprochement: any }) => (
  <div className="space-y-4 w-full">
    <Releve releve={rapprochement} />
    <GrandLivres grandLivres={rapprochement.lignes_rapprochement} />
  </div>
);

export default function RapprochementDetails() {
  const [currentRapprochementIndex, setCurrentRapprochementIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const rapprochementId = 1;

  const { data, error, isLoading } = useGetRapprochementLignesQuery({
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

  return (
    <div className="flex flex-col flex-1 w-full p-1 space-y-4 bg-background">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Détails du Rapprochement {rapprochementId}</CardTitle>
          <CardDescription>Informations générales et statistiques</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <StatCard title="Total Lignes" value={data?.total.toString() || "0"} />
            <StatCard title="Taux de match positif" value="98%" />
            <StatCard title="Taux de match négatif" value="2%" />
          </div>

          {data && data.items.length > 0 && (
            <Rapprochement rapprochement={data.items[currentRapprochementIndex]} />
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button size="sm" variant="outline" onClick={handlePrevious} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>
          <div className="text-xs text-muted-foreground">
            Affichage {currentPage} - {data?.total_pages || 1}
          </div>
          <Button size="sm" variant="outline" onClick={handleNext} disabled={currentPage === (data?.total_pages || 1)}>
            Suivant
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
