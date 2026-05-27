import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { supabase } from '../../supabase.client';

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

  // 👑 Admin
  esAdmin = computed(() =>
    this.profile()?.rol === 'admin'
  );

  async ngOnInit() {

    supabase.auth.onAuthStateChange(

      async (_event, session) => {

        const authUser = session?.user ?? null;

        this.user.set(authUser);

        if(authUser?.email){

          try{

            const profile =
            await this.authService.getProfile(
              authUser.email
            );

            this.profile.set(profile);

          }
          catch(error){

            console.error(error);

            this.profile.set(null);

          }

        }
        else{

          this.profile.set(null);

        }

        this.loading.set(false);

        console.log(
          'Bienvenida - User:',
          this.user()
        );

      }

    );

    // cargar estado inicial

    const { data } =
      await supabase.auth.getSession();

    const session = data.session;

    this.user.set(
      session?.user ?? null
    );

    if(session?.user?.email){

      const profile =
      await this.authService.getProfile(
        session.user.email
      );

      this.profile.set(profile);

    }

    this.loading.set(false);

  }

  async cerrarSesion(){

    try{

      await this.authService.logout();

      this.user.set(null);
      this.profile.set(null);

      this.router.navigate(['/home']);

    }
    catch(error){

      console.error(error);

    }

  }

  irAJuego(ruta:string){

    console.log(
      'CLICK OK ->',
      ruta
    );

    this.router.navigate([ruta]);

  }

}