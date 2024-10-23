import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DetailButton } from './DetailButton';

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
      const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
      if (!isNaN(numValue)) {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(numValue);
      }
    }
    
    return String(value);
  };

  const renderDetails = (title: string, data: any, keys: { key: string, label: string, isAmount?: boolean, isDate?: boolean }[]) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="grid gap-2">
        {keys.map(({ key, label, isAmount, isDate }) => (
          <div key={key} className="grid grid-cols-2 gap-2">
            <span className="text-sm font-medium text-gray-600">{label}:</span>
            <span className="text-sm">{formatValue(data[key], isAmount, isDate)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const ligneRapprochementKeys = [
    { key: 'id', label: 'ID' },
    { key: 'statut', label: 'Statut' },
    { key: 'type_match', label: 'Type de Match' },
    { key: 'commentaire', label: 'Commentaire' },
    { key: 'decision', label: 'Décision' },
    { key: 'flag', label: 'Flag' }
  ];

  const grandLivreKeys = [
    { key: 'id', label: 'ID' },
    { key: 'numero_piece', label: 'Numéro de Pièce' },
    { key: 'date_ecriture', label: 'Date Écriture', isDate: true },
    { key: 'libelle', label: 'Libellé' },
    { key: 'debit', label: 'Débit', isAmount: true },
    { key: 'credit', label: 'Crédit', isAmount: true },
    { key: 'cpte_alt', label: 'Compte Alternatif', isAmount: true },
    { key: 'exercice', label: 'Exercice' },
    { key: 'compte', label: 'Compte' },
    { key: 'cpte_gen', label: 'Compte Général' }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DetailButton onClick={() => {}} />
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-blue-50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {renderDetails("Informations de la ligne rapprochement", entity, ligneRapprochementKeys)}
          {renderDetails("Détails du Grand Livre", entity.grand_livre, grandLivreKeys)}
        </div>
      </DialogContent>
    </Dialog>
  );
};