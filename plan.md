# Plan del Proyecto: Aplicación de Upselling

## Credenciales de Configuración
- **App ID:** `37816`
- **Client Secret:** `91dcaf748f050822fe0df968d42bcf7d2cc48b86b823ef32`

## Estado Actual
Esperando confirmación de la plataforma de integración (Mercado Libre, Tienda Nube, Mercado Pago, etc.) y los requerimientos del flujo de Upselling (Pre-purchase, Post-purchase o Bundles).

## Arquitectura Proyectada
1. **Servidor Backend (Node.js / Express):** Autenticación OAuth2, webhook handlers, API de gestión de ofertas.
2. **Frontend Dashboard (React / Vite):** Panel administrativo moderno para configurar reglas de upsell y visualizar estadísticas.
3. **Módulo de Integración / Script de Checkout:** Inyección de ofertas en la tienda/checkout.
