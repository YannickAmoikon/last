"use client"

import {useState, useEffect} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {useGetBanquesWithComptesQuery} from "@/lib/services/banksApi"
import {useAddRapprochementMutation} from "@/lib/services/rapprochementsApi"
import {useToast} from "@/hooks/use-toast"

const formSchema = z.object({
	banque_id: z.string().min(1, {message: "Veuillez sélectionner une banque"}),
	compte_id: z.string().min(1, {message: "Veuillez sélectionner un compte"}),
	date: z.string().min(1, {message: "La date est requise"}),
	releve_bancaire: z.instanceof(File, {message: "Le relevé bancaire est requis"}),
	grand_livre: z.instanceof(File, {message: "Le grand livre est requis"}),
	balance: z.instanceof(File, {message: "La balance est requise"}),
	edr: z.instanceof(File, {message: "L'EDR est requis"}),
})

interface CreateRapprochementDialogProps {
	onRapprochementCreated?: () => void;
}

export default function CreateRapprochementDialog({onRapprochementCreated}: CreateRapprochementDialogProps) {
	const [open, setOpen] = useState(false)
	const {data: banques, isLoading: isBanquesLoading} = useGetBanquesWithComptesQuery()
	const [selectedBanque, setSelectedBanque] = useState<typeof banques[number] | null>(null)
	const [addRapprochement] = useAddRapprochementMutation()
	const {toast} = useToast()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			banque_id: "",
			compte_id: "",
			date: new Date().toISOString().slice(0, 10),
		},
	})

	useEffect(() => {
		if (selectedBanque) {
			form.setValue('compte_id', '')
		}
	}, [selectedBanque, form])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log("Valeurs du formulaire:", values);

		try {
			const formData = new FormData()
			Object.entries(values).forEach(([key, value]) => {
				if (value instanceof File) {
					formData.append(key, value)
				} else {
					formData.append(key, value.toString())
				}
			})

			console.log("FormData entries:");
			for (const [key, value] of formData.entries()) {
				console.log(key, value instanceof File ? `File: ${value.name}` : value);
			}

			console.log("Envoi des données au serveur...");
			const result = await addRapprochement(formData).unwrap()
			console.log("Réponse du serveur:", result);

			toast({
				title: "Rapprochement créé",
				description: "Le rapprochement a été créé avec succès.",
			})
			if (onRapprochementCreated) {
				onRapprochementCreated()
			}
			setOpen(false)
			form.reset()
		} catch (error: any) {
			console.error("Erreur détaillée:", error);
			if (error.data) {
				console.error("Données d'erreur:", error.data);
			}
			toast({
				title: "Erreur",
				description: error.data?.detail || "Une erreur est survenue lors de la création du rapprochement.",
				variant: "destructive",
			})
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Créer un rapprochement</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[800px] w-full">
				<DialogHeader>
					<DialogTitle>Créer un rapprochement bancaire</DialogTitle>
					<DialogDescription>
						Remplissez les informations pour créer un nouveau rapprochement bancaire.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="banque_id"
								render={({field}) => (
									<FormItem>
										<FormLabel>Banque</FormLabel>
										<Select
											onValueChange={(value) => {
												field.onChange(value)
												const selected = banques?.find(b => b.id.toString() === value)
												setSelectedBanque(selected || null)
											}}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Sélectionnez une banque"/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{isBanquesLoading && <SelectItem value="">Chargement...</SelectItem>}
												{banques?.map((banque) => (
													<SelectItem key={banque.id} value={banque.id.toString()}>
														{banque.nom}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage/>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="compte_id"
								render={({field}) => (
									<FormItem>
										<FormLabel>Compte</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											disabled={!selectedBanque}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Sélectionnez un compte"/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{selectedBanque?.comptes.map((compte) => (
													<SelectItem key={compte.id} value={compte.id.toString()}>
														{compte.numero_compte}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage/>
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="date"
							render={({field}) => (
								<FormItem>
									<FormLabel>Date</FormLabel>
									<FormControl>
										<Input
											type="date"
											{...field}
											className="w-[365px]" // Ajustez cette valeur selon vos besoins
										/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="releve_bancaire"
								render={({field}) => (
									<FormItem>
										<FormLabel>Relevé bancaire</FormLabel>
										<FormControl>
											<Input
												type="file"
												onChange={(e) => field.onChange(e.target.files?.[0])}
											/>
										</FormControl>
										<FormMessage/>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="grand_livre"
								render={({field}) => (
									<FormItem>
										<FormLabel>Grand livre</FormLabel>
										<FormControl>
											<Input
												type="file"
												onChange={(e) => field.onChange(e.target.files?.[0])}
											/>
										</FormControl>
										<FormMessage/>
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="balance"
								render={({field}) => (
									<FormItem>
										<FormLabel>Balance</FormLabel>
										<FormControl>
											<Input
												type="file"
												onChange={(e) => field.onChange(e.target.files?.[0])}
											/>
										</FormControl>
										<FormMessage/>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="edr"
								render={({field}) => (
									<FormItem>
										<FormLabel>EDR</FormLabel>
										<FormControl>
											<Input
												type="file"
												onChange={(e) => field.onChange(e.target.files?.[0])}
											/>
										</FormControl>
										<FormMessage/>
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button type="submit">Créer le rapprochement</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}