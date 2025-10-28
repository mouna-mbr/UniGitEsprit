export interface UserRole {
  userId: number;
  roles: string[];
}
export interface AuthResponse {
  token: string;
  user: UserResponse;
}
// src/app/models/user.model.ts
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  roles: Role[];               // ex: ['STUDENT','PROFESSOR']
  identifiant: string;
  classe?: string;               // nom de la classe (string)
  specialite?: string;
  email: string;
  gitUsername?: string;
  gitAccessToken?: string;
  password?: string;             // présent uniquement à la création
}

export interface UserResponse extends User {
  id: number;
  createdAt: string;             // ISO string
}
export enum Role {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  PROFESSOR = 'PROFESSOR',
  REFERENT_ESPRIT = 'REFERENT_ESPRIT',
  REFERENT_ENTREPRISE = 'REFERENT_ENTREPRISE',
  COORDINATEUR_PI = 'COORDINATEUR_PI',
}
