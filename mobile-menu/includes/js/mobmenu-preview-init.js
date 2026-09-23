/**
 * Mobile Menu Preview Initialization
 * Simple script to make the preview mobile menu functional
 */

function initMobileMenu() {
    // Get menu elements
    const menuButton = document.querySelector('.mobmenu-left-bt');
    const closeButton = document.querySelector('.mob-cancel-button');
    const overlay = document.querySelector('.mobmenu-overlay');
    const panel = document.querySelector('.mobmenu-left-panel');

    if (!menuButton || !panel) return;

    // Open menu function
    function openMenu() {
        if (overlay) {
            overlay.classList.add('active');
        }
        panel.classList.add('show-panel');
        document.body.style.overflow = 'hidden';
    }

    // Close menu function
    function closeMenu() {
        if (overlay) {
            overlay.classList.remove('active');
        }
        panel.classList.remove('show-panel');
        document.body.style.overflow = '';
    }

    // Event listeners
    if (menuButton) {
        menuButton.addEventListener('click', function(e) {
            e.preventDefault();
            openMenu();
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function() {
            closeMenu();
        });
    }

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && panel.classList.contains('show-panel')) {
            closeMenu();
        }
    });

    // Handle submenu toggles (if any)
    const menuItems = document.querySelectorAll('.wp-mobile-menu li');
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        const submenu = item.querySelector('.sub-menu');
        
        if (submenu && link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            });
        }
    });
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
    initMobileMenu();
}