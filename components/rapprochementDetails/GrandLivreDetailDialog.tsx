import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DetailButton } from './DetailButton';
import { formatMontant } from "@/utils/formatters";

export const GrandLivreDetailDialog = ({ title, entity }: { title: string, entity: any }) => {
  const formatValue = (value: any, isAmount: boolean = false, isDate: boolean = false) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Oui" : "Non";
    
    if (isDate) {
      const date = new Date(value);
      return date.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
    
    if (isAmount) {
      return formatMontant(value);
    }
    
    return String(value);
  };

  const renderGrandLivreDetails = (grandLivre: any) => {
    if (!grandLivre) return null;

    const grandLivreKeys = [
      { key: 'id', label: 'ID' },
      { key: 'rapprochement_id', label: 'ID Rapprochement' },
      { key: 'numero_piece', label: 'Numéro de Pièce' },
      { key: 'date_ecriture', label: 'Date Écriture', isDate: true },
      { key: 'libelle', label: 'Libellé' },
      { key: 'debit', label: 'Débit', isAmount: true },
      { key: 'credit', label: 'Crédit', isAmount: true },
      { key: 'cpte_alt', label: 'Compte Alternatif' },
      { key: 'exercice', label: 'Exercice' },
      { key: 'compte', label: 'Compte' },
      { key: 'cpte_gen', label: 'Compte Général' },
    ];

    return (
      <div className="grid gap-2">
        {grandLivreKeys.map(({ key, label, isAmount, isDate }) => (
          <div key={key} className="grid grid-cols-3 gap-2 items-center">
            <span className="text-sm font-medium text-gray-600">{label}:</span>
            <span className="col-span-2 text-sm">{formatValue(grandLivre[key], isAmount, isDate)}</span>
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
      <DialogContent className="sm:max-w-[600px] bg-blue-50 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {entity ? renderGrandLivreDetails(entity) : <p>Aucune donnée disponible</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};
