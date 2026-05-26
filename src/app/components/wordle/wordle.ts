import { Component, inject, signal } from '@angular/core';

import { ResultadosService } from '../../services/resultados.service';
import { AuthService } from '../../services/auth.service';
import { supabase } from '../../supabase.client';

@Component({
  selector: 'app-wordle',
  standalone: true,
  imports: [],
  templateUrl: './wordle.html',
  styleUrl: './wordle.css'
})
export class Wordle {

  // 🔥 servicios
  resultadosService = inject(ResultadosService);
  authService = inject(AuthService);

  usuario: any = null;

  // ⏱️ tiempo
  tiempoInicio = Date.now();

  // 🎯 juego
  palabras = [
    'CASAS',
    'PERRO',
    'LIBRO',
    'NIEVE',
    'MANGO',
    'PLATO',
    'LIMON',
    'GATOS',
    'FUEGO',
    'NUBES'
  ];

  palabraSecreta = signal('');
  intentos = signal<{ palabra: string, resultado: string[] }[]>([]);
  intentoActual = signal('');
  juegoTerminado = signal(false);
  gano = signal(false);

  letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  constructor() {
    this.cargarUsuario();
    this.iniciarJuego();
  }

  // 👤 usuario
  async cargarUsuario() {
    const { data } = await supabase.auth.getUser();
    const email = data.user?.email;

    if (!email) return;

    this.usuario = await this.authService.getProfile(email);
  }

  // 🎮 iniciar juego
  iniciarJuego() {
    const random =
      this.palabras[Math.floor(Math.random() * this.palabras.length)];

    this.palabraSecreta.set(random);
    this.intentos.set([]);
    this.intentoActual.set('');
    this.juegoTerminado.set(false);
    this.gano.set(false);

    this.tiempoInicio = Date.now();
  }

  // ⌨️ letras
  agregarLetra(letra: string) {
    if (this.juegoTerminado()) return;
    if (this.intentoActual().length >= 5) return;

    this.intentoActual.update(v => v + letra);
  }

  borrarLetra() {
    this.intentoActual.update(v => v.slice(0, -1));
  }

  // 🚀 enviar intento
  async enviar() {

    const intento = this.intentoActual().trim().toUpperCase();

    if (intento.length !== 5) return;

    const resultado = this.evaluarIntento(intento);

    this.intentos.update(v => [
      ...v,
      { palabra: intento, resultado }
    ]);

    this.intentoActual.set('');

    // 🎉 GANÓ
    if (intento === this.palabraSecreta()) {
      this.gano.set(true);
      this.juegoTerminado.set(true);

      await this.guardarResultado();
      return;
    }

    // 💀 PERDIÓ
    if (this.intentos().length >= 5) {
      this.juegoTerminado.set(true);

      await this.guardarResultado();
    }
  }

  // 🧠 lógica Wordle
  evaluarIntento(intento: string) {

    const secreta = this.palabraSecreta();
    const resultado: ('correcta' | 'presente' | 'incorrecta')[] = [];

    const letrasSecreta = secreta.split('');
    const usado = Array(5).fill(false);

    // 🟩 verdes
    for (let i = 0; i < 5; i++) {
      if (intento[i] === letrasSecreta[i]) {
        resultado[i] = 'correcta';
        usado[i] = true;
      }
    }

    // 🟨 amarillos / 🟥 rojos
    for (let i = 0; i < 5; i++) {

      if (resultado[i]) continue;

      const letra = intento[i];

      const index = letrasSecreta.findIndex(
        (l, j) => l === letra && !usado[j]
      );

      if (index !== -1) {
        resultado[i] = 'presente';
        usado[index] = true;
      } else {
        resultado[i] = 'incorrecta';
      }
    }

    return resultado;
  }

  // 💾 guardar resultado
  async guardarResultado() {

    if (!this.usuario) return;

    const tiempo = Math.floor((Date.now() - this.tiempoInicio) / 1000);
    const intentosUsados = this.intentos().length;

    let puntaje = 0;

    if (this.gano()) {
      puntaje = 100 - (intentosUsados * 10) - tiempo;
    }

    await this.resultadosService.guardarResultado({
      usuario: this.usuario.nombre + ' ' + this.usuario.apellido,
      juego: 'Wordle',
      puntaje: puntaje,
      intentos: intentosUsados,
      tiempo: tiempo,
      fecha: new Date()
    });
  }

  // 🔁 reiniciar
  reiniciar() {
    this.iniciarJuego();
  }
}