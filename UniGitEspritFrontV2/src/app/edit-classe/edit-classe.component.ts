import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClasseService } from '../services/classe.service';
import { UserService } from '../services/user.service';
import { ClasseResponse, ClasseCreate } from '../models/classe.model'; // CORRIGÉ
import { UserResponse ,Role} from '../models/user.model';

@Component({
  selector: 'app-edit-classe',
  templateUrl: './edit-classe.component.html',
  styleUrls: ['./edit-classe.component.css']
})
export class EditClasseComponent implements OnInit {
  classeForm: FormGroup;
  errorMessage: string | null = null;
  users: UserResponse[] = []; // CORRIGÉ : UserResponse
  isUsersLoaded = false;
  newStudentId: number | null = null;
  newTeacherId: number | null = null;
  newlyAddedIds: number[] = [];
  classe: ClasseResponse | null = null;
  classeId: number;
  Role = Role; // Expose l'enum au template


  constructor(
    private fb: FormBuilder,
    private classeService: ClasseService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.classeId = +this.route.snapshot.paramMap.get('id')!;
    this.classeForm = this.fb.group({
      nom: ['', Validators.required],
      anneeUniversitaire: ['', Validators.required],
      level: ['', Validators.required],
      optionFormation: ['', Validators.required],
      sujetIds: [[]],
      etudiantIds: [[]],
      enseignantIds: [[]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadClasse();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: UserResponse[]) => { // Type explicite
        this.users = users;
        this.isUsersLoaded = true;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.showNotification('error', error.message);
      }
    });
  }

  loadClasse(): void {
    this.classeService.getClasseById(this.classeId).subscribe({
      next: (classe) => {
        this.classe = classe;
        this.classeForm.patchValue({
          nom: classe.nom,
          anneeUniversitaire: classe.anneeUniversitaire,
          level: classe.level,
          optionFormation: classe.optionFormation,
          etudiantIds: classe.etudiantIds || [],
          enseignantIds: classe.enseignantIds || []
        });
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.showNotification('error', error.message);
      }
    });
  }

  getUserName(id: number): string {
    const user = this.users.find(u => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : 'Inconnu';
  }

  addStudent(): void {
    const id = Number(this.newStudentId);
    const user = this.users.find(u => u.id === id);

    if (this.newStudentId && user && user.roles.includes(Role.STUDENT)) {
      const etudiantIds = [...(this.classeForm.get('etudiantIds')?.value || [])];
      if (!etudiantIds.includes(id)) {
        etudiantIds.push(id);
        this.classeForm.get('etudiantIds')?.setValue(etudiantIds);
        this.newlyAddedIds.push(id);
        setTimeout(() => this.newlyAddedIds = this.newlyAddedIds.filter(x => x !== id), 2000);
        this.newStudentId = null;
      }
    }
  }

  removeStudent(index: number): void {
    const etudiantIds = [...(this.classeForm.get('etudiantIds')?.value || [])];
    etudiantIds.splice(index, 1);
    this.classeForm.get('etudiantIds')?.setValue(etudiantIds);
  }

  addTeacher(): void {
    const id = Number(this.newTeacherId);
    const user = this.users.find(u => u.id === id);

    if (this.newTeacherId && user && user.roles.includes(Role.PROFESSOR)) {
      const enseignantIds = [...(this.classeForm.get('enseignantIds')?.value || [])];
      if (!enseignantIds.includes(id)) {
        enseignantIds.push(id);
        this.classeForm.get('enseignantIds')?.setValue(enseignantIds);
        this.newlyAddedIds.push(id);
        setTimeout(() => this.newlyAddedIds = this.newlyAddedIds.filter(x => x !== id), 2000);
        this.newTeacherId = null;
      }
    }
  }

  removeTeacher(index: number): void {
    const enseignantIds = [...(this.classeForm.get('enseignantIds')?.value || [])];
    enseignantIds.splice(index, 1);
    this.classeForm.get('enseignantIds')?.setValue(enseignantIds);
  }

  isNewlyAdded(id: number): boolean {
    return this.newlyAddedIds.includes(id);
  }

  onSubmit(): void {
    if (this.classeForm.valid) {
      const updatedClasse: ClasseCreate = this.classeForm.value;
      this.classeService.updateClasse(this.classeId, updatedClasse).subscribe({
        next: () => {
          this.showNotification('success', 'Classe mise à jour avec succès');
          this.router.navigate(['/classes']);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.showNotification('error', error.message);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/classes']);
  }

  showNotification(type: 'success' | 'error' | 'info', message: string): void {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type} show`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      ${message}
    `;
    container.appendChild(notification);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}