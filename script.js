// Optimización del header al hacer scroll
const header = document.getElementById('header');
let lastScrollY = window.scrollY;

function handleScroll() {
    if (Math.abs(window.scrollY - lastScrollY) > 5) {
        header.classList.toggle('scrolled', window.scrollY > 50);
        lastScrollY = window.scrollY;
    }
}

// Observador de intersección optimizado
const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
};

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(animateOnScroll, observerOptions);

// Inicialización optimizada
function init() {
    // Configurar observador para elementos animados
    document.querySelectorAll('.service-card, .about-image, .location-map, .stat-item, .client-logo').forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll mejorado
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Manejo de menú móvil
                if (window.innerWidth <= 768) {
                    document.querySelector('nav ul').classList.remove('active');
                    document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
                }
                
                // Cambiar URL sin recargar
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });

    // Menú móvil accesible
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Bloquear scroll cuando el menú está abierto
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });
    }

    // Lazy loading nativo con fallback
    if ('loading' in HTMLImageElement.prototype) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    lazyImageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });

        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });
    }

    // Actualizar año en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Event listeners optimizados
    const optimizedScroll = () => {
        handleScroll();
        window.requestAnimationFrame(optimizedScroll);
    };
    
    window.addEventListener('scroll', optimizedScroll, { passive: true });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            document.body.style.overflow = '';
        }
    });
}

// Cargar cuando el DOM esté listo
if (document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}

// Manejar cambios en la preferencia de reducción de movimiento
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
motionQuery.addEventListener('change', () => {
    document.querySelectorAll('.floating').forEach(el => {
        el.style.animation = motionQuery.matches ? 'none' : '';
    });
});
