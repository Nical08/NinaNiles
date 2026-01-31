// Utility: Detect mobile device
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPod/.test(navigator.userAgent) && !/iPad/.test(navigator.userAgent);
}

// Update responsive elements based on device
function updateResponsiveElements() {
    const cacca = document.querySelectorAll('.cacca');
    const puzzo = document.querySelectorAll('.puzzo');
    
    cacca.forEach(element => {
        element.className = isMobileDevice() ? 'contenuto' : 'content';
    });
    
    puzzo.forEach(element => {
        element.className = isMobileDevice() ? 'parallasse' : 'parallax';
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    updateResponsiveElements();
    initializeServices();
    initializeImageSlider();
    initializeHeaderScroll();
    handleURLHash();
});

// Responsive updates on resize (debounced)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateResponsiveElements, 250);
});

// Toggle mobile menu
function toggleMenu() {
    const menu = document.querySelector('.menu');
    const hamburger = document.querySelector('.hamburger');
    
    menu.classList.toggle('menu-active');
    
    // Update aria-expanded for accessibility
    const isExpanded = menu.classList.contains('menu-active');
    hamburger.setAttribute('aria-expanded', isExpanded);
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.querySelector('.menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (menu.classList.contains('menu-active') && 
        !menu.contains(e.target) && 
        !hamburger.contains(e.target)) {
        menu.classList.remove('menu-active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// Close menu when clicking on a link
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
        const menu = document.querySelector('.menu');
        const hamburger = document.querySelector('.hamburger');
        
        menu.classList.remove('menu-active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Services toggle functionality
function initializeServices() {
    const toggleButtons = document.querySelectorAll('.toggleButton');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.parentElement;
            const moreText = section.querySelector('.moreText');
            const isExpanded = moreText.classList.contains('expanded');
            
            if (isExpanded) {
                // Collapse
                moreText.style.height = `${moreText.scrollHeight}px`;
                setTimeout(() => {
                    moreText.style.height = '0';
                    moreText.style.opacity = '0';
                }, 10);
                
                moreText.classList.remove('expanded');
                section.classList.remove('expanded'); // Remove from parent too
                section.style.width = '';
                this.textContent = 'Visualizza di più';
                this.setAttribute('aria-expanded', 'false');
            } else {
                // Expand
                moreText.classList.add('expanded');
                section.classList.add('expanded'); // Add to parent for grid control
                moreText.style.height = `${moreText.scrollHeight}px`;
                moreText.style.opacity = '1';
                section.style.width = '100%';
                this.textContent = 'Visualizza di meno';
                this.setAttribute('aria-expanded', 'true');
                
                // Remove height after transition for dynamic content
                moreText.addEventListener('transitionend', function handler() {
                    if (moreText.classList.contains('expanded')) {
                        moreText.style.height = 'auto';
                    }
                    moreText.removeEventListener('transitionend', handler);
                });
                
                // Smooth scroll to expanded section
                setTimeout(() => {
                    section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    });
}

// Image slider for certificates
const images = [
    { src: './Img/Attestati/attestato1.jpg', title: 'Certificazione Professionale 1' },
    { src: './Img/Attestati/attestato2.jpg', title: 'Certificazione Professionale 2' },
    { src: './Img/Attestati/attestato3.jpg', title: 'Certificazione Professionale 3' },
    { src: './Img/Attestati/attestato4.jpg', title: 'Certificazione Professionale 4' },
    { src: './Img/Attestati/attestato5.jpg', title: 'Certificazione Professionale 5' },
    { src: './Img/Attestati/attestato6.jpg', title: 'Certificazione Professionale 6' }
];

let currentIndex = 0;
let autoChangeInterval;

function updateImage() {
    const imageElement = document.getElementById('current-image');
    if (imageElement && images[currentIndex]) {
        imageElement.src = images[currentIndex].src;
        imageElement.alt = images[currentIndex].title;
    }
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
}

function startAutoChange(interval = 4000) {
    stopAutoChange(); // Clear any existing interval
    autoChangeInterval = setInterval(nextImage, interval);
}

function stopAutoChange() {
    if (autoChangeInterval) {
        clearInterval(autoChangeInterval);
    }
}

function initializeImageSlider() {
    const imageContainer = document.querySelector('.contenitore-immagini');
    
    if (imageContainer) {
        updateImage();
        
        // Only start auto-change if user hasn't indicated preference for reduced motion
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            startAutoChange();
        }
        
        // Pause auto-change on hover
        imageContainer.addEventListener('mouseenter', stopAutoChange);
        imageContainer.addEventListener('mouseleave', () => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                startAutoChange();
            }
        });
        
        // Add keyboard navigation
        const leftButton = document.querySelector('.freccia-sinistra');
        const rightButton = document.querySelector('.freccia-destra');
        
        if (leftButton) {
            leftButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    prevImage();
                }
            });
        }
        
        if (rightButton) {
            rightButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    nextImage();
                }
            });
        }
    }
}

// Header scroll effect
function initializeHeaderScroll() {
    const header = document.getElementById('main-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Handle URL hash for direct service links
function handleURLHash() {
    const hash = window.location.hash;
    
    if (hash) {
        const targetElement = document.querySelector(hash);
        
        if (targetElement) {
            // Check if it's a service section
            const toggleButton = targetElement.parentElement?.querySelector('.toggleButton');
            
            if (toggleButton) {
                // Expand the section
                setTimeout(() => {
                    toggleButton.click();
                    
                    // Scroll to element after expansion
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }, 100);
            } else {
                // Just scroll to the element
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Update URL without jumping
            history.pushState(null, null, href);
        }
    });
});

// Intersection Observer for fade-in animations
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards
    document.querySelectorAll('.toggle-section').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Form validation helper (if you add a contact form later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Performance: Lazy loading images
if ('loading' in HTMLImageElement.prototype) {
    console.log('Native lazy loading supported');
} else {
    // Fallback for browsers that don't support lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Console message for developers
console.log('%c🌸 Nina Nails Website', 'color: #ff98bb; font-size: 20px; font-weight: bold;');
console.log('%cDeveloped with ❤️ by Web Development Innovations', 'color: #666; font-size: 12px;');