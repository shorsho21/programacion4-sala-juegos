import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//estoy importando el componente navbar para mostrarlo siempre en la app
import { NavbarComponent } from './components/header/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  //aca se esta importando el navbar
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('programacion4-sala-juegos');
}