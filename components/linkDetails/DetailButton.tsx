import { Button } from "@/components/ui/button"
import { Eye } from 'lucide-react';

export const DetailButton = ({ onClick }: { onClick: () => void }) => (
  <Button 
    size="sm" 
    variant="outline" 
    onClick={onClick}
    className="text-xs rounded-sm py-1.5 px-3 h-7 bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200"
  >
    <Eye className="mr-1" size={14} />
    Détails
  </Button>
);