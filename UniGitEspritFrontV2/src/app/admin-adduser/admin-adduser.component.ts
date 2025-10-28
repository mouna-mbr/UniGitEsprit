// admin-adduser.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ClasseService } from '../services/classe.service';
import { User, UserResponse, Role } from '../models/user.model';
import { ClasseResponse } from '../models/classe.model';
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
  Role = Role; // Expose l'enum au template
  showPassword = false;
  userForm!: FormGroup;
  classOptions: ClasseResponse[] = [];
  users: UserResponse[] = [];
  selectedUser: UserResponse | null = null;
  userRoles: Role[] = [];

  availableRoles = Object.values(Role); // utiliser l'enum pour options

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
    if (!this.showForm) this.resetForm();
    else this.isCsvMode = false;
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
    console.log('Roles being sent:', payload.roles);
    
    this.userService.addUser(payload).subscribe({
      next: () => {
        this.toastr.success('Utilisateur ajouté avec succès !');
        this.resetForm();
        this.loadUsers();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Erreur backend complète:', err);
        this.toastr.error(err.message || 'Erreur lors de la création');
        this.isSubmitting = false;
      },
    });
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
    this.showForm = true;
    this.isCsvMode = false;
    this.updateClasseValidation();
  }

  saveEdit(): void {
    if (!this.selectedUser || this.userForm.invalid) return;

    this.isSubmitting = true;

    const payload: Partial<User> = {
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      email: this.userForm.get('email')?.value,
      roles: this.userForm.get('roles')?.value,
      classe: this.userForm.get('classe')?.value || null,
      gitUsername: this.userForm.get('gitUsername')?.value || null,
      gitAccessToken: this.userForm.get('gitAccessToken')?.value || null,
    };

    this.userService.updateUser(this.selectedUser.identifiant, payload).subscribe({
      next: () => {
        this.toastr.success('Utilisateur mis à jour !');
        this.toggleForm();
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
    this.userRoles = [Role.STUDENT]; // Reset with default role
    this.userForm.get('roles')?.setValue(this.userRoles);
    this.selectedUser = null;
    this.isCsvMode = false;
    this.updateClasseValidation();
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

  // Helper method to toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}