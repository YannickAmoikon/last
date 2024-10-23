import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BanksPage() {
	return (
		<main className="flex flex-1 h-full">
			<Card className="flex-1 rounded-none shadow-none border-0">
				<CardHeader className="border-b">
					<CardTitle>Banques</CardTitle>
					<CardDescription>
						Gestion des banques
					</CardDescription>
				</CardHeader>
			</Card>
		</main>
	);
}
