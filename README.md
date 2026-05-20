# Sala de Juegos 🎮

Proyecto realizado para Programación IV.

## 👤 Alumno

* Jorge Ezequiel Caballero

## 🚀 Deploy

https://programacion4-sala-juego.vercel.app

## 🛠️ Tecnologías utilizadas

* Angular
* TypeScript
* Bootstrap
* HTML
* CSS
* Supabase
* Vercel

## 📌 Sprint #1

Funcionalidades implementadas:

* Componente Home/Bienvenida
* Componente Login
* Componente Registro
* Componente Quién Soy
* Navegación entre componentes
* Consumo de API pública de GitHub
* Mostrar información del perfil de GitHub
* Deploy en Vercel
* Favicon personalizado

## 📌 Sprint #2

Funcionalidades implementadas:

### 🔐 Sistema de autenticación

* Inicio de sesión mediante correo y contraseña utilizando Supabase
* Registro de usuarios
* Inicio automático de sesión luego del registro exitoso
* Cierre de sesión (Logout)
* Persistencia de sesión

### 📝 Validaciones y formularios

* Formularios reactivos
* Validación de campos obligatorios
* Validación de email
* Validación de contraseña
* Validación de edad
* Mensajes de error mediante modales

### ⚡ Inicio de sesión rápido

* Tres botones de acceso rápido para pruebas
* Completan automáticamente credenciales de usuarios registrados

### 🛡️ Protección de rutas

* Implementación de Guards
* Restricción de acceso a Login y Registro cuando el usuario ya inició sesión

### 🎨 Interfaz y estructura

* Navbar como componente independiente
* Estructura organizada por componentes, servicios e interfaces
* Migración a Angular moderno (Standalone Components)
* Mejoras visuales con temática estilo salón de juegos / gaming
* Home dinámico según el estado del usuario

## 🎯 Juego Propio

El juego elegido será un juego inspirado en Wordle, donde el usuario deberá adivinar una palabra secreta en una cantidad limitada de intentos. El sistema indicará letras correctas y letras mal posicionadas.

## 🔗 API utilizada

https://api.github.com/users/shorsho21
