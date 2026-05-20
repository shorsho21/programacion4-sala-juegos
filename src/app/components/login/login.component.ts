import { Component, inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  modalMessage = '';
  private modalInstance: any;

  ngAfterViewInit(): void {
    // FIX: esperar a que Angular renderice el DOM
    setTimeout(() => {
      const modalEl = document.getElementById('loginModal');

      if (modalEl) {
        this.modalInstance = new bootstrap.Modal(modalEl);
      }
    });
  }

  openModal(message: string) {
    this.modalMessage = message;

    // asegura render antes del show
    this.cdr.detectChanges();

    // FIX: reaseguro por si aún no está inicializado
    if (!this.modalInstance) {
      const modalEl = document.getElementById('loginModal');

      if (modalEl) {
        this.modalInstance = new bootstrap.Modal(modalEl);
      }
    }

    this.modalInstance?.show();
  }

  async enviarDatos() {

    if (this.loginForm.valid) {

      const { email, password } = this.loginForm.value;

      try {
        await this.authService.login(email!, password!);

        this.router.navigate(['/home']);

      } catch (error: any) {
        this.openModal('Correo o contraseña incorrectos');
      }

    } else {
      this.loginForm.markAllAsTouched();
      this.openModal('Por favor completa correctamente el formulario');
    }
  }

  setQuickLogin(email: string) {
    this.loginForm.setValue({
      email: email,
      password: '123456',
    });
  }
}