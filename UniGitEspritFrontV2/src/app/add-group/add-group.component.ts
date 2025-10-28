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
import { UserResponse, UserRole, Role } from '../models/user.model';
import { GroupCreate } from '../models/group.model';
import { ToastrService } from 'ngx-toastr';

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
  Role = Role;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private classesService: ClasseService,
    private sujetsService: SujetService,
    private groupsService: GroupService,
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService
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
      this.toastr.success('Utilisateur ajouté au groupe', 'Membre ajouté', {
        timeOut: 3000,
        positionClass: 'toast-top-right'
      });
    } else {
      this.errorMessage = 'Veuillez sélectionner un utilisateur et un rôle';
      this.toastr.warning('Veuillez sélectionner un utilisateur et un rôle', 'Champs requis');
    }
  }

  removeUser(index: number): void {
    const currentUsers = this.groupForm.get('users')?.value || [];
    currentUsers.splice(index, 1);
    this.groupForm.get('users')?.setValue(currentUsers);
    this.toastr.info('Utilisateur retiré du groupe', 'Membre retiré', {
      timeOut: 3000,
      positionClass: 'toast-top-right'
    });
  }

  getUserName(userId: number): string {
    return `Utilisateur ${userId}`;
  }

  generateRepoName(): void {
    const nom = this.groupForm.get('nom')?.value;
    if (nom) {
      this.groupForm.get('gitRepoName')?.setValue(`${nom}-repo`);
      this.toastr.info('Nom de dépôt généré automatiquement', 'Génération', {
        timeOut: 3000,
        positionClass: 'toast-top-right'
      });
    } else {
      this.errorMessage = 'Entrez d\'abord le nom du groupe';
      this.toastr.warning('Entrez d\'abord le nom du groupe', 'Nom requis');
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
            this.toastr.success('Groupe créé avec succès', 'Création réussie', {
              timeOut: 4000,
              positionClass: 'toast-top-right'
            });
            setTimeout(() => {
              this.router.navigate(['/groupes']);
            }, 1500);
          },
          error: (error) => {
            this.errorMessage = error.message;
            if (error.status === 401) {
              this.errorMessage = 'Utilisateur non authentifié';
              this.toastr.error('Utilisateur non authentifié', 'Erreur d\'authentification');
            } else if (error.status === 409) {
              this.errorMessage = 'Le nom du groupe existe déjà';
              this.toastr.error('Le nom du groupe existe déjà', 'Conflit');
            } else if (error.status === 500) {
              this.errorMessage = 'Échec de la création du groupe. Veuillez réessayer.';
              this.toastr.error('Échec de la création du groupe', 'Erreur serveur');
            } else {
              this.toastr.error(error.message, 'Erreur de création');
            }
          }
        });
      } else {
        this.errorMessage = 'Utilisateur non authentifié';
        this.toastr.error('Utilisateur non authentifié', 'Erreur d\'authentification');
      }
    } else {
      this.errorMessage = 'Formulaire invalide';
      this.toastr.warning('Veuillez corriger les erreurs du formulaire', 'Formulaire invalide');
      this.markFormGroupTouched();
    }
  }

  goBack(): void {
    this.toastr.info('Création annulée', 'Information', {
      timeOut: 2000,
      positionClass: 'toast-top-right'
    });
    this.router.navigate(['/groupes']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.groupForm.controls).forEach(key => {
      const control = this.groupForm.get(key);
      control?.markAsTouched();
    });
  }
}