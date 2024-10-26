import { Book } from "./book";

export interface LineLink {
    id: number;
    rapprochement_id: number;
    statut: string;
    type_match: string;
    commentaire: string;
    decision: string;
    flag: string;
    grand_livre: Book;
  }
