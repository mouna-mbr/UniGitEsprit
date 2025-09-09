import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClasseService } from '../services/classe.service';
import { ClasseResponse } from '../models/classe.model';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {
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

  constructor(private classeService: ClasseService, private router: Router) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.classeService.getAllClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.applyFilter();
      },
      error: (error) => this.showNotification('error', error.message)
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
  }

  getCurrentFilterName(): string {
    return this.currentFilter === 'all' ? 'All Classes' :
           this.currentFilter === 'favorites' ? 'Favorites' : 'Recent';
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
          this.showNotification('success', `Class ${updatedClasse.favori ? 'added to' : 'removed from'} favorites`);
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

  addClass(): void {
    this.router.navigate(['/add-classe']);
  }

  updateClass(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate([`/classes/edit/${id}`]);
    this.openMenus.clear();
  }

  deleteClass(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this class?')) {
      this.classeService.deleteClasse(id).subscribe({
        next: () => {
          this.classes = this.classes.filter(c => c.id !== id);
          this.applyFilter();
          this.showNotification('success', 'Class deleted successfully');
        },
        error: (error) => this.showNotification('error', error.message)
      });
    }
    this.openMenus.clear();
  }

  viewClass(id: number): void {
    this.router.navigate([`/classes/${id}`]);
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