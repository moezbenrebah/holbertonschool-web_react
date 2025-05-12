"use client"

import { useEffect } from 'react'
import { Bell, Home, MessageSquare, Package, Settings, ShieldCheck, CreditCard, TrendingUp, Trash} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart } from "@tremor/react"
import Link from 'next/link'
import { useDashboardStore } from '@/lib/stores/dashboardStore'
import { useAuthStore } from '@/lib/stores/authStore'
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
import { type ChartConfig } from "@/components/ui/chart"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useAccommodationStore } from '@/lib/stores/accommodationStore'
import { useOrderStore } from '@/lib/stores/useOrderStore'
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { queryClient } from "@/lib/react-query";
import Image from 'next/image'


type StatCardProps = {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  description: string;
  linkHref: string;
  linkText: string;
}

const StatCard = ({ title, icon, value, description, linkHref, linkText }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-lg font-medium md:text-xl">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="mb-3 text-2xl font-bold">{value}</div>
      <p className="text-md text-muted-foreground">{description}</p>
      <Button asChild className="mt-4 shadow-lg text-gray-900 text-md bg-amber-400 rounded-xl hover:bg-amber-500 transition-colors">
        <Link href={linkHref}>{linkText}</Link>
      </Button>
    </CardContent>
  </Card>
)

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="p-4 rounded-lg bg-red-100 text-red-800">
    <h2 className="font-bold mb-2">Erreur</h2>
    <p>{message}</p>
  </div>
)

const calculateGlobalStats = (properties: any[] = []) => ({
  totalSales: properties.reduce((sum, prop) => sum + prop.totalSales, 0),
  totalPendingOrders: properties.reduce((sum, prop) => sum + prop.pendingOrders, 0),
  totalUnreadMessages: properties.reduce((sum, prop) => sum + prop.unreadMessages, 0),
  totalProperties: properties.length,
  activeCodes: properties.reduce((sum, prop) => sum + (prop.activeCodes || 0), 0),
})


// Déplacer les données statiques vers une constante
const INITIAL_CHART_DATA = [
  { month: "Janvier", totalSales: 186 },
  { month: "Février", totalSales: 305 },
  { month: "Mars", totalSales: 237 },
  { month: "Avril", totalSales: 73 },
  { month: "Mai", totalSales: 209 },
  { month: "Juin", totalSales: 214 },
] as const

// Typer la configuration du graphique
type ChartDataConfig = {
  label: string;
  color: string;
}

const chartConfig: Record<string, ChartDataConfig> = {
  totalSales: {
    label: "Commandes",
    color: "#fbbf24",
  },
}

// Ajoutez l'interface pour les codes d'accès
interface AccessCode {
  access_code_id: number;
  accommodation_id: number;
  created_date: string;
  expiration_date: string;
  isActive: boolean;
  code: string;
  contact: string;
  contact_method: string;
  accommodation_name: string | null;
}

export default function Dashboard() {
  const { isLoading, error, fetchDashboardData } = useDashboardStore()
  const { user } = useAuthStore()
  const { accommodationInfo } = useAccommodationStore()
  const { orders } = useOrderStore()

  // Ajoutez le hook useQuery pour les codes d'accès
  const { data: accessCodes, isLoading: isLoadingCodes } = useQuery<AccessCode[]>({
    queryKey: ["access-codes"],
    queryFn: async () => {
      const response = await fetch('/api/access-codes');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des codes');
      }
      const data = await response.json();
      return data.accessCodes;
    }
  });

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (isLoading) return null; // Le spinner sera géré par le layout

  if (error) return <ErrorDisplay message={error} />

  const globalStats = calculateGlobalStats(accommodationInfo || [])

  const chartData = [
	{ month: "January", totalSales: 186 },
	{ month: "February", totalSales: 305 },
	{ month: "March", totalSales: 237 },
	{ month: "April", totalSales: 73 },
	{ month: "May", totalSales: 209 },
	{ month: "June", totalSales: 214 },
	{ month: "July", totalSales: 190 },
	{ month: "August", totalSales: 240 },
	{ month: "September", totalSales: 150 },
	{ month: "October", totalSales: 200 },
	{ month: "November", totalSales: 220 },
	{ month: "December", totalSales: 214 },
  ]

  const chartConfig = {
	totalSales: {
	  label: "Commandes",
	  color: "orange"
	},

  } satisfies ChartConfig

  // Fonction pour supprimer un code
  const handleDeleteCode = async (codeId: number) => {
    try {
      const response = await fetch(`/api/access-codes/${codeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Recharger les données après la suppression
      queryClient.invalidateQueries({ queryKey: ['access-codes'] });
      toast.success('Code supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression du code');
    }
  };

  return (
<>
<div className="flex items-center gap-4 p-4">
      <SidebarTrigger className="text-xl" />
	  <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-xl" href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>
    </div>

    <div className="container p-4 mx-auto md:px-16 md:py-8 sm:px-8 sm:py-4 ">
      <div className="grid gap-6 mt-6 md:grid-cols-2 sm:grid-cols-1">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg pb-2 font-medium md:text-xl">
              Totales de Vente
            </CardTitle>
            <TrendingUp className="w-8 h-8 text-amber-400" />
          </CardHeader>
          <CardContent>
            <BarChart
              data={chartData}
              index="month"
              categories={["totalSales"]}
              colors={["orange"]}
              className="min-h-[300px] w-full mt-4"
              yAxisWidth={48}
              showLegend={true}
              valueFormatter={(value) => `${value}€`}
              showAnimation={true}
              showGridLines={false}
            />
			<div className="flex flex-row py-8 justify-around sm:flex-col sm:items-center sm:gap-4 sm:py-4 sm:w-full sm:px-4 sm:text-center sm:text-xs">
				<div className="flex flex-col bg-slate-200 p-4 rounded-xl items-center sm:w-full sm:px-4 sm:text-center sm:text-xs">
					<h1 className="text-3xl font-light text-gray-700 mt-2">Total des Ventes</h1>
					<p className="text-4xl mt-4"> {globalStats.totalSales}€</p>
				</div>
				<div className="flex flex-col bg-amber-300 p-4 rounded-xl items-center sm:w-full sm:px-4 sm:text-center sm:text-xs">
					<h1 className="text-3xl text-gray-700 font-light mt-2">Ventes Mensuelles</h1>
					<p className="text-4xl mt-4"> {globalStats.totalSales}€</p>
				</div>
			</div>
          </CardContent>
        </Card>


	<div className="grid gap-6 md:grid-cols-2 sm:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row lg:flex-row md:flex-col items-center justify-between pb-2 space-y-0 sm:flex-col">
            <CardTitle className="text-lg font-medium md:text-lg sm:text-base sm:text-center">Commandes</CardTitle>
            <Package className="w-8 h-8 text-amber-400 text-muted-foreground md:w-6 sm:w-6 md:h-6 sm:h-6" />
          </CardHeader>
          <CardContent className="md:text-center sm:text-center">
            <div className="mb-3 text-2xl font-bold md:text-xl md:mb-4 sm:text-lg sm:mb-2">
              {globalStats.totalPendingOrders} commandes
            </div>
            <p className="text-md text-muted-foreground md:text-sm md:mb-4 sm:text-sm sm:mb-2">
              À traiter sur l'ensemble des shops
            </p>
            <Button asChild className="mt-4 shadow-lg text-gray-900 text-md bg-amber-400 rounded-xl hover:bg-amber-500 transition-colors md:w-full sm:text-xs sm:w-full">
              <Link href="/properties/shops">Voir les commandes</Link>
            </Button>
          </CardContent>
        </Card>


		{/* Messagerie */}
		<Card>
          <CardHeader className="flex flex-row lg:flex-row md:flex-col items-center justify-between pb-2 space-y-0 sm:flex-col">
            <CardTitle className="text-lg font-medium md:text-lg sm:text-base sm:text-center">Messagerie</CardTitle>
            <MessageSquare className="w-8 h-8 text-amber-400 text-muted-foreground md:w-6 sm:w-6 md:h-6 sm:h-6" />
          </CardHeader>
          <CardContent className="md:text-center sm:text-center">
            <div className="mb-3 text-2xl font-bold md:text-xl md:mb-4 sm:text-lg sm:mb-2">
              {globalStats.totalUnreadMessages} messages non lus
            </div>
            <p className="text-md text-muted-foreground md:text-sm md:mb-4 sm:text-sm sm:mb-2">
              {globalStats.totalUnreadMessages === 0 ? "Vous êtes à jour" : "Nouveaux messages"}
            </p>
            <Button asChild className="mt-4 shadow-lg text-gray-900 text-md bg-amber-400 rounded-xl hover:bg-amber-500 transition-colors md:w-full md:text-xs sm:w-full sm:text-xs">
              <Link href="/properties/messages">Voir les messages</Link>
            </Button>
          </CardContent>
        </Card>


		{/* Codes d'accès */}
		<Card className="col-span-2">
          <CardHeader className="flex flex-row lg:flex-row md:flex-col items-center justify-between pb-2 space-y-0 sm:flex-col">
            <CardTitle className="text-lg font-medium md:text-lg sm:text-base sm:text-center">Codes d'accès</CardTitle>
            <ShieldCheck className="w-8 h-8 text-amber-400 text-muted-foreground md:w-6 sm:w-6 md:h-6 sm:h-6" />
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[210px] w-full rounded-md border md:h-[250px] sm:h-[300px]">
              <Table>
                <TableHeader className="bg-slate-200 border-b">
                  <TableRow>
                    <TableHead className="text-md text-gray-700 font-semibold text-center md:text-sm sm:text-xs">Date de création</TableHead>
                    <TableHead className="text-md text-gray-700 font-semibold text-center md:text-sm sm:text-xs">Logement</TableHead>
                    <TableHead className="text-md text-gray-700 font-semibold text-center md:text-sm sm:text-xs">Statut</TableHead>
                    <TableHead className="text-md text-gray-700 font-semibold text-center md:text-sm sm:text-xs md:hidden sm:hidden">Date d'expiration</TableHead>
                    <TableHead className="text-md text-gray-700 font-semibold text-center md:text-sm sm:text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingCodes ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Chargement...
                      </TableCell>
                    </TableRow>
                  ) : accessCodes && accessCodes.length > 0 ? (
                    accessCodes.map((code) => (
                      <TableRow key={code.access_code_id} className="hover:bg-slate-100">
                        <TableCell className="font-medium text-center md:text-sm sm:text-xs">
                          {new Date(code.created_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium text-center md:text-sm sm:text-xs">
                          {code.accommodation_name || 'Non défini'}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`px-3 py-1 text-sm rounded-full font-medium md:text-xs sm:text-xs md:px-2 sm:px-2 ${
                            code.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {code.isActive ? "Actif" : "Expiré"}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium text-center md:hidden sm:hidden">
                          {new Date(code.expiration_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCode(code.access_code_id)}
                            className="hover:bg-red-600 transition-colors md:text-xs sm:text-xs md:px-2 sm:px-2"
                          >
                            <Trash className="h-4 w-4 mr-2 md:h-3 sm:h-3 md:w-3 sm:w-3" />
                            <span className="md:hidden sm:hidden">Supprimer</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                        Aucun code d'accès trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
            <div className="flex justify-between items-center mt-4 md:flex-col sm:flex-col md:gap-4 sm:gap-4">
              <Button
                asChild
                className="shadow-lg text-gray-900 text-md bg-amber-400 rounded-xl hover:bg-amber-500 transition-colors md:w-full sm:w-full"
              >
                <Link href="/dashboard/acessCode">Gérer les codes</Link>
              </Button>
              <p className="text-sm text-muted-foreground md:text-center sm:text-center">
                {accessCodes?.filter(code => code.isActive).length || 0} codes actifs
              </p>
            </div>
          </CardContent>
        </Card>
		</div>


		{/* Gestion des logements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium md:text-xl">Gestion des logements</CardTitle>
            <Home className="w-8 h-8 text-amber-400 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-md">Gérez les détails de vos propriétés</p>
            <Button asChild className="mt-2 shadow-lg text-gray-900 text-md bg-amber-400 rounded-xl hover:bg-amber-500 transition-colors">
              <Link href="/dashboard/property">Gérer les logements</Link>
            </Button>
          </CardContent>
        </Card>


		{/* Cartes d'information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium md:text-xl">Cartes d&apos;information</CardTitle>
            <CreditCard className="w-8 h-8 text-amber-400 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-md">Gérez les cartes de tous vos logements</p>
            <Button asChild className="mt-2 shadow-lg text-gray-900 text-md bg-amber-400 rounded-xl hover:bg-amber-500 transition-colors">
              <Link href="/dashboard/infoCard">Gérer les cartes</Link>
            </Button>
          </CardContent>
        </Card>

      </div>

      {/* Notifications */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Notifications récentes</CardTitle>
          <CardDescription>Vos 5 dernières notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {/* Assuming notifications are fetched from the dashboard store */}
            {/* Replace this with actual notifications from the store */}
            {/* For example: */}
            {/* {notifications.slice(0, 5).map((notification) => ( */}
            {/*   <li key={notification.id} className="flex items-center"> */}
            {/*     <Bell className="w-6 h-6 mr-2" /> */}
            {/*     <span>{notification.message}</span> */}
            {/*   </li> */}
            {/* ))} */}
          </ul>
        </CardContent>
      </Card>
    </div>
	</>
  )
}
