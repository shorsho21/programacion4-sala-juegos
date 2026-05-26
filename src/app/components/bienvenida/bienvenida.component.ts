import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [],
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css'],
})
export class BienvenidaComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = signal<any>(null);
  profile = signal<any>(null);
  loading = signal(true);

  async ngOnInit() {
    try {
      const authUser = await this.authService.getUser();
      this.user.set(authUser);

      if (authUser?.email) {
        const profile = await this.authService.getProfile(authUser.email);
        this.profile.set(profile);
      }
    } catch (error) {
      console.error(error);
      this.user.set(null);
      this.profile.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  async cerrarSesion() {
    try {
      await this.authService.logout();
      this.user.set(null);
      this.profile.set(null);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error(error);
    }
  }

  irAJuego(ruta: string) {
    console.log('CLICK OK ->', ruta);
    window.location.href = ruta;
  }
}
