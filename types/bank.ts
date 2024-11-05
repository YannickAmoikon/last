export interface Account {
	id: number;
	numero_compte: string;
	description: string;
}

export interface Bank {
	id: string;
	nom: string;
	comptes: Account[];
}
