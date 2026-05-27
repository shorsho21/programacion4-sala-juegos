import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MayorMenorService {

  private api = inject(HttpClient);

  //obtengo un mazo de cartas
  crearMazo() {
    return this.api.get<any>(
      'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
    );
  }

  //saco una carta del mazo
  sacarCarta(deckId: string) {
    return this.api.get<any>(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
    );
  }
}