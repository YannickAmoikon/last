export function convertirTempsTraitement(tempsEnSecondes: number): string {
    const heures = Math.floor(tempsEnSecondes / 3600);
    const minutes = Math.floor((tempsEnSecondes % 3600) / 60);
  
    if (heures > 0) {
      return `${heures}h ${minutes} min`;
    } else {
      return `${minutes} min`;
    }
  }