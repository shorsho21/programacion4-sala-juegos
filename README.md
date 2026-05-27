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

---

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

---

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

---

## 🎯 Juego propio

El juego elegido será un juego inspirado en Wordle, donde el usuario deberá adivinar una palabra secreta en una cantidad limitada de intentos. El sistema indicará letras correctas y letras mal posicionadas.

---

## 🔗 API utilizada

https://api.github.com/users/shorsho21

---

## 📌 Sprint #3

### 🎮 Juego: Ahorcado
* Implementación del juego tipo “Ahorcado”
* Interacción mediante botones con el abecedario completo (sin uso de teclado)
* Sistema de detección de letras correctas e incorrectas
* Control de estado de victoria o derrota
* Cálculo de errores y progreso del jugador
* Al finalizar la partida se guarda en la base de datos:
  - usuario que jugó
  - tiempo de finalización
  - cantidad de errores o intentos realizados
  - resultado de la partida

### 🎮 Juego: Mayor o Menor
* Juego basado en predicción de cartas de una baraja
* Se muestra una carta inicial y el usuario debe adivinar si la siguiente será mayor o menor
* Uso de API externa de cartas (Deck of Cards API)
* Control de aciertos consecutivos
* Finalización automática al fallar la predicción
* Al finalizar la partida se guarda en la base de datos:
  - usuario que jugó
  - cantidad de aciertos
  - tiempo de juego

### 💬 Sala de chat global
* Implementación de chat en tiempo real para usuarios logueados
* Envío y recepción de mensajes entre usuarios
* Persistencia de mensajes en base de datos
* Almacenamiento de:
  - usuario emisor
  - mensaje
  - fecha y hora de envío
* Suscripción en tiempo real a cambios en la base de datos
* Diferenciación visual de mensajes propios y ajenos

---

## 📌 Sprint #4

### 🎮 Juego: Preguntados
* Implementación de juego tipo trivia
* Consumo de API externa de preguntas (Open Trivia DB)
* Preguntas con opciones múltiples generadas dinámicamente
* Selección de respuestas mediante botones
* Cálculo de puntaje según respuestas correctas
* Al finalizar la partida se guarda en la base de datos:
  - usuario que jugó
  - cantidad de respuestas correctas
  - tiempo de finalización

### 🧠 Juego propio
* Diseño e implementación de juego propio inspirado en Wordle
* Descripción y reglas documentadas en la sección “Quién soy”
* Sistema de puntuación según desempeño del jugador
* Al finalizar la partida se guarda en la base de datos:
  - usuario que jugó
  - puntaje obtenido
  - tiempo de resolución

### 📊 Listado de resultados
* Implementación de la página de resultados generales
* Visualización de estadísticas por juego
* Ordenamiento de usuarios por mejor desempeño
* Separación de resultados en distintas tablas por juego:
  - Ahorcado
  - Mayor o Menor
  - Preguntados
  - Juego propio
* Consulta de datos desde la base de datos en tiempo real

---

## 📌 Sprint #5 - Recuperatorio

### 📝 Encuesta de usuarios
* Implementación de sistema de encuesta dentro de la aplicación
* Recolección de datos:
  - Nombre y apellido
  - Edad (validación entre 18 y 99 años)
  - Número de teléfono (solo números, máximo 10 caracteres)
* Mínimo 3 preguntas utilizando distintos tipos de inputs:
  - textboxes
  - checkboxes
  - radiobuttons
* Todas las preguntas con validaciones obligatorias
* No se permiten preguntas repetidas
* Almacenamiento de respuestas en base de datos asociadas al usuario

### 📊 Resultados de encuestas
* Creación de sección de resultados de encuestas
* Visualización de estadísticas generales
* Acceso restringido únicamente a usuarios administradores mediante guards

### 🎨 Animaciones de interfaz
* Incorporación de animaciones de transición entre componentes
* Mejora de experiencia visual y navegación dentro de la app
