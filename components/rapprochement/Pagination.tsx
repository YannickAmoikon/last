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
  <div className="flex gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={onPreviousPage}
      disabled={currentPage === 1}
    >
      Précédent
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={onNextPage}
      disabled={currentPage >= totalPages}
    >
      Suivant
    </Button>
  </div>
);