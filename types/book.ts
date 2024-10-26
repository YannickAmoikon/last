export interface Book {
  id: string;
  libelle: string;
  date_ecriture: string;
  debit: number;
  credit: number;
  compte: string;
  commentaire?: string;
  cpte_gen: string;
}
