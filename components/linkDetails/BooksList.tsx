import React from 'react';
import { Book } from './Book';
import { Button } from "@/components/ui/button";
import { RefreshCcw, Loader2 } from "lucide-react";

interface BookListProps {
  isLoading: boolean;
  error: string | null;
  filteredBooks: any[];
  selectedItem: string | null;
  onCheckboxChange: (id: string) => void;
  onDetailClick: (item: any) => void;
  onRetry: () => void;
}

export const BookList: React.FC<BookListProps> = ({
  isLoading,
  error,
  filteredBooks,
  selectedItem,
  onCheckboxChange,
  onDetailClick,
  onRetry
}) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex min-h-screen mt-60">
        <div className="relative flex-1 h-full w-full bg-gray-200 animate-pulse">
          <Loader2 className="absolute inset-0 m-auto h-12 w-12 text-gray-900 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center min-h-screen flex-1 bg-gray-50">
        <div className="text-center mt-40">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mt-2 text-lg font-semibold text-gray-900">
            Erreur de chargement
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Impossible de charger les grands livres. Veuillez réessayer.
          </p>
          <div className="mt-6">
            <Button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
            >
              <RefreshCcw className="mr-1" size={14} />
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredBooks.map((item: any) => (
        <Book
          key={item.id}
          item={item}
          isSelected={selectedItem === item.id.toString()}
          onSelect={onCheckboxChange}
          onDetailClick={onDetailClick}
        />
      ))}
    </div>
  );
};