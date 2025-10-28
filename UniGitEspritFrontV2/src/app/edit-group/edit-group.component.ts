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
import { UserResponse, UserRole, Role } from '../models/user.model';
import { GroupCreate, GroupResponse } from '../models/group.model';
import { ToastrService } from 'ngx-toastr';

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
  Role = Role;
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
    private route: ActivatedRoute,
    private toastr: ToastrService
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
          isFavori: group.favori
        });
        this.toastr.success('Groupe chargé avec succès', 'Chargement', {
          timeOut: 3000,
          positionClass: 'toast-top-right'
        });
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.toastr.error(error.message, 'Erreur de chargement');
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

  onSubmit(): void {
    if (this.groupForm.valid) {
      const formValue = this.groupForm.value;
      this.groupsService.updateGroup(this.groupId, formValue).subscribe({
        next: () => {
          this.toastr.success('Groupe modifié avec succès', 'Modification réussie', {
            timeOut: 4000,
            positionClass: 'toast-top-right'
          });
          setTimeout(() => {
            this.router.navigate(['/groupes']);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.toastr.error(error.message, 'Erreur de modification');
        }
      });
    } else {
      this.errorMessage = 'Formulaire invalide';
      this.toastr.warning('Veuillez corriger les erreurs du formulaire', 'Formulaire invalide');
      this.markFormGroupTouched();
    }
  }

  goBack(): void {
    this.toastr.info('Modification annulée', 'Information', {
      timeOut: 2000,
      positionClass: 'toast-top-right'
    });
    this.router.navigate(['/groupes']);
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

  private markFormGroupTouched(): void {
    Object.keys(this.groupForm.controls).forEach(key => {
      const control = this.groupForm.get(key);
      control?.markAsTouched();
    });
  }
}