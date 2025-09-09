import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ClassesService } from '../services/classes.service';
import { SujetsService } from '../services/sujets.service';
import { GroupsService } from '../services/groups.service';
import { Class } from '../model/class.model';
import { SujetDTO } from '../model/sujet.model';
import { UserWithRoleDTO } from "../model/UserWithRoleDTO.model";
import { GroupDTO } from '../model/GroupDTO.model';

@Component({
  selector: 'app-addgroupe',
  templateUrl: './addgroupe.component.html',
  styleUrls: ['./addgroupe.component.css']
})
export class AddgroupeComponent implements OnInit {
  groupForm: FormGroup;
  classList$!: Observable<Class[]>;
  sujets$!: Observable<SujetDTO[]>;
  errorMessage: string = '';
  newMemberEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private classService: ClassesService,
    private sujetService: SujetsService,
    private groupService: GroupsService
  ) {
    this.groupForm = this.fb.group({
      nom: ['', Validators.required],
      gitRepoName: ['', Validators.required],
      classeId: [null, Validators.required],
      sujetId: [null, Validators.required],
      members: [[], Validators.required],   // Stocke des objets UserWithRoleDTO
      academicYear: ['2024/2025', Validators.required]
    });
  }

  ngOnInit(): void {
    this.classList$ = this.classService.getAllClasses();
    this.sujets$ = this.sujetService.getAllSujets();
  }

  addMember() {
    if (!this.newMemberEmail || !this.isValidEmail(this.newMemberEmail)) {
      this.errorMessage = 'Veuillez entrer une adresse email valide.';
      return;
    }

    const members: UserWithRoleDTO[] = this.groupForm.get('members')?.value || [];

    if (members.some(m => m.email === this.newMemberEmail)) {
      this.errorMessage = 'Cet email est déjà ajouté.';
      return;
    }

    // ⚡️ On ajoute un objet complet conforme à UserWithRoleDTO
    members.push({
      id: 0,              // backend générera l’ID réel
      nom: '',            // à remplir plus tard si besoin
      email: this.newMemberEmail,
      gitRole: 'DEVELOPER'
    });

    this.groupForm.get('members')?.setValue(members);
    this.newMemberEmail = '';
    this.errorMessage = '';
  }

  removeMember(index: number) {
    const members: UserWithRoleDTO[] = this.groupForm.get('members')?.value || [];
    members.splice(index, 1);
    this.groupForm.get('members')?.setValue(members);
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  generateRepoName() {
    const groupName = this.groupForm.get('nom')?.value;
    if (groupName) {
      const suggestions = ['Frontend', 'Backend', 'Mobile', 'Web', 'App', 'Project'];
      const randomSuffix = suggestions[Math.floor(Math.random() * suggestions.length)];
      this.groupForm.get('gitRepoName')?.setValue(`${groupName}${randomSuffix}`);
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Veuillez d’abord entrer un nom de groupe.';
    }
  }

  goBack() {
    this.router.navigate(['/groupes']);
  }

  onSubmit() {
    if (this.groupForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const formValue = this.groupForm.value;

    const payload: GroupDTO = {
      nom: formValue.nom,
      gitRepoName: formValue.gitRepoName,
      classeId: Number(formValue.classeId),
      sujetId: Number(formValue.sujetId),
      members: formValue.members || [],  // déjà des objets UserWithRoleDTO
      isFavourite: false,               // obligatoire
    };

    console.log('Payload envoyé :', payload);

    this.groupService.createGroup(payload).subscribe({
      next: (response) => {
        console.log('Groupe créé avec succès', response);
        alert('Groupe créé avec succès ! L\'URL du repository est : ' + response.gitRepoUrl);
        this.router.navigate(['/groupes']);
      },
      error: (err) => {
        console.error('Erreur lors de la création du groupe', err);
        this.errorMessage = err.error?.message || 'Une erreur est survenue lors de la création du groupe.';
      }
    });
  }
}
