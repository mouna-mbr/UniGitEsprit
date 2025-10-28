import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClasseService } from '../services/classe.service';
import { UserService } from '../services/user.service';
import { ClasseCreate } from '../models/classe.model';
import { User, Role } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';

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
  newStudentId: number | string | null = null;
  newTeacherId: number | string | null = null;
  newlyAddedIds: number[] = [];
  Role = Role;

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
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
        this.isUsersLoaded = true;
        this.toastr.success('Utilisateurs chargés avec succès', 'Chargement réussi');
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.toastr.error('Erreur lors du chargement des utilisateurs', 'Erreur');
      }
    });
  }

  getUserName(id: number): string {
    const user = this.users.find(u => u.id === Number(id));
    return user ? `${user.firstName} ${user.lastName}` : 'Inconnu';
  }

  addStudent(): void {
    const numericId = Number(this.newStudentId);
    const user = this.users.find(u => u.id === numericId);
    
    if (this.newStudentId && user && user.roles?.includes(Role.STUDENT)) {
      const etudiantIds = this.classeForm.get('etudiantIds')?.value || [];
      if (!etudiantIds.includes(numericId)) {
        etudiantIds.push(numericId);
        this.classeForm.get('etudiantIds')?.setValue(etudiantIds);
        this.newlyAddedIds.push(numericId);
        setTimeout(() => {
          this.newlyAddedIds = this.newlyAddedIds.filter(id => id !== numericId);
        }, 2000);
        this.newStudentId = null;
        this.toastr.success('Étudiant ajouté à la classe', 'Succès');
      } else {
        this.toastr.warning('Cet étudiant est déjà dans la classe', 'Attention');
      }
    } else {
      this.toastr.error('Veuillez sélectionner un étudiant valide', 'Erreur');
    }
  }

  removeStudent(index: number): void {
    const etudiantIds = this.classeForm.get('etudiantIds')?.value || [];
    const removedStudent = etudiantIds[index];
    etudiantIds.splice(index, 1);
    this.classeForm.get('etudiantIds')?.setValue(etudiantIds);
    this.toastr.info('Étudiant retiré de la classe', 'Information');
  }

  addTeacher(): void {
    const numericId = Number(this.newTeacherId);
    const user = this.users.find(u => u.id === numericId);
    
    if (this.newTeacherId && user && user.roles?.includes(Role.PROFESSOR)) {
      const enseignantIds = this.classeForm.get('enseignantIds')?.value || [];
      if (!enseignantIds.includes(numericId)) {
        enseignantIds.push(numericId);
        this.classeForm.get('enseignantIds')?.setValue(enseignantIds);
        this.newlyAddedIds.push(numericId);
        setTimeout(() => {
          this.newlyAddedIds = this.newlyAddedIds.filter(id => id !== numericId);
        }, 2000);
        this.newTeacherId = null;
        this.toastr.success('Enseignant ajouté à la classe', 'Succès');
      } else {
        this.toastr.warning('Cet enseignant est déjà dans la classe', 'Attention');
      }
    } else {
      this.toastr.error('Veuillez sélectionner un enseignant valide', 'Erreur');
    }
  }

  removeTeacher(index: number): void {
    const enseignantIds = this.classeForm.get('enseignantIds')?.value || [];
    enseignantIds.splice(index, 1);
    this.classeForm.get('enseignantIds')?.setValue(enseignantIds);
    this.toastr.info('Enseignant retiré de la classe', 'Information');
  }

  isNewlyAdded(id: number): boolean {
    return this.newlyAddedIds.includes(id);
  }

  onSubmit(): void {
    if (this.classeForm.valid) {
      const classe: ClasseCreate = this.classeForm.value;
      this.classeService.addClasse(classe).subscribe({
        next: () => {
          this.toastr.success('Classe créée avec succès', 'Succès');
          this.router.navigate(['/classes']);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.toastr.error('Erreur lors de la création de la classe', 'Erreur');
        }
      });
    } else {
      this.toastr.error('Veuillez remplir tous les champs obligatoires', 'Formulaire invalide');
    }
  }

  goBack(): void {
    this.router.navigate(['/classes']);
  }
}