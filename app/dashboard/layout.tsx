// app/dashboard/layout.tsx
"use client";

import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import SideBar from "@/components/blocks/SideBar";
import Header from "@/components/blocks/Header";

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
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="text-lg">Chargement...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen overflow-hidden">
			<SideBar/>
			<div className="flex flex-col flex-1 overflow-hidden">
				<Header/>
				<main className="flex-1 overflow-auto p-4">
					{children}
				</main>
			</div>
		</div>
	);
}