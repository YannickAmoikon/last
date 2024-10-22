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
import { Plus, Loader2, Save } from "lucide-react"

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
	onRapprochementCreated?: (success: boolean, message: string) => void;
}

export default function CreateRapprochementDialog({onRapprochementCreated}: CreateRapprochementDialogProps) {
	const [open, setOpen] = useState(false)
	const {data: banques, isLoading: isBanquesLoading} = useGetBanquesWithComptesQuery()
	// @ts-ignore
	const [selectedBanque, setSelectedBanque] = useState<typeof banques[number] | null>(null)
	const [addRapprochement, { isLoading: isCreating }] = useAddRapprochementMutation()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			banque_id: "",
			compte_id: "",
			date: new Date().toISOString().slice(0, 16), // Format: "YYYY-MM-DDTHH:mm"
			releve_bancaire: undefined,
			grand_livre: undefined,
			balance: undefined,
			edr: undefined,
		},
	})

	// Fonction pour réinitialiser le formulaire
	const resetForm = () => {
		form.reset({
			banque_id: "",
			compte_id: "",
			date: new Date().toISOString().slice(0, 16),
			releve_bancaire: undefined,
			grand_livre: undefined,
			balance: undefined,
			edr: undefined,
		});
		setSelectedBanque(null);
	};

	// Gérer l'ouverture/fermeture de la modal
	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			resetForm();
		}
	};

	useEffect(() => {
		if (selectedBanque) {
			form.setValue('compte_id', '')
		}
	}, [selectedBanque, form])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const formData = new FormData();
		Object.entries(values).forEach(([key, value]) => {
			if (key === 'date') {
				//@ts-ignore
				const date = new Date(value);
				const datetimeString = date.toISOString();
				formData.append(key, datetimeString);
			} else if (value instanceof File) {
				formData.append(key, value);
			} else if (value !== undefined && value !== null) {
				formData.append(key, value.toString());
			}
		});

		console.log("FormData entries:");
		//@ts-ignore
		for (const [key, value] of formData.entries()) {
			console.log(key, value instanceof File ? `File: ${value.name}` : value);
		}

		try {
			await addRapprochement(formData).unwrap();
			if (onRapprochementCreated) {
				onRapprochementCreated(true, "Le rapprochement a été créé avec succès.");
			}
			handleOpenChange(false);
		} catch (error: any) {
			console.error("Erreur détaillée:", error);
			if (error.data) {
				console.error("Données d'erreur:", error.data);
			}
			if (onRapprochementCreated) {
				onRapprochementCreated(false, error.data?.detail || "Une erreur est survenue lors de la création du rapprochement.");
			}
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button size="sm" className="bg-secondary border duration-500 hover:text-white hover:bg-green-600" variant="outline">
					<Plus className="mr-1" size={14} />
					Nouveau rapprochement
				</Button>
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
												{/* @ts-ignore */}
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
											disabled
											type="datetime-local"
											{...field}
											className="w-[365px]"
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
							<Button className="bg-green-600 text-white hover:bg-green-600" size="sm" type="submit" disabled={isCreating}>
								<Save className="mr-1" size={14} />
								{isCreating ? (
									<>
										<Loader2 className="mr-1 h-4 w-4 animate-spin" />
										Création en cours...
									</>
								) : (
									"Enregistrer"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
