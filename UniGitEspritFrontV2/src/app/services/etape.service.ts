import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EtapeDTO } from '../models/pipeline.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EtapeService {
  private apiUrl = "http://localhost:8081/uniGitEsprit/api/etapes";

  constructor(private http: HttpClient) {}

  getEtapeById(id: number): Observable<EtapeDTO> {
    return this.http.get<EtapeDTO>(`${this.apiUrl}/get/${id}`);
  }
  
}