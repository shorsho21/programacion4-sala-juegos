import { Component, inject, signal, OnInit } from '@angular/core';
import { ResultadosService } from '../../services/resultados.service';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css'
})
export class ResultadosComponent implements OnInit {

  resultadosService = inject(ResultadosService);

  loading = signal(true);

  ahorcado = signal<any[]>([]);
  mayorMenor = signal<any[]>([]);
  preguntados = signal<any[]>([]);
  wordle = signal<any[]>([]);

  async ngOnInit() {
    await this.cargarResultados();
    this.loading.set(false);
  }

  async cargarResultados() {

    const data = await this.resultadosService.obtenerResultados();

    this.ahorcado.set(
      data.filter(r => r.juego === 'Ahorcado')
        .sort((a, b) => b.puntaje - a.puntaje)
    );

    this.mayorMenor.set(
      data.filter(r => r.juego === 'Mayor-Menor')
        .sort((a, b) => b.puntaje - a.puntaje)
    );

    this.preguntados.set(
      data.filter(r => r.juego === 'Preguntados')
        .sort((a, b) => b.puntaje - a.puntaje)
    );

    this.wordle.set(
      data.filter(r => r.juego === 'Wordle')
        .sort((a, b) => b.puntaje - a.puntaje)
    );
  }
}