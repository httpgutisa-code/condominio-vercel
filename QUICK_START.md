# Smart Condominium - Quick Start Guide

## 🚀 Quick Start

### 1. Backend Setup (Django)
```bash
# En la carpeta del backend
python manage.py runserver
```

### 2. Frontend Setup (Este proyecto)
```bash  
# En esta carpeta
npm run dev
```

### 3. Acceder
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Swagger Docs: http://localhost:8000/api/docs/

## 📁 Estructura del Proyecto

```
src/
├── components/        # Componentes React
│   ├── dashboard/    # Dashboard con estadísticas
│   ├── residentes/   # CRUD de residentes
│   ├── finanzas/     # Cuotas y pagos
│   ├── seguridad/    # Alertas de seguridad
│   ├── mantenimiento/ # Tickets
│   ├── reservas/     # Reservas de áreas
│   └── layout/       # Sidebar, Navbar, Layout
├── services/         # API service (axios)
├── context/          # Auth context (mock)
└── App.jsx           # Router principal
```

## 🎯 Funcionalidades Implementadas

### ✅ Dashboard
- Estadísticas generales
- Gráfico financiero
- Alertas recientes

### ✅ Residentes
- CRUD completo
- Búsqueda y filtros
- Score de morosidad IA

### ✅ Finanzas
- Tabla de cuotas
- Registro de pagos
- Filtros por estado y mes

### ✅ Seguridad
- Panel de alertas
- Marcar como resuelto
- Ver evidencias

### ✅ Mantenimiento
- Tickets de mantenimiento
- Filtros por estado/prioridad

### ✅ Reservas
- Tabla de reservas
- Filtros por estado/área

## 🔧 Problemas Resueltos

1. **toFixed Error**: Agregado Number() wrapper para score_morosidad_ia
2. **Tailwind CSS**: Configurado correctamente con tailwind.config.js
3. **Network Errors**: Manejo gracioso de errores de API

## 📝 Notas Importantes

- **Autenticación**: Actualmente es simulada (mock), no hay JWT real
- **Backend**: Debe estar corriendo en http://localhost:8000
- **Datos**: Usar `python manage.py poblar_datos` para datos de prueba

## 🎨 Tecnologías

- React 18 + Vite
- Tailwind CSS v4
- React Router DOM v7
- Lucide React (icons)
- Recharts (gráficos)
- Axios (HTTP client)
