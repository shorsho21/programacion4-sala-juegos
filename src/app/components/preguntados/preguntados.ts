import { Component, inject, signal } from '@angular/core';
import { ResultadosService } from '../../services/resultados.service';
import { AuthService } from '../../services/auth.service';
import { supabase } from '../../supabase.client';
import { PreguntadosService } from '../../services/preguntados.service';

//inicia componentee
@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css',
})
//defino la class
export class PreguntadosComponent {
  //inyecto los servicios
  resultadosService = inject(ResultadosService);
  authService = inject(AuthService);
  preguntadosService = inject(PreguntadosService);

  //defino usuario y signals
  usuario: any = null;
  preguntas = signal<any[]>([]);
  preguntaActualIndex = signal(0);
  preguntaActual = signal<any>(null);
  opciones = signal<string[]>([]);
  seleccionada = signal<string | null>(null);
  aciertos = signal(0);
  finalizado = signal(false);

  //defino el total de preguntas a responder
  totalPreguntas = 5;
  //defino el tiempo de inicio
  tiempoInicio = Date.now();

  constructor() {
    this.cargarUsuario();
    this.cargarPreguntas();
  }

  async cargarUsuario() {
    //verifico la sesion actual y obtengo el email del usuario y lo cargo a this.usuario
    const { data } = await this.authService.getUserDb();
    console.log(data);
    const email = data.user?.email;
    if (!email) return;
    this.usuario = await this.authService.getProfile(email);
  }

  //cargo las preguntas desde el service
  cargarPreguntas() {
    this.preguntadosService.obtenerPreguntas().subscribe((data) => {
      this.preguntas.set(data.results);
      this.armarPregunta();
    });
  }

  armarPregunta() {
    //obtengo la pregunta actual segun el indice y la cargo
    const pregunta = this.preguntas()[this.preguntaActualIndex()];

    if (!pregunta) {
      this.finalizarJuego();
      return;
    }

    this.preguntaActual.set(pregunta);

    const opcionesMezcladas = [pregunta.correct_answer, ...pregunta.incorrect_answers].sort(
      () => Math.random() - 0.5,
    );

    this.opciones.set(opcionesMezcladas);
    this.seleccionada.set(null);
  }

  elegir(opcion: string) {
    //cargo pregunta actual
    const pregunta = this.preguntaActual();
    //cargo respuesta seleccionada
    this.seleccionada.set(opcion);

    //si la opcion elegida es igual, aumento el contador
    if (opcion === pregunta.correct_answer) {
      this.aciertos.update((v) => v + 1);
    }

    //espero un momento y cargo la siguiente pregunta. Si pase el limite finaliza el juego
    setTimeout(() => {
      const siguiente = this.preguntaActualIndex() + 1;

      if (siguiente >= this.totalPreguntas) {
        this.finalizarJuego();
      } else {
        this.preguntaActualIndex.set(siguiente);
        this.armarPregunta();
      }
    }, 600);
  }

  tiempoFinal() {
    return Math.floor((Date.now() - this.tiempoInicio) / 1000);
  }

  async finalizarJuego() {
    this.finalizado.set(true);
    await this.guardarResultado();
  }

  //guardo el resultado con el service
  async guardarResultado() {
    if (!this.usuario) return;

    await this.resultadosService.guardarResultado({
      usuario: this.usuario.nombre + ' ' + this.usuario.apellido,
      juego: 'Preguntados',
      puntaje: this.aciertos(),
      tiempo: this.tiempoFinal(),
      fecha: new Date(),
    });
  }

  //reseteo los signals
  reiniciar() {
    this.aciertos.set(0);
    this.preguntaActualIndex.set(0);
    this.finalizado.set(false);
    this.tiempoInicio = Date.now();

    this.cargarPreguntas();
  }

  //funcion para decodificar los caracteres especiales que traigo de la api
  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}
