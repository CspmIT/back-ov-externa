# Plan — Actualizar la imagen base a Node 24

Clasificación: 🟡 amarillo (cambio acotado en un sistema existente; no toca contratos, esquemas ni permisos, pero es un salto de versión mayor de Node: 20 → 24).

## Pasos
1. Cambiar la línea `FROM` del `Dockerfile` a `node:24.22.1-alpine3.24`. ✅
2. Construir la imagen en local: `docker build -t prueba-node24 .`
3. Levantar el contenedor con la configuración habitual y probar los endpoints principales.
4. Revisión de otra persona del equipo antes de mergear.
5. El despliegue a producción lo hace una persona del equipo.

## Riesgos
- Alguna dependencia (en especial las que compilan código nativo) puede no ser compatible con Node 24. Se detecta en el paso 2 o 3.

## Vuelta atrás
Revertir el commit: vuelve a `node:20.15.0-alpine3.20`.
