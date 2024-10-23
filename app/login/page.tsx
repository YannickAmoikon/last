// app/login/page.tsx
"use client";

import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import Image from 'next/image';

export default function LoginPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === 'authenticated' && session) {
			router.push('/dashboard');
		}
	}, [session, status, router]);

	const handleLogin = () => {
		signIn("keycloak", {callbackUrl: "/dashboard"});
	};

	if (status === 'loading') {
		return <div className="flex flex-col items-center justify-center min-h-screen">
		<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
			<p className="mt-2 text-gray-600">Chargement de l'authentification...</p>
		</div>
	}

	if (status === 'authenticated') {
		return null; // Ne rien rendre pendant la redirection
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100">
			<Card className="w-[450px] shadow-2xl">
				<CardHeader className="space-y-1">
					<div className="flex justify-center mb-6">
						<Image
							src="/images/Keycloak_logo.png"
							alt="Keycloak Logo"
							width={150}
							height={150}
							className="rounded-full bg-white p-3 shadow-lg"
						/>
					</div>
					<CardTitle className="text-2xl font-bold text-center text-gray-800">
						Bienvenue
					</CardTitle>
					<CardDescription className="text-center text-gray-600 text-md">
						Authentifiez-vous pour accéder à votre espace
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm uppercase">
							<span className="bg-white px-3 py-1 text-gray-500 font-semibold rounded-full shadow-sm">
								Authentification sécurisée
							</span>
						</div>
					</div>
					<div className="flex justify-center">
						<Button
							className="w-1/2 bg-green-600 text-md hover:bg-green-600 duration-700 text-white transition-colors duration-300 py-5"
							size="sm"
							onClick={handleLogin}
						>
							Cliquez ici
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
