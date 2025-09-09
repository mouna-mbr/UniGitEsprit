export interface User {
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'STUDENT' | 'PROFESSOR';
  identifiant: string;
  password: string;
  classe?: string;
  specialite?: string;
  email: string;
  gitUsername?: string;
  gitAccessToken?: string;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'STUDENT' | 'PROFESSOR';
  identifiant: string;
  classe?: string;
  specialite?: string;
  email: string;
  gitUsername?: string;
  gitAccessToken?: string;
  createdAt: string;
}