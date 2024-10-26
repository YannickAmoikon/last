import React from 'react';
import { BankStatement } from './BankStatement'
import { LineLink } from './LineLink'

interface PendingMatchesProps {
  matchesPending: any[];
  onMatchSuccess: () => void;
}

export const PendingMatches: React.FC<PendingMatchesProps> = ({ matchesPending, onMatchSuccess }) => (
  <div className="space-y-2">
    {matchesPending.map((matchPending, idx) => (
      <div key={idx} className="border-2 border-gray-200 p-4 rounded-sm w-full">
        <span className="text-gray-600 text-xs">{`#${matchPending.id}`}</span>
        <BankStatement bankStatement={matchPending} />
        <LineLink
          linesLinks={matchPending.lignes_rapprochement}
          bankStatementId={matchPending.id}
          onMatchSuccess={onMatchSuccess}
          bankStatement={matchPending}
          showMatchButtons={true}
        />
      </div>
    ))}
  </div>
);
