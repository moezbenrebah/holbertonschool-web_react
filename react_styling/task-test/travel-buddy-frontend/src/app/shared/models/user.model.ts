export interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  isGuide?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
