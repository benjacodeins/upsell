# Tienda Nube In-Cart Upsell Engine

Aplicación de **In-Cart Upselling & Cross-selling** de alta conversión diseñada específicamente para **Tienda Nube** (App ID: `37816`).

![Tienda Nube Upsell Banner](https://images.unsplash.com/photo-1556742049-0a670fc80799?auto=format&fit=crop&w=1200&q=80)

---

## ⚡ Características Principales

1. **In-Cart Widget de 1-Clic:** Muestra productos sugeridos con descuento automático directo dentro del carrito de compras de Tienda Nube antes de proceder al checkout.
2. **Despliegue Serverless Gratuito:** Listo para ser alojado **100% GRATIS** en **Vercel** o **Render** mediante `vercel.json` y Vercel Serverless Functions.
3. **Simulador de Carrito Integrado:** Permite al comerciante probar reglas de upsell, agregar productos y simular la conversión en vivo sin necesidad de una tienda en producción.
4. **Gestor Visual de Reglas:** Crea combinaciones ilimitadas de producto disparador $\rightarrow$ producto sugerido con % OFF o $ Fijo OFF.
5. **Autenticación OAuth 2.0:** Compatible con el flujo de Tienda Nube (App ID: `37816`).

---

## 🚀 Inicio Rápido Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar entorno de desarrollo
npm run dev
```

La aplicación se abrirá en `http://localhost:3000`.

---

## 🌐 Despliegue Gratis en Vercel

1. Instala el CLI de Vercel (opcional) o conecta el repositorio a [Vercel](https://vercel.com).
2. Agrega las siguientes Variables de Entorno en el panel de Vercel:
   - `APP_ID` = `37816`
   - `CLIENT_SECRET` = `91dcaf748f050822fe0df968d42bcf7d2cc48b86b823ef32`
3. ¡Haz clic en **Deploy**! El archivo `vercel.json` configurará automáticamente el frontend React y los endpoints serverless `/api/*`.

---

## 📌 Instalación del Script en Tienda Nube

En el panel de administración de Tienda Nube (`Configuración > Códigos de seguimiento`), agrega:

```html
<script 
  src="https://tu-dominio-vercel.app/api/widget.js" 
  data-app-id="37816" 
  async>
</script>
```
