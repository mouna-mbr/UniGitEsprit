import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PipelineDTO } from '../models/pipeline.model';

@Injectable({
  providedIn: 'root',
})
export class PipelineService {
  private apiUrl = 'http://localhost:8081/uniGitEsprit/api/pipelines';

  constructor(private http: HttpClient) {}

  createPipeline(pipeline: PipelineDTO): Observable<PipelineDTO> {
    return this.http.post<PipelineDTO>(`${this.apiUrl}/add`, pipeline);
  }

  getPipelineByGroupId(groupId: number): Observable<PipelineDTO> {
    return this.http.get<PipelineDTO>(`${this.apiUrl}/get-by-group/${groupId}`);
  }

  getPipelinesByProjectId(projectId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/projet/${projectId}`);
  }

  getPipelineById(id: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${id}`);
  }

  updatePipeline(id: number, pipeline: PipelineDTO): Observable<PipelineDTO> {
    return this.http.put<PipelineDTO>(`${this.apiUrl}/${id}`, pipeline);
  }

  getEtapesByPipelineId(pipelineId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/etapes/${pipelineId}`);
  }

  addValidationToEtape(etapeId: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/etapes/${etapeId}/validation`, {});
  }

  getValidationsByEtapeId(etapeId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/etapes/${etapeId}/validations`);
  }
}