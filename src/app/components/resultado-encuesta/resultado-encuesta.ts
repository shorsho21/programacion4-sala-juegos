import { Component, OnInit, signal, inject } from '@angular/core';
import { supabase } from '../../supabase.client';
import {EncuestaService} from '../../services/encuesta.service';
@Component({
  selector: 'app-resultado-encuesta',
  standalone: true,
  imports: [],
  templateUrl: './resultado-encuesta.html',
  styleUrl: './resultado-encuesta.css',
})
export class ResultadoEncuestaComponent implements OnInit {
  //declaracion de los signals
  promedioPuntuacion = signal(0);
  dificultadMasElegida = signal('Sin datos');
  juegoFavorito = signal('Sin datos');
  encuestas = signal<any[]>([]);
  //declaracion de services
  encuestaService = inject(EncuestaService);

  async ngOnInit() {
    //obtengo las encuestas
    const { data, error } = await this.encuestaService.getEncuestas();
    //si hay un error return y muestro el error por consola
    if (error) {
      console.log(error);
      return;
    }
    // si no hay error guardo la encuesta
    const lista = data ?? [];
    //guardo las encuestas en el signal
    this.encuestas.set(lista);
    //si la lista esta vacia hago return
    if (lista.length === 0) {
      return;
    }

    // Puntuacion promedio
    //hago el promedio de la puntuaciones
    const suma = lista.reduce((acc, e) => acc + e.puntuacion, 0);
    this.promedioPuntuacion.set(Number((suma / lista.length).toFixed(1)));

    //  juego favorito
    //obtengo el juego favorito mas elegido
    this.juegoFavorito.set(this.obtenerMasRepetido(lista.map((e) => e.juego_favorito)));

    //  dificultad mas elegida
    this.dificultadMasElegida.set(this.obtenerMasRepetido(lista.map((e) => e.dificultad)));
  }

  obtenerMasRepetido(array: string[]): string {
    const contador: Record<string, number> = {};

    array.forEach((valor) => {
      contador[valor] = (contador[valor] || 0) + 1;
    });

    let mayor = '';

    for (const key in contador) {
      if (!mayor || contador[key] > contador[mayor]) {
        mayor = key;
      }
    }

    return mayor || 'Sin datos';
  }
}
