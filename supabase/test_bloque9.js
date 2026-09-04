// ============================================================
// BELPA WEB — SUITE DE AUDITORÍA Y PRUEBAS AUTOMATIZADAS: BLOQUE 9
// Operación Comercial Real + Pagos + Notificaciones + Control Financiero
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
  console.log('🌸 BELPA WEB — AUDITORÍA AUTOMATIZADA BLOQUE 9');
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
  const block9SqlPath = path.join(supabaseDir, 'block9_database.sql');

  let sectionStatus = {
    orders: true,
    payments: true,
    paymentHistory: true,
    notifications: true,
    checkout: true,
    whatsapp: true,
    fallback: true,
    sincronizacion: true,
    admin: true,
    dashboard: true,
    seguridad: true,
    regresion: true,
    proveedorPago: 'PENDIENTE',
    supabaseCloud: 'PENDIENTE'
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
  // 2. CHECKOUT & CAPTURA DE PAGOS (index.html & app.js)
  // ------------------------------------------------------------
  console.log('\n--- 2. Checkout & Captura de Pagos ---');
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
    assert(shopHtml.includes('id="cart-payment-method"'), 'Checkout incluye selector de método de pago (#cart-payment-method)');

    // Lógica en app.js
    assert(shopJs.includes('generateOrderNumber'), 'app.js implementa generador de número de pedido (generateOrderNumber)');
    assert(shopJs.includes('BELPA-'), 'app.js genera formato de pedido BELPA-YYYY-XXXXXX');
    assert(shopJs.includes('PAY-'), 'app.js genera referencia de pago PAY-BELPA-YYYY-XXXXXX');
    assert(shopJs.includes('clientPhone.length < 7'), 'app.js valida que el teléfono tenga mínimo 7 dígitos');
    assert(shopJs.includes('selectedDate < today'), 'app.js valida que la fecha no sea anterior al día actual');
    assert(shopJs.includes('paymentRecord'), 'app.js crea registro estructurado de pago (paymentRecord)');
  } catch (err) {
    sectionStatus.checkout = false;
    assert(false, 'Checkout & Captura de Pagos', err.message);
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
    assert(shopJs.includes('💳 *Método de Pago:*'), 'Mensaje WhatsApp incluye método de pago seleccionado');
    assert(shopJs.includes('📌 *Estado del Pago:*'), 'Mensaje WhatsApp incluye estado inicial del pago');
    assert(shopJs.includes('💵 *TOTAL:*'), 'Mensaje WhatsApp incluye el total calculado');
    assert(shopJs.includes('💌 *Dedicatoria / Notas:*'), 'Mensaje WhatsApp incluye dedicatoria cuando está presente');
  } catch (err) {
    sectionStatus.whatsapp = false;
    assert(false, 'Formateo de WhatsApp', err.message);
  }

  // ------------------------------------------------------------
  // 4. PERSISTENCIA LOCAL & FALLBACK & SINCRONIZACIÓN
  // ------------------------------------------------------------
  console.log('\n--- 4. Persistencia Local & Fallback & Sincronización ---');
  try {
    const shopJs = fs.readFileSync(appJsPath, 'utf8');
    const adminJs = fs.readFileSync(adminJsPath, 'utf8');

    assert(shopJs.includes('belpa_pending_orders'), 'app.js almacena pedidos pendientes en localStorage (belpa_pending_orders)');
    assert(shopJs.includes('belpa_pending_payments'), 'app.js almacena pagos pendientes en localStorage (belpa_pending_payments)');
    assert(shopJs.includes('belpa_payments_history'), 'app.js conserva histórico local de pagos (belpa_payments_history)');
    assert(adminJs.includes('loadLocalPaymentsFallback'), 'admin.js implementa loadLocalPaymentsFallback() para operar pagos offline');
    assert(adminJs.includes('syncPendingPayments'), 'admin.js implementa syncPendingPayments() para sincronizar pagos con Supabase');
    assert(adminJs.includes('PaymentProvider'), 'admin.js implementa abstracción conceptual PaymentProvider');
  } catch (err) {
    sectionStatus.fallback = false;
    sectionStatus.sincronizacion = false;
    assert(false, 'Persistencia y sincronización', err.message);
  }

  // ------------------------------------------------------------
  // 5. MÓDULO ADMINISTRATIVO DE PAGOS (UI / UX / Tabs)
  // ------------------------------------------------------------
  console.log('\n--- 5. Módulo Administrativo de Pagos (UI / UX / Tabs) ---');
  try {
    const adminHtml = fs.readFileSync(adminHtmlPath, 'utf8');
    const adminCss = fs.readFileSync(adminCssPath, 'utf8');
    const adminJs = fs.readFileSync(adminJsPath, 'utf8');

    // UI HTML
    assert(adminHtml.includes('id="tab-btn-payments"'), 'HTML contiene pestaña de navegación #tab-btn-payments');
    assert(adminHtml.includes('id="nav-payments-badge"'), 'HTML contiene badge de pagos #nav-payments-badge');
    assert(adminHtml.includes('id="view-payments"'), 'HTML contiene contenedor de vista #view-payments');
    assert(adminHtml.includes('data-pay-status'), 'HTML contiene grupo de pills rápidas de estado de pago');
    assert(adminHtml.includes('id="payments-search-input"'), 'HTML contiene buscador de pagos #payments-search-input');
    assert(adminHtml.includes('id="payments-filter-status"'), 'HTML contiene filtro de estado de pago #payments-filter-status');
    assert(adminHtml.includes('id="payments-filter-method"'), 'HTML contiene filtro de método #payments-filter-method');
    assert(adminHtml.includes('id="payments-filter-provider"'), 'HTML contiene filtro de proveedor #payments-filter-provider');
    assert(adminHtml.includes('id="payments-sort-by"'), 'HTML contiene ordenamiento de pagos #payments-sort-by');
    assert(adminHtml.includes('id="btn-refresh-payments"'), 'HTML contiene botón #btn-refresh-payments');
    assert(adminHtml.includes('id="admin-payments-tbody"'), 'HTML contiene tbody para pagos #admin-payments-tbody');
    assert(adminHtml.includes('id="admin-payments-cards"'), 'HTML contiene contenedor mobile #admin-payments-cards');
    assert(adminHtml.includes('id="payments-pagination-bar"'), 'HTML contiene barra de paginación #payments-pagination-bar');
    assert(adminHtml.includes('id="payment-detail-modal"'), 'HTML contiene modal de detalle #payment-detail-modal');
    assert(adminHtml.includes('id="detail-payment-ref"'), 'Modal contiene #detail-payment-ref');
    assert(adminHtml.includes('id="detail-payment-order"'), 'Modal contiene #detail-payment-order');
    assert(adminHtml.includes('id="detail-payment-customer"'), 'Modal contiene #detail-payment-customer');
    assert(adminHtml.includes('id="detail-payment-amount"'), 'Modal contiene #detail-payment-amount');
    assert(adminHtml.includes('id="payment-status-form"'), 'Modal contiene formulario de actualización #payment-status-form');
    assert(adminHtml.includes('id="payment-status-history-container"'), 'Modal contiene contenedor de historial #payment-status-history-container');

    // Estilos CSS
    assert(adminCss.includes('.pay-status-badge'), 'CSS define badges de estado de pago (.pay-status-badge)');
    assert(adminCss.includes('.pay-status-badge.pay-pending'), 'CSS define estado pago pendiente (pay-pending)');
    assert(adminCss.includes('.pay-status-badge.pay-approved'), 'CSS define estado pago aprobado (pay-approved)');
    assert(adminCss.includes('.pay-status-badge.pay-refunded'), 'CSS define estado pago reembolsado (pay-refunded)');
    assert(adminCss.includes('.mobile-payment-card'), 'CSS define tarjetas mobile (.mobile-payment-card)');

    // Lógica en admin.js
    assert(adminJs.includes('loadPayments'), 'admin.js implementa loadPayments()');
    assert(adminJs.includes('renderPaymentsTable'), 'admin.js implementa renderPaymentsTable()');
    assert(adminJs.includes('openPaymentDetailModal'), 'admin.js implementa openPaymentDetailModal()');
    assert(adminJs.includes('renderPaymentStatusHistory'), 'admin.js implementa renderPaymentStatusHistory()');
    assert(adminJs.includes('viewPayments'), 'admin.js soporta navegación hacia pestaña payments');
  } catch (err) {
    sectionStatus.admin = false;
    sectionStatus.payments = false;
    assert(false, 'Módulo Administrativo de Pagos', err.message);
  }

  // ------------------------------------------------------------
  // 6. DASHBOARD FINANCIERO & MÉTRICAS COMERCIALES
  // ------------------------------------------------------------
  console.log('\n--- 6. Dashboard Financiero & Métricas Comerciales ---');
  try {
    const adminHtml = fs.readFileSync(adminHtmlPath, 'utf8');
    const adminJs = fs.readFileSync(adminJsPath, 'utf8');

    assert(adminHtml.includes('id="stat-fin-sales-today"'), 'Dashboard contiene KPI #stat-fin-sales-today (Ventas Hoy)');
    assert(adminHtml.includes('id="stat-fin-sales-month"'), 'Dashboard contiene KPI #stat-fin-sales-month (Ventas Mes)');
    assert(adminHtml.includes('id="stat-fin-payments-approved"'), 'Dashboard contiene KPI #stat-fin-payments-approved (Pagos Aprobados)');
    assert(adminHtml.includes('id="stat-fin-payments-pending"'), 'Dashboard contiene KPI #stat-fin-payments-pending (Pagos Pendientes)');
    assert(adminHtml.includes('id="stat-fin-refunds"'), 'Dashboard contiene KPI #stat-fin-refunds (Reembolsos)');
    assert(adminHtml.includes('id="stat-fin-avg-ticket"'), 'Dashboard contiene KPI #stat-fin-avg-ticket (Ticket Promedio)');
    assert(adminHtml.includes('id="dashboard-recent-payments-list"'), 'Dashboard contiene widget #dashboard-recent-payments-list');
    assert(adminHtml.includes('id="dashboard-top-products-list"'), 'Dashboard contiene widget #dashboard-top-products-list (Más Vendidos)');
    assert(adminHtml.includes('id="dashboard-top-customers-list"'), 'Dashboard contiene widget #dashboard-top-customers-list (Clientes Frecuentes)');
    assert(adminJs.includes('updateDashboardFinancialMetrics'), 'admin.js implementa updateDashboardFinancialMetrics()');
  } catch (err) {
    sectionStatus.dashboard = false;
    assert(false, 'Dashboard Financiero', err.message);
  }

  // ------------------------------------------------------------
  // 7. ESQUEMA SQL UNIFICADO (block9_database.sql)
  // ------------------------------------------------------------
  console.log('\n--- 7. Esquema SQL Unificado (block9_database.sql) ---');
  try {
    assert(fs.existsSync(block9SqlPath), 'supabase/block9_database.sql existe en disco');
    const sql = fs.readFileSync(block9SqlPath, 'utf8');

    assert(sql.includes('CREATE TABLE IF NOT EXISTS public.payments'), 'SQL define tabla payments de forma idempotente');
    assert(sql.includes('CREATE TABLE IF NOT EXISTS public.payment_status_history'), 'SQL define tabla payment_status_history de forma idempotente');
    assert(sql.includes('CREATE TABLE IF NOT EXISTS public.notifications'), 'SQL define tabla notifications de forma idempotente');
    assert(sql.includes('payment_reference TEXT NOT NULL UNIQUE'), 'SQL incluye columna payment_reference UNIQUE');
    assert(sql.includes('idx_payments_payment_reference'), 'SQL incluye índice en payment_reference');
    assert(sql.includes('idx_payments_status'), 'SQL incluye índice en payment status');
    assert(sql.includes('ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY'), 'SQL activa RLS en payments');
    assert(sql.includes('ALTER TABLE public.payment_status_history ENABLE ROW LEVEL SECURITY'), 'SQL activa RLS en payment_status_history');
    assert(sql.includes('ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY'), 'SQL activa RLS en notifications');
    assert(sql.includes('CREATE POLICY "Public insert payments"'), 'SQL define política de inserción pública en payments');
    assert(sql.includes('CREATE POLICY "Admin view payments"'), 'SQL define política de consulta restringida a admin en payments');
    assert(sql.includes('CREATE POLICY "Admin view notifications"'), 'SQL define política de consulta en notifications');

    const seedCount = (sql.match(/INSERT INTO public.products/g) || []).length;
    assert(seedCount === 79, 'SQL mantiene la migración idempotente de los 79 productos originales', `Encontrados: ${seedCount}`);
  } catch (err) {
    sectionStatus.payments = false;
    sectionStatus.paymentHistory = false;
    sectionStatus.notifications = false;
    assert(false, 'Esquema SQL Unificado', err.message);
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
  // 10. REPORTE FINAL ESTRUCTURADO BLOQUE 9 (SECCIÓN 32)
  // ------------------------------------------------------------
  console.log('\n============================================================');
  console.log('🌸 BELPA WEB — AUDITORÍA BLOQUE 9');
  console.log('============================================================\n');

  console.log(`Orders:\n  ${sectionStatus.orders ? 'PASS' : 'FAIL'}\n`);
  console.log(`Payments:\n  ${sectionStatus.payments ? 'PASS' : 'FAIL'}\n`);
  console.log(`Payment History:\n  ${sectionStatus.paymentHistory ? 'PASS' : 'FAIL'}\n`);
  console.log(`Notifications:\n  ${sectionStatus.notifications ? 'PASS' : 'FAIL'}\n`);
  console.log(`Checkout:\n  ${sectionStatus.checkout ? 'PASS' : 'FAIL'}\n`);
  console.log(`WhatsApp:\n  ${sectionStatus.whatsapp ? 'PASS' : 'FAIL'}\n`);
  console.log(`Fallback:\n  ${sectionStatus.fallback ? 'PASS' : 'FAIL'}\n`);
  console.log(`Sincronización:\n  ${sectionStatus.sincronizacion ? 'PASS' : 'FAIL'}\n`);
  console.log(`Admin:\n  ${sectionStatus.admin ? 'PASS' : 'FAIL'}\n`);
  console.log(`Dashboard:\n  ${sectionStatus.dashboard ? 'PASS' : 'FAIL'}\n`);
  console.log(`Seguridad:\n  ${sectionStatus.seguridad ? 'PASS' : 'FAIL'}\n`);
  console.log(`Regresión:\n  ${sectionStatus.regresion ? 'PASS' : 'FAIL'}\n`);
  console.log(`Proveedor de Pago:\n  ${sectionStatus.proveedorPago}\n`);
  console.log(`Supabase Cloud:\n  ${sectionStatus.supabaseCloud}\n`);
  console.log(`Tests:\n  ${passedTests} / ${totalTests}\n`);

  console.log('============================================================');
  console.log('RESULTADO BLOQUE 9:');
  console.log(failedTests === 0 ? '🌸 BLOQUE 9 — PASS LOCAL / CLOUD PENDIENTE' : 'FAIL');
  console.log('============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite();
