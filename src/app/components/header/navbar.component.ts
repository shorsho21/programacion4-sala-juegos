import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  private authService = inject(AuthService);

  user = signal<any>(null);

  constructor() {
    this.loadUser();

    // 🔥 clave: sincroniza con cambios del auth service
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