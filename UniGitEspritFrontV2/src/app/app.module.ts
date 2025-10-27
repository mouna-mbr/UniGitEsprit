import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GitauthComponent } from './gitauth/gitauth.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
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
import { AddGroupComponent } from './add-group/add-group.component';
import { GroupsComponent } from './groups/groups.component';
import { EditGroupComponent } from './edit-group/edit-group.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import {  SprintDetailsComponent } from './sprint-details/sprint-details.component';
import { RepositoryViewerComponent } from './repository-viewer/repository-viewer.component';
import { NgChartsModule } from 'ng2-charts';
import { AuthInterceptor } from './auth.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    LayoutComponent,
    SigninComponent,
    GitauthComponent,
    AdminDashboardComponent,
    AdminAdduserComponent,
    ProfileComponent,
    ClassesComponent,
    AddClasseComponent,
    EditClasseComponent,
    FavoriteClassesComponent,
    ClassDetailsComponent,
    AddSujetComponent,
    EditSujetComponent,
    SujetDetailsComponent,
    SujetsComponent,
    GroupsComponent,
    EditGroupComponent,
    GroupDetailsComponent,
    AddGroupComponent,
    SprintDetailsComponent,
    RepositoryViewerComponent    

    // Removed AdminAdduserComponent
  ],
  imports: [
    NgChartsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // Nécessaire pour les animations de toastr
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor , multi: true }
  ],  bootstrap: [AppComponent]
})
export class AppModule { }