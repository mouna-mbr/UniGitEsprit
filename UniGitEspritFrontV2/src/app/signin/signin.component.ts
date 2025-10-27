import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements AfterViewInit {
  identifiant: string = '';
  password: string = '';
  rememberMe: boolean = false;
  identifiantError: string = '';
  passwordError: string = '';
  isLoading: boolean = false;
  passwordVisible: boolean = false;
  showAlert: boolean = false;
  alertMessage: string = '';
  private alertInterval: any;

  @ViewChild('signinBtn') signinBtn!: ElementRef;
  @ViewChild('passwordToggle') passwordToggle!: ElementRef;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  validateIdentifiant(identifiantInput: any) {
    const identifiantRegex = /^\d{3}[A-Z]{3}\d{4}$/;
    if (identifiantInput.value && !identifiantRegex.test(identifiantInput.value)) {
      this.identifiantError = 'Identifiant must be 3 digits, 3 uppercase letters, 4 digits (e.g., 233AFT0654)';
    } else {
      this.identifiantError = '';
    }
  }

  validatePassword(passwordInput: any) {
    if (passwordInput.value && passwordInput.value.length < 6) {
      this.passwordError = 'Password must be at least 6 characters long';
    } else {
      this.passwordError = '';
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    const input = document.getElementById('password') as HTMLInputElement;
    input.type = this.passwordVisible ? 'text' : 'password';
    const icon = this.passwordToggle.nativeElement.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  }

  onSubmit(form: NgForm) {
    console.log('Form submitted:', form.valid, { identifiantError: this.identifiantError, passwordError: this.passwordError });
  
    if (form.valid && !this.identifiantError && !this.passwordError) {
      this.isLoading = true;
      this.showAlert = false;
  
      this.authService.login(this.identifiant, this.password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.isLoading = false;
          this.showAlert = true;
          this.alertMessage = 'Sign in successful!';
          this.startAlertBlink();
  
          // Save token & user in localStorage
          this.authService.setCurrentUser(response.user);
          localStorage.setItem('auth-token', response.token);
  
          const user = response.user;
          console.log('User roles:', user.role);
  
          // ✅ Redirection based on user roles and Git fields
          if (user.role && user.role.includes('ADMIN')) {
            console.log('Navigating to /adduser');
            this.router.navigate(['/adduser']).then(success => {
              console.log('Navigation to /adduser success:', success);
            });
          } else if (!user.gitUsername || !user.gitAccessToken) {
            console.log('Navigating to /gitauth');
            this.router.navigate(['/gitauth']).then(success => {
              console.log('Navigation to /gitauth success:', success);
            });
          } else {
            console.log('Navigating to /profile');
            this.router.navigate(['/profile']).then(success => {
              console.log('Navigation to /profile success:', success);
            });
          }
  
          // Hide alert after 3s
          setTimeout(() => {
            this.stopAlertBlink();
            this.showAlert = false;
          }, 3000);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.isLoading = false;
          this.showAlert = true;
          this.alertMessage = error.error?.message || 'Invalid identifiant or password';
          this.startAlertBlink();
  
          setTimeout(() => {
            this.stopAlertBlink();
            this.showAlert = false;
          }, 3000);
        }
      });
    } else {
      // 🔴 Invalid form
      console.log('Form invalid or errors:', { identifiant: this.identifiant, password: this.password });
      if (!this.identifiant) this.identifiantError = 'Identifiant is required';
      if (!this.password) this.passwordError = 'Password is required';
  
      this.showAlert = true;
      this.alertMessage = 'Please fix the errors in the form!';
      this.startAlertBlink();
      setTimeout(() => {
        this.stopAlertBlink();
        this.showAlert = false;
      }, 3000);
    }
  }
  

  startAlertBlink() {
    let opacity = 1;
    this.alertInterval = setInterval(() => {
      opacity = opacity === 1 ? 0 : 1;
      const alertElement = document.querySelector('.custom-alert');
      if (alertElement) {
        (alertElement as HTMLElement).style.opacity = opacity.toString();
      }
    }, 500);
  }

  stopAlertBlink() {
    clearInterval(this.alertInterval);
    const alertElement = document.querySelector('.custom-alert');
    if (alertElement) {
      (alertElement as HTMLElement).style.opacity = '1';
    }
  }

  signInWithGoogle() {
    alert('Google sign-in would be implemented here');
  }

  signInWithMicrosoft() {
    alert('Microsoft sign-in would be implemented here');
  }

  forgotPassword(event: Event) {
    event.preventDefault();
    alert('Forgot password functionality would be implemented here');
  }

  signUp(event: Event) {
    event.preventDefault();
    alert('Sign up page would be implemented here');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const card = document.querySelector('.signin-card');
      const features = document.querySelector('.features-section');
      if (card) card.classList.add('animate-in');
      if (features) features.classList.add('animate-in');
    }, 100);

    const shapes = document.querySelectorAll('.shape');
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