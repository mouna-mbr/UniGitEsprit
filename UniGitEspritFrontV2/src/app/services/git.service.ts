import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { parseISO } from 'date-fns';
import {
  GitRepositoryDTO,
  GitBranchDTO,
  GitCommitDTO,
  GitFileDTO,
  GitFileContentDTO,
  GitRepositoryRequest,
  GitFileContentRequest,
  GitCommitRequest
} from '../models/git-repository.model';

@Injectable({
  providedIn: 'root'
})
export class GitService {
  private apiUrl = 'http://localhost:8080/api/git'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  // Helper to create Authorization header
  private createAuthHeader(username: string, accessToken: string): HttpHeaders {
    const auth = btoa(`${username}:${accessToken}`);
    return new HttpHeaders({
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    });
  }

  // Get repository info
  getRepositoryInfo(repoUrl: string, username: string, accessToken: string): Observable<GitRepositoryDTO> {
    const headers = this.createAuthHeader(username, accessToken);
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

  // Get branches
  getBranches(repoUrl: string, username: string, accessToken: string): Observable<GitBranchDTO[]> {
    const headers = this.createAuthHeader(username, accessToken);
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

  // Get commits
  getCommits(request: GitCommitRequest, username: string, accessToken: string): Observable<GitCommitDTO[]> {
    const headers = this.createAuthHeader(username, accessToken);
    return this.http.post<GitCommitDTO[]>(`${this.apiUrl}/commits`, request, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching commits:', error);
        return throwError(() => new Error('Failed to fetch commits'));
      })
    );
  }

  // Get files
  getFiles(repoUrl: string, branch: string | undefined, path: string | undefined, username: string, accessToken: string): Observable<GitFileDTO[]> {
    const headers = this.createAuthHeader(username, accessToken);
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

  // Get file content
  getFileContent(request: GitFileContentRequest, username: string, accessToken: string): Observable<GitFileContentDTO> {
    const headers = this.createAuthHeader(username, accessToken);
    return this.http.post<GitFileContentDTO>(`${this.apiUrl}/file-content`, request, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching file content:', error);
        return throwError(() => new Error('Failed to fetch file content'));
      })
    );
  }
}