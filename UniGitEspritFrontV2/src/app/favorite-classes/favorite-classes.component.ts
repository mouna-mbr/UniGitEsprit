import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClasseService } from '../services/classe.service';
import { ClasseResponse } from '../models/classe.model';
import { GroupService } from '../services/group.service';
import { GroupResponse } from '../models/group.model';

@Component({
  selector: 'app-favorite-classes',
  templateUrl: './favorite-classes.component.html',
  styleUrls: ['./favorite-classes.component.css']
})
export class FavoriteClassesComponent implements OnInit {
  groups: GroupResponse[] = [];
  filteredGroups: GroupResponse[] = [];
  paginatedGroups: GroupResponse[] = [];
  searchTerm = '';
  currentFilter: 'all' | 'favorites' | 'recent' = 'favorites';
  isFilterMenuOpen = false;
  openMenus: Set<number> = new Set();
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;

  constructor(private groupService: GroupService, private router: Router) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.groupService.getAllGroups().subscribe({
      next: (allgroups) => {
        this.groups = allgroups;
        this.applyFilter();
      },
      error: (error) => this.showNotification('error', error.message)
    });
  }

  applyFilter(): void {
    let filtered = this.groups.filter(group => group.favori); 
    if (this.currentFilter === 'recent') {
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
  }

  getCurrentFilterName(): string {
    return this.currentFilter === 'all' ? 'All Groups' :
           this.currentFilter === 'favorites' ? 'Favorites' : 'Recent';
  }

  getFavoriteCount(): number {
    return this.groups.filter(group => group.favori).length;
  }

  toggleFavorite(id: number, event: Event): void {
    event.stopPropagation();
    this.groupService.toggleFavorite(id).subscribe({
      next: (updatedClasse) => {
        const index = this.groups.findIndex(c => c.id === id);
        if (index !== -1) {
          this.groups[index] = updatedClasse;
          this.applyFilter();
          this.showNotification('success', `Group ${updatedClasse.favori ? 'added to' : 'removed from'} favorites`);
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

  updateClass(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate([`/classes/edit/${id}`]);
    this.openMenus.clear();
  }

  deleteClass(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this Group?')) {
      this.groupService.deleteGroup(id).subscribe({
        next: () => {
          this.groups = this.groups.filter(c => c.id !== id);
          this.applyFilter();
          this.showNotification('success', 'Group deleted successfully');
        },
        error: (error) => this.showNotification('error', error.message)
      });
    }
    this.openMenus.clear();
  }

  viewClass(id: number): void {
    this.router.navigate([`/groupdetails/${id}`]);
  }

  viewAllClasses(): void {
    this.router.navigate(['/groupes']);
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