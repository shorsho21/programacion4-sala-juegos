import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

//defino a la clase guard, protege las rutas login y registro a usuarios que ya iniciaron sesion
export const guestGuard: CanActivateFn = async (route, state) => {
  //inyecto los servicios
  const authService = inject(AuthService);
  const router = inject(Router);
  //con el authservice verifico si el usuario ah iniciado sesion
  const user = await authService.getUser();
  //si el usuario esta iniciado sesion, lo redirecciono al home y retorno false para que no pueda acceder a las rutas login y register
  if (user) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};