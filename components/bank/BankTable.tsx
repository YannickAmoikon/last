import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BankRow } from '@/components/bank/BankRow';
import { Bank as BankType } from '@/types/bank';

interface BankTableProps {
    banks: BankType[];
    onDelete: (id: string) => void;
    triggerRefresh: (action: string) => void;
}

export const BankTable: React.FC<BankTableProps> = ({ banks, onDelete, triggerRefresh }) => {
    return (
        <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/12 text-left">ID</TableHead>
          <TableHead className="w-2/12 text-center">Nom</TableHead>
          <TableHead className="w-2/12 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {banks.map((bank) => (
          <BankRow
            key={bank.id}
            bank={bank}
            onDelete={onDelete}
            triggerRefresh={triggerRefresh}
          />
        ))}
            </TableBody>
        </Table>
    )
}