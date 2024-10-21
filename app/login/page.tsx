// app/login/page.tsx
"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {signIn} from "next-auth/react";
import {ArrowRight} from "lucide-react";

export default function LoginPage() {
	const handleLogin = () => {
		signIn("keycloak", {callbackUrl: "/dashboard"});
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<Card className="w-[400px]">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						Connexion
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Button
						className="w-full"
						size="lg"
						onClick={handleLogin}
					>
						Se connecter avec Keycloak
						<ArrowRight className="ml-2 h-4 w-4"/>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}