import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Loader2, RefreshCcw, FileSpreadsheet, Ellipsis, ThumbsUp, Unlink, LocateOff } from 'lucide-react';
import { useGetRapprochementLignesQuery, useGetRapprochementRapportQuery } from '@/lib/services/rapprochementsApi';
import { useDematcherLigneMutation } from '@/lib/services/lignesRapprochementsApi';
import { toast} from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from './StatCard';
import { Rapprochement } from './Rapprochement';
import { HistoriqueRapprochement } from './HistoriqueRapprochement';
import { getExportFileName, ExportType } from '@/utils/exportHelpers';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';

const tabs = [
  {label: "Matchs en attente", value: "rapprochements"},
  {label: "Historique des matchs", value: "history"},
]

export const RapprochementDetails = ({ rapprochementId }: { rapprochementId: number }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState(() => {
    return localStorage.getItem(`currentTab_${rapprochementId}`) || "rapprochements";
  });
  const [totalNonRapproche, setTotalNonRapproche] = useState<number>(0);
  const pageSize = 50;
  const [exportType, setExportType] = useState<ExportType>(null);
  const [dematcherLigne] = useDematcherLigneMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const { 
    data: rapprochementData, 
    error: rapprochementError, 
    isLoading: rapprochementLoading,
    refetch: refetchRapprochement
  } = useGetRapprochementLignesQuery({
    statut: "Pas_rapproche",
    rapprochement_id: rapprochementId,
    page: currentPage,
    page_size: pageSize
  });

  const { 
    data: historyData, 
    error: historyError, 
    isLoading: historyLoading,
    refetch: refetchHistory
  } = useGetRapprochementLignesQuery({
    statut: "Rapprochement_Match",
    rapprochement_id: rapprochementId,
    page: currentPage,
    page_size: pageSize
  });

  const { data: rapportData, isFetching: isExporting, error: rapportError } = useGetRapprochementRapportQuery(
    { rapprochement_id: rapprochementId, statut: exportType || '' },
    { skip: !exportType }
  );

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    const totalPages = currentTab === "rapprochements" 
      ? rapprochementData?.total_pages 
      : historyData?.total_pages;
    setCurrentPage(prev => Math.min(totalPages || 1, prev + 1));
  };

  const handleExportClick = (type: ExportType) => {
    setExportType(type);
  };

  useEffect(() => {
    if (rapportData && exportType) {
      const fileName = getExportFileName(exportType);
      saveAs(rapportData, fileName);
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


  const handleDematch = async (rapprochementId: string, ligneId: number) => {
    try {
      await dematcherLigne({ rapprochement_id: parseInt(rapprochementId), ligne_id: ligneId }).unwrap();
      toast({
        title: "Dématchage réussi",
        description: "L'élément a été dématché avec succès.",
        className: "bg-green-600 text-white",
      });
      // Rafraîchir toutes les données après le dématchage
      refetchRapprochement();
      refetchHistory();
    } catch (error) {
      console.error("Erreur lors du dématchage:", error);
      toast({
        title: "Erreur de dématchage",
        description: "Une erreur est survenue lors du dématchage de l'élément.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filterData = (data: any[]) => {
    if (!searchTerm) return data;
    return data.filter((item) => 
      Object.entries(item).some(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value).toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      })
    );
  };

  useEffect(() => {
    if (currentTab === "rapprochements" && rapprochementData?.items) {
      setFilteredData(filterData(rapprochementData.items));
    } else if (currentTab === "history" && historyData?.items) {
      setFilteredData(filterData(historyData.items));
    }
  }, [currentTab, rapprochementData, historyData, searchTerm]);

  const renderContent = () => {
    const isLoading = currentTab === "rapprochements" ? rapprochementLoading : historyLoading;
    const error = currentTab === "rapprochements" ? rapprochementError : historyError;

    if (isLoading) {
      return (
        <div className="flex-1 flex min-h-screen mt-60">
          <div className="relative flex-1 h-full w-full bg-gray-200 animate-pulse">
            <Loader2 className="absolute inset-0 m-auto h-12 w-12 text-gray-900 animate-spin" />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center min-h-screen flex-1 bg-gray-50">
          <div className="text-center mt-40">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-2 text-lg font-semibold text-gray-900">Erreur de chargement</h2>
            <p className="mt-2 text-sm text-gray-500">Impossible de charger les matchs demandés. Veuillez réessayer.</p>
            <div className="mt-6">
              <Button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
              >
                <RefreshCcw className="mr-1" size={14} />
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (filteredData.length === 0 && searchTerm) {
      return (
        <div className="flex flex-col h-[300px] items-center  mt-40 text-center">
          <div className="rounded-full bg-gray-100 p-3 mb-4">
            <LocateOff className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun résultat trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez d'ajuster votre recherche pour voir vos résultats.
          </p>
        </div>
      );
    }

    if (currentTab === "rapprochements") {
      return (
        <>
          {filteredData.map((rapprochement, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <Rapprochement rapprochement={rapprochement} />
            </div>
          ))}
        </>
      );
    } else {
      return <HistoriqueRapprochement items={filteredData} onDematch={handleDematch} />;
    }
  };

  useEffect(() => {
    // Sauvegarder l'onglet actuel dans le localStorage
    localStorage.setItem(`currentTab_${rapprochementId}`, currentTab);
  }, [currentTab, rapprochementId]);

  useEffect(() => {
    if (rapprochementData) {
      setTotalNonRapproche(rapprochementData.total);
    }
  }, [rapprochementData]);

  return (
    <main className="flex flex-1 h-full">
      <Toaster />
      <Card className="flex-1 rounded-none shadow-none border-0">
        <CardHeader className="border-b flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle className="uppercase">Détails du Rapprochement #{rapprochementId}</CardTitle>
            <CardDescription>
              Informations générales et statistiques
            </CardDescription>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="secondary" className="border rounded-sm" disabled={isExporting}>
                  {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ellipsis size={14} />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[230px]">
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleExportClick('Pas_rapproche')} disabled={isExporting}>
                  <FileSpreadsheet className="mr-1 h-4 w-4" />
                  <span>Matchs en attente</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleExportClick('Rapprochement_Match')} disabled={isExporting}>
                  <FileSpreadsheet className="mr-1 h-4 w-4" />
                  <span>Matchs terminés</span>
                </DropdownMenuItem>
                <Separator className="my-1"/>
                <DropdownMenuItem className="bg-green-600 text-white cursor-pointer hover:bg-green-600 hover:text-white focus:bg-green-600 focus:text-white">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  <span>Clôturer rapprochement</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-4 gap-4">
            <StatCard title="Total de lignes" value={rapprochementData?.total_ligne.toString() || "0"} />
            <StatCard title="Total de matchs" value={rapprochementData?.total_match.toString() || "0"} />
            <StatCard title="Total en attente de validation" value={totalNonRapproche.toString()} />
            <StatCard 
              title="Taux de progression" 
              value={`${(((rapprochementData?.total_match || 0) / (rapprochementData?.total_ligne || 1)) * 100).toFixed(1)} %`}
            />
          </div>
          
          <Tabs 
            value={currentTab} 
            className="w-full mt-6" 
            onValueChange={(value) => {
              setCurrentTab(value);
              setCurrentPage(1);
              setSearchTerm('');
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList className="space-x-2 w-1/2 flex items-center rounded-sm justify-start py-5 border-b border-gray-200">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.value}
                    className="rounded-sm uppercase w-6/12 py-1.5 px-4 text-xs font-normal transition-colors duration-200 border border-transparent hover:border-gray-300 data-[state=active]:border-gray-300 data-[state=active]:text-gray-800" 
                    value={tab.value}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Input 
                className="rounded-sm w-96 outline-none duration-500 focus:outline-none focus:ring-0 focus:border-transparent" 
                type="text" 
                placeholder="Rechercher..." 
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <TabsContent className="space-y-2" value="rapprochements">
              {renderContent()}
            </TabsContent>
            <TabsContent className="space-y-2" value="history">
              {renderContent()}
            </TabsContent>
          </Tabs>
          
          {/* Pagination */}
          <div className="flex justify-between mt-4 items-center">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handlePrevious} 
              disabled={currentPage === 1} 
              className="text-gray-600 border-gray-300 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>
            <div className="text-xs text-gray-600">
              Affichage {currentPage} sur {(currentTab === "rapprochements" ? rapprochementData : historyData)?.total_pages || 1}
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleNext} 
              disabled={currentPage === ((currentTab === "rapprochements" ? rapprochementData : historyData)?.total_pages || 1)} 
              className="text-gray-600 border-gray-300 hover:bg-gray-100"
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};
