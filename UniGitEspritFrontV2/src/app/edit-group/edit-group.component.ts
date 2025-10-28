import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ClasseService } from '../services/classe.service';
import { SujetService } from '../services/sujet.service';
import { GroupService } from '../services/group.service';
import { UserService } from '../services/user.service';
import { ClasseResponse } from '../models/classe.model';
import { SujetResponse } from '../models/sujet.model';
import { UserResponse, UserRole , Role } from '../models/user.model';
import { GroupCreate, GroupResponse } from '../models/group.model';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css']
})
export class EditGroupComponent implements OnInit {
  groupForm!: FormGroup;
  classes$!: Observable<ClasseResponse[]>;
  sujets$!: Observable<SujetResponse[]>;
  users$!: Observable<UserResponse[]>;
  errorMessage: string = '';
  newUserId: number | null = null;
  Role = Role; // Expose l'enum au template
  newUserRole: string = '';
  group: GroupResponse | null = null;
  groupId: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private classesService: ClasseService,
    private sujetsService: SujetService,
    private groupsService: GroupService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.groupId = +this.route.snapshot.paramMap.get('id')!;
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
    this.classes$ = this.classesService.getAllClasses();
    this.sujets$ = this.sujetsService.getAllSujets();
    this.users$ = this.userService.getAllUsers();
  }

  ngOnInit(): void {
    this.loadGroup();
  }

  loadGroup(): void {
    this.groupsService.getGroupById(this.groupId).subscribe({
      next: (group) => {
        this.group = group;
        this.groupForm.patchValue({
          nom: group.nom,
          classeId: group.classeId,
          sujetId: group.sujetId,
          enseignantId: group.enseignantId,
          gitRepoUrl: group.gitRepoUrl,
          gitRepoName: group.gitRepoName,
          users: group.users,
          isFavori: group.isFavori
        });
      },
      error: (error) => {
        this.errorMessage = error.message;
      }
    });
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

  onSubmit(): void {
    if (this.groupForm.valid) {
      const formValue = this.groupForm.value;
      this.groupsService.updateGroup(this.groupId, formValue).subscribe({
        next: () => {
          this.router.navigate(['/groups']);
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
    } else {
      this.errorMessage = 'Form invalid';
    }
  }

  goBack(): void {
    this.router.navigate(['/groups']);
  }
  
  generateRepoName(): void {
    const nom = this.groupForm.get('nom')?.value;
    if (nom) {
      this.groupForm.get('gitRepoName')?.setValue(`${nom}-repo`);
    } else {
      this.errorMessage = 'Enter group name first';
    }
  }
}