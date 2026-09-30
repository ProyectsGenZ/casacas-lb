# Reglas Fijas del Proyecto - CASACAS LB

Estas reglas son obligatorias y deben respetarse en cada interacción y tarea sobre este repositorio.

---

### 1. Ámbito de Trabajo Estricto
* **Trabajar exclusivamente dentro de esta carpeta (`CASACASLB WEB` / `c:\Users\RV\Downloads\WEBS\CASACASLB WEB`).**
* No crear ni modificar archivos fuera de este directorio de trabajo.

---

### 2. Verificación y Cero Errores
* **Antes de dar por finalizada cualquier tarea, ejecutar siempre `npm run build` para asegurar 0 errores de compilación y tipado.**
* Nunca entregar una respuesta como completada si el build falla o hay errores de sintaxis/TypeScript.

---

### 3. Resiliencia de Datos y Manejo de Nulos
* **Al modificar datos de productos, categorías, configuración de tienda o reseñas, proteger siempre contra valores nulos o indefinidos para evitar pantallas negras (white/black screen of death).**
* Usar siempre optional chaining (`?.`), valores por defecto / fallbacks (`?? ''`, `|| []`), y comprobaciones antes de mapear o renderizar listas de imágenes, variantes, precios o talles.

---

### 4. Despliegue Oficial en Producción
* **Si se requiere publicar un cambio a la web pública, compilar previamente y ejecutar:**
  ```bash
  npm run build
  npx -y firebase-tools deploy --only hosting
  ```
* No desplegar si la compilación previa arroja advertencias críticas o errores.

---

### 5. Control de Versiones (Git) y Puntos de Control
* Realizar commits o puntos de control claros antes y después de modificaciones estructurales importantes para facilitar la reversión mediante Git si el usuario lo requiere.

---

### 6. Estándares de Diseño y Referencias Visuales
* Utilizar como inspiración y referencia los patrones de:
  * **Refero**: Grillas editoriales, jerarquía tipográfica, micro-superficies oscuras con bordes finos.
  * **Kexsio & Design Spells**: Micro-interacciones táctiles, rebotes dinámicos sutiles, feedback inmediato al usuario.
  * **MotionSites**: Motion fluido, scroll-driven reveals y transiciones suaves de sección sin degradar el rendimiento.
  * **ThreeUI**: Efectos de iluminación reactiva (sheen/spotlight), profundidad y sensación espacial cuidada.
* Priorizar siempre **consistencia visual, alta performance, accesibilidad (WCAG) y responsive design**.
