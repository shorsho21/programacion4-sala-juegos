import { Component, inject, signal } from '@angular/core';

import { ResultadosService } from '../../services/resultados.service';
import { AuthService } from '../../services/auth.service';
import { supabase } from '../../supabase.client';
//inicio el componente
@Component({
  selector: 'app-wordle',
  standalone: true,
  imports: [],
  templateUrl: './wordle.html',
  styleUrl: './wordle.css'
})
//inicio la clase
export class Wordle {

  //  servicios
  resultadosService = inject(ResultadosService);
  authService = inject(AuthService);

  usuario: any = null;

  // ⏱ tiempo
  tiempoInicio = Date.now();

  //  lista de palabras para el juego
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
  //signals
  palabraSecreta = signal('');
  intentos = signal<{ palabra: string, resultado: string[] }[]>([]);
  intentoActual = signal('');
  juegoTerminado = signal(false);
  gano = signal(false);
  //lista de letras para mostrar el teclado
  letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  constructor() {
    this.cargarUsuario();
    this.iniciarJuego();
  }

  //  usuario
  async cargarUsuario() {
    const { data } = await this.authService.getUserDb();
    console.log(data.user);
    const email = data.user?.email;

    if (!email) return;

    this.usuario = await this.authService.getProfile(email);
  }

  //  iniciar juego
  iniciarJuego() {
    //elijo una palabra al azar de la lista
    const random =
      this.palabras[Math.floor(Math.random() * this.palabras.length)];
      console.log(random);
    //seteo la palabra secreta y reseteo los intentos y el intento actual
    this.palabraSecreta.set(random);
    this.intentos.set([]);
    this.intentoActual.set('');
    this.juegoTerminado.set(false);
    this.gano.set(false);
    //defino tiempo de inicio
    this.tiempoInicio = Date.now();
  }

  //  letras
  agregarLetra(letra: string) {
    //si el juego ya termino return
    if (this.juegoTerminado()) return;
    //si el intento actual ya tiene 5 letras return
    if (this.intentoActual().length >= 5) return;
    //se agrega la letra al intento actual
    this.intentoActual.update(v => v + letra);
  }

  borrarLetra() {
    this.intentoActual.update(v => v.slice(0, -1));
  }

  //  enviar intento
  async enviar() {
    //mayusculas y trim para evitar errores de espacios o minusculas
    const intento = this.intentoActual().trim().toUpperCase();

    if (intento.length !== 5) return;

    //evaluo si esta resuelto
    const resultado = this.evaluarIntento(intento);

    this.intentos.update(v => [
      ...v,
      { palabra: intento, resultado }
    ]);

    this.intentoActual.set('');

    // GANO
    if (intento === this.palabraSecreta()) {
      this.gano.set(true);
      this.juegoTerminado.set(true);

      await this.guardarResultado();
      return;
    }

    // PERDIO
    if (this.intentos().length >= 5) {
      this.juegoTerminado.set(true);

      await this.guardarResultado();
    }
  }

  //  Wordle logica
  evaluarIntento(intento: string) {
    //obtengo la palabra secreta y la separo en letras
    const secreta = this.palabraSecreta();
    const resultado: ('correcta' | 'presente' | 'incorrecta')[] = [];

    const letrasSecreta = secreta.split('');
    //evita contar letras dos veces
    const usado = Array(5).fill(false);

    // verdes, si la letra esta en la posicion correcta es correcta
    for (let i = 0; i < 5; i++) {
      if (intento[i] === letrasSecreta[i]) {
        resultado[i] = 'correcta';
        usado[i] = true;
      }
    }
    //si la letra esta en la palabra pero en otra posicion es presente, sino incorrecta.
    // 🟨 amarillos / 🟥 rojos
    for (let i = 0; i < 5; i++) {
      //si ya es correcta, continua a la siguiente letra
      if (resultado[i]) continue;

      const letra = intento[i];
      //busco la letra en la palabra secreta que no haya sido usada todavia
      const index = letrasSecreta.findIndex(
        //si la letra es igual y no fue usada, devuelve el indice, sino -1
        (l, j) => l === letra && !usado[j]
      );
      //si la letra esta en la palabra, pero en otra posicion, es presente, sino es incorrecta
      if (index !== -1) {
        resultado[i] = 'presente';
        usado[index] = true;
      } else {
        resultado[i] = 'incorrecta';
      }
    }

    return resultado;
  }

  //  guardar resultado
  async guardarResultado() {

    if (!this.usuario) return;
    //
    const tiempo = Math.floor((Date.now() - this.tiempoInicio) / 1000);
    const intentosUsados = this.intentos().length;

    let puntaje = 0;
    //calculo puntaje si gano
    if (this.gano()) {
      puntaje = 100 - (intentosUsados * 10);
    }

    //guardo resultado en la base de datos usando el servicio resultadosService
    await this.resultadosService.guardarResultado({
      usuario: this.usuario.nombre + ' ' + this.usuario.apellido,
      juego: 'Wordle',
      puntaje: puntaje,
      intentos: intentosUsados,
      tiempo: tiempo,
      fecha: new Date()
    });
  }

  // reiniciar
  reiniciar() {
    this.iniciarJuego();
  }
}