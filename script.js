// Efecto de scroll en el header (optimizado)
const header = document.getElementById('header');
function handleScroll() {
    header.classList.toggle('scrolled', window.scrollY > 50);
}
window.addEventListener('scroll', handleScroll);

// Animaciones al hacer scroll (mejorado)
const animateElements = () => {
    document.querySelectorAll('.service-card, .about-image, .location-map, .stat-item, .client-logo').forEach((el, i) => {
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
    document.querySelectorAll('.service-card, .about-image, .location-map, .stat-item, .client-logo').forEach(el => {
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

    // Menú móvil responsivo
    function setupMobileMenu() {
        if (window.innerWidth <= 768 && !document.querySelector('.menu-toggle')) {
            const toggle = document.createElement('div');
            toggle.className = 'menu-toggle';
            toggle.innerHTML = '<i class="fas fa-bars"></i>';
            toggle.addEventListener('click', () => {
                document.querySelector('nav ul').classList.toggle('active');
            });
            document.querySelector('header').appendChild(toggle);
        }
    }
    
    window.addEventListener('resize', setupMobileMenu);
    setupMobileMenu();

    // Lazy loading de imágenes
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.onload = () => img.style.opacity = '1';
                imgObserver.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        imgObserver.observe(img);
    });
}

window.addEventListener('load', init);
window.addEventListener('scroll', animateElements);

// Debugger para encontrar qué está haciendo la petición
(function() {
    const nativeFetch = window.fetch;
    window.fetch = function(url) {
        if(url.toString().includes('search')) {
            console.error("Petición a search detectada:", url, new Error().stack);
        }
        return nativeFetch.apply(this, arguments);
    };

    const nativeXHR = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        if(arguments[1] && arguments[1].includes('search')) {
            console.error("XHR a search detectado:", arguments[1], new Error().stack);
        }
        nativeXHR.apply(this, arguments);
    };
})();