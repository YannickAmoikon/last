export interface Account {
	id: number;
	numero_compte: string;
	description: string;
}

export interface BankWithAccounts {
	id: number;
	nom: string;
	comptes: Account[];
}

export interface Bank {
	id: number;
	nom: string;
}