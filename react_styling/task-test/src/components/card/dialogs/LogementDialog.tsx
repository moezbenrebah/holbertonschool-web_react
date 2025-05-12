//--- Composant LogementDialog ---
//--- Composant pour la gestion des logements ---//

"use client";
// React imports
import { useState } from 'react';
// UI Components
import { DialogHeader, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";
// Custom Components
import LogementForm from "../forms/LogementForm";
// Types
import { Accommodation } from "@/types";
import * as Dialog from '@radix-ui/react-dialog';
import { MdDelete } from 'react-icons/md';


type LogementDialogProps = {
  logement?: Accommodation;
  onSubmit: (formData: FormData) => Promise<void>;
  onDelete?: () => void | Promise<void>;
  children: React.ReactNode;
};

export default function LogementDialog({ logement, onSubmit, onDelete, children }: LogementDialogProps) {
  const [open, setOpen] = useState(false);

  const handleFormSubmit = async (formData: FormData) => {
    await onSubmit(formData);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {children}
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
              {logement ? 'Modifier le logement' : 'Ajouter un logement'}
            </DialogTitle>
			<DialogDescription className="text-white/90 mt-1 text-md">
							{logement ? "Modifier ici les informations du logement" : "entre ici les informations du nouveau logement"}
			</DialogDescription>
          </DialogHeader>
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            <LogementForm
              logement={logement}
              onSubmit={handleFormSubmit}
              onDelete={onDelete}
              onCancel={() => setOpen(false)}
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
