import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RapprochementRow } from '@/components/rapprochement/RapprochementRow';
import { Rapprochement } from '@/types/rapprochements';

interface RapprochementTableProps {
  rapprochements: Rapprochement[];
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
  triggerRefresh: (action: string) => void;
}

export const RapprochementTable: React.FC<RapprochementTableProps> = ({
  rapprochements,
  onDelete,
  formatDate,
  triggerRefresh,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/12 text-left">ID</TableHead>
          <TableHead className="w-2/12 text-center">Date</TableHead>
          <TableHead className="w-2/12 text-center">Banque</TableHead>
          <TableHead className="w-2/12 text-center">Statut</TableHead>
          <TableHead className="w-2/12 text-center">Étape actuelle</TableHead>
          <TableHead className="w-2/12 text-center">Temps de traitement</TableHead>
          <TableHead className="w-2/12 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rapprochements.map((rapprochement) => (
          <RapprochementRow
            key={rapprochement.id}
            rapprochement={rapprochement}
            onDelete={onDelete}
            formatDate={formatDate}
            triggerRefresh={triggerRefresh}
          />
        ))}
      </TableBody>
    </Table>
  );
};
