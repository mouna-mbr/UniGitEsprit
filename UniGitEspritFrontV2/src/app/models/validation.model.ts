// validation.model.ts
export interface Validation {
  id: number;
  date: string; // Use string for LocalDate compatibility with JSON
  remarks: string[];
  title?: string; // Added based on HTML usage, optional if not always present
  etapeId: number;
  etudiantIds: number[];
  note?: number; // Optional if not always provided
}

export interface ValidationDTO {
  id: number;
  dateValidation: string; // Use string for LocalDate compatibility with JSON
  remarques: string[];
  etapeId: number;
  etudiantIds: number[];
  note?: number; // Optional if not always provided
}