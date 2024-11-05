import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DetailButton } from './DetailButton';
import { LineLink } from '@/types/lineLink';
import { Book } from "@/types/book";

interface LineLinkDetailDialogProps {
  title: string;
  entity: LineLink;
}

export const LineLinkDetailDialog = ({ title, entity }: LineLinkDetailDialogProps) => {
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
            <span className="text-sm">{formatValue(data?.[key], isAmount, isDate)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const lineLinkKeys = [
    { key: 'id', label: 'ID' },
    { key: 'statut', label: 'Statut' },
    { key: 'type_match', label: 'Type de Match' },
    { key: 'commentaire', label: 'Commentaire' },
    { key: 'decision', label: 'Décision' },
    { key: 'ecart', label: 'Écart', isAmount: true }
  ];

  const bookKeys = [
    { key: 'id', label: 'ID' },
    { key: 'numero_piece', label: 'Numéro de Pièce' },
    { key: 'date_ecriture', label: 'Date Écriture', isDate: true },
    { key: 'libelle', label: 'Libellé' },
    { key: 'debit', label: 'Débit', isAmount: true },
    { key: 'credit', label: 'Crédit', isAmount: true },
    { key: 'cpte_alt', label: 'Compte Alternatif' },
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
          {renderDetails("Informations de la ligne rapprochement", entity, lineLinkKeys)}
          
          {/* Affichage des grands livres */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Détails des Grands Livres</h3>
            {entity.grands_livres.map((book, index) => (
              <div key={book.id} className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-md font-medium mb-2">
                  Grand Livre #{index + 1}
                </h4>
                <div className="grid gap-2">
                  {bookKeys.map(({ key, label, isAmount, isDate }) => (
                    <div key={key} className="grid grid-cols-2 gap-2">
                      <span className="text-sm font-medium text-gray-600">{label}:</span>
                      <span className="text-sm">{formatValue(book[key as keyof Book], isAmount, isDate)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};