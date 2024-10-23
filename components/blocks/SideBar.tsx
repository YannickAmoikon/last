"use client";

import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {
	LayoutDashboard,
	HelpCircle,
	LogOut,
	FileSpreadsheet,
	Landmark,
	AtSign,
} from "lucide-react";

const items = [
	{title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard},
	{title: "Rapprochements", url: "/dashboard/rapprochements", icon: FileSpreadsheet},
	{title: "Banques", url: "/dashboard/banks", icon: Landmark},
];

export default function SideBar({className = ""}: { className?: string }) {
	const pathname = usePathname();

	const LinkItem = ({item}: { item: typeof items[0] }) => (
		<Link
			href={item.url}
			className={`flex text-sm items-center gap-3 rounded-md px-3 py-2.5 transition-all
        ${pathname === item.url 
          ? "bg-gray-700 text-white font-medium" 
          : "text-gray-400 hover:bg-gray-700 hover:text-white"}`}
		>
			<item.icon className="h-5 w-5"/>
			<span>{item.title}</span>
		</Link>
	);

	return (
		<aside className={`bg-gray-900 text-gray-100 w-64 min-h-screen flex-col shadow-lg hidden md:flex ${className}`}>
			<div className="flex h-16 items-center px-4 border-b border-gray-700">
				<span className="flex items-center gap-2 font-semibold">
					<AtSign className="h-6 w-6"/>
					<span className="uppercase text-lg">SALAM ASSURANCE</span>
				</span>
			</div>
			<nav className="flex-1 overflow-auto py-6 px-3">
				<div className="space-y-1">
					{items.map((item) => (
						<LinkItem key={item.title} item={item}/>
					))}
				</div>
			</nav>
			<div className="p-4 border-t border-gray-700">
				<Link 
					href="/dashboard/help"
					className="flex text-sm items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-md transition-all"
				>
					<HelpCircle className="h-5 w-5"/>
					<span>Aide</span>
				</Link>
				<button
					onClick={() => {/* Logique de déconnexion */}}
					className="flex text-sm items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-md transition-all w-full mt-2"
				>
					<LogOut className="h-5 w-5"/>
					<span>Déconnexion</span>
				</button>
			</div>
		</aside>
	);
}
