import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResultadosService } from '../../services/resultados.service';
import { AuthService } from '../../services/auth.service';
import { supabase } from '../../supabase.client';

import { MayorMenorService } from '../../services/mayor.menor.service';

//inicio el componente
@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css',
})
//defino la clase
export class MayorMenorComponent {
  //inyecto los servicios
  resultadosService = inject(ResultadosService);
  authService = inject(AuthService);
  mayorMenorService = inject(MayorMenorService);

  api = inject(HttpClient);

  //defino usuario y signals
  usuario: any = null;

  deckId = signal('');
  cartaActual = signal<any>(null);
  aciertos = signal(0);
  terminado = signal(false);

  //  tiempo inicio
  tiempoInicio = Date.now();

  valores: any = {
    ACE: 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    JACK: 11,
    QUEEN: 12,
    KING: 13
  };

  constructor() {
    //cargo usuario y inicio el juego
    this.cargarUsuario();
    this.iniciarJuego();
  }

  async cargarUsuario() {
    const { data } = await this.authService.getUserDb();
    console.log(data);

    const email = data.user?.email;

    if (!email) return;

    this.usuario = await this.authService.getProfile(email);
  }

  iniciarJuego() {
    this.tiempoInicio = Date.now(); // reset tiempo

    //obtengo un mazo de cartas y saco la primera carta
    this.mayorMenorService.crearMazo()
      .subscribe(data => {

        //seteo el id del mazo y saco la primera carta
        this.deckId.set(data.deck_id);

        this.sacarCarta();
      });
  }

  //saco una carta del mazo usando el service y la seteo en el signal cartaActual
  sacarCarta() {
    this.mayorMenorService.sacarCarta(this.deckId())
      .subscribe(data => {

        //agarro la primera carta del resultado y la seteo como carta actual
        this.cartaActual.set(data.cards[0]);

      });
  }

  elegir(eleccion: 'mayor' | 'menor') {
    //pido una nueva carta del mazo
    this.mayorMenorService.sacarCarta(this.deckId())
      .subscribe(data => {

        //la carga en nueva carta
        const nuevaCarta = data.cards[0];

        //comparo valor de la carta nuevo con la actual
        const actual = this.valores[this.cartaActual().value];
        const siguiente = this.valores[nuevaCarta.value];

        let acerto = false;

        if (eleccion === 'mayor' && siguiente > actual) acerto = true;
        if (eleccion === 'menor' && siguiente < actual) acerto = true;

        if (acerto) {

          //aumenta el contador de aciertos, setea la nueva carta como actual
          this.aciertos.update(x => x + 1);
          this.cartaActual.set(nuevaCarta);

        } else {

          //si se equivoca, finaliza el juego, se guarda resultado en la base de datos
          this.terminado.set(true);
          this.guardarResultado();

        }

      });
  }

  //  calcular tiempo
  tiempoFinal() {
    return Math.floor((Date.now() - this.tiempoInicio) / 1000);
  }

  //guardar resultado en la base de datos usando el servicio resultadosService
  async guardarResultado() {

    //si no hay usuario return
    if (!this.usuario) return;

    await this.resultadosService.guardarResultado({
      usuario: this.usuario.nombre + ' ' + this.usuario.apellido,
      juego: 'Mayor-Menor',
      puntaje: this.aciertos(),
      tiempo: this.tiempoFinal(),
      fecha: new Date()
    });

  }

  reiniciar() {
    this.aciertos.set(0);
    this.terminado.set(false);
    this.iniciarJuego();
  }
}