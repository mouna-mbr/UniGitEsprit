import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";
import { AuthService } from "../services/auth.service";
import { ChartData } from "chart.js";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  
  statsAdmin: any = {};
  currentUser: any;
  stats: any = {};
  totalDemandeBdp: number = 0;
  totalDemandeParrainage: number = 0;
  // Charts (Admin)
  bdpBySpecialiteChart!: ChartData<'bar'>;
  bdpByStatusChart!: ChartData<'doughnut'>;
  parrainageByStatusChart!: ChartData<'doughnut'>;
  parrainageBySujetChart!: ChartData<'bar'>;

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    // Charger stats admin
    this.api.getAdminStats().subscribe(data => {
      this.statsAdmin = data;
      console.log(data);
this.totalDemandeBdp = data.totalDemandeBdp;
this.totalDemandeParrainage = data.totalDemandeParrainage;
      if (data.bdpBySpecialite) {
        this.bdpBySpecialiteChart = {
          labels: data.bdpBySpecialite.map((x: any) => x[0]),
          datasets: [{
            label: "BDP par spécialité",
            data: data.bdpBySpecialite.map((x: any) => x[1]),
            backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#AB47BC", "#26C6DA"]
          }]
        };
      }

      if (data.bdpByStatus) {
        this.bdpByStatusChart = {
          labels: data.bdpByStatus.map((x: any) => x[0]),
          datasets: [{
            label: "BDP par statut",
            data: data.bdpByStatus.map((x: any) => x[1]),
            backgroundColor: ["#4CAF50", "#FFC107", "#F44336", "#2196F3"]
          }]
        };
      }

      if (data.parrainageByStatus) {
        this.parrainageByStatusChart = {
          labels: data.parrainageByStatus.map((x: any) => x[0]),
          datasets: [{
            label: "Parrainage par statut",
            data: data.parrainageByStatus.map((x: any) => x[1]),
            backgroundColor: ["#8E44AD", "#2ECC71", "#E67E22", "#E74C3C"]
          }]
        };
      }

      if (data.parrainageBySujet) {
        this.parrainageBySujetChart = {
          labels: data.parrainageBySujet.map((x: any) => x[0]),
          datasets: [{
            label: "Parrainage par sujet",
            data: data.parrainageBySujet.map((x: any) => x[1]),
            backgroundColor: ["#3498DB", "#1ABC9C", "#9B59B6", "#F1C40F"]
          }]
        };
      }
    });

    // Charger stats prof si utilisateur connecté
    this.currentUser = this.auth.getCurrentUser();
    if (this.currentUser && this.currentUser.identifiant) {
      this.api.getProfStats(this.currentUser.identifiant).subscribe(
        data => { this.stats = data; 
          console.log(data);
        },
        error => { console.error("Error fetching professor stats:", error); }
      );
    } else {
      console.warn("No current user found. Skipping getProfStats.");
    }
  }

  // ------------------ PROF CHARTS ------------------ //
  get sujetsByGroupsChart() {
    return {
      labels: this.stats.sujetsByGroups?.map((x: any) => x[0]) || [],
      datasets: [
        { 
          label: "Nombre de Groupes",
          data: this.stats.sujetsByGroups?.map((x: any) => x[1]) || [],
          backgroundColor: ["#FF5722", "#009688", "#3F51B5", "#FFC107"]
        }
      ]
    };
  }

  get topGroupsByNoteChart() {
    return {
      labels: this.stats.topGroupsByNote?.map((x: any) => x[0]) || [],
      datasets: [
        { 
          label: "Notes",
          data: this.stats.topGroupsByNote?.map((x: any) => x[1]) || [],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
        }
      ]
    };
  }

  get tachesByStatusChart() {
    return {
      labels: this.stats.tachesByStatus?.map((x: any) => x[0]) || [],
      datasets: [
        { 
          label: "Tâches",
          data: this.stats.tachesByStatus?.map((x: any) => x[1]) || [],
          backgroundColor: ["#4CAF50", "#FFC107", "#F44336", "#2196F3"]
        }
      ]
    };
  }
}
