import { Component, inject, signal, OnInit } from '@angular/core';
import { ResultadosService } from '../../services/resultados.service';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css'
})
//inicio clase
export class ResultadosComponent implements OnInit {
  //inyecto los servicios
  resultadosService = inject(ResultadosService);

  loading = signal(true);

  ahorcado = signal<any[]>([]);
  mayorMenor = signal<any[]>([]);
  preguntados = signal<any[]>([]);
  wordle = signal<any[]>([]);

  //cargo los resultados al iniciar el componente
  async ngOnInit() {
    await this.cargarResultados();
    this.loading.set(false);
  }

  async cargarResultados() {
    //obtengo los datos de resultados de los score
    const data = await this.resultadosService.obtenerResultados();

    //ordena de mayor a menor cada juego segun el puntaje
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