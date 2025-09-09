import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SujetService } from '../services/sujet.service';
import { SujetCreate, SujetResponse } from '../models/sujet.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-edit-sujet',
  templateUrl: './edit-sujet.component.html',
  styleUrls: ['./edit-sujet.component.css']
})
export class EditSujetComponent implements OnInit {
  sujetForm: FormGroup;
  errorMessage: string | null = null;
  sujet: SujetResponse | null = null;
  sujetId: number;
  isLoaded = false;

  constructor(
    private fb: FormBuilder,
    private sujetService: SujetService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService // Injecter AuthService
  ) {
    this.sujetId = +this.route.snapshot.paramMap.get('id')!;
    this.sujetForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      proposeParId: [null, Validators.required] // Ajouter proposeParId avec validation
    });
  }

  ngOnInit(): void {
    this.loadSujet();
  }

  loadSujet(): void {
    this.sujetService.getSujetById(this.sujetId).subscribe({
      next: (sujet) => {
        this.sujet = sujet;
        const currentUserId = this.authService.getCurrentUser()?.id;
        this.sujetForm.patchValue({
          titre: sujet.titre,
          description: sujet.description,
          proposeParId: sujet.proposeParId || currentUserId // Utiliser l'ID existant ou celui de l'utilisateur connecté si null
        });
        this.isLoaded = true;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.showNotification('error', error.message);
        this.isLoaded = true;
      }
    });
  }

  onSubmit(): void {
    if (this.sujetForm.valid) {
      const updatedSujet: SujetCreate = this.sujetForm.value;
      this.sujetService.updateSujet(this.sujetId, updatedSujet).subscribe({
        next: () => {
          this.showNotification('success', 'Sujet updated successfully');
          this.router.navigate(['/sujets']);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.showNotification('error', error.message);
        }
      });
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