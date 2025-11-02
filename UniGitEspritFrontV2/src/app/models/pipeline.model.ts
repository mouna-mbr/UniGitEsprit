export interface EtapeDTO {
  id?: number;
  nom: string;
  consigne: string;
  deadline: string;
  pipelineId?: number | null;
  gitRepoUrl?: string;
}
  
  export interface PipelineDTO {
    id?: number
    nom: string
    groupId: number 
    etapes: EtapeDTO[]
  }
  
  export interface EtapeStatus {
    id?: number
    nom: string
    consigne: string
    deadline: string
    status: "pending" | "active" | "completed"
    type: "etape" | "milestone" | "final"
  }
  
  export interface ValidationDTO {
    id?: number
    etapeId: number
  }
  