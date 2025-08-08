// Efecto de scroll en el header (optimizado)
const header = document.getElementById('header');
let lastScrollY = window.scrollY;

function handleScroll() {
    if (Math.abs(window.scrollY - lastScrollY) > 5) {
        header.classList.toggle('scrolled', window.scrollY > 50);
        lastScrollY = window.scrollY;
    }
}

// Animaciones al hacer scroll (mejorado)
const animateElements = () => {
    document.querySelectorAll('.service-card, .location-map, .stat-item, .client-logo').forEach((el, i) => {
        if (el.getBoundingClientRect().top < window.innerHeight / 1.3) {
            setTimeout(() => {
                el.style.cssText = 'opacity: 1; transform: translateY(0); transition: all 0.6s ease;';
            }, i * 100);
        }
    });
};

// Inicialización (más limpia)
function init() {
    // Animaciones
    document.querySelectorAll('.service-card, .location-map, .stat-item, .client-logo').forEach(el => {
        el.style.cssText = 'opacity: 0; transform: translateY(30px); transition: all 0.6s ease;';
    });
    void document.querySelector('.service-card').offsetWidth; // Reflow
    animateElements();
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                document.querySelector('nav ul')?.classList.remove('active');
            }
        });
    });

    // Menú móvil responsivo (ACTUALIZADO)
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.setAttribute('aria-label', 'Menú');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.querySelector('.header-container').appendChild(menuToggle);

    const navMenu = document.querySelector('nav ul');
    
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        // Bloquear scroll cuando el menú está abierto
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Lazy loading de imágenes
    const lazyLoadImages = () => {
        if ('loading' in HTMLImageElement.prototype) {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        } else {
            const lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        lazyImageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                lazyImageObserver.observe(img);
            });
        }
    };

    lazyLoadImages();

    // Actualizar año en el footer
    document.querySelector('.footer-bottom p').textContent = `© ${new Date().getFullYear()} WAYAN LOGISTIC SERVICE CORP S.A.S. Todos los derechos reservados.`;
}

// Cargar cuando el DOM esté listo
if (document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}

// Event listeners optimizados
window.addEventListener('scroll', () => {
    handleScroll();
    animateElements();
}, { passive: true });

// Manejar cambios de tamaño de pantalla
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.querySelector('nav ul').classList.remove('active');
        document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

// Respetar preferencias de reducción de movimiento
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (motionQuery.matches) {
    document.querySelectorAll('.floating').forEach(el => {
        el.style.animation = 'none';
    });
}
