# Intent — Actualizar la imagen base a Node 24

## Qué pasa hoy
El Dockerfile usa `node:20.15.0-alpine3.20`. Desde el equipo se pidió que los backends pasen a una misma imagen base más nueva.

## Qué queremos
Que la imagen se construya desde `node:24.22.1-alpine3.24`.

## Cómo sabremos que está resuelto
- La imagen se construye sin errores (`docker build`).
- El contenedor levanta y responde en su puerto igual que antes.

## Qué no puede romperse
- El arranque del servicio (`node index.js`) y sus endpoints actuales.
- Las dependencias de `package.json` tienen que instalar y funcionar en Node 24.
