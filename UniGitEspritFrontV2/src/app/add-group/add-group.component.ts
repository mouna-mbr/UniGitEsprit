import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ClasseService } from '../services/classe.service';
import { SujetService } from '../services/sujet.service';
import { GroupService } from '../services/group.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ClasseResponse } from '../models/classe.model';
import { SujetResponse } from '../models/sujet.model';
import { UserResponse, UserRole } from '../models/user.model';
import { GroupCreate } from '../models/group.model';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {
  groupForm!: FormGroup;
  classes$!: Observable<ClasseResponse[]>;
  sujets$!: Observable<SujetResponse[]>;
  users$!: Observable<UserResponse[]>;
  errorMessage: string = '';
  newUserId: number | null = null;
  newUserRole: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private classesService: ClasseService,
    private sujetsService: SujetService,
    private groupsService: GroupService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.groupForm = this.fb.group({
      nom: ['', Validators.required],
      classeId: ['', Validators.required],
      sujetId: ['', Validators.required],
      enseignantId: ['', Validators.required],
      gitRepoUrl: [''],
      gitRepoName: [''],
      users: [[] as UserRole[]],
      isFavori: [false]
    });
  }

  ngOnInit(): void {
    this.classes$ = this.classesService.getAllClasses();
    this.sujets$ = this.sujetsService.getAllSujets();
    this.users$ = this.userService.getAllUsers();
  }

  addUser(): void {
    if (this.newUserId && this.newUserRole) {
      const currentUsers = this.groupForm.get('users')?.value || [];
      currentUsers.push({ userId: this.newUserId, role: this.newUserRole });
      this.groupForm.get('users')?.setValue(currentUsers);
      this.newUserId = null;
      this.newUserRole = '';
    } else {
      this.errorMessage = 'Please select user and role';
    }
  }

  removeUser(index: number): void {
    const currentUsers = this.groupForm.get('users')?.value || [];
    currentUsers.splice(index, 1);
    this.groupForm.get('users')?.setValue(currentUsers);
  }

  getUserName(userId: number): string {
    // Implement logic to get user name from users$ or service
    return `User ${userId}`; // Placeholder
  }

  generateRepoName(): void {
    const nom = this.groupForm.get('nom')?.value;
    if (nom) {
      this.groupForm.get('gitRepoName')?.setValue(`${nom}-repo`);
    } else {
      this.errorMessage = 'Enter group name first';
    }
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        const gitUsername = currentUser.gitUsername;
        const gitAccessToken = currentUser.gitAccessToken;
        const formValue = this.groupForm.value;
        if (formValue.gitRepoName && !formValue.gitRepoUrl) {
          formValue.gitUsername = gitUsername;
          formValue.gitAccessToken = gitAccessToken;
        }
        this.groupsService.addGroup(formValue).subscribe({
          next: () => {

            this.router.navigate(['/groupes']);
          },
          error: (error) => {
            this.errorMessage = error.message;
            if (error.status === 401) {
              this.errorMessage = 'User not authenticated';
            }else if (error.status === 409) {
              this.errorMessage = 'Group name already exists';
            }
            else if (error.status === 500) {
              this.errorMessage = 'Failed to create group. Please try again.';
            }
          }
        });
      } else {
        this.errorMessage = 'User not authenticated';
      }
    } else {
      this.errorMessage = 'Form invalid';
    }
  }

  goBack(): void {
    this.router.navigate(['/groups']);
  }
}