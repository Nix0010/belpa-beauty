/* ==========================================================================
   INTERACTIVIDAD Y EFECTOS BOUTIQUE - BELPA BEAUTY
   ========================================================================== */

// --- Base de Datos Local de Productos ---
const productsData = {
    1: {
        name: "Ramos Eternos & Detalles Personalizados",
        category: "FLORES Y ACCESORIOS",
        price: "Desde $15,000 COP",
        rawPrice: 15000,
        badge: "Crochet 🌸",
        description: "Preciosos ramos de tulipanes, rosas o margaritas tejidos artesanalmente a mano con limpiapipas de alta suavidad. Puedes personalizar la combinación de colores y el envoltorio de regalo. Es un detalle perfecto, duradero y de gran valor sentimental.",
        images: ["assets/product_1.jpg", "assets/product_3.jpg"]
    },
    2: {
        name: "Kit de Skincare Rutina Completa",
        category: "CUIDADO FACIAL",
        price: "$38,000 COP",
        rawPrice: 38000,
        badge: "Viral 🔥",
        description: "El set definitivo para el cuidado facial diario. Incluye gel limpiador suave, tónico equilibrante y crema hidratante iluminadora para dejar la piel fresca, suave y protegida. Ideal para todo tipo de piel.",
        images: ["assets/product_2.jpg", "assets/product_6.jpg"]
    },
    3: {
        name: "Combo Moño Satín & Lip Gloss Trend",
        category: "SET REGALO",
        price: "$22,000 COP",
        rawPrice: 22000,
        badge: "Nuevo 🎀",
        description: "El kit ideal de moños elegantes estilo satín combinados con brillo labial ultra hidratante. Perfecto para añadir un toque tierno a tu look diario o para armar una cajita de regalo súper especial.",
        images: ["assets/product_3.jpg", "assets/product_1.jpg"]
    },
    4: {
        name: "Sheglam Lip Gloss Sparkling",
        category: "MAQUILLAJE LABIOS",
        price: "$18,000 COP",
        rawPrice: 18000,
        badge: "Best Seller ⭐",
        description: "Brillo labial viral con micro-destellos de purpurina que reflejan la luz de manera espectacular. Proporciona hidratación profunda y volumen óptico sin dejar una sensación pesada o pegajosa.",
        images: ["assets/product_4.jpg", "assets/product_3.jpg"]
    },
    5: {
        name: "Pestañina Prosa 4 en 1 Waterproof",
        category: "MAQUILLAJE OJOS",
        price: "$12,000 COP",
        rawPrice: 12000,
        badge: "Básico 👀",
        description: "Fórmula profesional de larga duración resistente al agua. Enriquecida con aceites naturales de hueso de mamey, sábila, jojoba y germen de trigo. Alarga, define y da volumen a tus pestañas.",
        images: ["assets/product_5.jpg", "assets/product_4.jpg"]
    },
    6: {
        name: "Alissha Jelly Blush Tinta Rubor",
        category: "MAQUILLAJE MEJILLAS",
        price: "$15,000 COP",
        rawPrice: 15000,
        badge: "Nuevo Rubor 🍮",
        description: "Divertido rubor y tinta multiusos con una textura jelly gelatinosa única. Es sumamente fácil de difuminar, refresca tu piel y aporta una tinta de larga duración que se adapta al tono natural de tus mejillas.",
        images: ["assets/product_6.jpg", "assets/product_2.jpg"]
    },
    7: {
        name: "Caja Ramo Premium Bouquet Eterno",
        category: "REGALOS CROCHET",
        price: "$35,000 COP",
        rawPrice: 35000,
        badge: "Handmade 🎁",
        description: "Exclusivo ramo de flores eternas tejidas a mano con limpiapipas premium de alta suavidad, presentado en una caja de lujo perfumada con lazos decorativos. El obsequio sofisticado que no se marchita.",
        images: ["assets/product_7.jpeg", "assets/product_8.jpeg"]
    },
    8: {
        name: "Ramo de Rosas Eternas Especial",
        category: "FLORES CROCHET",
        price: "$25,000 COP",
        rawPrice: 25000,
        badge: "Tendencia 🌹",
        description: "Ramo clásico y elegante de rosas eternas hechas a mano. Elige tu paleta de colores favorita y nosotras nos encargamos de envolverlo con papeles coreanos de seda importada y moño de satín.",
        images: ["assets/product_8.jpeg", "assets/product_10.jpeg"]
    },
    9: {
        name: "Set Satín Hair Bow & Gloss Hidratante",
        category: "COMBOS DIARIOS",
        price: "$20,000 COP",
        rawPrice: 20000,
        badge: "Combos 💕",
        description: "Moño coquette XL de satín de brillo suave y alta resistencia, acompañado de un lip gloss hidratante para labios radiantes durante todo el día. Ideal para complementar cualquier peinado diario.",
        images: ["assets/product_9.jpeg", "assets/product_3.jpg"]
    },
    10: {
        name: "Ramo Eterno de Lavandas y Rosas",
        category: "FLORES CROCHET",
        price: "$30,000 COP",
        rawPrice: 30000,
        badge: "Handmade 🪻",
        description: "Ramillete bouquet que combina rosas de crochet con delicadas flores de lavanda aromática en tonos lilas y crema. Tejido a mano y envuelto con el máximo cuidado y amor.",
        images: ["assets/product_10.jpeg", "assets/product_7.jpeg"]
    },
    11: {
        name: "Set de Belleza Essentials & Flores",
        category: "COMBOS BELLEZA",
        price: "$28,000 COP",
        rawPrice: 28000,
        badge: "Favorito 🌟",
        description: "Completa cajita de regalo que incluye una rosa eterna de crochet individual, clips para el cabello estilo pastel mate, y labiales hidratantes con brillos. Ideal para consentirte o regalar.",
        images: ["assets/product_11.jpeg", "assets/product_9.jpeg"]
    }
};

const whatsappLinkBase = 'https://wa.me/message/Z4TVXHB3UPMRI1';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENÚ MÓVIL ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-open');
            mobileMenuBtn.classList.toggle('open');
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-open');
                mobileMenuBtn.classList.remove('open');
            });
        });
    }

    // --- 2. CABECERA SHRINK EN SCROLL ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
    });

    // --- 3. FILTRADO POR CATEGORÍAS VISUALES ---
    const categoryCards = document.querySelectorAll('.category-circle-card');
    const productCards = document.querySelectorAll('.product-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const filterValue = card.getAttribute('data-filter');

            productCards.forEach(pCard => {
                const cardCategories = pCard.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || cardCategories.includes(filterValue)) {
                    pCard.style.display = 'flex';
                    pCard.style.opacity = '0';
                    pCard.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        pCard.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
                        pCard.style.opacity = '1';
                        pCard.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    pCard.style.display = 'none';
                }
            });
        });
    });

    // --- 4. CONTROLADORES DE CANTIDAD EN TARJETAS ---
    productCards.forEach(card => {
        const decBtn = card.querySelector('.qty-btn:first-child');
        const incBtn = card.querySelector('.qty-btn:last-child');
        const qtyVal = card.querySelector('.qty-val');
        const buyBtn = card.querySelector('.btn-buy-whatsapp-premium');

        if (decBtn && incBtn && qtyVal) {
            decBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar abrir el QuickView al tocar la cantidad
                let val = parseInt(qtyVal.textContent);
                if (val > 1) qtyVal.textContent = val - 1;
            });

            incBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                let val = parseInt(qtyVal.textContent);
                qtyVal.textContent = val + 1;
            });
        }

        if (buyBtn) {
            buyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productName = buyBtn.getAttribute('data-product');
                const quantity = qtyVal ? qtyVal.textContent : 1;
                
                const message = `¡Hola Belpa Beauty! 💖 Vengo de su página web y me encantaría ordenar:\n*${quantity}x ${productName}* 🛍️\n\n¿Me confirman disponibilidad y el total de la compra? ¡Muchas gracias! ✨`;
                const encodedMessage = encodeURIComponent(message);
                
                window.open(`${whatsappLinkBase}?text=${encodedMessage}`, '_blank');
            });
        }
    });

    // --- 5. VENTANA MODAL (QUICK VIEW) ---
    const quickviewModal = document.getElementById('quickview-modal');
    const modalClose = document.getElementById('modal-close');
    const modalMainImg = document.getElementById('modal-main-img');
    const modalThumbnails = document.getElementById('modal-thumbnails');
    const modalBadge = document.getElementById('modal-badge');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalDescription = document.getElementById('modal-description');
    const modalQtyVal = document.getElementById('modal-qty-val');
    const modalDecBtn = document.getElementById('modal-dec-btn');
    const modalIncBtn = document.getElementById('modal-inc-btn');
    const modalBuyBtn = document.getElementById('modal-buy-btn');

    let activeModalProductId = null;

    // Abrir Modal al tocar imagen o nombre
    productCards.forEach(card => {
        const imgContainer = card.querySelector('.product-image-container');
        const titleEl = card.querySelector('.product-name');
        const productId = card.getAttribute('data-product-id');

        const openModal = () => {
            const data = productsData[productId];
            if (!data) return;

            activeModalProductId = productId;

            // Inyectar datos
            modalTitle.textContent = data.name;
            modalBadge.textContent = data.badge;
            modalPrice.textContent = data.price;
            modalDescription.textContent = data.description;
            modalMainImg.src = data.images[0];
            modalMainImg.alt = data.name;
            modalQtyVal.textContent = 1;

            // Inyectar miniaturas
            modalThumbnails.innerHTML = '';
            data.images.forEach((imgSrc, idx) => {
                const thumb = document.createElement('img');
                thumb.className = `modal-thumb ${idx === 0 ? 'active' : ''}`;
                thumb.src = imgSrc;
                thumb.alt = `${data.name} ${idx + 1}`;
                
                thumb.addEventListener('click', () => {
                    document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    modalMainImg.src = imgSrc;
                });
                
                modalThumbnails.appendChild(thumb);
            });

            // Mostrar modal
            quickviewModal.classList.add('open');
            document.body.style.overflow = 'hidden'; // Evitar scroll
        };

        if (imgContainer) imgContainer.addEventListener('click', openModal);
        if (titleEl) titleEl.addEventListener('click', openModal);
    });

    // Cerrar Modal
    const closeModal = () => {
        quickviewModal.classList.remove('open');
        document.body.style.overflow = '';
        activeModalProductId = null;
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    
    if (quickviewModal) {
        quickviewModal.addEventListener('click', (e) => {
            if (e.target === quickviewModal) closeModal();
        });
    }

    // Cantidades dentro del Modal
    if (modalDecBtn && modalIncBtn && modalQtyVal) {
        modalDecBtn.addEventListener('click', () => {
            let val = parseInt(modalQtyVal.textContent);
            if (val > 1) modalQtyVal.textContent = val - 1;
        });

        modalIncBtn.addEventListener('click', () => {
            let val = parseInt(modalQtyVal.textContent);
            modalQtyVal.textContent = val + 1;
        });
    }

    // Comprar desde el Modal
    if (modalBuyBtn) {
        modalBuyBtn.addEventListener('click', () => {
            if (!activeModalProductId) return;
            const data = productsData[activeModalProductId];
            const quantity = modalQtyVal.textContent;

            const message = `¡Hola Belpa Beauty! 💖 Vengo de su página web y me encantaría ordenar:\n*${quantity}x ${data.name}* 🛍️\n\n¿Me confirman disponibilidad y el total? ¡Muchas gracias! ✨`;
            const encodedMessage = encodeURIComponent(message);
            
            window.open(`${whatsappLinkBase}?text=${encodedMessage}`, '_blank');
            closeModal();
        });
    }

    // --- 6. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ) ---
    const faqCards = document.querySelectorAll('.faq-card');
    faqCards.forEach(card => {
        const questionBtn = card.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isOpen = card.classList.contains('open');
            faqCards.forEach(c => c.classList.remove('open'));
            if (!isOpen) {
                card.classList.add('open');
            }
        });
    });

    // --- 7. MASCOTA INTERACTIVA (BELPA KITTY) ---
    const mascot = document.getElementById('belpa-mascot');
    const speechBubble = document.getElementById('mascot-speech-bubble');

    const kittyQuotes = [
        "¡Un toque de rubor Jelly Blush y estarás radiante! ✨🍮",
        "¡Nuestros ramos de crochet duran para siempre, como tu luz! 🌸",
        "¡Hacemos envíos rápidos y seguros a toda Colombia! ✈️🇨🇴",
        "¡Tus pestañas se verán infinitas con la pestañina Prosa! 👀",
        "¡Haz clic en la foto de cualquier producto para ver su detalle! 🛍️",
        "¡El Lip Gloss de Sheglam es el más brillante de todos! 💄🌟",
        "¡Personalizamos tu regalo con notas dulces y chocolates! 🎁🍬"
    ];

    let quoteIndex = 0;

    function changeKittyQuote() {
        if (!speechBubble) return;
        speechBubble.style.opacity = '0';
        speechBubble.style.transform = 'translateX(-10px) translateY(10px)';
        
        setTimeout(() => {
            quoteIndex = (quoteIndex + 1) % kittyQuotes.length;
            speechBubble.innerText = kittyQuotes[quoteIndex];
            speechBubble.style.opacity = '1';
            speechBubble.style.transform = 'translateX(0) translateY(0)';
        }, 300);
    }

    if (mascot) {
        mascot.addEventListener('click', () => {
            changeKittyQuote();
            mascot.style.transform = 'scale(0.85) rotate(-15deg)';
            setTimeout(() => {
                mascot.style.transform = 'scale(1.15) rotate(15deg)';
            }, 150);
        });
    }

    // --- 8. FORMULARIO DE CONTACTO REDIRIGIDO A WHATSAPP ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('name').value;
            const messageInput = document.getElementById('message-text').value;

            const message = `¡Hola Belpa Beauty! 💖 Mi nombre es *${nameInput}* y les escribo desde su página web. Tengo la siguiente consulta:\n\n"${messageInput}"\n\n¡Muchas gracias! ✨`;
            const encodedMessage = encodeURIComponent(message);

            window.open(`${whatsappLinkBase}?text=${encodedMessage}`, '_blank');
            contactForm.reset();
        });
    }

    // --- 9. PARTÍCULAS DE BRILLO MODERADAS Y DELICADAS ---
    const sparkleContainer = document.getElementById('sparkle-container');

    function createSparkle(x, y) {
        if (!sparkleContainer) return;
        
        // Skip sparkles if reduced motion is preferred
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const particle = document.createElement('div');
        particle.className = 'sparkle-particle';
        
        const cuteIcons = ['💖', '🌸', '✨', '🎀', '⭐'];
        const randomIcon = cuteIcons[Math.floor(Math.random() * cuteIcons.length)];
        particle.innerHTML = randomIcon;
        particle.style.fontSize = Math.random() * 12 + 10 + 'px';
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 60 + 30;
        const xOffset = Math.cos(angle) * velocity;
        const yOffset = Math.sin(angle) * velocity;
        
        particle.style.position = 'fixed';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.transition = 'transform 1.4s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 1.4s ease';
        
        sparkleContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(0) rotate(${Math.random() * 360}deg)`;
            particle.style.opacity = '0';
        }, 50);
        
        setTimeout(() => {
            particle.remove();
        }, 1400);
    }

    // Partículas al hacer clic
    window.addEventListener('click', (e) => {
        for (let i = 0; i < 6; i++) {
            createSparkle(e.clientX, e.clientY);
        }
    });

    // Partículas al mover el mouse (muy limitadas)
    let moveCount = 0;
    window.addEventListener('mousemove', (e) => {
        moveCount++;
        if (moveCount % 16 === 0) {
            createSparkle(e.clientX, e.clientY);
        }
    });

    // --- 10. CONTROLES DEL VIDEO DE UNBOXING ---
    const video = document.getElementById('belpa-video');
    const muteBtn = document.getElementById('video-mute-btn');
    
    if (video && muteBtn) {
        muteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            if (video.muted) {
                muteBtn.textContent = '🔇';
                muteBtn.setAttribute('aria-label', 'Activar sonido');
            } else {
                muteBtn.textContent = '🔊';
                muteBtn.setAttribute('aria-label', 'Silenciar video');
            }
        });
    }

    // --- 11. ESCENA INTERACTIVA THREE.JS (FLOR 3D) ---
    initThreeJS();
});

// Implementación de Three.js con Flor 3D de crochet procedural interactiva
function initThreeJS() {
    const canvas = document.getElementById('hero-3d-canvas');
    const fallbackImg = document.getElementById('hero-fallback-img');
    
    if (!canvas || !fallbackImg) return;
    
    // Check support for WebGL
    function hasWebGL() {
        try {
            const tempCanvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (tempCanvas.getContext('webgl') || tempCanvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
    
    if (!hasWebGL()) {
        canvas.style.display = 'none';
        fallbackImg.style.display = 'block';
        return;
    }
    
    // Configuración de la Escena
    const width = 340;
    const height = 340;
    
    const scene = new THREE.Scene();
    
    // Cámara
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.8;
    
    // Renderizador con fondo transparente y antialiasing
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.6);
    pointLight.position.set(-5, 3, 2);
    scene.add(pointLight);
    
    // Grupos para rotación y lerp de movimiento
    const flowerGroup = new THREE.Group();
    const tiltGroup = new THREE.Group();
    flowerGroup.add(tiltGroup);
    scene.add(flowerGroup);
    
    // 1. Centro Dorado de Crochet
    const centerGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const centerMat = new THREE.MeshPhysicalMaterial({
        color: 0xFAD02C, // Amarillo dorado brillante
        roughness: 0.1,
        metalness: 0.75,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    const centerMesh = new THREE.Mesh(centerGeo, centerMat);
    centerMesh.position.set(0, 0, 0.2);
    tiltGroup.add(centerMesh);
    
    // 2. Pétalos Rosados Satinados (Aplastados y organizados en anillo)
    const numPetals = 8;
    const petalGeo = new THREE.SphereGeometry(0.65, 32, 16);
    petalGeo.scale(0.5, 0.9, 0.15); // Pétalo alargado y aplanado en el eje Z
    
    const petalMat = new THREE.MeshPhysicalMaterial({
        color: 0xFF8CA3, // Rosa de la marca
        roughness: 0.15,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    
    for (let i = 0; i < numPetals; i++) {
        const petalMesh = new THREE.Mesh(petalGeo, petalMat);
        const angle = (i * Math.PI * 2) / numPetals;
        const petalDistance = 0.52;
        
        petalMesh.position.set(Math.cos(angle) * petalDistance, Math.sin(angle) * petalDistance, 0.05);
        petalMesh.rotation.z = angle - Math.PI / 2;
        petalMesh.rotation.x = 0.2; // Inclinación leve hacia el frente para volumen
        tiltGroup.add(petalMesh);
    }
    
    // 3. Tallo Verde Salvia
    const stemGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.8, 16);
    const stemMat = new THREE.MeshPhysicalMaterial({
        color: 0x4E6E58, // Verde salvia
        roughness: 0.35,
        metalness: 0.05
    });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    stemMesh.position.set(0, -0.9, -0.1);
    stemMesh.rotation.x = 0.05;
    tiltGroup.add(stemMesh);
    
    // 4. Hojitas Verdes a los lados
    const leafGeo = new THREE.SphereGeometry(0.28, 16, 8);
    leafGeo.scale(0.3, 0.6, 0.08);
    
    const leafMesh1 = new THREE.Mesh(leafGeo, stemMat);
    leafMesh1.position.set(0.16, -0.7, 0);
    leafMesh1.rotation.set(0.1, -0.2, -0.5);
    tiltGroup.add(leafMesh1);
    
    const leafMesh2 = new THREE.Mesh(leafGeo, stemMat);
    leafMesh2.position.set(-0.16, -1.0, 0);
    leafMesh2.rotation.set(0.1, 0.2, 0.5);
    tiltGroup.add(leafMesh2);
    
    // Seguimiento del Mouse para Lerpeado de Inclinación
    let targetTiltX = 0;
    let targetTiltY = 0;
    const container = document.getElementById('hero-3d-canvas-container');
    
    if (container) {
        container.addEventListener('mousemove', (e) => {
            // Ignorar interactividad si el usuario prefiere movimiento reducido
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const normalizedX = (x / rect.width) * 2 - 1;
            const normalizedY = (y / rect.height) * 2 - 1;
            
            targetTiltY = normalizedX * 0.45;
            targetTiltX = normalizedY * 0.45;
        });
        
        container.addEventListener('mouseleave', () => {
            targetTiltX = 0;
            targetTiltY = 0;
        });

        // Soporte táctil (Touch Events) para dispositivos móviles
        container.addEventListener('touchmove', (e) => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }
            if (e.touches.length > 0) {
                const rect = container.getBoundingClientRect();
                const touch = e.touches[0];
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                const normalizedX = Math.max(-1, Math.min(1, (x / rect.width) * 2 - 1));
                const normalizedY = Math.max(-1, Math.min(1, (y / rect.height) * 2 - 1));
                
                targetTiltY = normalizedX * 0.45;
                targetTiltX = normalizedY * 0.45;
            }
        }, { passive: true });

        container.addEventListener('touchend', () => {
            targetTiltX = 0;
            targetTiltY = 0;
        });
    }
    
    // Bucle de Animación
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotación continua alrededor del eje Y (se apaga si se prefiere movimiento reducido)
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            flowerGroup.rotation.y += 0.005;
            
            // Lerpeado suave de la inclinación por el mouse
            tiltGroup.rotation.x = THREE.MathUtils.lerp(tiltGroup.rotation.x, targetTiltX, 0.08);
            tiltGroup.rotation.z = THREE.MathUtils.lerp(tiltGroup.rotation.z, -targetTiltY, 0.08);
        } else {
            // Posición estática suave si hay movimiento reducido
            flowerGroup.rotation.y = 0;
            tiltGroup.rotation.x = 0;
            tiltGroup.rotation.z = 0;
        }
        
        renderer.render(scene, camera);
    }
    animate();
}
