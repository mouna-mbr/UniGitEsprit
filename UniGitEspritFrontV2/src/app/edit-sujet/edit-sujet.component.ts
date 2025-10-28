import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SujetService } from '../services/sujet.service';
import { SujetCreate, SujetResponse } from '../models/sujet.model';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr'; // Import Toastr

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
    private authService: AuthService,
    private toastr: ToastrService // Inject Toastr
  ) {
    this.sujetId = +this.route.snapshot.paramMap.get('id')!;
    this.sujetForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      proposeParId: [null, Validators.required]
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
          proposeParId: sujet.proposeParId || currentUserId
        });
        this.isLoaded = true;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.toastr.error(error.message, 'Erreur de chargement', {
          timeOut: 5000,
          positionClass: 'toast-top-right',
          progressBar: true
        });
        this.isLoaded = true;
      }
    });
  }

  onSubmit(): void {
    if (this.sujetForm.valid) {
      const updatedSujet: SujetCreate = this.sujetForm.value;
      this.sujetService.updateSujet(this.sujetId, updatedSujet).subscribe({
        next: () => {
          this.toastr.success('Sujet modifié avec succès', 'Succès', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            closeButton: true
          });
          setTimeout(() => {
            this.router.navigate(['/sujets']);
          }, 1500); // Redirection après 1.5 secondes
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.toastr.error(error.message, 'Erreur de modification', {
            timeOut: 5000,
            positionClass: 'toast-top-right',
            progressBar: true,
            closeButton: true
          });
        }
      });
    } else {
      // Afficher un toast si le formulaire est invalide
      this.toastr.warning('Veuillez corriger les erreurs du formulaire', 'Formulaire invalide', {
        timeOut: 4000,
        positionClass: 'toast-top-right',
        progressBar: true
      });
      
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.markFormGroupTouched();
    }
  }

  goBack(): void {
    this.toastr.info('Modification annulée', 'Information', {
      timeOut: 2000,
      positionClass: 'toast-top-right'
    });
    setTimeout(() => {
      this.router.navigate(['/sujets']);
    }, 500);
  }

  // Méthode utilitaire pour marquer tous les champs comme touchés
  private markFormGroupTouched(): void {
    Object.keys(this.sujetForm.controls).forEach(key => {
      const control = this.sujetForm.get(key);
      control?.markAsTouched();
    });
  }
}