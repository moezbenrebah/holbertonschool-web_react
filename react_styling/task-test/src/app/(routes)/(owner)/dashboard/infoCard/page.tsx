"use client"

import { useEffect, useState } from 'react'
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { useAccommodationStore } from "@/lib/stores/accommodationStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { Plus, Home, Building2, Trash2, Edit2, Eye, FileText, Image, Tag } from 'lucide-react'
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
import InfoCardDialog from "@/components/card/dialogs/InfoCardDialog"
import InfoCard from "@/components/card/InfoCard"
import { useStayInfoStore } from "@/stores/useStayInfoStore"
import { stayInfo, accommodation } from '@/db/appSchema'
import { ShopSelector, AccommodationInfo } from "@/components/ui/shop-selector"

type StayInfoCard = typeof stayInfo.$inferSelect;
type AccommodationWithStayInfo = {
  accommodation_id: number;
  uuid: string;
  users_id: string;
  name: string;
  type: string;
  photo_url: string | null;
  description: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  zipcode: string;
  country: string;
  created_at: Date | null;
  updated_at: Date | null;
  stayInfo: StayInfoCard[];
};

export default function InfoCardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { accommodationInfo, fetchAccommodationInfo } = useAccommodationStore();
  const { addStayInfo, updateStayInfo, deleteStayInfo } = useStayInfoStore();
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInfoCard, setSelectedInfoCard] = useState<StayInfoCard | null>(null);

	useEffect(() => {
    console.log('🔄 InfoCardPage - Initialisation...');
    console.log('👤 Données utilisateur:', user);

    if (!user?.users_id) {
      console.log('⏳ En attente de l\'initialisation de l\'utilisateur...');
		  return;
		}

    console.log('🔄 Chargement des données pour userId:', user.users_id);
    fetchAccommodationInfo(user.users_id);
  }, [user?.users_id, fetchAccommodationInfo]);

  const handleAccommodationSelect = (accommodationId: number) => {
    console.log('🏠 Sélection de l\'hébergement:', accommodationId);
    setSelectedAccommodationId(accommodationId);
  };

  const handleAddInfoCard = async (logementId: number, data: any) => {
    try {
      await addStayInfo(logementId, {
        ...data,
        accommodation_id: logementId,
        uuid: crypto.randomUUID()
      });
      await fetchAccommodationInfo(user?.users_id || '');
	  } catch (error) {
      console.error('Erreur lors de l\'ajout de la carte:', error);
      throw error;
	  }
	};

  const handleEditInfoCard = async (logementId: number, cardId: number, data: any) => {
	  try {
      await updateStayInfo(cardId, {
		  ...data,
        stay_info_id: cardId,
        accommodation_id: logementId
      });
      await fetchAccommodationInfo(user?.users_id || '');
	  } catch (error) {
      console.error('Erreur lors de la modification de la carte:', error);
		throw error;
    }
  };

  const handleDeleteInfoCard = async (logementId: number, cardId: number) => {
    try {
      await deleteStayInfo(cardId);
      await fetchAccommodationInfo(user?.users_id || '');
	  } catch (error) {
      console.error('Erreur lors de la suppression de la carte:', error);
      throw error;
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
              <BreadcrumbLink className="text-xl font-semibold text-amber-500" href="/dashboard/infoCard">
                Cartes d'information
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
              <h1 className="text-4xl font-bold mb-2">Cartes d'information</h1>
              <p className="text-gray-600 text-lg">Gérez les informations de vos hébergements.</p>
            </div>
            <ShopSelector
              accommodations={accommodationInfo as AccommodationInfo[]}
              selectedAccommodationId={selectedAccommodationId}
              onSelect={handleAccommodationSelect}
            />
          </div>
			  </div>

        {!selectedAccommodationId ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <p className="text-lg text-gray-600">Veuillez sélectionner un hébergement pour voir ses cartes d'information.</p>
          </div>
        ) : (
          <>
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total des cartes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {accommodationInfo?.find(acc => acc.accommodation_id === selectedAccommodationId)?.stayInfo?.length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Catégories</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Set(accommodationInfo?.find(acc => acc.accommodation_id === selectedAccommodationId)?.stayInfo?.map(info => info.category) || []).size}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {accommodationInfo?.find(acc => acc.accommodation_id === selectedAccommodationId)?.stayInfo?.filter(info => info.category === 'article').length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Images</CardTitle>
                  <Image className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {accommodationInfo?.find(acc => acc.accommodation_id === selectedAccommodationId)?.stayInfo?.filter(info => info.photo_url).length || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des cartes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium md:text-xl">Cartes d'information</CardTitle>
                <div className="flex items-center gap-2">
                  <InfoCardDialog
                    id={selectedAccommodationId}
                    onAddInfoCard={async (id, data) => {
                      await handleAddInfoCard(id, data);
                      return {
                        stay_info_id: 0,
                        accommodation_id: id,
                        title: data.title,
                        description: data.description,
                        category: data.category,
                        photo_url: data.photo_url,
                        created_at: new Date(),
                        updated_at: new Date()
                      };
                    }}
                    onEditInfoCard={async (id, cardId, data) => {
                      await handleEditInfoCard(id, cardId, data);
                      return {
                        stay_info_id: cardId,
                        accommodation_id: id,
                        title: data.title,
                        description: data.description,
                        category: data.category,
                        photo_url: data.photo_url,
                        created_at: new Date(),
                        updated_at: new Date()
                      };
                    }}
                    onDeleteInfoCard={(cardId) => handleDeleteInfoCard(selectedAccommodationId, cardId)}
                  >
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvelle carte
                    </Button>
                  </InfoCardDialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {accommodationInfo?.find(acc => acc.accommodation_id === selectedAccommodationId)?.stayInfo?.map((card) => (
                    <InfoCard
                      key={card.stay_info_id}
                      cardInfo={{
                        stay_info_id: card.stay_info_id,
                        title: card.title,
                        description: card.description,
                        category: card.category,
                        photo_url: card.photo_url,
                        accommodation_id: selectedAccommodationId,
                        created_at: new Date(),
                        updated_at: new Date()
                      }}
                      onUpdateImage={() => {}}
                      onEditInfoCard={(cardId, data) => handleEditInfoCard(selectedAccommodationId, cardId, data)}
                      onAddInfoCard={(data) => handleAddInfoCard(selectedAccommodationId, data)}
                      onDeleteInfoCard={(cardId) => handleDeleteInfoCard(selectedAccommodationId, cardId)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
			  )}
			</div>
		</>
	);
}
