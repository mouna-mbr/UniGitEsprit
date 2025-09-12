// src/app/repository-viewer.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GitRepositoryService } from '../services/git-repository.service';
import {
  GitRepositoryDTO,
  GitBranchDTO,
  GitCommitDTO,
  GitFileDTO,
  GitFileContentDTO,
  GitCommitRequest,
  GitFileContentRequest
} from '../models/git-repository.model';
import { ActivatedRoute } from '@angular/router';
import { marked } from 'marked';

@Component({
  selector: 'app-repository-viewer',
  templateUrl: './repository-viewer.component.html',
  styleUrls: ['./repository-viewer.component.css']
})
export class RepositoryViewerComponent implements OnInit {
  repository: GitRepositoryDTO | null = null;
  branches: GitBranchDTO[] = [];
  commits: GitCommitDTO[] = [];
  files: GitFileDTO[] = [];
  fileContent: string | null = null;
  readmeContent: string | null = null;
  currentBranch: string = '';
  currentPath: string = '';
  currentFile: GitFileDTO | null = null;
  pathBreadcrumbs: { name: string, path: string }[] = [];
  activeTab: 'code' | 'commits' | 'branches' = 'code';
  isLoading = false;
  isLoadingCommits = false;
  isLoadingFile = false;
  error: string | null = null;
  private repoUrl: string = ''; // Store repoUrl for retry

  constructor(
    private gitService: GitRepositoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const repoUrl = this.route.snapshot.queryParamMap.get('repoUrl');
    if (repoUrl) {
      this.repoUrl = repoUrl;
      this.loadRepository(repoUrl);
    } else {
      this.error = 'No repository URL provided';
    }
    console.log('Repository URL:', repoUrl);
  }

  loadRepository(repoUrl: string): void {
    this.isLoading = true;
    this.error = null;
    this.gitService.getRepository(repoUrl).subscribe({
      next: (repo) => {
        this.repository = repo;
        this.currentBranch = repo.defaultBranch;
        this.loadBranches(repoUrl);
        this.loadFiles(repoUrl, repo.defaultBranch);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Erreur lors du chargement du repository';
        this.isLoading = false;
      }
    });
  }

  retryLoadRepository(): void {
    if (this.repoUrl) {
      this.loadRepository(this.repoUrl);
    } else {
      this.error = 'No repository URL available for retry';
    }
  }

  openGitHubLink(): void {
    if (this.repository?.url) {
      window.open(this.repository.url, '_blank');
    } else {
      this.error = 'No repository URL available';
    }
  }

  loadBranches(repoUrl: string): void {
    this.gitService.getBranches(repoUrl).subscribe({
      next: (branches) => {
        this.branches = branches;
        if (!this.currentBranch) {
          this.currentBranch = branches.find(b => b.name === this.repository?.defaultBranch)?.name || branches[0]?.name || '';
        }
      },
      error: (err) => {
        this.error = err.message || 'Erreur lors du chargement des branches';
      }
    });
  }

  loadCommits(repoUrl: string): void {
    this.isLoadingCommits = true;
    const request: GitCommitRequest = {
      repoUrl,
      branch: this.currentBranch,
      page: 1,
      perPage: 30
    };
    this.gitService.getCommits(request).subscribe({
      next: (commits) => {
        this.commits = commits;
        this.isLoadingCommits = false;
      },
      error: (err) => {
        this.error = err.message || 'Erreur lors du chargement des commits';
        this.isLoadingCommits = false;
      }
    });
  }

  loadFiles(repoUrl: string, branch: string, path: string = ''): void {
    this.gitService.getFiles(repoUrl, branch, path).subscribe({
      next: (files) => {
        this.files = files;
        if (!path) {
          const readme = files.find(f => f.name.toLowerCase() === 'readme.md');
          if (readme) {
            this.loadFileContent(readme, true);
          }
        }
        this.updateBreadcrumbs(path);
      },
      error: (err) => {
        this.error = err.message || 'Erreur lors du chargement des fichiers';
      }
    });
  }

  async loadFileContent(file: GitFileDTO, isReadme: boolean = false): Promise<void> {
    if (file.type === 'dir') {
      this.currentPath = file.path;
      this.loadFiles(this.repository!.url, this.currentBranch, this.currentPath);
    } else {
      this.isLoadingFile = true;
      const request: GitFileContentRequest = {
        repoUrl: this.repository!.url,
        path: file.path,
        branch: this.currentBranch
      };
      this.gitService.getFileContent(request).subscribe({
        next: async (content) => {
          this.fileContent = content.content;
          if (isReadme) {
            this.readmeContent = await this.renderMarkdown(content.content);
          } else {
            this.currentFile = file;
          }
          this.isLoadingFile = false;
        },
        error: (err) => {
          this.error = err.message || 'Erreur lors du chargement du contenu du fichier';
          this.isLoadingFile = false;
        }
      });
    }
  }

  switchTab(tab: 'code' | 'commits' | 'branches'): void {
    console.log('Switching to tab:', tab);
    this.activeTab = tab;
    if (tab === 'commits' && !this.commits.length && this.repository) {
      this.loadCommits(this.repository.url);
    }
  }

  switchBranch(branch: string): void {
    this.currentBranch = branch;
    this.currentPath = '';
    this.currentFile = null;
    this.fileContent = null;
    this.readmeContent = null;
    if (this.repository) {
      this.loadFiles(this.repository.url, branch);
    }
  }

  navigateToRoot(): void {
    this.currentPath = '';
    this.currentFile = null;
    this.fileContent = null;
    if (this.repository) {
      this.loadFiles(this.repository.url, this.currentBranch);
    }
  }

  navigateToPath(path: string): void {
    this.currentPath = path;
    this.currentFile = null;
    this.fileContent = null;
    if (this.repository) {
      this.loadFiles(this.repository.url, this.currentBranch, path);
    }
  }

  getParentPath(): string {
    const parts = this.currentPath.split('/');
    parts.pop();
    return parts.join('/');
  }

  updateBreadcrumbs(path: string): void {
    if (!path) {
      this.pathBreadcrumbs = [];
      return;
    }
    const parts = path.split('/');
    this.pathBreadcrumbs = parts.map((part, index) => ({
      name: part,
      path: parts.slice(0, index + 1).join('/')
    }));
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }

  downloadFile(file: GitFileDTO): void {
    if (file.downloadUrl) {
      window.open(file.downloadUrl, '_blank');
    }
  }

  closeFileViewer(): void {
    this.currentFile = null;
    this.fileContent = null;
  }

  getFileIcon(file: GitFileDTO): string {
    return file.type === 'dir' ? 'fas fa-folder' : 'fas fa-file';
  }

  getFileLanguage(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'java': 'java',
      'md': 'markdown',
      'html': 'html',
      'css': 'css'
    };
    return languageMap[ext!] || 'text';
  }

  formatFileSize(size: number): string {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getLanguageColor(language: string): string {
    const colorMap: { [key: string]: string } = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'HTML': '#e34c26',
      'CSS': '#563d7c'
    };
    return colorMap[language] || '#888';
  }

  getDefaultAvatar(): string {
    return 'https://github.com/identicons/default.png';
  }

  async renderMarkdown(content: string): Promise<string> {
    try {
      const result = await marked.parse(content);
      return result;
    } catch (err) {
      console.error('Error rendering Markdown:', err);
      return content; // Fallback to raw content
    }
  }

  trackByFileName(_index: number, file: GitFileDTO): string {
    return file.path;
  }

  trackByCommitSha(_index: number, commit: GitCommitDTO): string {
    return commit.sha;
  }

  trackByBranchName(_index: number, branch: GitBranchDTO): string {
    return branch.name;
  }
}