import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DemandeParainage, DemandeParainageRequest } from '../models/demande.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandeParainageService {

  private base = 'http://localhost:8081/uniGitEsprit/api/demandes-parainage';

  constructor(private http: HttpClient) {}

  getDemandes(status?: string): Observable<any> {
    return this.http.get<DemandeParainage[]>(`${this.base}/all`);
  }

  updateStatus(id: number, status: string) {
    return this.http.patch<DemandeParainage>(`${this.base}/${id}/status`, null, { params: { status }});
  }

  createDemande(dto: DemandeParainageRequest ) {
    return this.http.post<DemandeParainage>(`${this.base}/Add`, dto);
  }
  searchDemands(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/search?query=${query}`);
  }
}
