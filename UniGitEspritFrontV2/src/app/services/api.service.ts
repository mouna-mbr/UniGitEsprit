import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8081/uniGitEsprit/api';
  constructor(private http: HttpClient) {}

  getAdminStats() {
    return this.http.get<any>(`${this.base}/admin/stats`);
  }

  getProfStats(profId: number) {
    return this.http.get<any>(`${this.base}/prof/stats/${profId}`);
  }
}

