// app/login/page.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, LogInIcon, ChevronRight, Merge, Landmark, ChartBarBig, Shield, Flashlight, ChevronsUpDown, Zap } from "lucide-react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "authenticated" && session) {
			router.push("/dashboard");
		}
	}, [session, status, router]);

	const handleLogin = () => {
		signIn("keycloak", { callbackUrl: "/dashboard" });
	};

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
			{/* Header */}
			<div className="flex h-20 bg-gradient-to-r from-gray-800 to-gray-700 items-center shadow-lg">
				<div className="container mx-auto px-4 flex justify-between items-center">
					<div className="flex items-center space-x-3">
						<div className="relative group">
							<div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-gray-600 rounded-sm blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
							<Image
								src="data:image/jpeg;base64,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"
								alt="Logo SACI-RAPB"
								width={90}
								height={40}
								className="relative rounded-sm shadow-md"
								priority
							/>
						</div>
						<div className="flex flex-col">
							<span className="text-white font-bold text-2xl tracking-tight">SACI-RAPB</span>
							<span className="text-gray-200 text-xs">SALAM ALIANZ - ASSURANCE COTE D'IVOIRE</span>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left Column */}
					<div className="space-y-8 text-center lg:text-left animate-fade-in-up">
						<div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-sm text-sm font-medium mb-4">
							<span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
							Solution de Rapprochement Bancaire
						</div>
						
						<h1 className="text-2xl lg:text-4xl font-bold text-gray-800 leading-tight">
							Gestion des<br />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-600">
								Rapprochements Bancaires
							</span>
						</h1>
						
						<p className="text-gray-600 text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
							Une solution moderne et intuitive pour automatiser et sécuriser 
							vos processus de rapprochement bancaire.
						</p>

						<div className="flex flex-col sm:flex-row gap-6 items-center justify-center lg:justify-start">
							<Button
								onClick={handleLogin}
								className="relative group bg-gray-700 hover:bg-gray-600 text-white px-8 py-5 text-base shadow-lg transition-all duration-300 hover:shadow-gray-200/50 hover:shadow-xl rounded-sm"
							>
								{status === "loading" ? (
									<Loader2 className="h-5 w-5 animate-spin" />
								) : (
									<>
										<LogIn className="mr-2 h-5 w-5 group-hover:transform group-hover:-translate-r-1 transition-transform" />
										Accéder à l'application
									</>
								)}
							</Button>
							<div className="flex items-center space-x-4 text-sm text-gray-500">
								<div className="flex items-center">
									<Zap className="w-5 h-5 text-gray-500 mr-1" />
									Sécurisé
								</div>
								<div className="flex items-center">
									<ChevronsUpDown className="w-5 h-5 text-gray-500 mr-1" />
									Rapide
								</div>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
							<div className="text-center">
								<div className="text-2xl font-bold text-gray-700">100%</div>
								<div className="text-sm text-gray-500">Sécurisé</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-gray-700">24/7</div>
								<div className="text-sm text-gray-500">Disponible</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-gray-700">100%</div>
								<div className="text-sm text-gray-500">Fiable</div>
							</div>
						</div>
					</div>

					{/* Right Column */}
					<div className="relative">
						<div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 to-gray-600/5 transform rotate-6 rounded-sm blur-xl"></div>
						<Card className="relative bg-white/90 backdrop-blur-sm shadow-xl rounded-sm p-8 border-0">
							<CardHeader>
								<CardTitle className="text-2xl font-bold text-gray-800 mb-6">
									Fonctionnalités
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-8">
									{[
										{
											title: "Rapprochement Auto",
											description: "Matching intelligent des opérations",
											icon: <Merge className="w-6 h-6 text-gray-600" />
										},
										{
											title: "Gestion des banques",
											description: "Création et gestion des banques",
											icon: <Landmark className="w-6 h-6 text-gray-600" />
										},
										{
											title: "Suivi en temps réel",
											description: "Suivi en temps réel des rapprochements",
											icon: <ChartBarBig className="w-6 h-6 text-gray-600" />
										},
										{
											title: "Sécurité",
											description: "Protection des données",
											icon: <Shield className="w-6 h-6 text-gray-600" />
										}
									].map((feature, index) => (
										<div
											key={index}
											className="flex flex-col space-y-2"
										>
											<div className="flex items-center space-x-3">
												<div className="w-12 h-12 bg-blue-100 rounded-sm flex items-center justify-center">
													{feature.icon}
												</div>
												<h3 className="font-semibold text-gray-800 text-lg">
													{feature.title}
												</h3>
											</div>
											<p className="text-gray-600 ml-15">
												{feature.description}
											</p>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
			{/* Footer */}
			<footer className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-6">
				<div className="container mx-auto px-4 text-center">
					<p className="text-gray-200/80">
						© 2024 SALAM ALIANZ - ASSURANCE COTE D'IVOIRE. Tous droits réservés.
					</p>
				</div>
			</footer>
		</div>
	);
}
