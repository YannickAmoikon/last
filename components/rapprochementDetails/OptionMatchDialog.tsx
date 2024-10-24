"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Equal, Merge, Loader2, AlertCircle } from "lucide-react"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { DetailDialog } from './DetailDialog'
import { formatMontant } from "@/utils/formatters"
import { useCreerLigneRapprochementMutation } from "@/lib/services/rapprochementsApi"
import { useGetNonRapprochesGrandLivresQuery } from "@/lib/services/grandsLivresApi"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  commentaire: z.string().min(1, {
    message: "Le commentaire est requis.",
  }),
})

export default function CreateOptionMatchDialog({ releve, buttonClassName }: { releve: any, buttonClassName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [nonRapprochesGrandLivres, setNonRapprochesGrandLivres] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creerLigneRapprochement] = useCreerLigneRapprochementMutation();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commentaire: "",
    },
  })

  const { refetch } = useGetNonRapprochesGrandLivresQuery(releve.rapprochement_id);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      refetch()
        .then((result) => {
          if (result.data) {
            setNonRapprochesGrandLivres(result.data);
          } else if (result.error) {
            setError("Une erreur est survenue lors du chargement des grands livres.");
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, refetch]);

  const handleCheckboxChange = useCallback((id: string) => {
    setSelectedItem(prev => prev === id ? null : id);
  }, []);

  const handleMatch = async (values: z.infer<typeof formSchema>) => {
    if (!selectedItem) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un grand livre à matcher.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await creerLigneRapprochement({
        rapprochement_id: releve.rapprochement_id,
        body: {
          releve_bancaire_id: releve.id,
          grand_livre_id: selectedItem,
          commentaire: values.commentaire
        }
      }).unwrap();
      console.log("Résultat de la création de ligne:", result);
      toast({
        title: "Matching réussi",
        description: "La ligne de rapprochement a été créée avec succès.",
        className: "bg-green-600 text-white"
      });
      setIsOpen(false);
      setIsCommentDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création de la ligne:", error);
      toast({
        title: "Erreur de matching",
        description: "Une erreur est survenue lors du matching.",
        variant: "destructive",
      });
    }
  };

  const filteredGrandLivres = nonRapprochesGrandLivres.filter(item =>
    (item?.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (item?.id?.toString().includes(searchTerm) ?? false)
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            className={buttonClassName || "bg-blue-600 my-2 hover:bg-blue-700 text-white"}
          >
            <Equal size={14} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1100px] h-[750px] flex flex-col">
          <div className="flex flex-col h-full pt-5">
            <div className="flex-none mb-4">
              {releve && (
                <Card className="w-full bg-orange-100 rounded-sm shadow-sm border-l-4 border-l-orange-500">
                  <div className="flex items-center h-24">
                    <div className="flex-grow ml-9 flex flex-col justify-center py-2 px-4">
                      <CardTitle className="text-sm font-semibold text-orange-700">{`ID: ${releve.id}`}</CardTitle>
                      <CardDescription className="text-xs mt-1 text-gray-600">{`Compte: ${releve.numero_compte}`}</CardDescription>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Date: </span>
                          <span className="font-medium text-gray-900">{new Date(releve.date_operation).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Montant: </span>
                          <span className="font-medium text-gray-900">
                            {releve.debit ? `-${formatMontant(releve.debit)}` : 
                            releve.credit ? formatMontant(releve.credit) : 
                            formatMontant(0)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Description: </span>
                          <span className="font-medium text-gray-900">{releve.description}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <DetailDialog title={`Relevé : ${releve.id}`} entity={releve} />
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <div className="flex-none mb-4 flex justify-end">
              <div className="relative w-1/2">
                <Input
                  type="text"
                  placeholder="Faire une recherche précise pour matcher..."
                  className=" py-2 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col spaxe-y-4 justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  <span className="ml-2">Chargement des grands livres...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md flex items-center space-x-3">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                    <div>
                      <p className="font-bold">Erreur</p>
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredGrandLivres.map((item: any, idx: number) => (
                    <Card key={idx} className="w-full rounded-sm mb-2 shadow-sm bg-blue-100 border-l-4 border-l-blue-500 hover:shadow-md cursor-pointer transition-shadow duration-200">
                      <div className="flex items-center h-24">
                        <div className="p-2 flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedItem === item.id?.toString()}
                            onChange={() => handleCheckboxChange(item.id.toString())}
                            className="h-5 w-5 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex-grow flex flex-col justify-center py-2 px-4">
                          <CardTitle className="text-sm font-semibold text-blue-700">{`ID: ${item.id}`}</CardTitle>
                          <CardDescription className="text-xs mt-1 text-gray-600">{item.libelle}</CardDescription>
                          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-gray-600">Date: </span>
                              <span className="font-medium text-gray-900">{new Date(item.date_ecriture).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Montant: </span>
                              <span className="font-medium text-gray-900">
                                {item.debit ? 
                                  `-${formatMontant(item.debit)}` : 
                                  formatMontant(item.credit)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Compte: </span>
                              <span className="font-medium text-gray-900">{item.compte || item.cpte_alt || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <DetailDialog title={`Grand Livre : ${item.id}`} entity={item} />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-none mt-4 flex justify-center">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white" 
                size="sm" 
                onClick={() => setIsCommentDialogOpen(true)}
                disabled={!selectedItem}
              >
                <Merge size={14} className="mr-1" />
                Matcher
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleMatch)} className="space-y-8">
              <FormField
                control={form.control}
                name="commentaire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commentaire</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez un commentaire..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Valider le matching</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
