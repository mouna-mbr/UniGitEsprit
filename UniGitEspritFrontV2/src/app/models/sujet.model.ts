export interface SujetResponse {
  id: number;
  titre: string;
  favori: boolean;
  description: string;
  proposeParId: number;
}

export interface SujetCreate {
  titre: string;
  description: string;
  proposeParId: number;
}