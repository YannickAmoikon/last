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
								src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMmYOMF1MqDCaXGxPL25M_QHSS9q9zUaItkQ&s"
								alt="Logo SACI-RAPB"
								width={50}
								height={50}
								className="relative rounded-sm shadow-md"
								priority
							/>
						</div>
						<div className="flex flex-col">
							<span className="text-white font-bold text-xl tracking-tight">SACI-RBA
							</span>
							<span className="text-gray-200 text-xs">SALAM ALIANZ - ASSURANCE COTE D'IVOIRE</span>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 mt-12 container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left Column */}
					<div className="space-y-8 text-center lg:text-left animate-fade-in-up">
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
								className="relative group bg-gray-600 hover:bg-gray-600 text-white px-8 py-5 text-base shadow-lg transition-all  hover:shadow-gray-200/50 hover:shadow-xl rounded-sm"
							>
								<LogIn className="mr-2 h-5 w-5 group-hover:transform group-hover:-translate-r-1 transition-transform" />
								Accéder à l'application
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
			<footer className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-6 overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="animate-marquee whitespace-nowrap">
						<span className="text-gray-200/80 inline-block">
							© 2024 SALAM ALIANZ - ASSURANCE COTE D'IVOIRE. Tous droits réservés.
						</span>
						<span className="text-gray-200/80 inline-block mx-8">•</span>
						<span className="text-gray-200/80 inline-block">
							Solution de Rapprochement Bancaire Automatisé
						</span>
						<span className="text-gray-200/80 inline-block mx-8">•</span>
						<span className="text-gray-200/80 inline-block">
							Sécurité • Fiabilité • Performance
						</span>
					</div>
				</div>
			</footer>
		</div>
	);
}
