import { Routes } from '@angular/router';

// Guard
import { guestGuard } from './guards/guest.guard';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./components/bienvenida/bienvenida.component')
      .then(m => m.BienvenidaComponent)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component')
      .then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },

  {
    path: 'registro',
    loadComponent: () =>
      import('./components/registro/registro.component')
      .then(m => m.RegistroComponent),
    canActivate: [guestGuard]
  },

  {
    path: 'quien-soy',
    loadComponent: () =>
      import('./components/quien-soy/quien-soy.component')
      .then(m => m.QuienSoyComponent)
  },

  // 🎮 Juegos (protegidos)

  {
    path: 'ahorcado',
    loadComponent: () =>
      import('./components/ahorcado/ahorcado')
      .then(m => m.AhorcadoComponent),
    canActivate: [authGuard]
  },

  {
    path: 'mayor-menor',
    loadComponent: () =>
      import('./components/mayor-menor/mayor-menor')
      .then(m => m.MayorMenorComponent),
    canActivate: [authGuard]
  },

  {
    path: 'chat',
    loadComponent: () =>
      import('./components/chat/chat')
      .then(m => m.ChatComponent),
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: 'home'
  }

];