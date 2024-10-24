export interface Compte {
	id: number;
	numero_compte: string;
	description: string;
}

export interface Banque {
	id: number;
	nom: string;
	comptes: Compte[];
}
