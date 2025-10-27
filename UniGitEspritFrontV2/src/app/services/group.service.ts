import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupResponse, GroupCreate } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:8081/uniGitEsprit/api/groups';

  constructor(private http: HttpClient) {}

  addGroup(group: GroupCreate): Observable<GroupResponse> {
    return this.http.post<GroupResponse>(this.apiUrl, group);
  }

  getGroupsByUser(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GroupsbyUser/${id}`);
  }

  getAllGroups(): Observable<GroupResponse[]> {
    return this.http.get<GroupResponse[]>(this.apiUrl);
  }

  getGroupById(id: number): Observable<GroupResponse> {
    return this.http.get<GroupResponse>(`${this.apiUrl}/${id}`);
  }

  updateGroup(id: number, group: GroupCreate): Observable<GroupResponse> {
    return this.http.put<GroupResponse>(`${this.apiUrl}/${id}`, group);
  }

  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleFavorite(id: number): Observable<GroupResponse> {
    return this.http.post<GroupResponse>(`${this.apiUrl}/${id}/toggle-favorite`, {});
  }
  getGroupByPipelineId(pipelineId: number): Observable<GroupResponse> {
    return this.http.get<GroupResponse>(`${this.apiUrl}/by-pipeline/${pipelineId}`);
  }
  addMember(groupId: number, payload: { userId: number, role: string[] }) {
    return this.http.post<GroupResponse>(`${this.apiUrl}/${groupId}/members`, payload);
  }
  
  removeMember(groupId: number, userId: number) {
    return this.http.delete<GroupResponse>(`${this.apiUrl}/${groupId}/members/${userId}`);
  }
  
  updateMemberRole(groupId: number, userId: number, role: string[]) {
    return this.http.put<GroupResponse>(`${this.apiUrl}/${groupId}/members/${userId}`, role);
  }
  searchGroups(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?query=${query}`);
  }
}