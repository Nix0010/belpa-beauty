# 🌸 GUÍA RÁPIDA: CONEXIÓN DE SUPABASE CON BELPA CMS

Esta guía te permitirá conectar tu base de datos y almacenamiento en la nube de **Supabase** con tu tienda y panel administrativo de **Belpa** en 3 sencillos pasos.

---

## 📋 PASO 1: Crear tu Proyecto en Supabase (Gratis)
1. Ve a [https://supabase.com](https://supabase.com) e inicia sesión o regístrate.
2. Haz clic en **New project** (Nuevo proyecto).
3. Asigna un nombre a tu proyecto (ej. `belpa-store`) y define una contraseña segura para la base de datos (guárdala para ti, nunca la compartas en código).
4. Elige la región más cercana (ej. *South America - São Paulo* o *US East*).
5. Haz clic en **Create new project** y espera aproximadamente 1 minuto mientras se inicializa.

---

## 🗄️ PASO 2: Crear las Tablas, Seguridad y Cargar los 79 Productos
1. En el menú lateral izquierdo de tu panel en Supabase, haz clic en **SQL Editor** (icono con `SQL`).
2. Haz clic en **New query** (o `+`).
3. Abre el archivo `supabase/block3_database.sql` de tu proyecto local, copia **todo su contenido** y pégalo en el editor de Supabase.
4. Haz clic en el botón verde **Run** (Ejecutar).
5. ✨ *¡Listo!* Esto creará automáticamente:
   - La tabla de administradores `admin_users`.
   - La tabla de productos `products` con índices y triggers.
   - Las políticas de seguridad Row Level Security (RLS).
   - El bucket de almacenamiento `product-images` para fotos WebP.
   - **Los 79 productos originales de BelFlora y BelpaBeauty**.

---

## 👤 PASO 3: Crear tu Usuario Administrador Real
1. En el menú lateral izquierdo de Supabase, ve a **Authentication** > **Users**.
2. Haz clic en **Add user** > **Create user**.
3. Ingresa tu correo electrónico (ej. `admin@belpa.co`) y la contraseña con la que ingresarás al panel.
4. Regresa a la pestaña **SQL Editor**, abre una nueva consulta y ejecuta el siguiente código reemplazando `TU_CORREO_AQUI` por el correo que acabas de registrar:

```sql
INSERT INTO public.admin_users (id, email, role, is_active)
SELECT id, email, 'admin', true
FROM auth.users
WHERE email = 'TU_CORREO_AQUI'
ON CONFLICT (id) DO UPDATE SET role = 'admin', is_active = true;
```

---

## 🔑 PASO 4: Obtener tus Credenciales Públicas y Conectar el Panel
1. En el menú lateral izquierdo de Supabase, ve a **Project Settings** (icono de engranaje ⚙️) > **API**.
2. En la sección **Project API keys**, copia:
   - **Project URL** (ej. `https://xyzabcdef.supabase.co`)
   - **anon public key** (ej. `eyJhbGciOiJIUzI1NiIsIn...`)
   - ⚠️ *IMPORTANTE: NUNCA copies ni uses la `service_role secret key` en el frontend.*
3. Abre tu panel administrativo de Belpa:
   - En producción: [https://belpa-beauty.vercel.app/admin/](https://belpa-beauty.vercel.app/admin/)
   - O en local: [http://localhost:3000/admin/](http://localhost:3000/admin/)
4. Haz clic en el botón **⚙️ Configurar Conexión Supabase**.
5. Pega tu **Project URL** y tu **Anon Public Key**, y haz clic en **Guardar y Probar Conexión ✨**.
6. Inicia sesión con el correo y contraseña que creaste en el Paso 3.

---

## ✅ VERIFICACIÓN FINAL
- Al ingresar al panel verás tus **79 productos** (74 BelFlora, 5 BelpaBeauty).
- Podrás crear productos, editar precios, subir fotos en WebP, pausar productos y gestionar tu catálogo sin tocar una sola línea de código.
- Tu tienda pública continuará funcionando de forma ultra rápida con fallback local automático.
