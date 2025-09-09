import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClasseResponse, ClasseCreate } from '../models/classe.model';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private apiUrl = 'http://localhost:8081/uniGitEsprit/api/classes';

  constructor(private http: HttpClient) {}

  addClasse(classe: ClasseCreate): Observable<ClasseResponse> {
    return this.http.post<ClasseResponse>(this.apiUrl, classe).pipe(
      catchError(this.handleError)
    );
  }

  getAllClasses(): Observable<ClasseResponse[]> {
    return this.http.get<ClasseResponse[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getFavoriteClasses(): Observable<ClasseResponse[]> {
    return this.http.get<ClasseResponse[]>(`${this.apiUrl}/favorites`).pipe(
      catchError(this.handleError)
    );
  }

  getClasseById(id: number): Observable<ClasseResponse> {
    return this.http.get<ClasseResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateClasse(id: number, classe: ClasseCreate): Observable<ClasseResponse> {
    return this.http.put<ClasseResponse>(`${this.apiUrl}/${id}`, classe).pipe(
      catchError(this.handleError)
    );
  }

  deleteClasse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  toggleFavorite(id: number): Observable<ClasseResponse> {
    return this.http.post<ClasseResponse>(`${this.apiUrl}/${id}/toggle-favorite`, {}).pipe(
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