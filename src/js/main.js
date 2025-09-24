// Portfolio Website JavaScript Functionality

// DOM Elements
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const navMenu = document.getElementById('nav-menu');
const carouselSlides = document.getElementById('carousel-slides');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const modal = document.getElementById('about-modal');
const modalTriggers = document.querySelectorAll('.modal-trigger');
const modalClose = document.querySelector('.modal-close');

// Global Variables
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.carousel-slide').length;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCarousel();
    initializeModal();
    initializeScrollEffects();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeCTAButton();
    initializeContactVideo();
});

// Navigation functionality with sticky behavior and resizing
function initializeNavigation() {
    let lastScrollTop = 0;
    const navbarHeight = navbar.offsetHeight;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar resizing based on scroll position
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Always update active navigation link based on scroll position
        updateActiveNavLink();
        
        lastScrollTop = scrollTop;
    });
    
    // Navigation highlighting will be handled by the global updateActiveNavLink function
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                // Remove active class from all links first
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                
                // Add active class to clicked link immediately
                this.classList.add('active');
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update navigation after scroll completes
                setTimeout(() => {
                    updateActiveNavLink();
                }, 1000);
            }
        });
    });
}

// Helper function to update active navigation link (accessible globally)
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navbarHeight = navbar.offsetHeight;
    const scrollPos = window.scrollY + navbarHeight + 100;
    
    let currentSection = null;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });
    
    // Special case for bottom of page - highlight last menu item
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        currentSection = 'contact'; // Last section ID
    }
    
    // Update active link
    if (currentSection) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to corresponding link
        const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Carousel functionality
function initializeCarousel() {
    // Previous button
    prevBtn.addEventListener('click', () => {
        prevSlide();
    });
    
    // Next button
    nextBtn.addEventListener('click', () => {
        nextSlide();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    carouselSlides.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    carouselSlides.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function updateCarousel() {
    const translateX = -currentSlide * 100;
    carouselSlides.style.transform = `translateX(${translateX}%)`;
    
    // Update active slide indicator
    const slides = document.querySelectorAll('.carousel-slide');
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
}

// Modal functionality
function initializeModal() {
    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
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
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.skill-column, .about-content, .contact-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize CSS animations and transitions
function initializeAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.hero-content, .section-title, .carousel-slide');
    
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });
    
    
    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.cta-button, .modal-trigger, .social-link');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Form handling
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        // If using Formspree (or any external action), allow native submission
        const formAction = (contactForm.getAttribute('action') || '').toLowerCase();
        if (formAction.includes('formspree.io')) {
            return; // Do not attach simulated handler
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message! I\'ll get back to you soon.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimizations
const throttledResizeHandler = throttle(() => {
    // Handle resize events here
    updateCarousel();
}, 250);

window.addEventListener('resize', throttledResizeHandler);

// Initialize form handling when DOM is ready
document.addEventListener('DOMContentLoaded', initializeFormHandling);

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Fade in hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
});

// CTA Button functionality
function initializeCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const contactSection = document.getElementById('contact');
            
            if (contactSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = contactSection.offsetTop - navbarHeight;
                
                // Remove active class from all links first
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                
                // Add active class to contact link
                const contactLink = document.querySelector('.nav-link[href="#contact"]');
                if (contactLink) {
                    contactLink.classList.add('active');
                }
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update navigation after scroll completes
                setTimeout(() => {
                    updateActiveNavLink();
                }, 1000);
            }
        });
    }
}



// Contact video initialization
function initializeContactVideo() {
    const contactVideo = document.querySelector('.contact-video-background video');
    
    if (contactVideo) {
        // Ensure video plays
        contactVideo.addEventListener('loadeddata', function() {
            this.play().catch(e => {
                console.log('Video autoplay prevented:', e);
            });
        });
        
        // Force play on user interaction
        document.addEventListener('click', function() {
            if (contactVideo.paused) {
                contactVideo.play().catch(e => {
                    console.log('Video play failed:', e);
                });
            }
        }, { once: true });
        
        // Handle video loading errors
        contactVideo.addEventListener('error', function(e) {
            console.error('Video loading error:', e);
        });
        
        // Try to play immediately
        contactVideo.play().catch(e => {
            console.log('Initial video play failed:', e);
        });
    }
}

// Console welcome message
console.log('%c🚀 Portfolio Website Loaded Successfully!', 'color: #2563eb; font-size: 16px; font-weight: bold;');
console.log('%cBuilt with HTML5, SCSS, and JavaScript', 'color: #6b7280; font-size: 12px;');
