// types/rapprochements.ts

export interface Bank {
    id: string;
    nom: string;
  }
  
  export interface Link {
    user_id: string;
    banque_id: string;
    date: string;
    statut: string;
    id: string;
    etape_actuelle: string;
    commentaire: string;
    temps_traitement: string;
    banque: Bank;
  }
  
  export interface LinksResponse {
	total_items: number;
    items: Link[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  }
  
  export type GetLinksParams = {
    page?: number;
    page_size?: number;
  };
  
  export type CreateLinkRequest = {
    banque_id: number;
    compte_id: number;
    date: string;
    releve_bancaire: File;
    grand_livre: File;
    balance: File;
    edr: File;
  };
  
  export interface MatchResponse {
    items: Match[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    total_ligne: number;
    total_match: number;
  }
  
  export interface Match {
    rapprochement_id: number;
    date_operation: string;
    numero_compte: string;
    description: string;
    reference: string;
    date_valeur: string;
    devise: string;
    debit: number | null;
    credit: number | null;
    solde_courant: number;
    banque: string;
    id: string;
    lignes_rapprochement: LineLink[];
  }
  
  export interface Book {
    id: string;
    rapprochement_id: number;
    numero_piece: string;
    date_ecriture: string;
    libelle: string;
    debit: number | null;
    credit: number | null;
    cpte_alt: number;
    exercice: string | null;
    compte: string | null;
    cpte_gen: string | null;
  }
  
  export interface LineLink {
    id: number;
    statut: string;
    type_match: string;
    commentaire: string;
    decision: string;
    ecart: number | null;
    grands_livres: Book[];
  }