import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  async guardarEncuesta(data: any) {

    const { error } = await supabase
      .from('encuestas')
      .insert([data]);

    if (error) {
      console.error('Error insert encuesta:', error);
      throw error;
    }
  }

  // OBTENER USUARIO CORRECTAMENTE
  async getUser() {
    return await supabase.auth.getUser();
  }

  async getEncuestas(){
    return await supabase.from("encuestas").select("*");
  }
}