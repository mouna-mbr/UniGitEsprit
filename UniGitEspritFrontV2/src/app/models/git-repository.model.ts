export interface GitRepositoryDTO {
  id: number; 
  name: string;
  fullName: string;
  description: string;
  url: string;
  defaultBranch: string;
  isPrivate: boolean;
  language: string;
  stars: number;
  forks: number;
  size: number;
  createdAt: Date; 
  updatedAt: Date; 
  owner: GitOwnerDTO;
}

export interface GitFileContentDTO {
  content: string;
  encoding: string;
  
}
export interface GitOwnerDTO {
  login: string;
  avatarUrl: string;
  type: string;
  url: string;
}

export interface GitBranchDTO {
  name: string;
  commit: GitBranchCommitDTO;
  protectedBranch: boolean;
}

export interface GitBranchCommitDTO {
  sha: string;
  message: string;
  author: GitAuthorDTO;
}

export interface GitCommitDTO {
  sha: string;
  message: string;
  author: GitAuthorDTO;
  committer: GitCommitterDTO;
  stats: GitCommitStatsDTO;
  files: GitFileChangeDTO[];
  url: string;
}

export interface GitAuthorDTO {
  name: string;
  email: string;
  avatarUrl: string;
  date: Date; 
}

export interface GitCommitterDTO {
  name: string;
  email: string;
  date: Date; 
}

export interface GitCommitStatsDTO {
  additions: number;
  deletions: number;
  total: number;
}

export interface GitFileChangeDTO {
  filename: string;
  status: string; 
  additions: number;
  deletions: number;
  changes: number;
}

export interface GitFileDTO {
  name: string;
  path: string;
  type: string; 
  size: number;
  sha: string;
  downloadUrl: string;
  encoding: string;
  lastCommit?: GitLastCommitDTO;
}

export interface GitLastCommitDTO {
  message: string;
  author: string;
  date: Date; 
  sha: string;
}

export interface GitTreeDTO {
  sha: string;
  url: string;
  tree: GitFileDTO[];
  truncated: boolean;
}

export interface GitRepositoryRequest {
  repoUrl: string;
  branch?: string;
  path?: string;
  page?: number;
  perPage?: number;
  query?: string;
}

export interface GitFileContentRequest {
  repoUrl: string;
  path: string;
  branch?: string;
}

export interface GitCommitRequest {
  repoUrl: string;
  branch?: string;
  page?: number;
  perPage?: number;
  sha?: string;
}