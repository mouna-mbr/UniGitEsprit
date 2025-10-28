import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClasseService } from '../services/classe.service';
import { UserService } from '../services/user.service';
import { ClasseResponse } from '../models/classe.model';
import { User } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.css']
})
export class ClassDetailsComponent implements OnInit {
  classe: ClasseResponse | null = null;
  users: User[] = [];
  openMenus: Set<number> = new Set();
  errorMessage: string | null = null;
  activeTab: string = 'details';
  activeRoute: string = 'classes';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classeService: ClasseService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.activeRoute = this.router.url.includes('favorite-classes') ? 'favorite-classes' : 'classes';
    this.loadUsers();
    this.loadClasse();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => this.showNotification('error', error.message)
    });
  }

  loadClasse(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.classeService.getClasseById(id).subscribe({
      next: (classe) => {
        this.classe = classe;
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
    if (this.classe) {
      this.classeService.toggleFavorite(id).subscribe({
        next: (updatedClasse) => {
          this.classe = updatedClasse;
          this.showNotification('success', `Class ${updatedClasse.favori ? 'added to' : 'removed from'} favorites`);
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

  editClass(event?: Event): void {
    if (event) event.stopPropagation();
    if (this.classe) {
      this.router.navigate([`/edit-classe/${this.classe.id}`]);
    }
  }

  deleteClass(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this class?')) {
      this.classeService.deleteClasse(id).subscribe({
        next: () => {
          this.showNotification('success', 'Class deleted successfully');
          this.goBack();
        },
        error: (error) => this.showNotification('error', error.message)
      });
    }
    this.openMenus.clear();
  }

  goBack(): void {
    this.router.navigate([`/${this.activeRoute}`]);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onSearch(event: Event): void {
    // Implement search logic if needed
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