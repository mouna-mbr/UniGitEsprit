import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../services/group.service';
import { ClasseService } from '../services/classe.service';
import { SujetService } from '../services/sujet.service';
import { AuthService } from '../services/auth.service';
import { PipelineService } from '../services/pipeline.service';
import { GitRepositoryService } from '../services/git-repository.service';
import { UserService } from '../services/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { GroupResponse, UserRoleResponse } from '../models/group.model';
import { ClasseResponse } from '../models/classe.model';
import { UserResponse } from '../models/user.model';
import { PipelineDTO, EtapeDTO, EtapeStatus } from '../models/pipeline.model';
import { GitCommitDTO, GitCommitRequest } from '../models/git-repository.model';
import { DemandesService } from '../services/demandes.service';
import { DemandeBDPDTO, DemandeBDPRequest } from '../models/demande.model';
import {Role} from '../models/user.model' 

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {
  isLoading = false;
  showPipelineModal = false;
  showAddMemberModal = false;
  showEditMemberModal = false;
  hasPipeline = false;
  isRefreshing = false;
  isProfessor : boolean | undefined = false
  isAdmin :boolean | undefined = false
  groupId!: number;
  currentGroup!: GroupResponse;
  currentClass: ClasseResponse | null = null;
  currentPipeline: PipelineDTO | null = null;
  etapesWithStatus: EtapeStatus[] = [];
  members: UserResponse[] = [];
  contributors: { name: string; rank: string; commits: number; gitUsername: string }[] = [];
  repositories: { name: string; url: string }[] = [];
  newMember: UserResponse = {
    id: 0, firstName: '', lastName: '', roles: [Role.STUDENT], identifiant: '',
    classe: undefined, specialite: '', email: '', gitUsername: '', gitAccessToken: '',
    password: '', createdAt: ''
  };
  newPipeline: PipelineDTO = { nom: '', groupId: 0, etapes: [{ nom: '', consigne: '', deadline: '' }] };
  currentUser: UserResponse | null = null;

  memberToEdit: UserResponse | null = null;
  newRoleForMember = [''];

  private allUsers: UserResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private classeService: ClasseService,
    private sujetService: SujetService,
    private authService: AuthService,
    private pipelineService: PipelineService,
    private gitService: GitRepositoryService,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private demandeService:DemandesService
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
    this.isAdmin = this.authService.getCurrentUser()?.roles.includes(Role.ADMIN);
    this.isProfessor = this.authService.getCurrentUser()?.roles.includes(Role.PROFESSOR);
  }

  loadGroupDetails() {
    this.isLoading = true;
    this.groupService.getGroupById(this.groupId).subscribe({
      next: (group) => {
        this.currentGroup = group;
        this.repositories = [{ name: group.gitRepoName || 'No Repository', url: group.gitRepoUrl || '' }];
        this.loadClass();
        this.loadAllUsersAndMembers();
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

  loadAllUsersAndMembers() {
    this.userService.getAllUsers().subscribe({
      next: (allUsers) => {
        this.allUsers = allUsers || [];
        this.mapMembersFromGroup();
        this.loadContributors();
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.allUsers = [];
        this.mapMembersFromGroup();
      }
    });
  }

  mapMembersFromGroup() {
    if (!this.currentGroup?.users?.length) {
      this.members = [];
      return;
    }

    this.members = this.currentGroup.users.map((userRole: UserRoleResponse) => {
      const user = this.allUsers.find(u => u.id === userRole.userId);
      return {
        id: userRole.userId,
        firstName: user?.firstName || 'Inconnu',
        lastName: user?.lastName || '',
        roles: userRole.role || (user?.roles || ['STUDENT']),
        identifiant: user?.identifiant || '',
        classe: user?.classe,
        specialite: user?.specialite,
        email: user?.email || '',
        gitUsername: user?.gitUsername || '',
        gitAccessToken: user?.gitAccessToken || '',
        createdAt: user?.createdAt || ''
      } as UserResponse;
    });
  }

  loadPipeline() {
    this.pipelineService.getPipelineByGroupId(this.groupId).subscribe({
      next: (pipeline) => {
        this.currentPipeline = pipeline;
        this.hasPipeline = !!pipeline && pipeline.etapes.length > 0;
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
    if (!this.currentGroup?.gitRepoUrl) {
      this.contributors = [];
      return;
    }
    this.isRefreshing = true;
    const request: GitCommitRequest = { repoUrl: this.currentGroup.gitRepoUrl, branch: 'main', page: 1, perPage: 100 };
    this.gitService.getCommits(request).subscribe({
      next: (commits: GitCommitDTO[]) => {
        const commitCountByAuthor: { [key: string]: number } = {};
        commits.forEach(commit => {
          const authorName = commit.author.name.toLowerCase();
          commitCountByAuthor[authorName] = (commitCountByAuthor[authorName] || 0) ;
        });

        this.contributors = Object.entries(commitCountByAuthor)
          .map(([authorName, count]) => {
            const member = this.members.find(m =>
              (m.gitUsername && m.gitUsername.toLowerCase() === authorName) ||
              (`${m.firstName.toLowerCase()} ${m.lastName.toLowerCase()}` === authorName)
            );
            return {
              name: member ? `${member.firstName} ${member.lastName}` : authorName,
              gitUsername: member?.gitUsername || authorName.split(' ')[0],
              commits: count,
              rank: ''
            };
          })
          .sort((a, b) => b.commits - a.commits)
          .slice(0, 3)
          .map((contributor, index) => ({ ...contributor, rank: this.getRankText(index + 1) }));

        this.isRefreshing = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading contributors:', err);
        this.contributors = [];
        this.isRefreshing = false;
      }
    });
  }

  processEtapes() {
    if (!this.currentPipeline?.etapes?.length) {
      this.etapesWithStatus = [];
      return;
    }
    const pipeline = this.currentPipeline;
    this.etapesWithStatus = pipeline.etapes.map((etape, index) => {
      const today = new Date();
      const deadline = etape.deadline ? new Date(etape.deadline) : new Date();
      let status: 'pending' | 'active' | 'completed' = 'pending';
      if (deadline > today) status = 'active';
      if (deadline < today) status = 'completed';

      let type: 'etape' | 'milestone' | 'final' = 'etape';
      if (index === pipeline.etapes.length - 1) type = 'final';
      else if (etape.nom?.toLowerCase().includes('milestone')) type = 'milestone';

      return { ...etape, status, type, id: etape.id || 0 };
    });
  }

  getDaysRemaining(deadline: string): number {
    if (!deadline) return 0;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysRemainingText(deadline: string): string {
    const days = this.getDaysRemaining(deadline);
    return days >= 0 ? `${days} days remaining` : `Overdue by ${Math.abs(days)} days`;
  }

  isOverdue(deadline: string): boolean {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  }

  isOverdueText(deadline: string): boolean {
    return this.getDaysRemaining(deadline) < 0;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return formatDate(new Date(dateString), 'dd/MM/yyyy', 'en-US');
  }

  editGroup() { this.router.navigate(['/update-group', this.groupId]); }
 
  viewSprint(etape: EtapeStatus) { if (etape.id) this.router.navigate([`/detailssprint/${etape.id}`]); }
  openPipelineModal() {
    this.showPipelineModal = true;
  
    if (this.currentPipeline) {
      // Deep copy to avoid mutation of original object
      this.newPipeline = {
        id: this.currentPipeline.id,
        nom: this.currentPipeline.nom,
        groupId: this.groupId,
        etapes: this.currentPipeline.etapes.map(etape => ({
          id: etape.id,
          nom: etape.nom,
          consigne: etape.consigne,
          deadline: etape.deadline
        }))
      };
    } else {
      // Initialize empty form
      this.newPipeline = {
        nom: '',
        groupId: this.groupId,
        etapes: [{ nom: '', consigne: '', deadline: '' }]
      };
    }
  }
  
  closePipelineModal() { this.showPipelineModal = false; }

  addEtapeToPipeline() { this.newPipeline.etapes.push({ nom: '', consigne: '', deadline: '' }); }
  removeEtape(index: number) { if (this.newPipeline.etapes.length > 1) this.newPipeline.etapes.splice(index, 1); }

  createPipeline() {
    if (!this.newPipeline.nom.trim() || !this.newPipeline.etapes.every(e => e.nom && e.deadline)) {
      alert('Please fill all required fields.');
      return;
    }
    if(this.currentPipeline?.id){
      this.isLoading = true;
      this.pipelineService.updatePipeline(this.currentPipeline.id, this.newPipeline).subscribe({
        next: (updatedPipeline: PipelineDTO) => {
          this.currentPipeline = updatedPipeline;
          this.processEtapes();
          this.closePipelineModal();
          this.isLoading = false;
          alert('Pipeline updated successfully!');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error updating pipeline:', err);
          this.isLoading = false;
          alert(`Error updating pipeline: ${err.status} - ${err.statusText}`);
        }
      });
    }
    this.isLoading = true;
    this.pipelineService.createPipeline(this.newPipeline).subscribe({
      next: (createdPipeline: PipelineDTO) => {
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
        alert(`Error creating pipeline: ${err.status} - ${err.statusText}`);
      }
    });
  }

  openAddMemberModal() { this.showAddMemberModal = true; }
  closeAddMemberModal() { this.showAddMemberModal = false; }

  addMemberToGroup() {
    if (!this.newMember.email || !this.isValidEmail(this.newMember.email) || !this.newMember.roles) {
      alert('Please enter a valid email and select a role.');
      return;
    }
    this.isLoading = true;
    const existing = this.allUsers.find(u => u.email?.toLowerCase() === this.newMember.email.toLowerCase());
    if (!existing) {
      alert('This user does not exist.');
      this.isLoading = false;
      return;
    }
    this.groupService.addMember(this.groupId, { userId: existing.id, role: this.newMember.roles }).subscribe({
      next: (updatedGroup) => { this.currentGroup = updatedGroup; this.mapMembersFromGroup(); this.closeAddMemberModal(); this.isLoading = false; },
      error: (err) => { console.error('Error adding member:', err); this.isLoading = false; }
    });
  }

  openEditMemberModal(member: UserResponse) {
    this.memberToEdit = { ...member };
    this.newRoleForMember = member.roles;
    this.showEditMemberModal = true;
  }

  closeEditMemberModal() {
    this.showEditMemberModal = false;
    this.memberToEdit = null;
    this.newRoleForMember = [''];
  }

  saveMemberRole() {
    if (!this.memberToEdit) return;
    if (!this.newRoleForMember) {
      alert('Please select a valid role.');
      return;
    }
    this.isLoading = true;
    this.groupService.updateMemberRole(this.groupId, this.memberToEdit.id, this.newRoleForMember).subscribe({
      next: (updatedGroup) => {
        this.currentGroup = updatedGroup;
        this.mapMembersFromGroup();
        this.closeEditMemberModal();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating member role:', err);
        this.isLoading = false;
      }
    });
  }

  removeMember(member: UserResponse) {
    if (!confirm(`Remove ${member.firstName} ${member.lastName} from group?`)) return;
    this.isLoading = true;
    this.groupService.removeMember(this.groupId, member.id).subscribe({
      next: (updatedGroup) => {
        this.currentGroup = updatedGroup;
        this.mapMembersFromGroup();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error removing member:', err);
        this.isLoading = false;
      }
    });
  }

  refreshContributions() { this.loadContributors(); }

  viewRepository() {
    if (this.currentGroup?.gitRepoUrl) this.router.navigate(['/repository-viewer'], { queryParams: { repoUrl: this.currentGroup.gitRepoUrl } });
    else alert('No repository URL available for this group.');
  }

  hoverRow(member: UserResponse, event: MouseEvent) { const row = event.currentTarget as HTMLElement; this.renderer.setStyle(row, 'transform', 'translateX(4px)'); }
  unhoverRow(member: UserResponse, event: MouseEvent) { const row = event.currentTarget as HTMLElement; this.renderer.setStyle(row, 'transform', 'translateX(0)'); }

  isValidEmail(email: string): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
  getRankText(position: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const relevantDigits = position % 100;
    const suffix = (relevantDigits - 20) % 10 > 3 ? suffixes[0] : suffixes[(relevantDigits - 20) % 10 + 1];
    return position + suffix;
  }
  showSettings() {
    if (!this.currentGroup || !this.currentUser) {
      console.error('Missing group or user');
      return;
    }

    let curentGroupBdp: DemandeBDPRequest = {
      status: 'PENDING',
      group: this.currentGroup,
      user: this.currentUser||null
    };
    
    this.demandeService.createDemande(curentGroupBdp).subscribe({
      next: (demande) => {
        this.router.navigate(['/demandesGroup']);
      },
      error: (err) => {
        console.error('Error creating demande:', err);
        this.isLoading = false;
        alert(`Error creating demande: ${err.status} - ${err.statusText}`);
      }
    })
     }


  getDefaultAvatar(event: Event): void { const img = event.target as HTMLImageElement; img.src = 'https://github.com/identicons/default.png'; }
  getSafeUrl(url: string): SafeUrl { return this.sanitizer.bypassSecurityTrustUrl(url); }
}