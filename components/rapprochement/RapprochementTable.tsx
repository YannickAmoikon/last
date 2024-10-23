import React, { useMemo } from 'react';
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
}) => {
  const sortedRapprochements = useMemo(() => {
    return [...rapprochements].sort((a, b) => {
      // Trier par ID (supposé être numérique)
      if (a.id !== b.id) {
        return Number(a.id) - Number(b.id);
      }
      // Si les IDs sont identiques, trier par date
      if (a.date !== b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      // Si les dates sont identiques, trier par nom de banque
      return a.banque.nom.localeCompare(b.banque.nom);
    });
  }, [rapprochements]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Banque</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Étape actuelle</TableHead>
          <TableHead>Temps de traitement</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRapprochements.map((rapprochement) => (
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
};
