import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
isAdmin: boolean|undefined = false;
isprof: boolean|undefined = false;
isStudent: boolean|undefined = false;
isReferent: boolean|undefined = false;
isCpi: boolean|undefined = false;


constructor(private authService:AuthService){}
ngOnInit(): void {
  this.isAdmin = this.authService.getCurrentUser()?.role.includes('ADMIN');
  this.isprof = this.authService.getCurrentUser()?.role.includes('PROFESSOR');
  this.isStudent = this.authService.getCurrentUser()?.role.includes('STUDENT');
  this.isReferent = this.authService.getCurrentUser()?.role.includes('REFERENT_ENTREPRISE');
  this.isCpi = this.authService.getCurrentUser()?.role.includes('COORDINATEUR_PI');
}
}
