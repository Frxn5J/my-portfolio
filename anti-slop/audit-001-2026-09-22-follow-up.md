# Seguimiento de auditoría antislop 001

Fecha: 2026-09-22  
Modo: AFTER  
Hallazgos aprobados: 1, 2, 3, 4 y 5  
Estado: corregidos y verificados

## Cambios aplicados

1. Se añadió `DESIGN.md` con dirección visual, razones de composición, tipografía, paleta, estados y diales `ENERGY 3 / RHYTHM 2 / MOTION 2`.
2. Se añadieron áreas táctiles móviles de mínimo 44 px físicos usando la escala real de `mobile-screen-shell`.
3. Las ventanas activas se cierran con Escape y devuelven el foco a la burbuja que las abrió. También se marcó la ventana activa como diálogo.
4. Proyectos ahora distingue carga, vacío, error de restauración y error de guardado. El usuario puede restaurar los proyectos de ejemplo.
5. Se eliminaron glows externos que no aportaban jerarquía. Se conservaron gradientes y sombras con propósito documentado en `DESIGN.md`.
6. Se corrigió la regla CSS que anulaba el foco visible de las burbujas.

## Evidencia de verificación

- `npm run build`: PASS.
- `git diff --check`: PASS.
- Firefox Playwright a `1280 × 720`: Perfil, Proyectos, editor, Contacto y envío del formulario: PASS.
- Escape tras abrir Perfil: cierra la ventana y devuelve el foco a `data-app-id="profile"`: PASS.
- JSON inválido de proyectos: muestra estado de error y permite restaurar 3 proyectos: PASS.
- Lista vacía de proyectos: muestra estado vacío y permite restaurar 3 proyectos: PASS.
- Firefox Playwright a `844 × 390`: cerrar mide `44.00 × 44.00 px`, el editor mide `102.03 × 44.00 px`: PASS.
- Firefox Playwright a `568 × 320` y `844 × 390`: sin overflow horizontal: PASS.
- Firefox Playwright a `390 × 844`: advertencia de orientación vertical visible y sin overflow: PASS.
- Navegación por Tab: los controles reciben foco con contorno visible de 2 px: PASS.
- Contraste comprobado en las superficies nuevas: ratios entre `12.01:1` y `18.85:1`, todos PASS para texto normal.
- Consola de aplicación durante el flujo: sin errores JavaScript: PASS.

## Delivery Gate

- R-02 PASS: no hay em dash en el copy de la interfaz.
- R-03 PASS: no hay overflow en los breakpoints verificados y los controles móviles cumplen 44 px.
- R-25 PASS: superficies nuevas verificadas con el comprobador WCAG AA.
- R-26 PASS: controles probados, incluyendo abrir, cerrar, editar, restaurar y enviar.
- R-27 PASS: Proyectos tiene carga, vacío y error visibles.
- R-32 PASS: Tab muestra foco visible y Escape cierra la ventana activa.
- R-35 PASS: build, Firefox, desktop, móvil y click-through completados.
- R-37 PASS: dirección visual y diales registrados en `DESIGN.md`.
- R-01, R-12, R-13, R-29 y R-31 PASS: gradientes, sombras, glows y paleta tienen propósito documentado; se redujeron los efectos sin función jerárquica.
- C-1 a C-5 PASS: no se añadió contenido ficticio ni se dejó una interacción sin comportamiento en el flujo verificado.

## Riesgo restante

- No se simuló un teclado virtual real de iOS o Android.
- La verificación de navegador se hizo en Firefox Playwright. Chrome y Safari quedan fuera de esta pasada.
- `src/App.jsx` y `src/styles.css` ya tenían cambios locales previos; se conservaron y los cambios de esta auditoría se integraron encima de ellos.
