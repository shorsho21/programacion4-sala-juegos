import { Routes } from '@angular/router';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { QuienSoyComponent } from './components/quien-soy/quien-soy.component';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: BienvenidaComponent },

  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard], // 👈 AQUÍ
  },

  {
    path: 'registro',
    component: RegistroComponent,
    canActivate: [guestGuard], // 👈 AQUÍ
  },

  { path: 'quien-soy', component: QuienSoyComponent },

  { path: '**', redirectTo: 'home' },
];
