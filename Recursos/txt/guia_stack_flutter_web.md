# 🚀 Guía de Proyecto — Stack Flutter Web Profesional

> **Instrucción para la IA:** Este documento define el stack tecnológico, herramientas, paquetes y convenciones que se deben seguir en TODOS los proyectos web que arme. Seguí estas reglas al pie de la letra al generar código, configurar servicios o sugerir soluciones.

---

## 📋 Resumen del Proyecto

- **Nombre del proyecto:** [COMPLETAR]
- **Descripción breve:** [COMPLETAR]
- **Tipo:** Página web con Flutter (web-first, luego adaptable a móvil)
- **Público objetivo:** [COMPLETAR]

---

## 1. 🛠️ Stack Tecnológico Principal

| Capa | Tecnología | Notas |
|------|-----------|-------|
| **Frontend** | Flutter (Web) | Dart como lenguaje. Siempre habilitar soporte web. |
| **Backend / BaaS** | Firebase | Auth, Firestore, Storage, Hosting. |
| **Base de datos** | Cloud Firestore | NoSQL en tiempo real. |
| **Autenticación** | Firebase Authentication | Google Sign-In, Email/Password como mínimo. |
| **Almacenamiento de archivos** | Cloud Storage (Firebase) | Para imágenes, PDFs, archivos del usuario. |
| **Hosting / Deploy** | Firebase Hosting | Deploy con `firebase deploy`. Dominio gratuito `.web.app`. |
| **Control de versiones** | Git + GitHub | Repositorio remoto en GitHub. |

> [!NOTE]
> **Alternativa de backend:** Si el proyecto necesita base de datos relacional (SQL), usar **Supabase** en lugar de Firebase. En ese caso, reemplazar Firestore por PostgreSQL (de Supabase) y usar el paquete `supabase_flutter`.

---

## 2. 📦 Paquetes Flutter Obligatorios (pub.dev)

Estos paquetes se deben incluir en **todo proyecto nuevo**. Agregalos al `pubspec.yaml` desde el inicio:

### Navegación y Rutas
```yaml
dependencies:
  go_router: ^latest  # Enrutamiento con URLs reales en el navegador
```
- **¿Por qué?** En web es obligatorio que la URL cambie (`/home`, `/perfil`, `/productos/123`).
- Configurar rutas con `GoRouter` y usar `context.go()` o `context.push()` para navegar.
- Soporta deep linking para cuando el proyecto pase a móvil.

### Gestión de Estado
```yaml
dependencies:
  flutter_riverpod: ^latest  # Estado global reactivo
  riverpod_annotation: ^latest
dev_dependencies:
  riverpod_generator: ^latest
  build_runner: ^latest
```
- **¿Por qué?** Para manejar datos globales (sesión del usuario, carrito, tema, filtros) de forma limpia y escalable.
- Usar `@riverpod` annotations + code generation como patrón principal.
- Envolver la app en `ProviderScope`.

### Conexión a Firebase
```yaml
dependencies:
  firebase_core: ^latest
  firebase_auth: ^latest
  cloud_firestore: ^latest
  firebase_storage: ^latest
```
- Inicializar Firebase en `main.dart` con `Firebase.initializeApp()`.
- Usar FlutterFire CLI para configurar (`flutterfire configure`).

### Peticiones HTTP / APIs externas
```yaml
dependencies:
  dio: ^latest  # Cliente HTTP avanzado
```
- **¿Por qué?** Para conectar con APIs externas (pasarelas de pago, servicios de terceros, etc.).
- Configurar interceptores para manejo de errores y tokens.
- Alternativa más simple: paquete `http` si la API es muy básica.

### Diseño Responsivo
```yaml
dependencies:
  responsive_framework: ^latest  # Breakpoints automáticos
```
- **¿Por qué?** Para que la misma pantalla se adapte: escritorio (barra lateral), tablet, y celular (navegación inferior).
- Definir breakpoints: Mobile (<600), Tablet (600-900), Desktop (>900).
- Complementar con `LayoutBuilder` y `MediaQuery` del SDK de Flutter.

### Otros paquetes útiles (agregar según necesidad)
```yaml
dependencies:
  cached_network_image: ^latest   # Cacheo de imágenes de red
  flutter_svg: ^latest            # Soporte para íconos SVG
  url_launcher: ^latest           # Abrir links externos
  intl: ^latest                   # Formateo de fechas, moneda, idioma
  google_fonts: ^latest           # Tipografías de Google Fonts
  shimmer: ^latest                # Efecto de carga (skeleton)
  image_picker: ^latest           # Seleccionar fotos (para subir)
```

---

## 3. 📁 Estructura de Carpetas del Proyecto

Seguir siempre esta estructura organizada por features/capas:

```
lib/
├── main.dart                    # Punto de entrada, inicialización de Firebase
├── app.dart                     # MaterialApp.router con GoRouter y tema
│
├── config/                      # Configuración global
│   ├── router/
│   │   └── app_router.dart      # Definición de todas las rutas (GoRouter)
│   ├── theme/
│   │   ├── app_theme.dart       # ThemeData claro y oscuro
│   │   └── app_colors.dart      # Paleta de colores del proyecto
│   └── constants.dart           # Constantes globales (URLs, keys, etc.)
│
├── features/                    # Cada funcionalidad en su propia carpeta
│   ├── auth/                    # Login, registro, recuperar contraseña
│   │   ├── data/                # Repositorios, modelos de datos
│   │   ├── presentation/        # Pantallas y widgets de UI
│   │   └── providers/           # Providers de Riverpod
│   │
│   ├── home/                    # Pantalla principal
│   │   ├── presentation/
│   │   └── providers/
│   │
│   └── profile/                 # Perfil del usuario
│       ├── data/
│       ├── presentation/
│       └── providers/
│
├── shared/                      # Componentes reutilizables
│   ├── widgets/                 # Botones, cards, inputs personalizados
│   ├── utils/                   # Funciones helper (formateo, validaciones)
│   └── services/                # Servicios compartidos (analytics, storage)
│
└── l10n/                        # Archivos de localización (si aplica)
```

---

## 4. 🎨 Convenciones de Código y Diseño

### Dart / Flutter
- **Idioma del código:** Inglés para nombres de variables, clases, funciones.
- **Comentarios:** Pueden estar en español para facilitar el aprendizaje.
- **Estilo:** Seguir las [Effective Dart Guidelines](https://dart.dev/effective-dart).
- **Análisis estático:** Mantener `flutter analyze` sin errores ni warnings.
- **Widgets:** Preferir `StatelessWidget` + Riverpod sobre `StatefulWidget`.
- **Nombrado de archivos:** `snake_case` (ej: `login_screen.dart`, `user_model.dart`).
- **Nombrado de clases:** `PascalCase` (ej: `LoginScreen`, `UserModel`).

### UI / UX
- **Tema:** Definir un `ThemeData` completo con colores primarios, tipografía y estilos de botones desde el inicio. Soportar modo claro y oscuro.
- **Tipografía:** Usar Google Fonts (a través del paquete `google_fonts`).
- **Iconos:** Preferir Material Icons o íconos SVG personalizados.
- **Responsividad:** Toda pantalla debe verse bien en 3 tamaños: móvil, tablet, desktop.
- **Prototipado previo:** Idealmente diseñar en Figma antes de codear.

### Git
- **Commits:** Mensajes descriptivos en español o inglés (ej: `feat: agregar pantalla de login`).
- **Ramas:** `main` (producción), `dev` (desarrollo), `feature/nombre` (funcionalidades nuevas).
- **`.gitignore`:** Usar el template de Flutter. Nunca subir archivos de configuración con API keys.

---

## 5. 🔒 Seguridad — Reglas Obligatorias

- **NUNCA** hardcodear API keys, secrets o credenciales en el código fuente.
- Usar variables de entorno o archivos `.env` (excluidos del repositorio con `.gitignore`).
- Configurar **Firebase Security Rules** en Firestore y Storage antes de ir a producción.
- Validar datos tanto en el frontend como en las reglas del backend.
- Usar HTTPS siempre (Firebase Hosting lo hace por defecto).

---

## 6. 🚀 Flujo de Deploy (Publicar la web)

### Desarrollo local
```bash
flutter run -d chrome          # Abrir en navegador
flutter run -d chrome --release # Probar versión de producción
```

### Build y Deploy a Firebase Hosting
```bash
flutter build web --release     # Compilar la web optimizada
firebase deploy --only hosting  # Subir a Firebase Hosting
```

El sitio quedará disponible en: `https://[nombre-proyecto].web.app`

---

## 7. 📱 Paso Futuro: Adaptación a Móvil

Cuando el proyecto web esté estable y se quiera generar la app para celulares:

1. **Instalar Android Studio** (descarga el Android SDK y emulador).
2. Ejecutar `flutter run` con un dispositivo Android conectado o emulador.
3. Para iOS, se necesita una Mac con Xcode.
4. Los paquetes ya elegidos (`go_router`, `riverpod`, `firebase_*`) funcionan igual en móvil.
5. Ajustar solo los widgets que necesiten comportamiento diferente en móvil (ej: navegación inferior en vez de barra lateral).

---

## 8. ✅ Checklist para Arrancar un Proyecto Nuevo

- [ ] Crear proyecto: `flutter create --platforms web [nombre_proyecto]`
- [ ] Configurar estructura de carpetas según sección 3
- [ ] Agregar paquetes obligatorios al `pubspec.yaml` y ejecutar `flutter pub get`
- [ ] Configurar Firebase: `flutterfire configure`
- [ ] Inicializar Firebase en `main.dart`
- [ ] Configurar `GoRouter` con rutas iniciales (`/`, `/login`, `/home`)
- [ ] Envolver la app en `ProviderScope` (Riverpod)
- [ ] Definir `ThemeData` con colores y tipografía del proyecto
- [ ] Crear repositorio en GitHub y hacer el primer commit
- [ ] Configurar Firebase Hosting y hacer el primer deploy de prueba

---

## 9. 📌 Instrucciones especiales para la IA

> [!IMPORTANT]
> **Al generar código para este proyecto, la IA DEBE:**
>
> 1. **Usar SIEMPRE los paquetes listados arriba** (go_router, riverpod, dio, etc.) — no proponer alternativas salvo que se pida.
> 2. **Seguir la estructura de carpetas** definida en la sección 3.
> 3. **Todo widget nuevo debe ser responsivo** (que se adapte a móvil, tablet y desktop).
> 4. **Incluir comentarios en español** explicando qué hace cada sección del código.
> 5. **Separar lógica de UI:** Los providers/repositorios van en su carpeta, la UI en `presentation/`.
> 6. **Preferir StatelessWidget + Riverpod** sobre StatefulWidget.
> 7. **Usar las skills de Firebase** (firebase-basics, firebase-firestore, firebase-auth-basics) cuando se configuren servicios de Firebase.
> 8. **Generar código limpio y escalable**, pensando en que el proyecto crecerá.
> 9. **Antes de agregar un paquete nuevo**, explicar por qué es necesario y confirmar con el usuario.
> 10. **Nunca exponer API keys** en el código. Usar variables de entorno.

---

> **Última actualización:** Septiembre 2026
> **Stack principal:** Flutter Web + Firebase + Riverpod + GoRouter
