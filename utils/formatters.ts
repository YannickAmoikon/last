export const formatMontant = (montant: number): string => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'XOF', 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }).format(montant);
  };