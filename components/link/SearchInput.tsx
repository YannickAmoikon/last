import React from 'react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => (
  <Input
  
    placeholder="Faire une recherche..."
    className="w-60 rounded-sm"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);