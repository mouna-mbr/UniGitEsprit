import { GroupResponse } from "./group.model";
import { SujetResponse } from "./sujet.model";
import { User, UserResponse } from "./user.model";

export interface DemandeBDPDTO {
  id: number;
  user: User;
  group: GroupResponse;
  status: 'PENDING'|'ACCEPTED'|'REFUSED';
}
export interface DemandeBDPRequest {
  user: User;
  group: GroupResponse;
  status: 'PENDING'|'ACCEPTED'|'REFUSED';
}
export interface Entreprise {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
}
export interface DemandeParainage {
  id: number;
  user: User;
  entreprise?: Entreprise;
  sujet: SujetResponse;
  status: String;
}
export interface DemandeParainageRequest {
  id?: number;
  user: User;
  entreprise?: Entreprise;
  sujet: SujetResponse;
  status: String;
}