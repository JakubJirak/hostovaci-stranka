// 404 Page JavaScript - Theme Toggle and Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
    
    // Set initial theme based on system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = prefersDark ? 'dark' : 'light';
    
    // Apply initial theme
    updateTheme(currentTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        updateTheme(currentTheme);
        
        // Add a slight animation to the button
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 150);
    });
    
    // Update theme function
    function updateTheme(theme) {
        body.setAttribute('data-color-scheme', theme);
        
        // Update icon with smooth transition
        themeIcon.style.transform = 'scale(0)';
        setTimeout(() => {
            themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
            themeIcon.style.transform = 'scale(1)';
        }, 150);
        
        // Update aria-label for accessibility
        themeToggle.setAttribute('aria-label', 
            theme === 'light' 
                ? 'Přepnout na tmavý režim' 
                : 'Přepnout na světlý režim'
        );
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // Only update if user hasn't manually set a preference
        const hasUserPreference = body.getAttribute('data-color-scheme') !== null;
        if (!hasUserPreference) {
            currentTheme = e.matches ? 'dark' : 'light';
            updateTheme(currentTheme);
        }
    });
    
    // Add smooth scroll behavior for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Alt + T for theme toggle
        if (e.altKey && e.key.toLowerCase() === 't') {
            e.preventDefault();
            themeToggle.click();
        }
        
        // Enter key support for custom elements
        if (e.key === 'Enter' && e.target.classList.contains('theme-toggle')) {
            e.preventDefault();
            e.target.click();
        }
    });
    
    // Add intersection observer for animations (if supported)
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                } else {
                    entry.target.style.animationPlayState = 'paused';
                }
            });
        }, observerOptions);
        
        // Observe animated elements
        document.querySelectorAll('.error-number__digit, .shape').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Add enhanced button interactions
    const errorBtn = document.querySelector('.error-btn');
    if (errorBtn) {
        // Add ripple effect on click
        errorBtn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
    
    // Add focus management for better accessibility
    let focusedElementBeforeModal = null;
    
    // Handle focus trapping (if needed for future modals)
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
            
            if (e.key === 'Escape') {
                // Handle escape key if needed
                document.activeElement.blur();
            }
        });
    }
    
    // Enhanced error number animation control
    const errorDigits = document.querySelectorAll('.error-number__digit');
    
    // Add staggered animation on page load
    errorDigits.forEach((digit, index) => {
        digit.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover pause effect
        digit.addEventListener('mouseenter', () => {
            digit.style.animationPlayState = 'paused';
        });
        
        digit.addEventListener('mouseleave', () => {
            digit.style.animationPlayState = 'running';
        });
    });
    
    // Add performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`404 page loaded in ${Math.round(loadTime)}ms`);
            
            // Optional: Report to analytics (if implemented)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    event_category: '404_page',
                    event_label: 'load_time',
                    value: Math.round(loadTime)
                });
            }
        });
    }
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .error-btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize floating shapes animation control
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        // Add random delay for more natural movement
        const randomDelay = Math.random() * 2;
        shape.style.animationDelay = `${randomDelay}s`;
        
        // Add interaction on hover
        shape.addEventListener('mouseenter', () => {
            shape.style.animationDuration = '3s';
        });
        
        shape.addEventListener('mouseleave', () => {
            shape.style.animationDuration = '6s';
        });
    });
});

// Export functions for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateTheme,
        trapFocus
    };
}