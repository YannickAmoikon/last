import React from 'react';
import { BankStatement } from './bankStatement';
import { LineLink } from './LineLink';

interface MatchesFinishedProps {
  matchesFinished: any[];
  onDematch: (rapprochementId: string, ligneId: number) => void;
  isClotured: boolean;
}

export const MatchesFinished: React.FC<MatchesFinishedProps> = ({ matchesFinished, onDematch, isClotured }) => {
  return (
    <div className="space-y-2 w-full">
      {matchesFinished.map((matchFinished, idx) => (
        <div key={idx} className="border-2 border-gray-200 p-4 rounded-sm w-full">
          <span className="text-gray-600 text-xs">{`#${matchFinished.id}`}</span>
          <BankStatement bankStatement={matchFinished} />
          <LineLink 
            linesLinks={matchFinished.lignes_rapprochement} 
            bankStatementId={matchFinished.id}
            onDematch={onDematch}
            bankStatement={matchFinished}
            isClotured={isClotured}
            showDematchButton={true}
          />
        </div>
      ))}
    </div>
  );
};
