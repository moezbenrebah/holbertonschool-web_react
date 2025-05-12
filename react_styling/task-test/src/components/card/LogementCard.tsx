//--- Composant LogementCard ---
//--- Composant pour la gestion des logements ---//

// React imports
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
// UI Components
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
// Icons
import { MdEdit, MdAdd, MdCreditCard, MdShoppingCart, MdKey, MdShoppingBag, MdDelete } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
// Types
import type { Accommodation, Product } from "@/types";
import { type InfoCardFormData, CARDINFORMATION_TYPES } from "@/types/cardTypes";
// Stores
import { useAccommodationStore } from "@/lib/stores/accommodationStore";
import { useStayInfoStore } from "@/lib/stores/useStayInfoStore";
import { useOrderStore } from "@/lib/stores/useOrderStore";
import { useProductStore } from "@/lib/stores/useProductStore";
import { useAuthStore } from "@/lib/stores/useAuthStore";
// Utils
import { toast } from "sonner";


// Custom Components
import LogementDialog from "./dialogs/LogementDialog";
import InfoCardDialog from "./dialogs/InfoCardDialog";
import ProductDialog from "./dialogs/ProductDialog";
import AccessCodeDialog from "./dialogs/AccessCodeDialog";
import OrderDialog from "./dialogs/OrderDialog";

// Props interface
interface LogementCardProps {
  logement: typeof accommodation.$inferSelect;
  onAddInfoCard: (id: number, data: InfoCardFormData) => Promise<void>;
  onEditInfoCard: (id: number, cardId: number, data: InfoCardFormData) => Promise<void>;
  onDeleteInfoCard?: (id: number, cardId: number) => Promise<void>;
  onAddProduct: (id: number, product: Product) => Promise<void>;
  onEditProduct?: (id: number, productId: number, product: Product) => Promise<void>;
  onDeleteProduct?: (id: number, productId: number) => Promise<void>;
  onGenerateAccessCode: (id: number, startDateTime: Date, endDateTime: Date, email: string) => Promise<void>;
  onAddOrder: (id: number, formData: FormData) => Promise<void>;
  onDeleteAccessCode: (id: number, code: string) => Promise<void>;
}


// Composant avec export nommé
export default function LogementCard({
  logement,
  onAddInfoCard,
  onEditInfoCard,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onGenerateAccessCode,
  onAddOrder,
  onDeleteAccessCode,
  onDeleteInfoCard,
}: LogementCardProps) {
  const { stayInfo, fetchStayInfos } = useStayInfoStore();
  const { deleteAccommodation, updateAccommodation } = useAccommodationStore();
  const { fetchOrders } = useOrderStore();
  const { products, fetchProductsByLogementId, fetchShopInfo } = useProductStore();
  const { user } = useAuthStore();

  // LogementCard - Données initiales
  useEffect(() => {
    console.log("LogementCard - Données initiales:", {
      logementId: logement.accommodation_id,
      photoUrl: logement.photo_url,
      storeImage: logement.photo_url
    });
    // Charger les produits du logement
    fetchProductsByLogementId(logement.accommodation_id);
  }, [logement, logement.photo_url, fetchProductsByLogementId]);

  // Charger les cartes au montage du composant
  useEffect(() => {
    if (user?.users_id) {
      console.log("LogementCard - Chargement des cartes pour l'utilisateur:", user.users_id);
      fetchStayInfos(user.users_id);
    }
  }, [user?.users_id, fetchStayInfos]);

  // Filtrer les cartes pour ce logement spécifique
  const logementStayInfo = useMemo(() => {
    return stayInfo.filter(card => card.accommodation_id === logement.accommodation_id);
  }, [stayInfo, logement.accommodation_id]);

  const imageUrl = logement.photo_url || "/images/default-image.png";

  // LogementCard - Statut de chargement
  const [loading, setLoading] = useState(false);


  /* --------- fonction logement ------------- */

  // Fonction pour supprimer un logement
  const handleDelete = async () => {
	setLoading(true);
    try {
      await deleteAccommodation(logement.accommodation_id);
      toast.success("Le logement a été supprimé avec succès");
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Impossible de supprimer le logement");
    } finally {
      setLoading(false);
    }
  };


  // Fonction pour modifier un logement
  const handleEdit = async (formData: FormData) => {
    try {
      const response = await fetch(`/api/properties/${logement.accommodation_id}`, {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        const updatedData = await response.json();
        updateAccommodation(logement.accommodation_id, updatedData);
        toast.success("Logement modifié avec succès");
      } else {
		const errorData = await response.json();
		toast.error(`Erreur : ${errorData.message || "Modification échouée"}`);
	  }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast.error("Erreur lors de la modification");
    }
  };

  // Fonction pour générer un code d'accès
  const handleGenerateCode = (data: any): Promise<void> => {
    console.log("Code généré :", data);
    return onGenerateAccessCode(
      logement.accommodation_id,
      data.startDateTime,
      data.endDateTime,
      data.email
    );
  };

  // Fonction pour soumettre une commande
  const onSubmitOrder = async (data: any) => {
    try {
      await fetchOrders(logement.accommodation_id);
    } catch (error) {
      toast.error("Erreur lors de la lecture des commandes");
    }
  };

  // Fonction pour modifier une carte d'information
  const handleEditInfoCard = async (id: number, cardId: number, data: InfoCardFormData) => {
    try {
      console.log("LogementCard - Tentative de modification d'une carte:", { id, cardId, data });
      await onEditInfoCard(id, cardId, data);
    } catch (error) {
      console.error("LogementCard - handleEditInfoCard - Erreur:", error);
      toast.error("Erreur lors de la modification de la carte");
    }
  };

  // Fonction pour ajouter une carte d'information
  const handleAddInfoCard = async (id: number, data: InfoCardFormData) => {
    try {
      console.log("LogementCard - Ajout d'une carte:", { id, data });
      const result = await onAddInfoCard(id, data);
      console.log("LogementCard - Résultat de l'ajout:", result);

      if (!result) {
        throw new Error("Aucun résultat reçu de onAddInfoCard");
      }

      await fetchProductsByLogementId(logement.accommodation_id);
      return result;
    } catch (error) {
      console.error("LogementCard - handleAddInfoCard - Erreur:", error);
      toast.error("Erreur lors de l'ajout de la carte");
      throw error;
    }
  };

  // Fonction pour supprimer une carte d'information
  const handleDeleteInfoCard = async (id: number, cardId: number) => {
    try {
      console.log("LogementCard - Tentative de suppression d'une carte:", { id, cardId });
      await onDeleteInfoCard(id, cardId);
    } catch (error) {
      console.error("LogementCard - handleDeleteInfoCard - Erreur:", error);
      toast.error("Erreur lors de la suppression de la carte");
    }
  };

  // Fonction pour ajouter un produit
  const handleAddProduct = async (id: number, product: Product) => {
    try {
      console.log("LogementCard - Ajout du produit:", { id, product });
      if (typeof onAddProduct !== 'function') {
        console.error("❌ onAddProduct n'est pas une fonction:", onAddProduct);
        toast.error("Erreur: fonction de création non disponible");
        return;
      }

      // Valider les données du produit
      if (!product.name || product.price === undefined) {
        toast.error("Le nom et le prix sont requis");
        return;
      }

      // Préparer les données du produit
      const productToAdd = {
        name: product.name,
        description: product.description || null,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        image_url: product.image_url || null,
        stock: typeof product.stock === 'string' ? parseInt(product.stock) : product.stock || 0,
        uuid: crypto.randomUUID(),
        shop_id: 0, // Sera défini par le store
        product_id: 0, // Sera défini par la base de données
        created_at: new Date(),
        updated_at: new Date()
      };

      console.log("LogementCard - Données du produit formatées:", productToAdd);
      await onAddProduct(id, productToAdd);
      await fetchProductsByLogementId(logement.accommodation_id);
      toast.success("Produit ajouté avec succès");
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Erreur lors de l\'ajout du produit');
    }
  };

  // Fonction pour charger les produits du shop
  const handleViewShop = async () => {
    try {
      await fetchShopInfo(logement.accommodation_id);
      await fetchProductsByLogementId(logement.accommodation_id);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast.error("Erreur lors du chargement des produits");
    }
  };

  const defaultProduct: Product = {
    product_id: 0,
    uuid: crypto.randomUUID(),
    name: '',
    description: null,
    price: 0,
    image_url: null,
    stock: 0,
    shop_id: 0,
    created_at: null,
    updated_at: null
  };

  return (
    <div className="group bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]
      hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300">
      {/* Image Container avec effet de zoom */}
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <Image
          src={imageUrl}
          alt={logement.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
          width={400}
          height={300}
          quality={100}
        />
        {/* Actions Overlay qui apparaît au survol */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <LogementDialog logement={logement} onSubmit={handleEdit} onDelete={handleDelete}>
            <button className="p-2 bg-white/90 hover:bg-amber-400 rounded-full shadow-lg transition-colors">
              <MdEdit className="text-gray-700 text-xl" />
            </button>
          </LogementDialog>
          <button
            onClick={handleDelete}
            title="Supprimer le logement"
            className="p-2 bg-white/90 hover:bg-red-400 rounded-full shadow-lg transition-colors"
          >
            <MdDelete className="text-gray-700 text-xl" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{logement.name}</h2>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
            {logement.type}
          </span>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-gray-600">
              <IoDocumentText className="w-4 h-4 mr-2" />
              <span className="text-sm">{logementStayInfo.length} carte(s) d'information</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MdShoppingCart className="w-4 h-4 mr-2" />
              <span className="text-sm">{logement.products?.length || 0} produit(s) dans le shop</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MdShoppingBag className="w-4 h-4 mr-2" />
              <span className="text-sm">{logement.orders?.length || 0} commande(s)</span>
            </div>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="space-y-4">
          {/* Cartes d'information */}
          <div className="grid grid-cols-2 gap-3">
            <InfoCardDialog
              id={logement.accommodation_id}
              cardInfo={undefined}
              onAddInfoCard={handleAddInfoCard}
              onEditInfoCard={handleEditInfoCard}
              onDeleteInfoCard={handleDeleteInfoCard}
            >
              <button className="w-full px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg">
                <IoDocumentText className="w-4 h-4" />
                <span className="font-medium">Nouvelle carte</span>
              </button>
            </InfoCardDialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full px-4 py-2.5 bg-white border border-amber-200 hover:bg-amber-50 text-gray-900 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg">
                  <MdCreditCard className="w-4 h-4" />
                  <span className="font-medium">Voir les cartes</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-slate-50">
                <DialogHeader>
                  <DialogTitle>Cartes d'information - {logement.name}</DialogTitle>
                  <DialogDescription>
                    Voir les cartes d'information pour ce logement
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-h-[70vh] overflow-y-auto">
                  {logementStayInfo.map((card) => (
                    <div key={card.stay_info_id} className="bg-white p-4 rounded-xl shadow-xl border border-gray-300">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{card.title}</h3>
                        <span className="text-sm text-gray-600 px-2 py-1 bg-amber-400 rounded">
                          {card.category}
                        </span>
                      </div>
                      {card.photo_url && (
                        <div className="relative h-40 mb-2">
                          <Image
                            src={card.photo_url}
                            alt={card.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <p className="text-gray-600 text-sm">{card.description}</p>
                      <div className="mt-4 flex justify-end gap-2">
                        <InfoCardDialog
                          id={logement.accommodation_id}
                          cardInfo={card}
                          onAddInfoCard={handleAddInfoCard}
                          onEditInfoCard={handleEditInfoCard}
                          onDeleteInfoCard={handleDeleteInfoCard}
                        >
                          <button
                            className="p-2 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors">
                            <MdEdit className="text-amber-600 w-4 h-4" />
                          </button>
                        </InfoCardDialog>
                        <button
                          onClick={() => handleDeleteInfoCard(logement.accommodation_id, card.stay_info_id)}
                          className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors">
                          <MdDelete className="text-red-600 w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Produits */}
          <div className="grid grid-cols-2 gap-3">
            <ProductDialog
              initialProduct={defaultProduct}
              onSave={async (product) => {
                await handleAddProduct(logement.accommodation_id, product);
              }}
              mode="create"
            >
              <button className="w-full px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900
                rounded-xl transition-all duration-300 flex items-center justify-center gap-2
                shadow-[0_4px_10px_rgb(251,191,36,0.3)] hover:shadow-[0_6px_15px_rgb(251,191,36,0.4)]">
                <MdAdd className="w-4 h-4" />
                <span className="font-medium">Ajout produit</span>
              </button>
            </ProductDialog>

            <Dialog>
              <DialogTrigger asChild>
                <button
                  onClick={handleViewShop}
                  className="w-full px-4 py-2.5 bg-white border border-amber-200 hover:bg-amber-50
                    text-gray-900 rounded-xl transition-all duration-300 flex items-center justify-center gap-2
                    shadow-[0_4px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.12)]">
                  <MdShoppingCart className="w-4 h-4" />
                  <span className="font-medium">Voir le shop</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-slate-50">
                <DialogHeader>
                  <DialogTitle>Shop - {logement.name}</DialogTitle>
                  <DialogDescription>
                    Voir les produits disponibles dans ce logement
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-h-[70vh] overflow-y-auto">
                  {products?.map((product) => (
                    <div key={product.product_id} className="bg-white p-4 rounded-xl shadow-xl border border-gray-300">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <span className="text-sm text-gray-600 px-2 py-1 bg-amber-400 rounded">
                          {product.price}€
                        </span>
                      </div>
                      {product.image_url && (
                        <div className="relative h-40 mb-2">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <p className="text-gray-600 text-sm">{product.description}</p>
                      <p className="text-sm text-gray-500 mt-2">Stock: {product.stock}</p>
                      <div className="mt-4 flex justify-end gap-2">
                        <ProductDialog
                          initialProduct={product}
                          onSave={async (updatedProduct) => {
                            if (onEditProduct) {
                              await onEditProduct(logement.accommodation_id, product.product_id, updatedProduct);
                            }
                          }}
                          mode="edit"
                        >
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MdEdit className="text-xl" />
                          </button>
                        </ProductDialog>
                        {onDeleteProduct && (
                          <button
                            onClick={() => onDeleteProduct(logement.accommodation_id, product.product_id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <MdDelete className="text-xl text-red-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Codes et Commandes */}
          <div className="grid grid-cols-2 gap-3">
            <AccessCodeDialog onSubmit={handleGenerateCode}>
              <button className="w-full px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg">
                <MdKey className="w-4 h-4" />
                <span className="font-medium">Codes d'accès</span>
              </button>
            </AccessCodeDialog>

            <OrderDialog
              logementNom={logement.name}
              products={logement.products}
              onSubmit={onSubmitOrder}
            >
              <button className="w-full px-4 py-2.5 bg-white border border-amber-200 hover:bg-amber-50 text-gray-900 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg">
                <MdShoppingBag className="w-4 h-4" />
                <span className="font-medium">Commandes</span>
              </button>
            </OrderDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
