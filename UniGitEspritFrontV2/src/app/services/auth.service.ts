// auth.service.ts
import { Injectable } from '@angular/core';
import { AuthResponse, Role, UserResponse } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserKey = 'currentUser';

  setCurrentUser(user: UserResponse): void {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }

  getCurrentUser(): UserResponse | null {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  private apiUrl = 'http://localhost:8081/uniGitEsprit/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((res: AuthResponse) => {
          // NETTOYER TOUT
          localStorage.clear();

          // SAUVEGARDER UNIQUEMENT LE BON TOKEN
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        })
      );
  }

  logout(): void {
    // Supprimer les données de l'utilisateur du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('roles');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('auth-token');
    
    // Rediriger vers la page de connexion
    this.router.navigate(['/signin']);
  }

  // ✅ AMÉLIORATION : Vérifier si le token est expiré
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      // Décoder le token JWT pour vérifier l'expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        this.logout(); // Déconnecter automatiquement si le token est expiré
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ CORRECTION : Comparer avec une valeur de l'enum, pas l'enum lui-même
  hasRole(role: Role): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  }

  // ✅ VERSION ALTERNATIVE si vous voulez passer une string
  hasRoleString(roleName: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(roleName as Role) : false;
  }

  getUserRoles(): string[] {
    const user = this.getCurrentUser();
    return user ? user.roles : [];
  }

  // ✅ NOUVELLE MÉTHODE : Vérifier plusieurs rôles
  hasAnyRole(roles: Role[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    return roles.some(role => user.roles.includes(role));
  }

  // ✅ NOUVELLE MÉTHODE : Vérifier tous les rôles
  hasAllRoles(roles: Role[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    return roles.every(role => user.roles.includes(role));
  }
}