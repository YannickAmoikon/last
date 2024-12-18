import React from 'react';
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { formatMontant } from '@/utils/formatters';
import { DetailButton } from "./DetailButton";

interface BookProps {
  book: any;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDetailClick: (item: any) => void;
}

export const Book = React.memo(({ book, isSelected, onSelect, onDetailClick }: BookProps) => (
  <Card className="w-full rounded-sm mb-2 shadow-sm bg-blue-100 border-l-4 border-l-blue-500 hover:shadow-md cursor-pointer transition-shadow duration-200">
    <div className="flex items-center h-24">
      <div className="p-2 flex items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(book.id.toString())}
          className="h-5 w-5 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>
      <div className="flex-grow flex flex-col justify-center py-2 px-4">
        <CardTitle className="text-sm font-semibold text-blue-700">{`ID: ${book.id}`}</CardTitle>
        <CardDescription className="text-xs mt-1 text-gray-600">
          Compte: {book.compte || book.cpte_alt || "N/A"}
        </CardDescription>
        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-gray-600">Date: </span>
            <span className="font-medium text-gray-900">
              {new Date(book.date_ecriture).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Montant: </span>
            <span className="font-medium text-gray-900">
              {book.debit
                ? `-${formatMontant(book.debit)}`
                : formatMontant(book.credit)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Libellé: </span>
            <span className="font-medium text-gray-900">
              {book.libelle}
            </span>
          </div>
        </div>
      </div>
      <div className="p-2">
        <DetailButton onClick={() => onDetailClick(book)} />
      </div>
    </div>
  </Card>
));