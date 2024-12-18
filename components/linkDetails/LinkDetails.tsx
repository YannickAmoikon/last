import React, {useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Loader2, RefreshCcw, FileSpreadsheet, Ellipsis, ThumbsUp, LocateOff, FileX, ArrowLeft, BookCheck, LibraryBig, BookCopy, ChartLine } from 'lucide-react';
import { useGetMatchesQuery, useGetLinkRapportQuery, useCloseLinkMutation } from '@/lib/services/linkApi';
import { toast} from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from './StatCard';
import { PendingMatches } from './PendingMatches';
import { MatchesFinished } from './MatchesFinished';
import { getExportFileName, ExportType } from '@/utils/exportHelpers';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { useRefresh } from '@/components/contexts/RefreshContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

const tabs = [
  {label: "Matchs en attente", value: "waiting"},
  {label: "Matchs terminés", value: "finished"},
]

interface LinkDetailsProps {
  linkId: number;
  linkStatus: string;
}

export const LinkDetails = ({ linkId, linkStatus }: LinkDetailsProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState(() => localStorage.getItem(`currentTab_${linkId}`) || "waiting");
  const [totalUnmatched, setTotalUnmatched] = useState<number>(0);
  const [exportType, setExportType] = useState<ExportType>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isClosing, setIsClosing] = useState(false);
  const { triggerRefresh } = useRefresh();
  const pageSize = 25;
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [closeLink] = useCloseLinkMutation();

  const { data: linkData, error: linkError, isLoading: linkLoading, refetch: refetchLink } = useGetMatchesQuery({
    statut: "Pas_rapproche",
    rapprochement_id: linkId,
    page: currentPage,
    page_size: pageSize
  });


  const { data: historyData, error: historyError, isLoading: historyLoading, refetch: refetchHistory } = useGetMatchesQuery({
    statut: "Rapprochement_Match",
    rapprochement_id: linkId,
    page: currentPage,
    page_size: pageSize
  });

  const { data: rapportData, isFetching: isExporting, error: rapportError } = useGetLinkRapportQuery(
    { rapprochement_id: linkId, statut: exportType || '' },
    { skip: !exportType }
  );

  useEffect(() => {
    if (rapportData && exportType) {
      saveAs(rapportData, getExportFileName(exportType));
      setExportType(null);
      toast({ title: "Export réussi", description: `Le rapport a été téléchargé avec succès.`, className: "bg-green-600 text-white" });
    }
  }, [rapportData, exportType]);

  useEffect(() => {
    if (rapportError) {
      console.error("Erreur lors du chargement du rapport:", rapportError);
      toast({ title: "Erreur d'export", description: "Une erreur est survenue lors de l'export des données.", variant: "destructive" });
    }
  }, [rapportError]);

  const handleClose = async () => {
    if (isClotured) {
      toast({
        title: "Rapprochement déjà clôturé",
        description: "Ce rapprochement a déjà été clôturé.",
        variant: "default",
      });
      return;
    }
    setIsClosing(true);
    try {
      await closeLink({ rapprochement_id: linkId }).unwrap();
      setIsClotured(true);
      toast({
        title: "Rapprochement clôturé",
        description: "Le rapprochement a été clôturé avec succès.",
        className: "bg-green-600 text-white",
      });
      triggerRefresh('cloture');
    } catch (error) {
      console.error("Erreur lors de la clôture", error);
      toast({
        title: "Erreur de clôture",
        description: "Une erreur est survenue lors de la clôture du rapprochement.",
        variant: "destructive",
      });
    } finally {
      setIsClosing(false);
      setIsConfirmDialogOpen(false);
    }
  };

  const filterData = (data: any[]) => {
    if (!searchTerm) return data;
    return data.filter((item) => 
      Object.entries(item).some(([key, value]) => 
        (typeof value === 'string' || typeof value === 'number') && 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  useEffect(() => {
    const data = currentTab === "waiting" ? linkData?.items : historyData?.items;
    if (data) setFilteredData(filterData(data));
  }, [currentTab, linkData, historyData, searchTerm]);

  useEffect(() => {
    localStorage.setItem(`currentTab_${linkId}`, currentTab);
  }, [currentTab, linkId]);

  useEffect(() => {
    if (linkData) {
      setTotalUnmatched(linkData.total);
    }
  }, [linkData]);

  useEffect(() => {
    setIsClotured(linkStatus === "Clôturé");
  }, [linkStatus]);

  const renderContent = () => {
    const isLoading = currentTab === "waiting" ? linkLoading : historyLoading;
    const error = currentTab === "waiting" ? linkError : historyError;
    const data = currentTab === "waiting" ? linkData : historyData;

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

    if (!data || data.total === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] text-center">
          <div className="bg-gray-100 rounded-full p-3 mb-4">
            <FileX className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">Aucune donnée disponible</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-md">
            Ce rapprochement ne contient actuellement aucune donnée. 
            Veuillez ajouter des éléments ou vérifier les paramètres du rapprochement.
          </p>
        </div>
      );
    }

    if (filteredData.length === 0 && searchTerm) {
      return (
        <div className="flex flex-col h-[300px] items-center mt-40 text-center">
          <div className="rounded-full bg-gray-100 p-3 mb-4">
            <LocateOff className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun résultat trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez d'ajuster votre recherche pour voir vos résultats.
          </p>
        </div>
      );
    }

    if (currentTab === "waiting") {
      return (
        <PendingMatches 
          matchesPending={filteredData}
          onMatchSuccess={() => {
            refetchLink();
            refetchHistory();
          }}
        />
      );
    } else {
      return (
        <MatchesFinished 
          matchesFinished={filteredData} 
          isClotured={isClotured}
        />
      );
    }
  };

  const [isClotured, setIsClotured] = useState(linkStatus === "Clôturé");

  function onBack() {
    router.back();
  }

  return (
    <main className="flex flex-1 h-full">
      <Toaster />
      <Card className="flex-1 rounded-none shadow-none border-0">
        <CardHeader className="border-b flex flex-row items-center justify-between">
          <div className="flex flex-col space-y-1.5">
            <CardTitle className="uppercase">Détails du Rapprochement #{linkId}</CardTitle>
            <CardDescription>Informations générales et statistiques</CardDescription>
          </div>
         <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary" className="border rounded-sm" disabled={isExporting || isClosing}>
                {isExporting || isClosing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ellipsis size={14} />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[230px]">
              <DropdownMenuItem onClick={() => setExportType('Pas_rapproche')} disabled={isExporting || isClosing}>
                <FileSpreadsheet className="mr-1 h-4 w-4" />
                <span>Matchs en attente</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setExportType('Rapprochement_Match')} disabled={isExporting || isClosing}>
                <FileSpreadsheet className="mr-1 h-4 w-4" />
                <span>Matchs terminés</span>
              </DropdownMenuItem>
              <Separator className="my-1"/>
              <DropdownMenuItem 
                onClick={() => setIsConfirmDialogOpen(true)} 
                className={`cursor-pointer ${isClotured ? 'bg-gray-400 text-white' : 'bg-green-600 text-white hover:bg-green-600 hover:text-white focus:bg-green-600 focus:text-white'}`}
                disabled={isExporting || isClosing || isClotured}
              >
                <ThumbsUp className="mr-1 h-4 w-4" />
                <span>{isClotured ? "Rapprochement clôturé" : "Clôturer rapprochement"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => {onBack()}} size="sm" variant="outline" className="border rounded-sm">
            <ArrowLeft className="mr-1" size={14} />
              Retour
            </Button>
          </div> 
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-4 gap-2">
            <StatCard 
              title="Total de lignes" 
              value={linkData?.total_ligne?.toString() || "0"} 
              icon={<LibraryBig size={24} />} 
            />
            <StatCard 
              title="Total en attente de validation" 
              value={totalUnmatched.toString()} 
              icon={<BookCopy size={24} />} 
            />
            <StatCard 
              title="Total de matchs terminés" 
              value={linkData?.total_match?.toString() || "0"} 
              icon={<BookCheck size={24} />} 
            />
            <StatCard 
              title="Taux de progression"
              value={`${(((linkData?.total_match || 0) / (linkData?.total_ligne || 1)) * 100).toFixed(1)} %`} 
              icon={<ChartLine size={24} />}
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
                className="rounded-sm w-[410px] outline-none duration-500 focus:outline-none focus:ring-0 focus:border-transparent" 
                type="text" 
                placeholder="Faire une recherche..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <TabsContent className="space-y-2" value="waiting">
              {renderContent()}
            </TabsContent>
            <TabsContent className="space-y-2" value="finished">
              {renderContent()}
            </TabsContent>
          </Tabs>
          
          {/* Pagination */}
          <div className="flex justify-between mt-4 items-center">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
              disabled={currentPage === 1} 
              className="text-gray-600 rounded-sm border-gray-300 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>
            <div className="text-xs text-gray-600">
              Page {currentPage} sur {(currentTab === "waiting" ? linkData : historyData)?.total_pages || 1}
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setCurrentPage(prev => Math.min((currentTab === "waiting" ? linkData : historyData)?.total_pages || 1, prev + 1))} 
              disabled={currentPage === ((currentTab === "waiting" ? linkData : historyData)?.total_pages || 1)} 
              className="text-gray-600 rounded-sm border-gray-300 hover:bg-gray-100"
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Clôturer le rapprochement</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-600">
            Êtes-vous sûr de vouloir clôturer le rapprochement <span className="font-medium text-blue-600">#{linkId}</span> ?
          </DialogDescription>
          <div className="flex justify-end space-x-2 mt-4">
            <Button size="sm" className="rounded-sm" variant="outline" onClick={() => setIsConfirmDialogOpen(false)} disabled={isClosing}>
              <X className="mr-1 rounded-sm" size={14} />
              Annuler
            </Button>
            <Button size="sm" className="bg-green-600 rounded-sm hover:bg-green-600 text-white" onClick={handleClose} disabled={isClosing}>
              {isClosing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              <Check className="mr-1" size={14} />
              Oui
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};
