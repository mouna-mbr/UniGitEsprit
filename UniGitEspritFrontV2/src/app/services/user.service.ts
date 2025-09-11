import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/uniGitEsprit/api/users';

  constructor(private http: HttpClient) {}
  getStudentsByEtapeId(etapeId: number): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`http://localhost:8081/uniGitEsprit/api/etapes/${etapeId}/students`).pipe(
      catchError(this.handleError)
    );
  }

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl).pipe(
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

  addUsersFromCsv(file: File): Observable<UserResponse[]> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UserResponse[]>(`${this.apiUrl}/csv`, formData).pipe(
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

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}