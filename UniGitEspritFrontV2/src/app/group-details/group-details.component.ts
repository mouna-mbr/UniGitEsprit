import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../services/group.service';
import { ClasseService } from '../services/classe.service';
import { SujetService } from '../services/sujet.service';
import { AuthService } from '../services/auth.service';
import { PipelineService } from '../services/pipeline.service';
import { GroupResponse, UserRole } from '../models/group.model';
import { ClasseResponse } from '../models/classe.model';
import { SujetResponse } from '../models/sujet.model';
import { UserResponse } from '../models/user.model';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EtapeDTO, EtapeStatus, PipelineDTO } from '../models/pipeline.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {
  isLoading = false;
  showPipelineModal = false;
  showAddMemberModal = false;
  hasPipeline = false;
  isRefreshing = false;
  groupId!: number;
  currentGroup: GroupResponse | null = null;
  currentClass: ClasseResponse | null = null;
  currentPipeline: PipelineDTO | null = null;
  etapesWithStatus: EtapeStatus[] = [];
  members: UserResponse[] = [];
  contributors: { name: string; rank: string; commits: number }[] = [];
  repositories: { name: string; url: string }[] = [];
  newMember: UserResponse = { id: 0, firstName: '', lastName: '', role: 'STUDENT', identifiant: '', classe: '', specialite: '', email: '', gitUsername: '', gitAccessToken: '', password: '', createdAt: '' };
  newPipeline: PipelineDTO = { nom: '', groupId: 0, etapes: [{ nom: '', consigne: '', deadline: '' }] };
  currentUser: UserResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private classeService: ClasseService,
    private sujetService: SujetService,
    private authService: AuthService,
    private pipelineService: PipelineService,
    private renderer: Renderer2,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || isNaN(+id)) {
      this.router.navigate(['/groups']);
      return;
    }
    this.groupId = +id;
    this.newPipeline.groupId = this.groupId;
    this.currentUser = this.authService.getCurrentUser();
    this.loadGroupDetails();
  }

  loadGroupDetails() {
    this.isLoading = true;
    this.groupService.getGroupById(this.groupId).subscribe({
      next: (group) => {
        console.log('Group loaded:', group);
        this.currentGroup = group;
        this.repositories = [{ name: group.gitRepoName || 'No Repository', url: group.gitRepoUrl || '' }];
        this.loadClass();
        this.loadMembers();
        this.loadPipeline();
        this.loadContributors();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading group:', err);
        this.isLoading = false;
        this.router.navigate(['/groups']);
      }
    });
  }

  loadClass() {
    if (this.currentGroup?.classeId) {
      this.classeService.getClasseById(this.currentGroup.classeId).subscribe({
        next: (classe) => this.currentClass = classe,
        error: (err: HttpErrorResponse) => console.error('Error loading class:', err)
      });
    }
  }

  loadMembers() {
    if (this.currentGroup) {
      this.members = this.currentGroup.users.map(userRole => ({
        id: userRole.userId,
        firstName: '', // Fetch actual user details if needed from backend
        lastName: '',
        role: userRole.role as 'STUDENT' | 'ADMIN' | 'PROFESSOR', // Type assertion
        identifiant: '',
        classe: '',
        specialite: '',
        email: '',
        gitUsername: '',
        gitAccessToken: '',
        password: '',
        createdAt: ''
      }));
    }
  }

  loadPipeline() {
    this.pipelineService.getPipelineByGroupId(this.groupId).subscribe({
      next: (pipeline) => {
        console.log('Pipeline loaded:', pipeline);
        this.currentPipeline = pipeline;
        this.hasPipeline = !!pipeline && pipeline.etapes.length > 0;
        console.log('hasPipeline:', this.hasPipeline);
        this.processEtapes();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading pipeline:', err);
        this.hasPipeline = false;
        this.currentPipeline = null;
      }
    });
  }

  loadContributors() {
    this.contributors = [
      { name: 'Sana', rank: '1st', commits: 67 },
      { name: 'Ines', rank: '2nd', commits: 45 },
      { name: 'Mouna', rank: '3rd', commits: 32 },
    ];
  }

  processEtapes() {
    console.log('Processing etapes with currentPipeline:', this.currentPipeline);
    if (!this.currentPipeline || !this.currentPipeline.etapes?.length) {
      this.etapesWithStatus = [];
      return;
    }
    const pipeline = this.currentPipeline!;
    this.etapesWithStatus = pipeline.etapes.map((etape, index) => {
      const today = new Date();
      const deadline = etape.deadline ? new Date(etape.deadline) : new Date();
      let status: 'pending' | 'active' | 'completed' = 'pending';
      let type: 'etape' | 'milestone' | 'final' = 'etape';

      if (deadline > today && !this.etapesWithStatus.some(e => e.status === 'active')) status = 'active';
      else if (deadline < today && this.etapesWithStatus.some(e => e.status === 'completed' || e.status === 'active')) status = 'completed';

      if (index === pipeline.etapes.length - 1) type = 'final';
      else if (etape.nom?.toLowerCase().includes('milestone')) type = 'milestone';

      return { ...etape, status, type, id: etape.id || 0 };
    });
  }

  getDaysRemainingText(deadline: string): string {
    const days = this.getDaysRemaining(deadline);
    return days >= 0 ? `${days} days remaining` : `Overdue by ${Math.abs(days)} days`;
  }

  isOverdueText(deadline: string): boolean {
    return this.getDaysRemaining(deadline) < 0;
  }

  getDaysRemaining(deadline: string): number {
    if (!deadline) return 0;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return formatDate(new Date(dateString), 'dd/MM/yyyy', 'en-US');
  }

  isOverdue(deadline: string): boolean {
    if (!deadline) return false;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate < today;
  }

  editGroup() {
    console.log('Edit Group clicked');
    this.router.navigate(['/update-group', this.groupId]);
  }

  showSettings() {
    console.log('Show Settings clicked');
    alert('Settings functionality to be implemented');
  }

  viewSprint(etape: EtapeStatus) {
    console.log('View Sprint clicked for etape:', etape);
    if (etape.id) {
      this.router.navigate([`/detailssprint/${etape.id}`]);
    }
  }

  openPipelineModal() {
    console.log('Open Pipeline Modal clicked');
    this.showPipelineModal = true;
    this.newPipeline = { nom: '', groupId: this.groupId, etapes: [{ nom: '', consigne: '', deadline: '' }] };
  }

  closePipelineModal() {
    console.log('Close Pipeline Modal clicked');
    this.showPipelineModal = false;
  }

  addEtapeToPipeline() {
    console.log('Add Etape to Pipeline clicked');
    this.newPipeline.etapes.push({ nom: '', consigne: '', deadline: '' });
  }

  removeEtape(index: number) {
    console.log('Remove Etape clicked at index:', index);
    if (this.newPipeline.etapes.length > 1) {
      this.newPipeline.etapes.splice(index, 1);
    }
  }

  createPipeline() {
    console.log('Create Pipeline clicked with:', this.newPipeline);
    if (!this.newPipeline.nom.trim() || !this.newPipeline.etapes.every(e => e.nom && e.deadline)) {
      alert('Please fill all required fields.');
      return;
    }
    this.isLoading = true;
    this.pipelineService.createPipeline(this.newPipeline).subscribe({
      next: (createdPipeline: PipelineDTO) => {
        console.log('Pipeline created:', createdPipeline);
        this.currentPipeline = createdPipeline;
        this.hasPipeline = true;
        this.processEtapes();
        this.closePipelineModal();
        this.isLoading = false;
        alert('Pipeline created successfully!');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error creating pipeline:', err);
        this.isLoading = false;
        alert(`Error creating pipeline: ${err.status} - ${err.statusText}. Check console for details.`);
      }
    });
  }

  openAddMemberModal() {
    console.log('Open Add Member Modal clicked');
    this.showAddMemberModal = true;
  }

  closeAddMemberModal() {
    console.log('Close Add Member Modal clicked');
    this.showAddMemberModal = false;
  }

  addMemberToGroup() {
    console.log('Add Member to Group clicked with:', this.newMember);
    if (!this.newMember.email || !this.isValidEmail(this.newMember.email) || !this.newMember.role) {
      alert('Please enter a valid email and select a role.');
      return;
    }
    this.isLoading = true;
    // Placeholder - Integrate with backend API for member addition
    this.members.push({ ...this.newMember, id: this.members.length + 1 });
    this.closeAddMemberModal();
    this.isLoading = false;
  }

  editMember(member: UserResponse) {
    console.log('Edit Member clicked for:', member);
    alert(`Edit member: ${member.firstName} ${member.lastName}`);
  }

  removeMember(member: UserResponse) {
    console.log('Remove Member clicked for:', member);
    if (confirm(`Are you sure you want to remove ${member.firstName} ${member.lastName}?`)) {
      this.isLoading = true;
      this.members = this.members.filter(m => m.id !== member.id);
      this.isLoading = false;
    }
  }

  refreshContributions() {
    console.log('Refresh Contributions clicked');
    this.isRefreshing = true;
    setTimeout(() => {
      this.isRefreshing = false;
      this.loadContributors();
    }, 2000);
  }

  addRepository() {
    console.log('Add Repository clicked');
    alert('Add repository functionality to be implemented');
  }

// src/app/group-details.component.ts
viewRepository() {
  console.log('View Repository clicked');
  if (this.currentGroup?.gitRepoUrl) {
    this.router.navigate(['/repository-viewer'], { queryParams: { repoUrl: this.currentGroup.gitRepoUrl } });
  } else {
    alert('No repository URL available for this group.');
  }
}

  hoverRow(member: UserResponse, event: MouseEvent) {
    const row = event.currentTarget as HTMLElement;
    this.renderer.setStyle(row, 'transform', 'translateX(4px)');
  }

  unhoverRow(member: UserResponse, event: MouseEvent) {
    const row = event.currentTarget as HTMLElement;
    this.renderer.setStyle(row, 'transform', 'translateX(0)');
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}