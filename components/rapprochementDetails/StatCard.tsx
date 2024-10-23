import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const StatCard = ({ title, value }: { title: string, value: string }) => (
  <Card className="bg-gray-100 hover:shadow-md rounded-none cursor-pointer transition-shadow duration-200 border shadow-sm">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-lg font-bold text-gray-600">{value}</div>
    </CardContent>
  </Card>
);