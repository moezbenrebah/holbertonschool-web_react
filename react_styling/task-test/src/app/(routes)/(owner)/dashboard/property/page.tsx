"use client"

import { useEffect, useState } from 'react'
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { useAccommodationStore } from "@/lib/stores/accommodationStore"
import { useStayInfoStore } from "@/lib/stores/useStayInfoStore"
import { useProductStore } from "@/lib/stores/useProductStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Plus, Home, Building2, Trash2, Edit2, Eye } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import LogementDialog from "@/components/card/dialogs/LogementDialog"
import LogementCard from "@/components/card/LogementCard"

export default function PropertyPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { accommodationInfo, fetchAccommodationInfo } = useAccommodationStore();
  const { addStayInfo, updateStayInfo, deleteStayInfo, fetchStayInfosById } = useStayInfoStore();
  const { addProduct, updateProduct, deleteProduct, fetchProductsByLogementId } = useProductStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const handleAddInfoCard = async (id: number, data: any) => {
    try {
      console.log('PropertyPage - handleAddInfoCard - Données reçues:', { id, data });
      const result = await addStayInfo(id, data);
      console.log('PropertyPage - handleAddInfoCard - Résultat:', result);
      await fetchStayInfosById(id);
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la carte:', error);
      throw error;
    }
  };

  const handleEditInfoCard = async (id: number, cardId: number, data: any) => {
    try {
      const result = await updateStayInfo(id, cardId, {
        ...data,
        accommodation_id: id
      });
      await fetchStayInfosById(id);
      return result;
    } catch (error) {
      console.error('Erreur lors de la modification de la carte:', error);
      throw error;
    }
  };

  const handleDeleteInfoCard = async (id: number, cardId: number) => {
    try {
      await deleteStayInfo(id, cardId);
      await fetchStayInfosById(id);
    } catch (error) {
      console.error('Erreur lors de la suppression de la carte:', error);
      throw error;
    }
  };

  const handleAddProduct = async (logementId: number, product: Product) => {
    try {
      console.log("PropertyPage - Ajout du produit:", { logementId, product });
      const result = await addProduct(logementId, product);
      await fetchProductsByLogementId(logementId);
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      throw error;
    }
  };

  const handleEditProduct = async (logementId: number, productId: number, product: Product) => {
    try {
      await updateProduct(productId, {
        ...product,
        accommodation_id: logementId
      });
      await fetchProductsByLogementId(logementId);
    } catch (error) {
      console.error('Erreur lors de la modification du produit:', error);
      throw error;
    }
  };

  const handleDeleteProduct = async (logementId: number, productId: number) => {
    try {
      await deleteProduct(productId);
      await fetchProductsByLogementId(logementId);
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      throw error;
    }
  };

  const handleGenerateAccessCode = async (logementId: number, startDateTime: Date, endDateTime: Date, email: string) => {
    try {
      // TODO: Implémenter la génération de code d'accès
      console.log("Génération de code d'accès:", { logementId, startDateTime, endDateTime, email });
    } catch (error) {
      console.error('Erreur lors de la génération du code:', error);
      throw error;
    }
  };

  const handleAddOrder = async (logementId: number, formData: FormData) => {
    try {
      // TODO: Implémenter l'ajout de commande
      console.log("Ajout de commande:", { logementId, formData });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la commande:', error);
      throw error;
    }
  };

  const handleDeleteAccessCode = async (logementId: number, code: string) => {
    try {
      // TODO: Implémenter la suppression de code d'accès
      console.log("Suppression de code d'accès:", { logementId, code });
    } catch (error) {
      console.error('Erreur lors de la suppression du code:', error);
      throw error;
    }
  };

  const handleEditLogement = async (formData: FormData) => {
    try {
      // Convertir FormData en objet
      const data = Object.fromEntries(formData.entries());

      // Ajouter l'ID de l'utilisateur
      data.users_id = user.users_id;

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout du logement');
      }

      const result = await response.json();
      await fetchAccommodationInfo(user.users_id);
      toast.success('Logement ajouté avec succès');
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du logement:', error);
      toast.error('Erreur lors de l\'ajout du logement');
      throw error;
    }
  };

  useEffect(() => {
    console.log('🔄 PropertyPage - Initialisation...');
    console.log('👤 Données utilisateur:', user);

    if (!user?.users_id) {
      console.log('⏳ En attente de l\'initialisation de l\'utilisateur...');
      return;
    }

    console.log('🔄 Chargement des données pour userId:', user.users_id);
    fetchAccommodationInfo(user.users_id);
  }, [user?.users_id, fetchAccommodationInfo]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Chargement...</h2>
          <p className="text-muted-foreground">Initialisation de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4 p-6">
        <SidebarTrigger className="text-xl" />
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-gray-600 hover:text-gray-900 transition-colors" href="/dashboard">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-xl font-semibold text-amber-500" href="/dashboard/property">
                Logements
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Gestion des Logements</h1>
          <p className="text-gray-600 text-lg">Gérez vos propriétés et leurs informations.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Carte d'ajout */}
            <div className="overflow-hidden border rounded-lg shadow-sm bg-slate-50 w-full h-[570px] flex flex-col">
              <div className="w-full h-48 bg-amber-100 flex items-center justify-center shrink-0">
                <span className="text-6xl text-amber-400">+</span>
              </div>

              <div className="p-4 flex flex-col h-full">
                <div>
                  <h2 className="mb-2 text-2xl font-semibold">Nouveau logement</h2>
                   <h3 className="mb-2 text-xl text-gray-500">Type de logement</h3>
                </div>

                <div className="space-y-2 mt-24">
                <LogementDialog onSubmit={handleEditLogement} onDelete={async () => {}}>
					<button className="bg-amber-500 rounded-lg w-full px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-amber-400 flex items-center justify-center gap-2">
                    <Plus className="text-xl" /> Ajouter un logement
					</button>
				</LogementDialog>

                  <div className="text-xl space-x-4 text-center text-gray-500">
                    <h2 className="text-xl text-gray-500 animate-pulse mt-10">
                      Vous pouvez ajouter un logement en cliquant sur le bouton ci-dessus
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des logements */}
          {accommodationInfo?.map((logement) => (
              <LogementCard
                key={logement.accommodation_id}
                logement={logement}
              onEditLogement={handleEditLogement}
                onAddInfoCard={handleAddInfoCard}
                onEditInfoCard={handleEditInfoCard}
              onDeleteInfoCard={handleDeleteInfoCard}
                onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
                onGenerateAccessCode={handleGenerateAccessCode}
              onAddOrder={handleAddOrder}
                onDeleteAccessCode={handleDeleteAccessCode}
              />
            ))}
          </div>
        </div>
    </>
  );
}
