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
import Link from "next/link";
import { Link as LinkType } from "@/types/link";
import { StatusBadge } from "@/components/link/StatusBadge";
import { convertirTempsTraitement } from "@/utils/timeUtils";

interface LinkRowProps {
	link: LinkType;
	onDelete: (id: string) => void;
	formatDate: (date: string) => string;
	triggerRefresh: (action: string) => void;
}

export const LinkRow: React.FC<LinkRowProps> = ({
	link,
	onDelete,
	formatDate,
	triggerRefresh,
}) => {
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);

	const handleDelete = () => {
		onDelete(link.id);
		triggerRefresh('delete');
	};
	return (
		<TableRow>
			<TableCell className="w-1/12 text-left">{link.id}</TableCell>
			<TableCell className="w-2/12 text-center">
					{formatDate(link.date)}
			</TableCell>
			<TableCell className="w-2/12 text-center">
					{link.banque.nom}
			</TableCell>
			<TableCell className="w-2/12 text-center">
					<StatusBadge status={link.statut} />
			</TableCell>
			<TableCell className="w-2/12 text-center">{link.etape_actuelle}</TableCell>
			<TableCell className="w-2/12 text-center">
					{convertirTempsTraitement(Number(link.temps_traitement))}
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
											<Link href={`/dashboard/links/${link.id}?status=${link.statut}`}>
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
															handleDelete();
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
