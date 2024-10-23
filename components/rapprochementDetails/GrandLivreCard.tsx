import React from 'react'
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { GrandLivreDetailDialog } from './GrandLivreDetailDialog'
import { formatMontant } from '@/utils/formatters'
import { Info } from 'lucide-react'

const GrandLivreCard = ({ grandLivre }: { grandLivre: any }) => (
  <Card className="w-full rounded-sm mb-2 shadow-sm bg-blue-100 border-l-4 border-l-blue-500 hover:shadow-md cursor-pointer transition-shadow duration-200">
    <div className="flex items-center h-28">
      <div className="flex-grow h-full flex flex-col justify-center py-3 px-4">
        <CardTitle className="text-sm font-semibold text-blue-700">{`ID: ${grandLivre.grand_livre.id}`}</CardTitle>
        <CardDescription className="text-xs mt-1 text-gray-600">{grandLivre.grand_livre.libelle}</CardDescription>
        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-gray-600">Date: </span>
            <span className="font-medium text-gray-900">{new Date(grandLivre.grand_livre.date_ecriture).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Montant: </span>
            <span className="font-medium text-gray-900">
              {grandLivre.grand_livre.debit ? 
                `-${formatMontant(grandLivre.grand_livre.debit)}` : 
                formatMontant(grandLivre.grand_livre.credit)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Statut: </span>
            <span className="font-medium text-gray-900">{grandLivre.statut}</span>
          </div>
        </div>
        {grandLivre.commentaire && (
          <div className="mt-2 flex items-center text-xs text-gray-600">
            <Info size={14} className="mr-1 text-blue-500" />
            <span>{grandLivre.commentaire}</span>
          </div>
        )}
      </div>
      <div className="p-4 h-full flex items-center">
        <GrandLivreDetailDialog title={`Grand Livre : ${grandLivre.grand_livre.id}`} entity={grandLivre} />
      </div>
    </div>
  </Card>
)

export default GrandLivreCard