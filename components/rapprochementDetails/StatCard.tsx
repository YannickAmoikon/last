import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const StatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <Card className="bg-gray-100 hover:shadow-md rounded-sm cursor-pointer transition-shadow duration-200 border shadow-sm">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-lg flex items-center justify-between font-bold text-gray-600"><span>{value}</span>{icon}</div>
    </CardContent>
  </Card>
);