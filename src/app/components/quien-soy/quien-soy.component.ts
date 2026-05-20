import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from '../../services/github.service';
import { GitHubProfile } from '../../interfaces/github-profile.interface';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.component.html',
  styleUrls: ['./quien-soy.component.css']
})
export class QuienSoyComponent {

  private githubService = inject(GithubService);

  profile = signal<GitHubProfile | null>(null);
  loading = signal(true);
  error = signal('');

  constructor() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);
    this.error.set('');
    this.profile.set(null);

    this.githubService.getProfile('shorsho21').subscribe({
      next: (data) => {
        this.profile.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message || 'Error al cargar perfil');
        this.loading.set(false);
      }
    });
  }
}