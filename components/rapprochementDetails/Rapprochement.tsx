import { Releve } from './Releve'
import { GrandLivres } from './GrandLivres'

export const Rapprochement = ({ rapprochement }: { rapprochement: any }) => (
  <div className="border-2 border-gray-200 p-4 rounded-sm w-full">
    <span className="text-gray-600 text-xs">{`#${rapprochement.id}`}</span>
    <Releve releve={rapprochement} />
    <GrandLivres grandLivres={rapprochement.lignes_rapprochement} releveId={rapprochement.id} onMatchSuccess={() => {}} />
  </div>
);