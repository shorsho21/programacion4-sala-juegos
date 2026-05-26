import { Component, inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
// declaro la variable global de bootstrap para el modal
declare var bootstrap: any;
//inicio el componente de login
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
//declaro la clase del componente del login
export class LoginComponent implements AfterViewInit {
  //inyecto los servicios
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);//debi usar signals en vez de cdr.
  //defino el formulario con sus validaciones
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  //mensaje e instancia del modal de errores
  modalMessage = '';
  private modalInstance: any;
  //espera que angular renderice el Dom para iniciar el modal
  ngAfterViewInit(): void {
    // FIX: esperar a que Angular renderice el DOM
    setTimeout(() => {
      const modalEl = document.getElementById('loginModal');

      if (modalEl) {
        this.modalInstance = new bootstrap.Modal(modalEl);
      }
    });
  }

  //funcion que abre el modal con mensaje de error
  openModal(message: string) {
    this.modalMessage = message;

    // asegura render antes del show
    this.cdr.detectChanges();

    // reaseguro por si aún no está inicializado
    if (!this.modalInstance) {
      const modalEl = document.getElementById('loginModal');

      if (modalEl) {
        this.modalInstance = new bootstrap.Modal(modalEl);
      }
    }

    this.modalInstance?.show();
  }

  //funcion para enviar datos del formulario y loguear
  async enviarDatos() {
    // si el formulario es valido, intento loguear al usuario con auth
    if (this.loginForm.valid) {

      const { email, password } = this.loginForm.value;

      try {
        //logueo el usuario con el auth
        await this.authService.login(email!, password!);
        //me manda a la ruta /home o bienvenida
        this.router.navigate(['/home']);

      } catch (error: any) {
        //Si hay un error, muestro el modal con mensaje de error al loguear
        this.openModal('Correo o contraseña incorrectos');
      }

    } else {
      //si el formulario no es valido, marco todos los campos como tocados para mostrar errores y abro el modal con mensaje de error
      this.loginForm.markAllAsTouched();
      this.openModal('Por favor completa correctamente el formulario');
    }
  }

  //funcion que autocompleta el formulario con usuarios de prueba
  setQuickLogin(email: string) {
    this.loginForm.setValue({
      email: email,
      password: '123456',
    });
  }
}