export interface GroupResponse {
  id: number;
  nom: string;
  classeId: number;
  users: UserRoleResponse[];
  sujetId: number;
  gitRepoUrl: string;
  gitRepoName: string;
  favori: boolean;
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
  gitRepoUrl: string; 
  favori: boolean;
  enseignantId: number;
}

export interface UserRole {
  userId: number;
  role: string;
}