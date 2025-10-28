import { Component } from '@angular/core';
import { DemandeParainage, Entreprise } from '../models/demande.model';
import { DemandeParainageService } from '../services/demande-parainage.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';
@Component({
  selector: 'app-demandes-sujet',
  templateUrl: './demandes-sujet.component.html',
  styleUrls: ['./demandes-sujet.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule],
})
export class DemandesSujetComponent {
  isAdmin :boolean | undefined = false;
  isCpi :boolean | undefined = false;
  demandesParainage: DemandeParainage[] = [];
  selectedEntreprise: Entreprise | null = null;
  isLoading = false;
  private searchSubject = new Subject<string>();
  results: DemandeParainage[] = [];
  searching = false;
  errorMessage = '';
  searchTerm = '';
  constructor(private demandeParainageService: DemandeParainageService, private authService: AuthService ,private router: Router) {}

  ngOnInit(): void {
    this.loadDemandes();
    this.isAdmin = this.authService.getCurrentUser()?.roles.includes(Role.ADMIN);
    this.isCpi = this.authService.getCurrentUser()?.roles.includes(Role.COORDINATEUR_PI);
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.results = [];
      return;
    }
    this.searching = true;
    this.demandeParainageService.searchDemands(this.searchTerm).subscribe({
      next: (res) => {
        this.demandesParainage = res;
        this.results = res;
        this.searching = false;
      },
      error: (err) => {
        console.error('Search error:', err);
        this.errorMessage = 'An error occurred while searching.';
        this.searching = false;
      }
    });
  }
  
  clearSearch(): void {
    this.searchTerm = '';
    this.results = [];
    this.loadDemandes();
  }
  
  loadDemandes(): void {
    this.isLoading = true;
    this.demandeParainageService.getDemandes().subscribe({
      
      next: (data: DemandeParainage[]) => {
        console.log(data);
        this.demandesParainage = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching demandes de parrainage:', err);
        this.isLoading = false;
      }
    });
  }

  handleAccept(id: number): void {
    this.demandeParainageService.updateStatus(id, 'ACCEPTED').subscribe({
      next: () => this.loadDemandes(),
      error: (err) => console.error('Error approving demande:', err)
    });
    console.log(id);
  }

  handleRefuse(id: number): void {
    this.demandeParainageService.updateStatus(id, 'REFUSED').subscribe({
      next: () => this.loadDemandes(),
      error: (err) => console.error('Error refusing demande:', err)
    });
  }

  showEntrepriseDetails(entreprise: Entreprise): void {
    console.log(entreprise);
    this.selectedEntreprise = entreprise;
  }
  showSujetDetails(demande: DemandeParainage) {
    console.log(demande);
    this.router.navigate([`/sujetDetails/${demande.sujet.id}`]);
  }
  closeModal(): void {
    this.selectedEntreprise = null;
  }
}
