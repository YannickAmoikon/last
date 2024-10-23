import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DetailDialog } from '@/components/rapprochementDetails/DetailDialog'

export const TransactionCard = ({ 
  title, 
  description, 
  details, 
  entity, 
  isGrandLivre = false,
  DetailDialogComponent = DetailDialog 
}: { 
  title: string, 
  description: string, 
  details: { date: string, montant: string, statut: string }[], 
  entity: any, 
  isGrandLivre?: boolean,
  DetailDialogComponent?: React.ComponentType<{ title: string, entity: any }>
}) => (
  <Card className="w-full mb-2 rounded-sm shadow-md">
    <CardHeader className="pb-2 pt-3">
      <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      <CardDescription className="text-xs">{description}</CardDescription>
    </CardHeader>
    <CardContent className="pt-1 pb-2">
      {details.map((detail, index) => (
        <div key={index} className="py-1.5 border-b last:border-b-0">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium">{detail.date}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Montant:</span>
            <span className="font-medium">{detail.montant}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Statut:</span>
            <span className="font-medium">{detail.statut}</span>
          </div>
        </div>
      ))}
    </CardContent>
    <CardFooter className="pt-2 pb-3">
     <div className="flex justify-end w-full space-x-2">
       <DetailDialogComponent title={title} entity={entity} />
       {
       isGrandLivre && 
        <Button size="sm" className="text-xs py-1.5 px-3 h-7">Matcher</Button>
       }
     </div>
    </CardFooter>
  </Card>
);