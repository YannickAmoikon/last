import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2Icon, ListCollapse } from 'lucide-react';
import Link from 'next/link';
import { Rapprochement } from '@/types/rapprochements';
import { StatusBadge } from './StatusBadge';
import { convertirTempsTraitement } from '@/utils/timeUtils';

interface RapprochementRowProps {
  rapprochement: Rapprochement;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

export const RapprochementRow: React.FC<RapprochementRowProps> = ({
  rapprochement,
  onDelete,
  formatDate,
}) => (
  <TableRow>
    <TableCell className="w-1/12 text-left">{rapprochement.id}</TableCell>
    <TableCell className="w-2/12 text-center">{formatDate(rapprochement.date)}</TableCell>
    <TableCell className="w-2/12 text-center">{rapprochement.banque.nom}</TableCell>
    <TableCell className="w-2/12 text-center">
      <StatusBadge status={rapprochement.statut} />
    </TableCell>
    <TableCell className="w-2/12">{rapprochement.etape_actuelle}</TableCell>
    <TableCell className="w-2/12 text-center">{convertirTempsTraitement(Number(rapprochement.temps_traitement))}</TableCell>
    <TableCell className="w-2/12 text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4"/>
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
            className="text-red-600"
            onClick={() => onDelete(rapprochement.id)}
          >
            <Trash2Icon className="mr-2 h-4 w-4"/>
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  </TableRow>
);
