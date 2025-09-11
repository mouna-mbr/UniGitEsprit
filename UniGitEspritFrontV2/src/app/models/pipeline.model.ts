export interface EtapeDTO {
    id?: number
    nom: string
    consigne: string
    deadline: string // Format ISO string pour les dates
  }
  
  export interface PipelineDTO {
    id?: number
    nom: string
    groupId: number // Ou projectId selon votre logique métier
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
  
  // Interface pour les validations (selon le backend)
  export interface ValidationDTO {
    id?: number
    etapeId: number
    // Ajoutez d'autres propriétés selon vos besoins
  }
  