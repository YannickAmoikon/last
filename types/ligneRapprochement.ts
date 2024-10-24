import {GrandLivre} from "./grandLivre"

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