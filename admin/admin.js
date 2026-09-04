/* ==========================================================================
   BELPA CMS - MOTOR ADMINISTRATIVO (CRUD, AUTH & STORAGE WEBP) 🌸✨
   ========================================================================== */

let supabase = null;
let allProducts = [];
let currentUser = null;
let compressedImageBlob = null;

// Helper de formato de moneda COP
function formatCOP(number) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(number);
}

// Toast de feedback
function showAdminToast(message) {
    const toast = document.getElementById('admin-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = 'block';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Inicializar Supabase
function initSupabase() {
    try {
        if (window.supabase && window.BELPA_CONFIG && window.BELPA_CONFIG.SUPABASE_URL && window.BELPA_CONFIG.SUPABASE_ANON_KEY) {
            supabase = window.supabase.createClient(
                window.BELPA_CONFIG.SUPABASE_URL,
                window.BELPA_CONFIG.SUPABASE_ANON_KEY
            );
        }
    } catch (e) {
        console.warn("Supabase no inicializado aún:", e);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    initSupabase();
    initAuthListeners();
    initEventListeners();
    await checkSession();
});

// --- 1. AUTENTICACIÓN Y SESIÓN ---
function initAuthListeners() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const errorAlert = document.getElementById('login-error-alert');
            const submitBtn = document.getElementById('login-submit-btn');

            if (errorAlert) errorAlert.style.display = 'none';
            if (submitBtn) submitBtn.disabled = true;

            try {
                if (!supabase) {
                    throw new Error("Configura tus credenciales de Supabase en admin/config.js");
                }

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;

                currentUser = data.user;
                showAdminToast("¡Bienvenido al panel de Belpa! 🌸");
                showDashboard(currentUser);
            } catch (err) {
                if (errorAlert) {
                    errorAlert.textContent = err.message || "Credenciales incorrectas.";
                    errorAlert.style.display = 'block';
                }
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (supabase) {
                await supabase.auth.signOut();
            }
            currentUser = null;
            showLogin();
            showAdminToast("Sesión cerrada correctamente.");
        });
    }
}

async function checkSession() {
    if (!supabase) {
        showLogin();
        return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user) {
        currentUser = session.user;
        showDashboard(currentUser);
    } else {
        showLogin();
    }
}

function showLogin() {
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('dashboard-section').style.display = 'none';
}

function showDashboard(user) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    
    const userEmailEl = document.getElementById('admin-user-email');
    if (userEmailEl && user) {
        userEmailEl.textContent = user.email;
    }

    loadProducts();
}

// --- 2. GESTIÓN DE PRODUCTOS (CRUD) ---
async function loadProducts() {
    const tbody = document.getElementById('admin-products-tbody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px;">Cargando productos de la base de datos... 🌸</td></tr>';
    }

    try {
        let products = [];
        if (supabase) {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: false });
            
            if (error) throw error;
            products = data || [];
        }

        // Si la base de datos aún no tiene registros, cargar catálogo local como respaldo
        if (!products || products.length === 0) {
            const resp = await fetch('../catalog_data.json');
            products = await resp.json();
        }

        allProducts = products;
        updateMetrics();
        renderProductsTable();
    } catch (err) {
        console.error("Error al cargar productos:", err);
        // Fallback local
        const resp = await fetch('../catalog_data.json');
        allProducts = await resp.json();
        updateMetrics();
        renderProductsTable();
    }
}

function updateMetrics() {
    const totalEl = document.getElementById('stat-total-products');
    const floraEl = document.getElementById('stat-flora-products');
    const beautyEl = document.getElementById('stat-beauty-products');
    const activeEl = document.getElementById('stat-active-products');

    const total = allProducts.length;
    const flora = allProducts.filter(p => p.brand === 'flora').length;
    const beauty = allProducts.filter(p => p.brand === 'beauty').length;
    const active = allProducts.filter(p => p.is_active !== false).length;

    if (totalEl) totalEl.textContent = total;
    if (floraEl) floraEl.textContent = flora;
    if (beautyEl) beautyEl.textContent = beauty;
    if (activeEl) activeEl.textContent = active;
}

function renderProductsTable() {
    const tbody = document.getElementById('admin-products-tbody');
    if (!tbody) return;

    const searchTerm = document.getElementById('admin-search-input')?.value.toLowerCase().trim() || '';
    const brandFilter = document.getElementById('admin-filter-brand')?.value || 'all';
    const statusFilter = document.getElementById('admin-filter-status')?.value || 'all';

    const filtered = allProducts.filter(p => {
        const matchBrand = (brandFilter === 'all') || (p.brand === brandFilter);
        const isActive = p.is_active !== false;
        const matchStatus = (statusFilter === 'all') || (statusFilter === 'active' && isActive) || (statusFilter === 'inactive' && !isActive);
        const matchSearch = !searchTerm || 
            p.name.toLowerCase().includes(searchTerm) || 
            p.category.toLowerCase().includes(searchTerm) || 
            String(p.price).toLowerCase().includes(searchTerm);
        
        return matchBrand && matchStatus && matchSearch;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">No se encontraron productos con los filtros seleccionados.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(p => {
        const isActive = p.is_active !== false;
        const brandBadge = p.brand === 'beauty' 
            ? '<span class="badge-brand beauty">💄 BelpaBeauty</span>' 
            : '<span class="badge-brand flora">🌹 BelFlora</span>';
        
        const imgSrc = (p.images && p.images[0]) ? (p.images[0].startsWith('http') ? p.images[0] : '../' + p.images[0]) : '../assets/optimized/product_1.webp';

        return `
            <tr data-id="${p.id}">
                <td>
                    <img src="${imgSrc}" alt="${p.name}" class="table-product-thumb" loading="lazy">
                </td>
                <td>
                    <strong style="font-family:var(--font-cute); font-size:0.92rem;">${p.name}</strong>
                    ${p.badge ? `<span style="font-size:0.7rem; color:var(--rose-dusty); display:block;">${p.badge}</span>` : ''}
                </td>
                <td>${brandBadge}</td>
                <td style="font-size:0.8rem; color:var(--charcoal-soft);">${p.category}</td>
                <td><strong style="color:var(--burgundy-accent);">${p.price}</strong></td>
                <td>
                    <button class="status-toggle ${isActive ? 'active' : 'inactive'}" onclick="handleToggleStatus(${p.id}, ${isActive})">
                        ${isActive ? '● Activo' : '○ Inactivo'}
                    </button>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn-icon" title="Editar" onclick="handleEditProduct(${p.id})">✏️</button>
                        <button class="btn-icon delete" title="Eliminar" onclick="handleDeleteProduct(${p.id})">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// --- 3. OPTIMIZADOR WEBP EN CLIENTE ---
async function compressImageToWebP(file, maxDimension = 800, quality = 0.82) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                if (width > height) {
                    if (width > maxDimension) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    }
                } else {
                    if (height > maxDimension) {
                        width = Math.round((width * maxDimension) / height);
                        height = maxDimension;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error("No se pudo comprimir la imagen"));
                }, 'image/webp', quality);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// --- 4. EVENTOS DE INTERFAZ Y FORMULARIO ---
function initEventListeners() {
    // Buscador y filtros
    document.getElementById('admin-search-input')?.addEventListener('input', renderProductsTable);
    document.getElementById('admin-filter-brand')?.addEventListener('change', renderProductsTable);
    document.getElementById('admin-filter-status')?.addEventListener('change', renderProductsTable);

    // Modal Crear/Editar
    const modal = document.getElementById('product-modal');
    const openCreateBtn = document.getElementById('btn-open-create-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    if (openCreateBtn) openCreateBtn.addEventListener('click', () => openProductModal());
    if (closeBtn) closeBtn.addEventListener('click', closeProductModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeProductModal);

    // Dropzone de Imagen
    const dropzone = document.getElementById('image-dropzone');
    const fileInput = document.getElementById('prod-file-input');
    const previewImg = document.getElementById('prod-image-preview');

    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                dropzone.querySelector('span').textContent = '⏳ Comprimiendo imagen a WebP...';
                compressedImageBlob = await compressImageToWebP(file);
                const previewUrl = URL.createObjectURL(compressedImageBlob);
                
                if (previewImg) {
                    previewImg.src = previewUrl;
                    previewImg.style.display = 'block';
                }
                dropzone.querySelector('span').textContent = `✓ Imagen lista (${(compressedImageBlob.size / 1024).toFixed(1)} KB WebP)`;
            } catch (err) {
                alert("Error al procesar la imagen: " + err.message);
                dropzone.querySelector('span').textContent = '📷 Haz clic para seleccionar una foto';
            }
        });
    }

    
    // Modal Configuración Supabase
    const configModal = document.getElementById('config-modal');
    const openConfigLoginBtn = document.getElementById('btn-open-config-login');
    const openConfigNavBtn = document.getElementById('btn-open-config-nav');
    const closeConfigBtn = document.getElementById('config-modal-close-btn');
    const cancelConfigBtn = document.getElementById('config-modal-cancel-btn');
    const configForm = document.getElementById('config-form');

    function openConfigModal() {
        if (!configModal) return;
        const cfgUrlInput = document.getElementById('cfg-url');
        const cfgKeyInput = document.getElementById('cfg-key');
        if (cfgUrlInput && window.BELPA_CONFIG.isConfigured()) {
            cfgUrlInput.value = window.BELPA_CONFIG.SUPABASE_URL;
        }
        if (cfgKeyInput && window.BELPA_CONFIG.isConfigured()) {
            cfgKeyInput.value = window.BELPA_CONFIG.SUPABASE_ANON_KEY;
        }
        configModal.classList.add('open');
    }

    function closeConfigModal() {
        if (configModal) configModal.classList.remove('open');
    }

    if (openConfigLoginBtn) openConfigLoginBtn.addEventListener('click', openConfigModal);
    if (openConfigNavBtn) openConfigNavBtn.addEventListener('click', openConfigModal);
    if (closeConfigBtn) closeConfigBtn.addEventListener('click', closeConfigModal);
    if (cancelConfigBtn) cancelConfigBtn.addEventListener('click', closeConfigModal);

    if (configForm) {
        configForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const url = document.getElementById('cfg-url').value.trim();
            const key = document.getElementById('cfg-key').value.trim();

            if (!url || !key) {
                alert('Por favor completa ambos campos.');
                return;
            }

            window.BELPA_CONFIG.saveCredentials(url, key);
            initSupabase();

            try {
                // Probar consulta básica
                if (supabase) {
                    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
                    if (error) throw error;
                    showAdminToast('¡Conexión exitosa con Supabase! ✨');
                } else {
                    showAdminToast('Credenciales guardadas.');
                }
                closeConfigModal();
            } catch (err) {
                alert('Aviso de conexión: Se guardaron las credenciales, pero la prueba devolvió un aviso: ' + err.message + '\n\nAsegúrate de haber ejecutado el script admin/supabase-schema.sql en tu proyecto.');
                closeConfigModal();
            }
        });
    }

    // Submit Formulario Producto
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', handleSaveProduct);
    }
}

function openProductModal(product = null) {
    const modal = document.getElementById('product-modal');
    const titleEl = document.getElementById('modal-product-title');
    const form = document.getElementById('product-form');
    const previewImg = document.getElementById('prod-image-preview');
    const dropzoneSpan = document.querySelector('#image-dropzone span');

    form.reset();
    compressedImageBlob = null;

    if (product) {
        titleEl.textContent = 'Editar Producto #' + product.id;
        document.getElementById('prod-id').value = product.id;
        document.getElementById('prod-name').value = product.name;
        document.getElementById('prod-brand').value = product.brand;
        document.getElementById('prod-raw-price').value = product.rawPrice || product.raw_price || 0;
        document.getElementById('prod-category').value = product.category;
        document.getElementById('prod-badge').value = product.badge || '';
        document.getElementById('prod-desc').value = product.description || '';
        document.getElementById('prod-active').checked = product.is_active !== false;

        const currentImg = (product.images && product.images[0]) ? product.images[0] : '';
        document.getElementById('prod-current-image-url').value = currentImg;
        if (currentImg && previewImg) {
            previewImg.src = currentImg.startsWith('http') ? currentImg : '../' + currentImg;
            previewImg.style.display = 'block';
        }
        if (dropzoneSpan) dropzoneSpan.textContent = '📷 Haz clic para reemplazar la foto';
    } else {
        titleEl.textContent = 'Crear Nuevo Producto 🌸';
        document.getElementById('prod-id').value = '';
        document.getElementById('prod-current-image-url').value = '';
        if (previewImg) previewImg.style.display = 'none';
        if (dropzoneSpan) dropzoneSpan.textContent = '📷 Haz clic para seleccionar una foto';
    }

    modal.classList.add('open');
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.remove('open');
}

async function handleSaveProduct(e) {
    e.preventDefault();
    const saveBtn = document.getElementById('modal-save-btn');
    if (saveBtn) saveBtn.disabled = true;

    const id = document.getElementById('prod-id').value;
    const name = document.getElementById('prod-name').value.trim();
    const brand = document.getElementById('prod-brand').value;
    const rawPrice = parseInt(document.getElementById('prod-raw-price').value, 10) || 0;
    const priceFormatted = formatCOP(rawPrice) + ' COP';
    const category = document.getElementById('prod-category').value.trim();
    const badge = document.getElementById('prod-badge').value.trim();
    const description = document.getElementById('prod-desc').value.trim();
    const isActive = document.getElementById('prod-active').checked;
    let imageUrl = document.getElementById('prod-current-image-url').value;

    try {
        // 1. Subir imagen si se seleccionó una nueva
        if (compressedImageBlob && supabase) {
            const fileName = `prod_${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
            const { data: uploadData, error: uploadErr } = await supabase.storage
                .from(window.BELPA_CONFIG.STORAGE_BUCKET || 'belpa-products')
                .upload(fileName, compressedImageBlob, { contentType: 'image/webp' });

            if (uploadErr) throw uploadErr;

            const { data: { publicUrl } } = supabase.storage
                .from(window.BELPA_CONFIG.STORAGE_BUCKET || 'belpa-products')
                .getPublicUrl(fileName);

            imageUrl = publicUrl;
        }

        if (!imageUrl) {
            imageUrl = 'assets/optimized/product_1.webp';
        }

        const filterCategory = category.toLowerCase().replace(/[^a-z0-9]/g, '_');

        const productPayload = {
            name,
            brand,
            category,
            filter_category: filterCategory,
            price: priceFormatted,
            raw_price: rawPrice,
            badge,
            description,
            images: [imageUrl],
            is_active: isActive,
            updated_at: new Date().toISOString()
        };

        if (supabase) {
            if (id) {
                const { error } = await supabase.from('products').update(productPayload).eq('id', id);
                if (error) throw error;
                showAdminToast("¡Producto actualizado exitosamente! 🌸");
            } else {
                const { error } = await supabase.from('products').insert([productPayload]);
                if (error) throw error;
                showAdminToast("¡Nuevo producto creado exitosamente! ✨");
            }
        } else {
            // Local fallback simulation
            if (id) {
                const idx = allProducts.findIndex(p => p.id == id);
                if (idx !== -1) {
                    allProducts[idx] = { ...allProducts[idx], ...productPayload, rawPrice, filterCategory };
                }
            } else {
                const newId = Math.max(...allProducts.map(p => p.id), 0) + 1;
                allProducts.unshift({ id: newId, ...productPayload, rawPrice, filterCategory });
            }
            showAdminToast("Producto guardado localmente.");
        }

        closeProductModal();
        await loadProducts();
    } catch (err) {
        alert("Error al guardar producto: " + err.message);
    } finally {
        if (saveBtn) saveBtn.disabled = false;
    }
}

// Global actions
window.handleToggleStatus = async function(id, currentStatus) {
    try {
        const newStatus = !currentStatus;
        if (supabase) {
            const { error } = await supabase.from('products').update({ is_active: newStatus }).eq('id', id);
            if (error) throw error;
        } else {
            const p = allProducts.find(prod => prod.id == id);
            if (p) p.is_active = newStatus;
        }
        showAdminToast(newStatus ? "Producto activado en tienda 🌸" : "Producto ocultado de la tienda 🔒");
        await loadProducts();
    } catch (err) {
        alert("Error al cambiar estado: " + err.message);
    }
};

window.handleEditProduct = function(id) {
    const product = allProducts.find(p => p.id == id);
    if (product) openProductModal(product);
};

window.handleDeleteProduct = async function(id) {
    const p = allProducts.find(prod => prod.id == id);
    const pName = p ? p.name : 'este producto';

    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente "${pName}"?\nEsta acción no se puede deshacer.`)) {
        return;
    }

    try {
        if (supabase) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
        } else {
            allProducts = allProducts.filter(prod => prod.id != id);
        }
        showAdminToast("Producto eliminado permanentemente.");
        await loadProducts();
    } catch (err) {
        alert("Error al eliminar: " + err.message);
    }
};
