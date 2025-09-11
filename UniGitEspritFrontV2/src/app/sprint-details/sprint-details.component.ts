import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EtapeService } from '../services/etape.service';
import { CreateTaskRequest, Status, TacheDTO } from '../models/tache.model';
import { TacheService } from '../services/tache.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-sprint-details',
  templateUrl: './sprint-details.component.html',
  styleUrls: ['./sprint-details.component.css']
})
export class SprintDetailsComponent implements OnInit {
  currentRoute: string = 'groups';
  currentEtape!: any;
  currentEtapeId!: number;
  draggedTask: any = null;
  sprintNotes: string = '';
  remarks: string = '';
  isProcessing = false;
  showTaskMenu = false; // Fixed typo from showTaskMenuu to showTaskMenu

  sprintProgress: number = 20;
  teamPerformance = [
    { name: 'ines', commits: 1, lastCommit: '7 days ago' },
    { name: 'mouna', commits: 7, lastCommit: '2 hours ago' },
    { name: 'rim', commits: 15, lastCommit: '8 days ago' },
    { name: 'sana', commits: 20, lastCommit: '3 days ago' }
  ];
  tasks: TacheDTO[] = [];
  todoTasks: TacheDTO[] = [];
  progressTasks: TacheDTO[] = [];
  doneTasks: TacheDTO[] = [];
  users?: User;
  showCreateModal = false;
  isCreating = false;
  selectedColumn: 'todo' | 'inprogress' | 'done' = 'todo';
  selectedTask: TacheDTO | null = null;
  showDeleteModal = false; // New property for delete modal
  newTask: CreateTaskRequest = {
    title: '',
    description: '',
    responsableId: 0,
    status: Status.TODO,
  };
  validations = [
    { title: 'Validation 1', date: '15/01/2025', remarks: ['Description of the professor\'s remark', 'Description of the professor\'s remark', 'Description of the professor\'s remark'] },
    { title: 'Validation 2', date: '25/01/2025', remarks: ['Description of the professor\'s remark', 'Description of the professor\'s remark'] },
    { title: 'Validation 3', date: '31/01/2025', remarks: ['Description of the professor\'s remark'] }
  ];

  constructor(
    private router: Router,
    private tacheService: TacheService,
    private route: ActivatedRoute,
    private etapeService: EtapeService
  ) {}

  ngOnInit(): void {
    this.currentEtapeId = +this.route.snapshot.paramMap.get('id')!;
    this.etapeService.getEtapeById(this.currentEtapeId).subscribe({
      next: (etape) => {
        this.currentEtape = etape;
        this.loadTasks();
        console.log('Etape loaded:', etape);
      },
      error: (error) => {
        console.error('Error loading Etape:', error);
        this.currentEtape = null;
      }
    });
  }

  navigate(route: string) {
    this.currentRoute = route;
    this.router.navigate([`/${route}`]);
  }

  loadTasks(): void {
    if (this.currentEtapeId == null) {
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
      deadline: this.currentEtape.deadline || new Date().toISOString().split('T')[0],
      assigneeId: this.newTask.responsableId
    };

    this.tacheService.createTache(this.currentEtapeId, tacheDTO).subscribe({
      next: (createdTache) => {
        const assigneeMap: { [key: number]: string } = {
          1: 'mouna',
          2: 'Sana',
          3: 'ines',
          4: 'rim'
        };
        const taskWithAssignee = {
          ...createdTache,
          assignee: assigneeMap[createdTache.assigneeId] || 'Unknown'
        };

        switch (createdTache.status) {
          case Status.TODO:
            this.todoTasks.push(taskWithAssignee);
            break;
          case Status.IN_PROGRESS:
            this.progressTasks.push(taskWithAssignee);
            break;
          case Status.DONE:
            this.doneTasks.push(taskWithAssignee);
            break;
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
      case Status.TODO:
        return 'À faire';
      case Status.IN_PROGRESS:
        return 'En cours';
      case Status.DONE:
        return 'Terminé';
      default:
        return status;
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
    const assigneeMap: { [key: number]: string } = {
      1: 'mouna',
      2: 'Sana',
      3: 'ines',
      4: 'rim'
    };

    this.todoTasks = this.tasks
      .filter(task => task.status === Status.TODO)
      .map(task => ({
        ...task,
        assignee: assigneeMap[task.assigneeId] || 'Unknown'
      }));

    this.progressTasks = this.tasks
      .filter(task => task.status === Status.IN_PROGRESS)
      .map(task => ({
        ...task,
        assignee: assigneeMap[task.assigneeId] || 'Unknown'
      }));

    this.doneTasks = this.tasks
      .filter(task => task.status === Status.DONE)
      .map(task => ({
        ...task,
        assignee: assigneeMap[task.assigneeId] || 'Unknown'
      }));
  }

  showNotification() {
    alert('Notification clicked!');
  }

  deleteTask(taskId: number) {
    this.isProcessing = true;
    console.log('Deleting task ID:', taskId);
    this.tacheService.deleteTache(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.categorizeTasks();
        this.isProcessing = false;
        this.closeDeleteModal();
        alert('Task deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.isProcessing = false;
        alert('Failed to delete task: ' + (error.error?.message || 'Please try again.'));
      }
    });
  }

  viewMergeRequests() {
    alert('View Merge Requests functionality would be implemented here');
  }

  viewRepository() {
    alert('View Repository functionality would be implemented here');
  }

  editSprint() {
    alert('Edit Sprint functionality would be implemented here');
  }

  onDragStart(task: any) {
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

  updateTaskStatus(task: any, column: 'todo' | 'inprogress' | 'done') {
    let statut: Status;
    switch (column) {
      case 'todo':
        task.progress = 0;
        statut = Status.TODO;
        break;
      case 'inprogress':
        task.progress = 60;
        statut = Status.IN_PROGRESS;
        break;
      case 'done':
        task.progress = 100;
        statut = Status.DONE;
        break;
      default:
        statut = Status.TODO;
    }
    this.tacheService.updateStatus(task.id, statut).subscribe({
      next: () => console.log('Task status updated successfully'),
      error: (error) => console.error('Error updating task status:', error)
    });
    console.log(`Task ${task.id} moved to ${column}`);
  }

  moveTask(task: any, column: string) {
    this.todoTasks = this.todoTasks.filter(t => t !== task);
    this.progressTasks = this.progressTasks.filter(t => t !== task);
    this.doneTasks = this.doneTasks.filter(t => t !== task);

    if (column === 'todo') this.todoTasks.push(task);
    else if (column === 'inprogress') this.progressTasks.push(task);
    else if (column === 'done') this.doneTasks.push(task);
  }

  addValidation() {
    const validationTitle = prompt('Enter validation title:');
    if (validationTitle) {
      const validationDate = prompt('Enter validation date (DD/MM/YYYY):');
      if (validationDate) {
        this.validations.push({ title: validationTitle, date: validationDate, remarks: ['New validation remark'] });
      }
    }
  }

  addRemark(validation: any) {
    const remark = prompt('Enter remark:');
    if (remark) {
      validation.remarks.push(remark);
    }
  }

  saveNotes() {
    console.log('Sprint Notes:', this.sprintNotes);
    console.log('Remarks:', this.remarks);
    alert('Notes saved successfully!');
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
    this.showTaskMenu = false; // Close the task menu when opening delete modal
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
      // Fill the form with the existing task data
      this.selectedTask = task;
      this.newTask = {
        title: task.nom,
        description: task.description,
        responsableId: task.assigneeId,
        status: task.status,
      };
    } else {
      // Creation mode (already handled)
      this.resetNewTask();
    }
  }
}