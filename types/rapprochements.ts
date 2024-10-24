// types/rapprochements.ts

export interface Banque {
    id: string;
    nom: string;
  }
  
  export interface Rapprochement {
    user_id: string;
    banque_id: string;
    date: string;
    statut: string;
    id: string;
    etape_actuelle: string;
    commentaire: string;
    temps_traitement: string;
    banque: Banque;
  }
  
  export interface RapprochementsResponse {
	total_items: number;
    items: Rapprochement[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  }
  
  export type GetRapprochementsParams = {
    page?: number;
    page_size?: number;
  };
  
  export type CreateRapprochementRequest = {
    banque_id: number;
    compte_id: number;
    date: string;
    releve_bancaire: File;
    grand_livre: File;
    balance: File;
    edr: File;
  };
  
  export interface RapprochementLignesResponse {
    items: RapprochementLigne[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    total_ligne: number;
    total_match: number;
  }
  
  export interface RapprochementLigne {
    rapprochement_id: number;
    date_operation: string;
    numero_compte: string;
    description: string;
    reference: string;
    date_valeur: string;
    devise: string;
    debit: number;
    credit: number;
    solde_courant: number;
    id: string;
    lignes_rapprochement: LigneRapprochement[];
  }
  
  export interface GrandLivre {
    rapprochement_id: number;
    numero_piece: string;
    date_ecriture: string;
    libelle: string;
    debit: number;
    credit: number;
    cpte_alt: string;
    exercice: string;
    compte: string;
    cpte_gen: string;
    id: string;
  }
  
  export interface LigneRapprochement {
    id: number;
    rapprochement_id: number;
    statut: string;
    type_match: string;
    commentaire: string;
    decision: string;
    flag: string;
    grand_livre: GrandLivre;
  }