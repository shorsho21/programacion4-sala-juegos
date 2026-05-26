import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({
providedIn:'root'
})
export class ChatService{

async enviarMensaje(data:any){

return await supabase
.from('chat')
.insert(data);

}


async obtenerMensajes(){

const {data,error}=

await supabase
.from('chat')
.select('*')
.order(
'fecha',
{
ascending:true
}
);

if(error)
throw error;

return data;

}

}