"use client"

import { useEffect, useState } from 'react'
import { Package, ShoppingCart, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useAccommodationStore } from "@/lib/stores/accommodationStore"
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { useProductStore } from "@/lib/stores/useProductStore"
import ProductCard from "@/components/card/ProductCard"
import ProductDialog from "@/components/card/dialogs/ProductDialog"
import { ShopSelector } from "@/components/ui/shop-selector"
import { toast } from "sonner"
import type { Product } from "@/types"
import { useOrderStore } from "@/lib/stores/useOrderStore"
import { OrderCard } from "@/components/orders/OrderCard"
import { useSession } from "next-auth/react"

export default function ShopManage() {
  const { data: session } = useSession();
  const { user } = useAuthStore()
  const { accommodationInfo, fetchAccommodationInfo } = useAccommodationStore()
  const { shopInfo, products, isLoading, error, fetchShopInfo, fetchProducts } = useProductStore();
  const { orders: storeOrders, fetchOrders } = useOrderStore();
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<number | null>(null);

  useEffect(() => {
    console.log('🔄 ShopManage - Initialisation...');
    console.log('📦 Session:', session);
    console.log('👤 Données utilisateur:', user);
    console.log('🏠 Données hébergement:', accommodationInfo);
    console.log('🏪 Données shop:', shopInfo);

    if (!session) {
      console.log('⏳ En attente de la session...');
      return;
    }

    if (!user) {
      console.log('⏳ En attente de l\'initialisation de l\'utilisateur...');
      return;
    }

    if (user?.users_id) {
      console.log('🔄 Chargement des données pour userId:', user.users_id);
      fetchAccommodationInfo(user.users_id);
    }
  }, [session, user?.users_id, fetchAccommodationInfo]);

  useEffect(() => {
    if (selectedAccommodationId) {
      console.log('🏠 Hébergement sélectionné:', selectedAccommodationId);
      fetchShopInfo(selectedAccommodationId);
    }
  }, [selectedAccommodationId, fetchShopInfo]);

  useEffect(() => {
    if (shopInfo?.shop_id) {
      fetchProducts(shopInfo.shop_id);
      fetchOrders(shopInfo.shop_id);
    }
  }, [shopInfo?.shop_id, fetchProducts, fetchOrders]);

  const handleAccommodationSelect = (accommodationId: number) => {
    console.log('🏠 Sélection de l\'hébergement:', accommodationId);
    setSelectedAccommodationId(accommodationId);
  };

  const handleAddProduct = async (product: Product) => {
    try {
      if (!shopInfo?.shop_id) {
        throw new Error('Shop info not available');
      }
      const productWithShopId = {
        ...product,
        shop_id: shopInfo.shop_id,
        uuid: crypto.randomUUID()
      };
      const response = await fetch('/api/shop/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productWithShopId)
      });

      if (!response.ok) throw new Error('Erreur création');
      toast.success('Produit créé avec succès');
      fetchProducts(shopInfo.shop_id);
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const handleEditProduct = async (product: Product) => {
    try {
      // TODO: Implémenter la logique de modification du produit
      console.log('Modification du produit:', product);
    } catch (error) {
      console.error('Erreur lors de la modification du produit:', error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      // TODO: Implémenter la logique de suppression du produit
      console.log('Suppression du produit:', productId);
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        <h3 className="font-bold">Erreur</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* En-tête avec navigation */}
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
              <BreadcrumbLink className="text-xl font-semibold text-amber-500" href="/dashboard/ShopManage">
                Boutique
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* En-tête de page */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
          <h1 className="text-4xl font-bold mb-2">Boutique</h1>
          <p className="text-gray-600 text-lg">Gérez ici les produits de votre boutique.</p>
        </div>
            <ShopSelector
              accommodations={accommodationInfo}
              selectedAccommodationId={selectedAccommodationId}
              onSelect={handleAccommodationSelect}
            />
          </div>
        </div>

        {!selectedAccommodationId ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <p className="text-lg text-gray-600">Veuillez sélectionner un hébergement pour accéder à sa boutique.</p>
          </div>
        ) : !shopInfo ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <p className="text-lg text-gray-600">Création de la boutique en cours...</p>
            <p className="text-sm text-gray-500">Veuillez patienter pendant l'initialisation de la boutique.</p>
              </div>
        ) : (
          <>
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total des produits</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Commandes en cours</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{storeOrders.filter(order => order.status === 'pending').length}</div>
            </CardContent>
          </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Commandes complétées</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{storeOrders.filter(order => order.status === 'completed').length}</div>
            </CardContent>
          </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {storeOrders
                      .filter(order => order.status === 'completed')
                      .reduce((total, order) => total + Number(order.amount), 0)
                      .toFixed(2)} €
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commandes en cours */}
            <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium md:text-xl">Commandes en Cours</CardTitle>
            <Package className="w-8 h-8 text-amber-400" />
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md border">
              <Table>
                <TableHeader className="bg-slate-200 border-b">
                  <TableRow>
                    <TableHead className="text-md pt-4 text-gray-700 font-semibold">N° Commande</TableHead>
                    <TableHead className="text-md pt-4 text-gray-700 font-semibold">Client</TableHead>
                    <TableHead className="text-md pt-4 text-gray-700 font-semibold">Logement</TableHead>
                    <TableHead className="text-md pt-4 text-gray-700 font-semibold">Date</TableHead>
                    <TableHead className="text-md pt-4 text-gray-700 font-semibold">Statut</TableHead>
                    <TableHead className="text-md pt-4 text-gray-700 font-semibold text-right">Montant</TableHead>
                    <TableHead className="text-md pt-4 text-gray-700 font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                      {storeOrders.map((order) => (
                        <OrderCard
                          key={order.order_id}
                          order={{
                            ...order,
                            amount: String(order.amount)
                          }}
                        />
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

      {/* Liste des produits */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium md:text-xl">Produits</CardTitle>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-8 h-8 text-amber-400" />
          <ProductDialog onSave={handleAddProduct} mode="create">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un produit
                    </Button>
                  </ProductDialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
            <ProductCard
              key={product.product_id}
              product={{
                ...product,
                price: Number(product.price)
              }}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  )
}
