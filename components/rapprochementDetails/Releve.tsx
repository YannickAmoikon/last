import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { DetailDialog } from './DetailDialog'
import { formatMontant } from '@/utils/formatters'

export const Releve = ({ releve }: { releve: any }) => (
  <Card className="w-full mb-2 bg-orange-100 rounded-sm shadow-sm border-l-4 border-l-orange-500 hover:shadow-md cursor-pointer transition-shadow duration-200">
    <div className="flex items-center ml-9 h-28">
      <div className="flex-grow h-full flex flex-col justify-center py-4 px-4">
        <CardTitle className="text-sm font-semibold text-orange-700">{`ID: ${releve.id}`}</CardTitle>
        <CardDescription className="text-xs mt-1 text-gray-600">{`Compte: ${releve.numero_compte}`}</CardDescription>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-gray-600">Date: </span>
            <span className="font-medium text-gray-900">{new Date(releve.date_operation).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Montant: </span>
            <span className="font-medium text-gray-900">
              {releve.debit ? `-${formatMontant(releve.debit)}` : 
               releve.credit ? formatMontant(releve.credit) : 
               formatMontant(0)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Description: </span>
            <span className="font-medium text-gray-900">{releve.description}</span>
          </div>
        </div>
      </div>
      <div className="p-4 h-full flex items-center">
        <DetailDialog title={`Relevé #${releve.id}`} entity={releve} />
      </div>
    </div>
  </Card>
);