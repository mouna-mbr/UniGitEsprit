import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TechnologyService {

  private baseUrl = 'http://localhost:8081/uniGitEsprit/api/Techno';

  constructor(private http: HttpClient) {}

  getAllTechnologies(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl);
  }
}

