import React from 'react';
import { Releve } from './Releve'
import { LignesRapprochement } from './LignesRapprochement'

interface RapprochementProps {
  items: any[];
  onMatchSuccess: () => void;
}

export const Rapprochement: React.FC<RapprochementProps> = ({ items, onMatchSuccess }) => (
  <div className="space-y-2">
    {items.map((rapprochement, idx) => (
      <div key={idx} className="border-2 border-gray-200 p-4 rounded-sm w-full">
        <span className="text-gray-600 text-xs">{`#${rapprochement.id}`}</span>
        <Releve releve={rapprochement} />
        <LignesRapprochement
          lignesRapprochement={rapprochement.lignes_rapprochement}
          releveId={rapprochement.id}
          onMatchSuccess={onMatchSuccess}
          releve={rapprochement}
          showMatchButtons={true}
        />
      </div>
    ))}
  </div>
);
