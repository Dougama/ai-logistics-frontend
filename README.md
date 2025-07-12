# AI Logistics Frontend

Interface web independiente para el sistema de chat inteligente de logística.

## Descripción

Aplicación React moderna que proporciona una interfaz de usuario intuitiva para que los operarios logísticos interactúen con el sistema de chat con IA, consulten documentación y gestionen sus tareas.

## Tecnologías

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Mantine
- **Styling**: CSS Modules + Custom CSS
- **State Management**: React Context

## Configuración

### Variables de Entorno

```bash
# API Configuration
VITE_API_BASE_URL=https://your-orchestrator-api-url
VITE_API_TIMEOUT=10000

# Environment
NODE_ENV=production
```

### Dependencias

- React 18
- Mantine UI components
- React Router
- Axios para HTTP calls

## Instalación

```bash
npm install
```

## Desarrollo Local

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Estructura del Proyecto

```
src/
├── app/                     # App setup y routing
├── features/               # Módulos por funcionalidad
│   ├── auth/              # Autenticación
│   ├── chat/              # Sistema de chat
│   ├── dashboard/         # Panel principal
│   └── documentation/     # Consulta de documentos
├── shared/                # Componentes y servicios compartidos
│   ├── components/        # UI components reutilizables
│   ├── services/          # API clients y auth
│   └── hooks/            # Custom React hooks
└── styles/               # Estilos globales y tokens
```

## Funcionalidades

### Sistema de Chat
- ✅ Interface de chat en tiempo real
- ✅ Historial de conversaciones
- ✅ Múltiples chats simultáneos
- ✅ Diseño responsive

### Dashboard
- ✅ Vista general de actividades
- ✅ Acciones rápidas
- ✅ Estadísticas básicas

### Documentación
- ✅ Consulta de documentos PDF
- ✅ Categorización de contenido
- ✅ Visor de PDF integrado

### Autenticación
- 🔄 Sistema de login (preparado)
- 🔄 Gestión de usuarios (preparado)

## Características de UI/UX

### Diseño Optimizado para Operarios
- Interface simple e intuitiva
- Navegación clara y directa
- Responsive design para dispositivos móviles
- Accesibilidad mejorada

### Componentes Reutilizables
- Sistema de design tokens centralizado
- Componentes modulares
- Estilos consistentes
- Paleta de colores unificada

## API Integration

### Configuración de Cliente
```typescript
// src/shared/services/api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT
});
```

### Servicios Principales
- `chatService`: Gestión de conversaciones
- `authService`: Autenticación (preparado)
- `documentationService`: Consulta de documentos

## Deploy

### Build para Producción
```bash
npm run build
```

### Cloud Storage + CDN
```bash
# Subir a Cloud Storage
gsutil -m cp -r dist/* gs://your-frontend-bucket/

# Configurar CDN
gcloud compute url-maps create frontend-map \
  --default-backend-bucket=your-frontend-bucket
```

### Docker
```bash
docker build -t ai-logistics-frontend .
docker run -p 3000:80 ai-logistics-frontend
```

## Configuración de Desarrollo

### VSCode Extensions Recomendadas
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense (si se usa)
- Auto Rename Tag

### Scripts Disponibles
- `npm run dev`: Servidor de desarrollo
- `npm run build`: Build de producción
- `npm run preview`: Preview del build
- `npm run type-check`: Verificación de tipos

## Personalización

### Temas y Colores
Los tokens de diseño están centralizados en:
- `src/styles/tokens/colors.ts`
- `src/styles/tokens/typography.ts`
- `src/styles/tokens/spacing.ts`

### Componentes UI
Los componentes base están en `src/shared/components/ui/`
y pueden ser personalizados según necesidades específicas.

## Troubleshooting

### Errores Comunes

**Error de conexión a API:**
- Verificar VITE_API_BASE_URL
- Confirmar que orchestrator esté ejecutándose
- Revisar CORS configuration

**Build falló:**
- Ejecutar `npm run type-check`
- Verificar imports y exports
- Confirmar que todas las dependencias estén instaladas

**Styles no cargan:**
- Verificar imports de CSS
- Confirmar configuración de Vite
- Revisar orden de importación de estilos

## Próximos Pasos

- [ ] Implementar autenticación completa
- [ ] Agregar tests unitarios con Vitest
- [ ] Implementar PWA capabilities
- [ ] Agregar métricas de analytics
- [ ] Optimizar performance con code splitting