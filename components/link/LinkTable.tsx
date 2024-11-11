import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LinkRow } from '@/components/link/LinkRow';
import { Link as LinkType } from '@/types/link';

interface LinkTableProps {
  links: LinkType[];
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
  triggerRefresh: (action: string) => void;
}

export const LinkTable: React.FC<LinkTableProps> = ({
  links,
  onDelete,
  formatDate,
  triggerRefresh,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-2/12 text-left">ID</TableHead>
          <TableHead className="w-2/12 text-center">Date</TableHead>
          <TableHead className="w-2/12 text-center">Banque</TableHead>
          <TableHead className="w-2/12 text-center">Statut</TableHead>
          <TableHead className="w-2/12 text-center">Étape actuelle</TableHead>
          <TableHead className="w-2/12 text-center">Temps de traitement</TableHead>
          <TableHead className="w-2/12 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => (
          <LinkRow
            key={link.id}
            link={link}
            onDelete={onDelete}
            formatDate={formatDate}
            triggerRefresh={triggerRefresh}
          />
        ))}
      </TableBody>
    </Table>
  );
};
