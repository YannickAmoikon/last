import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RapprochementRow } from '@/components/rapprochement/RapprochementRow';
import { Rapprochement } from '@/types/rapprochements';

interface RapprochementTableProps {
  rapprochements: Rapprochement[];
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

export const RapprochementTable: React.FC<RapprochementTableProps> = ({
  rapprochements,
  onDelete,
  formatDate,
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Date</TableHead>
        <TableHead>Banque</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead>Étape actuelle</TableHead>
        <TableHead>Temps de traitement</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {rapprochements.map((rapprochement) => (
        <RapprochementRow
          key={rapprochement.id}
          rapprochement={rapprochement}
          onDelete={onDelete}
          formatDate={formatDate}
        />
      ))}
    </TableBody>
  </Table>
);