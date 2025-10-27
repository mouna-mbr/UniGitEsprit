export interface UserRole {
  userId: number;
  role: string[];
}
export interface AuthResponse {
  token: string;
  user: UserResponse;
}
export interface User {
  firstName: string;
  lastName: string;
  role:string[];
  identifiant: string;
  classe?: string;
  specialite?: string;
  email: string;
  gitUsername?: string;
  gitAccessToken?: string;
  password?: string;
  createdAt?: string; // Optional, to match UserResponse if needed
}

export interface UserResponse extends User {
  id: number;
  // Inherits all from User, can add extra fields like createdAt
  createdAt: string;
}
