"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Trash2, Calendar, Building2 } from 'lucide-react';
import AccessCodeDialog from "@/components/card/dialogs/AccessCodeDialog";


// Interface pour les codes d'accès
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

// Page pour gérer les codes d'accès
export default function AccessCodePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  // État pour le filtre de logement
  const [filterLogement, setFilterLogement] = useState<string>("");
  // État pour le filtre de statut
  const [filterStatus, setFilterStatus] = useState<string>("");
  // État pour le filtre de date de début
  const [filterDateStart, setFilterDateStart] = useState<Date>();
  // État pour le filtre de date de fin
  const [filterDateEnd, setFilterDateEnd] = useState<Date>();
  // État pour les codes d'accès
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  // État pour le terme de recherche
  const [searchTerm, setSearchTerm] = useState('')
  // État pour la génération de code d'accès
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  // État pour le chargement des codes d'accès
  const [isLoading, setIsLoading] = useState(true);


  // Récupérer les codes d'accès
  useEffect(() => {
    const fetchAccessCodes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/access-codes');
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        setAccessCodes(data.accessCodes || []);
      } catch (error) {
        console.error("Erreur lors du chargement des codes d'accès:", error);
        toast.error("Erreur lors du chargement des codes d'accès");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccessCodes();
  }, []);



  // Supprimer un code d'accès
  const handleDeleteCode = async (codeId: string) => {
    try {
      const response = await fetch(`/api/access-codes/${codeId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur (${response.status}): ${errorText}`);
      }
      setAccessCodes(prev => prev.filter(code => code.access_code_id.toString() !== codeId));
      toast.success("Code supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du code :", error);
      toast.error("Erreur lors de la suppression du code");
    }
  };

  // Filtrer les codes d'accès
  const filteredCodes = accessCodes.filter((accessCode) => {
    const matchLogement = !filterLogement || accessCode.accommodation_id.toString() === filterLogement;
    const matchStatus = !filterStatus || (accessCode.isActive ? 'Actif' : 'Inactif') === filterStatus;
    const matchDateRange =
      (!filterDateStart || new Date(accessCode.created_date) >= filterDateStart) &&
      (!filterDateEnd || new Date(accessCode.expiration_date) <= filterDateEnd);
    return matchLogement && matchStatus && matchDateRange;
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
	<><div className="flex items-center gap-4 p-4">
	<SidebarTrigger className="text-md" />
	<Separator orientation="vertical" className="mr-2 h-4" />
	<Breadcrumb>
	  <BreadcrumbList>
		<BreadcrumbItem>
		  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
		</BreadcrumbItem>
		<BreadcrumbSeparator />
		<BreadcrumbItem>
		  <BreadcrumbLink className="text-xl text-amber-500">Codes d'accès</BreadcrumbLink>
		</BreadcrumbItem>
	  </BreadcrumbList>
	</Breadcrumb>
  </div>


    <div className="container p-6">
      <Card className="shadow-xl border-0 rounded-xl bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b">
          <div>
            <CardTitle className="text-2xl font-bold">Codes d'accès</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Gérez les accès de vos logements</p>
          </div>
		  <AccessCodeDialog
			onSubmit={async (data) => {
			  console.log("Données soumises:", data);
			  // Ajoute ici ta logique de traitement
			}}
		  >
			<Button className="bg-amber-400 hover:bg-amber-500 text-gray-900 shadow-lg">
			  <Plus className="mr-2 h-4 w-4" />
			  Nouveau code
			</Button>
		  </AccessCodeDialog>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un logement..."
                className="pl-9 py-5 bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-[600px] rounded-xl border bg-gray-50">
            <Table>
              <TableHeader className="bg-gray-100 sticky top-0">
                <TableRow>
                  <TableHead className="font-semibold">Logement</TableHead>
                  <TableHead className="font-semibold">Date de création</TableHead>
                  <TableHead className="font-semibold">Expiration</TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accessCodes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Aucun code d'accès trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  accessCodes.map((code) => (
                    <TableRow key={code.access_code_id} className="hover:bg-gray-100/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Building2 className="h-4 w-4 text-amber-500" />
                          <span className="font-medium">{code.accommodation_name || 'Non défini'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{new Date(code.created_date).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{new Date(code.expiration_date).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={code.isActive ? "default" : "destructive"}
                          className={code.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"}
                        >
                          {code.isActive ? 'Actif' : 'Expiré'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCode(code.access_code_id.toString())}
                          className="hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
	</>
  );
}
