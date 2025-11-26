// Basic accessibility enhancements for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Skip link focus management
    const skipLink = document.querySelector('.skip-link');
    
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.setAttribute('tabindex', '-1');
                target.focus();
                setTimeout(() => target.removeAttribute('tabindex'), 1000);
            }
        });
    }

    // Add focus-visible behavior
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
});