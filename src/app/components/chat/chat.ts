import {
  Component,
  inject,
  signal,
  OnInit,
  OnDestroy
} from '@angular/core';

import { DatePipe } from '@angular/common';
import {
  FormsModule
} from '@angular/forms';

import {
  AuthService
} from '../../services/auth.service';

import {
  ChatService
} from '../../services/chat.service';

import { supabase } from '../../supabase.client';

@Component({
  selector:'app-chat',
  standalone:true,

  imports:[
    FormsModule,
    DatePipe
  ],

  templateUrl:'./chat.html',

  styleUrl:'./chat.css'

})

export class ChatComponent
implements OnInit, OnDestroy {

  authService=
  inject(AuthService);

  chatService=
  inject(ChatService);

  mensaje=
  signal('');

  mensajes=
  signal<any[]>([]);

  usuario:any=null;

  canal:any;


  async ngOnInit(){

    try{

      const {

        data

      }=

      await supabase
      .auth
      .getUser();


      const email=
      data.user?.email;


      if(!email){

        console.log(
          'No hay usuario logueado'
        );

        return;

      }


      this.usuario=

      await this
      .authService
      .getProfile(
        email
      );


      if(
        !this.usuario
      ){

        return;

      }


      await this
      .cargarMensajes();



      this.canal=

      supabase

      .channel(
        'chat-room'
      )

      .on(

        'postgres_changes',

        {

          event:'INSERT',

          schema:'public',

          table:'chat'

        },

        (payload)=>{

          console.log(
            'Nuevo mensaje:',
            payload
          );


          this.mensajes.update(
            mensajes=>[
              ...mensajes,
              payload.new
            ]
          );

        }

      )

      .subscribe(
        estado=>{

          console.log(
            'Estado:',
            estado
          );

        }
      );

    }

    catch(error){

      console.log(
        error
      );

    }

  }



  async cargarMensajes(){

    try{

      const mensajes=

      await this
      .chatService
      .obtenerMensajes();


      this.mensajes
      .set(
        mensajes
      );

    }

    catch(error){

      console.log(
        error
      );

    }

  }



  async enviar(){

    if(

      !this.mensaje()
      .trim()

    ){

      return;

    }


    if(

      !this.usuario

    ){

      return;

    }


    try{

      await this
      .chatService
      .enviarMensaje({

        nombre:
        this.usuario.nombre,

        apellido:
        this.usuario.apellido,

        email:
        this.usuario.email,

        mensaje:
        this.mensaje(),

        fecha:
        new Date()

      });


      this.mensaje.set('');

    }

    catch(error){

      console.log(
        error
      );

    }

  }


  ngOnDestroy(){

    if(
      this.canal
    ){

      supabase
      .removeChannel(
        this.canal
      );

    }

  }

}