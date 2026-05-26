import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {

  // 💾 guardar resultado
  async guardarResultado(resultado: any) {

    const { data, error } = await supabase
      .from('resultados')
      .insert([resultado]);

    if (error) {
      console.log('Error insertando resultado:', error);
      return null;
    }

    return data;
  }

  // 📊 obtener todos los resultados
  async obtenerResultados() {

    const { data, error } = await supabase
      .from('resultados')
      .select('*');

    if (error) {
      console.log('Error obteniendo resultados:', error);
      return [];
    }

    return data;
  }

  // 🏆 (OPCIONAL PRO) obtener ordenados por puntaje
  async obtenerResultadosOrdenados() {

    const { data, error } = await supabase
      .from('resultados')
      .select('*')
      .order('puntaje', { ascending: false });

    if (error) {
      console.log('Error obteniendo ordenados:', error);
      return [];
    }

    return data;
  }
}