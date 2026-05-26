import { Component, inject, AfterViewInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
//declaro la variable global de bootstrap para el modal
declare var bootstrap: any;

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
//defino la clase del componente e implementa el afterviewinit para iniciar el modal despues de que se renderice el dom
export class RegistroComponent implements AfterViewInit {

  //inyecto los servicios de la clase
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  //variable e instancia del modal de errores
  modalMessage = '';
  private modalInstance: any;

  //defino el formulario con sus validaciones
  registroForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    edad: ['', [Validators.required, Validators.min(1)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  //espera que se cargue el dom para iniciar el modal
  ngAfterViewInit(): void {
    const modalEl = document.getElementById('registroModal');
    if (modalEl) {
      this.modalInstance = new bootstrap.Modal(modalEl);
    }
  }

  //funcion que abre el modal con el mensaje de error
  openModal(message: string) {
    this.modalMessage = message;
    this.modalInstance?.show();
  }

  //funcion para enviar los datos del formulario
  async enviarDatos() {

    //si el formulario esta bien validado intento registrarme
    if (this.registroForm.valid) {
      //cargo los datos del formulario
      const { nombre, apellido, email, edad, password } = this.registroForm.value;

      try {
        //registro al usuario con el authservice
        await this.authService.register(
          email!,
          password!,
          nombre!,
          apellido!,
          Number(edad)
        );
        //si sale todo bien, redirecciono a home
        this.router.navigate(['/home']);

      } catch (error: any) {
        //muestra el modal con el error
        this.openModal(error.message || 'Error al registrar usuario');
      }

    } else {
      //si el formulario no es valido, marco todos los campos como tocados para mostrar los errores y abro el modal
      this.registroForm.markAllAsTouched();
      this.openModal('Error en el formulario. Por favor, revisa los campos e inténtalo de nuevo.');
    }
  }
}