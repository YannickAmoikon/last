import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "En cours de traitement":
      return (
        <Badge variant="secondary" className="text-blue-600 rounded-sm w-24 justify-center">
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          En cours
        </Badge>
      );
    case "Terminé":
      return (
        <Badge variant="secondary" className="text-green-600 rounded-sm w-24 justify-center">
          Terminé
        </Badge>
      );
    case "Erreur":
      return (
        <Badge variant="secondary" className="text-red-600 rounded-sm w-24 justify-center">
          Erreur
        </Badge>
      );
    case "En attente":
      return (
        <Badge variant="secondary" className="text-yellow-600 rounded-sm w-24 justify-center">
          En attente
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="text-gray-600 rounded-sm w-24 justify-center">
          {status}
        </Badge>
      );
  }
};