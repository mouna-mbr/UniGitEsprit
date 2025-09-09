import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SujetResponse, SujetCreate } from '../models/sujet.model';

@Injectable({
  providedIn: 'root'
})
export class SujetService {
  private apiUrl = 'http://localhost:8081/uniGitEsprit/api/sujets';

  constructor(private http: HttpClient) {}

  addSujet(sujet: SujetCreate, userId: number): Observable<SujetResponse> {
    return this.http.post<SujetResponse>(`${this.apiUrl}?userId=${userId}`, sujet).pipe(
      catchError(this.handleError)
    );
  }

  getAllSujets(): Observable<SujetResponse[]> {
    return this.http.get<SujetResponse[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getSujetById(id: number): Observable<SujetResponse> {
    return this.http.get<SujetResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateSujet(id: number, sujet: SujetCreate): Observable<SujetResponse> {
    return this.http.put<SujetResponse>(`${this.apiUrl}/${id}`, sujet).pipe(
      catchError(this.handleError)
    );
  }

  deleteSujet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  toggleFavorite(id: number): Observable<SujetResponse> {
    return this.http.post<SujetResponse>(`${this.apiUrl}/${id}/toggle-favorite`, {}).pipe(
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