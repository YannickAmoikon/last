import React from 'react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
}) => (
  <div className="flex items-center justify-center gap-4">
    <Button
      variant="outline"
      size="sm"
      onClick={onPreviousPage}
      disabled={currentPage === 1}
      className="px-4 rounded-sm"
    >
      Précédent
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={onNextPage}
      disabled={currentPage >= totalPages}
      className="px-4 rounded-sm"
    >
      Suivant
    </Button>
  </div>
);
