import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
//Iniciamos el componente de bienvenida
@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
//Declaramos la clase del componente de bienvenida
export class BienvenidaComponent implements OnInit {

  //Inyectamos los servicios de auth y del routerr
  private authService = inject(AuthService);
  private router = inject(Router);

  // defino las se;ales para el usuario, su perfil y estado de carga
  user = signal<any>(null);        
  profile = signal<any>(null);     
  loading = signal(true);

  // cuando inicia el componente, verifico si el usuario ya esta autenticado y su perfil cargado
  async ngOnInit() {
    try {

      // usuario autenticado (Supabase Auth)
      const authUser = await this.authService.getUser();

      this.user.set(authUser);

      // si existe usuario, traemos su perfil de la DB
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

  //  logout
  async cerrarSesion() {
    try {
      //cierro sesion del usuario
      await this.authService.logout();
      // limpio los signals de usuario y perfil
      this.user.set(null);
      this.profile.set(null);
      //redirecciono a la ruta home
      this.router.navigate(['/home']);

    } catch (error) {
      console.error(error);
    }
  }

  // navegación a juegos
  irAJuego(ruta: string) {
    this.router.navigate([ruta]);
  }
}