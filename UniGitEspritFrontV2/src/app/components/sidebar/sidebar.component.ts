import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import { Role } from 'src/app/models/user.model';
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
  this.isAdmin = this.authService.getCurrentUser()?.roles.includes(Role.ADMIN);
  this.isprof = this.authService.getCurrentUser()?.roles.includes(Role.PROFESSOR);
  this.isStudent = this.authService.getCurrentUser()?.roles.includes(Role.STUDENT);
  this.isReferent = this.authService.getCurrentUser()?.roles.includes(Role.REFERENT_ENTREPRISE);
  this.isCpi = this.authService.getCurrentUser()?.roles.includes(Role.COORDINATEUR_PI);
}
}
