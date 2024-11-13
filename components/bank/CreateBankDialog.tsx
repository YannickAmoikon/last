"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateBankMutation } from "@/lib/services/bankApi";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2, Save} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Schéma de validation Zod
const formSchema = z.object({
  nom: z.string().min(1, { message: "Le nom est requis" }),
});

// Types
type FormValues = z.infer<typeof formSchema>;

interface CreateBankDialogProps {
  onBankCreated?: (success: boolean, message: string) => void;
}

export default function CreateBankDialog({ onBankCreated }: CreateBankDialogProps) {
  // États
  const [open, setOpen] = useState(false);
  const [createBank, { isLoading: isCreating }] = useCreateBankMutation();
  const { toast } = useToast();

  // Configuration du formulaire
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
    },
  });

  // Gestionnaires d'événements
  const resetForm = () => {
    form.reset({
      nom: "",
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };


  // Soumission du formulaire
  const onSubmit = async (values: FormValues) => {
    try {
      const result = await createBank({
        nom: values.nom,
      }).unwrap();

      toast({
        title: "Succès",
        description: "La banque a été créée avec succès",
      });

      if (onBankCreated) {
        onBankCreated(true, "La banque a été créée avec succès");
      }

      handleOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création de la banque:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la banque",
      });

      if (onBankCreated) {
        onBankCreated(false, "Erreur lors de la création de la banque");
      }
    }
  };

  // Rendu
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-gray-800 text-white rounded-sm hover:text-white hover:bg-gray-900">
          <Plus className="mr-1" size={14} />
          Nouvelle Banque
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] w-full">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle banque</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle banque
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la banque</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Entrez le nom..." 
                      {...field} 
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="submit"
                size="sm"
                disabled={isCreating}
                className="bg-green-600 text-white hover:bg-green-600"
              >
                <Save className="mr-1" size={14} />
                {isCreating ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Enregistrement en cours...
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
  );
}