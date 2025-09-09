import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ClassesService } from '../services/classes.service';
import { Observable } from 'rxjs';
import { Class } from '../model/class.model';
import { SujetDTO } from '../model/sujet.model';
import { SujetsService } from '../services/sujets.service';
import { GroupsService } from '../services/groups.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GroupDTO,  } from '../model/GroupDTO.model';
import { UserWithRoleDTO } from '../model/UserWithRoleDTO.model';
@Component({
  selector: 'app-update-group',
  templateUrl: './update-group.component.html',
  styleUrls: ['./update-group.component.css']
})
export class UpdateGroupComponent implements OnInit {
  groupData: GroupDTO = {
    id: 0,
    nom: '',
    gitRepoName: '',
    classeId: 0,
    sujetId: 0,
    members: [],
    isFavourite: false,
    enseignantId: 0
  };
  newMember: UserWithRoleDTO = { id: 0, nom: '', email: '', gitRole: 'DEVELOPER' };
  classList$!: Observable<Class[]>;
  sujets$!: Observable<SujetDTO[]>;
  errorMessage: string = '';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classService: ClassesService,
    private sujetService: SujetsService,
    private groupService: GroupsService
  ) {}

  ngOnInit(): void {
    const groupId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(groupId)) {
      this.errorMessage = 'ID de groupe invalide.';
      this.isLoading = false;
      this.router.navigate(['/groupes']);
      return;
    }
    this.groupData.id = groupId;

    this.classList$ = this.classService.getAllClasses();
    this.sujets$ = this.sujetService.getAllSujets();

    this.groupService.getGroupById(groupId).subscribe({
      next: (group) => {
        this.groupData = { ...group, members: group.members || [] };
        this.isLoading = false;
        console.log('Groupe chargé:', this.groupData);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur lors du chargement du groupe:', err);
        this.errorMessage = err.error?.message || 'Impossible de charger le groupe.';
        this.isLoading = false;
        this.router.navigate(['/groupes']);
      }
    });
  }

  addMember() {
    if (!this.isValidEmail(this.newMember.email)) {
      this.errorMessage = 'Veuillez entrer une adresse email valide.';
      return;
    }
    if (!this.newMember.gitRole) {
      this.errorMessage = 'Veuillez sélectionner un rôle.';
      return;
    }
    if (this.groupData.members.some(m => m.email === this.newMember.email)) {
      this.errorMessage = 'Cet email est déjà ajouté.';
      return;
    }
    this.groupData.members.push({ ...this.newMember, nom: this.newMember.email.split('@')[0] });
    this.newMember = { id: 0, nom: '', email: '', gitRole: 'DEVELOPER' };
    this.errorMessage = '';
  }

  removeMember(index: number) {
    this.groupData.members.splice(index, 1);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  generateRepoName() {
    if (this.groupData.nom) {
      const suggestions = ['Frontend', 'Backend', 'Mobile', 'Web', 'App', 'Project'];
      const randomSuffix = suggestions[Math.floor(Math.random() * suggestions.length)];
      this.groupData.gitRepoName = `${this.groupData.nom}${randomSuffix}`;
    } else {
      this.errorMessage = 'Veuillez d’abord entrer un nom de groupe.';
    }
  }

  goBack() {
    this.router.navigate(['/groupes']);
  }

  onSubmit(form: NgForm) {
    if (form.invalid || !this.groupData.members.length) {
        this.errorMessage = 'Veuillez remplir tous les champs obligatoires et ajouter au moins un membre.';
        return;
    }

    // Vérification plus stricte
    const groupId = this.groupData.id;
    if (typeof groupId !== 'number' || groupId <= 0 || isNaN(groupId)) {
        this.errorMessage = 'ID de groupe invalide.';
        return;
    }

    this.groupService.getAllGroups().subscribe({
        next: (groups) => {
            if (groups.some(group => group.nom === this.groupData.nom && group.id !== groupId)) {
                this.errorMessage = 'Le nom du groupe existe déjà. Veuillez choisir un autre nom.';
                return;
            }
            // Utiliser la variable groupId qui est garantie d'être un number
            this.groupService.updateGroup(groupId, this.groupData).subscribe({
                next: (res) => {
                    console.log('Groupe mis à jour:', res);
                    this.errorMessage = '';
                    alert('Groupe mis à jour avec succès !');
                    this.router.navigate(['/groupes']);
                },
                error: (err: HttpErrorResponse) => {
                    console.error('Erreur lors de la mise à jour du groupe:', err);
                    this.errorMessage = err.error?.message || 'Échec de la mise à jour du groupe. Veuillez réessayer.';
                }
            });
        },
        error: (err: HttpErrorResponse) => {
            console.error('Erreur lors de la vérification des groupes:', err);
            this.errorMessage = 'Erreur lors de la vérification du nom du groupe.';
        }
    });
}
}