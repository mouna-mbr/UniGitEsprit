import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ClasseService } from '../services/classe.service';
import { UserService } from '../services/user.service';
import { User, ClasseCreate } from '../models/classe.model';

@Component({
  selector: 'app-add-classe',
  templateUrl: './add-classe.component.html',
  styleUrls: ['./add-classe.component.css']
})
export class AddClasseComponent implements OnInit {
  classeForm: FormGroup;
  errorMessage: string | null = null;
  users: User[] = [];
  isUsersLoaded: boolean = false;
  newStudentId: number | string | null = null; // Allow string for binding
  newTeacherId: number | string | null = null; // Allow string for binding
  newlyAddedIds: number[] = []; // Track newly added IDs

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseService,
    private userService: UserService,
    private router: Router
  ) {
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
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        console.log('Users loaded:', users); // Debug log with full details
        this.isUsersLoaded = true;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.showNotification('error', error.message);
      }
    });
  }

  getUserName(id: number): string {
    const user = this.users.find(u => u.id === Number(id));
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  }

  addStudent(): void {
    console.log('Add Student clicked, newStudentId:', this.newStudentId, 'Users:', this.users); // Enhanced debug
    const numericId = Number(this.newStudentId); // Convert to number
    const user = this.users.find(u => u.id === numericId);
    console.log('User found for id', numericId, ':', user); // Debug specific user
    if (this.newStudentId && user && user.role?.includes('STUDENT') ) {
      const etudiantIds = this.classeForm.get('etudiantIds')?.value || [];
      if (!etudiantIds.includes(numericId)) {
        etudiantIds.push(numericId);
        this.classeForm.get('etudiantIds')?.setValue(etudiantIds);
        this.newlyAddedIds.push(numericId); // Mark as newly added
        setTimeout(() => {
          this.newlyAddedIds = this.newlyAddedIds.filter(id => id !== numericId); // Remove after 2 seconds
        }, 2000);
        this.newStudentId = null;
      }
    } else {
      console.log('Add Student failed: No user with id', numericId, 'or role is not STUDENT, user:', user);
    }
  }

  removeStudent(index: number): void {
    console.log('Remove Student clicked, index:', index); // Debug log
    const etudiantIds = this.classeForm.get('etudiantIds')?.value || [];
    etudiantIds.splice(index, 1);
    this.classeForm.get('etudiantIds')?.setValue(etudiantIds);
  }

  addTeacher(): void {
    console.log('Add Teacher clicked, newTeacherId:', this.newTeacherId, 'Users:', this.users); // Enhanced debug
    const numericId = Number(this.newTeacherId); // Convert to number
    const user = this.users.find(u => u.id === numericId);
    console.log('User found for id', numericId, ':', user); // Debug specific user
    if (this.newTeacherId && user && user.role?.includes('PROFESSOR')) {
      const enseignantIds = this.classeForm.get('enseignantIds')?.value || [];
      if (!enseignantIds.includes(numericId)) {
        enseignantIds.push(numericId);
        this.classeForm.get('enseignantIds')?.setValue(enseignantIds);
        this.newlyAddedIds.push(numericId); // Mark as newly added
        setTimeout(() => {
          this.newlyAddedIds = this.newlyAddedIds.filter(id => id !== numericId); // Remove after 2 seconds
        }, 2000);
        this.newTeacherId = null;
      }
    } else {
      console.log('Add Teacher failed: No user with id', numericId, 'or role is not PROFESSOR, user:', user);
    }
  }

  removeTeacher(index: number): void {
    console.log('Remove Teacher clicked, index:', index); // Debug log
    const enseignantIds = this.classeForm.get('enseignantIds')?.value || [];
    enseignantIds.splice(index, 1);
    this.classeForm.get('enseignantIds')?.setValue(enseignantIds);
  }

  isNewlyAdded(id: number): boolean {
    return this.newlyAddedIds.includes(id);
  }

  onSubmit(): void {
    console.log('Submit clicked, form value:', this.classeForm.value); // Debug log
    if (this.classeForm.valid) {
      const classe: ClasseCreate = this.classeForm.value;
      this.classeService.addClasse(classe).subscribe({
        next: () => {
          this.showNotification('success', 'Class added successfully');
          this.router.navigate(['/classes']);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.showNotification('error', error.message);
        }
      });
    } else {
      console.log('Form is invalid:', this.classeForm.errors);
    }
  }

  goBack(): void {
    console.log('Back clicked'); // Debug log
    this.router.navigate(['/classes']);
  }

  showNotification(type: 'success' | 'error' | 'info', message: string): void {
    const container = document.getElementById('notification-container');
    if (container) {
      const notification = document.createElement('div');
      notification.className = `notification ${type} show`;
      notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
      `;
      container.appendChild(notification);
      setTimeout(() => {
        notification.className = `notification ${type}`;
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  }
}