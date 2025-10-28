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
import { AddSujetComponent } from './add-sujet/add-sujet.component';
import { EditSujetComponent } from './edit-sujet/edit-sujet.component';
import { SujetDetailsComponent } from './sujet-details/sujet-details.component';
import { SujetsComponent } from './sujets/sujets.component';
import { GroupsComponent } from './groups/groups.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { EditGroupComponent } from './edit-group/edit-group.component';
import {  SprintDetailsComponent } from './sprint-details/sprint-details.component';
import { RepositoryViewerComponent } from './repository-viewer/repository-viewer.component';
import { DemandesComponent } from './demandes/demandes.component';
import { DemandesSujetComponent } from './demandes-sujet/demandes-sujet.component';
import { MergeRequestsComponentComponent } from './merge-requests-component/merge-requests-component.component';

const routes: Routes = [
  { path: 'signin', component: SigninComponent }, // Standalone signin route without layout
  { path: 'gitauth', component: GitauthComponent }, // Standalone gitauth route without layout
  { path: '', component: SigninComponent, pathMatch: 'full' }, // Default route

  {
    path: '', // Parent route for all other pages
    component: LayoutComponent,
    children: [

      { path: 'adduser', component: AdminAdduserComponent }, // Corrected from 'addduser' to 'adduser'
      { path: 'profile', component: ProfileComponent },
      { path: 'dashbord', component: AdminDashboardComponent }, // Default route
      //class
      { path: 'demandesGroup', component: DemandesComponent },
      { path: 'demandesSujet', component: DemandesSujetComponent },
      { path: 'MergeRequest', component: MergeRequestsComponentComponent },




      { path: 'classes', component: ClassesComponent },
      { path: 'add-classe', component: AddClasseComponent },
      {path:'edit-classe/:id', component: EditClasseComponent},
      {path:'favoritesClasses', component: FavoriteClassesComponent},
      {path:'classesDetails/:id', component: ClassDetailsComponent},
      //sujet
      { path: 'sujets', component: SujetsComponent },
      { path: 'add-sujet', component: AddSujetComponent },
      {path:'edit-sujet/:id', component: EditSujetComponent},
      {path:'favoritesClasses', component: FavoriteClassesComponent},
      {path:'sujetDetails/:id', component: SujetDetailsComponent},
      //group
      { path: 'groupes', component: GroupsComponent },
      { path: 'addgroupe', component: AddGroupComponent },
      { path: 'groupdetails/:id', component: GroupDetailsComponent },
      { path: 'update-group/:id', component: EditGroupComponent },

      
      { path: 'detailssprint/:id', component: SprintDetailsComponent },
      {path:'repository-viewer',component:RepositoryViewerComponent},
     // {path:'repository-viewer',component:GitGroupComponent}


    ]
  },
  { path: '**', redirectTo: '/signin' } // Wildcard route to redirect invalid paths to signin
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }