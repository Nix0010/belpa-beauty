/* ==========================================================================
   BELPA CMS - MOTOR ADMINISTRATIVO BOUTIQUE (BLOQUE 4) 🌸✨
   Dashboard en tiempo real, KPIs, CRUD Avanzado, WebP, Filtros, Ordenamiento y Acciones Masivas
   ========================================================================== */

let supabase = null;
let allProducts = [];
let currentUser = null;
let compressedImageBlob = null;
let currentPage = 1;
let pageSize = 20;
let pendingDeleteId = null;
let selectedProductIds = new Set();
let pendingBulkAction = null;
let searchDebounceTimeout = null;

// Helper: Escape HTML exhaustivo para blindaje contra inyecciones XSS
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Helper: Formato de moneda COP ($85.000)
function formatCOP(number) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(Number(number) || 0);
}

// Helper: Toast de feedback visual no intrusivo
function showAdminToast(message) {
    const toast = document.getElementById('admin-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = 'block';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.style.display = 'none';
    }, 3200);
}

// Helper: Alertas visuales en pantalla de Login
function showLoginAlert(message, type = 'error') {
    const alertEl = document.getElementById('login-alert');
    if (!alertEl) return;
    if (!message) {
        alertEl.style.display = 'none';
        return;
    }
    alertEl.textContent = message;
    alertEl.className = 'admin-alert ' + type;
    alertEl.style.display = 'block';
}

// Limpiar errores inline de formularios
function clearFieldErrors() {
    document.querySelectorAll('.field-error').forEach(el => {
        el.textContent = '';
    });
    document.querySelectorAll('.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
    });
}

// Inicializar Supabase Client con verificación segura
function initSupabase() {
    try {
        if (window.supabase && window.BELPA_CONFIG && window.BELPA_CONFIG.isConfigured()) {
            supabase = window.supabase.createClient(
                window.BELPA_CONFIG.SUPABASE_URL,
                window.BELPA_CONFIG.SUPABASE_ANON_KEY
            );
        } else if (window.supabase && window.BELPA_CONFIG) {
            supabase = window.supabase.createClient(
                window.BELPA_CONFIG.SUPABASE_URL,
                window.BELPA_CONFIG.SUPABASE_ANON_KEY
            );
        }
    } catch (e) {
        console.warn('Supabase no inicializado aún:', e);
    }
}

// 1. INICIALIZACIÓN Y CONTROL DE ACCESO
document.addEventListener('DOMContentLoaded', async () => {
    initSupabase();
    initAuthListeners();
    initEventListeners();
    initTabNavigation();
    await checkSession();
});

async function checkSession() {
    showLoginAlert('Verificando acceso...', 'info');

    if (!supabase || !window.BELPA_CONFIG.isConfigured()) {
        showLogin();
        showLoginAlert('Supabase aún no está conectado. Puedes ingresar tus credenciales en el botón de abajo o navegar en modo local.', 'info');
        return;
    }

    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!session || !session.user) {
            showLogin();
            showLoginAlert('');
            return;
        }

        const isAuthorized = await verifyAdminRole(session.user.id);
        if (isAuthorized) {
            currentUser = session.user;
            showLoginAlert('');
            showDashboard(currentUser);
        } else {
            await supabase.auth.signOut();
            currentUser = null;
            showLogin();
            showLoginAlert('Tu cuenta no tiene permisos de administrador en admin_users.', 'error');
        }
    } catch (err) {
        console.error('Error al verificar sesión:', err);
        showLogin();
        showLoginAlert('No pudimos conectar con el servicio. Intenta nuevamente.', 'error');
    }
}

async function verifyAdminRole(userId) {
    if (!supabase) return false;
    try {
        const { data, error } = await supabase
            .from('admin_users')
            .select('role, is_active')
            .eq('id', userId)
            .single();

        if (error) {
            console.warn('Verificación admin_users:', error.message);
            return false;
        }

        return data && data.role === 'admin' && data.is_active === true;
    } catch (e) {
        console.error('Fallo en verifyAdminRole:', e);
        return false;
    }
}

function showLogin() {
    const loginSec = document.getElementById('login-section');
    const dashSec = document.getElementById('dashboard-section');
    if (loginSec) loginSec.style.display = 'flex';
    if (dashSec) dashSec.style.display = 'none';
}

function showDashboard(user) {
    const loginSec = document.getElementById('login-section');
    const dashSec = document.getElementById('dashboard-section');
    if (loginSec) loginSec.style.display = 'none';
    if (dashSec) dashSec.style.display = 'block';

    const userEmailEl = document.getElementById('admin-user-email');
    if (userEmailEl && user) {
        userEmailEl.textContent = user.email || 'admin@belpa.co';
    }

    loadProducts();
}

// 2. SISTEMA DE TABS (DASHBOARD / CATÁLOGO)
function initTabNavigation() {
    const tabBtns = document.querySelectorAll('.nav-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchAdminTab(targetTab);
        });
    });

    document.getElementById('btn-quick-create')?.addEventListener('click', () => {
        switchAdminTab('catalog');
        openProductModal();
    });

    document.getElementById('btn-view-all-recent')?.addEventListener('click', () => {
        switchAdminTab('catalog');
        const sortSelect = document.getElementById('admin-sort-by');
        if (sortSelect) {
            sortSelect.value = 'updated_desc';
            renderProductsTable();
        }
    });

    document.getElementById('btn-view-all-featured')?.addEventListener('click', () => {
        switchAdminTab('catalog');
        filterByFeatured();
    });
}

window.switchAdminTab = function(tabName) {
    const tabBtns = document.querySelectorAll('.nav-tab-btn');
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const viewDash = document.getElementById('view-dashboard');
    const viewCat = document.getElementById('view-catalog');

    if (tabName === 'dashboard') {
        if (viewDash) viewDash.style.display = 'block';
        if (viewCat) viewCat.style.display = 'none';
    } else {
        if (viewDash) viewDash.style.display = 'none';
        if (viewCat) viewCat.style.display = 'block';
    }
};

window.filterByFeatured = function() {
    const featSelect = document.getElementById('admin-filter-featured');
    if (featSelect) {
        featSelect.value = 'featured';
        currentPage = 1;
        renderProductsTable();
    }
};

// 3. LISTENERS DE AUTENTICACIÓN
function initAuthListeners() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearFieldErrors();
            
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');
            const submitBtn = document.getElementById('login-submit-btn');

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            let hasError = false;
            if (!email) {
                document.getElementById('error-login-email').textContent = 'Ingresa tu correo electrónico.';
                emailInput.classList.add('is-invalid');
                hasError = true;
            }
            if (!password) {
                document.getElementById('error-login-password').textContent = 'Ingresa tu contraseña.';
                passwordInput.classList.add('is-invalid');
                hasError = true;
            }
            if (hasError) return;

            if (!supabase || !window.BELPA_CONFIG.isConfigured()) {
                showLoginAlert('Debes configurar tus credenciales de Supabase antes de iniciar sesión.', 'error');
                return;
            }

            try {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.querySelector('span').textContent = 'Verificando acceso... 🌸';
                }
                showLoginAlert('Verificando acceso...', 'info');

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) {
                    showLoginAlert('El correo o la contraseña no son correctos.', 'error');
                    return;
                }

                const isAuthorized = await verifyAdminRole(data.user.id);
                if (!isAuthorized) {
                    await supabase.auth.signOut();
                    currentUser = null;
                    showLoginAlert('Tu cuenta no tiene permisos de administrador.', 'error');
                    return;
                }

                currentUser = data.user;
                showLoginAlert('');
                showAdminToast('¡Bienvenida a tu panel Belpa! 🌸');
                showDashboard(currentUser);
            } catch (err) {
                console.error('Error de autenticación:', err);
                showLoginAlert('No pudimos conectar con el servicio. Intenta nuevamente.', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.querySelector('span').textContent = 'Ingresar al panel 🌸';
                }
            }
        });
    }

    // Toggle Mostrar/Ocultar contraseña
    const togglePwdBtn = document.getElementById('btn-toggle-pwd');
    const pwdInput = document.getElementById('login-password');
    if (togglePwdBtn && pwdInput) {
        togglePwdBtn.addEventListener('click', () => {
            if (pwdInput.type === 'password') {
                pwdInput.type = 'text';
                togglePwdBtn.textContent = '🙈';
            } else {
                pwdInput.type = 'password';
                togglePwdBtn.textContent = '👁️';
            }
        });
    }

    // Recuperar Contraseña
    const forgotBtn = document.getElementById('btn-forgot-password');
    const forgotModal = document.getElementById('forgot-modal');
    const forgotCloseBtn = document.getElementById('forgot-modal-close-btn');
    const forgotCancelBtn = document.getElementById('forgot-modal-cancel-btn');
    const forgotForm = document.getElementById('forgot-form');

    if (forgotBtn && forgotModal) {
        forgotBtn.addEventListener('click', () => forgotModal.classList.add('open'));
    }
    if (forgotCloseBtn && forgotModal) {
        forgotCloseBtn.addEventListener('click', () => forgotModal.classList.remove('open'));
    }
    if (forgotCancelBtn && forgotModal) {
        forgotCancelBtn.addEventListener('click', () => forgotModal.classList.remove('open'));
    }
    if (forgotForm) {
        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value.trim();
            if (!email) return;

            const submitBtn = document.getElementById('forgot-submit-btn');
            try {
                if (submitBtn) submitBtn.disabled = true;
                if (supabase) {
                    const { error } = await supabase.auth.resetPasswordForEmail(email);
                    if (error) throw error;
                }
                showAdminToast('Enlace de recuperación enviado si el correo está registrado.');
                forgotModal.classList.remove('open');
            } catch (err) {
                alert('No se pudo enviar el enlace: ' + err.message);
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    // Cerrar sesión
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                if (logoutBtn) logoutBtn.disabled = true;
                showAdminToast('Sesión cerrando...');
                if (supabase) {
                    await supabase.auth.signOut();
                }
            } catch (e) {
                console.warn('Error en signOut:', e);
            } finally {
                currentUser = null;
                showLogin();
                showAdminToast('Sesión cerrada.');
                if (logoutBtn) logoutBtn.disabled = false;
            }
        });
    }

    if (supabase) {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                currentUser = null;
                showLogin();
            } else if (event === 'SIGNED_IN' && session && session.user) {
                if (!currentUser) {
                    const isAuth = await verifyAdminRole(session.user.id);
                    if (isAuth) {
                        currentUser = session.user;
                        showDashboard(currentUser);
                    }
                }
            }
        });
    }
}

// 4. CARGA DE PRODUCTOS Y SINCRONIZACIÓN
async function loadProducts() {
    const tbody = document.getElementById('admin-products-tbody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="10" class="table-loading-cell"><div class="spinner-inline"></div> Cargando catálogo de Belpa... 🌸</td></tr>';
    }

    try {
        if (supabase && window.BELPA_CONFIG.isConfigured()) {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;

            if (Array.isArray(data) && data.length > 0) {
                allProducts = data;
            } else {
                await loadLocalFallback();
            }
        } else {
            await loadLocalFallback();
        }

        updateDashboardMetrics();
        populateCategoryFilter();
        renderProductsTable();
    } catch (err) {
        console.warn('Fallo al cargar de Supabase, utilizando catálogo local:', err);
        await loadLocalFallback();
        updateDashboardMetrics();
        populateCategoryFilter();
        renderProductsTable();
    }
}

async function loadLocalFallback() {
    try {
        const res = await fetch('../catalog_data.json');
        if (res.ok) {
            const data = await res.json();
            allProducts = data.map(p => ({
                id: p.id,
                name: p.name,
                brand: p.brand || 'flora',
                category: p.category,
                filter_category: p.filterCategory || 'rosas_ramos',
                price: p.price,
                raw_price: p.rawPrice || 0,
                original_price: null,
                sort_order: 0,
                badge: p.badge || '',
                description: p.description || '',
                media_id: p.mediaId || '',
                images: p.images || [],
                is_active: true,
                is_featured: p.id <= 6,
                updated_at: new Date().toISOString()
            }));
        }
    } catch (e) {
        console.error('Error al cargar catálogo local:', e);
    }
}

// 5. MOTOR DEL DASHBOARD Y CÁLCULO DE KPIS
function updateDashboardMetrics() {
    const totalEl = document.getElementById('stat-total-products');
    const floraEl = document.getElementById('stat-flora-products');
    const beautyEl = document.getElementById('stat-beauty-products');
    const activeEl = document.getElementById('stat-active-products');
    const inactiveEl = document.getElementById('stat-inactive-products');
    const featuredEl = document.getElementById('stat-featured-products');
    const inventoryValEl = document.getElementById('stat-inventory-value');
    const avgPriceEl = document.getElementById('stat-avg-price');

    const total = allProducts.length;
    const flora = allProducts.filter(p => p.brand === 'flora').length;
    const beauty = allProducts.filter(p => p.brand === 'beauty').length;
    const active = allProducts.filter(p => p.is_active !== false).length;
    const inactive = total - active;
    const featured = allProducts.filter(p => Boolean(p.is_featured)).length;

    const totalInventoryValue = allProducts.reduce((acc, p) => acc + (Number(p.raw_price) || 0), 0);
    const avgPrice = total > 0 ? Math.round(totalInventoryValue / total) : 0;

    if (totalEl) totalEl.textContent = total;
    if (floraEl) floraEl.textContent = flora;
    if (beautyEl) beautyEl.textContent = beauty;
    if (activeEl) activeEl.textContent = active;
    if (inactiveEl) inactiveEl.textContent = inactive;
    if (featuredEl) featuredEl.textContent = featured;
    if (inventoryValEl) inventoryValEl.textContent = formatCOP(totalInventoryValue);
    if (avgPriceEl) avgPriceEl.textContent = formatCOP(avgPrice);

    // Alertas de calidad
    const noDescCount = allProducts.filter(p => !p.description || p.description.trim().length < 10).length;
    const noPhotoCount = allProducts.filter(p => !p.images || p.images.length === 0 || p.images[0].includes('product_1.webp')).length;

    const alertNoDescEl = document.getElementById('alert-no-desc-count');
    const alertNoPhotoEl = document.getElementById('alert-no-photo-count');

    if (alertNoDescEl) alertNoDescEl.textContent = noDescCount + ' productos';
    if (alertNoPhotoEl) alertNoPhotoEl.textContent = noPhotoCount + ' productos';

    // Widget: Recientemente actualizados (Top 4)
    const recentListEl = document.getElementById('dashboard-recent-list');
    if (recentListEl) {
        const sortedRecent = [...allProducts]
            .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
            .slice(0, 4);

        recentListEl.innerHTML = sortedRecent.map(p => {
            const rawImg = (p.images && p.images[0]) ? p.images[0] : 'assets/optimized/product_1.webp';
            const imgSrc = rawImg.startsWith('http') ? rawImg : '../' + rawImg.replace(/^\.\.\//, '');
            const dateStr = p.updated_at ? new Date(p.updated_at).toLocaleDateString('es-CO', { day:'2-digit', month:'short' }) : 'Hoy';

            return '<div class="widget-product-row">' +
                '<div class="widget-prod-left">' +
                    '<img src="' + escapeHTML(imgSrc) + '" alt="' + escapeHTML(p.name) + '" class="widget-prod-thumb" loading="lazy" onerror="this.src=\'../assets/optimized/product_1.webp\'">' +
                    '<div>' +
                        '<strong style="font-size:0.84rem; color:var(--charcoal-deep); display:block;">' + escapeHTML(p.name) + '</strong>' +
                        '<span style="font-size:0.74rem; color:var(--text-muted);">' + escapeHTML(p.category) + ' • ' + (p.brand === 'beauty' ? '💄 Beauty' : '🌹 Flora') + '</span>' +
                    '</div>' +
                '</div>' +
                '<div style="text-align:right;">' +
                    '<span style="font-size:0.82rem; font-weight:800; color:var(--burgundy-primary);">' + escapeHTML(p.price || formatCOP(p.raw_price)) + '</span>' +
                    '<small style="font-size:0.7rem; color:var(--text-muted); display:block;">' + escapeHTML(dateStr) + '</small>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    // Widget: Destacados en Portada (Top 4)
    const featuredListEl = document.getElementById('dashboard-featured-list');
    if (featuredListEl) {
        const featuredItems = allProducts.filter(p => Boolean(p.is_featured)).slice(0, 4);
        if (featuredItems.length === 0) {
            featuredListEl.innerHTML = '<div class="empty-widget-state">No hay productos marcados como destacados. ✨</div>';
        } else {
            featuredListEl.innerHTML = featuredItems.map(p => {
                const rawImg = (p.images && p.images[0]) ? p.images[0] : 'assets/optimized/product_1.webp';
                const imgSrc = rawImg.startsWith('http') ? rawImg : '../' + rawImg.replace(/^\.\.\//, '');

                return '<div class="widget-product-row">' +
                    '<div class="widget-prod-left">' +
                        '<img src="' + escapeHTML(imgSrc) + '" alt="' + escapeHTML(p.name) + '" class="widget-prod-thumb" loading="lazy" onerror="this.src=\'../assets/optimized/product_1.webp\'">' +
                        '<div>' +
                            '<strong style="font-size:0.84rem; color:var(--charcoal-deep); display:block;">' + escapeHTML(p.name) + '</strong>' +
                            '<span style="font-size:0.74rem; color:var(--burgundy-accent); font-weight:700;">✨ Destacado</span>' +
                        '</div>' +
                    '</div>' +
                    '<div style="text-align:right;">' +
                        '<span style="font-size:0.82rem; font-weight:800; color:var(--burgundy-primary);">' + escapeHTML(p.price || formatCOP(p.raw_price)) + '</span>' +
                    '</div>' +
                '</div>';
            }).join('');
        }
    }
}

function populateCategoryFilter() {
    const catSelect = document.getElementById('admin-filter-category');
    if (!catSelect) return;

    const currentVal = catSelect.value;
    const categories = Array.from(new Set(allProducts.map(p => p.category).filter(Boolean))).sort();

    catSelect.innerHTML = '<option value="all">Todas las Categorías</option>' +
        categories.map(cat => '<option value="' + escapeHTML(cat) + '">' + escapeHTML(cat) + '</option>').join('');

    if (categories.includes(currentVal)) {
        catSelect.value = currentVal;
    }
}

// 6. MOTOR DE FILTRADO, BÚSQUEDA Y ORDENAMIENTO MULTI-CRITERIO
function getFilteredAndSortedProducts() {
    const searchInput = document.getElementById('admin-search-input');
    const brandSelect = document.getElementById('admin-filter-brand');
    const categorySelect = document.getElementById('admin-filter-category');
    const statusSelect = document.getElementById('admin-filter-status');
    const featuredSelect = document.getElementById('admin-filter-featured');
    const priceSelect = document.getElementById('admin-filter-price');
    const sortSelect = document.getElementById('admin-sort-by');

    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const brandFilter = brandSelect ? brandSelect.value : 'all';
    const categoryFilter = categorySelect ? categorySelect.value : 'all';
    const statusFilter = statusSelect ? statusSelect.value : 'all';
    const featuredFilter = featuredSelect ? featuredSelect.value : 'all';
    const priceFilter = priceSelect ? priceSelect.value : 'all';
    const sortBy = sortSelect ? sortSelect.value : 'id_asc';

    let result = allProducts.filter(p => {
        // Marca
        if (brandFilter !== 'all' && p.brand !== brandFilter) return false;
        
        // Categoría
        if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
        
        // Estado
        const isActive = p.is_active !== false;
        if (statusFilter === 'active' && !isActive) return false;
        if (statusFilter === 'inactive' && isActive) return false;
        
        // Destacado
        const isFeatured = Boolean(p.is_featured);
        if (featuredFilter === 'featured' && !isFeatured) return false;
        if (featuredFilter === 'not_featured' && isFeatured) return false;
        
        // Rango de precio
        const rawPrice = Number(p.raw_price) || 0;
        if (priceFilter === 'under50' && rawPrice > 50000) return false;
        if (priceFilter === '50to100' && (rawPrice < 50000 || rawPrice > 100000)) return false;
        if (priceFilter === '100to200' && (rawPrice < 100000 || rawPrice > 200000)) return false;
        if (priceFilter === 'above200' && rawPrice < 200000) return false;
        
        // Búsqueda en texto
        if (searchTerm) {
            const matchSearch = 
                (p.name && p.name.toLowerCase().includes(searchTerm)) ||
                (p.category && p.category.toLowerCase().includes(searchTerm)) ||
                (p.filter_category && p.filter_category.toLowerCase().includes(searchTerm)) ||
                (p.badge && p.badge.toLowerCase().includes(searchTerm)) ||
                (p.description && p.description.toLowerCase().includes(searchTerm)) ||
                String(p.price || '').toLowerCase().includes(searchTerm) ||
                String(p.raw_price || '').includes(searchTerm);
            if (!matchSearch) return false;
        }

        return true;
    });

    // Motor de Ordenamiento
    result.sort((a, b) => {
        switch (sortBy) {
            case 'name_asc':
                return (a.name || '').localeCompare(b.name || '');
            case 'name_desc':
                return (b.name || '').localeCompare(a.name || '');
            case 'price_asc':
                return (Number(a.raw_price) || 0) - (Number(b.raw_price) || 0);
            case 'price_desc':
                return (Number(b.raw_price) || 0) - (Number(a.raw_price) || 0);
            case 'updated_desc':
                return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
            case 'featured_first':
                return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
            case 'sort_order_asc':
                return (Number(b.sort_order) || 0) - (Number(a.sort_order) || 0);
            case 'id_desc':
                return Number(b.id || 0) - Number(a.id || 0);
            case 'id_asc':
            default:
                return Number(a.id || 0) - Number(b.id || 0);
        }
    });

    return result;
}

// 7. RENDERIZADO DE TABLA Y CARDS CON PAGINACIÓN Y SELECCIÓN MÚLTIPLE
function renderProductsTable() {
    const tbody = document.getElementById('admin-products-tbody');
    const cardsContainer = document.getElementById('admin-products-cards');
    const counterEl = document.getElementById('filter-results-counter');
    const clearSearchBtn = document.getElementById('btn-clear-search');
    const searchInput = document.getElementById('admin-search-input');

    if (clearSearchBtn && searchInput) {
        clearSearchBtn.style.display = searchInput.value.trim() ? 'block' : 'none';
    }

    if (!tbody) return;

    const filtered = getFilteredAndSortedProducts();
    const totalItems = filtered.length;

    if (counterEl) {
        counterEl.textContent = 'Mostrando ' + totalItems + ' de ' + allProducts.length + ' productos';
    }

    const pageSizeVal = document.getElementById('admin-page-size')?.value || '20';
    pageSize = pageSizeVal === 'all' ? Math.max(1, totalItems) : Number(pageSizeVal);

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

    updatePaginationUI(totalItems, totalPages, startIndex, paginatedItems.length);
    updateMasterCheckboxState(paginatedItems);

    if (paginatedItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding:36px; color:var(--text-muted);">No se encontraron productos con los filtros seleccionados. 🌸</td></tr>';
        if (cardsContainer) {
            cardsContainer.innerHTML = '<div style="text-align:center; padding:32px; color:var(--text-muted);">No se encontraron productos con los filtros seleccionados.</div>';
        }
        return;
    }

    tbody.innerHTML = paginatedItems.map(p => {
        const isActive = p.is_active !== false;
        const isFeatured = Boolean(p.is_featured);
        const isSelected = selectedProductIds.has(Number(p.id));

        const brandBadge = p.brand === 'beauty' 
            ? '<span class="badge-brand beauty">💄 BelpaBeauty</span>' 
            : '<span class="badge-brand flora">🌹 BelFlora</span>';
        
        const rawImg = (p.images && p.images[0]) ? p.images[0] : 'assets/optimized/product_1.webp';
        const imgSrc = rawImg.startsWith('http') ? rawImg : '../' + rawImg.replace(/^\.\.\//, '');
        const updatedDate = p.updated_at ? new Date(p.updated_at).toLocaleDateString('es-CO', { day:'2-digit', month:'short' }) : 'Hoy';

        return '<tr data-id="' + p.id + '" class="' + (isSelected ? 'row-selected' : '') + '">' +
            '<td style="text-align:center;">' +
                '<input type="checkbox" class="product-checkbox" data-id="' + p.id + '" ' + (isSelected ? 'checked' : '') + ' aria-label="Seleccionar ' + escapeHTML(p.name) + '">' +
            '</td>' +
            '<td>' +
                '<img src="' + escapeHTML(imgSrc) + '" alt="' + escapeHTML(p.name) + '" class="table-product-thumb" loading="lazy" onerror="this.src=\'../assets/optimized/product_1.webp\'">' +
            '</td>' +
            '<td>' +
                '<strong style="font-family:var(--font-cute); font-size:0.92rem; color:var(--charcoal-deep);">' + escapeHTML(p.name) + '</strong>' +
                (p.badge ? '<span style="font-size:0.7rem; color:var(--burgundy-accent); display:block; font-weight:700;">' + escapeHTML(p.badge) + '</span>' : '') +
                '<small style="font-size:0.7rem; color:var(--text-muted);">ID: #' + p.id + '</small>' +
            '</td>' +
            '<td>' + brandBadge + '</td>' +
            '<td style="font-size:0.8rem; color:var(--charcoal-soft);">' +
                '<strong>' + escapeHTML(p.category) + '</strong>' +
                (p.filter_category ? '<br><small style="color:var(--text-muted);">' + escapeHTML(p.filter_category) + '</small>' : '') +
            '</td>' +
            '<td>' +
                '<strong style="color:var(--burgundy-primary); font-size:0.9rem;">' + escapeHTML(p.price || formatCOP(p.raw_price)) + '</strong>' +
                (p.original_price ? '<br><small style="text-decoration:line-through; color:var(--text-muted); font-size:0.74rem;">' + formatCOP(p.original_price) + '</small>' : '') +
            '</td>' +
            '<td style="text-align:center;">' +
                '<button class="badge-featured-pill ' + (isFeatured ? 'active' : 'inactive') + '" onclick="handleToggleFeatured(' + p.id + ', ' + isFeatured + ')" title="Cambiar destacado">' +
                    (isFeatured ? '✨ Sí' : '⚪ No') +
                '</button>' +
            '</td>' +
            '<td style="text-align:center;">' +
                '<button class="status-toggle ' + (isActive ? 'active' : 'inactive') + '" onclick="handleToggleStatus(' + p.id + ', ' + isActive + ')" aria-label="Cambiar estado del producto">' +
                    (isActive ? '🟢 Activo' : '⚪ Oculto') +
                '</button>' +
            '</td>' +
            '<td style="font-size:0.75rem; color:var(--text-muted);">' + escapeHTML(updatedDate) + '</td>' +
            '<td style="text-align:right;">' +
                '<div class="table-actions">' +
                    '<button class="btn-icon" title="Editar Producto" onclick="handleEditProduct(' + p.id + ')" aria-label="Editar">✏️</button>' +
                    '<button class="btn-icon delete" title="Eliminar Producto" onclick="openDeleteModal(' + p.id + ')" aria-label="Eliminar">🗑️</button>' +
                '</div>' +
            '</td>' +
        '</tr>';
    }).join('');

    if (cardsContainer) {
        cardsContainer.innerHTML = paginatedItems.map(p => {
            const isActive = p.is_active !== false;
            const isFeatured = Boolean(p.is_featured);
            const isSelected = selectedProductIds.has(Number(p.id));
            const brandBadge = p.brand === 'beauty' ? '💄 Beauty' : '🌹 Flora';
            const rawImg = (p.images && p.images[0]) ? p.images[0] : 'assets/optimized/product_1.webp';
            const imgSrc = rawImg.startsWith('http') ? rawImg : '../' + rawImg.replace(/^\.\.\//, '');

            return '<div class="mobile-product-card ' + (isSelected ? 'row-selected' : '') + '" data-id="' + p.id + '">' +
                '<input type="checkbox" class="product-checkbox" data-id="' + p.id + '" ' + (isSelected ? 'checked' : '') + ' style="margin-right:6px;">' +
                '<img src="' + escapeHTML(imgSrc) + '" alt="' + escapeHTML(p.name) + '" class="mobile-card-thumb" loading="lazy" onerror="this.src=\'../assets/optimized/product_1.webp\'">' +
                '<div class="mobile-card-body">' +
                    '<h4 class="mobile-card-title">' + escapeHTML(p.name) + '</h4>' +
                    '<div class="mobile-card-meta">' +
                        '<span style="font-size:0.72rem; color:var(--text-muted);">' + escapeHTML(brandBadge) + ' • ' + escapeHTML(p.category) + '</span>' +
                        (isFeatured ? '<span style="font-size:0.72rem; color:var(--burgundy-accent); font-weight:700;"> • ✨ Destacado</span>' : '') +
                    '</div>' +
                    '<div class="mobile-card-price">' + escapeHTML(p.price || formatCOP(p.raw_price)) + '</div>' +
                '</div>' +
                '<div class="mobile-card-actions">' +
                    '<button class="status-toggle ' + (isActive ? 'active' : 'inactive') + '" onclick="handleToggleStatus(' + p.id + ', ' + isActive + ')">' +
                        (isActive ? '🟢' : '⚪') +
                    '</button>' +
                    '<div style="display:flex; gap:4px;">' +
                        '<button class="btn-icon" onclick="handleEditProduct(' + p.id + ')" title="Editar">✏️</button>' +
                        '<button class="btn-icon delete" onclick="openDeleteModal(' + p.id + ')" title="Eliminar">🗑️</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    bindCheckboxEvents();
}

function updatePaginationUI(totalItems, totalPages, startIndex, pageCount) {
    const bar = document.getElementById('admin-pagination-bar');
    const info = document.getElementById('pagination-info');
    const pageBadge = document.getElementById('pagination-current-page');
    const prevBtn = document.getElementById('btn-prev-page');
    const nextBtn = document.getElementById('btn-next-page');

    if (!bar) return;

    if (totalItems <= pageSize && pageSize !== totalItems) {
        bar.style.display = 'none';
        return;
    }

    bar.style.display = 'flex';
    if (info) {
        const start = totalItems > 0 ? startIndex + 1 : 0;
        const end = startIndex + pageCount;
        info.textContent = 'Mostrando ' + start + '-' + end + ' de ' + totalItems + ' productos';
    }
    if (pageBadge) pageBadge.textContent = currentPage + ' / ' + totalPages;
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
}

// 8. MOTOR DE ACCIONES MASIVAS (BULK ACTIONS)
function bindCheckboxEvents() {
    const masterCheckbox = document.getElementById('master-select-checkbox');
    if (masterCheckbox) {
        masterCheckbox.onchange = (e) => {
            const isChecked = e.target.checked;
            const filtered = getFilteredAndSortedProducts();
            const startIndex = (currentPage - 1) * pageSize;
            const currentVisible = filtered.slice(startIndex, startIndex + pageSize);

            currentVisible.forEach(p => {
                const id = Number(p.id);
                if (isChecked) {
                    selectedProductIds.add(id);
                } else {
                    selectedProductIds.delete(id);
                }
            });

            updateBulkActionBar();
            renderProductsTable();
        };
    }

    document.querySelectorAll('.product-checkbox').forEach(cb => {
        cb.onchange = (e) => {
            const id = Number(e.target.getAttribute('data-id'));
            if (e.target.checked) {
                selectedProductIds.add(id);
            } else {
                selectedProductIds.delete(id);
            }
            updateBulkActionBar();
            renderProductsTable();
        };
    });
}

function updateMasterCheckboxState(visibleItems) {
    const masterCheckbox = document.getElementById('master-select-checkbox');
    if (!masterCheckbox || visibleItems.length === 0) return;

    const allChecked = visibleItems.every(p => selectedProductIds.has(Number(p.id)));
    const someChecked = visibleItems.some(p => selectedProductIds.has(Number(p.id)));

    masterCheckbox.checked = allChecked;
    masterCheckbox.indeterminate = !allChecked && someChecked;
}

function updateBulkActionBar() {
    const bar = document.getElementById('bulk-actions-bar');
    const counter = document.getElementById('bulk-selected-count');
    const count = selectedProductIds.size;

    if (!bar) return;

    if (count > 0) {
        bar.style.display = 'block';
        if (counter) counter.textContent = count;
    } else {
        bar.style.display = 'none';
    }
}

window.clearBulkSelection = function() {
    selectedProductIds.clear();
    updateBulkActionBar();
    renderProductsTable();
};

window.handleBulkAction = async function(action) {
    const ids = Array.from(selectedProductIds);
    if (ids.length === 0) return;

    if (action === 'delete') {
        openBulkDeleteModal(ids);
        return;
    }

    try {
        showAdminToast('Aplicando acción masiva a ' + ids.length + ' productos...');
        const now = new Date().toISOString();

        if (action === 'activate') {
            if (supabase && window.BELPA_CONFIG.isConfigured()) {
                const { error } = await supabase.from('products').update({ is_active: true, updated_at: now }).in('id', ids);
                if (error) throw error;
            } else {
                allProducts.forEach(p => { if (ids.includes(Number(p.id))) p.is_active = true; });
            }
            showAdminToast('✓ ' + ids.length + ' productos activados correctamente. 🟢');
        } else if (action === 'deactivate') {
            if (supabase && window.BELPA_CONFIG.isConfigured()) {
                const { error } = await supabase.from('products').update({ is_active: false, updated_at: now }).in('id', ids);
                if (error) throw error;
            } else {
                allProducts.forEach(p => { if (ids.includes(Number(p.id))) p.is_active = false; });
            }
            showAdminToast('✓ ' + ids.length + ' productos pausados/ocultados. ⚪');
        } else if (action === 'feature') {
            if (supabase && window.BELPA_CONFIG.isConfigured()) {
                const { error } = await supabase.from('products').update({ is_featured: true, updated_at: now }).in('id', ids);
                if (error) throw error;
            } else {
                allProducts.forEach(p => { if (ids.includes(Number(p.id))) p.is_featured = true; });
            }
            showAdminToast('✓ ' + ids.length + ' productos marcados como destacados. ✨');
        } else if (action === 'unfeature') {
            if (supabase && window.BELPA_CONFIG.isConfigured()) {
                const { error } = await supabase.from('products').update({ is_featured: false, updated_at: now }).in('id', ids);
                if (error) throw error;
            } else {
                allProducts.forEach(p => { if (ids.includes(Number(p.id))) p.is_featured = false; });
            }
            showAdminToast('✓ ' + ids.length + ' productos desmarcados de destacados.');
        }

        clearBulkSelection();
        await loadProducts();
    } catch (err) {
        console.error('Error en acción masiva:', err);
        alert('No se pudo completar la acción masiva: ' + err.message);
    }
};

function openBulkDeleteModal(ids) {
    const modal = document.getElementById('bulk-modal');
    const titleEl = document.getElementById('bulk-modal-title');
    const msgEl = document.getElementById('bulk-modal-message');
    const listEl = document.getElementById('bulk-modal-list');
    const confirmBtn = document.getElementById('btn-bulk-modal-confirm');
    const cancelBtn = document.getElementById('btn-bulk-modal-cancel');
    const closeBtn = document.getElementById('bulk-modal-close-btn');

    if (!modal) return;

    titleEl.textContent = 'Confirmar Eliminación Masiva 🗑️';
    msgEl.textContent = '¿Estás absolutamente segura de eliminar permanentemente estos ' + ids.length + ' productos?';

    const selectedProducts = allProducts.filter(p => ids.includes(Number(p.id)));
    listEl.innerHTML = selectedProducts.map(p => '<div>• <strong>#' + p.id + '</strong> - ' + escapeHTML(p.name) + ' (' + (p.brand === 'beauty' ? '💄 Beauty' : '🌹 Flora') + ')</div>').join('');

    confirmBtn.onclick = async () => {
        try {
            confirmBtn.disabled = true;
            showAdminToast('Eliminando ' + ids.length + ' productos...');

            if (supabase && window.BELPA_CONFIG.isConfigured()) {
                const { error } = await supabase.from('products').delete().in('id', ids);
                if (error) throw error;
            } else {
                allProducts = allProducts.filter(p => !ids.includes(Number(p.id)));
            }

            modal.classList.remove('open');
            clearBulkSelection();
            showAdminToast('✓ ' + ids.length + ' productos eliminados permanentemente.');
            await loadProducts();
        } catch (err) {
            console.error('Error al eliminar en lote:', err);
            alert('Error al eliminar productos: ' + err.message);
        } finally {
            confirmBtn.disabled = false;
        }
    };

    const closeModal = () => modal.classList.remove('open');
    cancelBtn.onclick = closeModal;
    closeBtn.onclick = closeModal;

    modal.classList.add('open');
}

// 9. OPTIMIZADOR WEBP EN EL NAVEGADOR (MÁXIMO 800PX, 82% CALIDAD)
async function compressImageToWebP(file, maxDimension = 800, quality = 0.82) {
    return new Promise((resolve, reject) => {
        if (!file.type.match(/image\/(png|jpeg|webp)/i)) {
            return reject(new Error('Formato de imagen no soportado. Usa PNG, JPEG o WebP.'));
        }
        if (file.size > 5 * 1024 * 1024) {
            return reject(new Error('El archivo supera el tamaño máximo permitido (5 MB).'));
        }

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
                    else reject(new Error('No se pudo comprimir la imagen.'));
                }, 'image/webp', quality);
            };
            img.onerror = () => reject(new Error('No se pudo cargar la imagen para compresión.'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Error al leer el archivo.'));
        reader.readAsDataURL(file);
    });
}

// 10. LISTENERS DE EVENTOS DE BÚSQUEDA, FILTROS Y FORMULARIOS
function initEventListeners() {
    const searchInput = document.getElementById('admin-search-input');
    const clearSearchBtn = document.getElementById('btn-clear-search');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchDebounceTimeout);
            searchDebounceTimeout = setTimeout(() => {
                currentPage = 1;
                renderProductsTable();
            }, 180);
        });
    }

    if (clearSearchBtn && searchInput) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            currentPage = 1;
            renderProductsTable();
        });
    }

    ['admin-filter-brand', 'admin-filter-category', 'admin-filter-status', 'admin-filter-featured', 'admin-filter-price', 'admin-sort-by', 'admin-page-size'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => {
            currentPage = 1;
            renderProductsTable();
        });
    });

    document.getElementById('btn-prev-page')?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProductsTable();
        }
    });

    document.getElementById('btn-next-page')?.addEventListener('click', () => {
        currentPage++;
        renderProductsTable();
    });

    // Bulk buttons
    document.getElementById('btn-bulk-activate')?.addEventListener('click', () => handleBulkAction('activate'));
    document.getElementById('btn-bulk-deactivate')?.addEventListener('click', () => handleBulkAction('deactivate'));
    document.getElementById('btn-bulk-feature')?.addEventListener('click', () => handleBulkAction('feature'));
    document.getElementById('btn-bulk-unfeature')?.addEventListener('click', () => handleBulkAction('unfeature'));
    document.getElementById('btn-bulk-delete')?.addEventListener('click', () => handleBulkAction('delete'));
    document.getElementById('btn-bulk-cancel')?.addEventListener('click', clearBulkSelection);

    // Modal Crear/Editar
    const openCreateBtn = document.getElementById('btn-open-create-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    if (openCreateBtn) openCreateBtn.addEventListener('click', () => openProductModal());
    if (closeBtn) closeBtn.addEventListener('click', closeProductModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeProductModal);

    // Dropzone y compresión WebP
    const dropzone = document.getElementById('image-dropzone');
    const fileInput = document.getElementById('prod-file-input');
    const previewImg = document.getElementById('prod-image-preview');
    const dropzoneText = document.getElementById('dropzone-text');

    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
        dropzone.addEventListener('drop', async (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                await processImageFile(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', async (e) => {
            if (e.target.files && e.target.files[0]) {
                await processImageFile(e.target.files[0]);
            }
        });
    }

    async function processImageFile(file) {
        try {
            if (dropzoneText) dropzoneText.textContent = '⏳ Comprimiendo imagen a WebP (800px, 82%)...';
            compressedImageBlob = await compressImageToWebP(file);
            const previewUrl = URL.createObjectURL(compressedImageBlob);
            
            if (previewImg) {
                previewImg.src = previewUrl;
                previewImg.style.display = 'block';
            }
            if (dropzoneText) dropzoneText.textContent = '✓ Imagen WebP lista (' + (compressedImageBlob.size / 1024).toFixed(1) + ' KB)';
            document.getElementById('error-prod-image').textContent = '';
        } catch (err) {
            alert('Aviso de imagen: ' + err.message);
            if (dropzoneText) dropzoneText.textContent = '📷 Haz clic o arrastra una imagen aquí';
        }
    }

    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', handleSaveProduct);
    }

    // Modal de Configuración Supabase
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
                if (supabase) {
                    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
                    if (error) throw error;
                    showAdminToast('¡Conexión exitosa con Supabase! ✨');
                } else {
                    showAdminToast('Credenciales guardadas.');
                }
                closeConfigModal();
                await checkSession();
            } catch (err) {
                alert('Aviso de conexión: Se guardaron las credenciales, pero la prueba devolvió: ' + err.message + '\n\nAsegúrate de haber ejecutado supabase/block4_database.sql en tu proyecto.');
                closeConfigModal();
            }
        });
    }

    // Modal de Eliminación Individual
    const deleteModal = document.getElementById('delete-modal');
    const closeDeleteBtn = document.getElementById('delete-modal-close-btn');
    const cancelDeleteBtn = document.getElementById('btn-cancel-delete');
    const confirmSoftDeleteBtn = document.getElementById('btn-confirm-soft-delete');
    const confirmHardDeleteBtn = document.getElementById('btn-confirm-hard-delete');

    function closeDeleteModal() {
        if (deleteModal) deleteModal.classList.remove('open');
        pendingDeleteId = null;
    }

    if (closeDeleteBtn) closeDeleteBtn.addEventListener('click', closeDeleteModal);
    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);

    if (confirmSoftDeleteBtn) {
        confirmSoftDeleteBtn.addEventListener('click', async () => {
            if (!pendingDeleteId) return;
            await handleToggleStatus(pendingDeleteId, true);
            closeDeleteModal();
        });
    }

    if (confirmHardDeleteBtn) {
        confirmHardDeleteBtn.addEventListener('click', async () => {
            if (!pendingDeleteId) return;
            await executeHardDelete(pendingDeleteId);
            closeDeleteModal();
        });
    }
}

// 11. MODAL CRUD: ABRIR, CERRAR Y GUARDAR
function openProductModal(product = null) {
    const modal = document.getElementById('product-modal');
    const titleEl = document.getElementById('modal-product-title');
    const form = document.getElementById('product-form');
    const previewImg = document.getElementById('prod-image-preview');
    const dropzoneText = document.getElementById('dropzone-text');

    clearFieldErrors();
    compressedImageBlob = null;

    if (product) {
        titleEl.textContent = 'Editar Producto #' + product.id + ' 🌸';
        document.getElementById('prod-id').value = product.id;
        document.getElementById('prod-name').value = product.name || '';
        document.getElementById('prod-brand').value = product.brand || 'flora';
        document.getElementById('prod-raw-price').value = product.raw_price || '';
        document.getElementById('prod-original-price').value = product.original_price || '';
        document.getElementById('prod-category').value = product.category || '';
        document.getElementById('prod-filter-category').value = product.filter_category || '';
        document.getElementById('prod-badge').value = product.badge || '';
        document.getElementById('prod-sort-order').value = product.sort_order || 0;
        document.getElementById('prod-desc').value = product.description || '';
        document.getElementById('prod-active').checked = product.is_active !== false;
        document.getElementById('prod-featured').checked = Boolean(product.is_featured);

        const currentImg = (product.images && product.images[0]) ? product.images[0] : '';
        document.getElementById('prod-current-image-url').value = currentImg;

        if (currentImg && previewImg) {
            const imgSrc = currentImg.startsWith('http') ? currentImg : '../' + currentImg.replace(/^\.\.\//, '');
            previewImg.src = imgSrc;
            previewImg.style.display = 'block';
            if (dropzoneText) dropzoneText.textContent = '📷 Haz clic o arrastra para reemplazar la foto';
        } else {
            if (previewImg) previewImg.style.display = 'none';
            if (dropzoneText) dropzoneText.textContent = '📷 Haz clic o arrastra una imagen aquí';
        }
    } else {
        titleEl.textContent = 'Crear Nuevo Producto 🌸';
        form.reset();
        document.getElementById('prod-id').value = '';
        document.getElementById('prod-current-image-url').value = '';
        document.getElementById('prod-active').checked = true;
        document.getElementById('prod-sort-order').value = 0;
        if (previewImg) previewImg.style.display = 'none';
        if (dropzoneText) dropzoneText.textContent = '📷 Haz clic o arrastra una imagen aquí';
    }

    if (modal) modal.classList.add('open');
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.remove('open');
    compressedImageBlob = null;
}

async function handleSaveProduct(e) {
    e.preventDefault();
    clearFieldErrors();

    const id = document.getElementById('prod-id').value;
    const nameInput = document.getElementById('prod-name');
    const brandInput = document.getElementById('prod-brand');
    const rawPriceInput = document.getElementById('prod-raw-price');
    const originalPriceInput = document.getElementById('prod-original-price');
    const categoryInput = document.getElementById('prod-category');
    const filterCategoryInput = document.getElementById('prod-filter-category');
    const badgeInput = document.getElementById('prod-badge');
    const sortOrderInput = document.getElementById('prod-sort-order');
    const descInput = document.getElementById('prod-desc');
    const activeInput = document.getElementById('prod-active');
    const featuredInput = document.getElementById('prod-featured');
    const currentImageUrl = document.getElementById('prod-current-image-url').value;
    const saveBtn = document.getElementById('modal-save-btn');

    const name = nameInput.value.trim();
    const brand = brandInput.value;
    const rawPrice = Number(rawPriceInput.value);
    const originalPrice = originalPriceInput.value ? Number(originalPriceInput.value) : null;
    const category = categoryInput.value.trim();
    const filterCategory = filterCategoryInput.value.trim() || category.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const badge = badgeInput.value.trim();
    const sortOrder = Number(sortOrderInput.value) || 0;
    const description = descInput.value.trim();
    const isActive = activeInput.checked;
    const isFeatured = featuredInput.checked;

    let isValid = true;
    if (!name) {
        document.getElementById('error-prod-name').textContent = 'El nombre del producto es obligatorio.';
        nameInput.classList.add('is-invalid');
        isValid = false;
    }
    if (!brand || !['flora', 'beauty'].includes(brand)) {
        document.getElementById('error-prod-brand').textContent = 'Selecciona una marca válida.';
        brandInput.classList.add('is-invalid');
        isValid = false;
    }
    if (isNaN(rawPrice) || rawPrice <= 0) {
        document.getElementById('error-prod-price').textContent = 'Ingresa un precio numérico válido mayor a 0.';
        rawPriceInput.classList.add('is-invalid');
        isValid = false;
    }
    if (originalPrice !== null && (isNaN(originalPrice) || originalPrice < 0)) {
        document.getElementById('error-prod-original-price').textContent = 'Ingresa un valor numérico válido.';
        originalPriceInput.classList.add('is-invalid');
        isValid = false;
    }
    if (!category) {
        document.getElementById('error-prod-category').textContent = 'La categoría es obligatoria.';
        categoryInput.classList.add('is-invalid');
        isValid = false;
    }
    if (!id && !compressedImageBlob && !currentImageUrl) {
        document.getElementById('error-prod-image').textContent = 'Selecciona una fotografía para el nuevo producto.';
        isValid = false;
    }

    if (!isValid) return;

    try {
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.querySelector('span').textContent = id ? 'Actualizando... 🌸' : 'Guardando... 🌸';
        }

        let imageUrl = currentImageUrl;

        if (compressedImageBlob && supabase) {
            if (saveBtn) saveBtn.querySelector('span').textContent = 'Subiendo imagen WebP... 🌸';
            const folder = brand === 'beauty' ? 'beauty' : 'flora';
            const fileName = folder + '/prod_' + Date.now() + '_' + Math.random().toString(36).substring(7) + '.webp';
            
            const bucketName = window.BELPA_CONFIG.STORAGE_BUCKET || 'product-images';
            const { data: uploadData, error: uploadErr } = await supabase.storage
                .from(bucketName)
                .upload(fileName, compressedImageBlob, { contentType: 'image/webp' });

            if (uploadErr) {
                console.warn('Aviso Storage:', uploadErr.message);
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(fileName);
                imageUrl = publicUrl;
            }
        }

        if (!imageUrl) {
            imageUrl = 'assets/optimized/product_1.webp';
        }

        const priceFormatted = formatCOP(rawPrice);

        const payload = {
            name,
            brand,
            category,
            filter_category: filterCategory,
            price: priceFormatted,
            raw_price: rawPrice,
            original_price: originalPrice,
            sort_order: sortOrder,
            badge,
            description,
            images: [imageUrl],
            is_active: isActive,
            is_featured: isFeatured,
            updated_at: new Date().toISOString()
        };

        if (supabase && window.BELPA_CONFIG.isConfigured()) {
            if (id) {
                const { error } = await supabase.from('products').update(payload).eq('id', id);
                if (error) throw error;
                showAdminToast('¡Producto actualizado correctamente! 🌸');
            } else {
                const { error } = await supabase.from('products').insert([payload]);
                if (error) throw error;
                showAdminToast('¡Producto creado correctamente! ✨');
            }
        } else {
            if (id) {
                const idx = allProducts.findIndex(p => p.id == id);
                if (idx !== -1) {
                    allProducts[idx] = { ...allProducts[idx], ...payload, id: Number(id) };
                }
            } else {
                const newId = Math.max(...allProducts.map(p => p.id || 0), 0) + 1;
                allProducts.unshift({ id: newId, ...payload });
            }
            showAdminToast('Producto guardado correctamente en catálogo local.');
        }

        closeProductModal();
        await loadProducts();
    } catch (err) {
        console.error('Error al guardar:', err);
        alert('Error al guardar producto: ' + err.message);
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.querySelector('span').textContent = 'Guardar Producto 🌸';
        }
    }
}

// 12. ACCIONES INDIVIDUALES: TOGGLE ESTADO, TOGGLE DESTACADO Y ELIMINACIÓN
window.handleToggleStatus = async function(id, currentStatus) {
    try {
        const newStatus = !currentStatus;
        const now = new Date().toISOString();

        if (supabase && window.BELPA_CONFIG.isConfigured()) {
            const { error } = await supabase
                .from('products')
                .update({ is_active: newStatus, updated_at: now })
                .eq('id', id);

            if (error) throw error;
        } else {
            const p = allProducts.find(prod => prod.id == id);
            if (p) {
                p.is_active = newStatus;
                p.updated_at = now;
            }
        }

        showAdminToast(newStatus ? 'Producto activado correctamente. 🟢' : 'Producto desactivado. ⚪');
        updateDashboardMetrics();
        renderProductsTable();
    } catch (err) {
        console.error('Error al cambiar estado:', err);
        alert('Error al cambiar estado: ' + err.message);
    }
};

window.handleToggleFeatured = async function(id, currentFeatured) {
    try {
        const newFeatured = !currentFeatured;
        const now = new Date().toISOString();

        if (supabase && window.BELPA_CONFIG.isConfigured()) {
            const { error } = await supabase
                .from('products')
                .update({ is_featured: newFeatured, updated_at: now })
                .eq('id', id);

            if (error) throw error;
        } else {
            const p = allProducts.find(prod => prod.id == id);
            if (p) {
                p.is_featured = newFeatured;
                p.updated_at = now;
            }
        }

        showAdminToast(newFeatured ? 'Producto marcado como destacado. ✨' : 'Producto desmarcado de destacados.');
        updateDashboardMetrics();
        renderProductsTable();
    } catch (err) {
        console.error('Error al cambiar destacado:', err);
        alert('Error al cambiar destacado: ' + err.message);
    }
};

window.handleEditProduct = function(id) {
    const product = allProducts.find(p => p.id == id);
    if (product) openProductModal(product);
};

window.openDeleteModal = function(id) {
    const product = allProducts.find(p => p.id == id);
    if (!product) return;

    pendingDeleteId = id;
    const nameEl = document.getElementById('delete-prod-name');
    const priceEl = document.getElementById('delete-prod-price');
    const imgEl = document.getElementById('delete-prod-img');
    const modal = document.getElementById('delete-modal');

    if (nameEl) nameEl.textContent = product.name;
    if (priceEl) priceEl.textContent = product.price || formatCOP(product.raw_price);
    if (imgEl) {
        const rawImg = (product.images && product.images[0]) ? product.images[0] : 'assets/optimized/product_1.webp';
        imgEl.src = rawImg.startsWith('http') ? rawImg : '../' + rawImg.replace(/^\.\.\//, '');
    }

    if (modal) modal.classList.add('open');
};

async function executeHardDelete(id) {
    try {
        showAdminToast('Eliminando producto...');
        if (supabase && window.BELPA_CONFIG.isConfigured()) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
        } else {
            allProducts = allProducts.filter(p => p.id != id);
        }
        selectedProductIds.delete(Number(id));
        updateBulkActionBar();
        showAdminToast('Producto eliminado permanentemente.');
        await loadProducts();
    } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar: ' + err.message);
    }
}
