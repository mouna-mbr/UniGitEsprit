// admin-adduser.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ClasseService } from '../services/classe.service';
import { User, UserResponse, Role } from '../models/user.model';
import { ClasseResponse, ClasseCreate } from '../models/classe.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-adduser',
  templateUrl: './admin-adduser.component.html',
  styleUrls: ['./admin-adduser.component.css'],
})
export class AdminAdduserComponent implements OnInit {
  buttonText = 'Add User';
  showForm = false;
  isCsvMode = false;
  isSubmitting = false;
  Role = Role;
  showPassword = false;
  userForm!: FormGroup;
  classOptions: ClasseResponse[] = [];
  users: UserResponse[] = [];
  selectedUser: UserResponse | null = null;
  userRoles: Role[] = [];

  availableRoles = Object.values(Role);

  selectedFile: File | null = null;
  csvData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private classeService: ClasseService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClasses();
    this.loadUsers();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roles: [[], Validators.required],
      classe: [''],
      identifiant: ['', [Validators.required, Validators.pattern(/^\d{3}[A-Z]{3}\d{4}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gitUsername: [''],
      gitAccessToken: [''],
    });

    // Initialize with default role
    this.userRoles = [Role.STUDENT];
    this.userForm.get('roles')?.setValue(this.userRoles);

    this.userForm.get('roles')?.valueChanges.subscribe(() => {
      this.updateClasseValidation();
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.buttonText = this.showForm ? 'Consulter la liste' : 'Add User';
    if (!this.showForm) {
      this.resetForm();
      this.selectedUser = null; // Reset selected user when closing form
    } else {
      this.isCsvMode = false;
    }
  }

  addRole(event: any): void {
    const roleValue = event.target.value;
    if (roleValue && !this.userRoles.includes(roleValue as Role)) {
      this.userRoles = [...this.userRoles, roleValue as Role];
      this.userForm.get('roles')?.setValue(this.userRoles);
    }
    event.target.value = '';
  }

  removeRole(role: Role): void {
    this.userRoles = this.userRoles.filter(r => r !== role);
    this.userForm.get('roles')?.setValue(this.userRoles);
    
    // Ensure we always have at least one role
    if (this.userRoles.length === 0) {
      this.userRoles = [Role.STUDENT];
      this.userForm.get('roles')?.setValue(this.userRoles);
    }
  }

  updateClasseValidation(): void {
    const roles = this.userForm.get('roles')?.value || [];
    const classeCtrl = this.userForm.get('classe');
    if (roles.includes(Role.STUDENT)) {
      classeCtrl?.setValidators(Validators.required);
    } else {
      classeCtrl?.clearValidators();
      classeCtrl?.setValue('');
    }
    classeCtrl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.toastr.error('Veuillez corriger les erreurs.', 'Formulaire invalide');
      return;
    }
  
    this.isSubmitting = true;

    const formValue = this.userForm.value;
    
    // Ensure roles are properly set and never empty
    const roles = this.userRoles.length > 0 ? this.userRoles : [Role.STUDENT];
    
    const payload: User = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      roles: roles,
      identifiant: formValue.identifiant,
      password: formValue.password,
      classe: formValue.classe || null,
      gitUsername: formValue.gitUsername || null,
      gitAccessToken: formValue.gitAccessToken || null,
    };

    console.log('Final payload sent to backend:', payload);
    
    this.userService.addUser(payload).subscribe({
      next: (newUser) => {
        // Si c'est un étudiant ET une classe est spécifiée, mettre à jour la classe
        if (roles.includes(Role.STUDENT) && formValue.classe) {
          this.updateClassWithNewStudent(newUser.id, formValue.classe);
        } else {
          this.toastr.success('Utilisateur ajouté avec succès !');
          this.resetFormAndClose();
          this.loadUsers();
          this.isSubmitting = false;
        }
      },
      error: (err) => {
        console.error('Erreur backend complète:', err);
        this.toastr.error(err.message || 'Erreur lors de la création');
        this.isSubmitting = false;
      },
    });
  }

  // Nouvelle méthode pour mettre à jour la classe avec le nouvel étudiant
  private updateClassWithNewStudent(studentId: number, className: string): void {
    // Trouver la classe par son nom
    const classe = this.classOptions.find(c => c.nom === className);
    if (!classe) {
      this.toastr.error('Classe non trouvée');
      this.isSubmitting = false;
      return;
    }

    // Récupérer les détails complets de la classe
    this.classeService.getClasseById(classe.id).subscribe({
      next: (classeDetails) => {
        const updatedEtudiantIds = [...(classeDetails.etudiantIds || []), studentId];
        
        // Créer le payload complet avec toutes les propriétés requises
        const updatePayload: ClasseCreate = {
          nom: classeDetails.nom,
          anneeUniversitaire: classeDetails.anneeUniversitaire,
          level: this.convertLevelForCreate(classeDetails.level), // Conversion du niveau
          optionFormation: classeDetails.optionFormation,
          sujetIds: classeDetails.sujetIds || [],
          etudiantIds: updatedEtudiantIds,
          enseignantIds: classeDetails.enseignantIds || []
        };

        this.classeService.updateClasse(classe.id, updatePayload).subscribe({
          next: () => {
            this.toastr.success('Utilisateur ajouté avec succès et classe mise à jour !');
            this.resetFormAndClose();
            this.loadUsers();
            this.isSubmitting = false;
          },
          error: (err) => {
            console.error('Erreur mise à jour classe:', err);
            this.toastr.error('Utilisateur créé mais erreur mise à jour classe');
            this.resetFormAndClose();
            this.loadUsers();
            this.isSubmitting = false;
          }
        });
      },
      error: (err) => {
        console.error('Erreur récupération classe:', err);
        this.toastr.error('Utilisateur créé mais erreur récupération classe');
        this.resetFormAndClose();
        this.loadUsers();
        this.isSubmitting = false;
      }
    });
  }

  // Méthode utilitaire pour convertir le niveau entre ClasseResponse et ClasseCreate
  private convertLevelForCreate(level: 'L1' | 'L2' | 'L3A' | 'L3B' | 'L4' | 'L5' | 'M1' | 'M2'): 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'M1' | 'M2' {
    const levelMap: { [key: string]: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'M1' | 'M2' } = {
      'L1': 'L1',
      'L2': 'L2',
      'L3A': 'L3',
      'L3B': 'L3',
      'L4': 'L4',
      'L5': 'L5',
      'M1': 'M1',
      'M2': 'M2'
    };
    return levelMap[level] || 'L1';
  }

  openEdit(user: UserResponse): void {
    this.selectedUser = { ...user };
    this.userRoles = [...user.roles];
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: this.userRoles,
      classe: user.classe,
      identifiant: user.identifiant,
      gitUsername: user.gitUsername,
      gitAccessToken: user.gitAccessToken,
    });
    
    // Désactiver la validation du mot de passe en mode édition
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    
    this.showForm = true;
    this.isCsvMode = false;
    this.updateClasseValidation();
  }

  saveEdit(): void {
    if (!this.selectedUser || this.userForm.invalid) return;

    this.isSubmitting = true;

    const payload: any = {
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      email: this.userForm.get('email')?.value,
      roles: this.userForm.get('roles')?.value,
      classe: this.userForm.get('classe')?.value || null,
      gitUsername: this.userForm.get('gitUsername')?.value || null,
      gitAccessToken: this.userForm.get('gitAccessToken')?.value || null,
    };

    // Inclure le mot de passe seulement s'il est modifié
    const password = this.userForm.get('password')?.value;
    if (password && password.length >= 6) {
      payload.password = password;
    }

    console.log('Edit payload:', payload);

    this.userService.updateUser(this.selectedUser.identifiant, payload).subscribe({
      next: () => {
        this.toastr.success('Utilisateur mis à jour !');
        this.resetFormAndClose(); // Fermer le formulaire après succès
        this.loadUsers();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour:', err);
        this.toastr.error(err.message || 'Échec de la mise à jour');
        this.isSubmitting = false;
      },
    });
  }

  delete(user: UserResponse): void {
    if (!confirm(`Supprimer ${user.firstName} ${user.lastName} ?`)) return;

    this.userService.deleteUser(user.identifiant).subscribe({
      next: () => {
        this.toastr.success('Utilisateur supprimé avec succès');
        this.loadUsers();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        this.toastr.error(err.message || 'Échec de la suppression');
      },
    });
  }

  toggleCsv(): void {
    this.isCsvMode = !this.isCsvMode;
    this.selectedFile = null;
    this.csvData = [];
  }

  onFileSelected(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.previewCsv();
    }
  }

  previewCsv(): void {
    if (!this.selectedFile) return;
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return;

      const headers = lines[0].split(',').map(h => h.trim());
      this.csvData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((h, i) => {
          if (h === 'roles') {
            obj[h] = values[i] ? values[i].split(';')
              .map(r => Role[r as keyof typeof Role])
              .filter(Boolean) : [];
          } else {
            obj[h] = values[i] || '';
          }
        });
        return obj;
      });
    };
    reader.readAsText(this.selectedFile);
  }

  uploadCsv(): void {
    if (!this.selectedFile) return;
    this.isSubmitting = true;
    this.userService.addUsersFromCsv(this.selectedFile).subscribe({
      next: (report) => {
        this.isSubmitting = false;
        this.toastr.success(`${report.successCount} utilisateurs ajoutés, ${report.errors.length} erreurs`);
        this.loadUsers();
        this.toggleCsv();
        this.showForm = false; // Retour à la liste après import
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Erreur lors de l\'import CSV:', err);
        this.toastr.error(err.message || 'Import échoué');
      },
    });
  }

  private resetForm(): void {
    this.userForm.reset();
    this.userRoles = [Role.STUDENT];
    this.userForm.get('roles')?.setValue(this.userRoles);
    
    // Réactiver la validation du mot de passe
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    
    this.isCsvMode = false;
    this.updateClasseValidation();
  }

  private resetFormAndClose(): void {
    this.resetForm();
    this.selectedUser = null;
    this.showForm = false; // Fermer le formulaire
    this.buttonText = 'Add User'; // Remettre le texte du bouton
  }

  loadClasses() {
    this.classeService.getAllClasses().subscribe({
      next: (c) => this.classOptions = c,
      error: (err) => console.error('Erreur chargement classes:', err)
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (u) => this.users = u,
      error: (err) => console.error('Erreur chargement utilisateurs:', err)
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  getRoleCount(role: string): number {
    return this.users.filter(user => user.roles.includes(role as Role)).length;
  }
  // Méthode pour vérifier si le formulaire est valide (utilisée dans le template)
  isFormValid(): boolean {
    if (this.selectedUser) {
      // En mode édition, le mot de passe est optionnel
      const baseValid = !!this.userForm.get('firstName')?.valid &&
                       !!this.userForm.get('lastName')?.valid &&
                       !!this.userForm.get('email')?.valid &&
                       !!this.userForm.get('roles')?.valid &&
                       !!this.userForm.get('identifiant')?.valid;
      
      // Vérifier la classe seulement si STUDENT
      if (this.userRoles.includes(Role.STUDENT)) {
        return baseValid && !!this.userForm.get('classe')?.valid;
      }
      return baseValid;
    } else {
      // En mode création, tout est requis
      return this.userForm.valid;
    }
  }
}