import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PipelineService } from '../services/pipeline.service';
import { PipelineDTO, EtapeStatus } from '../model/pipeline.model';
import { GroupDTO } from '../model/GroupDTO.model';
import { UserWithRoleDTO } from '../model/UserWithRoleDTO.model';
import { GroupsService } from '../services/groups.service';
import { Class } from '../model/class.model';
import { ClassesService } from '../services/classes.service';
import { UsersService } from '../services/users.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-detailsgroupe',
  templateUrl: './detailsgroupe.component.html',
  styleUrls: ['./detailsgroupe.component.css'],
})
export class DetailsgroupeComponent implements OnInit {
  isRefreshing = false;
  showPipelineModal = false;
  showAddMemberModal = false;
  hasPipeline = false;
  isLoading = false;
  currentClass!: Class;
  groupId!: number;
  currentGroup!: GroupDTO;
  currentPipeline: PipelineDTO | null = null;
  etapesWithStatus: EtapeStatus[] = [];
  members: UserWithRoleDTO[] = [];
  contributors: { name: string; rank: string; commits: number }[] = [];
  currentRepositoryName!: string;
  currentRepositoryUrl?: string;

  newMember: UserWithRoleDTO = { id: 0, email: '', gitRole: '', nom: '' };
  newPipeline: PipelineDTO = { nom: '', groupId: 0, etapes: [{ nom: 'Stage 1', consigne: '', deadline: '' }] };
  currentRoute: string = 'groups'; // Add this property

  // ... constructor and other methods ...

  navigate(route: string) {
    this.currentRoute = route;
    this.router.navigate([`/${route}`]);
  }
  constructor(
    private router: Router,
    private pipelineService: PipelineService,
    private route: ActivatedRoute,
    private groupService: GroupsService,
    private classService: ClassesService,
    private usersService: UsersService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || isNaN(+id)) {
      this.router.navigate(['/groupes']);
      return;
    }
    this.groupId = +id;
    this.newPipeline.groupId = this.groupId;
    this.loadGroupDetails();
  }

  loadGroupDetails() {
    this.isLoading = true;
    this.groupService.getGroupById(this.groupId).subscribe({
      next: (data) => {
        this.currentGroup = data;
        this.currentRepositoryName = this.currentGroup.gitRepoName || '';
        this.currentRepositoryUrl = this.currentGroup.gitRepoUrl;
        this.classService.getClasseById(this.currentGroup.classeId).subscribe({
          next: (classData) => (this.currentClass = classData),
          error: (err: HttpErrorResponse) => {
            console.error('Error loading class:', err);
            alert(`Failed to load class details: ${err.error?.message || 'Unknown error'}`);
          },
        });
        this.loadMembers();
        this.loadPipelines();
        this.loadContributors();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading group details:', err);
        alert(`Failed to load group details: ${err.error?.message || 'Unknown error'}`);
        this.isLoading = false;
        this.router.navigate(['/groupes']);
      },
    });
  }

  loadMembers() {
    this.groupService.getGroupMembers(this.groupId).subscribe({
      next: (members) => (this.members = members),
      error: (err: HttpErrorResponse) => {
        console.error('Error loading members:', err);
        alert(`Failed to load members: ${err.error?.message || 'Unknown error'}`);
      },
    });
  }

  loadPipelines() {
    this.pipelineService.getPipelineByGroupId(this.groupId).subscribe({
      next: (pipelines) => {
        if (pipelines) {
          this.currentPipeline = pipelines;
          this.processEtapes();
          this.hasPipeline = true;
        } else {
          this.hasPipeline = false;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading pipelines:', err);
        this.hasPipeline = false;
        alert(`Failed to load pipeline: ${err.error?.message || 'Unknown error'}`);
      },
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
    if (!this.currentPipeline?.etapes) {
      this.etapesWithStatus = [];
      return;
    }
    this.etapesWithStatus = this.currentPipeline.etapes.map((etape, index) => {
      const today = new Date();
      const deadline = new Date(etape.deadline);
      let status: 'pending' | 'active' | 'completed' = 'pending';
      let type: 'etape' | 'milestone' | 'final' = 'etape';

      if (index === 0) status = 'active';
      else if (deadline < today) status = 'completed';

      if (index === this.currentPipeline!.etapes.length - 1) type = 'final';
      else if (etape.nom.toLowerCase().includes('milestone')) type = 'milestone';

      return { ...etape, status, type };
    });
  }

  getDaysRemainingText(deadline: string): string {
    if (!deadline) return '';
    const daysRemaining = this.getDaysRemaining(deadline);
    return daysRemaining >= 0 ? `${daysRemaining} jours restants` : `En retard de ${Math.abs(daysRemaining)} jours`;
  }

  isOverdueText(deadline: string): boolean {
    return this.getDaysRemaining(deadline) < 0;
  }



  showSettings() {
    alert('Settings functionality to be implemented');
  }

  editGroup() {
    this.router.navigate(['/update-group', this.groupId]);
  }

  viewSprint(etape: EtapeStatus) {
    this.router.navigate([`/detailssprint`, etape.id]);
  }

  openAddMemberModal() {
    this.showAddMemberModal = true;
    this.resetNewMember();
  }

  closeAddMemberModal() {
    this.showAddMemberModal = false;
  }

  resetNewMember() {
    this.newMember = { id: 0, email: '', gitRole: '', nom: '' };
  }

  addMemberToGroup() {
    if (!this.newMember.email || !this.isValidEmail(this.newMember.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!this.newMember.gitRole) {
      alert('Please select a Git role.');
      return;
    }

    this.isLoading = true;
    this.usersService.getUserByEmail(this.newMember.email).subscribe({
      next: (user) => {
        if (!user || !user.id) {
          this.isLoading = false;
          alert('User not found for this email.');
          return;
        }

        this.newMember.id = user.id;
        this.newMember.nom = user.nom || this.newMember.email.split('@')[0];

        if (this.members.some(m => m.email === this.newMember.email)) {
          this.isLoading = false;
          alert('This user is already a member of the group.');
          return;
        }

        const updatedGroup: GroupDTO = {
          ...this.currentGroup,
          members: [...this.currentGroup.members || [], this.newMember],
        };

        this.groupService.updateGroup(this.groupId, updatedGroup).subscribe({
          next: () => {
            this.members.push(this.newMember);
            this.closeAddMemberModal();
            this.isLoading = false;
            alert(`Member ${this.newMember.email} added successfully!`);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error adding member:', err);
            this.isLoading = false;
            alert(`Failed to add member: ${err.error?.message || 'Unknown error'}`);
          },
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching user:', err);
        this.isLoading = false;
        alert(`User not found or error fetching user: ${err.error?.message || 'Unknown error'}`);
      },
    });
  }

  editMember(member: UserWithRoleDTO) {
    alert(`Edit member: ${member.nom}`);
  }

  removeMember(member: UserWithRoleDTO) {
    if (confirm(`Are you sure you want to remove ${member.nom}?`)) {
      this.isLoading = true;
      const updatedGroup: GroupDTO = {
        ...this.currentGroup,
        members: this.currentGroup.members.filter(m => m.email !== member.email),
      };
      
      this.groupService.updateGroup(this.groupId, updatedGroup).subscribe({
        next: () => {
          this.members = this.members.filter(m => m.email !== member.email);
          this.isLoading = false;
          alert(`Member ${member.nom} removed successfully!`);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error removing member:', err);
          this.isLoading = false;
          alert(`Failed to remove member: ${err.error?.message || 'Unknown error'}`);
        },
      });
    }
  }

  refreshContributions() {
    this.isRefreshing = true;
    setTimeout(() => {
      this.isRefreshing = false;
      this.loadContributors();
      alert('Contributions refreshed!');
    }, 2000);
  }

  addRepository() {
    alert('Add repository functionality to be implemented');
  }

  viewRepository() {
    this.router.navigate(['/repository-viewer'], { queryParams: { repoUrl: this.currentGroup.gitRepoUrl } });
  }

  hoverRow(member: UserWithRoleDTO, event: MouseEvent) {
    const row = event.currentTarget as HTMLElement;
    this.renderer.setStyle(row, 'transform', 'translateX(4px)');
  }

  unhoverRow(member: UserWithRoleDTO, event: MouseEvent) {
    const row = event.currentTarget as HTMLElement;
    this.renderer.setStyle(row, 'transform', 'translateX(0)');
  }

  openPipelineModal() {
    this.showPipelineModal = true;
    this.resetNewPipeline();
  }

  closePipelineModal() {
    this.showPipelineModal = false;
  }

  resetNewPipeline() {
    this.newPipeline = { nom: '', groupId: this.groupId, etapes: [{ nom: 'Stage 1', consigne: '', deadline: '' }] };
  }

  addEtapeToPipeline() {
    const etapeNumber = this.newPipeline.etapes.length + 1;
    this.newPipeline.etapes.push({ nom: `Stage ${etapeNumber}`, consigne: '', deadline: '' });
  }

  removeEtape(index: number) {
    if (this.newPipeline.etapes.length > 1) this.newPipeline.etapes.splice(index, 1);
  }

  createPipeline() {
    if (!this.newPipeline.nom.trim()) {
      alert('Pipeline name is required.');
      return;
    }
    if (!this.newPipeline.etapes.every(etape => etape.nom.trim() && etape.deadline)) {
      alert('All stages must have a name and deadline.');
      return;
    }

    this.isLoading = true;
    this.pipelineService.createPipeline(this.newPipeline).subscribe({
      next: (createdPipeline) => {
        this.currentPipeline = createdPipeline;
        this.processEtapes();
        this.hasPipeline = true;
        this.closePipelineModal();
        this.isLoading = false;
        alert(`Pipeline "${createdPipeline.nom}" created successfully!`);
        this.resetNewPipeline();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error creating pipeline:', err);
        alert(`Failed to create pipeline: ${err.error?.message || 'Unknown error'}`);
        this.isLoading = false;
      },
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(navigator.language);
  }

  isOverdue(deadline: string): boolean {
    if (!deadline) return false;
    return this.getDaysRemaining(deadline) < 0;
  }

  getDaysRemaining(deadline: string): number {
    if (!deadline) return 0;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}