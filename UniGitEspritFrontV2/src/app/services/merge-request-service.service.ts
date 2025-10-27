import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MergeRequestServiceService {

  private apiUrl = 'http://localhost:8081/uniGitEsprit/api/merge-requests';

  constructor(private http: HttpClient) {}

  // getAssignedMergeRequests(projectId: string, state: string): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/${projectId}/assigned?state=${state}`);
  // }
  getAssignedMergeRequests(state: string = 'opened', username: string): Observable<any[]> {
    const params = new HttpParams().set('state', state).set('username', username); ;
    return this.http.get<any[]>(`${this.apiUrl}/assigned`, { params });
  }
  approveMergeRequest(projectId: string, mrIid: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${projectId}/${mrIid}/approve`, {});
  }

  mergeMergeRequest(projectId: string, mrIid: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${projectId}/${mrIid}/merge`, {});
  }}
