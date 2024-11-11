"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateBankMutation } from "@/lib/services/bankApi";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2, Save, Trash2 } from "lucide-react";
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
import { Textarea } from "../ui/textarea";

// Schéma de validation Zod
const formSchema = z.object({
  nom: z.string().min(1, { message: "Le nom est requis" }),
  comptes: z.array(
    z.object({
      numero_compte: z.string().min(1, { message: "Le numéro de compte est requis" }),
      description: z.string().min(1, { message: "La description est requise" }),
    })
  ),
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
      comptes: [{ numero_compte: "", description: "" }],
    },
  });

  // Gestionnaires d'événements
  const resetForm = () => {
    form.reset({
      nom: "",
      comptes: [{ numero_compte: "", description: "" }],
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  const addCompte = () => {
    const comptes = form.getValues("comptes");
    form.setValue("comptes", [
      ...comptes,
      { numero_compte: "", description: "" },
    ]);
  };

  const removeCompte = (index: number) => {
    const comptes = form.getValues("comptes");
    if (comptes.length > 1) {
      form.setValue(
        "comptes",
        comptes.filter((_, i) => i !== index)
      );
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
        <Button size="sm" variant="default" className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Banque
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Créer une nouvelle banque</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle banque
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
              {/* Champ Nom de la banque */}
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Liste des comptes */}
              <div className="space-y-4">
                {form.watch("comptes").map((_, index) => (
                  <div 
                    key={index} 
                    className="p-4 border rounded-lg space-y-4 bg-gray-50/50"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">
                        Compte {index + 1}
                      </h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCompte(index)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name={`comptes.${index}.numero_compte`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro de compte</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Entrez le numéro..." 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`comptes.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Entrez la description..." 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>

              {/* Bouton Ajouter un compte */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCompte}
                className="w-full border-dashed"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un compte
              </Button>
            </form>
          </Form>
        </div>

        <DialogFooter className="p-6 border-t">
          <Button 
            type="submit"
            size="sm"
            disabled={isCreating}
            className="bg-green-600 text-white hover:bg-green-600"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Enregistrement en cours...
              </>
            ) : (
              <>
                <Save className="mr-1 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}