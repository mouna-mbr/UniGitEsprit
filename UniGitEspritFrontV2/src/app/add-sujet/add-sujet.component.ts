import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SujetService } from '../services/sujet.service';
import { AuthService } from '../services/auth.service';
import { SujetCreate } from '../models/sujet.model';

@Component({
  selector: 'app-add-sujet',
  templateUrl: './add-sujet.component.html',
  styleUrls: ['./add-sujet.component.css']
})
export class AddSujetComponent implements OnInit {
  sujetForm: FormGroup;
  errorMessage: string | null = null;
  userId: number | null = null;
  isLoaded = false;

  constructor(
    private fb: FormBuilder,
    private sujetService: SujetService,
    private authService: AuthService,
    private router: Router
  ) {
    this.sujetForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      proposeParId: [null, Validators.required] // Ajouter proposeParId avec validation
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.userId = currentUser ? currentUser.id : null;
    if (this.userId) {
      this.sujetForm.patchValue({ proposeParId: this.userId }); // Pré-remplir avec l'ID de l'utilisateur connecté
    }
    this.isLoaded = true; // Activer l'affichage une fois que l'ID est défini
  }

  onSubmit(): void {
    if (this.sujetForm.valid && this.userId) {
      const sujet: SujetCreate = this.sujetForm.value;
      this.sujetService.addSujet(sujet, this.userId).subscribe({
        next: () => {
          this.showNotification('success', 'Sujet added successfully');
          this.router.navigate(['/sujets']);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.showNotification('error', error.message);
        }
      });
    } else {
      this.showNotification('error', 'Invalid form or no user logged in');
    }
  }

  goBack(): void {
    this.router.navigate(['/sujets']);
  }

  showNotification(type: 'success' | 'error' | 'info', message: string): void {
    const container = document.getElementById('notification-container');
    if (container) {
      const notification = document.createElement('div');
      notification.className = `notification ${type} show`;
      notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
      `;
      container.appendChild(notification);
      setTimeout(() => {
        notification.className = `notification ${type}`;
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  }
}