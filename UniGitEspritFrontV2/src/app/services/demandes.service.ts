import { Injectable } from '@angular/core';
import { DemandeBDPDTO, DemandeBDPRequest } from '../models/demande.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandesService {
  private base = 'http://localhost:8081/uniGitEsprit/api/demandes-bdp';

  constructor(private http: HttpClient) {}

  getDemandes(status?: string): Observable<any> {
    return this.http.get<DemandeBDPDTO[]>(`${this.base}/all`);
  }

  updateStatus(id: number, status: string) {
    return this.http.patch<DemandeBDPDTO>(`${this.base}/${id}/status`, null, { params: { status }});
  }

  createDemande(dto: DemandeBDPRequest) {
    return this.http.post<DemandeBDPDTO>(`${this.base}/Add`, dto);
  }
  searchDemands(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/search?query=${query}`);
  }
}
