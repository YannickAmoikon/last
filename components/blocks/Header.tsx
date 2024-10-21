"use client";

import React, {useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {
	LayoutDashboard,
	HelpCircle,
	LogOut,
	FileSpreadsheet,
	Landmark,
	AtSign,
	Menu,
	User,
} from "lucide-react";

const items = [
	{title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard},
	{title: "Banques", url: "/dashboard/banks", icon: Landmark},
	{title: "Rapprochements", url: "/dashboard/rapprochements", icon: FileSpreadsheet},
];

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const LinkItem = ({item}: { item: typeof items[0] }) => (
		<Link
			href={item.url}
			className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-100
        ${pathname === item.url ? "bg-gray-200 font-bold" : "text-gray-700"}`}
			onClick={() => setIsOpen(false)}
		>
			<item.icon className="h-5 w-5"/>
			<span>{item.title}</span>
		</Link>
	);

	return (
		<header className="flex h-14 items-center justify-between border-b bg-white px-4 lg:h-[60px] lg:px-6">
			<div className="flex items-center">
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="mr-2 shrink-0 md:hidden text-gray-700 hover:bg-gray-100"
						>
							<Menu className="h-5 w-5"/>
							<span className="sr-only">Toggle navigation menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-64 p-0">
						<aside className="bg-white text-gray-800 w-full h-full flex flex-col">
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
											className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
									<HelpCircle className="h-5 w-5"/>
									<span>Aide</span>
								</Link>
								<button
									onClick={() => {/* Logique de déconnexion */
									}}
									className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all w-full mt-2"
								>
									<LogOut className="h-5 w-5"/>
									<span>Déconnexion</span>
								</button>
							</div>
						</aside>
					</SheetContent>
				</Sheet>
			</div>
			<Button
				variant="ghost"
				size="icon"
				className="rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
			>
				<User className="h-5 w-5"/>
				<span className="sr-only">User profile</span>
			</Button>
		</header>
	);
}