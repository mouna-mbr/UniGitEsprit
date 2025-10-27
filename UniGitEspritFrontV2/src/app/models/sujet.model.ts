import { GroupResponse } from "./group.model";

export interface SujetResponse {
  id: number;
  titre: string;
  favori: boolean;
  description: string;
  proposeParId: number;
  technologies: string[];
  groups:GroupResponse[];
}

export interface SujetCreate {
  titre: string;
  description: string;
  proposeParId: number;
  technologies: string[];

}