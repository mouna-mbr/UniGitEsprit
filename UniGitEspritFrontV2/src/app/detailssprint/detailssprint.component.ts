import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EtapeDTO } from '../model/pipeline.model';
import { EtapeService } from '../services/etape.service';
import { CreateTaskRequest, Status, TacheDTO } from '../model/tache.model';
import { TacheService } from '../services/tache.service';
import { UserDTO } from '../model/user.model';

@Component({
  selector: 'app-detailssprint',
  templateUrl: './detailssprint.component.html',
  styleUrls: ['./detailssprint.component.css']
})
export class DetailssprintComponent implements OnInit {
  currentRoute: string = 'groups';
  currentEtape!:any ;
  currentEtapeId!: number ;
  draggedTask: any = null;
  sprintNotes: string = '';
  remarks: string = '';
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
  doneTasks : TacheDTO[] = [];
  users?: UserDTO;
  

  // Modal pour créer une tâche
  showCreateModal = false
  isCreating = false
  selectedColumn: "todo" | "inprogress" | "done" = "todo"

  // Nouvelle tâche
  newTask: CreateTaskRequest = {
    title: "",
    description: "",
    responsableId: 0,
    status: Status.TODO,
  }

  validations = [
    { title: 'Validation 1', date: '15/01/2025', remarks: ['Description of the professor\'s remark', 'Description of the professor\'s remark', 'Description of the professor\'s remark'] },
    { title: 'Validation 2', date: '25/01/2025', remarks: ['Description of the professor\'s remark', 'Description of the professor\'s remark'] },
    { title: 'Validation 3', date: '31/01/2025', remarks: ['Description of the professor\'s remark'] }
  ];

  constructor(private router: Router,      private tacheService: TacheService
,    private route: ActivatedRoute,private etapeService: EtapeService
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
      this.currentEtape = null; // Reset on error
    }
  });
  console.log(this.currentEtape);
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

  // Fermer le modal de création
  closeCreateModal() {
    this.showCreateModal = false
    this.resetNewTask()
  }

  // Réinitialiser le formulaire de nouvelle tâche
  resetNewTask() {
    this.newTask = {
      title: "",
      description: "",
      responsableId: 0,
      status: Status.TODO,
    }
  }
  openCreateModal(column: "todo" | "inprogress" | "done") {
    this.showCreateModal = true
console.log( this.showCreateModal );
    this.selectedColumn = column
    this.newTask.status = Status.TODO
    this.resetNewTask()
  }
  // Créer une nouvelle tâche
  createTask() {
   
  }

  // Obtenir le libellé du statut
  getStatusLabel(status: string): string {
    switch (status) {
      case "todo":
        return "À faire"
      case "inprogress":
        return "En cours"
      case "done":
        return "Terminé"
      default:
        return status
    }
  }

  // Obtenir le nom d'un utilisateur
  // getUserName(userId: number): string {
  //   const user = this.users.find((u) => u.id === userId)
  //   return user ? user.nom : "Utilisateur inconnu"
  // }

  // Obtenir les initiales d'un utilisateur
  // getUserInitials(userId: number): string {
  //   const user = this.users.find((u) => u.id === userId)
  //   if (!user) return "?"

  //   return user.nom
  //     .split(" ")
  //     .map((n) => n[0])
  //     .join("")
  //     .toUpperCase()
  //     .substring(0, 2)
  // }

  // Obtenir une couleur d'avatar
  getAvatarColor(userId: number): string {
    const colors = ["#dc2626", "#059669", "#3b82f6", "#7c3aed", "#ea580c", "#0891b2"]
    return colors[userId % colors.length]
  }

  // TrackBy pour optimiser les performances
  trackByTaskId(index: number, task: TacheDTO): number {
    return task.id || index
  }
  categorizeTasks(): void {
    // Map assigneeId to username (temporary mapping, replace with actual data)
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
    if (this.draggedTask) {
      this.draggedTask = null;
    }
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

  onDrop(event: DragEvent, column: string) {
    event.preventDefault();
    const container = event.currentTarget as HTMLElement;
    container.style.backgroundColor = '';

    if (this.draggedTask) {
      this.updateTaskStatus(this.draggedTask, column);
      this.moveTask(this.draggedTask, column);
     
    }
  }

  updateTaskStatus(task: any, column: string) {
     let statut!:String;
    switch (column) {
      case 'todo':
        task.progress = 0;
        statut = Status.TODO;
        break;
      case 'progress':
        task.progress = 60;
        statut = Status.IN_PROGRESS;
        // Default progress for in-progress tasks
        break;
      case 'done':
        task.progress = 100;
        statut=Status.DONE
  
        break;
    }
    this.tacheService.updateStatus(task.id, statut).subscribe({
      next: () => {
        console.log('Task status updated successfully');
      },
      error: (error) => {
        console.error('Error updating task status:', error);
      }
    });
    console.log(`Task ${task.id} moved to ${column}`);
  }

  moveTask(task: any, column: string) {
    // Remove from current column
    this.todoTasks = this.todoTasks.filter(t => t !== task);
    this.progressTasks = this.progressTasks.filter(t => t !== task);
    this.doneTasks = this.doneTasks.filter(t => t !== task);

    // Add to new column
    if (column === 'todo') this.todoTasks.push(task);
    else if (column === 'progress') this.progressTasks.push(task);
    else if (column === 'done') this.doneTasks.push(task);
  }

  addTask(column: string) {
    // const taskTitle = prompt('Enter task title:');
    // if (taskTitle) {
    //   const assignee = prompt('Assign to:');
    //   if (assignee) {
    //     const taskId = `UP-${Math.floor(Math.random() * 100) + 10}`;
    //     const newTask = { id: taskId, title: taskTitle, assignee, progress: 0 };
    //     if (column === 'todo') this.todoTasks.push(newTask);
    //     else if (column === 'progress') this.progressTasks.push(newTask);
    //     else if (column === 'done') this.doneTasks.push(newTask);
    //   }
    // }
  }

  showTaskMenu(task: any, event: MouseEvent) {
    event.stopPropagation();
    alert(`Task menu options for ${task.id} would appear here`);
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
}