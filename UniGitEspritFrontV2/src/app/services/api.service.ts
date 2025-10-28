import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { UserService } from './user.service';
import { DemandesService } from './demandes.service';
import { DemandeParainageService } from './demande-parainage.service';
import { SujetService } from './sujet.service';
import { GroupService } from './group.service';
import { TacheService } from './tache.service';

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
    private tacheService: TacheService
  ) {}

  // ================== STATISTIQUES ADMIN ==================
  getAdminStats(): Observable<any> {
    return forkJoin({
      totalUsers: this.getTotalUsers(),
      totalDemandeBdp: this.getTotalDemandeBdp(),
      totalDemandeParrainage: this.getTotalDemandeParrainage(),
      bdpBySpecialite: this.getBdpBySpecialite(),
      bdpByStatus: this.getBdpByStatus(),
      parrainageByStatus: this.getParrainageByStatus(),
      parrainageBySujet: this.getParrainageBySujet(),
      usersByRole: this.getUsersByRole()
    });
  }

  // ================== STATISTIQUES PROFESSEUR ==================
  getProfStats(profId: string): Observable<any> {
    return forkJoin({
      sujetsByGroups: this.getSujetsByGroups(profId),
      topGroupsByNote: this.getTopGroupsByNote(profId),
      tachesByStatus: this.getTachesByStatus(profId)
    });
  }

  // ================== MÉTHODES PRIVÉES ADMIN ==================
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
      map(demandes => demandes.length)
    );
  }

  private getBdpBySpecialite(): Observable<any[]> {
    return this.demandeService.getDemandes().pipe(
      map(demandes => {
        const specialites = demandes.reduce((acc: any, demande:any) => {
          const spec = demande.specialite || 'Non spécifiée';
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
          const sujet = demande.sujet || 'Non spécifié';
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

  // ================== MÉTHODES PRIVÉES PROFESSEUR ==================
  private getSujetsByGroups(profId: string): Observable<any[]> {
    return this.sujetService.getAllSujets().pipe(
      map(sujets => {
        // Filtrer les sujets par professeur si nécessaire
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
        // Simuler des notes ou utiliser votre logique de notation
        const groupsWithNotes = groups.map(group => ({
          nom: group.nom,
          note: Math.random() * 20 // À remplacer par votre logique de notation
        }))
        .sort((a, b) => b.note - a.note)
        .slice(0, 3);

        return groupsWithNotes.map(group => [group.nom, group.note]);
      })
    );
  }

  private getTachesByStatus(profId: string): Observable<any[]> {
    // Cette méthode nécessite une logique plus complexe
    // Simulons des données pour l'exemple
    const tachesStatus = [
      ['Terminé', 15],
      ['En cours', 8],
      ['En attente', 5],
      ['Bloqué', 2]
    ];
    return new Observable(observer => {
      observer.next(tachesStatus);
      observer.complete();
    });
  }
}