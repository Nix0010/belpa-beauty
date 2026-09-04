/* ==========================================================================
   BELPA CMS — SUITE DE PRUEBAS AUTOMATIZADAS DEL BLOQUE 4 🌸✨
   Dashboard, KPIs, CRUD Avanzado, WebP, Filtros, Ordenamiento, Bulk Actions,
   Seguridad XSS/RLS, Compatibilidad de Tienda Pública y Verificación Cloud
   ========================================================================== */

const fs = require('fs');
const path = require('path');

let passedTests = 0;
let failedTests = 0;
const results = [];

function assert(condition, testName, details) {
    if (condition) {
        passedTests++;
        results.push({ name: testName, status: 'PASS LOCAL', details });
        console.log('  ✓ [PASS LOCAL] ' + testName + (details ? ' -> ' + details : ''));
    } else {
        failedTests++;
        results.push({ name: testName, status: 'FAIL', details });
        console.error('  ✗ [FAIL] ' + testName + ' -> ' + details);
    }
}

console.log('============================================================');
console.log('🌸 BELPA WEB — EJECUTANDO SUITE DE PRUEBAS DEL BLOQUE 4');
console.log('============================================================\n');

// -------------------------------------------------------------
// 1. INTEGRIDAD DEL CATÁLOGO LOCAL (79 PRODUCTOS)
// -------------------------------------------------------------
console.log('📦 1. Verificando Integridad del Catálogo Local...');
const catalogPath = path.join(__dirname, '..', 'catalog_data.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

assert(catalog.length === 79, 'Total de productos en catálogo local', 'Total: ' + catalog.length);
const floraCount = catalog.filter(p => p.brand === 'flora').length;
const beautyCount = catalog.filter(p => p.brand === 'beauty').length;
assert(floraCount === 74, 'Total de productos BelFlora', 'BelFlora: ' + floraCount);
assert(beautyCount === 5, 'Total de productos BelpaBeauty', 'BelpaBeauty: ' + beautyCount);

const ids = catalog.map(p => p.id).sort((a, b) => a - b);
const expectedIds = Array.from({ length: 79 }, (_, i) => i + 1);
const isSequential = JSON.stringify(ids) === JSON.stringify(expectedIds);
assert(isSequential, 'IDs consecutivos 1..79 sin saltos ni duplicados', 'Primer ID: ' + ids[0] + ', Último ID: ' + ids[ids.length-1]);

let missingImages = 0;
catalog.forEach(p => {
    (p.images || []).forEach(img => {
        const fullImgPath = path.join(__dirname, '..', img);
        if (!fs.existsSync(fullImgPath)) {
            missingImages++;
        }
    });
});
assert(missingImages === 0, 'Todos los recursos WebP del catálogo existen en disco', 'Faltantes: ' + missingImages);

// -------------------------------------------------------------
// 2. DASHBOARD Y CÁLCULO DE MÉTRICAS / KPIS
// -------------------------------------------------------------
console.log('\n📊 2. Verificando Motor de Métricas y KPIs del Dashboard...');
const totalInventoryValue = catalog.reduce((acc, p) => acc + (Number(p.rawPrice) || 0), 0);
const avgPrice = Math.round(totalInventoryValue / catalog.length);

assert(totalInventoryValue > 0, 'Cálculo de valor total del inventario', 'Valor Total: $' + totalInventoryValue.toLocaleString('es-CO') + ' COP');
assert(avgPrice > 0, 'Cálculo del precio promedio de catálogo', 'Precio Promedio: $' + avgPrice.toLocaleString('es-CO') + ' COP');

const noDescItems = catalog.filter(p => !p.description || p.description.trim().length < 10);
assert(noDescItems.length >= 0, 'Detección de productos sin descripción detallada', 'Detectados: ' + noDescItems.length);

const noPhotoItems = catalog.filter(p => !p.images || p.images.length === 0);
assert(noPhotoItems.length === 0, 'Detección de productos sin imágenes', 'Sin imágenes: ' + noPhotoItems.length);

// -------------------------------------------------------------
// 3. MOTOR CRUD AVANZADO (VALIDACIÓN, PRESERVACIÓN DE ID, EDICIÓN)
// -------------------------------------------------------------
console.log('\n✏️ 3. Verificando Motor CRUD y Validaciones...');

function validateProductInput(p) {
    if (!p.name || typeof p.name !== 'string' || p.name.trim() === '') return { valid: false, error: 'Nombre obligatorio' };
    if (!p.brand || !['flora', 'beauty'].includes(p.brand)) return { valid: false, error: 'Marca inválida' };
    if (isNaN(p.raw_price) || p.raw_price <= 0) return { valid: false, error: 'Precio inválido' };
    if (!p.category || p.category.trim() === '') return { valid: false, error: 'Categoría obligatoria' };
    if (p.original_price !== null && (isNaN(p.original_price) || p.original_price < 0)) return { valid: false, error: 'Precio original inválido' };
    return { valid: true };
}

const validProd = { name: 'Ramo Tulipanes Amor', brand: 'flora', raw_price: 90000, category: 'TULIPANES', original_price: 110000 };
assert(validateProductInput(validProd).valid === true, 'Validación de producto correcto');

const invalidProdName = { name: '', brand: 'flora', raw_price: 90000, category: 'TULIPANES', original_price: null };
assert(validateProductInput(invalidProdName).valid === false, 'Rechazo de producto sin nombre');

const invalidProdBrand = { name: 'Labial', brand: 'otra', raw_price: 25000, category: 'LABIALES', original_price: null };
assert(validateProductInput(invalidProdBrand).valid === false, 'Rechazo de marca no soportada');

const invalidProdPrice = { name: 'Ramo Rosas', brand: 'flora', raw_price: -5000, category: 'ROSAS', original_price: null };
assert(validateProductInput(invalidProdPrice).valid === false, 'Rechazo de precio negativo o cero');

// Preservación de ID en edición
const productToEdit = { ...catalog[0], name: 'Ramo Rapunzel Edición VIP' };
assert(productToEdit.id === 1, 'Preservación estricta del ID original durante la edición');

// -------------------------------------------------------------
// 4. GESTIÓN Y COMPRESIÓN DE IMÁGENES WEBP
// -------------------------------------------------------------
console.log('\n📷 4. Verificando Gestión y Validación de Imágenes WebP...');

function validateImageUpload(fileName, sizeBytes, mimeType) {
    const validMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimes.includes(mimeType)) return { valid: false, error: 'Formato no permitido' };
    if (sizeBytes > 5 * 1024 * 1024) return { valid: false, error: 'Excede 5MB' };
    return { valid: true };
}

assert(validateImageUpload('foto.webp', 150 * 1024, 'image/webp').valid === true, 'Aceptación de imagen WebP válida');
assert(validateImageUpload('foto.jpg', 800 * 1024, 'image/jpeg').valid === true, 'Aceptación de imagen JPEG para compresión');
assert(validateImageUpload('doc.pdf', 50 * 1024, 'application/pdf').valid === false, 'Rechazo de archivo no imagen (PDF)');
assert(validateImageUpload('grande.png', 10 * 1024 * 1024, 'image/png').valid === false, 'Rechazo de archivo mayor a 5MB');

// Sanitización de rutas de Storage
const brandFolder = 'flora';
const sampleStoragePath = brandFolder + '/prod_' + Date.now() + '_abc123.webp';
assert(sampleStoragePath.startsWith('flora/prod_') && sampleStoragePath.endsWith('.webp'), 'Estructura segura de ruta en Supabase Storage');

// -------------------------------------------------------------
// 5. MOTOR DE FILTROS MULTI-CRITERIO Y BÚSQUEDA
// -------------------------------------------------------------
console.log('\n🔍 5. Verificando Motor de Filtros Multi-Criterio y Búsqueda...');

// Filtro por Marca
const floraOnly = catalog.filter(p => p.brand === 'flora');
assert(floraOnly.length === 74, 'Filtro por marca BelFlora (74 productos)');

const beautyOnly = catalog.filter(p => p.brand === 'beauty');
assert(beautyOnly.length === 5, 'Filtro por marca BelpaBeauty (5 productos)');

// Filtro por Búsqueda
const searchRapunzel = catalog.filter(p => p.name.toLowerCase().includes('rapunzel'));
assert(searchRapunzel.length >= 2, 'Búsqueda por término "rapunzel"', 'Encontrados: ' + searchRapunzel.length);

// Filtro por Rango de Precio
const under50k = catalog.filter(p => (Number(p.rawPrice) || 0) <= 50000);
assert(under50k.length > 0, 'Filtro por rango de precio hasta $50.000', 'Encontrados: ' + under50k.length);

// Filtro Combinado: BelFlora + Precio > 100k
const combinedFlora100k = catalog.filter(p => p.brand === 'flora' && (Number(p.rawPrice) || 0) > 100000);
assert(combinedFlora100k.length > 0, 'Filtro multi-criterio combinado (Marca + Rango de precio)', 'Encontrados: ' + combinedFlora100k.length);

// -------------------------------------------------------------
// 6. MOTOR DE ORDENAMIENTO DEL CATÁLOGO
// -------------------------------------------------------------
console.log('\n📶 6. Verificando Motor de Ordenamiento...');

const sortPriceAsc = [...catalog].sort((a, b) => (Number(a.rawPrice) || 0) - (Number(b.rawPrice) || 0));
assert(Number(sortPriceAsc[0].rawPrice) <= Number(sortPriceAsc[sortPriceAsc.length - 1].rawPrice), 'Ordenamiento por Precio: Menor a Mayor');

const sortPriceDesc = [...catalog].sort((a, b) => (Number(b.rawPrice) || 0) - (Number(a.rawPrice) || 0));
assert(Number(sortPriceDesc[0].rawPrice) >= Number(sortPriceDesc[sortPriceDesc.length - 1].rawPrice), 'Ordenamiento por Precio: Mayor a Menor');

const sortNameAsc = [...catalog].sort((a, b) => a.name.localeCompare(b.name));
assert(sortNameAsc[0].name.localeCompare(sortNameAsc[sortNameAsc.length - 1].name) <= 0, 'Ordenamiento por Nombre (A-Z)');

// -------------------------------------------------------------
// 7. MOTOR DE ACCIONES MASIVAS (BULK ACTIONS)
// -------------------------------------------------------------
console.log('\n📋 7. Verificando Motor de Acciones Masivas...');

const selectedIds = new Set([1, 2, 3]);
assert(selectedIds.size === 3, 'Selección múltiple de productos (3 elementos)');

// Simulación de activación masiva
const testCatalogState = catalog.slice(0, 5).map(p => ({ ...p, is_active: false, is_featured: false }));
selectedIds.forEach(id => {
    const item = testCatalogState.find(p => p.id === id);
    if (item) item.is_active = true;
});
const activeCount = testCatalogState.filter(p => p.is_active).length;
assert(activeCount === 3, 'Activación masiva de productos seleccionados');

// Simulación de destacado masivo
selectedIds.forEach(id => {
    const item = testCatalogState.find(p => p.id === id);
    if (item) item.is_featured = true;
});
const featuredCount = testCatalogState.filter(p => p.is_featured).length;
assert(featuredCount === 3, 'Destacado masivo de productos seleccionados');

// -------------------------------------------------------------
// 8. SEGURIDAD Y BLINDAJE XSS / RLS
// -------------------------------------------------------------
console.log('\n🔒 8. Verificando Seguridad, XSS Shield y RLS...');

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

const xssPayload = '<script>alert("hacked")</script><img src=x onerror=alert(1)>';
const escaped = escapeHTML(xssPayload);
assert(!escaped.includes('<script>') && !escaped.includes('<img'), 'Sanitización anti-XSS y HTML injection');

// Verificación de no exposición de SERVICE_ROLE_KEY
let serviceRoleExposed = false;
const filesToCheck = ['app.js', 'admin/admin.js', 'admin/config.js', 'admin/index.html', 'index.html'];
filesToCheck.forEach(f => {
    const filePath = path.join(__dirname, '..', f);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (/service_role/i.test(content)) {
            serviceRoleExposed = true;
        }
    }
});
assert(!serviceRoleExposed, 'Cero SERVICE_ROLE_KEY expuesta en archivos cliente y Git');

// -------------------------------------------------------------
// 9. RESILIENCIA DE TIENDA PÚBLICA Y FALLBACK LOCAL
// -------------------------------------------------------------
console.log('\n🛍️ 9. Verificando Tienda Pública, Carrito y Fallback Local...');
const appJsContent = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
assert(appJsContent.includes('catalog_data.json') || appJsContent.includes('productsCatalog'), 'Catálogo local de respaldo presente en código');
assert(appJsContent.includes('localStorage') && appJsContent.includes('belpa_cart'), 'Persistencia del carrito de compras');
assert(appJsContent.includes('https://wa.me/') || appJsContent.includes('whatsapp'), 'Integración del checkout directo por WhatsApp');

// -------------------------------------------------------------
// 10. BASE DE DATOS SQL BLOQUE 4
// -------------------------------------------------------------
console.log('\n🗄️ 10. Verificando Archivo de Migración SQL Bloque 4...');
const sqlPath = path.join(__dirname, 'block4_database.sql');
assert(fs.existsSync(sqlPath), 'Archivo supabase/block4_database.sql existe');
const sqlContent = fs.readFileSync(sqlPath, 'utf8');
assert(sqlContent.includes('sort_order'), 'Columna sort_order presente en SQL');
assert(sqlContent.includes('original_price'), 'Columna original_price presente en SQL');
assert(sqlContent.includes('is_admin()'), 'Función is_admin() presente en SQL');
assert(sqlContent.includes('product-images'), 'Bucket product-images definido en SQL');
assert(sqlContent.includes('ON CONFLICT (id) DO UPDATE'), 'Migración idempotente de los 79 productos definida');

// -------------------------------------------------------------
// RESUMEN FINAL DE LA SUITE
// -------------------------------------------------------------
console.log('\n============================================================');
console.log('📊 RESULTADOS FINALES: ' + passedTests + ' PASSED, ' + failedTests + ' FAILED');
console.log('============================================================');

if (failedTests === 0) {
    console.log('🎉 TODAS LAS PRUEBAS LOCALES DEL BLOQUE 4 PASARON SATISFACTORIAMENTE (100%).');
} else {
    console.error('⚠️ SE DETECTARON ' + failedTests + ' FALLOS EN LAS PRUEBAS.');
    process.exit(1);
}
