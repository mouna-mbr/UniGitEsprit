import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SujetService } from '../services/sujet.service';
import { UserService } from '../services/user.service';
import { SujetResponse } from '../models/sujet.model';
import { UserResponse } from '../models/user.model';

@Component({
  selector: 'app-sujet-details',
  templateUrl: './sujet-details.component.html',
  styleUrls: ['./sujet-details.component.css'] // Reusing class CSS for consistency
})
export class SujetDetailsComponent implements OnInit {
  sujet: SujetResponse | null = null;
  users: UserResponse[] = [];
  openMenus: Set<number> = new Set();
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sujetService: SujetService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadSujet();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => this.showNotification('error', error.message)
    });
  }

  loadSujet(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.sujetService.getSujetById(id).subscribe({
      next: (sujet) => {
        this.sujet = sujet;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.showNotification('error', error.message);
      }
    });
  }

  getUserName(id: number): string {
    const user = this.users.find(u => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  }

  toggleFavorite(id: number, event: Event): void {
    event.stopPropagation();
    if (this.sujet) {
      this.sujetService.toggleFavorite(id).subscribe({
        next: (updatedSujet) => {
          this.sujet = updatedSujet;
          this.showNotification('success', `Sujet ${updatedSujet.favori ? 'added to' : 'removed from'} favorites`);
        },
        error: (error) => this.showNotification('error', error.message)
      });
    }
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

  editSujet(event?: Event): void {
    if (event) event.stopPropagation();
    if (this.sujet) {
      this.router.navigate([`/sujets/edit/${this.sujet.id}`]);
    }
  }

  deleteSujet(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this sujet?')) {
      this.sujetService.deleteSujet(id).subscribe({
        next: () => {
          this.showNotification('success', 'Sujet deleted successfully');
          this.goBack();
        },
        error: (error) => this.showNotification('error', error.message)
      });
    }
    this.openMenus.clear();
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