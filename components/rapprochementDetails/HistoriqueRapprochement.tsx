import React from 'react';
import { Releve } from './Releve';
import { LignesRapprochement } from './LignesRapprochement';

interface HistoriqueRapprochementProps {
  items: any[];
  onDematch: (rapprochementId: string, ligneId: number) => void;
  isClotured: boolean;
}

export const HistoriqueRapprochement: React.FC<HistoriqueRapprochementProps> = ({ items, onDematch, isClotured }) => {
  return (
    <div className="space-y-2 w-full">
      {items.map((rapprochement, idx) => (
        <div key={idx} className="border-2 border-gray-200 p-4 rounded-sm w-full">
          <span className="text-gray-600 text-xs">{`#${rapprochement.id}`}</span>
          <Releve releve={rapprochement} />
          <LignesRapprochement 
            lignesRapprochement={rapprochement.lignes_rapprochement} 
            releveId={rapprochement.id}
            onDematch={onDematch}
            releve={rapprochement}
            isClotured={isClotured}
            showDematchButton={true}
          />
        </div>
      ))}
    </div>
  );
};
