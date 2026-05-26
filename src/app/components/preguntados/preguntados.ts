import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResultadosService } from '../../services/resultados.service';
import { AuthService } from '../../services/auth.service';
import { supabase } from '../../supabase.client';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css',
})
export class PreguntadosComponent {

  api = inject(HttpClient);
  resultadosService = inject(ResultadosService);
  authService = inject(AuthService);

  usuario: any = null;

  preguntas = signal<any[]>([]);
  preguntaActualIndex = signal(0);

  preguntaActual = signal<any>(null); // 🔥 FIX IMPORTANTE

  opciones = signal<string[]>([]);
  seleccionada = signal<string | null>(null);

  aciertos = signal(0);
  finalizado = signal(false);

  totalPreguntas = 5;

  tiempoInicio = Date.now();

  constructor() {
    this.cargarUsuario();
    this.cargarPreguntas();
  }

  async cargarUsuario() {
    const { data } = await supabase.auth.getUser();

    const email = data.user?.email;
    if (!email) return;

    this.usuario = await this.authService.getProfile(email);
  }

  cargarPreguntas() {
    this.api
      .get<any>('https://opentdb.com/api.php?amount=5&type=multiple')
      .subscribe((data) => {
        this.preguntas.set(data.results);
        this.armarPregunta();
      });
  }

  armarPregunta() {
    const pregunta = this.preguntas()[this.preguntaActualIndex()];

    if (!pregunta) {
      this.finalizarJuego();
      return;
    }

    this.preguntaActual.set(pregunta); // 🔥 FIX

    const opcionesMezcladas = [
      pregunta.correct_answer,
      ...pregunta.incorrect_answers
    ].sort(() => Math.random() - 0.5);

    this.opciones.set(opcionesMezcladas);
    this.seleccionada.set(null);
  }

  elegir(opcion: string) {
    const pregunta = this.preguntaActual();

    this.seleccionada.set(opcion);

    if (opcion === pregunta.correct_answer) {
      this.aciertos.update(v => v + 1);
    }

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

  reiniciar() {
    this.aciertos.set(0);
    this.preguntaActualIndex.set(0);
    this.finalizado.set(false);
    this.tiempoInicio = Date.now();

    this.cargarPreguntas();
  }

  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}