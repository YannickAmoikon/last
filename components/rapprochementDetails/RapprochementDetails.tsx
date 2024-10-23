import React, { useState, useCallback, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Loader2, Filter, ListFilter, RefreshCcw, FileDown, FileSpreadsheet } from 'lucide-react';
import { useGetRapprochementLignesQuery, useGetRapprochementRapportQuery } from '@/lib/services/rapprochementsApi';
import { toast, useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from './StatCard';
import { Rapprochement } from './Rapprochement';
import { getExportFileName, ExportType } from '@/utils/exportHelpers';

export const RapprochementDetails = ({ rapprochementId }: { rapprochementId: number }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [exportType, setExportType] = useState<ExportType>(null);

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
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(data?.total_pages || 1, prev + 1));
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
          <p className="mt-2 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center flex-1 h-full bg-gray-50">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-2 text-lg font-semibold text-gray-900">Erreur de chargement</h2>
          <p className="mt-2 text-sm text-gray-500">Impossible de charger les détails du rapprochement. Veuillez réessayer.</p>
          <div className="mt-6">
            <Button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
            >
              <RefreshCcw className="mr-1" size={14} />
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full">
      <Toaster />
      <Card className="flex-1 rounded-sm shadow-none border-0">
        <CardHeader className="border-b border-gray-200 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">Détails du Rapprochement #{rapprochementId}</CardTitle>
            <CardDescription className="text-gray-600">Informations générales et statistiques</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary" className="ml-auto border rounded-sm">
                <ListFilter className="mr-1" size={14} />
                Filtrer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => handleStatusFilter(null)}>
                <Filter className="mr-2 h-4 w-4" />
                <span>Tous les statuts</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("Non rapproché")}>
                <Filter className="mr-2 h-4 w-4" />
                <span>Non rapproché</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("Rapprochement total")}>
                <Filter className="mr-2 h-4 w-4" />
                <span>Rapprochement match</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary" className="ml-2 border rounded-sm" disabled={isExporting}>
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
                <span>Rapprochement match</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-4 gap-4">
            <StatCard title="Total de lignes" value={data?.total_ligne.toString() || "0"} />
            <StatCard title="Total de matchs" value={data?.total_match.toString() || "0"} />
            <StatCard title="Total en attente de validation" value={data?.total.toString() || "0"} />
            <StatCard 
              title="Taux de progression" 
              //@ts-ignore
              value={`${(((data?.total_ligne - data?.total) / data?.total_ligne) * 100).toFixed(1)}%`}
            />
          </div>
          
          <Tabs defaultValue="rapprochements" className="w-full mt-6">
            <TabsList className="w-full space-x-2 flex items-center rounded-sm justify-start py-5 border-b border-gray-200">
              <TabsTrigger 
                className="rounded-sm uppercase w-1/6 py-1.5 px-4 text-xs font-normal transition-colors duration-200 border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-gray-500 data-[state=active]:text-gray-800" 
                value="rapprochements"
              >
                Rapprochements
              </TabsTrigger>
              <TabsTrigger 
                className="rounded-sm uppercase w-1/6 py-1.5 px-4 text-xs font-normal transition-colors duration-200 border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-gray-500 data-[state=active]:text-gray-800" 
                value="tab1"
              >
                Onglet 1
              </TabsTrigger>
              <TabsTrigger 
                className="rounded-sm uppercase w-1/6 py-1.5 px-4 text-xs font-normal transition-colors duration-200 border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-gray-500 data-[state=active]:text-gray-800" 
                value="tab2"
              >
                Onglet 2
              </TabsTrigger>
              <TabsTrigger 
                className="rounded-sm uppercase w-1/6 py-1.5 px-4 text-xs font-normal transition-colors duration-200 border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-gray-500 data-[state=active]:text-gray-800" 
                value="tab3"
              >
                Onglet 3
              </TabsTrigger>
            </TabsList>
            <TabsContent className="space-y-2" value="rapprochements">
              {data?.items.map((rapprochement, idx) => (
                <Rapprochement rapprochement={rapprochement} key={idx} />
              ))}
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
                  Page {currentPage} sur {data?.total_pages || 1}
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleNext} 
                  disabled={currentPage === (data?.total_pages || 1)} 
                  className="text-gray-600 border-gray-300 hover:bg-gray-100"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="tab1">
              {/* Contenu pour l'onglet 1 */}
            </TabsContent>
            <TabsContent value="tab2">
              {/* Contenu pour l'onglet 2 */}
            </TabsContent>
            <TabsContent value="tab3">
              {/* Contenu pour l'onglet 3 */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
