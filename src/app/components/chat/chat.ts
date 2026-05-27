import {
  Component,
  inject,
  signal,
  OnInit,
  //este se importa para limpiar el canal de suscripcion cuando el usuario se va del componente
  OnDestroy,
} from '@angular/core';
//datepipe para mostrar la fecha del mensaje del chat
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

import { ChatService } from '../../services/chat.service';

import { supabase } from '../../supabase.client';

//inicio el componente
@Component({
  selector: 'app-chat',
  standalone: true,

  imports: [FormsModule, DatePipe],

  templateUrl: './chat.html',

  styleUrl: './chat.css',
})
//inicio la clase
export class ChatComponent implements OnInit, OnDestroy {
  //inyecto los servicios
  authService = inject(AuthService);
  chatService = inject(ChatService);
  //inicio los signals
  mensaje = signal('');
  mensajes = signal<any[]>([]);
  //defino usuario y canal
  usuario: any = null;
  canal: any;
  //cargar el usuario y los mensajes al cargar el componente
  async ngOnInit() {
    try {
      //obtengo el usuario logueado
      const { data } = await this.authService.getUserDb();
      console.log(data);
      //si no hay usuario return
      const email = data.user?.email;
      if (!email) {
        console.log('No hay usuario logueado');

        return;
      }
      //si ahy usuario cargo el perfil del usuario
      this.usuario = await this.authService.getProfile(email);

      if (!this.usuario) {
        return;
      }
      //cargo los mensajes del chat
      await this.cargarMensajes();
      //me suscribo a los cambios en la tabla para actualizar el chat
      this.canal = supabase

        .channel('chat-room')

        .on(
          'postgres_changes',

          {
            event: 'INSERT',

            schema: 'public',

            table: 'chat',
          },
          //si hay un nuevo mensaje lo agrego a la lista de mensajes
          (payload) => {
            console.log('Nuevo mensaje:', payload);
            //actualizo la lista agregando el nuevo mensaje al final
            this.mensajes.update((mensajes) => [...mensajes, payload.new]);
          },
        )

        .subscribe((estado) => {
          console.log('Estado:', estado);
        });
    } catch (error) {
      console.log(error);
    }
  }
  
  //cargo los mensajes del chat desde la base de datos
  async cargarMensajes() {
    try {
      //obtengo los mensajes de la db usando el servicio
      const mensajes = await this.chatService.obtenerMensajes();
      //seteo los mensajes en el signal
      this.mensajes.set(mensajes);
    } catch (error) {
      console.log(error);
    }
  }
  //envio mensaje al chat
  async enviar() {
    //si el mensaje esta vacio return
    if (!this.mensaje().trim()) {
      return;
    }
    //si no hay usuario return
    if (!this.usuario) {
      return;
    }

    try {
      //envio mensaje usando el servicio
      await this.chatService.enviarMensaje({
        nombre: this.usuario.nombre,

        apellido: this.usuario.apellido,

        email: this.usuario.email,

        mensaje: this.mensaje(),

        fecha: new Date(),
      });
      //limpio el mensaje
      this.mensaje.set('');
    } catch (error) {
      console.log(error);
    }
  }
  //limpio la suscripcion al canal cuando el usuario se va del componente
  ngOnDestroy() {
    if (this.canal) {
      supabase.removeChannel(this.canal);
    }
  }
}
