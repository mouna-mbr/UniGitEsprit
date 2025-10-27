import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from '../services/group.service';
import { GroupResponse } from '../models/group.model';
import { UserService } from '../services/user.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

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
  isAdmin :boolean | undefined = false;
  isProfessor :boolean | undefined = false;
  searching = false;
  errorMessage = '';
  constructor(
    private groupService: GroupService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadGroups();
    this.searchSubject.pipe(
      debounceTime(300),          // wait 300ms after user stops typing
      distinctUntilChanged(),     // avoid duplicate queries
      switchMap(query => this.groupService.searchGroups(query))
    ).subscribe({
      next: (data) => this.groups = data,
      error: (err) => console.error('Search failed', err)
    });
    this.isAdmin = this.authService.getCurrentUser()?.role.includes('ADMIN');
    this.isProfessor = this.authService.getCurrentUser()?.role.includes('PROFESSEUR');
  }
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.results = [];
      return;
    }
    this.searching = true;
    this.groupService.searchGroups(this.searchTerm).subscribe({
      next: (res) => {
        this.groups = res;
        this.paginatedGroups = res;
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
    this.loadGroups();
  }
  loadGroups(): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser !== null && currentUser.role.includes('STUDENT')) {
      this.groupService.getGroupsByUser(currentUser.identifiant).subscribe({
        next: (groups) => {
          this.groups = groups;
          this.applyFilter();
          console.log('Groups fetched:', groups);
        },
        error: (err) => {
          console.error('Error fetching groups:', err);
          this.errorMessage = 'Error loading groups';
        },
      });
    }else{

    this.groupService.getAllGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error loading groups', error);
      }
    });}
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
  }

  getCurrentFilterName(): string {
    return this.currentFilter === 'all' ? 'All Groups' :
           this.currentFilter === 'favorites' ? 'Favorites' : 'Recent';
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
        }
      },
      error: (error) => {
        console.error('Error toggling favorite', error);
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
    if (confirm('Are you sure you want to delete this group?')) {
      this.groupService.deleteGroup(id).subscribe({
        next: () => {
          this.groups = this.groups.filter(g => g.id !== id);
          this.applyFilter();
        },
        error: (error) => {
          console.error('Error deleting group', error);
        }
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
    // Implement logic to get user name
    return `User ${userId}`;
  }
}