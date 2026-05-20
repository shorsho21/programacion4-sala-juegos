import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  // 🧠 STATE
  user = signal<any>(null);        // auth user
  profile = signal<any>(null);     // datos de tu tabla usuarios
  loading = signal(true);

  async ngOnInit() {
    try {

      // 🔐 usuario autenticado (Supabase Auth)
      const authUser = await this.authService.getUser();

      this.user.set(authUser);

      // 👤 si existe usuario, traemos su perfil de la DB
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

  // 🚪 logout
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

  // 🎮 navegación a juegos
  irAJuego(ruta: string) {
    this.router.navigate([ruta]);
  }
}