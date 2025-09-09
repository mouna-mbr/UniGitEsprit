export interface ClasseResponse {
  id: number;
  nom: string;
  anneeUniversitaire: string;
  level: 'L1' | 'L2' | 'L3A' | 'L3B' |'L4' | 'L5'| 'M1' | 'M2';
  optionFormation: string;
  favori: boolean;
  sujetIds: number[] | null;
  etudiantIds: number[] | null;
  enseignantIds: number[] | null;
}

export interface ClasseCreate {
  nom: string;
  anneeUniversitaire: string;
  level: 'L1' | 'L2' | 'L3' |'L4' | 'L5'| 'M1' | 'M2';
  optionFormation: string;
  sujetIds: number[] | null;
  etudiantIds: number[] | null;
  enseignantIds: number[] | null;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}