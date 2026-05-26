import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from '../../services/github.service';
import { GitHubProfile } from '../../interfaces/github-profile.interface';
//defino el componente
@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.component.html',
  styleUrls: ['./quien-soy.component.css']
})
//defino la clase del componente
export class QuienSoyComponent {

  //inyecto los servicios
  //servicio de github para traer mi perfil de github
  private githubService = inject(GithubService);
 //defino los signals
  profile = signal<GitHubProfile | null>(null);
  loading = signal(true);
  error = signal('');

  //error, aca debi usar inject en vez de constructor
  //constructor, cargo el perfil de github al iniciar el componente
  constructor() {
    this.loadProfile();
  }
  //funcion para cargar mi perfil de github
  loadProfile() {
    //reseteo los signals
    this.loading.set(true);
    this.error.set('');
    this.profile.set(null);

    //llamo al servicio para traer mi perfil
    this.githubService.getProfile('shorsho21').subscribe({
      next: (data) => {
        //lo guardo en el signal profile y pongo al loading como false
        this.profile.set(data);
        this.loading.set(false);
        //al cambiar el estado de los singals, el compoente se va a actualizar automaticamente
      },
      error: (err) => {
        this.error.set(err?.message || 'Error al cargar perfil');
        this.loading.set(false);
      }
    });
  }
}