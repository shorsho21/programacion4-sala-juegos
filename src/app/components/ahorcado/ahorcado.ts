import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  ResultadosService
} from '../../services/resultados.service';

import {
  AuthService
} from '../../services/auth.service';

import {
  supabase
} from '../../supabase.client';


@Component({
  selector:'app-ahorcado',
  standalone:true,
  imports:[],
  templateUrl:'./ahorcado.html',
  styleUrl:'./ahorcado.css'
})

export class AhorcadoComponent{

  resultadosService=
  inject(
    ResultadosService
  );

  authService=
  inject(
    AuthService
  );

  usuario:any=null;


  palabras=[

    'ANGULAR',
    'FIREBASE',
    'TYPESCRIPT',
    'PROGRAMACION',
    'JAVASCRIPT',
    'COMPONENTE',
    'DESARROLLO',
    'SIGNALS',
    'SERVICIO'

  ];


  abecedario=
  'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'
  .split('');


  palabra=
  signal('');


  letrasSeleccionadas=
  signal<string[]>([]);


  errores=
  signal(0);


  juegoTerminado=
  signal(false);


  gano=
  signal(false);


  tiempoInicio=
  Date.now();


  constructor(){

    this.cargarUsuario();

    this.iniciarJuego();

  }


  async cargarUsuario(){

    const { data }=

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

    const aleatoria=

    this.palabras[

      Math.floor(

        Math.random()

        *

        this.palabras.length

      )

    ];


    this.palabra.set(
      aleatoria
    );

    this.letrasSeleccionadas.set([]);

    this.errores.set(0);

    this.gano.set(false);

    this.juegoTerminado.set(false);

    this.tiempoInicio=
    Date.now();

  }



  seleccionarLetra(
    letra:string
  ){

    if(
      this.juegoTerminado()
    ){

      return;

    }


    if(

      this
      .letrasSeleccionadas()
      .includes(
        letra
      )

    ){

      return;

    }


    this
    .letrasSeleccionadas
    .update(

      letras=>
      [

        ...letras,
        letra

      ]

    );


    if(

      !this
      .palabra()
      .includes(
        letra
      )

    ){

      this
      .errores
      .update(

        e=>e+1

      );

    }


    this
    .verificarEstado();

  }



  verificarEstado(){

    const gano=

    this
    .palabra()

    .split('')

    .every(

      letra=>

      this
      .letrasSeleccionadas()
      .includes(
        letra
      )

    );


    if(
      gano
    ){

      this.gano.set(
        true
      );

      this.juegoTerminado.set(
        true
      );

      this.guardarResultado();

    }

    else if(

      this.errores()

      >=

      6

    ){

      this.gano.set(
        false
      );

      this.juegoTerminado.set(
        true
      );

      this.guardarResultado();

    }

  }



  async guardarResultado(){

    if(
      !this.usuario
    ){

      return;

    }


    let puntaje=0;


    if(
      this.gano()
    ){

      puntaje=

      (

        100

        -

        (

          this.errores()

          *

          10

        )

      )

      -

      this.tiempoFinal();

    }


    await this
    .resultadosService
    .guardarResultado({

      usuario:

      this.usuario.nombre+

      ' '+

      this.usuario.apellido,


      juego:

      'Ahorcado',


      puntaje:

      puntaje,


      tiempo:

      this.tiempoFinal(),


      errores:

      this.errores(),


      cantidadletras:

      this
      .letrasSeleccionadas()
      .length,


      fecha:

      new Date()

    });

  }



  obtenerPalabraVisible(){

    return this
    .palabra()

    .split('')

    .map(

      letra=>

      this
      .letrasSeleccionadas()
      .includes(
        letra
      )

      ?

      letra

      :

      '_'

    )

    .join(' ');

  }



  tiempoFinal(){

    return Math.floor(

      (

        Date.now()

        -

        this.tiempoInicio

      )

      /

      1000

    );

  }

}