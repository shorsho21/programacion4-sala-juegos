import { Routes } from '@angular/router';
import { BienvenidaComponent } from './bienvenida.component';
import { LoginComponent } from './login.component';
import { RegistroComponent } from './registro.component';
import { QuienSoyComponent } from './quien-soy.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: BienvenidaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'quien-soy', component: QuienSoyComponent },
  { path: '**', redirectTo: 'home' }
];
