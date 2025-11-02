import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { UserService } from './user.service';
import { DemandesService } from './demandes.service';
import { DemandeParainageService } from './demande-parainage.service';
import { SujetService } from './sujet.service';
import { GroupService } from './group.service';
import { TacheService } from './tache.service';
import { GitRepositoryService } from './git-repository.service';
import { ClasseService } from './classe.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private demandeService: DemandesService,
    private parrainageService: DemandeParainageService,
    private sujetService: SujetService,
    private groupService: GroupService,
    private tacheService: TacheService,
    private gitRepositoryService: GitRepositoryService,
    private classeService: ClasseService
  ) {}

  getAdminStats(): Observable<any> {
    return forkJoin({
      totalUsers: this.getTotalUsers(),
      totalDemandeBdp: this.getTotalDemandeBdp(),
      totalDemandeParrainage: this.getTotalDemandeParrainage(),
      bdpBySpecialite: this.getBdpBySujet(),
      bdpByStatus: this.getBdpByStatus(),
      parrainageByStatus: this.getParrainageByStatus(),
      parrainageBySujet: this.getParrainageBySujet(),
      usersByRole: this.getUsersByRole(),
      totalRepositories: this.getTotalRepositories(), 
      groupesParSujet: this.getGroupesParSujet(),
      sujetsParraineParEntreprise: this.getSujetsParraineParEntreprise() 
    });
  }

  getProfStats(profId: string): Observable<any> {
    return forkJoin({
      sujetsByGroups: this.getSujetsByGroups(profId),
      topGroupsByNote: this.getTopGroupsByNote(profId),
      tachesByStatus: this.getTachesByStatus(profId),
      commitsParGroupe: this.getCommitsParGroupe(profId), // Nouveau
      commitsParUtilisateurParGroupe: this.getCommitsParUtilisateurParGroupe(profId), // Nouveau
      totalRepositories: this.getTotalRepositoriesProf(profId) // Nouveau pour prof
    });
  }

  // ================== NOUVELLES MÉTHODES ADMIN ==================
  
  private getTotalRepositories(): Observable<number> {
    return this.groupService.getAllGroups().pipe(
      map(groups => groups.filter(group => group.gitRepoUrl && group.gitRepoUrl.trim() !== '').length)
    );
  }

  private getGroupesParSujet(): Observable<any[]> {
    return this.sujetService.getAllSujets().pipe(
      map(sujets => {
        const groupesParSujet = sujets.reduce((acc: any, sujet) => {
          const titre = sujet.titre || 'Sans titre';
          acc[titre] = (sujet.groups || []).length;
          return acc;
        }, {});
        return Object.entries(groupesParSujet);
      })
    );
  }

  private getSujetsParraineParEntreprise(): Observable<any[]> {
    return this.parrainageService.getDemandes().pipe(
      map(demandes => {
        const sujetsParEntreprise = demandes.reduce((acc: any, demande: any) => {
          if (demande.statut === 'ACCEPTED' && demande.entreprise) {
            const entreprise = demande.entreprise.name || 'Entreprise inconnue';
            const sujet = demande.sujet?.titre || 'Sujet inconnu';
            
            if (!acc[entreprise]) {
              acc[entreprise] = new Set();
            }
            acc[entreprise].add(sujet);
          }
          return acc;
        }, {});

        // Convertir en tableau et compter
        return Object.entries(sujetsParEntreprise).map(([entreprise, sujetsSet]) => {
          return [entreprise, (sujetsSet as Set<string>).size];
        });
      })
    );
  }

  // ================== NOUVELLES MÉTHODES PROFESSEUR ==================

  private getCommitsParGroupe(profId: string): Observable<any[]> {
    return this.groupService.getAllGroups().pipe(
      map(groups => {
        // Filtrer les groupes du professeur (si nécessaire)
        const profGroups = groups.filter(group => 
          group.enseignantId?.toString() === profId || !profId
        );

        // Simuler les données de commits (à remplacer par l'appel réel à GitRepositoryService)
        return profGroups.map(group => [
          group.nom,
          Math.floor(Math.random() * 50) + 10 // Simulation - à remplacer
        ]);
      })
    );
  }

  private getCommitsParUtilisateurParGroupe(profId: string): Observable<any> {
    return this.groupService.getAllGroups().pipe(
      map(groups => {
        const profGroups = groups.filter(group => 
          group.enseignantId?.toString() === profId || !profId
        );

        const result: any = {};
        
        profGroups.forEach(group => {
          if (group.users && group.users.length > 0) {
            result[group.nom] = group.users.map((userRole: any) => {
              // Simulation des commits par utilisateur
              return {
                utilisateur: `User ${userRole.userId}`, // À remplacer par le vrai nom
                commits: Math.floor(Math.random() * 20) + 1
              };
            });
          }
        });

        return result;
      })
    );
  }

  private getTotalRepositoriesProf(profId: string): Observable<number> {
    return this.groupService.getAllGroups().pipe(
      map(groups => {
        const profGroups = groups.filter(group => 
          group.enseignantId?.toString() === profId
        );
        return profGroups.filter(group => group.gitRepoUrl && group.gitRepoUrl.trim() !== '').length;
      })
    );
  }

  // ================== MÉTHODES EXISTANTES (conservées) ==================
  
  private getTotalUsers(): Observable<number> {
    return this.userService.getAllUsers().pipe(
      map(users => users.length)
    );
  }

  private getTotalDemandeBdp(): Observable<number> {
    return this.demandeService.getDemandes().pipe(
      map(demandes => demandes.length)
    );
  }

  private getTotalDemandeParrainage(): Observable<number> {
    return this.parrainageService.getDemandes().pipe(
      map(demandes => demandes.entreprise)
    );
  }

  private getBdpBySujet(): Observable<any[]> {
    return this.demandeService.getDemandes().pipe(
      map(demandes => {
        const specialites = demandes.reduce((acc: any, demande:any) => {
          const spec = demande.sujet || 'Non spécifiée';
          console.log(demandes);

          console.log(spec);
          acc[spec] = (acc[spec] || 0) + 1;
          return acc;
        }, {});
        return Object.entries(specialites);
      })
    );
  }

  private getBdpByStatus(): Observable<any[]> {
    return this.demandeService.getDemandes().pipe(
      map(demandes => {
        const statusCount = demandes.reduce((acc: any, demande:any) => {
          const status = demande.statut || 'En attente';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        return Object.entries(statusCount);
      })
    );
  }

  private getParrainageByStatus(): Observable<any[]> {
    return this.parrainageService.getDemandes().pipe(
      map(demandes => {
        const statusCount = demandes.reduce((acc: any, demande:any) => {
          const status = demande.statut || 'En attente';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        return Object.entries(statusCount);
      })
    );
  }

  private getParrainageBySujet(): Observable<any[]> {
    return this.parrainageService.getDemandes().pipe(
      map(demandes => {
        const sujets = demandes.reduce((acc: any, demande:any) => {
          const sujet = demande.sujet?.titre || 'Non spécifié';
          acc[sujet] = (acc[sujet] || 0) + 1;
          return acc;
        }, {});
        return Object.entries(sujets);
      })
    );
  }

  private getUsersByRole(): Observable<any[]> {
    return this.userService.getAllUsers().pipe(
      map(users => {
        const rolesCount = users.reduce((acc: any, user) => {
          user.roles.forEach((role: string) => {
            acc[role] = (acc[role] || 0) + 1;
          });
          return acc;
        }, {});
        return Object.entries(rolesCount);
      })
    );
  }

  private getSujetsByGroups(profId: string): Observable<any[]> {
    return this.sujetService.getAllSujets().pipe(
      map(sujets => {
        const groupesCount = sujets.reduce((acc: any, sujet) => {
          const titre = sujet.titre || 'Sans titre';
          acc[titre] = (sujet.groups || []).length;
          return acc;
        }, {});
        return Object.entries(groupesCount);
      })
    );
  }

  private getTopGroupsByNote(profId: string): Observable<any[]> {
    return this.groupService.getAllGroups().pipe(
      map(groups => {
        const groupsWithNotes = groups.map(group => ({
          nom: group.nom,
          note: Math.random() * 20
        }))
        .sort((a, b) => b.note - a.note)
        .slice(0, 3);

        return groupsWithNotes.map(group => [group.nom, group.note]);
      })
    );
  }

  private getTachesByStatus(profId: string): Observable<any[]> {
    return this.tacheService.getTachesStats().pipe(
      map(stats => {
        const tachesStatus = Object.entries(stats).map(([status, count]) => {
          let label = '';
          switch (status) {
            case 'DONE': label = 'Terminé'; break;
            case 'IN_PROGRESS': label = 'En cours'; break;
            case 'TO_DO': label = 'À faire'; break;
            default: label = status;
          }
          return [label, count];
        });
        return tachesStatus;
      })
    );
  }
  
}