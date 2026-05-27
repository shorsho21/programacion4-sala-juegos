import { Component, OnInit, inject} from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { supabase } from '../../supabase.client';
import { AuthService } from '../../services/auth.service';
import { EncuestaService } from '../../services/encuesta.service';
//inicio componente
@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './encuesta.html',
  styleUrl: './encuesta.css'
})
//incio la clase
export class EncuestaComponent implements OnInit {
  //variable para almacenar el usuario logueado
  user: any = null;
  authService = inject(AuthService);
  encuestaService = inject(EncuestaService);
  //defino el formulario con sus respectivas validaciones
  form = new FormGroup({

    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30)
    ]),

    apellido: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30)
    ]),

    edad: new FormControl('', [
      Validators.required,
      Validators.min(18),
      Validators.max(99)
    ]),

    telefono: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{1,10}$')
    ]),

    puntuacion: new FormControl(5, [
      Validators.required,
      Validators.min(1),
      Validators.max(10)
    ]),

    juegoFavorito: new FormControl('', Validators.required),

    dificultad: new FormControl('', Validators.required)
  });

  async ngOnInit() {

    //obtengo la sesion actual 
    const { data: sessionData } = await this.authService.getUserData();
    const session = sessionData.session;

    if (!session) {
      console.log('No hay sesión');
      return;
    }

    //seteo el usuario logueado
    this.user = session.user;

    console.log('User logueado:', this.user.email);
    //obtengo los datos del usuario logueado para mostrar en el form
    const { data } = await this.authService.getUserById(this.user.id);

    //si hay datos, seteo los datos del usuario en el form
    if (data) {
      this.form.patchValue({
        nombre: data.nombre,
        apellido: data.apellido,
        edad: data.edad
      });
    }
  }

  async enviar() {

    //obtengo la sesion actual
    const { data } = await this.authService.getUserData();
    const session = data.session;
    //si no hay sesion, no se puede enviar la encuesta
    if (!session) {
      console.error('No hay sesión');
      return;
    }
    //valido el formulario, si es invalido, marco todos los campos como tocados para mostrar errores
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    //guardo todos los datos del form
    const v = this.form.value;

    //uso el servicio para guardar la encuesta
    await this.encuestaService.guardarEncuesta({
      user_id: session.user.id,
      nombre_apellido: `${v.nombre} ${v.apellido}`,
      edad: v.edad,
      telefono: v.telefono,
      puntuacion: v.puntuacion,
      juego_favorito: v.juegoFavorito,
      dificultad: v.dificultad
    });

    console.log('Encuesta guardada ✔');
    this.form.reset({ puntuacion: 5 });
  }
}