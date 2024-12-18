import React from 'react';
import { BankStatement } from './BankStatement';
import { LineLink } from './LineLink';

interface MatchesFinishedProps {
  matchesFinished: any[];
  isClotured: boolean;
}

export const MatchesFinished: React.FC<MatchesFinishedProps> = ({ matchesFinished, isClotured }) => {
  return (
    <div className="space-y-2 w-full">
      {matchesFinished.map((matchFinished, idx) => (
        <div key={idx} className="border-2 border-gray-200 p-4 rounded-sm w-full">
          <span className="text-gray-600 text-xs">{`#${matchFinished.id}`}</span>
          <BankStatement bankStatement={matchFinished} />
          <LineLink 
            linesLinks={matchFinished.lignes_rapprochement} 
            bankStatementId={matchFinished.id}
            bankStatement={matchFinished}
            isClotured={isClotured}
            showDematchButton={true}
          />
        </div>
      ))}
    </div>
  );
};
