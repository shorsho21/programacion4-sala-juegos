import { Injectable, signal} from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = signal<any>(null);


  // 🔐 REGISTRO
  async register(email: string, password: string, nombre: string, apellido: string, edad: number) {
    // 1. Crear usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    const user = data.user;

    if (!user) {
      throw new Error('No se pudo crear el usuario en Auth');
    }

    // 2. Guardar datos en tu tabla "usuarios"
    const { error: dbError } = await supabase.from('usuarios').insert([
      {
        id: user.id, // 👈 UUID de Auth
        nombre,
        apellido, // 👈 nuevo campo
        email,
        edad,
      },
    ]);

    if (dbError) throw dbError;

    return user;
  }

  // 🔐 LOGIN
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return data.user;
  }

  // 🔐 LOGOUT

  async logout() {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
    this.user.set(null);
  }

  //GET USER
  async getUser() {
    const { data } = await supabase.auth.getSession();
    return data.session?.user ?? null;
  }

  //GET USER PROFILE
  async getProfile(email: string) {
    const { data, error } = await supabase.from('usuarios').select('*').eq('email', email).single();

    if (error) throw error;

    return data;
  }
}
