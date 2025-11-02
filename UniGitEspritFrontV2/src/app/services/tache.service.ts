import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Status, TacheDTO } from '../models/tache.model';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private apiUrl = 'http://localhost:8081/uniGitEsprit/api/etapes';

  constructor(private http: HttpClient) {}

  getTachesByEtapeId(etapeId: number): Observable<TacheDTO[]> {
    return this.http.get<TacheDTO[]>(`${this.apiUrl}/${etapeId}/taches`);
  }

  createTache(etapeId: number, tacheDTO: TacheDTO): Observable<TacheDTO> {
    return this.http.post<TacheDTO>(`${this.apiUrl}/${etapeId}/taches`, tacheDTO);
  }

  updateTache(taskId: number, tacheDTO: TacheDTO): Observable<TacheDTO> {
    return this.http.put<TacheDTO>(`${this.apiUrl}/taches/${taskId}`, tacheDTO);
  }

  updateStatus(taskId: number, status: Status): Observable<TacheDTO> {
    return this.http.patch<TacheDTO>(`${this.apiUrl}/tachesStatus/${taskId}`, status);
  }

  deleteTache(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/taches/${taskId}`);
  }
}