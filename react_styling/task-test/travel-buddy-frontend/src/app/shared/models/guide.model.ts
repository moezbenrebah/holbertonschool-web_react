export interface Guide {
  _id: string;
  userId: string;
  specialites: string[];
  destinations: string[];
  description: string;
  tarif: number;
  disponible: boolean;
  note?: number;
  avis?: Array<{
    userId: string;
    commentaire: string;
    note: number;
    date: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
