import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClasseService } from '../services/classe.service';
import { ClasseResponse } from '../models/classe.model';
import { Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {
  isProf: boolean | undefined = false;
  classes: ClasseResponse[] = [];
  filteredClasses: ClasseResponse[] = [];
  paginatedClasses: ClasseResponse[] = [];
  searchTerm = '';
  currentFilter: 'all' | 'favorites' | 'recent' = 'all';
  isFilterMenuOpen = false;
  openMenus: Set<number> = new Set();
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  private searchSubject = new Subject<string>();
  results: ClasseResponse[] = [];
  searching = false;
  errorMessage = '';

  constructor(
    private classeService: ClasseService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    this.isProf = this.authService.getCurrentUser()?.roles.includes(Role.PROFESSOR);
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.results = [];
      this.toastr.warning('Veuillez entrer un terme de recherche', 'Recherche vide');
      return;
    }
    this.searching = true;
    this.classeService.searchClasses(this.searchTerm).subscribe({
      next: (res) => {
        this.classes = res;
        this.paginatedClasses = res;
        this.results = res;
        this.searching = false;
        if (res.length === 0) {
          this.toastr.info(`Aucun résultat trouvé pour "${this.searchTerm}"`, 'Recherche');
        } else {
          this.toastr.success(`${res.length} classe(s) trouvée(s)`, 'Recherche réussie');
        }
      },
      error: (err) => {
        console.error('Erreur de recherche:', err);
        this.errorMessage = 'Une erreur est survenue lors de la recherche.';
        this.searching = false;
        this.toastr.error('Erreur lors de la recherche', 'Erreur');
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.results = [];
    this.loadClasses();
    this.toastr.info('Recherche effacée', 'Information');
  }

  loadClasses(): void {
    this.classeService.getAllClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.applyFilter();
        this.toastr.success(`${classes.length} classe(s) chargée(s)`, 'Chargement réussi');
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement des classes', 'Erreur');
      }
    });
  }

  applyFilter(): void {
    let filtered = this.classes;
    if (this.currentFilter === 'favorites') {
      filtered = filtered.filter(classe => classe.favori);
    } else if (this.currentFilter === 'recent') {
      filtered = filtered.sort((a, b) => b.id - a.id).slice(0);
    }
    if (this.searchTerm) {
      filtered = filtered.filter(classe =>
        classe.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        classe.anneeUniversitaire.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.filteredClasses = filtered;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredClasses.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedClasses = this.filteredClasses.slice(start, start + this.pageSize);
  }

  onFilter(): void {
    this.isFilterMenuOpen = !this.isFilterMenuOpen;
  }

  setFilter(filter: 'all' | 'favorites' | 'recent'): void {
    this.currentFilter = filter;
    this.isFilterMenuOpen = false;
    this.currentPage = 1;
    this.applyFilter();
    this.toastr.info(`Filtre appliqué: ${this.getCurrentFilterName()}`, 'Filtre');
  }

  getCurrentFilterName(): string {
    return this.currentFilter === 'all' ? 'Toutes les Classes' :
           this.currentFilter === 'favorites' ? 'Favoris' : 'Récentes';
  }

  getFavoriteCount(): number {
    return this.classes.filter(classe => classe.favori).length;
  }

  toggleFavorite(id: number, event: Event): void {
    event.stopPropagation();
    this.classeService.toggleFavorite(id).subscribe({
      next: (updatedClasse) => {
        const index = this.classes.findIndex(c => c.id === id);
        if (index !== -1) {
          this.classes[index] = updatedClasse;
          this.applyFilter();
          if (updatedClasse.favori) {
            this.toastr.success('Classe ajoutée aux favoris', 'Favori');
          } else {
            this.toastr.info('Classe retirée des favoris', 'Favori');
          }
        }
      },
      error: (error) => this.toastr.error('Erreur lors de la modification des favoris', 'Erreur')
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

  addClass(): void {
    this.router.navigate(['/add-classe']);
  }

  updateClass(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate([`/edit-classe/${id}`]);
    this.openMenus.clear();
  }

  deleteClass(id: number, event: Event): void {
    event.stopPropagation();
    const classe = this.classes.find(c => c.id === id);
    const className = classe ? classe.nom : 'cette classe';
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${className}" ?`)) {
      this.classeService.deleteClasse(id).subscribe({
        next: () => {
          this.classes = this.classes.filter(c => c.id !== id);
          this.applyFilter();
          this.toastr.success(`"${className}" a été supprimée avec succès`, 'Suppression réussie');
        },
        error: (error) => this.toastr.error('Erreur lors de la suppression de la classe', 'Erreur')
      });
    } else {
      this.toastr.info('Suppression annulée', 'Information');
    }
    this.openMenus.clear();
  }

  viewClass(id: number): void {
    this.router.navigate([`/classesDetails/${id}`]);
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
}