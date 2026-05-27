import { Component, inject, signal } from '@angular/core';
import { ResultadosService } from '../../services/resultados.service';
import { AuthService } from '../../services/auth.service';
import { supabase } from '../../supabase.client';

//inicio el componente
@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
//defino la clase
export class AhorcadoComponent {
  //inyecto los servicios necesarios
  resultadosService = inject(ResultadosService);
  authService = inject(AuthService);

  usuario: any = null;

  //cargo la lista de palabras
  palabras = [
    'ANGULAR',
    'FIREBASE',
    'TYPESCRIPT',
    'PROGRAMACION',
    'JAVASCRIPT',
    'COMPONENTE',
    'DESARROLLO',
    'SIGNALS',
    'SERVICIO',
  ];
  //lista de letras
  abecedario = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  //defino los signals
  palabra = signal('');
  letrasSeleccionadas = signal<string[]>([]);
  errores = signal(0);
  juegoTerminado = signal(false);
  gano = signal(false);

  tiempoInicio = Date.now();

  constructor() {
    this.cargarUsuario();
    this.iniciarJuego();
  }

  async cargarUsuario() {
    //obtengo el usuario actual logueado
    const { data } = await this.authService.getUserDb();
    console.log(data);
    //si no hay usuario entonces no hago nada
    const email = data.user?.email;
    if (!email) return;
    //si hay usuario cargo el perfil
    this.usuario = await this.authService.getProfile(email);
  }

  //inicio el juego, hago reset primero
  iniciarJuego() {
    this.palabra.set(
      this.palabras[
        //selecciono una palabra al azar (genero un indice elatorio)
        Math.floor(Math.random() * this.palabras.length)
      ],
    );
    console.log(this.palabra)

    //reseteo los estados
    this.letrasSeleccionadas.set([]);
    this.errores.set(0);
    this.gano.set(false);
    this.juegoTerminado.set(false);
    //defino timepo de inicio
    this.tiempoInicio = Date.now();
    
  }

  seleccionarLetra(letra: string) {
    //si el juego ya termino return
    if (this.juegoTerminado()) return;
    //si la letra ya fue seleccionada hago return
    if (this.letrasSeleccionadas().includes(letra)) return;
    //si no, agrego la letra a las seleccionadas
    this.letrasSeleccionadas.update((l) => [...l, letra]);

    //si la letra seleccionada no esta en la plabra, aumento el contador error
    if (!this.palabra().includes(letra)) {
      this.errores.update((e) => e + 1);
    }

    this.verificarEstado();
  }

  //verifico el estado del juego
  verificarEstado() {
    //verifico si todas las letras de la palabra estan seleccionadas, si cumple gana
    const gano = this.palabra()
      .split('')
      .every((l) => this.letrasSeleccionadas().includes(l));
    //si gano true , seteo el juego como ganado, termino el juego y guardo el resultado
    if (gano) {
      this.gano.set(true);
      this.juegoTerminado.set(true);
      this.guardarResultado();
      return;
    }
    //si los errores son 6 o mas el juego se temrina y se guarda el resultado
    if (this.errores() >= 6) {
      this.gano.set(false);
      this.juegoTerminado.set(true);
      this.guardarResultado();
    }
  }

  //se calcula el tiempo final en segundos
  tiempoFinal() {
    return Math.floor((Date.now() - this.tiempoInicio) / 1000);
  }

  //guardo el resultado en la base de datos
  async guardarResultado() {
    //si no hay usuario return
    if (!this.usuario) return;

    let puntaje = 0;

    //se calcula el puntaje si gano, se resta 10 puntos por cada error
    if (this.gano()) {
      puntaje = Math.max(0, 100 - this.errores() * 10);
    }

    await this.resultadosService.guardarResultado({
      usuario: this.usuario.nombre + ' ' + this.usuario.apellido,
      juego: 'Ahorcado',
      puntaje: puntaje,
      tiempo: this.tiempoFinal(),
      errores: this.errores(),
      cantidad_letras: this.letrasSeleccionadas().length,
      fecha: new Date(),
    });
  }

  //obtengo la palabra visible, si la letra fue seleccionada se muestra, sino se muestra un guion bajo
  obtenerPalabraVisible() {
    return this.palabra()
      .split('')
      .map((l) => (this.letrasSeleccionadas().includes(l) ? l : '_'))
      .join(' ');
  }
}
