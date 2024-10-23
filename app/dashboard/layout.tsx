// app/dashboard/layout.tsx
"use client";

import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import SideBar from "@/components/blocks/SideBar";
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
																					children,
																				}: {
	children: React.ReactNode;
}) {
	const {data: session, status} = useSession({
		required: true,
		onUnauthenticated() {
			redirect('/login');
		},
	});

	if (status === "loading") {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
				<p className="mt-2 text-gray-600">Chargement...</p>
			</div>
		);
	}

	return (
		<div className="flex h-screen overflow-hidden">
			<SideBar/>
			<div className="flex flex-col flex-1 overflow-hidden">
				<main className="flex-1 overflow-auto p-4">
					{children}
				</main>
			</div>
		</div>
	);
}
