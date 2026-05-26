import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({
providedIn:'root'
})

export class ResultadosService{

async guardarResultado(
resultado:any
){

const {

error

}

=

await supabase

.from(
'resultados'
)

.insert(
resultado
);


if(
error
){

console.log(
error
);

}

}

}