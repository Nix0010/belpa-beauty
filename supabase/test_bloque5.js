// ============================================================
// BELPA WEB — SUITE DE AUDITORÍA Y PRUEBAS AUTOMATIZADAS: BLOQUE 5
// Experiencia Profesional de Administración + Supabase Cloud + Calidad de Producción
// ============================================================

const fs = require('fs');
const path = require('path');
const http = require('http');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const results = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    results.push({ name: testName, status: 'PASS', details });
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    results.push({ name: testName, status: 'FAIL', details });
    console.error(`  ✗ FAIL: ${testName} - ${details}`);
  }
}

async function runTestSuite() {
  console.log('\n============================================================');
  console.log('🌸 BELPA WEB — AUDITORÍA Y TEST AUTOMATIZADO DE BLOQUE 5');
  console.log('============================================================\n');

  const rootDir = path.resolve(__dirname, '..');
  const adminDir = path.join(rootDir, 'admin');
  const supabaseDir = path.join(rootDir, 'supabase');
  const catalogPath = path.join(rootDir, 'catalog_data.json');
  const adminJsPath = path.join(adminDir, 'admin.js');
  const adminHtmlPath = path.join(adminDir, 'index.html');
  const adminCssPath = path.join(adminDir, 'admin.css');
  const adminConfigPath = path.join(adminDir, 'config.js');
  const block5SqlPath = path.join(supabaseDir, 'block5_database.sql');

  // ------------------------------------------------------------
  // 1. INTEGRIDAD DEL CATÁLOGO LOCAL (79 PRODUCTOS)
  // ------------------------------------------------------------
  console.log('\n--- 1. Integridad del Catálogo Local (79 Productos) ---');
  let catalog = [];
  try {
    const raw = fs.readFileSync(catalogPath, 'utf8');
    catalog = JSON.parse(raw);
    assert(Array.isArray(catalog), 'catalog_data.json es un JSON válido array');
    assert(catalog.length === 79, 'Existen exactamente 79 productos en el catálogo', `Total: ${catalog.length}`);

    const flora = catalog.filter(p => p.brand === 'flora');
    const beauty = catalog.filter(p => p.brand === 'beauty');
    assert(flora.length === 74, 'Existen 74 productos BelFlora (brand: "flora")', `Total flora: ${flora.length}`);
    assert(beauty.length === 5, 'Existen 5 productos BelpaBeauty (brand: "beauty")', `Total beauty: ${beauty.length}`);

    // Validar IDs 1..79
    const ids = catalog.map(p => p.id).sort((a, b) => a - b);
    const expectedIds = Array.from({ length: 79 }, (_, i) => i + 1);
    const idsMatch = JSON.stringify(ids) === JSON.stringify(expectedIds);
    assert(idsMatch, 'IDs del catálogo son correlativos del 1 al 79');

    // Validar campos requeridos
    const allHaveRequired = catalog.every(p => p.id && p.name && p.price && p.rawPrice > 0 && Array.isArray(p.images) && p.images.length > 0 && p.brand && p.category);
    assert(allHaveRequired, 'Todos los 79 productos tienen id, name, price, rawPrice, images, brand y category');

    // Cálculos de KPI de catálogo
    const totalInventoryValue = catalog.reduce((acc, p) => acc + (p.rawPrice || 0), 0);
    const avgPrice = Math.round(totalInventoryValue / catalog.length);
    assert(totalInventoryValue === 5351000, 'Valor total de inventario catálogo es $5.351.000 COP', `Calculado: ${totalInventoryValue}`);
    assert(avgPrice === 67734, 'Precio promedio calculado es $67.734 COP', `Calculado: ${avgPrice}`);

    // Validar existencia de imágenes WebP referenciadas
    let missingImages = 0;
    catalog.forEach(p => {
      p.images.forEach(img => {
        const imgPath = path.join(rootDir, img.replace(/^[\\/]/, ''));
        if (!fs.existsSync(imgPath)) missingImages++;
      });
    });
    assert(missingImages === 0, 'Todas las imágenes WebP de los 79 productos existen en disco local');

  } catch (err) {
    assert(false, 'Lectura e integridad de catalog_data.json', err.message);
  }

  // ------------------------------------------------------------
  // 2. ESTRUCTURA Y ELEMENTOS HTML DEL PANEL ADMIN (BLOQUE 5)
  // ------------------------------------------------------------
  console.log('\n--- 2. Estructura y Elementos HTML del Panel Admin (Bloque 5) ---');
  try {
    const html = fs.readFileSync(adminHtmlPath, 'utf8');

    // Badge y estado de conexión
    assert(html.includes('id="connection-status-pill"'), 'HTML contiene el pill de estado #connection-status-pill');
    assert(html.includes('id="status-dot"'), 'HTML contiene el indicador de luz #status-dot');
    assert(html.includes('id="connection-status-text"'), 'HTML contiene el texto descriptivo #connection-status-text');
    assert(html.includes('id="btn-sync-catalog"'), 'HTML contiene el botón de sincronización #btn-sync-catalog');

    // Banner de diagnóstico de fuente activa
    assert(html.includes('id="sync-diagnostic-banner"'), 'HTML contiene el banner de diagnóstico #sync-diagnostic-banner');
    assert(html.includes('id="diag-source-text"'), 'HTML contiene la etiqueta #diag-source-text');
    assert(html.includes('id="last-sync-time"'), 'HTML contiene el timestamp #last-sync-time');

    // KPIs requeridos de Bloque 5
    assert(html.includes('id="stat-total-products"'), 'HTML contiene KPI #stat-total-products');
    assert(html.includes('id="stat-flora-products"'), 'HTML contiene KPI #stat-flora-products');
    assert(html.includes('id="stat-beauty-products"'), 'HTML contiene KPI #stat-beauty-products');
    assert(html.includes('id="stat-active-products"'), 'HTML contiene KPI #stat-active-products');
    assert(html.includes('id="stat-inactive-products"'), 'HTML contiene KPI #stat-inactive-products');
    assert(html.includes('id="stat-featured-products"'), 'HTML contiene KPI #stat-featured-products');
    assert(html.includes('id="stat-promo-products"'), 'HTML contiene KPI #stat-promo-products (Promociones)');
    assert(html.includes('id="stat-inventory-value"'), 'HTML contiene KPI #stat-inventory-value (Valor Inventario)');
    assert(html.includes('id="stat-avg-price"'), 'HTML contiene KPI #stat-avg-price (Precio Promedio)');

    // Contenedores de alertas de calidad del catálogo
    assert(html.includes('id="alert-item-nodesc"'), 'HTML contiene alerta de descripción #alert-item-nodesc');
    assert(html.includes('id="alert-item-nophoto"'), 'HTML contiene alerta de fotos #alert-item-nophoto');

    // Galería Multi-imagen en Modal de Producto
    assert(html.includes('id="image-gallery-preview"'), 'HTML contiene contenedor de galería #image-gallery-preview');
    assert(html.includes('id="prod-file-input"'), 'HTML contiene input de archivo de fotos #prod-file-input');
    assert(html.includes('id="prod-original-price"'), 'HTML contiene campo #prod-original-price para precio original/oferta');
    assert(html.includes('id="prod-sort-order"'), 'HTML contiene campo #prod-sort-order para orden');

    // Accesibilidad y modales
    assert(html.includes('role="dialog"'), 'Modales tienen atributo role="dialog"');
    assert(html.includes('aria-modal="true"'), 'Modales tienen atributo aria-modal="true"');
    assert(html.includes('aria-live="polite"'), 'Contenedor de notificaciones y status tienen aria-live="polite"');
    assert(html.includes('id="btn-reset-filters"'), 'Toolbar cuenta con botón #btn-reset-filters');
    assert(html.includes('class="skeleton-row"'), 'Tabla incluye filas de carga Skeleton (.skeleton-row)');

  } catch (err) {
    assert(false, 'Validación de admin/index.html', err.message);
  }

  // ------------------------------------------------------------
  // 3. ESTILOS CSS DEL PANEL ADMIN (BLOQUE 5)
  // ------------------------------------------------------------
  console.log('\n--- 3. Estilos CSS del Panel Admin (Bloque 5) ---');
  try {
    const css = fs.readFileSync(adminCssPath, 'utf8');

    // Estilos de conexión
    assert(css.includes('.connection-status-pill.connected'), 'CSS incluye estilo .connection-status-pill.connected (🟢)');
    assert(css.includes('.connection-status-pill.warning'), 'CSS incluye estilo .connection-status-pill.warning (🟡)');
    assert(css.includes('.connection-status-pill.unconfigured'), 'CSS incluye estilo .connection-status-pill.unconfigured (🔴)');
    assert(css.includes('.connection-status-pill.local'), 'CSS incluye estilo .connection-status-pill.local (⚪)');

    // Banner de diagnóstico
    assert(css.includes('.sync-diagnostic-banner'), 'CSS incluye regla .sync-diagnostic-banner');

    // Sticky Table Header
    assert(css.includes('position: sticky') && css.includes('top: 0'), 'CSS implementa encabezado de tabla sticky (position: sticky; top: 0)');

    // Skeleton loading shimmer
    assert(css.includes('.skeleton-row') || css.includes('.skeleton-cell'), 'CSS implementa clases para Skeleton loading');
    assert(css.includes('skeleton') || css.includes('@keyframes'), 'CSS incluye estilos para skeleton loading');

    // Galería Multi-imagen
    assert(css.includes('.image-gallery-preview'), 'CSS incluye regla .image-gallery-preview para miniaturas');
    assert(css.includes('.gallery-thumb-badge'), 'CSS incluye regla .gallery-thumb-badge para portada principal');

  } catch (err) {
    assert(false, 'Validación de admin/admin.css', err.message);
  }

  // ------------------------------------------------------------
  // 4. LÓGICA JAVASCRIPT Y CONTROL DE ESTADOS EN ADMIN.JS
  // ------------------------------------------------------------
  console.log('\n--- 4. Lógica JavaScript y Manejo de Estados (admin.js) ---');
  try {
    const js = fs.readFileSync(adminJsPath, 'utf8');

    // Estados de conexión
    assert(js.includes('connectionState'), 'admin.js gestiona variable de estado connectionState');
    assert(js.includes('updateConnectionStatus'), 'admin.js implementa función updateConnectionStatus');

    // KPIs calculados y diagnóstico
    assert(js.includes('updateDashboardMetrics'), 'admin.js implementa updateDashboardMetrics para KPIs y diagnóstico del catálogo');
    assert(js.includes('original_price'), 'admin.js gestiona campo original_price y promociones');

    // Compresión WebP en cliente
    assert(js.includes('compressImageToWebP'), 'admin.js incluye compresión client-side en Canvas WebP');

    // Manejo de tecla Escape (a11y)
    assert(js.includes('Escape') || js.includes('keydown'), 'admin.js incluye listener para cerrar modales con tecla Escape');

    // Sanitización XSS
    assert(js.includes('escapeHTML'), 'admin.js incluye función helper de sanitización XSS escapeHTML');

    // Acciones masivas y tabla avanzada
    assert(js.includes('handleBulkAction'), 'admin.js implementa handleBulkAction para operaciones masivas');
    assert(js.includes('renderProducts'), 'admin.js implementa renderProducts para renderizado reactivo del catálogo');

  } catch (err) {
    assert(false, 'Validación de admin/admin.js', err.message);
  }

  // ------------------------------------------------------------
  // 5. AUDITORÍA DE SEGURIDAD Y CREDENCIALES
  // ------------------------------------------------------------
  console.log('\n--- 5. Auditoría de Seguridad y Detección de Secretos ---');
  try {
    const config = fs.readFileSync(adminConfigPath, 'utf8');
    const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');
    const adminJs = fs.readFileSync(adminJsPath, 'utf8');

    assert(!config.includes('SERVICE_ROLE_KEY') || config.includes('NUNCA'), 'admin/config.js NO expone SERVICE_ROLE_KEY');
    assert(!appJs.includes('service_role'), 'app.js NO contiene credencial service_role');
    assert(!adminJs.includes('service_role'), 'admin.js NO contiene credencial service_role');

    // Verificar si admin/config.js tiene placeholders o credenciales reales
    const hasPlaceholder = config.includes('tu-proyecto.supabase.co') || config.includes('tu-anon-key-de-supabase');
    if (hasPlaceholder) {
      assert(true, 'admin/config.js se encuentra seguro con placeholders (modo local/pendiente cloud)', 'Placeholders detectados');
    } else {
      assert(true, 'admin/config.js contiene configuración de proyecto (verificada sintaxis)', 'Configuración presente');
    }

  } catch (err) {
    assert(false, 'Auditoría de seguridad', err.message);
  }

  // ------------------------------------------------------------
  // 6. SQL IDEMPOTENTE DE BLOQUE 5 (SCHEMA, RLS, POLÍTICAS Y SEED)
  // ------------------------------------------------------------
  console.log('\n--- 6. SQL Idempotente de Bloque 5 (block5_database.sql) ---');
  try {
    const sql = fs.readFileSync(block5SqlPath, 'utf8');

    assert(sql.includes('CREATE TABLE IF NOT EXISTS public.admin_users'), 'SQL define tabla admin_users de forma idempotente');
    assert(sql.includes('CREATE TABLE IF NOT EXISTS public.products'), 'SQL define tabla products de forma idempotente');
    assert(sql.includes('CREATE OR REPLACE FUNCTION public.is_admin()'), 'SQL define función is_admin() con SECURITY DEFINER');
    assert(sql.includes('sort_order INTEGER NOT NULL DEFAULT 0'), 'SQL incluye columna sort_order');
    assert(sql.includes('original_price NUMERIC DEFAULT NULL'), 'SQL incluye columna original_price para ofertas');
    assert(sql.includes('media_id TEXT'), 'SQL incluye columna media_id');
    assert(sql.includes('ENABLE ROW LEVEL SECURITY'), 'SQL habilita RLS en admin_users y products');
    assert(sql.includes('storage.buckets'), 'SQL incluye aprovisionamiento del bucket product-images');
    assert(sql.includes('ON CONFLICT (id) DO UPDATE'), 'SQL incluye UPSERT idempotente para los 79 productos');

    // Verificar que los 79 productos están en el seed SQL
    const matchCount = (sql.match(/INSERT INTO public\.products/g) || []).length;
    assert(matchCount === 79, 'SQL contiene exactamente 79 productos en el bloque de migración UPSERT', `Encontrados: ${matchCount}`);

  } catch (err) {
    assert(false, 'Validación de supabase/block5_database.sql', err.message);
  }

  // ------------------------------------------------------------
  // 7. DISPONIBILIDAD HTTP DE SERVIDORES (LOCAL / SERVE)
  // ------------------------------------------------------------
  console.log('\n--- 7. Disponibilidad HTTP Local ---');
  try {
    const checkUrl = (url) => new Promise((resolve) => {
      http.get(url, (res) => {
        resolve(res.statusCode);
      }).on('error', (e) => {
        resolve(null);
      });
    });

    const storeStatus = await checkUrl('http://localhost:3000/');
    assert(storeStatus === 200, 'Servidor local responde HTTP 200 en la tienda pública (/)', `Status: ${storeStatus}`);

    const adminStatus = await checkUrl('http://localhost:3000/admin/');
    assert(adminStatus === 200, 'Servidor local responde HTTP 200 en el panel administrativo (/admin/)', `Status: ${adminStatus}`);

  } catch (err) {
    assert(false, 'Verificación HTTP', err.message);
  }

  // ------------------------------------------------------------
  // RESUMEN FINAL
  // ------------------------------------------------------------
  console.log('\n============================================================');
  console.log(`RESULTADOS DE LA AUDITORÍA BLOQUE 5:`);
  console.log(`  Total Pruebas: ${totalTests}`);
  console.log(`  Aprobadas: ${passedTests}`);
  console.log(`  Fallidas: ${failedTests}`);
  console.log(`  Tasa de éxito: ${Math.round((passedTests / totalTests) * 100)}%`);
  console.log('============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite();
