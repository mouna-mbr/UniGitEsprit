export interface UserRole {
  userId: number;
  roles: string[];
}
export interface AuthResponse {
  token: string;
  user: UserResponse;
}
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  roles: Role[];              
  identifiant: string;
  classe?: string;               
  specialite?: string;
  email: string;
  gitUsername?: string;
  gitAccessToken?: string;
  password?: string;             
}

export interface UserResponse extends User {
  id: number;
  createdAt: string;            
}
export enum Role {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  PROFESSOR = 'PROFESSOR',
  REFERENT_ENTREPRISE = 'REFERENT_ENTREPRISE',
  COORDINATEUR_PI = 'COORDINATEUR_PI',
}
