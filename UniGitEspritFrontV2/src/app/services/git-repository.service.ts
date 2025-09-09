// git-repository.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import type {
  GitRepositoryDTO,
  GitBranchDTO,
  GitCommitDTO,
  GitFileDTO,
  GitRepositoryRequest,
  GitFileContentRequest,
  GitCommitRequest,
} from "../models/git-repository.model";

@Injectable({
  providedIn: "root",
})
export class GitRepositoryService {
  private apiUrl = "http://localhost:8081/uniGitEsprit/api/gitrepo"; // URL de votre backend Spring Boot

  constructor(private http: HttpClient) {}

  // Récupérer les informations du repository
  getRepository(repoUrl: string): Observable<GitRepositoryDTO> {
    const request: GitRepositoryRequest = { repoUrl };

    return this.http.post<GitRepositoryDTO>(`${this.apiUrl}/repository`, request).pipe(
      map((repo) => ({
        ...repo,
        createdAt: new Date(repo.createdAt),
        updatedAt: new Date(repo.updatedAt),
      })),
      catchError(this.handleError),
    );
  }

  // Récupérer les branches du repository
  getBranches(repoUrl: string): Observable<GitBranchDTO[]> {
    const request: GitRepositoryRequest = { repoUrl };

    return this.http.post<GitBranchDTO[]>(`${this.apiUrl}/branches`, request).pipe(
      map((branches) =>
        branches.map((branch) => ({
          ...branch,
          commit: {
            ...branch.commit,
            author: {
              ...branch.commit.author,
              date: new Date(branch.commit.author.date),
            },
          },
        })),
      ),
      catchError(this.handleError),
    );
  }

  // Récupérer les commits du repository
  getCommits(repoUrl: string, branch = "main", page = 1, perPage = 30): Observable<GitCommitDTO[]> {
    const request: GitCommitRequest = {
      repoUrl,
      branch,
      page,
      perPage,
    };

    return this.http.post<GitCommitDTO[]>(`${this.apiUrl}/commits`, request).pipe(
      map((commits) =>
        commits.map((commit) => ({
          ...commit,
          author: {
            ...commit.author,
            date: new Date(commit.author.date),
          },
          committer: {
            ...commit.committer,
            date: new Date(commit.committer.date),
          },
        })),
      ),
      catchError(this.handleError),
    );
  }

  // Récupérer le contenu d'un répertoire ou fichier
  getContents(repoUrl: string, path = "", branch = "main"): Observable<GitFileDTO[]> {
    const request: GitRepositoryRequest = {
      repoUrl,
      branch,
      path,
    };
  
    return this.http.post<GitFileDTO[]>(`${this.apiUrl}/contents`, request).pipe(
      map((files) =>
        files.map((file) => ({
          ...file,
          lastCommit: file.lastCommit
            ? {
                ...file.lastCommit,
                date: new Date(file.lastCommit.date),
              }
            : undefined,
        }))
      ),
      catchError(this.handleError),
    );
  }

  // Récupérer le contenu d'un fichier
  getFileContent(repoUrl: string, path: string, branch = "main"): Observable<string> {
    const request: GitFileContentRequest = {
      repoUrl,
      path,
      branch,
    };

    return this.http.post<{ content: string }>(`${this.apiUrl}/file-content`, request).pipe(
      map((response) => response.content),
      catchError(this.handleError),
    );
  }

  // Récupérer le README
  getReadme(repoUrl: string, branch = "main"): Observable<string> {
    const request: GitRepositoryRequest = {
      repoUrl,
      branch,
    };

    return this.http.post<{ content: string }>(`${this.apiUrl}/readme`, request).pipe(
      map((response) => response.content),
      catchError(this.handleError),
    );
  }

  // Récupérer les détails d'un commit
  getCommitDetails(repoUrl: string, sha: string): Observable<GitCommitDTO> {
    const request: GitCommitRequest = { repoUrl, sha };

    return this.http.post<GitCommitDTO>(`${this.apiUrl}/commit-details`, request).pipe(
      map((commit) => ({
        ...commit,
        author: {
          ...commit.author,
          date: new Date(commit.author.date),
        },
        committer: {
          ...commit.committer,
          date: new Date(commit.committer.date),
        },
      })),
      catchError(this.handleError),
    );
  }

  // Rechercher dans les fichiers
  searchFiles(repoUrl: string, query: string, branch = "main"): Observable<GitFileDTO[]> {
    const request: GitRepositoryRequest = { repoUrl, query, branch };

    return this.http.post<GitFileDTO[]>(`${this.apiUrl}/search-files`, request).pipe(catchError(this.handleError));
  }

  // Gestion des erreurs
  private handleError(error: any): Observable<never> {
    console.error("GitRepositoryService Error:", error);

    let errorMessage = "Une erreur est survenue";

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}