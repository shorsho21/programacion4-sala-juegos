import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {

  private api = inject(HttpClient);

  //obtengo preguntas desde la API
  obtenerPreguntas() {
    return this.api.get<any>(
      'https://opentdb.com/api.php?amount=5&type=multiple'
    );
  }

}