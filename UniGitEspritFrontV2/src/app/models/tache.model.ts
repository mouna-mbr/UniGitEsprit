export enum Status {
  TODO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}
export interface CreateTaskRequest {
  title: string
  description: string
  responsableId: number
  status:Status
}
export interface TacheDTO {
  id: number;
  nom: string;
  description: string;
  status: Status;
  deadline: string;
  assigneeId: number;
  assigneeName?: string; 
  progress?: number; 
}