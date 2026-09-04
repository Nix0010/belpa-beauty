-- ==========================================================================
-- BELPA BOUTIQUE (BelpaBeauty & BelFlora) - ESQUEMA DE BASE DE DATOS SUPABASE
-- ==========================================================================

-- 1. Crear la tabla de productos
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL CHECK (brand IN ('flora', 'beauty')),
    category TEXT NOT NULL,
    filter_category TEXT NOT NULL,
    price TEXT NOT NULL,
    raw_price INTEGER NOT NULL DEFAULT 0,
    badge TEXT DEFAULT 'Handmade 🌸',
    description TEXT,
    images JSONB NOT NULL DEFAULT '[]'::JSONB,
    media_id TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Habilitar Row Level Security (RLS) para máxima seguridad
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. Política Pública: Cualquier visitante puede LEER productos ACTIVOS
CREATE POLICY "Permitir lectura pública de productos activos"
ON public.products
FOR SELECT
TO public
USING (is_active = true);

-- 4. Política de Administrador: Usuarios autenticados tienen control total (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Permitir control total a administradores autenticados"
ON public.products
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Crear el Bucket de Almacenamiento de Fotos 'belpa-products' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('belpa-products', 'belpa-products', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Políticas de Seguridad para el Storage de Imágenes
CREATE POLICY "Permitir lectura pública de imágenes de productos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'belpa-products');

CREATE POLICY "Permitir subir imágenes a administradores autenticados"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'belpa-products');

CREATE POLICY "Permitir actualizar y borrar imágenes a administradores autenticados"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'belpa-products');
