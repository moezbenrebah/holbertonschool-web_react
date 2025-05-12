'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRef, useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import CloudinaryFileUploader from "@/components/upload/CloudinaryFileUploder";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { stayInfo } from '@/db/appSchema';
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stayInfoSchema } from "@/validation/stayInfoSchema";
import { CARDINFORMATION_TYPES, InfoCardFormData } from "@/types/cardTypes";

// Props du composant
export interface InfoCardFormProps {
	cardInfo?: typeof stayInfo.$inferSelect;
	onSubmit: (data: InfoCardFormData) => Promise<any>;
	onCancel: () => void;
	isLoading?: boolean;
	id: number;
}

// Composant InfoCardForm
const InfoCardForm = ({
	cardInfo,
	onSubmit,
	onCancel,
	isLoading = false,
	id
}: InfoCardFormProps) => {
	console.log("InfoCardForm - Props reçues:", { cardInfo, id });

	const { data: session } = useSession();
	console.log("cardInfo reçu dans InfoCardForm:", cardInfo);

	// Initialisation avec des valeurs par défaut sûres
	const initialValues = useMemo(() => ({
		title: cardInfo?.title ?? '',
		category: (cardInfo?.category ?? CARDINFORMATION_TYPES[0]) as typeof CARDINFORMATION_TYPES[number],
		description: cardInfo?.description ?? '',
		photo_url: cardInfo?.photo_url ?? null,
		accommodation_id: id
	}), [cardInfo, id]);

	// Référence du formulaire
	const formRef = useRef<HTMLFormElement>(null);

	// Gestion de l'image
	const [imageUrl, setImageUrl] = useState(cardInfo?.photo_url || '');
	// Gestion de la soumission du formulaire
	const [isSubmitting, setIsSubmitting] = useState(false);
	// Gestion de l'upload d'image
	const [isUploading, setIsUploading] = useState(false);
	// Gestion de l'erreur d'upload d'image
	const [uploadError, setUploadError] = useState<string | null>(null);
	// Gestion de la modal d'image
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	// Gestion des erreurs de validation
	const [validationErrors, setValidationErrors] = useState<z.ZodError | null>(null);

	// Gestion du formulaire
	const form = useForm<InfoCardFormData>({
		resolver: zodResolver(stayInfoSchema),
		defaultValues: initialValues
	});

	// Mise à jour des valeurs quand cardInfo change
	useEffect(() => {
		if (cardInfo) {
			form.reset(initialValues);
		}
	}, [cardInfo, id, form, initialValues]);

	// Gestion de l'upload d'image
	const handleImageUpload = async (url: string) => {
		setIsUploading(true);
		setUploadError(null);

		try {
			if (!url) {
				throw new Error("URL de l'image non reçue");
			}
			setImageUrl(url);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Erreur inconnue lors du téléchargement";
			setUploadError(errorMessage);
			toast.error("Échec du téléchargement de l'image");
			console.error("Erreur upload:", error);
		} finally {
			setIsUploading(false);
		}
	};

	// Fonction pour supprimer l'image
	const handleRemoveImage = () => {
		setImageUrl('');
		setUploadError(null);
	};

	// Gestion de la soumission avec validation
	const handleSubmit = async (data: InfoCardFormData) => {
		console.log("InfoCardForm - Début de la soumission avec les données:", data);
		setIsSubmitting(true);

		try {
			// Préparation des données pour l'envoi
			const formData: InfoCardFormData = {
				title: data.title.trim(),
				description: data.description.trim(),
				category: data.category,
				photo_url: imageUrl || null,
				accommodation_id: id
			};

			console.log("InfoCardForm - Données à envoyer:", formData);

			if (!onSubmit) {
				throw new Error("La fonction onSubmit n'est pas définie");
			}

			try {
				const result = await onSubmit(formData);
				console.log("InfoCardForm - Résultat de la soumission:", result);

				if (!result) {
					throw new Error("Aucun résultat reçu de onSubmit");
				}

				return result;
			} catch (error) {
				console.error("InfoCardForm - Erreur lors de la soumission:", error);
				toast.error(error instanceof Error ? error.message : "Erreur lors de la soumission");
				throw error;
			}
		} catch (error) {
			console.error('InfoCardForm - Erreur détaillée:', error);
			toast.error(error instanceof Error ? error.message : "Une erreur est survenue lors de la soumission du formulaire");
			throw error;
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 bg-white rounded-xl p-4">
			{/* Section pour l'image */}
			<div className="space-y-4 bg-white rounded-xl p-4">
				{imageUrl && (
					<>
						<div className="relative cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
							<Image
								src={imageUrl}
								alt="Aperçu"
								width={500}
								height={500}
								className="w-full h-auto rounded-xl object-cover hover:opacity-90 transition-opacity"
							/>
							<Button
								type="button"
								variant="destructive"
								size="sm"
								className="absolute top-2 right-2 bg-red-500 text-white rounded-xl hover:bg-red-700"
								onClick={(e) => {
									e.stopPropagation();
									handleRemoveImage();
								}}
							>
								Supprimer
							</Button>
						</div>

						{/* Dialog pour l'image */}
						<Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
							<DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
								<div className="relative w-full h-full">
									<Image
										src={imageUrl}
										alt="Aperçu agrandi"
										width={1920}
										height={1080}
										className="w-full h-auto object-contain"
									/>
									<Button
										type="button"
										variant="secondary"
										size="sm"
										className="absolute top-2 right-2"
										onClick={() => setIsImageModalOpen(false)}
									>
										Fermer
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					</>
				)}

				{/* Section pour l'image */}
				<div className="space-y-2">
					<Label>{isUploading && "(Téléchargement en cours...)"}</Label>
					<div className="flex justify-center items-center">
						<CloudinaryFileUploader
							uploadPreset="infocard_preset"
							onUploadSuccess={handleImageUpload}
							disabled={isUploading || isSubmitting}
						/>
					</div>
					{uploadError && (
						<p className="text-red-500 text-sm">{uploadError}</p>
					)}
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="title">Titre</Label>
				<Input
					id="title"
					{...form.register("title")}
					placeholder="Titre de la carte"
					className="bg-white rounded-xl focus:border-gray-400"
					aria-invalid={!!form.formState.errors.title}
				/>
				{form.formState.errors.title && (
					<p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="type">Type de carte</Label>
				<select
					id="type"
					{...form.register("category")}
					className="w-full p-2 border rounded-xl focus:border-gray-400"
					aria-invalid={!!form.formState.errors.category}
				>
					{CARDINFORMATION_TYPES.map((type) => (
						<option key={type} value={type}>
							{type}
						</option>
					))}
				</select>
				{form.formState.errors.category && (
					<p className="text-red-500 text-sm">{form.formState.errors.category.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					{...form.register("description")}
					placeholder="Description de la carte"
					className="bg-white rounded-xl focus:border-gray-400"
					aria-invalid={!!form.formState.errors.description}
				/>
				{form.formState.errors.description && (
					<p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>
				)}
			</div>

			<div className="flex justify-end space-x-4 mt-6">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					disabled={isSubmitting || isLoading}
				>
					Annuler
				</Button>
				<Button
					type="submit"
					disabled={isSubmitting || isLoading}
					className="bg-amber-500 hover:bg-amber-600 text-white"
				>
					{isSubmitting || isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{cardInfo ? "Modification..." : "Création..."}
						</>
					) : (
						cardInfo ? "Modifier" : "Créer"
					)}
				</Button>
			</div>
		</form>
	);
};

export default InfoCardForm;
