import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
//defino componente
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
//defino la clase
export class NavbarComponent {

  //inyecto el auth
  private authService = inject(AuthService);
  //defino un signal para el user
  user = signal<any>(null);

  //error, no tengo que usar constructor, tengo que usar inject
  constructor() {
    //cargo el usuario
    this.loadUser();

    // sincroniza con cambios del auth service
    effect(() => {
      const currentUser = this.authService.user?.();
      this.user.set(currentUser);
    });
  }

  async loadUser() {
    const sessionUser = await this.authService.getUser();
    this.user.set(sessionUser);
  }

  async logout() {
    await this.authService.logout();
    this.user.set(null);
  }
}