//--- Composant InfoCard ---
//--- Composant pour la gestion des informations ---//

// React imports
import { useEffect, useState } from "react";
import Image from "next/image";
// Third party imports
import { FocusScope } from '@radix-ui/react-focus-scope';
import { MdEdit, MdDelete } from "react-icons/md";
// UI Components
import { Dialog,  DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
// Custom Components
import InfoCardDialog from "./dialogs/InfoCardDialog";
// Types
import { stayInfo } from "@/db/appSchema";
import { InfoCardFormData } from "./forms/InfoCardForm";
// Stores
import { useStayInfoStore } from "@/stores/useStayInfoStore";


// Props pour le composant LogementCard
interface InfoCardProps {
  cardInfo: typeof stayInfo.$inferSelect;
  onUpdateImage: (file: File) => void;
  onEditInfoCard: (logementId: number, cardId: number, data: InfoCardFormData) => Promise<void>;
  onAddInfoCard: (logementId: number, data: InfoCardFormData) => Promise<void>;
  onDeleteInfoCard: (cardId: number) => void;
}


// Composant LogementCard
const InfoCard = ({ cardInfo, onEditInfoCard, onAddInfoCard, onDeleteInfoCard }: InfoCardProps) => {
	console.log("InfoCard - cardInfo:", cardInfo);
	const { updateStayInfo, deleteStayInfo } = useStayInfoStore();
	const [loading, setLoading] = useState(false);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const imageUrl = cardInfo.photo_url || "/images/default-image.png";

	// Vérification des données requises
	if (!cardInfo?.stay_info_id || !cardInfo?.title) {
		console.warn("Données invalides:", cardInfo);
		return null;
	}

	// LogementCard - Données initiale
	useEffect(() => {
		console.log("InfoCard - Données initiales:", {
			logementId: cardInfo.stay_info_id,
			photoUrl: cardInfo.photo_url,
			storeImage: cardInfo.photo_url,
			title: cardInfo.title,
			description: cardInfo.description,
			category: cardInfo.category,
		});
	}, [cardInfo]);

	return (
		<div className="group relative bg-slate-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
			{/* Image Container */}
			<div className="relative h-48 overflow-hidden">
				<Image
					src={imageUrl}
					alt={cardInfo.title}
					className="w-full h-full object-cover
						transform
						group-hover:scale-110
						transition-transform
						duration-500
						ease-in-out"
					width={300}
					height={200}
					quality={100}
				/>
				{/* Actions Overlay */}
				<div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
					<InfoCardDialog
						cardInfo={cardInfo}
						logementId={cardInfo.accommodation_id}
						onEditInfoCard={onEditInfoCard}
						onAddInfoCard={onAddInfoCard}
					>
						<button className="p-2.5 bg-white/90 hover:bg-amber-400 rounded-full shadow-lg
							transition-all duration-300 hover:scale-105">
							<MdEdit className="text-gray-700 text-lg" />
						</button>
					</InfoCardDialog>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<button className="p-2.5 bg-white/90 hover:bg-red-400 rounded-full shadow-lg
								transition-all duration-300 hover:scale-105">
								<MdDelete className="text-gray-700 text-lg" />
							</button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
								<AlertDialogDescription>
									La carte sera définitivement supprimée.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Annuler</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => deleteStayInfo(cardInfo.stay_info_id)}
									className="bg-red-500 hover:bg-red-600"
								>
									Supprimer
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>

			{/* Content */}
			<div className="p-5">
				<div className="flex items-start justify-between mb-4">
					<h2 className="text-xl font-semibold text-gray-900 line-clamp-1">
						{cardInfo.title}
					</h2>
					<span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
						{cardInfo.category}
					</span>
				</div>

				<div className="relative">
					<p className={`text-gray-600 text-sm ${
						(cardInfo.description?.length ?? 0) > 100 ? 'line-clamp-3' : ''
					}`}>
						{cardInfo.description ?? ''}
					</p>
					{(cardInfo.description?.length ?? 0) > 150 && (
						<button
							onClick={() => setIsPreviewOpen(true)}
							className="mt-2 text-amber-500 hover:text-amber-600 text-sm font-medium"
						>
							Voir plus...
						</button>
					)}
				</div>
			</div>

			{/* Preview Dialog */}
			<Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
				<DialogContent className="bg-white rounded-xl max-w-2xl">
					<DialogTitle className="text-2xl font-bold">{cardInfo.title}</DialogTitle>
					<div className="space-y-6">
						<div className="relative h-64 w-full rounded-lg overflow-hidden">
							<Image
								src={imageUrl}
								alt={cardInfo.title}
								fill
								className="object-cover"
							/>
						</div>
						<div className="space-y-4">
							<span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
								{cardInfo.category}
							</span>
							<p className="text-gray-600 leading-relaxed">
								{cardInfo.description}
							</p>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default InfoCard;
