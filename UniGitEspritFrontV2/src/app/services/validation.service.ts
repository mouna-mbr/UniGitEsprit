import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ValidationDTO } from '../models/validation.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private apiUrl = 'http://localhost:8081/uniGitEsprit/api/etapes';

  constructor(private http: HttpClient) {}

  getValidationsByEtape(etapeId: number): Observable<ValidationDTO[]> {
    return this.http.get<ValidationDTO[]>(`${this.apiUrl}/${etapeId}/validations`);
  }

  getRemarksByValidation(validationId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${validationId}/validations/remarks`);
  }

  createValidation(etapeId: number, validation: ValidationDTO): Observable<ValidationDTO> {
    return this.http.post<ValidationDTO>(`${this.apiUrl}/${etapeId}/validations`, validation);
  }

  updateValidation(validationId: number, validation: ValidationDTO): Observable<ValidationDTO> {
    return this.http.put<ValidationDTO>(`${this.apiUrl}/validations/${validationId}`, validation);
  }

  deleteValidation(validationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/validations/${validationId}`);
  }

  addRemark(validationId: number, remark: string): Observable<ValidationDTO> {
    return this.http.post<ValidationDTO>(`${this.apiUrl}/validations/${validationId}/remarks`, remark);
  }

  updateRemark(validationId: number, remarkIndex: number, updatedRemark: string): Observable<ValidationDTO> {
    return this.http.put<ValidationDTO>(`${this.apiUrl}/validations/${validationId}/remarks/${remarkIndex}`, updatedRemark);
  }

  deleteRemark(validationId: number, remarkIndex: number): Observable<ValidationDTO> {
    return this.http.delete<ValidationDTO>(`${this.apiUrl}/validations/${validationId}/remarks/${remarkIndex}`);
  }
}