//--- Composant InfoCardDialog ---
//--- Composant pour la gestion des cartes d'informations ---//

"use client";

// React imports
import { useState, useCallback, useEffect } from "react";
// UI Components
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
// Custom Components
import InfoCardForm from "../forms/InfoCardForm";
import type { InfoCardFormData } from "@/types/cardTypes";
// Types
import { stayInfo } from "@/db/appSchema";
import * as Dialog from '@radix-ui/react-dialog'
import { X } from "lucide-react";


// Types
type InfoCardDialogProps = {
	id: number;
	logementNom?: string;
	cardInfo?: typeof stayInfo.$inferSelect;
	onAddInfoCard: (id: number, data: InfoCardFormData) => Promise<typeof stayInfo.$inferSelect>;
	onEditInfoCard: (id: number, cardId: number, data: InfoCardFormData) => Promise<typeof stayInfo.$inferSelect>;
	onDeleteInfoCard?: (id: number, cardId: number) => Promise<void>;
	children: React.ReactNode;
};

export default function InfoCardDialog({
	id,
	cardInfo,
	onEditInfoCard,
	onAddInfoCard,
	onDeleteInfoCard,
	children
}: InfoCardDialogProps) {
	console.log("InfoCardDialog - Props reçues:", { id, cardInfo });

	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);

	// Gestion de l'ouverture du dialogue
	const handleOpenChange = useCallback((newOpen: boolean) => {
		setOpen(newOpen);
		// Réinitialiser le formulaire quand on ferme le dialogue
		if (!newOpen) {
			setIsLoading(false);
		}
	}, []);

	// Gestion de la soumission du formulaire
	const handleSubmit = async (data: InfoCardFormData) => {
		console.log("🚀 Début handleSubmit avec data:", data);
		console.log("📝 Données brutes reçues:", {
			title: data.title,
			category: data.category,
			description: data.description,
			accommodation_id: data.accommodation_id,
			photo_url: data.photo_url
		});

		try {
			setIsLoading(true);
			if (!id) {
				throw new Error("ID manquant");
			}

			if (!data) {
				throw new Error("Données du formulaire manquantes");
			}

			// Validation des champs requis
			if (!data.title?.trim()) {
				throw new Error("Le titre est requis");
			}

			if (!data.description?.trim()) {
				throw new Error("La description est requise");
			}

			if (!data.category) {
				throw new Error("La catégorie est requise");
			}

			if (!cardInfo) {
				// Mode création
				console.log("📝 Mode création - Données à envoyer:", { id, data });

				if (!onAddInfoCard) {
					throw new Error("Fonction de création non disponible");
				}

				try {
					const result = await onAddInfoCard(id, data);
					console.log("✅ Résultat de la création:", result);

					if (!result) {
						console.error("Aucun résultat reçu de onAddInfoCard");
						throw new Error("La création a échoué - Aucun résultat reçu");
					}

					toast.success("Carte créée avec succès");
					handleOpenChange(false);
					return result;
				} catch (error) {
					console.error("❌ Erreur lors de la création:", error);
					toast.error(error instanceof Error ? error.message : "Erreur lors de la création");
					throw error;
				}
			} else {
				// Mode édition
				console.log("📝 Mode édition - Données à envoyer:", {
					id,
					cardId: cardInfo.stay_info_id,
					data
				});

				if (!onEditInfoCard) {
					throw new Error("Fonction de modification non disponible");
				}

				const result = await onEditInfoCard(id, cardInfo.stay_info_id, data);
				console.log("✅ Résultat de la modification:", result);

				if (!result) {
					throw new Error("La modification a échoué - Aucun résultat reçu");
				}

				toast.success("Carte modifiée avec succès");
				handleOpenChange(false);
				return result;
			}
		} catch (error) {
			console.error("❌ Erreur détaillée lors de la soumission:", error);
			toast.error(error instanceof Error ? error.message : "Une erreur est survenue lors de la soumission");
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Ajout d'un log pour vérifier les props reçues
	useEffect(() => {
		console.log("Props InfoCardDialog:", {
			id,
			hasCardInfo: !!cardInfo,
			hasOnAddInfoCard: !!onAddInfoCard,
			hasOnEditInfoCard: !!onEditInfoCard,
			hasOnDeleteInfoCard: !!onDeleteInfoCard
		});
	}, [id, cardInfo, onAddInfoCard, onEditInfoCard, onDeleteInfoCard]);

	return (
		<Dialog.Root open={open} onOpenChange={handleOpenChange}>
			<Dialog.Trigger asChild>
				<div onClick={() => handleOpenChange(true)}>
					{children}
				</div>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="bg-black/60 fixed inset-0 backdrop-blur-sm transition-all duration-300" />
				<Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
					bg-white rounded-2xl shadow-2xl
					overflow-hidden
					w-full max-w-2xl
					transition-all duration-300 ease-in-out
					scale-100 opacity-100
					data-[state=closed]:scale-95 data-[state=closed]:opacity-0">

					<DialogHeader className="p-6 bg-gradient-to-r from-amber-400 to-amber-500 border-b">
						<DialogTitle className="text-2xl font-bold text-white">
							{cardInfo ? "Modifier la carte" : "Nouvelle carte"}
						</DialogTitle>
						<DialogDescription className="text-white/90 mt-1 text-md">
							{cardInfo ? "Modifier les informations de la carte" : "Créer une nouvelle carte d'information"}
						</DialogDescription>
					</DialogHeader>

					<div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
						<InfoCardForm
							cardInfo={cardInfo}
							onSubmit={handleSubmit}
							isLoading={isLoading}
							id={id}
							onCancel={() => handleOpenChange(false)}
						/>
					</div>

					<Dialog.Close className="absolute top-4 right-4 p-2 rounded-full
						bg-white/10 hover:bg-white/20
						text-white transition-colors">
						<X className="w-4 h-4" />
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
