document.addEventListener('DOMContentLoaded', function() {
  // Menú hamburguesa
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      menuToggle.innerHTML = navMenu.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }
  
  // Header al hacer scroll
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }
  
  // Smooth scroll para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Animaciones al hacer scroll
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.service-card, .about-image, .location-map, .stat-item, .client-logo');
    
    elements.forEach((el, index) => {
      const elementPosition = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight / 1.3) {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  };
  
  // Inicializar animaciones
  window.addEventListener('load', function() {
    document.querySelectorAll('.service-card, .about-image, .location-map, .stat-item, .client-logo').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease';
    });
    
    // Forzar reflow para activar las transiciones
    void document.querySelector('.service-card').offsetWidth;
    
    animateOnScroll();
  });
  
  window.addEventListener('scroll', animateOnScroll);
  
  // Lazy loading de imágenes
  const lazyLoadImages = function() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.onload = () => {
              img.style.opacity = '1';
              img.style.transition = 'opacity 0.5s ease';
            };
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });
      
      lazyImages.forEach(img => {
        img.style.opacity = '0';
        imageObserver.observe(img);
      });
    } else {
      // Fallback para navegadores sin soporte a IntersectionObserver
      lazyImages.forEach(img => {
        img.src = img.dataset.src || img.src;
        img.style.opacity = '1';
      });
    }
  };
  
  lazyLoadImages();
  
  // Debugger para peticiones no deseadas (opcional)
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
});
