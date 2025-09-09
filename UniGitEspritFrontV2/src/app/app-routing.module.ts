import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { GitauthComponent } from './gitauth/gitauth.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { AdminAdduserComponent } from './admin-adduser/admin-adduser.component';
import { ProfileComponent } from './profile/profile.component';
import { ClassesComponent } from './classes/classes.component';
import { AddClasseComponent } from './add-classe/add-classe.component';
import { EditClasseComponent } from './edit-classe/edit-classe.component';
import { FavoriteClassesComponent } from './favorite-classes/favorite-classes.component';
import { ClassDetailsComponent } from './class-details/class-details.component';

const routes: Routes = [
  { path: 'signin', component: SigninComponent }, // Standalone signin route without layout
  { path: 'gitauth', component: GitauthComponent }, // Standalone gitauth route without layout
  {
    path: '', // Parent route for all other pages
    component: LayoutComponent,
    children: [
      { path: '', component: AdminDashboardComponent, pathMatch: 'full' }, // Default route
      { path: 'adduser', component: AdminAdduserComponent }, // Corrected from 'addduser' to 'adduser'
      { path: 'profile', component: ProfileComponent },
      { path: 'classes', component: ClassesComponent },
      { path: 'add-classe', component: AddClasseComponent },
      {path:'edit-classe/:id', component: EditClasseComponent},
      {path:'favoritesClasses', component: FavoriteClassesComponent},
      {path:'classesDetails/:id', component: ClassDetailsComponent},

    ]
  },
  { path: '**', redirectTo: '/signin' } // Wildcard route to redirect invalid paths to signin
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }