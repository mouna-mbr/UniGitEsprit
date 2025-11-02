import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthResponse, User, UserResponse ,Role} from '../models/user.model';
import { CsvImportReport } from '../models/csv.model';

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

  updateUser(identifiant: string, user: Partial<User>): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${identifiant}`, user);
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
    const token = localStorage.getItem('token');
    
    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles.map(role => role.toString()), 
      identifiant: user.identifiant,
      password: user.password,
      classe: user.classe || null,
      gitUsername: user.gitUsername || null,
      gitAccessToken: user.gitAccessToken || null,
    };
  
    console.log('Payload JSON:', JSON.stringify(payload));
  
    return this.http.post<UserResponse>(this.apiUrl, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError(this.handleError)
    );
  }
  

  addUsersBulk(users: User[]): Observable<UserResponse[]> {
    return this.http.post<UserResponse[]>(`${this.apiUrl}/bulk`, users).pipe(
      catchError(this.handleError)
    );
  }

addUsersFromCsv(file: File): Observable<CsvImportReport> {
  const formData = new FormData();
  formData.append('file', file);
  return this.http.post<CsvImportReport>(`${this.apiUrl}/csv`, formData);
}

login(username: string, password: string): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password })
    .pipe(
      tap((res: AuthResponse) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('roles', JSON.stringify(res.user.roles)); 
      })
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