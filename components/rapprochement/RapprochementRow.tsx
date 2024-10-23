import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2Icon, ListCollapse, CheckIcon, X } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Rapprochement } from "@/types/rapprochements";
import { StatusBadge } from "./StatusBadge";
import { convertirTempsTraitement } from "@/utils/timeUtils";

interface RapprochementRowProps {
	rapprochement: Rapprochement;
	onDelete: (id: string) => void;
	formatDate: (date: string) => string;
}

export const RapprochementRow: React.FC<RapprochementRowProps> = ({
	rapprochement,
	onDelete,
	formatDate,
}) => {
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);

	return (
		<TableRow>
			<TableCell className="w-1/12 text-left">{rapprochement.id}</TableCell>
			<TableCell className="w-2/12 text-center">
				{formatDate(rapprochement.date)}
			</TableCell>
			<TableCell className="w-2/12 text-center">
				{rapprochement.banque.nom}
			</TableCell>
			<TableCell className="w-2/12 text-center">
				<StatusBadge status={rapprochement.statut} />
			</TableCell>
			<TableCell className="w-2/12 text-center">{rapprochement.etape_actuelle}</TableCell>
			<TableCell className="w-2/12 text-center">
				{convertirTempsTraitement(Number(rapprochement.temps_traitement))}
			</TableCell>
			<TableCell className="w-2/12 text-right">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem asChild>
							<Link href={`/dashboard/rapprochements/${rapprochement.id}`}>
								<ListCollapse className="mr-1" size={14} />
								Details
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() => setIsDialogOpen(true)}
							className="text-red-600"
						>
							<Trash2Icon className="mr-1" size={14} />
							Supprimer
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Confirmation de suppression</DialogTitle>
							<DialogDescription>
								Êtes-vous sûr de vouloir supprimer ce rapprochement ?
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								size="sm"
								variant="outline"
								onClick={() => setIsDialogOpen(false)}
							>
								<X className="mr-1" size={14} />
								Annuler
							</Button>
							<Button
								size="sm"
								className="bg-green-600 hover:bg-green-600 text-white"
								onClick={() => {
									onDelete(rapprochement.id);
									setIsDialogOpen(false);
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
