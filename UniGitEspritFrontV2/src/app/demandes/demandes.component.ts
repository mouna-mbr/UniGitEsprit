import { Component, OnInit } from '@angular/core';
import { DemandesService } from '../services/demandes.service';
import { DemandeBDPDTO } from '../models/demande.model';
import { BrowserModule } from "@angular/platform-browser";
import { GroupDetailsComponent } from '../group-details/group-details.component';
import { CommonModule } from '@angular/common';
import { GroupResponse } from '../models/group.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

@Component({
  selector: 'app-demandes',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './demandes.component.html',
  styleUrls: ['./demandes.component.css'],
})
export class DemandesComponent implements OnInit{
  isAdmin :boolean | undefined = false;
  isCpi :boolean | undefined = false;
  
  demands: DemandeBDPDTO[] = [];
  selectedGroup: GroupResponse | null = null;
  private searchSubject = new Subject<string>();
  results: DemandeBDPDTO[] = [];
  searching = false;
  errorMessage = '';
  searchTerm = '';
  constructor(private demandeService: DemandesService,private authService: AuthService ,private router: Router) {}
ngOnInit(): void {
 this.loadDemandes();
this.isAdmin = this.authService.getCurrentUser()?.roles.includes(Role.ADMIN);
this.isCpi = this.authService.getCurrentUser()?.roles.includes(Role.COORDINATEUR_PI);
}
onSearch(): void {
  if (!this.searchTerm.trim()) {
    this.results = [];
    return;
  }
  this.searching = true;
  this.demandeService.searchDemands(this.searchTerm).subscribe({
    next: (res) => {
      this.demands = res;
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
  this.loadDemandes();
}
loadDemandes() {
  this.demandeService.getDemandes().subscribe({
    next: (demands) => {
      this.demands = demands;
    },
    error: (err) => {
      console.error('Error fetching demands:', err);
      this.demands = [];
    }
  });
}
handleAccept(id: number) {
  this.demandeService.updateStatus(id, 'ACCEPTED')
    .subscribe({
      next: (updated) => {
        console.log('Status updated', updated);
        this.loadDemandes();
      },
      error: (err) => {
        console.error('Failed to update status', err);
      }
    });
}


  handleRefuse(id: number) {
    this.demandeService.updateStatus(id, 'REFUSED')
    .subscribe({
      next: (updated) => {
        console.log('Status updated', updated);
        this.loadDemandes();
      },
      error: (err) => {
        console.error('Failed to update status', err);
      }
    });
  }

  showGroupDetails(id: number): void {
    this.router.navigate([`/groupdetails/${id}`]);
  }

  closeModal() {
    this.selectedGroup = null;
  }
  

}
