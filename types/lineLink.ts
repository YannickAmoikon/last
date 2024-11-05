import { Book } from "./book";

export interface LineLink {
  id: number;
  statut: string;
  type_match: string;
  commentaire: string;
  decision: string;
  ecart: number | null;
  grands_livres: Book[];
}
