import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpPage() {
    return(
        <main className="flex flex-1 h-full">
        <Card className="flex-1 rounded-none shadow-none border-0">
            <CardHeader className="border-b">
                <CardTitle className="uppercase text-lg">Aide</CardTitle>
                <CardDescription>
                    Documentation sur l'application
                </CardDescription>
            </CardHeader>
        </Card>
    </main>
    )
}