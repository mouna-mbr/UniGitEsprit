import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../services/group.service';
import { ClasseService } from '../services/classe.service';
import { SujetService } from '../services/sujet.service';
import { AuthService } from '../services/auth.service';
import { PipelineService } from '../services/pipeline.service';
import { GroupResponse, UserRoleResponse } from '../models/group.model';
import { ClasseResponse } from '../models/classe.model';
import { SujetResponse } from '../models/sujet.model';
import { UserResponse } from '../models/user.model';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EtapeDTO, EtapeStatus, PipelineDTO } from '../models/pipeline.model';
import { formatDate } from '@angular/common';
import { GitRepositoryService } from '../services/git-repository.service';
import { GitCommitDTO, GitCommitRequest } from '../models/git-repository.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../services/user.service'; // <-- ajouté

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
  contributors: { name: string; rank: string; commits: number; gitUsername: string }[] = [];
  repositories: { name: string; url: string }[] = [];
  newMember: UserResponse = { id: 0, firstName: '', lastName: '', role: 'STUDENT', identifiant: '', classe: '', specialite: '', email: '', gitUsername: '', gitAccessToken: '', password: '', createdAt: '' };
  newPipeline: PipelineDTO = { nom: '', groupId: 0, etapes: [{ nom: '', consigne: '', deadline: '' }] };
  currentUser: UserResponse | null = null;

  // cache de tous les users (pour éviter de rappeler sans cesse getAllUsers)
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
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private userService: UserService // <-- injecté
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
        // d'abord charger tous les users (cache) puis mapper les membres
        this.loadAllUsersAndMembers();
        this.loadPipeline();
        this.loadContributors(); // contributors dépendront de members; ok car loadContributors est appelé à la fin mais note: loadContributors utilise members - on rappellera si besoin
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

  /**
   * Charge tous les users depuis l'API (getAllUsers), met en cache this.allUsers,
   * puis remplit this.members en reliant currentGroup.users (qui contient userId,role)
   * aux users complets.
   */
  loadAllUsersAndMembers() {
    this.userService.getAllUsers().subscribe({
      next: (allUsers) => {
        this.allUsers = allUsers || [];
        this.mapMembersFromGroup();
        // Recharger les contributeurs maintenant que members est rempli
        this.loadContributors();
      },
      error: (err) => {
        console.error('Error loading users:', err);
        // même si échec, essayer de mapper avec ce qu'on a (vide)
        this.allUsers = [];
        this.mapMembersFromGroup();
      }
    });
  }

  /**
   * Map currentGroup.users -> this.members en cherchant dans this.allUsers
   */
  mapMembersFromGroup() {
    if (!this.currentGroup) {
      this.members = [];
      return;
    }

    this.members = this.currentGroup.users.map(userRole => {
      const user = this.allUsers.find(u => u.id === userRole.userId);
      // Remonter un objet complet compatible UserResponse même si certains champs manquent
      return {
        id: userRole.userId,
        firstName: user ? user.firstName : '',
        lastName: user ? user.lastName : '',
        role: (userRole.role as 'STUDENT' | 'ADMIN' | 'PROFESSOR') || (user ? user.role : 'STUDENT'),
        identifiant: user ? (user as any).identifiant : '',
        classe: user ? (user as any).classe : '',
        specialite: user ? (user as any).specialite : '',
        email: user ? user.email : '',
        gitUsername: user ? user.gitUsername || '' : '',
        gitAccessToken: user ? user.gitAccessToken || '' : '',
        password: user ? user.password || '' : '',
        createdAt: user ? user.createdAt || '' : ''
      } as UserResponse;
    });
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
    if (!this.currentGroup?.gitRepoUrl) {
      this.contributors = [];
      return;
    }
    this.isRefreshing = true;
    const request: GitCommitRequest = {
      repoUrl: this.currentGroup.gitRepoUrl,
      branch: 'main',
      page: 1,
      perPage: 100
    };
    this.gitService.getCommits(request).subscribe({
      next: (commits: GitCommitDTO[]) => {
        const commitCountByAuthor: { [key: string]: number } = {};
        commits.forEach(commit => {
          const authorName = commit.author.name.toLowerCase(); // normalize
          commitCountByAuthor[authorName] = (commitCountByAuthor[authorName] || 0) + 1;
        });

        this.contributors = Object.entries(commitCountByAuthor)
          .map(([authorName, count]): { name: string; gitUsername: string; commits: number; rank: string } => {
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
          .map((contributor, index) => ({
            ...contributor,
            rank: this.getRankText(index + 1)
          }));

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
    if (!this.currentPipeline || !this.currentPipeline.etapes?.length) {
      this.etapesWithStatus = [];
      return;
    }
    const pipeline = this.currentPipeline;
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

  /**
   * Ajoute un membre côté front :
   * - si l'email existe dans allUsers -> on ajoute ce user au groupe (currentGroup.users + members)
   * - sinon on crée le user via userService.addUser(...) puis on l'ajoute
   *
   * NOTE : Comme tu n'as pas d'API pour ajouter un membre au groupe, on met à jour uniquement côté front.
   * Si tu veux persist, il faudra ajouter un endpoint backend pour mettre à jour le groupe.
   */
  addMemberToGroup() {
    console.log('Add Member to Group clicked with:', this.newMember);
    if (!this.newMember.email || !this.isValidEmail(this.newMember.email) || !this.newMember.role) {
      alert('Please enter a valid email and select a role.');
      return;
    }

    this.isLoading = true;

    // cherche si l'utilisateur existe déjà
    const existing = this.allUsers.find(u => u.email?.toLowerCase() === this.newMember.email.toLowerCase());
    if (existing) {
      // évite les doublons
      const alreadyInGroup = this.currentGroup?.users.some(u => u.userId === existing.id);
      if (alreadyInGroup) {
        alert('User is already a member of the group.');
        this.isLoading = false;
        return;
      }

      // ajouter dans currentGroup.users (pour cohérence) et dans members (affichage)
      this.currentGroup?.users.push({ userId: existing.id, role: this.newMember.role } as any);
      this.members.push({ ...existing, role: this.newMember.role });
      this.closeAddMemberModal();
      this.isLoading = false;
      return;
    }

    // si n'existe pas -> créer via API users (tu as addUser)
    const userToCreate = {
      firstName: this.newMember.firstName,
      lastName: this.newMember.lastName,
      role: this.newMember.role,
      identifiant: this.newMember.identifiant || '',
      classe: this.newMember.classe || '',
      specialite: this.newMember.specialite || '',
      email: this.newMember.email,
      gitUsername: this.newMember.gitUsername || '',
      gitAccessToken: this.newMember.gitAccessToken || '',
      password: this.newMember.password || ''
    };

    this.userService.addUser(userToCreate as any).subscribe({
      next: (createdUser) => {
        // mettre à jour cache et groupe côté front
        this.allUsers.push(createdUser);
        this.currentGroup?.users.push({ userId: createdUser.id, role: createdUser.role } as any);
        this.members.push({ ...createdUser, role: this.newMember.role });
        this.closeAddMemberModal();
        this.isLoading = false;
        alert('Member created and added to group (client-side).');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error creating user:', err);
        this.isLoading = false;
        alert('Failed to create user.');
      }
    });
  }

  editMember(member: UserResponse) {
    console.log('Edit Member clicked for:', member);
    // Ici tu peux ouvrir un modal d'édition ; comme tu n'as pas d'endpoint updateMember pour le groupe,
    // on peut soit modifier localement, soit envoyer update via userService si tu veux modifier le user lui-même.
    alert(`Edit member: ${member.firstName} ${member.lastName}`);
  }

  removeMember(member: UserResponse) {
    console.log('Remove Member clicked for:', member);
    if (!confirm(`Are you sure you want to remove ${member.firstName} ${member.lastName}?`)) {
      return;
    }

    this.isLoading = true;

    // Supprimer de members (affichage)
    this.members = this.members.filter(m => m.id !== member.id);

    // Supprimer de currentGroup.users (cohérence locale)
    if (this.currentGroup) {
      this.currentGroup.users = this.currentGroup.users.filter(u => u.userId !== member.id);
    }

    // Note: pas de persistance back-end ici (pas d'endpoint). Si tu ajoutes un endpoint pour supprimer membre du groupe,
    // il faudra appeler groupService.removeMember(...)
    this.isLoading = false;
  }

  refreshContributions() {
    console.log('Refresh Contributions clicked');
    this.isRefreshing = true;
    this.loadContributors();
  }

  addRepository() {
    console.log('Add Repository clicked');
    alert('Add repository functionality to be implemented');
  }

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

  getRankText(position: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const relevantDigits = position % 100;
    const suffix = (relevantDigits - 20) % 10 > 3 ? suffixes[0] : suffixes[(relevantDigits - 20) % 10 + 1];
    return position + suffix;
  }

  getDefaultAvatar(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://github.com/identicons/default.png';
  }

  getSafeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
