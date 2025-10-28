import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from '../services/group.service';
import { GroupResponse } from '../models/group.model';
import { UserService } from '../services/user.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  groups: GroupResponse[] = [];
  filteredGroups: GroupResponse[] = [];
  paginatedGroups: GroupResponse[] = [];
  currentFilter: 'all' | 'favorites' | 'recent' = 'all';
  isFilterMenuOpen = false;
  openMenus: Set<number> = new Set();
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  private searchSubject = new Subject<string>();
  searchTerm = '';
  results: GroupResponse[] = [];
  isAdmin: boolean | undefined = false;
  isProfessor: boolean | undefined = false;
  searching = false;
  errorMessage = '';

  constructor(
    private groupService: GroupService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadGroups();
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.groupService.searchGroups(query))
    ).subscribe({
      next: (data) => this.groups = data,
      error: (err) => console.error('Échec de la recherche', err)
    });
    this.isAdmin = this.authService.getCurrentUser()?.roles.includes(Role.ADMIN);
    this.isProfessor = this.authService.getCurrentUser()?.roles.includes(Role.PROFESSOR);
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
    this.groupService.searchGroups(this.searchTerm).subscribe({
      next: (res) => {
        this.groups = res;
        this.paginatedGroups = res;
        this.results = res;
        this.searching = false;
        if (res.length === 0) {
          this.toastr.info(`Aucun résultat trouvé pour "${this.searchTerm}"`, 'Recherche', {
            timeOut: 4000,
            positionClass: 'toast-top-right'
          });
        } else {
          this.toastr.success(`${res.length} groupe(s) trouvé(s)`, 'Recherche réussie', {
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
    this.loadGroups();
    this.toastr.info('Recherche effacée', 'Information', {
      timeOut: 2000,
      positionClass: 'toast-top-right'
    });
  }

  loadGroups(): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser !== null && currentUser.roles.includes(Role.STUDENT)) {
      this.groupService.getGroupsByUser(currentUser.identifiant).subscribe({
        next: (groups) => {
          this.groups = groups;
          this.applyFilter();
          this.toastr.success(`${groups.length} groupe(s) chargé(s)`, 'Chargement réussi', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
        },
        error: (err) => {
          console.error('Erreur lors du chargement des groupes:', err);
          this.errorMessage = 'Erreur lors du chargement des groupes';
          this.toastr.error('Erreur lors du chargement des groupes', 'Erreur');
        },
      });
    } else {
      this.groupService.getAllGroups().subscribe({
        next: (groups) => {
          this.groups = groups;
          this.applyFilter();
          this.toastr.success(`${groups.length} groupe(s) chargé(s)`, 'Chargement réussi', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
        },
        error: (error) => {
          console.error('Erreur lors du chargement des groupes', error);
          this.toastr.error('Erreur lors du chargement des groupes', 'Erreur');
        }
      });
    }
  }

  applyFilter(): void {
    let filtered = this.groups;
    if (this.currentFilter === 'favorites') {
      filtered = filtered.filter(group => group.isFavori);
    } else if (this.currentFilter === 'recent') {
      filtered = filtered.sort((a, b) => b.id - a.id);
    }
    if (this.searchTerm) {
      filtered = filtered.filter(group =>
        group.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.filteredGroups = filtered;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredGroups.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedGroups = this.filteredGroups.slice(start, start + this.pageSize);
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
    return this.currentFilter === 'all' ? 'Tous les Groupes' :
           this.currentFilter === 'favorites' ? 'Favoris' : 'Récents';
  }

  getFavoriteCount(): number {
    return this.groups.filter(group => group.isFavori).length;
  }

  toggleFavorite(id: number, event: Event): void {
    event.stopPropagation();
    this.groupService.toggleFavorite(id).subscribe({
      next: (updatedGroup) => {
        const index = this.groups.findIndex(g => g.id === id);
        if (index !== -1) {
          this.groups[index] = updatedGroup;
          this.applyFilter();
          if (updatedGroup.isFavori) {
            this.toastr.success('Groupe ajouté aux favoris', 'Favori', {
              timeOut: 3000,
              positionClass: 'toast-top-right'
            });
          } else {
            this.toastr.info('Groupe retiré des favoris', 'Favori', {
              timeOut: 3000,
              positionClass: 'toast-top-right'
            });
          }
        }
      },
      error: (error) => {
        console.error('Erreur lors du basculement du favori', error);
        this.toastr.error('Erreur lors de la modification des favoris', 'Erreur');
      }
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

  addGroup(): void {
    this.router.navigate(['/addgroupe']);
  }

  updateGroup(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate([`/update-group/${id}`]);
    this.openMenus.clear();
  }

  deleteGroup(id: number, event: Event): void {
    event.stopPropagation();
    const group = this.groups.find(g => g.id === id);
    const groupName = group ? group.nom : 'ce groupe';
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${groupName}" ?`)) {
      this.groupService.deleteGroup(id).subscribe({
        next: () => {
          this.groups = this.groups.filter(g => g.id !== id);
          this.applyFilter();
          this.toastr.success(`"${groupName}" a été supprimé avec succès`, 'Suppression réussie', {
            timeOut: 4000,
            positionClass: 'toast-top-right'
          });
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du groupe', error);
          this.toastr.error('Erreur lors de la suppression du groupe', 'Erreur');
        }
      });
    } else {
      this.toastr.info('Suppression annulée', 'Information', {
        timeOut: 2000,
        positionClass: 'toast-top-right'
      });
    }
    this.openMenus.clear();
  }

  viewGroup(id: number): void {
    this.router.navigate([`/groupdetails/${id}`]);
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

  getUserName(userId: number): string {
    return `Utilisateur ${userId}`;
  }
}