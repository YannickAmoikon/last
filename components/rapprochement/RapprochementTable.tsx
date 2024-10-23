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
