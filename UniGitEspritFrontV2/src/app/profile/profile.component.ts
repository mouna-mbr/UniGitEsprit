import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserResponse } from '../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserResponse | null = null;
  profileImage: string = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user && this.user.gitUsername) {
      this.fetchGitHubProfileImage(this.user.gitUsername);
    }
  }

  fetchGitHubProfileImage(username: string): void {
    this.http.get(`https://api.github.com/users/${username}`).subscribe({
      next: (data: any) => {
        this.profileImage = data.avatar_url;
      },
      error: (error) => {
        console.error('Failed to fetch GitHub profile image', error);
        this.profileImage = ''; 
      }
    });
  }

  editProfile(): void {
    this.router.navigate(['/edit-profile']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}