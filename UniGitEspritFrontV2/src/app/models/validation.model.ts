export interface Validation {
  id: number;
  date: string; 
  remarks: string[];
  title?: string; 
  etapeId: number;
  etudiantIds: number[];
  note?: number; 
}

export interface ValidationDTO {
  id: number;
  dateValidation: string; 
  remarques: string[];
  etapeId: number;
  etudiantIds: number[];
  note?: number; 
}