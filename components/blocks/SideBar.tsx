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
	{title: "Banques", url: "/dashboard/banks", icon: Landmark},
	{title: "Rapprochements", url: "/dashboard/rapprochements", icon: FileSpreadsheet},
];

export default function SideBar({className = ""}: { className?: string }) {
	const pathname = usePathname();

	const LinkItem = ({item}: { item: typeof items[0] }) => (
		<Link
			href={item.url}
			className={`flex text-sm items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-100
        ${pathname === item.url ? "bg-gray-200 font-bold" : "text-gray-700"}`}
		>
			<item.icon className="h-5 w-5"/>
			<span>{item.title}</span>
		</Link>
	);

	return (
		<aside className={`bg-white text-gray-800 w-64 min-h-screen flex-col border-r hidden md:flex ${className}`}>
			<div className="flex h-14 items-center px-4 lg:h-[60px] border-b">
        <span className="flex items-center gap-2 font-semibold">
          <AtSign className="h-6 w-6"/>
          <span className="uppercase">SALAM ASSURANCE</span>
        </span>
			</div>
			<nav className="flex-1 overflow-auto p-4">
				<div className="space-y-2">
					{items.map((item) => (
						<LinkItem key={item.title} item={item}/>
					))}
				</div>
			</nav>
			<div className="p-4 border-t">
				<Link href="/dashboard/help"
							className="flex text-sm items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
					<HelpCircle className="h-5 w-5"/>
					<span>Aide</span>
				</Link>
				<button
					onClick={() => {/* Logique de déconnexion */
					}}
					className="flex text-sm items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all w-full mt-2"
				>
					<LogOut className="h-5 w-5"/>
					<span>Déconnexion</span>
				</button>
			</div>
		</aside>
	);
}