import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EtapeService } from '../services/etape.service';
import { CreateTaskRequest, Status, TacheDTO } from '../models/tache.model';
import { TacheService } from '../services/tache.service';
import { ValidationService } from '../services/validation.service';
import { ValidationDTO } from '../models/validation.model';
import { UserService } from '../services/user.service';
import { UserResponse ,Role } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { GitRepositoryService } from '../services/git-repository.service';
import { GitRepositoryDTO, GitCommitRequest, GitCommitDTO } from '../models/git-repository.model';
import { GroupService } from '../services/group.service';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { EtapeDTO } from '../models/pipeline.model';

@Component({
  selector: 'app-sprint-details',
  templateUrl: './sprint-details.component.html',
  styleUrls: ['./sprint-details.component.css']
})
export class SprintDetailsComponent implements OnInit {
  isAdmin :boolean | undefined = false;
  isProfessor :boolean | undefined = false;
  currentRoute: string = 'groups';
  currentEtape: EtapeDTO | null = null;
  currentEtapeId: number = 0;
  draggedTask: TacheDTO | null = null;
  sprintNotes: string = '';
  remarks: string = '';
  isProcessing = false;
  showRemarkPopup = false;
newRemark = '';
currentValidationId!: number;
  showTaskMenu = false;
  validations: ValidationDTO[] = [];
  students: UserResponse[] = [];
  repository: GitRepositoryDTO | null = null;
  sprintProgress: number = 20;
  teamPerformance: { name: string; commits: number; lastCommit: string }[] = [];
  tasks: TacheDTO[] = [];
  todoTasks: TacheDTO[] = [];
  progressTasks: TacheDTO[] = [];
  doneTasks: TacheDTO[] = [];
  showCreateModal = false;
  isCreating = false;
  selectedColumn: 'todo' | 'inprogress' | 'done' = 'todo';
  selectedTask: TacheDTO | null = null;
  showDeleteModal = false;
  newTask: CreateTaskRequest = {
    title: '',
    description: '',
    responsableId: 0,
    status: Status.TODO,
  };
  showAddValidationModal = false;
  newValidation: ValidationDTO = {
    id: 0,
    dateValidation: '',
    remarques: ['New validation remark'],
    etapeId: 0,
    etudiantIds: [],
    note: undefined
  };

  constructor(
    private router: Router,
    private tacheService: TacheService,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private etapeService: EtapeService,
    private validationService: ValidationService,
    private userService: UserService,
    private authService: AuthService,
    private gitRepositoryService: GitRepositoryService
  ) {}

  ngOnInit(): void {
    this.currentEtapeId = +this.route.snapshot.paramMap.get('id')!;
    this.etapeService.getEtapeById(this.currentEtapeId).subscribe({
      next: (etape: EtapeDTO) => {
        this.currentEtape = etape;
        this.loadTasks();
        this.loadValidations();
        this.loadStudents();
        this.loadRepository();
        console.log('Etape loaded:', etape);
      },
      error: (error) => {
        console.error('Error loading Etape:', error);
        this.currentEtape = null;
      }
    });
    const currentUser = this.authService.getCurrentUser();
    this.isAdmin = currentUser?.roles.includes(Role.ADMIN) || false;
    this.isProfessor = currentUser?.roles.includes(Role.PROFESSOR) || false;
  }

  navigate(route: string) {
    this.currentRoute = route;
    this.router.navigate([`/${route}`]);
  }

  loadTasks(): void {
    if (!this.currentEtapeId) {
      console.error('Etape ID is undefined');
      return;
    }
    this.tacheService.getTachesByEtapeId(this.currentEtapeId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.categorizeTasks();
        console.log('Tasks loaded:', tasks);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.tasks = [];
        this.todoTasks = [];
        this.progressTasks = [];
        this.doneTasks = [];
      }
    });
  }

  loadTeamPerformance(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !this.currentEtape?.gitRepoUrl) {
      console.warn('No user or repo URL available for team performance');
      this.teamPerformance = [];
      return;
    }
  
    const commitRequest: GitCommitRequest = {
      repoUrl: this.currentEtape.gitRepoUrl,
      branch: this.repository?.defaultBranch || 'main',
      page: 1,
      perPage: 100
    };
  
    this.gitRepositoryService.getCommits(commitRequest).subscribe({
      next: (commits: GitCommitDTO[]) => {
        const commitCounts = commits.reduce((acc, commit) => {
          const author = commit.author?.name || 'Unknown';
          
          // Convertir la date string en objet Date
          const commitDate = commit.author?.date 
            ? new Date(commit.author.date) 
            : new Date();
          
          const date = commitDate.toISOString();
          
          if (!acc[author]) {
            acc[author] = { commits: 0, lastCommitDate: date };
          }
          acc[author].commits += 1;
          
          // Comparer les dates correctement
          if (commitDate > new Date(acc[author].lastCommitDate)) {
            acc[author].lastCommitDate = date;
          }
          
          return acc;
        }, {} as { [key: string]: { commits: number; lastCommitDate: string } });
  
        this.teamPerformance = Object.entries(commitCounts).map(([name, data]) => ({
          name,
          commits: data.commits,
          lastCommit: formatDistanceToNow(parseISO(data.lastCommitDate), { addSuffix: true })
        }));
  
        console.log('Team performance loaded:', this.teamPerformance);
      },
      error: (error) => {
        console.error('Error loading commits:', error);
        this.teamPerformance = [];
      }
    });
  }

  loadValidations(): void {
    this.validationService.getValidationsByEtape(this.currentEtapeId).subscribe({
      next: (validations) => {
        this.validations = validations;
        console.log('Validations loaded:', validations);
      },
      error: (error) => {
        console.error('Error loading validations:', error);
        this.validations = [];
      }
    });
  }

  loadStudents(): void {
    this.userService.getStudentsByEtapeId(this.currentEtapeId).subscribe({
      next: (students) => {
        this.students = students;
        console.log('Students loaded:', students);
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.students = [];
      }
    });
  }

  loadRepository(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && this.currentEtape?.gitRepoUrl) {
      this.gitRepositoryService.getRepository(this.currentEtape.gitRepoUrl).subscribe({
        next: (repo) => {
          this.repository = repo;
          console.log('Repository loaded:', repo);
          this.loadTeamPerformance(); // Reload team performance with updated defaultBranch
        },
        error: (error) => {
          console.error('Error loading repository:', error);
          this.repository = null;
        }
      });
    } else {
      console.warn('No user or repo URL available');
    }
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.resetNewTask();
  }

  resetNewTask() {
    this.newTask = {
      title: '',
      description: '',
      responsableId: 0,
      status: Status.TODO,
    };
  }

  openCreateModal(column: 'todo' | 'inprogress' | 'done') {
    this.showCreateModal = true;
    this.selectedColumn = column;
    this.newTask = {
      title: '',
      description: '',
      responsableId: 0,
      status: this.getStatusFromColumn(column)
    };
  }

  getStatusFromColumn(column: string): Status {
    switch (column) {
      case 'todo': return Status.TODO;
      case 'inprogress': return Status.IN_PROGRESS;
      case 'done': return Status.DONE;
      default: return Status.TODO;
    }
  }

  createTask() {
    if (this.isCreating) return;
    this.isCreating = true;
    const tacheDTO: TacheDTO = {
      id: 0,
      nom: this.newTask.title,
      description: this.newTask.description,
      status: this.newTask.status,
      deadline: this.currentEtape?.deadline || new Date().toISOString().split('T')[0],
      assigneeId: this.newTask.responsableId
    };
    this.tacheService.createTache(this.currentEtapeId, tacheDTO).subscribe({
      next: (createdTache) => {
        const assigneeMap: { [key: number]: string } = this.students.reduce((map, student) => {
          map[student.id] = `${student.firstName} ${student.lastName}`;
          return map;
        }, {} as { [key: number]: string });
        const taskWithAssignee = {
          ...createdTache,
          assignee: assigneeMap[createdTache.assigneeId] || 'Unassigned'
        };
        switch (createdTache.status) {
          case Status.TODO: this.todoTasks.push(taskWithAssignee); break;
          case Status.IN_PROGRESS: this.progressTasks.push(taskWithAssignee); break;
          case Status.DONE: this.doneTasks.push(taskWithAssignee); break;
        }
        this.tasks.push(taskWithAssignee);
        this.isCreating = false;
        this.closeCreateModal();
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.isCreating = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case Status.TODO: return 'À faire';
      case Status.IN_PROGRESS: return 'En cours';
      case Status.DONE: return 'Terminé';
      default: return status;
    }
  }

  getAvatarColor(userId: number): string {
    const colors = ['#dc2626', '#059669', '#3b82f6', '#7c3aed', '#ea580c', '#0891b2'];
    return colors[userId % colors.length];
  }

  trackByTaskId(index: number, task: TacheDTO): number {
    return task.id || index;
  }

  categorizeTasks(): void {
    const assigneeMap: { [key: number]: string } = this.students.reduce((map, student) => {
      map[student.id] = `${student.firstName} ${student.lastName}`;
      return map;
    }, {} as { [key: number]: string });
    this.todoTasks = this.tasks
      .filter(task => task.status === Status.TODO)
      .map(task => ({ ...task, assignee: assigneeMap[task.assigneeId] || 'Unassigned' }));
    this.progressTasks = this.tasks
      .filter(task => task.status === Status.IN_PROGRESS)
      .map(task => ({ ...task, assignee: assigneeMap[task.assigneeId] || 'Unassigned' }));
    this.doneTasks = this.tasks
      .filter(task => task.status === Status.DONE)
      .map(task => ({ ...task, assignee: assigneeMap[task.assigneeId] || 'Unassigned' }));
  }

  showNotification() {
  }

  deleteTask(taskId: number) {
    this.isProcessing = true;
    this.tacheService.deleteTache(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.categorizeTasks();
        this.isProcessing = false;
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.isProcessing = false;
      }
    });
  }

  viewRepository() {
    console.log('currentEtape:', this.currentEtape);
    console.log('gitRepoUrl:', this.currentEtape?.gitRepoUrl);
    console.log('pipelineId:', this.currentEtape?.pipelineId);
    if (this.currentEtape?.gitRepoUrl) {
      this.router.navigate(['/repository-viewer'], { queryParams: { repoUrl: this.currentEtape.gitRepoUrl } });
    } else if (this.currentEtape?.pipelineId) {
      this.groupService.getGroupByPipelineId(this.currentEtape.pipelineId).subscribe({
        next: (group) => {
          console.log('Fetched group:', group);
          if (group.gitRepoUrl) {
            this.router.navigate(['/repository-viewer'], { queryParams: { repoUrl: group.gitRepoUrl } });
          } else {
          }
        },
        error: (err) => {
          console.error('Error fetching group:', err);
        }
      });
    } else {
    }
  }

  editSprint() {
  }

  onDragStart(task: TacheDTO) {
    this.draggedTask = task;
  }

  onDragEnd() {
    this.draggedTask = null;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    const container = event.currentTarget as HTMLElement;
    container.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
  }

  onDragLeave(event: DragEvent) {
    const container = event.currentTarget as HTMLElement;
    container.style.backgroundColor = '';
  }

  onDrop(event: DragEvent, column: 'todo' | 'inprogress' | 'done') {
    event.preventDefault();
    const container = event.currentTarget as HTMLElement;
    container.style.backgroundColor = '';
    if (this.draggedTask) {
      this.updateTaskStatus(this.draggedTask, column);
      this.moveTask(this.draggedTask, column);
    }
  }

  updateTaskStatus(task: TacheDTO, column: 'todo' | 'inprogress' | 'done') {
    let statut: Status;
    switch (column) {
      case 'todo': task.progress = 0; statut = Status.TODO; break;
      case 'inprogress': task.progress = 60; statut = Status.IN_PROGRESS; break;
      case 'done': task.progress = 100; statut = Status.DONE; break;
      default: statut = Status.TODO;
    }
    this.tacheService.updateStatus(task.id, statut).subscribe({
      next: () => console.log('Task status updated successfully'),
      error: (error) => console.error('Error updating task status:', error)
    });
    console.log(`Task ${task.id} moved to ${column}`);
  }

  moveTask(task: TacheDTO, column: string) {
    this.todoTasks = this.todoTasks.filter(t => t !== task);
    this.progressTasks = this.progressTasks.filter(t => t !== task);
    this.doneTasks = this.doneTasks.filter(t => t !== task);
    if (column === 'todo') this.todoTasks.push(task);
    else if (column === 'inprogress') this.progressTasks.push(task);
    else if (column === 'done') this.doneTasks.push(task);
  }

  addValidation() {
    this.showAddValidationModal = true;
    this.newValidation = {
      id: 0,
      dateValidation: '',
      remarques: ['New validation remark'],
      etapeId: this.currentEtapeId,
      etudiantIds: [],
      note: undefined
    };
  }

  closeAddValidationModal() {
    this.showAddValidationModal = false;
    this.newValidation = {
      id: 0,
      dateValidation: '',
      remarques: ['New validation remark'],
      etapeId: this.currentEtapeId,
      etudiantIds: [],
      note: undefined
    };
  }

  submitAddValidation() {
    console.log('Submitting validation:', this.newValidation);
    if (!this.newValidation.dateValidation) {
      
      return;
    }
    const noteValue = this.newValidation.note ? parseFloat(this.newValidation.note as any) : undefined;
    if (noteValue !== undefined && isNaN(noteValue)) {
      
      return;
    }
    this.newValidation.note = noteValue;
    this.newValidation.etapeId = this.currentEtapeId;
    this.validationService.createValidation(this.currentEtapeId, this.newValidation).subscribe({
      next: (createdValidation) => {
        this.validations.push(createdValidation);
        this.closeAddValidationModal();
       
      },
      error: (error) => {
        console.error('Error adding validation:', error);
       
      }
    });
  }

  saveNotes() {
    console.log('Sprint Notes:', this.sprintNotes);
    console.log('Remarks:', this.remarks);
    
  }

  toggleTaskMenu(task: TacheDTO, event: MouseEvent) {
    event.stopPropagation();
    if (this.selectedTask?.id === task.id && this.showTaskMenu) {
      this.showTaskMenu = false;
      this.selectedTask = null;
    } else {
      this.selectedTask = task;
      this.showTaskMenu = true;
    }
  }

  openDeleteModal(task: TacheDTO) {
    this.selectedTask = task;
    this.showDeleteModal = true;
    this.showTaskMenu = false;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedTask = null;
  }

  confirmDelete() {
    if (this.selectedTask) {
      this.deleteTask(this.selectedTask.id);
    }
  }

  openTaskModal(mode: 'update' | 'create', column: 'todo' | 'inprogress' | 'done', task?: TacheDTO) {
    this.showCreateModal = true;
    this.selectedColumn = column;
    if (mode === 'update' && task) {
      this.selectedTask = task;
      this.newTask = {
        title: task.nom,
        description: task.description,
        responsableId: task.assigneeId,
        status: task.status,
      };
    } else {
      this.resetNewTask();
    }
  }
  addRemark(validationId: number) {
    this.currentValidationId = validationId;
    this.newRemark = '';
    this.showRemarkPopup = true;
  }
  
  closeRemarkPopup() {
    this.showRemarkPopup = false;
  }
  
  submitRemark() {
    if (!this.newRemark.trim()) return;
  
    this.validationService.addRemark(this.currentValidationId, this.newRemark).subscribe({
      next: (updatedValidation) => {
        const index = this.validations.findIndex(v => v.id === this.currentValidationId);
        if (index !== -1) this.validations[index] = updatedValidation;
       
        this.closeRemarkPopup();
      },
      error: (error) => {
        console.error('Error adding remark:', error);
      
      }
    });
  }
  // addRemark(validationId: number) {
  //   const newRemark = prompt('Enter new remark:');
  //   if (newRemark) {
  //     this.validationService.addRemark(validationId, newRemark).subscribe({
  //       next: (updatedValidation) => {
  //         const index = this.validations.findIndex(v => v.id === validationId);
  //         if (index !== -1) this.validations[index] = updatedValidation;
  //         alert('Remark added successfully!');
  //       },
  //       error: (error) => {
  //         console.error('Error adding remark:', error);
  //         alert('Failed to add remark.');
  //       }
  //     });
  //   }
  // }

  updateRemark(validationId: number, remarkIndex: number) {
    const updatedRemark = prompt('Enter updated remark:');
    if (updatedRemark) {
      this.validationService.updateRemark(validationId, remarkIndex, updatedRemark).subscribe({
        next: (updatedValidation) => {
          const index = this.validations.findIndex(v => v.id === validationId);
          if (index !== -1) this.validations[index] = updatedValidation;
        
        },
        error: (error) => {
          console.error('Error updating remark:', error);
         
        }
      });
    }
  }

  deleteRemark(validationId: number, remarkIndex: number) {
    
      this.validationService.deleteRemark(validationId, remarkIndex).subscribe({
        next: (updatedValidation) => {
          const index = this.validations.findIndex(v => v.id === validationId);
          if (index !== -1) this.validations[index] = updatedValidation;
          
        },
        error: (error) => {
          console.error('Error deleting remark:', error);
         
        }
      });
    }
  }
