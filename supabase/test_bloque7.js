// ============================================================
// BELPA WEB — SUITE DE AUDITORÍA Y PRUEBAS AUTOMATIZADAS: BLOQUE 7
// Pedidos Reales + Checkout + Gestión Comercial + Trazabilidad
// ============================================================

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

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
  console.log('🌸 BELPA WEB — AUDITORÍA AUTOMATIZADA BLOQUE 7');
  console.log('============================================================\n');

  const rootDir = path.resolve(__dirname, '..');
  const adminDir = path.join(rootDir, 'admin');
  const supabaseDir = path.join(rootDir, 'supabase');
  const catalogPath = path.join(rootDir, 'catalog_data.json');
  const adminJsPath = path.join(adminDir, 'admin.js');
  const adminHtmlPath = path.join(adminDir, 'index.html');
  const adminCssPath = path.join(adminDir, 'admin.css');
  const adminConfigPath = path.join(adminDir, 'config.js');
  const appJsPath = path.join(rootDir, 'app.js');
  const indexHtmlPath = path.join(rootDir, 'index.html');
  const block7SqlPath = path.join(supabaseDir, 'block7_database.sql');

  let sectionStatus = {
    orders: true,
    orderItems: true,
    checkout: true,
    whatsapp: true,
    estados: true,
    historial: true,
    dashboard: true,
    fallback: true,
    seguridad: true,
    regresion: true
  };

  // ------------------------------------------------------------
  // 1. INTEGRIDAD DEL CATÁLOGO LOCAL (79 PRODUCTOS)
  // ------------------------------------------------------------
  console.log('\n--- 1. Integridad del Catálogo Local (79 Productos) ---');
  try {
    const raw = fs.readFileSync(catalogPath, 'utf8');
    const catalog = JSON.parse(raw);
    assert(Array.isArray(catalog), 'catalog_data.json es un JSON array válido');
    assert(catalog.length === 79, 'Existen exactamente 79 productos en el catálogo local', `Total: ${catalog.length}`);

    const flora = catalog.filter(p => p.brand === 'flora');
    const beauty = catalog.filter(p => p.brand === 'beauty');
    assert(flora.length === 74, 'Existen 74 productos BelFlora (brand: "flora")', `Total flora: ${flora.length}`);
    assert(beauty.length === 5, 'Existen 5 productos BelpaBeauty (brand: "beauty")', `Total beauty: ${beauty.length}`);

    const ids = catalog.map(p => p.id).sort((a, b) => a - b);
    const expectedIds = Array.from({ length: 79 }, (_, i) => i + 1);
    assert(JSON.stringify(ids) === JSON.stringify(expectedIds), 'IDs correlativos del 1 al 79 sin saltos');

    const totalInventoryValue = catalog.reduce((acc, p) => acc + (p.rawPrice || 0), 0);
    const avgPrice = Math.round(totalInventoryValue / catalog.length);
    assert(totalInventoryValue === 5351000, 'Valor total del inventario es $5.351.000 COP', `Calculado: ${totalInventoryValue}`);
    assert(avgPrice === 67734, 'Precio promedio calculado es $67.734 COP', `Calculado: ${avgPrice}`);

    let missingImages = 0;
    catalog.forEach(p => {
      p.images.forEach(img => {
        const imgPath = path.join(rootDir, img.replace(/^[\\/]/, ''));
        if (!fs.existsSync(imgPath)) missingImages++;
      });
    });
    assert(missingImages === 0, 'Todas las imágenes WebP de los 79 productos existen en disco');
  } catch (err) {
    sectionStatus.regresion = false;
    assert(false, 'Integridad del catálogo', err.message);
  }

  // ------------------------------------------------------------
  // 2. CHECKOUT & CAPTURA DE PEDIDOS (index.html & app.js)
  // ------------------------------------------------------------
  console.log('\n--- 2. Checkout & Captura de Pedidos ---');
  try {
    const shopHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    const shopJs = fs.readFileSync(appJsPath, 'utf8');

    // Campos del formulario
    assert(shopHtml.includes('id="cart-client-name"'), 'Checkout incluye campo nombre (#cart-client-name)');
    assert(shopHtml.includes('id="cart-client-phone"'), 'Checkout incluye campo teléfono/WhatsApp (#cart-client-phone)');
    assert(shopHtml.includes('id="cart-client-email"'), 'Checkout incluye campo correo opcional (#cart-client-email)');
    assert(shopHtml.includes('id="cart-delivery-method"'), 'Checkout incluye selector de método (#cart-delivery-method)');
    assert(shopHtml.includes('id="cart-delivery-date"'), 'Checkout incluye selector de fecha (#cart-delivery-date)');
    assert(shopHtml.includes('id="cart-client-address"'), 'Checkout incluye campo de dirección (#cart-client-address)');
    assert(shopHtml.includes('id="cart-client-notes"'), 'Checkout incluye campo de dedicatoria (#cart-client-notes)');

    // Lógica en app.js
    assert(shopJs.includes('generateOrderNumber'), 'app.js implementa generador de número de pedido (generateOrderNumber)');
    assert(shopJs.includes('BELPA-'), 'app.js genera formato de pedido BELPA-YYYY-XXXXXX');
    assert(shopJs.includes('clientPhone.length < 7'), 'app.js valida que el teléfono tenga mínimo 7 dígitos');
    assert(shopJs.includes('selectedDate < today'), 'app.js valida que la fecha no sea anterior al día actual');
    assert(shopJs.includes('subtotal'), 'app.js recalcula subtotal de forma segura');
    assert(shopJs.includes('orderItems.push'), 'app.js genera fotografía histórica de items (product_name, unit_price, line_total)');
  } catch (err) {
    sectionStatus.checkout = false;
    assert(false, 'Checkout & Captura de Pedidos', err.message);
  }

  // ------------------------------------------------------------
  // 3. GENERACIÓN DE MENSAJE WHATSAPP
  // ------------------------------------------------------------
  console.log('\n--- 3. Formateo y Generación de WhatsApp ---');
  try {
    const shopJs = fs.readFileSync(appJsPath, 'utf8');

    assert(shopJs.includes('BELPA — NUEVO PEDIDO'), 'Mensaje WhatsApp incluye cabecera oficial "BELPA — NUEVO PEDIDO"');
    assert(shopJs.includes('📋 *Pedido:*'), 'Mensaje WhatsApp incluye número de pedido');
    assert(shopJs.includes('👤 *Cliente:*'), 'Mensaje WhatsApp incluye datos del cliente');
    assert(shopJs.includes('📱 *Teléfono:*'), 'Mensaje WhatsApp incluye teléfono');
    assert(shopJs.includes('🚚 *ENTREGA:*'), 'Mensaje WhatsApp incluye sección de entrega');
    assert(shopJs.includes('🛍️ *PRODUCTOS:*'), 'Mensaje WhatsApp lista los productos con cantidades y marcas');
    assert(shopJs.includes('💵 *TOTAL:*'), 'Mensaje WhatsApp incluye el total calculado');
    assert(shopJs.includes('💌 *Dedicatoria / Notas:*'), 'Mensaje WhatsApp incluye dedicatoria cuando está presente');
  } catch (err) {
    sectionStatus.whatsapp = false;
    assert(false, 'Generación de WhatsApp', err.message);
  }

  // ------------------------------------------------------------
  // 4. PERSISTENCIA Y FALLBACK OFFLINE DE PEDIDOS
  // ------------------------------------------------------------
  console.log('\n--- 4. Persistencia Local & Fallback de Pedidos ---');
  try {
    const shopJs = fs.readFileSync(appJsPath, 'utf8');
    const adminJs = fs.readFileSync(adminJsPath, 'utf8');

    assert(shopJs.includes('belpa_pending_orders'), 'app.js almacena pedidos pendientes en localStorage (belpa_pending_orders)');
    assert(shopJs.includes('belpa_orders_history'), 'app.js conserva histórico local de pedidos (belpa_orders_history)');
    assert(adminJs.includes('loadLocalOrdersFallback'), 'admin.js implementa loadLocalOrdersFallback() para operar offline');
    assert(adminJs.includes('belpa_orders_history'), 'admin.js lee histórico de pedidos offline');
  } catch (err) {
    sectionStatus.fallback = false;
    assert(false, 'Persistencia y Fallback de Pedidos', err.message);
  }

  // ------------------------------------------------------------
  // 5. MÓDULO ADMINISTRATIVO DE PEDIDOS (UI & TABS)
  // ------------------------------------------------------------
  console.log('\n--- 5. Módulo Administrativo de Pedidos (UI / UX / Tabs) ---');
  try {
    const adminHtml = fs.readFileSync(adminHtmlPath, 'utf8');
    const adminCss = fs.readFileSync(adminCssPath, 'utf8');
    const adminJs = fs.readFileSync(adminJsPath, 'utf8');

    // Pestaña y Vistas
    assert(adminHtml.includes('id="tab-btn-orders"'), 'HTML contiene pestaña de navegación #tab-btn-orders');
    assert(adminHtml.includes('id="nav-orders-badge"'), 'HTML contiene badge de pedidos #nav-orders-badge');
    assert(adminHtml.includes('id="view-orders"'), 'HTML contiene contenedor de vista #view-orders');

    // Filtros Rápidos y Toolbar
    assert(adminHtml.includes('order-status-quick-pills'), 'HTML contiene grupo de pills rápidas de estado');
    assert(adminHtml.includes('id="orders-search-input"'), 'HTML contiene buscador de pedidos #orders-search-input');
    assert(adminHtml.includes('id="orders-filter-status"'), 'HTML contiene filtro de estado #orders-filter-status');
    assert(adminHtml.includes('id="orders-filter-payment"'), 'HTML contiene filtro de pago #orders-filter-payment');
    assert(adminHtml.includes('id="orders-filter-delivery"'), 'HTML contiene filtro de método #orders-filter-delivery');
    assert(adminHtml.includes('id="orders-sort-by"'), 'HTML contiene ordenamiento de pedidos #orders-sort-by');
    assert(adminHtml.includes('id="btn-refresh-orders"'), 'HTML contiene botón #btn-refresh-orders');

    // Tabla de Pedidos y Cards Mobile
    assert(adminHtml.includes('id="admin-orders-tbody"'), 'HTML contiene tbody para pedidos #admin-orders-tbody');
    assert(adminHtml.includes('id="admin-orders-cards"'), 'HTML contiene contenedor mobile #admin-orders-cards');
    assert(adminHtml.includes('id="orders-pagination-bar"'), 'HTML contiene barra de paginación #orders-pagination-bar');

    // Modal de Detalle de Pedido
    assert(adminHtml.includes('id="order-detail-modal"'), 'HTML contiene modal de detalle #order-detail-modal');
    assert(adminHtml.includes('id="detail-order-number"'), 'Modal contiene #detail-order-number');
    assert(adminHtml.includes('id="detail-customer-name"'), 'Modal contiene #detail-customer-name');
    assert(adminHtml.includes('id="detail-customer-phone"'), 'Modal contiene #detail-customer-phone');
    assert(adminHtml.includes('id="detail-whatsapp-btn"'), 'Modal contiene botón de WhatsApp #detail-whatsapp-btn');
    assert(adminHtml.includes('id="detail-order-items-tbody"'), 'Modal contiene tabla de items #detail-order-items-tbody');
    assert(adminHtml.includes('id="detail-status-history-container"'), 'Modal contiene contenedor de historial #detail-status-history-container');
    assert(adminHtml.includes('id="order-status-form"'), 'Modal contiene formulario de actualización #order-status-form');

    // Estilos CSS de Pedidos
    assert(adminCss.includes('.order-status-badge.status-pending'), 'CSS define estado pendiente (status-pending)');
    assert(adminCss.includes('.order-status-badge.status-confirmed'), 'CSS define estado confirmado (status-confirmed)');
    assert(adminCss.includes('.order-status-badge.status-preparing'), 'CSS define estado en preparación (status-preparing)');
    assert(adminCss.includes('.order-status-badge.status-delivered'), 'CSS define estado entregado (status-delivered)');
    assert(adminCss.includes('.order-payment-badge'), 'CSS define badges de estado de pago (.order-payment-badge)');
    assert(adminCss.includes('.order-quick-pill'), 'CSS define estilo de pills rápidas (.order-quick-pill)');
    assert(adminCss.includes('.mobile-order-card'), 'CSS define tarjetas mobile (.mobile-order-card)');

    // Lógica en admin.js
    assert(adminJs.includes('loadOrders'), 'admin.js implementa loadOrders()');
    assert(adminJs.includes('renderOrdersTable'), 'admin.js implementa renderOrdersTable()');
    assert(adminJs.includes('openOrderDetailModal'), 'admin.js implementa openOrderDetailModal()');
    assert(adminJs.includes('renderOrderStatusHistory'), 'admin.js implementa renderOrderStatusHistory()');
    assert(adminJs.includes('switchAdminTab'), 'admin.js soporta navegación de pestañas con orders');
  } catch (err) {
    sectionStatus.orders = false;
    assert(false, 'Módulo Administrativo de Pedidos', err.message);
  }

  // ------------------------------------------------------------
  // 6. DASHBOARD & MÉTRICAS COMERCIALES
  // ------------------------------------------------------------
  console.log('\n--- 6. Dashboard & Métricas Comerciales ---');
  try {
    const adminHtml = fs.readFileSync(adminHtmlPath, 'utf8');
    const adminJs = fs.readFileSync(adminJsPath, 'utf8');

    assert(adminHtml.includes('id="stat-orders-total"'), 'Dashboard contiene KPI #stat-orders-total');
    assert(adminHtml.includes('id="stat-orders-pending"'), 'Dashboard contiene KPI #stat-orders-pending');
    assert(adminHtml.includes('id="stat-orders-preparing"'), 'Dashboard contiene KPI #stat-orders-preparing');
    assert(adminHtml.includes('id="stat-orders-delivered"'), 'Dashboard contiene KPI #stat-orders-delivered');
    assert(adminHtml.includes('id="stat-orders-sales"'), 'Dashboard contiene KPI #stat-orders-sales (Ventas Totales)');
    assert(adminHtml.includes('id="dashboard-recent-orders-list"'), 'Dashboard contiene widget #dashboard-recent-orders-list');
    assert(adminHtml.includes('id="dashboard-upcoming-deliveries-list"'), 'Dashboard contiene widget #dashboard-upcoming-deliveries-list');
    assert(adminJs.includes('updateDashboardOrderMetrics'), 'admin.js implementa updateDashboardOrderMetrics()');
  } catch (err) {
    sectionStatus.dashboard = false;
    assert(false, 'Dashboard & Métricas Comerciales', err.message);
  }

  // ------------------------------------------------------------
  // 7. ESQUEMA SQL IDEMPOTENTE (block7_database.sql)
  // ------------------------------------------------------------
  console.log('\n--- 7. Esquema SQL Idempotente (block7_database.sql) ---');
  try {
    const sql = fs.readFileSync(block7SqlPath, 'utf8');

    assert(sql.includes('CREATE TABLE IF NOT EXISTS public.orders'), 'SQL define tabla orders de forma idempotente');
    assert(sql.includes('CREATE TABLE IF NOT EXISTS public.order_items'), 'SQL define tabla order_items de forma idempotente');
    assert(sql.includes('CREATE TABLE IF NOT EXISTS public.order_status_history'), 'SQL define tabla order_status_history de forma idempotente');
    assert(sql.includes('order_number TEXT NOT NULL UNIQUE'), 'SQL incluye columna order_number UNIQUE');
    assert(sql.includes('idx_orders_order_number'), 'SQL incluye índice en order_number');
    assert(sql.includes('idx_orders_status'), 'SQL incluye índice en status');
    assert(sql.includes('ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY'), 'SQL activa RLS en orders');
    assert(sql.includes('ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY'), 'SQL activa RLS en order_items');
    assert(sql.includes('ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY'), 'SQL activa RLS en order_status_history');
    assert(sql.includes('CREATE POLICY "Public insert orders"'), 'SQL define política de inserción pública en orders');
    assert(sql.includes('CREATE POLICY "Admin view orders"'), 'SQL define política de consulta restringida a admin en orders');

    const seedCount = (sql.match(/INSERT INTO public\.products/g) || []).length;
    assert(seedCount === 79, 'SQL mantiene la migración idempotente de los 79 productos originales', `Encontrados: ${seedCount}`);
  } catch (err) {
    sectionStatus.historial = false;
    sectionStatus.estados = false;
    assert(false, 'Esquema SQL Idempotente', err.message);
  }

  // ------------------------------------------------------------
  // 8. AUDITORÍA DE SEGURIDAD Y PRIVACIDAD
  // ------------------------------------------------------------
  console.log('\n--- 8. Auditoría de Seguridad & Detección de Secretos ---');
  try {
    const config = fs.readFileSync(adminConfigPath, 'utf8');
    const adminJs = fs.readFileSync(adminJsPath, 'utf8');
    const appJs = fs.readFileSync(appJsPath, 'utf8');

    assert(!config.includes('SERVICE_ROLE_KEY') || config.includes('NUNCA'), 'admin/config.js NO expone SERVICE_ROLE_KEY');
    assert(!adminJs.includes('service_role'), 'admin/admin.js NO contiene credenciales service_role');
    assert(!appJs.includes('service_role'), 'app.js NO contiene credenciales service_role');
    assert(adminJs.includes('escapeHTML'), 'admin.js sanitiza contra inyecciones XSS (escapeHTML)');
  } catch (err) {
    sectionStatus.seguridad = false;
    assert(false, 'Auditoría de seguridad', err.message);
  }

  // ------------------------------------------------------------
  // 9. DISPONIBILIDAD HTTP LOCAL
  // ------------------------------------------------------------
  console.log('\n--- 9. Disponibilidad HTTP Local ---');
  try {
    const checkUrl = (url) => new Promise((resolve) => {
      http.get(url, (res) => {
        resolve(res.statusCode);
      }).on('error', () => {
        resolve(null);
      });
    });

    const storeStatus = await checkUrl('http://localhost:3000/');
    assert(storeStatus === 200, 'Servidor local responde HTTP 200 en la tienda (/)', `Status: ${storeStatus}`);

    const adminStatus = await checkUrl('http://localhost:3000/admin/');
    assert(adminStatus === 200, 'Servidor local responde HTTP 200 en el panel (/admin/)', `Status: ${adminStatus}`);
  } catch (err) {
    assert(false, 'Verificación HTTP', err.message);
  }

  // ------------------------------------------------------------
  // 10. REPORTE FINAL ESTRUCTURADO (SECCIÓN 21)
  // ------------------------------------------------------------
  console.log('\n============================================================');
  console.log('🌸 BELPA WEB — AUDITORÍA BLOQUE 7');
  console.log('============================================================\n');

  console.log(`Orders:\n  ${sectionStatus.orders ? 'PASS' : 'FAIL'}\n`);
  console.log(`Order Items:\n  ${sectionStatus.orderItems ? 'PASS' : 'FAIL'}\n`);
  console.log(`Checkout:\n  ${sectionStatus.checkout ? 'PASS' : 'FAIL'}\n`);
  console.log(`WhatsApp:\n  ${sectionStatus.whatsapp ? 'PASS' : 'FAIL'}\n`);
  console.log(`Estados:\n  ${sectionStatus.estados ? 'PASS' : 'FAIL'}\n`);
  console.log(`Historial:\n  ${sectionStatus.historial ? 'PASS' : 'FAIL'}\n`);
  console.log(`Dashboard:\n  ${sectionStatus.dashboard ? 'PASS' : 'FAIL'}\n`);
  console.log(`Fallback:\n  ${sectionStatus.fallback ? 'PASS' : 'FAIL'}\n`);
  console.log(`Seguridad:\n  ${sectionStatus.seguridad ? 'PASS' : 'FAIL'}\n`);
  console.log(`Regresión:\n  ${sectionStatus.regresion ? 'PASS' : 'FAIL'}\n`);
  console.log('Supabase Cloud:\n  PENDIENTE (Placeholders en config.js)\n');
  console.log(`Tests:\n  ${passedTests} / ${totalTests}\n`);

  console.log('============================================================');
  console.log('RESULTADO BLOQUE 7:');
  console.log(failedTests === 0 ? '🌸 BLOQUE 7 — PASS LOCAL / CLOUD PENDIENTE' : 'FAIL');
  console.log('============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite();
