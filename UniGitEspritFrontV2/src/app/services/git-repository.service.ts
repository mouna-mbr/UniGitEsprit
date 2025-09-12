// src/app/services/git-repository.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  GitRepositoryDTO,
  GitBranchDTO,
  GitCommitDTO,
  GitFileDTO,
  GitFileContentDTO,
  GitCommitRequest,
  GitFileContentRequest
} from '../models/git-repository.model';
import { AuthService } from './auth.service';
import { UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class GitRepositoryService {
  private apiUrl = 'http://localhost:8081/uniGitEsprit/api/git'; // Replace with your backend URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  private createAuthHeader(): HttpHeaders {
    const currentUser: UserResponse | null = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.gitUsername || !currentUser.gitAccessToken) {
      throw new Error('User not authenticated or missing GitHub credentials');
    }
    const auth = btoa(`${currentUser.gitUsername}:${currentUser.gitAccessToken}`);
    return new HttpHeaders({
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    });
  }

  getRepository(repoUrl: string): Observable<GitRepositoryDTO> {
    const headers = this.createAuthHeader();
    return this.http.get<GitRepositoryDTO>(`${this.apiUrl}/repository`, {
      headers,
      params: { repoUrl }
    }).pipe(
      catchError(error => {
        console.error('Error fetching repository info:', error);
        return throwError(() => new Error('Failed to fetch repository info'));
      })
    );
  }

  getBranches(repoUrl: string): Observable<GitBranchDTO[]> {
    const headers = this.createAuthHeader();
    return this.http.get<GitBranchDTO[]>(`${this.apiUrl}/branches`, {
      headers,
      params: { repoUrl }
    }).pipe(
      catchError(error => {
        console.error('Error fetching branches:', error);
        return throwError(() => new Error('Failed to fetch branches'));
      })
    );
  }

  getCommits(request: GitCommitRequest): Observable<GitCommitDTO[]> {
    const headers = this.createAuthHeader();
    return this.http.post<GitCommitDTO[]>(`${this.apiUrl}/commits`, request, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching commits:', error);
        return throwError(() => new Error('Failed to fetch commits'));
      })
    );
  }

  getFiles(repoUrl: string, branch?: string, path?: string): Observable<GitFileDTO[]> {
    const headers = this.createAuthHeader();
    let params: any = { repoUrl };
    if (branch) params.branch = branch;
    if (path) params.path = path;
    return this.http.get<GitFileDTO[]>(`${this.apiUrl}/files`, { headers, params }).pipe(
      catchError(error => {
        console.error('Error fetching files:', error);
        return throwError(() => new Error('Failed to fetch files'));
      })
    );
  }

  getFileContent(request: GitFileContentRequest): Observable<GitFileContentDTO> {
    const headers = this.createAuthHeader();
    return this.http.post<GitFileContentDTO>(`${this.apiUrl}/file-content`, request, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching file content:', error);
        return throwError(() => new Error('Failed to fetch file content'));
      })
    );
  }
}