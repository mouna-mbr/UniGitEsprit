import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SujetService } from '../services/sujet.service';
import { SujetResponse } from '../models/sujet.model';
import { UserService } from '../services/user.service'; // Import UserService
import { UserResponse,Role } from '../models/user.model'; // Import User interface if defined
import { Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-sujets',
  templateUrl: './sujets.component.html',
  styleUrls: ['./sujets.component.css'] // Reusing class CSS for consistency
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
  users: UserResponse[] = []; // Add users array to store user data
  private searchSubject = new Subject<string>();
  results: SujetResponse[] = [];
  searching = false;
  errorMessage = '';
  constructor(
    private sujetService: SujetService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService // Inject UserService
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
      return;
    }
    this.searching = true;
    this.sujetService.searchDemands(this.searchTerm).subscribe({
      next: (res) => {
        this.sujets = res;
        this.paginatedSujets = res;
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
    this.loadSujets();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => this.showNotification('error', error.message)
    });
  }

  loadSujets(): void {
    this.sujetService.getAllSujets().subscribe({
      next: (sujets) => {
        this.sujets = sujets;
        this.applyFilter();
      },
      error: (error) => this.showNotification('error', error.message)
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
  }

  getCurrentFilterName(): string {
    return this.currentFilter === 'all' ? 'All Sujets' :
           this.currentFilter === 'favorites' ? 'Favorites' : 'Recent';
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
          this.showNotification('success', `Sujet ${updatedSujet.favori ? 'added to' : 'removed from'} favorites`);
        }
      },
      error: (error) => this.showNotification('error', error.message)
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
    if (confirm('Are you sure you want to delete this sujet?')) {
      this.sujetService.deleteSujet(id).subscribe({
        next: () => {
          this.sujets = this.sujets.filter(s => s.id !== id);
          this.applyFilter();
          this.showNotification('success', 'Sujet deleted successfully');
        },
        error: (error) => this.showNotification('error', error.message)
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

  getUserName(id: number): string { // Add getUserName method
    const user = this.users.find(u => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
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