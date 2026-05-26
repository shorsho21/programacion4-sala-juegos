import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Protege rutas para usuarios LOGUEADOS (juegos, chat, etc.)
export const authGuard: CanActivateFn = async (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // verifico usuario logueado
  const user = await authService.getUser();

  // si NO hay usuario, lo mando a login
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};