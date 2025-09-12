// git-group.component.ts
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GitRepositoryService } from "../services/git-repository.service";
import { GitRepositoryDTO, GitBranchDTO, GitCommitDTO, GitFileDTO } from "../models/git-repository.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-git-group",
  templateUrl: "./git-group.component.html",
  styleUrls: ["./git-group.component.css"],
})
export class GitGroupComponent implements OnInit, OnDestroy {
  repository: GitRepositoryDTO | null = null;
  branches: GitBranchDTO[] = [];
  commits: GitCommitDTO[] = [];
  files: GitFileDTO[] = [];
  currentBranch = "main";
  currentPath = "";
  currentFile: GitFileDTO | null = null;
  fileContent = "";
  readmeContent = "";

  // Navigation breadcrumbs
  pathBreadcrumbs: { name: string; path: string }[] = [];

  // Active tab
  activeTab: "code" | "commits" | "branches" = "code";

  // Loading states
  isLoading = false;
  isLoadingFile = false;
  isLoadingCommits = false;

  // Error states
  error: string | null = null;

  // Repository URL from route or input
  repoUrl = "";

  // Subscriptions
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private gitService: GitRepositoryService,
  ) {}

  ngOnInit() {
    // Get repository URL from route params or query params
    this.route.queryParams.subscribe((params) => {
      if (params["repoUrl"]) {
        this.repoUrl = params["repoUrl"];
        this.loadRepository();
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadRepository() {
    if (!this.repoUrl) return;

    this.isLoading = true;
    this.error = null;

    // Load repository info
    const repoSub = this.gitService.getRepository(this.repoUrl).subscribe({
      next: (repo) => {
        this.repository = repo;
        if (repo.defaultBranch) {
          this.currentBranch = repo.defaultBranch;
        }
        this.loadBranches();
        this.loadFiles();
        this.loadReadme();
      },
      error: (error) => {
        console.error("Error loading repository:", error);
        this.error = "Erreur lors du chargement du repository";
        this.isLoading = false;
        console.error("Error loading repository:", error);
      },
    });

    this.subscriptions.add(repoSub);
  }

  loadBranches() {
    const branchesSub = this.gitService.getBranches(this.repoUrl).subscribe({
      next: (branches) => {
        this.branches = branches;
      },
      error: (error) => {
        console.error("Error loading branches:", error);
      },
    });

    this.subscriptions.add(branchesSub);
  }

  loadFiles(path = "") {
    this.currentPath = path;
    this.updateBreadcrumbs();

    const filesSub = this.gitService.getContents(this.repoUrl, path, this.currentBranch).subscribe({
      next: (files) => {
        this.files = files.sort((a, b) => {
          // Directories first, then files
          if (a.type !== b.type) {
            return a.type === "dir" ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading files:", error);
        this.error = "Erreur lors du chargement des fichiers";
        this.isLoading = false;
      },
    });

    this.subscriptions.add(filesSub);
  }

  loadCommits() {
    this.isLoadingCommits = true;

    const commitsSub = this.gitService.getCommits(this.repoUrl, this.currentBranch).subscribe({
      next: (commits) => {
        this.commits = commits;
        this.isLoadingCommits = false;
      },
      error: (error) => {
        console.error("Error loading commits:", error);
        this.isLoadingCommits = false;
      },
    });

    this.subscriptions.add(commitsSub);
  }

  loadReadme() {
    const readmeSub = this.gitService.getReadme(this.repoUrl, this.currentBranch).subscribe({
      next: (content) => {
        this.readmeContent = content;
      },
      error: (error) => {
        console.error("Error loading README:", error);
      },
    });

    this.subscriptions.add(readmeSub);
  }

  loadFileContent(file: GitFileDTO) {
    if (file.type === "dir") {
      this.loadFiles(file.path);
      return;
    }

    this.currentFile = file;
    this.isLoadingFile = true;

    const contentSub = this.gitService.getFileContent(this.repoUrl, file.path, this.currentBranch).subscribe({
      next: (content) => {
        this.fileContent = content;
        this.isLoadingFile = false;
      },
      error: (error) => {
        console.error("Error loading file content:", error);
        this.fileContent = "Erreur lors du chargement du fichier";
        this.isLoadingFile = false;
      },
    });

    this.subscriptions.add(contentSub);
  }

  updateBreadcrumbs() {
    this.pathBreadcrumbs = [];

    if (this.currentPath) {
      const parts = this.currentPath.split("/");
      let currentPath = "";

      parts.forEach((part, index) => {
        currentPath += (index > 0 ? "/" : "") + part;
        this.pathBreadcrumbs.push({
          name: part,
          path: currentPath,
        });
      });
    }
  }

  navigateToPath(path: string) {
    this.loadFiles(path);
  }

  navigateToRoot() {
    this.loadFiles("");
    this.currentFile = null;
    this.fileContent = "";
  }

  switchBranch(branchName: string) {
    this.currentBranch = branchName;
    this.loadFiles();
    this.loadReadme();
    if (this.activeTab === "commits") {
      this.loadCommits();
    }
  }

  switchTab(tab: "code" | "commits" | "branches") {
    this.activeTab = tab;

    if (tab === "commits" && this.commits.length === 0) {
      this.loadCommits();
    }
  }

  closeFileViewer() {
    this.currentFile = null;
    this.fileContent = "";
  }

  getFileIcon(file: GitFileDTO): string {
    if (file.type === "dir") {
      return "fas fa-folder";
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "js":
      case "ts":
        return "fab fa-js-square";
      case "html":
        return "fab fa-html5";
      case "css":
      case "scss":
        return "fab fa-css3-alt";
      case "json":
        return "fas fa-code";
      case "md":
        return "fab fa-markdown";
      case "py":
        return "fab fa-python";
      case "java":
        return "fab fa-java";
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return "fas fa-image";
      case "pdf":
        return "fas fa-file-pdf";
      default:
        return "fas fa-file";
    }
  }

  getFileLanguage(filename: string): string {
    const extension = filename.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "js":
        return "javascript";
      case "ts":
        return "typescript";
      case "html":
        return "html";
      case "css":
        return "css";
      case "scss":
        return "scss";
      case "json":
        return "json";
      case "md":
        return "markdown";
      case "py":
        return "python";
      case "java":
        return "java";
      case "xml":
        return "xml";
      case "yml":
      case "yaml":
        return "yaml";
      default:
        return "text";
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  formatDate(date: Date): string {
    return new Intl.RelativeTimeFormat("fr", { numeric: "auto" }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day",
    );
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      console.log("Copied to clipboard:", text);
    });
  }

  downloadFile(file: GitFileDTO) {
    if (file.downloadUrl) {
      window.open(file.downloadUrl, "_blank");
    }
  }

  getLanguageColor(language: string): string {
    const colors: { [key: string]: string } = {
      JavaScript: "#f1e05a",
      TypeScript: "#2b7489",
      Python: "#3572A5",
      Java: "#b07219",
      "C++": "#f34b7d",
      "C#": "#239120",
      PHP: "#4F5D95",
      Ruby: "#701516",
      Go: "#00ADD8",
      Rust: "#dea584",
      Swift: "#ffac45",
      Kotlin: "#F18E33",
      HTML: "#e34c26",
      CSS: "#1572B6",
      Vue: "#2c3e50",
      React: "#61DAFB",
    };
    return colors[language] || "#586069";
  }

  getParentPath(): string {
    const parts = this.currentPath.split("/");
    parts.pop();
    return parts.join("/");
  }

  trackByFileName(index: number, file: GitFileDTO): string {
    return file.path;
  }

  trackByCommitSha(index: number, commit: GitCommitDTO): string {
    return commit.sha;
  }

  trackByBranchName(index: number, branch: GitBranchDTO): string {
    return branch.name;
  }

  getDefaultAvatar(): string {
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNkMGQ3ZGUiLz4KPHBhdGggZD0iTTE2IDhDMTMuNzkgOCAxMiA5Ljc5IDEyIDEyQzEyIDE0LjIxIDEzLjc5IDE2IDE2IDE2QzE4LjIxIDE2IDIwIDE0LjIxIDIwIDEyQzIwIDkuNzkgMTguMjEgOCAxNiA4WiIgZmlsbD0iIzU4NjA2OSIvPgo8cGF0aCBkPSJNMTYgMThDMTIuNjkgMTggMTAgMjAuNjkgMTAgMjRIMjJDMjIgMjAuNjkgMTkuMzEgMTggMTYgMThaIiBmaWxsPSIjNTg2MDY5Ii8+Cjwvc3ZnPgo=";
  }

  renderMarkdown(content: string): string {
    // Simple markdown rendering - vous pouvez utiliser une bibliothèque comme marked.js
    return content
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
      .replace(/`([^`]*)`/gim, "<code>$1</code>")
      .replace(/\n/gim, "<br>");
  }

  // Propriété pour window
  window = window;
}