import { Component, inject, AfterViewInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent implements AfterViewInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  modalMessage = '';
  private modalInstance: any;

  registroForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    edad: ['', [Validators.required, Validators.min(1)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngAfterViewInit(): void {
    const modalEl = document.getElementById('registroModal');
    if (modalEl) {
      this.modalInstance = new bootstrap.Modal(modalEl);
    }
  }

  openModal(message: string) {
    this.modalMessage = message;
    this.modalInstance?.show();
  }

  async enviarDatos() {

    if (this.registroForm.valid) {

      const { nombre, apellido, email, edad, password } = this.registroForm.value;

      try {
        await this.authService.register(
          email!,
          password!,
          nombre!,
          apellido!,
          Number(edad)
        );

        this.router.navigate(['/home']);

      } catch (error: any) {
        this.openModal(error.message || 'Error al registrar usuario');
      }

    } else {
      this.registroForm.markAllAsTouched();
      this.openModal('Error en el formulario. Por favor, revisa los campos e inténtalo de nuevo.');
    }
  }
}