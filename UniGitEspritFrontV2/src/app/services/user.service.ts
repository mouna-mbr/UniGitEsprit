import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/uniGitEsprit/api/users'; // Vérifiez que le port correspond à votre backend

  constructor(private http: HttpClient) {}

  getStudentsByEtapeId(etapeId: number): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`http://localhost:8081/uniGitEsprit/api/etapes/${etapeId}/students`).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(id: string, user: User): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addUser(user: User): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  addUsersBulk(users: User[]): Observable<UserResponse[]> {
    return this.http.post<UserResponse[]>(`${this.apiUrl}/bulk`, users).pipe(
      catchError(this.handleError)
    );
  }

  addUsersFromCsv(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(`${this.apiUrl}/csv`, formData).pipe(
      catchError(this.handleError)
    );
  }

  login(identifiant: string, password: string): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/login`, { identifiant, password }).pipe(
      catchError(this.handleError)
    );
  }

  updateGitCredentials(userId: number, updateData: { gitUsername: string; gitAccessToken: string }): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${userId}/git-credentials`, updateData).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erreur HTTP interceptée :', {
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      error: error.error,
      url: error.url
    });
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      errorMessage = (typeof error.error === 'object' && error.error !== null && 'message' in error.error)
        ? error.error.message
        : `Erreur ${error.status}: ${error.message || 'Détails inconnus'}`;
      console.log('Corps brut de l\'erreur :', JSON.stringify(error.error, null, 2));
    }
    return throwError(() => new Error(errorMessage));
  }
}