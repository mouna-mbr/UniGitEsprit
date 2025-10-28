import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";
import { AuthService } from "../services/auth.service";
import { ChartData, ChartOptions } from "chart.js";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  
  statsAdmin: any = {};
  currentUser: any;
  stats: any = {};
  
  // KPIs
  totalDemandeBdp: number = 0;
  totalDemandeParrainage: number = 0;
  totalUsers: number = 0;
  
  // Charts (Admin)
  bdpBySpecialiteChart!: ChartData<'bar'>;
  bdpByStatusChart!: ChartData<'doughnut'>;
  parrainageByStatusChart!: ChartData<'doughnut'>;
  parrainageBySujetChart!: ChartData<'bar'>;
  usersByRoleChart!: ChartData<'doughnut'>; // Changé de 'pie' à 'doughnut'

  // Options des graphiques
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    this.loadAdminStats();
    this.loadProfStats();
  }

  loadAdminStats() {
    this.api.getAdminStats().subscribe(data => {
      this.statsAdmin = data;
      console.log('Admin Stats:', data);
      
      this.totalDemandeBdp = data.totalDemandeBdp;
      this.totalDemandeParrainage = data.totalDemandeParrainage;
      this.totalUsers = data.totalUsers;

      // Initialiser les graphiques
      this.initCharts(data);
    });
  }

  loadProfStats() {
    this.currentUser = this.auth.getCurrentUser();
    if (this.currentUser && this.currentUser.identifiant) {
      this.api.getProfStats(this.currentUser.identifiant).subscribe(
        data => { 
          this.stats = data; 
          console.log('Prof Stats:', data);
        },
        error => { console.error("Error fetching professor stats:", error); }
      );
    }
  }

  initCharts(data: any) {
    // BDP par Spécialité
    if (data.bdpBySpecialite) {
      this.bdpBySpecialiteChart = {
        labels: data.bdpBySpecialite.map((x: any) => x[0]),
        datasets: [{
          label: "Nombre de demandes",
          data: data.bdpBySpecialite.map((x: any) => x[1]),
          backgroundColor: this.generateColors(data.bdpBySpecialite.length)
        }]
      };
    }

    // BDP par Statut
    if (data.bdpByStatus) {
      this.bdpByStatusChart = {
        labels: data.bdpByStatus.map((x: any) => x[0]),
        datasets: [{
          label: "Demandes BDP",
          data: data.bdpByStatus.map((x: any) => x[1]),
          backgroundColor: ["#4CAF50", "#FFC107", "#F44336", "#2196F3", "#9C27B0"]
        }]
      };
    }

    // Parrainage par Statut
    if (data.parrainageByStatus) {
      this.parrainageByStatusChart = {
        labels: data.parrainageByStatus.map((x: any) => x[0]),
        datasets: [{
          label: "Demandes de parrainage",
          data: data.parrainageByStatus.map((x: any) => x[1]),
          backgroundColor: ["#8E44AD", "#2ECC71", "#E67E22", "#E74C3C", "#3498DB"]
        }]
      };
    }

    // Parrainage par Sujet
    if (data.parrainageBySujet) {
      this.parrainageBySujetChart = {
        labels: data.parrainageBySujet.map((x: any) => this.truncateLabel(x[0])),
        datasets: [{
          label: "Parrainages par sujet",
          data: data.parrainageBySujet.map((x: any) => x[1]),
          backgroundColor: "#3498DB"
        }]
      };
    }

    // Utilisateurs par Rôle (maintenant en doughnut au lieu de pie)
    if (data.usersByRole) {
      this.usersByRoleChart = {
        labels: data.usersByRole.map((x: any) => x[0]),
        datasets: [{
          label: "Utilisateurs",
          data: data.usersByRole.map((x: any) => x[1]),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
        }]
      };
    }
  }

  // Méthodes utilitaires
  private generateColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${(i * 360) / count}, 70%, 60%)`);
    }
    return colors;
  }

  private truncateLabel(label: string, maxLength: number = 20): string {
    return label.length > maxLength ? label.substring(0, maxLength) + '...' : label;
  }

  // ------------------ PROF CHARTS ------------------ //
  get sujetsByGroupsChart(): ChartData<'bar'> {
    const data = this.stats.sujetsByGroups || [];
    return {
      labels: data.map((x: any) => this.truncateLabel(x[0])) || ['Aucune donnée'],
      datasets: [
        { 
          label: "Nombre de Groupes",
          data: data.map((x: any) => x[1]) || [0],
          backgroundColor: "#FF5722"
        }
      ]
    };
  }

  get topGroupsByNoteChart(): ChartData<'bar'> {
    const data = this.stats.topGroupsByNote || [];
    return {
      labels: data.map((x: any) => x[0]) || ['Aucune donnée'],
      datasets: [
        { 
          label: "Notes",
          data: data.map((x: any) => x[1]) || [0],
          backgroundColor: "#009688"
        }
      ]
    };
  }

  get tachesByStatusChart(): ChartData<'doughnut'> {
    const data = this.stats.tachesByStatus || [];
    return {
      labels: data.map((x: any) => x[0]) || ['Aucune donnée'],
      datasets: [
        { 
          label: "Tâches",
          data: data.map((x: any) => x[1]) || [0],
          backgroundColor: ["#4CAF50", "#FFC107", "#F44336", "#2196F3"]
        }
      ]
    };
  }
  // Méthode d'export CSV
exportToCSV(chartData: any, filename: string) {
  if (!chartData || !chartData.labels || !chartData.datasets) {
    console.error('Données du graphique non disponibles');
    return;
  }

  const labels = chartData.labels;
  const data = chartData.datasets[0].data;
  
  let csvContent = 'Label,Valeur\n';
  
  labels.forEach((label: string, index: number) => {
    const value = data[index] || 0;
    const escapedLabel = `"${label.replace(/"/g, '""')}"`;
    csvContent += `${escapedLabel},${value}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
}