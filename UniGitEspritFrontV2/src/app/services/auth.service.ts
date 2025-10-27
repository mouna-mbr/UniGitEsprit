import { Injectable } from '@angular/core';
import { AuthResponse, UserResponse } from '../models/user.model';
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
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    return roles.includes(role);
  }

  getUserRoles(): string[] {
    return JSON.parse(localStorage.getItem('roles') || '[]');
  }
}