import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SujetService } from '../services/sujet.service';
import { AuthService } from '../services/auth.service';
import { SujetCreate } from '../models/sujet.model';
import { TechnologyService } from '../services/technology.service';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-add-sujet',
  templateUrl: './add-sujet.component.html',
  styleUrls: ['./add-sujet.component.css']
})
export class AddSujetComponent implements OnInit {
  allTechno:string[]=[];
  selectedTechnologies: string[] = [];
  sujetForm: FormGroup;
  errorMessage: string | null = null;
  userId: number | null = null;
  isLoaded = false;
  techControl = new FormControl(''); 
  filteredTechnologies!: Observable<string[]>;
  
  
  constructor(
    private fb: FormBuilder,
    private sujetService: SujetService,
    private authService: AuthService,
    private technoService : TechnologyService,
    private router: Router
  ) {
    this.sujetForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      technologies:[[]],
      proposeParId: [null, Validators.required] 
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.userId = currentUser ? currentUser.id : null;
    if (this.userId) {
      this.sujetForm.patchValue({ proposeParId: this.userId }); 
    }
    this.technoService.getAllTechnologies().subscribe((techs) => {
      this.allTechno = techs;

      this.filteredTechnologies = this.techControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    });

    this.isLoaded = true; 
  }
private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();
  return this.allTechno.filter(tech => tech.toLowerCase().includes(filterValue));
}

addTechnology(tech: string): void {
  if (tech && !this.selectedTechnologies.includes(tech)) {
    this.selectedTechnologies.push(tech);
    this.sujetForm.get('technologies')?.setValue(this.selectedTechnologies);
    this.techControl.setValue(''); 
  }
}

removeTechnology(tech: string): void {
  this.selectedTechnologies = this.selectedTechnologies.filter(t => t !== tech);
  this.sujetForm.get('technologies')?.setValue(this.selectedTechnologies);
}
  onSubmit(): void {
    if (this.sujetForm.valid && this.userId) {
      const sujet: SujetCreate = this.sujetForm.value;
      this.sujetService.addSujet(sujet, this.userId).subscribe({
        next: () => {
          this.showNotification('success', 'Sujet added successfully');
          this.router.navigate(['/sujets']);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.showNotification('error', error.message);
        }
      });
    } else {
      this.showNotification('error', 'Invalid form or no user logged in');
    }
  }

  goBack(): void {
    this.router.navigate(['/sujets']);
  }

  showNotification(type: 'success' | 'error' | 'info', message: string): void {
    const container = document.getElementById('notification-container');
    if (container) {
      const notification = document.createElement('div');
      notification.className = `notification ${type} show`;
      notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
      `;
      container.appendChild(notification);
      setTimeout(() => {
        notification.className = `notification ${type}`;
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  }
}