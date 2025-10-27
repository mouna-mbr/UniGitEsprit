import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User, UserResponse } from '../models/user.model';
import { ClasseService } from '../services/classe.service';
import { ClasseResponse } from '../models/classe.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-adduser',
  templateUrl: './admin-adduser.component.html',
  styleUrls: ['./admin-adduser.component.css'],
})
export class AdminAdduserComponent implements OnInit {
  buttonText = 'Add User';
  userForm!: FormGroup;
  showaddUserForm = false;
  selectedUser: UserResponse | null = null;
  showPassword = false;
  isSubmitting = false;
  showSpecialtyField = false;
  isComputerScienceFourthYearOrHigher = false;
  selectedFile: File | null = null;
  isCsvMode: boolean = false;
  csvData: any[] = [];
  availableRoles = [
    'ADMIN',
    'STUDENT',
    'PROFESSOR',
    'REFERENT_ESPRIT',
    'REFERENT_ENTREPRISE',
    'COORDINATEUR_PI'
  ];
  userRoles: string[] = [];
  classOptions: ClasseResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private classService: ClasseService,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUsers();
    this.loadClasses();
  }

  loadClasses(): void {
    this.classService.getAllClasses().subscribe({
      next: (classes) => {
        this.classOptions = classes;
        console.log(this.classOptions);
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement des classes.', 'Erreur');
        console.error('error', error.message);
      }
    });
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: [[''], [Validators.required]],
      classe: [''],
      specialite: [''],
      identifiant: ['', [Validators.required, Validators.pattern(/^\d{3}[A-Z]{3}\d{4}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gitUsername: [''],
      gitAccessToken: ['']
    });
  }

  showUserForm() {
    this.showaddUserForm = !this.showaddUserForm;
    this.initializeForm();
    if (this.showaddUserForm) {
      this.buttonText = 'Consulter Liste des Utilisateurs';
    } else {
      this.buttonText = 'Add User';
    }
  }

  toggleMode(): void {
    this.isCsvMode = !this.isCsvMode;
    this.selectedFile = null;
    this.csvData = [];
    if (document.getElementById('csvFile')) {
      (document.getElementById('csvFile') as HTMLInputElement).value = '';
    }
  }

  onRoleChange(): void {
    const role = this.userForm.get('role')?.value;
    const classeControl = this.userForm.get('classe');
    const specialiteControl = this.userForm.get('specialite');
    if (role === 'STUDENT') {
      classeControl?.setValidators([Validators.required]);
      this.onClassChange();
    } else {
      classeControl?.clearValidators();
      specialiteControl?.clearValidators();
      classeControl?.setValue('');
      specialiteControl?.setValue('');
      this.showSpecialtyField = false;
      this.isComputerScienceFourthYearOrHigher = false;
    }
    classeControl?.updateValueAndValidity();
    specialiteControl?.updateValueAndValidity();
  }

  onClassChange(): void {
    const classe = this.userForm.get('classe');
    const specialiteControl = this.userForm.get('specialite');
    // Logique pour gérer les spécialités selon la classe sélectionnée
  }

  formatIdentifiant(event: any): void {
    let value = event.target.value.replace(/[^0-9A-Za-z]/g, '');
    value = value.toUpperCase();
    if (value.length > 3 && value.length <= 6) {
      const digits = value.substring(0, 3).replace(/[^0-9]/g, '');
      const letters = value.substring(3).replace(/[^A-Z]/g, '');
      value = digits + letters;
    } else if (value.length > 6) {
      const digits1 = value.substring(0, 3).replace(/[^0-9]/g, '');
      const letters = value.substring(3, 6).replace(/[^A-Z]/g, '');
      const digits2 = value.substring(6, 10).replace(/[^0-9]/g, '');
      value = digits1 + letters + digits2;
    }
    event.target.value = value;
    this.userForm.get('identifiant')?.setValue(value);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const userData: User = {
        firstName: this.userForm.get('prenom')?.value,
        lastName: this.userForm.get('nom')?.value,
        role: Array.isArray(this.userForm.get('role')?.value)
          ? this.userForm.get('role')?.value
          : [this.userForm.get('role')?.value],
        identifiant: this.userForm.get('identifiant')?.value,
        password: this.userForm.get('password')?.value,
        classe: this.userForm.get('classe')?.value || undefined,
        specialite: this.userForm.get('specialite')?.value || undefined,
        email: this.userForm.get('email')?.value,
        gitUsername: this.userForm.get('gitUsername')?.value || undefined,
        gitAccessToken: this.userForm.get('gitAccessToken')?.value || undefined
      };
      this.userService.addUser(userData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.toastr.success('Utilisateur ajouté avec succès !', 'Succès');
          this.userForm.reset();
          this.showSpecialtyField = false;
          this.isComputerScienceFourthYearOrHigher = false;
          this.loadUsers();
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
          if (error.status === 409) {
            const errorMessage = (error.error as any)?.message || 'Un utilisateur avec cet identifiant ou cet email existe déjà.';
            this.toastr.error(errorMessage, 'Erreur');
          } else if (error.status === 400) {
            this.toastr.error(error.message || 'Les données fournies sont invalides.', 'Erreur');
          } else {
            this.toastr.error(error.message || 'Échec de l\'ajout de l\'utilisateur. Veuillez réessayer.', 'Erreur');
          }
        }
      });
    } else {
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.get(key)?.markAsTouched();
      });
      this.toastr.error('Veuillez remplir correctement tous les champs requis.', 'Formulaire invalide');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.previewCsv();
    } else {
      this.selectedFile = null;
      this.csvData = [];
    }
  }

  previewCsv(): void {
    if (!this.selectedFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map(row => row.split(','));
      const headers = rows[0];
      this.csvData = rows.slice(1).map(row => ({
        firstName: row[headers.indexOf('firstName')] || '',
        lastName: row[headers.indexOf('lastName')] || '',
        email: row[headers.indexOf('email')] || '',
        role: row[headers.indexOf('role')] || '',
        identifiant: row[headers.indexOf('identifiant')] || '',
        password: row[headers.indexOf('password')] || '',
        classe: row[headers.indexOf('classe')] || '',
        specialite: row[headers.indexOf('specialite')] || '',
        gitUsername: row[headers.indexOf('gitUsername')] || '',
        gitAccessToken: row[headers.indexOf('gitAccessToken')] || ''
      }));
    };
    reader.readAsText(this.selectedFile);
  }

  onUploadCsv(): void {
    if (!this.selectedFile) {
      this.toastr.error('Veuillez sélectionner un fichier CSV à charger.', 'Erreur');
      return;
    }
    this.isSubmitting = true;
    this.userService.addUsersFromCsv(this.selectedFile).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastr.success('Utilisateurs ajoutés avec succès via CSV.', 'Succès');
        this.selectedFile = null;
        this.csvData = [];
        (document.getElementById('csvFile') as HTMLInputElement).value = '';
        this.loadUsers();
      },
      error: (error) => {
        this.isSubmitting = false;
        if (error.status === 409) {
          this.toastr.error(error.message || 'Un ou plusieurs utilisateurs existent déjà (identifiant ou email déjà utilisé).', 'Erreur');
        } else if (error.status === 400) {
          this.toastr.error(error.message || 'Le fichier CSV contient des données invalides.', 'Erreur');
        } else {
          this.toastr.error(error.message || 'Échec du chargement des utilisateurs. Vérifiez le fichier CSV et réessayez.', 'Erreur');
        }
      }
    });
  }

  goBack(): void {
    window.history.back();
  }

  users: UserResponse[] = [];
  showModal = false;

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log(data);
      },
      error: (error) => {
        this.toastr.error(error.message || 'Erreur lors du chargement des utilisateurs.', 'Erreur');
        console.error(error);
      }
    });
  }

  openEditModal(user: UserResponse) {
    this.selectedUser = { ...user };
    this.userRoles = [...user.role];
    this.userForm.patchValue({
      nom: this.selectedUser.lastName,
      prenom: this.selectedUser.firstName,
      email: this.selectedUser.email,
      identifiant: this.selectedUser.identifiant,
      role: this.userRoles
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
  }

  addRole(event: any) {
    const role = event.target.value;
    if (role && !this.userRoles.includes(role)) {
      this.userRoles.push(role);
      this.userForm.get('role')?.setValue(this.userRoles);
    }
    event.target.value = '';
  }

  removeRole(role: string) {
    this.userRoles = this.userRoles.filter(r => r !== role);
    this.userForm.get('role')?.setValue(this.userRoles);
  }

  saveUser() {
    if (this.userForm.valid) {
      const userData: User = {
        firstName: this.userForm.get('prenom')?.value,
        lastName: this.userForm.get('nom')?.value,
        email: this.userForm.get('email')?.value,
        identifiant: this.userForm.get('identifiant')?.value,
        role: this.userRoles
      };
      if (this.selectedUser) {
        this.userService.updateUser(userData.identifiant, userData).subscribe({
          next: () => {
            this.toastr.success('Utilisateur modifié avec succès !', 'Succès');
            this.closeModal();
            this.loadUsers();
          },
          error: (error) => {
            if (error.status === 409) {
              this.toastr.error(error.message || 'Cet email est déjà utilisé par un autre utilisateur.', 'Erreur');
            } else if (error.status === 404) {
              this.toastr.error('Utilisateur non trouvé.', 'Erreur');
            } else {
              this.toastr.error(error.message || 'Échec de la modification de l\'utilisateur.', 'Erreur');
            }
          }
        });
      }
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs requis.', 'Formulaire invalide');
    }
  }

  deleteUser(user: UserResponse) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(user.identifiant).subscribe({
        next: () => {
          this.toastr.success('Utilisateur supprimé avec succès.', 'Succès');
          this.loadUsers();
        },
        error: (error) => {
          if (error.status === 404) {
            this.toastr.error('Utilisateur non trouvé.', 'Erreur');
          } else {
            this.toastr.error(error.message || 'Échec de la suppression de l\'utilisateur.', 'Erreur');
          }
        }
      });
    }
  }

  toggleRole(role: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.userRoles.includes(role)) {
        this.userRoles.push(role);
      }
    } else {
      this.userRoles = this.userRoles.filter(r => r !== role);
    }
    this.userForm.get('role')?.setValue(this.userRoles);
  }
}