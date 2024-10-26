import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DetailButton } from './DetailButton';

export const BankStatementDetailDialog = ({ title, entity }: { title: string, entity: any }) => {
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
        const formattedValue = new Intl.NumberFormat('fr-FR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(numValue);
        return `${formattedValue} F CFA`;
      }
      return `${value} F CFA`;
    }
    
    return String(value);
  };

  const renderBankStatementDetails = (releve: any) => {
    const bankStatementKeys = [
      { key: 'id', label: 'ID' },
      { key: 'date_operation', label: 'Date Opération', isDate: true },
      { key: 'numero_compte', label: 'Numéro de Compte' },
      { key: 'description', label: 'Description' },
      { key: 'reference', label: 'Référence' },
      { key: 'date_valeur', label: 'Date Valeur', isDate: true },
      { key: 'devise', label: 'Devise' },
      { key: 'debit', label: 'Débit', isAmount: true },
      { key: 'credit', label: 'Crédit', isAmount: true },
      { key: 'solde_courant', label: 'Solde Courant', isAmount: true },
    ];

    return (
      <div className="grid gap-2">
        {bankStatementKeys.map(({ key, label, isAmount, isDate }) => (
          <div key={key} className="grid grid-cols-3 gap-2 items-center">
            <span className="text-sm font-medium text-gray-600">{label}:</span>
            <span className="col-span-2 text-sm">{formatValue(releve[key], isAmount, isDate)}</span>
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
      <DialogContent className="sm:max-w-[600px] bg-orange-50 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {renderBankStatementDetails(entity)}
        </div>
      </DialogContent>
    </Dialog>
  );
};