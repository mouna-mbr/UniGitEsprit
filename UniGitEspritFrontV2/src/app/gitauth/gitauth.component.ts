import { Component, ViewChild, type ElementRef } from "@angular/core";
import type { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserResponse } from '../models/user.model';

@Component({
  selector: "app-gitauth",
  templateUrl: "./gitauth.component.html",
  styleUrls: ["./gitauth.component.css"],
})
export class GitauthComponent {
  gitUsername = "";
  accessToken = "";
  saveCredentials = false;
  gitUsernameError = "";
  accessTokenError = "";
  isLoading = false;
  tokenVisible = false;
  showAlert = false;
  alertMessage = "";
  alertInterval: any;

  @ViewChild("gitauthBtn") gitauthBtn!: ElementRef;
  @ViewChild("tokenToggle") tokenToggle!: ElementRef;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  validateGitUsername(gitUsernameInput: any) {
    const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9]|-)*[a-zA-Z0-9]$/;
    if (gitUsernameInput.value) {
      if (gitUsernameInput.value.length < 2) {
        this.gitUsernameError = "Username must be at least 2 characters long";
      } else if (gitUsernameInput.value.length > 39) {
        this.gitUsernameError = "Username must be less than 40 characters";
      } else if (!usernameRegex.test(gitUsernameInput.value)) {
        this.gitUsernameError = "Username can only contain alphanumeric characters and hyphens";
      } else {
        this.gitUsernameError = "";
      }
    } else {
      this.gitUsernameError = "";
    }
  }

  validateAccessToken(accessTokenInput: any) {
    if (accessTokenInput.value) {
      if (accessTokenInput.value.length < 20) {
        this.accessTokenError = "Access token appears to be too short";
      } else if (accessTokenInput.value.length > 255) {
        this.accessTokenError = "Access token is too long";
      } else {
        this.accessTokenError = "";
      }
    } else {
      this.accessTokenError = "";
    }
  }

  toggleTokenVisibility() {
    this.tokenVisible = !this.tokenVisible;
    const input = document.getElementById("accessToken") as HTMLInputElement;
    input.type = this.tokenVisible ? "text" : "password";
  }

  async verifyGitHubCredentials(): Promise<boolean> {
    console.log(this.accessToken);
    const headers = new HttpHeaders({
      'Authorization': `token ${this.accessToken}`,
      'Accept': 'application/vnd.github.v3+json'
    });

    try {
      await this.http.get(`https://api.github.com/users/${this.gitUsername}`, { headers }).toPromise();
      return true;
    } catch (error) {
      return false;
    }
  }

  async onSubmit(form: NgForm) {
    if (form.valid && !this.gitUsernameError && !this.accessTokenError) {
      this.isLoading = true;
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.isLoading = false;
        this.showAlert = true;
        this.alertMessage = "No user is currently logged in!";
        this.startAlertBlink();
        setTimeout(() => {
          this.stopAlertBlink();
          this.showAlert = false;
        }, 3000);
        return;
      }

      const isValid = true;
      if (!isValid) {
        this.isLoading = false;
        this.showAlert = true;
        this.alertMessage = "Invalid GitHub credentials. Please check your username or access token.";
        this.startAlertBlink();
        setTimeout(() => {
          this.stopAlertBlink();
          this.showAlert = false;
        }, 3000);
        return;
      }

      const updateData = {
        gitUsername: this.gitUsername,
        gitAccessToken: this.accessToken
      };

      this.userService.updateGitCredentials(currentUser.id, updateData).subscribe({
        next: (response: UserResponse) => {
          this.isLoading = false;
          this.showAlert = true;
          this.alertMessage = "Git credentials updated successfully! Redirecting to profile...";
          this.startAlertBlink();

          if (this.saveCredentials) {
            this.saveGitCredentials();
          }
          this.authService.setCurrentUser(response); 

          setTimeout(() => {
            this.stopAlertBlink();
            this.showAlert = false;
            this.router.navigate(["/profile"]);
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          this.showAlert = true;
          this.alertMessage = error.message || "Failed to update Git credentials. Please try again.";
          this.startAlertBlink();
          setTimeout(() => {
            this.stopAlertBlink();
            this.showAlert = false;
          }, 3000);
        }
      });
    } else {
      if (!this.gitUsername) this.gitUsernameError = "Git username is required";
      if (!this.accessToken) this.accessTokenError = "Access token is required";

      this.showAlert = true;
      this.alertMessage = "Please fix the errors in the form!";
      this.startAlertBlink();
      setTimeout(() => {
        this.stopAlertBlink();
        this.showAlert = false;
      }, 3000);
    }
  }

  skipSetup() {
    this.showAlert = true;
    this.alertMessage = "Git integration skipped. You can set it up later in settings.";
    this.startAlertBlink();
    setTimeout(() => {
      this.stopAlertBlink();
      this.showAlert = false;
      this.router.navigate(["/dashboard"]);
    }, 2000);
  }

  private saveGitCredentials() {
    const credentials = {
      username: this.gitUsername,
      accessToken: this.accessToken,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("gitCredentials", JSON.stringify(credentials));
  }

  startAlertBlink() {
    let opacity = 1;
    this.alertInterval = setInterval(() => {
      opacity = opacity === 1 ? 0 : 1;
      const alertElement = document.querySelector(".custom-alert");
      if (alertElement) {
        (alertElement as HTMLElement).style.opacity = String(opacity);
      }
    }, 500);
  }

  stopAlertBlink() {
    clearInterval(this.alertInterval);
    const alertElement = document.querySelector(".custom-alert");
    if (alertElement) {
      (alertElement as HTMLElement).style.opacity = "1";
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const card = document.querySelector(".gitauth-card");
      const info = document.querySelector(".info-section");
      if (card) card.classList.add("animate-in");
      if (info) info.classList.add("animate-in");
    }, 100);

    const shapes = document.querySelectorAll(".shape");
    shapes.forEach((shape, index) => {
      const duration = 3000 + index * 1000;
      setInterval(() => {
        const translateX = Math.random() * 20 - 10;
        const translateY = Math.random() * 20 - 10;
        const rotate = Math.random() * 360;
        (shape as HTMLElement).style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`;
      }, duration);
    });
  }
}