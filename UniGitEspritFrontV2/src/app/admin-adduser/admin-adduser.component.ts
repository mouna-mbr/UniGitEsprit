import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-admin-adduser',
  templateUrl: './admin-adduser.component.html',
  styleUrls: ['./admin-adduser.component.css'],
})
export class AdminAdduserComponent implements OnInit {
  userForm!: FormGroup;
  showPassword = false;
  isSubmitting = false;
  showSpecialtyField = false;
  isComputerScienceFourthYearOrHigher = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedFile: File | null = null;
  isCsvMode: boolean = false;
  csvData: any[] = [];

  classOptions: string[] = [
    '1st year',
    '2nd year',
    '3A',
    '3B',
    '4th year',
    '5th year'
  ];

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      classe: [''],
      specialite: [''],
      identifiant: ['', [Validators.required, Validators.pattern(/^\d{3}[A-Z]{3}\d{4}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gitUsername: [''],
      gitAccessToken: ['']
    });
  }

  toggleMode(): void {
    this.isCsvMode = !this.isCsvMode;
    this.errorMessage = null;
    this.successMessage = null;
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
    const classe = this.userForm.get('classe')?.value?.toLowerCase();
    const specialiteControl = this.userForm.get('specialite');

    specialiteControl?.setValue('');
    this.showSpecialtyField = false;
    specialiteControl?.clearValidators();

    if (classe) {
      if (classe === '1st year' || classe === '2nd year' || classe === '3a' || classe === '3b') {
        this.showSpecialtyField = false;
        specialiteControl?.clearValidators();
      } else if (classe.match(/[4-5]th year/)) {
        this.showSpecialtyField = true;
        this.isComputerScienceFourthYearOrHigher = true;
        specialiteControl?.setValidators([Validators.required]);
      } else {
        this.showSpecialtyField = true;
        this.isComputerScienceFourthYearOrHigher = false;
        specialiteControl?.setValidators([Validators.required]);
      }
    }

    specialiteControl?.updateValueAndValidity();
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
      this.errorMessage = null;
      this.successMessage = null;

      const userData: User = {
        firstName: this.userForm.get('prenom')?.value,
        lastName: this.userForm.get('nom')?.value,
        role: this.userForm.get('role')?.value,
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
          this.successMessage = 'User added successfully!';
          this.userForm.reset();
          this.showSpecialtyField = false;
          this.isComputerScienceFourthYearOrHigher = false;
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error.message.includes('net::ERR_FAILED') || error.message.includes('CORS')) {
            this.errorMessage = 'Failed to connect to the server. Please check if the backend is running and CORS is configured correctly.';
          } else {
            this.errorMessage = error.message || 'Failed to add user. Please try again.';
          }
        }
      });
    } else {
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.get(key)?.markAsTouched();
      });
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
      this.errorMessage = 'Please select a CSV file to upload.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.userService.addUsersFromCsv(this.selectedFile).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = `Successfully added ${response.length} users.`;
        this.selectedFile = null;
        this.csvData = [];
        (document.getElementById('csvFile') as HTMLInputElement).value = '';
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Failed to upload users. Please check the CSV and try again.';
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}