import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClasseService } from '../services/classe.service';
import { UserService } from '../services/user.service';
import { ClasseResponse, ClasseCreate } from '../models/classe.model';
import { UserResponse, Role } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-classe',
  templateUrl: './edit-classe.component.html',
  styleUrls: ['./edit-classe.component.css']
})
export class EditClasseComponent implements OnInit {
  classeForm: FormGroup;
  errorMessage: string | null = null;
  users: UserResponse[] = [];
  isUsersLoaded = false;
  newStudentId: number | null = null;
  newTeacherId: number | null = null;
  newlyAddedIds: number[] = [];
  classe: ClasseResponse | null = null;
  classeId: number;
  Role = Role;

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
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
      next: (users: UserResponse[]) => {
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
        this.toastr.success('Classe chargée avec succès', 'Chargement réussi');
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.toastr.error('Erreur lors du chargement de la classe', 'Erreur');
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
        this.toastr.success('Étudiant ajouté à la classe', 'Succès');
      } else {
        this.toastr.warning('Cet étudiant est déjà dans la classe', 'Attention');
      }
    } else {
      this.toastr.error('Veuillez sélectionner un étudiant valide', 'Erreur');
    }
  }

  removeStudent(index: number): void {
    const etudiantIds = [...(this.classeForm.get('etudiantIds')?.value || [])];
    etudiantIds.splice(index, 1);
    this.classeForm.get('etudiantIds')?.setValue(etudiantIds);
    this.toastr.info('Étudiant retiré de la classe', 'Information');
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
        this.toastr.success('Enseignant ajouté à la classe', 'Succès');
      } else {
        this.toastr.warning('Cet enseignant est déjà dans la classe', 'Attention');
      }
    } else {
      this.toastr.error('Veuillez sélectionner un enseignant valide', 'Erreur');
    }
  }

  removeTeacher(index: number): void {
    const enseignantIds = [...(this.classeForm.get('enseignantIds')?.value || [])];
    enseignantIds.splice(index, 1);
    this.classeForm.get('enseignantIds')?.setValue(enseignantIds);
    this.toastr.info('Enseignant retiré de la classe', 'Information');
  }

  isNewlyAdded(id: number): boolean {
    return this.newlyAddedIds.includes(id);
  }

  onSubmit(): void {
    if (this.classeForm.valid) {
      const updatedClasse: ClasseCreate = this.classeForm.value;
      this.classeService.updateClasse(this.classeId, updatedClasse).subscribe({
        next: () => {
          this.toastr.success('Classe mise à jour avec succès', 'Succès');
          this.router.navigate(['/classes']);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.toastr.error('Erreur lors de la mise à jour de la classe', 'Erreur');
        }
      });
    } else {
      this.toastr.error('Veuillez corriger les erreurs du formulaire', 'Formulaire invalide');
    }
  }

  goBack(): void {
    this.router.navigate(['/classes']);
  }
}