import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2Icon, CheckIcon, X, Pencil } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import { Bank as BankType } from "@/types/bank";
import UpdateBankDialog from "./UpdateBankDialog";

// Schéma de validation
const formSchema = z.object({
	nom: z.string().min(1, { message: "Le nom est requis" }),
});

type FormValues = z.infer<typeof formSchema>;

interface BankRowProps {
	bank: BankType;
	onDelete: (id: string) => void;
	triggerRefresh: (action: string) => void;
}

export const BankRow: React.FC<BankRowProps> = ({ bank, onDelete, triggerRefresh }) => {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
	const { toast } = useToast();

	const handleBankEdited = (success: boolean, message: string) => {
		if (success) {
			triggerRefresh('update');
		}
	};

	const handleDelete = () => {
		onDelete(bank.id.toString());
		triggerRefresh('delete');
	};

	return (
		<TableRow>
			<TableCell className="w-1/12 text-left">{bank.id}</TableCell>
			<TableCell className="w-2/12 text-center">{bank.nom}</TableCell>
			<TableCell className="w-2/12 text-right">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
							<Pencil className="mr-1" size={14} />
							Modifier
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() => setIsDeleteDialogOpen(true)}
							className="text-red-600"
						>
							<Trash2Icon className="mr-1" size={14} />
							Supprimer
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<UpdateBankDialog
					bank={bank}
					open={isEditDialogOpen}
					onOpenChange={setIsEditDialogOpen}
					onBankEdited={handleBankEdited}
				/>

				{/* Dialog de suppression */}
				<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Confirmation de suppression</DialogTitle>
							<DialogDescription>
								Êtes-vous sûr de vouloir supprimer cette banque ?
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								size="sm"
								variant="outline"
								onClick={() => setIsDeleteDialogOpen(false)}
							>
								<X className="mr-1" size={14} />
								Annuler
							</Button>
							<Button
								size="sm"
								className="bg-green-600 hover:bg-green-600 text-white"
								onClick={() => {
									handleDelete();
									setIsDeleteDialogOpen(false);
								}}
							>
								<CheckIcon className="mr-1" size={14} />
								Oui
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</TableCell>
		</TableRow>
	);
};