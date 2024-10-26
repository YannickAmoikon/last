import React from 'react';
import { BankStatement } from './bankStatement';
import { LineLink } from './LineLink';

interface MatchesFinishedProps {
  items: any[];
  onDematch: (rapprochementId: string, ligneId: number) => void;
  isClotured: boolean;
}

export const MatchesFinished: React.FC<MatchesFinishedProps> = ({ items, onDematch, isClotured }) => {
  return (
    <div className="space-y-2 w-full">
      {items.map((rapprochement, idx) => (
        <div key={idx} className="border-2 border-gray-200 p-4 rounded-sm w-full">
          <span className="text-gray-600 text-xs">{`#${rapprochement.id}`}</span>
          <BankStatement releve={rapprochement} />
          <LineLink 
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
