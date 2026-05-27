import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { supabase } from '../supabase.client';

export const adminGuard: CanActivateFn = async () => {

  const router = inject(Router);

  const { data:sessionData } =
  await supabase.auth.getSession();

  const session = sessionData.session;

  if(!session){

    router.navigate(['/login']);
    return false;

  }

  const user=session.user;

  const { data }=await supabase
  .from('usuarios')
  .select('rol')
  .eq('id',user.id)
  .single();

  if(data?.rol==='admin'){

    return true;

  }

  router.navigate(['/home']);

  return false;

};