import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GroupsService } from '../services/groups.service';
import { GroupDTO } from '../model/GroupDTO.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-groupes',
  templateUrl: './groupes.component.html',
  styleUrls: ['./groupes.component.css']
})
export class GroupesComponent implements OnInit, OnDestroy {
  groups: GroupDTO[] = [];
  favoriteGroups: number[] = [];
  activeMenu: number | null = null;

  constructor(private router: Router, private groupService: GroupsService) {}

  ngOnInit(): void {
    this.loadFavorites();
    this.fetchGroups();
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  fetchGroups(): void {
    this.groupService.getAllGroups().subscribe({
      next: (data) => {
        this.groups = data;
        console.log(this.groups);
      },
      error: (err: HttpErrorResponse) => {
        this.showNotification('Erreur de chargement des groupes', 'error');
        console.error(err);
      }
    });
  }

  loadFavorites(): void {
    const storedFavorites = localStorage.getItem('favoriteGroups');
    if (storedFavorites) {
      this.favoriteGroups = JSON.parse(storedFavorites);
    }
  }

  saveFavorites(): void {
    localStorage.setItem('favoriteGroups', JSON.stringify(this.favoriteGroups));
  }

  toggleMenu(groupId: number | undefined, event: Event): void {
    if (!groupId) return;
    event.stopPropagation();
    this.activeMenu = this.activeMenu === groupId ? null : groupId;
  }

  isMenuOpen(groupId: number | undefined): boolean {
    if (!groupId) return false;
    return this.activeMenu === groupId;
  }

  handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.card-menu-container')) {
      this.activeMenu = null;
    }
  }

  toggleFavorite(groupId: number | undefined, event: Event): void {
    if (!groupId) return;
    event.stopPropagation();
    const index = this.favoriteGroups.indexOf(groupId);
    if (index !== -1) {
      this.favoriteGroups.splice(index, 1);
      this.showNotification('Groupe retiré des favoris', 'success');
    } else {
      this.favoriteGroups.push(groupId);
      this.showNotification('Groupe ajouté aux favoris', 'success');
    }
    this.saveFavorites();
    this.activeMenu = null;
  }

  isFavorite(groupId: number | undefined): boolean {
    if (!groupId) return false;
    return this.favoriteGroups.includes(groupId);
  }

  viewGroup(groupId: number | undefined): void {
    if (!groupId) return;
    this.router.navigate(['/groupdetails', groupId]);
  }

  editGroup(groupId: number | undefined, event: Event): void {
    if (!groupId) return;
    event.stopPropagation();
    this.showNotification(`Modification du groupe ${groupId}`, 'info');
    this.router.navigate(['/update-group', groupId]);
    this.activeMenu = null;
  }

  shareGroup(groupId: number | undefined, event: Event): void {
    if (!groupId) return;
    event.stopPropagation();
    this.showNotification(`Partage du groupe ${groupId}`, 'info');
    this.activeMenu = null;
  }

  deleteGroup(groupId: number | undefined, event: Event): void {
    if (!groupId) return;
    event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer ce groupe ?')) {
      const favIndex = this.favoriteGroups.indexOf(groupId);
      if (favIndex !== -1) {
        this.favoriteGroups.splice(favIndex, 1);
        this.saveFavorites();
      }
      this.groups = this.groups.filter(group => group.id !== groupId);
      this.showNotification(`Groupe ${groupId} supprimé`, 'error');
    }
    this.activeMenu = null;
  }

  addGroup(): void {
    this.router.navigate(['/addgroupe']);
  }

  showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}