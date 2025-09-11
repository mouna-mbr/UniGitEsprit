export interface GroupResponse {
  id: number;
  nom: string;
  classeId: number;
  users: UserRoleResponse[];
  sujetId: number;
  gitRepoUrl: string;
  gitRepoName: string;
  isFavori: boolean;
  enseignantId: number;
}

export interface UserRoleResponse {
  userId: number;
  role: string;
}

export interface GroupCreate {
  nom: string;
  classeId: number;
  users: UserRole[];
  sujetId: number;
  gitRepoName: string;
  gitRepoUrl: string; // If providing existing URL
  isFavori: boolean;
  enseignantId: number;
}

export interface UserRole {
  userId: number;
  role: string;
}