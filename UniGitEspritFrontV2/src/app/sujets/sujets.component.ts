import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SujetService } from '../services/sujet.service';
import { SujetResponse } from '../models/sujet.model';
import { UserService } from '../services/user.service';
import { UserResponse, Role } from '../models/user.model';
import { Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr'; // Import Toastr

@Component({
  selector: 'app-sujets',
  templateUrl: './sujets.component.html',
  styleUrls: ['./sujets.component.css']
})
export class SujetsComponent implements OnInit {
  isAdmin: boolean | undefined = false;
  isProfessor: boolean | undefined = false;
  sujets: SujetResponse[] = [];
  filteredSujets: SujetResponse[] = [];
  paginatedSujets: SujetResponse[] = [];
  searchTerm = '';
  currentFilter: 'all' | 'favorites' | 'recent' = 'all';
  isFilterMenuOpen = false;
  openMenus: Set<number> = new Set();
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  users: UserResponse[] = [];
  private searchSubject = new Subject<string>();
  results: SujetResponse[] = [];
  searching = false;
  errorMessage = '';

  constructor(
    private sujetService: SujetService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService // Inject Toastr
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadSujets();
  
    const currentUser = this.authService.getCurrentUser();
    this.isAdmin = currentUser?.roles.includes(Role.ADMIN) || false;
    this.isProfessor = currentUser?.roles.includes(Role.PROFESSOR) || false;
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.results = [];
      this.toastr.warning('Veuillez entrer un terme de recherche', 'Recherche vide', {
        timeOut: 3000,
        positionClass: 'toast-top-right'
      });
      return;
    }
    this.searching = true;
    this.sujetService.searchDemands(this.searchTerm).subscribe({
      next: (res) => {
        this.sujets = res;
        this.paginatedSujets = res;
        this.results = res;
        this.searching = false;
        if (res.length === 0) {
          this.toastr.info(`Aucun résultat trouvé pour "${this.searchTerm}"`, 'Recherche', {
            timeOut: 4000,
            positionClass: 'toast-top-right'
          });
        } else {
          this.toastr.success(`${res.length} sujet(s) trouvé(s)`, 'Recherche réussie', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
        }
      },
      error: (err) => {
        console.error('Erreur de recherche:', err);
        this.errorMessage = 'Une erreur est survenue lors de la recherche.';
        this.searching = false;
        this.toastr.error('Erreur lors de la recherche', 'Erreur', {
          timeOut: 5000,
          positionClass: 'toast-top-right'
        });
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.results = [];
    this.loadSujets();
    this.toastr.info('Recherche effacée', 'Information', {
      timeOut: 2000,
      positionClass: 'toast-top-right'
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => this.toastr.error(error.message, 'Erreur de chargement')
    });
  }

  loadSujets(): void {
    this.sujetService.getAllSujets().subscribe({
      next: (sujets) => {
        this.sujets = sujets;
        this.applyFilter();
        this.toastr.success(`${sujets.length} sujet(s) chargé(s)`, 'Chargement réussi', {
          timeOut: 3000,
          positionClass: 'toast-top-right'
        });
      },
      error: (error) => this.toastr.error(error.message, 'Erreur de chargement')
    });
  }

  applyFilter(): void {
    let filtered = this.sujets;
    if (this.currentFilter === 'favorites') {
      filtered = filtered.filter(sujet => sujet.favori);
    } else if (this.currentFilter === 'recent') {
      filtered = filtered.sort((a, b) => b.id - a.id);
    }
    if (this.searchTerm) {
      filtered = filtered.filter(sujet =>
        sujet.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        sujet.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.filteredSujets = filtered;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredSujets.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedSujets = this.filteredSujets.slice(start, start + this.pageSize);
  }

  onFilter(): void {
    this.isFilterMenuOpen = !this.isFilterMenuOpen;
  }

  setFilter(filter: 'all' | 'favorites' | 'recent'): void {
    this.currentFilter = filter;
    this.isFilterMenuOpen = false;
    this.currentPage = 1;
    this.applyFilter();
    this.toastr.info(`Filtre appliqué: ${this.getCurrentFilterName()}`, 'Filtre', {
      timeOut: 3000,
      positionClass: 'toast-top-right'
    });
  }

  getCurrentFilterName(): string {
    return this.currentFilter === 'all' ? 'Tous les sujets' :
           this.currentFilter === 'favorites' ? 'Favoris' : 'Récents';
  }

  getFavoriteCount(): number {
    return this.sujets.filter(sujet => sujet.favori).length;
  }

  toggleFavorite(id: number, event: Event): void {
    event.stopPropagation();
    this.sujetService.toggleFavorite(id).subscribe({
      next: (updatedSujet) => {
        const index = this.sujets.findIndex(s => s.id === id);
        if (index !== -1) {
          this.sujets[index] = updatedSujet;
          this.applyFilter();
          if (updatedSujet.favori) {
            this.toastr.success('Sujet ajouté aux favoris', 'Favori', {
              timeOut: 3000,
              positionClass: 'toast-top-right'
            });
          } else {
            this.toastr.info('Sujet retiré des favoris', 'Favori', {
              timeOut: 3000,
              positionClass: 'toast-top-right'
            });
          }
        }
      },
      error: (error) => this.toastr.error(error.message, 'Erreur')
    });
  }

  toggleMenu(id: number, event: Event): void {
    event.stopPropagation();
    if (this.openMenus.has(id)) {
      this.openMenus.delete(id);
    } else {
      this.openMenus.clear();
      this.openMenus.add(id);
    }
  }

  isMenuOpen(id: number): boolean {
    return this.openMenus.has(id);
  }

  addSujet(): void {
    this.router.navigate(['/add-sujet']);
  }

  updateSujet(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate([`/edit-sujet/${id}`]);
    this.openMenus.clear();
  }

  deleteSujet(id: number, event: Event): void {
    event.stopPropagation();
    const sujet = this.sujets.find(s => s.id === id);
    const sujetName = sujet ? sujet.titre : 'ce sujet';
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${sujetName}" ?`)) {
      this.sujetService.deleteSujet(id).subscribe({
        next: () => {
          this.sujets = this.sujets.filter(s => s.id !== id);
          this.applyFilter();
          this.toastr.success(`"${sujetName}" a été supprimé avec succès`, 'Suppression réussie', {
            timeOut: 4000,
            positionClass: 'toast-top-right'
          });
        },
        error: (error) => this.toastr.error(error.message, 'Erreur de suppression')
      });
    } else {
      this.toastr.info('Suppression annulée', 'Information', {
        timeOut: 2000,
        positionClass: 'toast-top-right'
      });
    }
    this.openMenus.clear();
  }

  viewSujet(id: number): void {
    this.router.navigate([`/sujetDetails/${id}`]);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  getUserName(id: number): string {
    const user = this.users.find(u => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : 'Inconnu';
  }
}