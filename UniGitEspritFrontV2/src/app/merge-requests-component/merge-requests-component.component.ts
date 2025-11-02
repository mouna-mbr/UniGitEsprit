import { Component } from '@angular/core';
import { MergeRequestServiceService } from '../services/merge-request-service.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-merge-requests-component',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './merge-requests-component.component.html',
  styleUrls: ['./merge-requests-component.component.css']
})
export class MergeRequestsComponentComponent {
  mergeRequests: any[] = [];
  projectId = '123456'; 
  selectedState = 'opened';
  loading = false;
  currentUser:any;
  constructor(private mrService: MergeRequestServiceService,private authService: AuthService) {
    this.currentUser=this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.loadMRs();
  }

  loadMRs() {
    this.loading = true;
    this.mrService.getAssignedMergeRequests( this.selectedState ,this.currentUser.identifiant )
      .subscribe(data => {
        console.log(data);
        this.mergeRequests = data;
        this.loading = false;
      });
  }

  onStateChange(state: string) {
    this.selectedState = state;
    this.loadMRs();
  }

  approve(mr: any) {
    this.mrService.approveMergeRequest(this.projectId, mr.iid)
      .subscribe(() => {
        alert(`MR #${mr.iid} approved!`);
      });
  }

  merge(mr: any) {
    this.mrService.mergeMergeRequest(this.projectId, mr.iid)
      .subscribe(() => {
        alert(`MR #${mr.iid} merged!`);
        this.loadMRs();
      });
  }
}
