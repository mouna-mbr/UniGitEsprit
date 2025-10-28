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
    private userService: UserService,
    private toastr: ToastrService
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
        this.toastr.success('Utilisateurs chargés avec succès', 'Chargement réussi');
      },
      error: (error) => this.toastr.error('Erreur lors du chargement des utilisateurs', 'Erreur')
    });
  }

  loadClasse(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.classeService.getClasseById(id).subscribe({
      next: (classe) => {
        this.classe = classe;
        this.toastr.success('Classe chargée avec succès', 'Chargement réussi');
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.toastr.error('Erreur lors du chargement de la classe', 'Erreur');
      }
    });
  }

  getUserName(id: number): string {
    const user = this.users.find(u => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : 'Inconnu';
  }

  toggleFavorite(id: number, event: Event): void {
    event.stopPropagation();
    if (this.classe) {
      this.classeService.toggleFavorite(id).subscribe({
        next: (updatedClasse) => {
          this.classe = updatedClasse;
          if (updatedClasse.favori) {
            this.toastr.success('Classe ajoutée aux favoris', 'Favori');
          } else {
            this.toastr.info('Classe retirée des favoris', 'Favori');
          }
        },
        error: (error) => this.toastr.error('Erreur lors de la modification des favoris', 'Erreur')
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
    const className = this.classe ? this.classe.nom : 'cette classe';
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${className}" ?`)) {
      this.classeService.deleteClasse(id).subscribe({
        next: () => {
          this.toastr.success('Classe supprimée avec succès', 'Suppression réussie');
          this.goBack();
        },
        error: (error) => this.toastr.error('Erreur lors de la suppression de la classe', 'Erreur')
      });
    } else {
      this.toastr.info('Suppression annulée', 'Information');
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
    // Implémentez la logique de recherche si nécessaire
  }
}