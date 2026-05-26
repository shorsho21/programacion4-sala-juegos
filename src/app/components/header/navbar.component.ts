import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive} from '@angular/router';
//import { AuthService } from '../../services/auth.service';
import { supabase } from '../../supabase.client';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private router = inject(Router);

  user = signal<any>(null);

  ngOnInit() {

    // 🔥 estado inicial
    this.refreshUser();

    // 🔥 ESCUCHA REAL DE SUPABASE
    supabase.auth.onAuthStateChange((_event, session) => {
      this.user.set(session?.user ?? null);
    });
  }

  async refreshUser() {
    const { data } = await supabase.auth.getUser();
    this.user.set(data.user ?? null);
  }

  async logout() {
    await supabase.auth.signOut();

    this.user.set(null);

    this.router.navigate(['/home']);
  }
}