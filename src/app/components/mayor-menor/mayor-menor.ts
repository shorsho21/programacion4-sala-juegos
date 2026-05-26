import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResultadosService } from '../../services/resultados.service';
import { AuthService } from '../../services/auth.service';
import { supabase } from '../../supabase.client';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css',
})

export class MayorMenorComponent {

  resultadosService=
  inject(
    ResultadosService
  );

  authService=
  inject(
    AuthService
  );

  api=
  inject(
    HttpClient
  );


  usuario:any=null;


  deckId=
  signal('');

  cartaActual=
  signal<any>(
    null
  );

  aciertos=
  signal(
    0
  );

  terminado=
  signal(
    false
  );


  valores:any={

    ACE:1,
    "2":2,
    "3":3,
    "4":4,
    "5":5,
    "6":6,
    "7":7,
    "8":8,
    "9":9,
    "10":10,
    JACK:11,
    QUEEN:12,
    KING:13

  };


  constructor(){

    this.cargarUsuario();

    this.iniciarJuego();

  }



  async cargarUsuario(){

    const {

      data

    }

    =

    await supabase
    .auth
    .getUser();


    const email=

    data.user?.email;


    if(
      !email
    ){

      return;

    }


    this.usuario=

    await this
    .authService
    .getProfile(
      email
    );

  }



  iniciarJuego(){

    this.api

    .get<any>(

      'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'

    )

    .subscribe(

      data=>{

        this.deckId.set(
          data.deck_id
        );

        this.sacarCarta();

      }

    );

  }



  sacarCarta(){

    this.api

    .get<any>(

      `https://deckofcardsapi.com/api/deck/${this.deckId()}/draw/?count=1`

    )

    .subscribe(

      data=>{

        this.cartaActual.set(

          data.cards[0]

        );

      }

    );

  }



  elegir(
    eleccion:
    'mayor'
    |
    'menor'
  ){

    this.api

    .get<any>(

      `https://deckofcardsapi.com/api/deck/${this.deckId()}/draw/?count=1`

    )

    .subscribe(

      data=>{

        const nuevaCarta=
        data.cards[0];


        const actual=

        this.valores[
          this.cartaActual().value
        ];


        const siguiente=

        this.valores[
          nuevaCarta.value
        ];


        let acerto=
        false;


        if(

          eleccion==='mayor'

          &&

          siguiente>actual

        ){

          acerto=
          true;

        }


        if(

          eleccion==='menor'

          &&

          siguiente<actual

        ){

          acerto=
          true;

        }


        if(
          acerto
        ){

          this.aciertos.update(

            x=>x+1

          );

          this.cartaActual.set(
            nuevaCarta
          );

        }

        else{

          this.terminado.set(
            true
          );

          this.guardarResultado();

        }

      }

    );

  }



  async guardarResultado(){

    if(
      !this.usuario
    ){

      return;

    }


    await this
    .resultadosService
    .guardarResultado({

      usuario:

      this.usuario.nombre+

      ' '+

      this.usuario.apellido,


      juego:

      'Mayor-Menor',


      puntaje:

      this.aciertos(),


      fecha:

      new Date()

    });

  }



  reiniciar(){

    this.aciertos.set(
      0
    );

    this.terminado.set(
      false
    );

    this.iniciarJuego();

  }

}