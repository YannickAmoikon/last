import React from 'react';
import { BankStatement } from './bankStatement'
import { LineLink } from './LineLink'

interface PendingMatchesProps {
  items: any[];
  onMatchSuccess: () => void;
}

export const PendingMatches: React.FC<PendingMatchesProps> = ({ items, onMatchSuccess }) => (
  <div className="space-y-2">
    {items.map((rapprochement, idx) => (
      <div key={idx} className="border-2 border-gray-200 p-4 rounded-sm w-full">
        <span className="text-gray-600 text-xs">{`#${rapprochement.id}`}</span>
        <BankStatement releve={rapprochement} />
        <LineLink
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
