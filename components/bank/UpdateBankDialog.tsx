"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateBankMutation } from "@/lib/services/bankApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pencil, Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Bank } from "@/types/bank";

// Schéma de validation Zod
const formSchema = z.object({
  nom: z.string().min(1, { message: "Le nom est requis" }),
});

// Types
type FormValues = z.infer<typeof formSchema>;

interface UpdateBankDialogProps {
  bank: Bank;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBankEdited?: (success: boolean, message: string) => void;
}

export default function UpdateBankDialog({ 
  bank, 
  open, 
  onOpenChange, 
  onBankEdited 
}: UpdateBankDialogProps) {
  const [updateBank, { isLoading: isUpdating }] = useUpdateBankMutation();
  const { toast } = useToast();

  // Configuration du formulaire
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: bank.nom,
    },
  });

  // Gestionnaires d'événements
  const resetForm = () => {
    form.reset({
      nom: bank.nom,
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  // Soumission du formulaire
  const onSubmit = async (values: FormValues) => {
    try {
      await updateBank({
        id: bank.id,
        body: values
      }).unwrap();

      toast({
        title: "Succès",
        description: "La banque a été modifiée avec succès",
      });

      if (onBankEdited) {
        onBankEdited(true, "La banque a été modifiée avec succès");
      }

      handleOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la modification de la banque:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de la banque",
      });

      if (onBankEdited) {
        onBankEdited(false, "Erreur lors de la modification de la banque");
      }
    }
  };

  // Rendu
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-full">
        <DialogHeader>
          <DialogTitle>Modifier la banque</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la banque
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
                disabled={isUpdating}
                className="bg-green-600 text-white hover:bg-green-600"
              >
                <Pencil className="mr-1" size={14} />
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Modification en cours...
                  </>
                ) : (
                  "Modifier"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}