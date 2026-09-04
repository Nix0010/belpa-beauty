const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');
const catalogPath = path.join(projectDir, 'catalog_data.json');
const configPath = path.join(projectDir, 'admin', 'config.js');

console.log('====================================================');
console.log('🌸 BELPA CMS — VALIDACIÓN Y MIGRACIÓN DE PRODUCTOS');
console.log('====================================================');

if (!fs.existsSync(catalogPath)) {
    console.error('ERROR: No se encontró catalog_data.json');
    process.exit(1);
}

const products = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

console.log('\n[PASO 1] Validando integridad de los productos en catalog_data.json...');

let validationErrors = [];

if (products.length !== 79) {
    validationErrors.push(`Total de productos inválido: se esperaban 79, se encontraron ${products.length}`);
}

const floraCount = products.filter(p => p.brand === 'flora').length;
const beautyCount = products.filter(p => p.brand === 'beauty').length;

if (floraCount !== 74) {
    validationErrors.push(`Conteo BelFlora inválido: se esperaban 74, se encontraron ${floraCount}`);
}
if (beautyCount !== 5) {
    validationErrors.push(`Conteo BelpaBeauty inválido: se esperaban 5, se encontraron ${beautyCount}`);
}

const ids = products.map(p => p.id);
const uniqueIds = new Set(ids);
if (uniqueIds.size !== products.length) {
    validationErrors.push('Existen IDs duplicados en el catálogo.');
}

for (let i = 1; i <= 79; i++) {
    if (!uniqueIds.has(i)) {
        validationErrors.push(`Falta el ID ${i} en la secuencia.`);
    }
}

products.forEach(p => {
    if (!p.name || p.name.trim().length === 0) {
        validationErrors.push(`Producto ID ${p.id} tiene nombre vacío.`);
    }
    if (typeof p.rawPrice !== 'number' || p.rawPrice <= 0) {
        validationErrors.push(`Producto ID ${p.id} tiene rawPrice inválido: ${p.rawPrice}`);
    }
    if (!p.price || !p.price.includes('COP')) {
        validationErrors.push(`Producto ID ${p.id} tiene precio inválido: ${p.price}`);
    }

    if (p.images && Array.isArray(p.images)) {
        p.images.forEach(img => {
            const cleanPath = img.replace(/^(\.\.\/|\/)/, '');
            const fullImgPath = path.join(projectDir, cleanPath);
            if (!fs.existsSync(fullImgPath)) {
                validationErrors.push(`Producto ID ${p.id}: Imagen no encontrada -> ${cleanPath}`);
            }
        });
    }
});

if (validationErrors.length > 0) {
    console.error('\n❌ VALIDACIÓN FALLIDA — SE CANCELA LA MIGRACIÓN:');
    validationErrors.forEach(err => console.error('  - ' + err));
    process.exit(1);
}

console.log('✅ Validación completada con CERO errores:');
console.log(`  - Total productos: ${products.length} (74 BelFlora, 5 BelpaBeauty)`);
console.log('  - IDs únicos y consecutivos del 1 al 79: OK');
console.log('  - Precios numéricos y formatos COP: OK');
console.log('  - Archivos físicos WebP en disco: OK');

console.log('\n[PASO 2] Archivo de migración SQL generado y listo:');
console.log('  📄 supabase/block3_database.sql');
console.log('\nPara ejecutar la migración:');
console.log('1. Abre el SQL Editor en Supabase (https://supabase.com).');
console.log('2. Pega y ejecuta supabase/block3_database.sql.');
console.log('3. Comprueba el resultado con la consulta de verificación incluida al final del archivo.');