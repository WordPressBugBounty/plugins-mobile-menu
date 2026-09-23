/**
 * Mobile Menu Live Preview System
 * 
 * @since 2.8.7
 */

class MobileMenuLivePreview {
    constructor() {
        this.isPreviewActive = false;
        this.previewContainer = null;
        this.previewButton = null;
        this.previewIframe = null;
        this.currentSettings = {};
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createPreviewSystem());
        } else {
            this.createPreviewSystem();
        }
    }

    createPreviewSystem() {
        this.createPreviewButton();
        this.createPreviewContainer();
        this.bindEvents();
        this.watchForChanges();
    }

    createPreviewButton() {
        this.previewButton = document.createElement('div');
        this.previewButton.id = 'mobmenu-live-preview-btn';
        this.previewButton.innerHTML = `
            <div class="preview-btn-content">
                <span class="preview-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </span>
                <span class="preview-text">Live Preview</span>
            </div>
            <div class="preview-btn-tooltip">Click to toggle mobile menu preview</div>
        `;

        // Add styles
        const buttonStyles = `
            #mobmenu-live-preview-btn {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px;
                border-radius: 50px;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 999999;
                transition: all 0.3s ease;
                user-select: none;
                min-width: 140px;
                text-align: center;
            }

            #mobmenu-live-preview-btn:hover {
                transform: translateY(-50%) scale(1.05);
                box-shadow: 0 6px 25px rgba(0,0,0,0.4);
            }

            #mobmenu-live-preview-btn.active {
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            }

            .preview-btn-content {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 500;
                font-size: 14px;
            }

            .preview-icon {
                display: flex;
                align-items: center;
            }

            .preview-btn-tooltip {
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
                margin-bottom: 8px;
            }

            #mobmenu-live-preview-btn:hover .preview-btn-tooltip {
                opacity: 1;
            }

            .preview-btn-tooltip::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border: 4px solid transparent;
                border-top-color: rgba(0,0,0,0.8);
            }

            @media (max-width: 768px) {
                #mobmenu-live-preview-btn {
                    right: 10px;
                    min-width: 60px;
                    padding: 12px;
                }
                
                .preview-text {
                    display: none;
                }
            }
        `;

        const style = document.createElement('style');
        style.textContent = buttonStyles;
        document.head.appendChild(style);

        document.body.appendChild(this.previewButton);
    }

    createPreviewContainer() {
        this.previewContainer = document.createElement('div');
        this.previewContainer.id = 'mobmenu-live-preview-container';
        this.previewContainer.innerHTML = `
            <div class="preview-overlay"></div>
            <div class="preview-panel">
                <div class="preview-header">
                    <h3>Mobile Menu Live Preview</h3>
                    <div class="preview-controls">
                        <select id="preview-device-selector">
                            <option value="mobile">Mobile (375px)</option>
                            <option value="tablet">Tablet (768px)</option>
                            <option value="desktop">Desktop (1024px)</option>
                        </select>
                        <button class="preview-close">×</button>
                    </div>
                </div>
                <div class="preview-content">
                    <div class="preview-device-frame" data-device="mobile">
                        <iframe id="mobmenu-preview-iframe" src="about:blank"></iframe>
                    </div>
                </div>
            </div>
        `;

        // Add preview container styles
        const containerStyles = `
            #mobmenu-live-preview-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000000;
                display: none;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            #mobmenu-live-preview-container.active {
                display: block;
            }

            .preview-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                backdrop-filter: blur(5px);
            }

            .preview-panel {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                overflow: hidden;
                max-width: 90vw;
                max-height: 90vh;
                min-width: 400px;
                min-height: 600px;
            }

            .preview-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                background: #f8f9fa;
                border-bottom: 1px solid #e9ecef;
            }

            .preview-header h3 {
                margin: 0;
                color: #333;
                font-size: 18px;
                font-weight: 600;
            }

            .preview-controls {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            #preview-device-selector {
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                background: white;
                font-size: 14px;
            }

            .preview-close {
                background: #f8f9fa;
                border: 1px solid #ddd;
                width: 32px;
                height: 32px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .preview-close:hover {
                background: #e9ecef;
                border-color: #adb5bd;
            }

            .preview-content {
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 500px;
            }

            .preview-device-frame {
                position: relative;
                background: #333;
                border-radius: 20px;
                padding: 20px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
            }

            .preview-device-frame[data-device="mobile"] {
                width: 375px;
                height: 667px;
            }

            .preview-device-frame[data-device="tablet"] {
                width: 768px;
                height: 1024px;
            }

            .preview-device-frame[data-device="desktop"] {
                width: 1024px;
                height: 768px;
            }

            .preview-device-frame::before {
                content: '';
                position: absolute;
                top: 8px;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 4px;
                background: #666;
                border-radius: 2px;
            }

            #mobmenu-preview-iframe {
                width: 100%;
                height: calc(100% - 16px);
                border: none;
                border-radius: 12px;
                background: white;
                margin-top: 16px;
            }

            @media (max-width: 1200px) {
                .preview-panel {
                    width: 95vw;
                    height: 95vh;
                    max-width: none;
                    max-height: none;
                }

                .preview-content {
                    overflow: auto;
                }

                .preview-device-frame[data-device="desktop"] {
                    width: 800px;
                    height: 600px;
                }
            }

            @media (max-width: 768px) {
                .preview-panel {
                    min-width: 320px;
                }

                .preview-device-frame[data-device="tablet"],
                .preview-device-frame[data-device="desktop"] {
                    width: 320px;
                    height: 480px;
                }
            }
        `;

        const containerStyle = document.createElement('style');
        containerStyle.textContent = containerStyles;
        document.head.appendChild(containerStyle);

        document.body.appendChild(this.previewContainer);
    }

    bindEvents() {
        // Preview button click
        this.previewButton.addEventListener('click', () => {
            this.togglePreview();
        });

        // Close button click
        const closeBtn = this.previewContainer.querySelector('.preview-close');
        closeBtn.addEventListener('click', () => {
            this.closePreview();
        });

        // Overlay click to close
        const overlay = this.previewContainer.querySelector('.preview-overlay');
        overlay.addEventListener('click', () => {
            this.closePreview();
        });

        // Device selector change
        const deviceSelector = this.previewContainer.querySelector('#preview-device-selector');
        deviceSelector.addEventListener('change', (e) => {
            this.changeDevice(e.target.value);
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isPreviewActive) {
                this.closePreview();
            }
        });
    }

    watchForChanges() {
        // Watch for form changes in the admin panel
        const formElements = document.querySelectorAll('#mobmenu-options input, #mobmenu-options select, #mobmenu-options textarea');
        
        formElements.forEach(element => {
            element.addEventListener('change', () => {
                if (this.isPreviewActive) {
                    this.updatePreview();
                }
            });

            // For real-time updates on text inputs
            if (element.type === 'text' || element.type === 'number' || element.tagName === 'TEXTAREA') {
                element.addEventListener('input', this.debounce(() => {
                    if (this.isPreviewActive) {
                        this.updatePreview();
                    }
                }, 500));
            }
        });

        // Watch for color picker changes
        document.addEventListener('change', (e) => {
            if (e.target.matches('.wp-color-picker') && this.isPreviewActive) {
                this.updatePreview();
            }
        });
    }

    togglePreview() {
        if (this.isPreviewActive) {
            this.closePreview();
        } else {
            this.openPreview();
        }
    }

    openPreview() {
        this.isPreviewActive = true;
        this.previewButton.classList.add('active');
        this.previewContainer.classList.add('active');
        this.previewButton.querySelector('.preview-text').textContent = 'Close Preview';
        
        this.loadPreviewContent();
    }

    closePreview() {
        this.isPreviewActive = false;
        this.previewButton.classList.remove('active');
        this.previewContainer.classList.remove('active');
        this.previewButton.querySelector('.preview-text').textContent = 'Live Preview';
    }

    changeDevice(device) {
        const frame = this.previewContainer.querySelector('.preview-device-frame');
        frame.setAttribute('data-device', device);
    }

    loadPreviewContent() {
        const iframe = this.previewContainer.querySelector('#mobmenu-preview-iframe');
        
        // Create preview HTML with current settings
        const previewHTML = this.generatePreviewHTML();
        
        // Write content to iframe
        iframe.onload = () => {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(previewHTML);
            iframeDoc.close();
            
            this.injectPreviewStyles(iframeDoc);
            this.injectPreviewScript(iframeDoc);
        };
        
        iframe.src = 'about:blank';
    }

    generatePreviewHTML() {
        const settings = this.getCurrentSettings();
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Mobile Menu Preview</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: #f5f5f5;
                        padding: 20px;
                        min-height: 100vh;
                    }
                    .preview-content {
                        max-width: 600px;
                        margin: 0 auto;
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    .preview-notice {
                        background: #e3f2fd;
                        color: #1976d2;
                        padding: 15px;
                        border-radius: 6px;
                        margin-bottom: 20px;
                        text-align: center;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="preview-content">
                    <div class="preview-notice">
                        🎯 This is a live preview of your mobile menu. Click the menu button to test it!
                    </div>
                    <h2>Sample Page Content</h2>
                    <p>This is sample content to demonstrate how your mobile menu will look and behave on your website.</p>
                    <p>Use the floating menu button to test different states and animations.</p>
                </div>
                
                <!-- Mobile Menu HTML will be injected here -->
                <div id="mobile-menu-container"></div>
            </body>
            </html>
        `;
    }

    injectPreviewStyles(doc) {
        // Get preview CSS
        const cssLink = doc.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = mobmenu_preview_vars.plugin_url + 'includes/css/mobmenu-preview.css?v=' + Date.now();
        doc.head.appendChild(cssLink);

        // Add icon font CSS
        const iconCssLink = doc.createElement('link');
        iconCssLink.rel = 'stylesheet';
        iconCssLink.href = mobmenu_preview_vars.plugin_url + 'includes/css/mobmenu-icons.css?v=' + Date.now();
        doc.head.appendChild(iconCssLink);

        // Add dynamic styles based on current settings
        const dynamicStyles = this.generateDynamicCSS();
        const styleElement = doc.createElement('style');
        styleElement.textContent = dynamicStyles;
        doc.head.appendChild(styleElement);
    }

    injectPreviewScript(doc) {
        // Inject mobile menu JavaScript
        const script = doc.createElement('script');
        script.src = mobmenu_preview_vars.plugin_url + 'includes/js/mobmenu-preview-init.js?v=' + Date.now();
        
        script.onload = () => {
            // Initialize mobile menu after script loads
            this.initializeMobileMenu(doc);
        };
        
        doc.head.appendChild(script);
    }

    initializeMobileMenu(doc) {
        const settings = this.getCurrentSettings();
        
        // Create mobile menu HTML
        const menuHTML = this.generateMobileMenuHTML(settings);
        const container = doc.getElementById('mobile-menu-container');
        container.innerHTML = menuHTML;

        // Initialize mobile menu functionality for both left and right menus
        const initScript = doc.createElement('script');
        initScript.textContent = `
            // Initialize mobile menu preview
            if (typeof initMobileMenu === 'function') {
                initMobileMenu();
            }
            
            // Enhanced initialization for both left and right menus
            function initBothMenus() {
                // Left menu functionality
                const leftMenuButton = document.querySelector('.mobmenu-left-bt');
                const leftCloseButton = document.querySelector('.mobmenu-left-panel .mob-cancel-button');
                const leftPanel = document.querySelector('.mobmenu-left-panel');
                
                // Right menu functionality
                const rightMenuButton = document.querySelector('.mobmenu-right-bt');
                const rightCloseButton = document.querySelector('.mobmenu-right-panel .mob-cancel-button');
                const rightPanel = document.querySelector('.mobmenu-right-panel');
                
                const overlay = document.querySelector('.mobmenu-overlay');

                // Left menu events
                if (leftMenuButton && leftPanel) {
                    leftMenuButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        leftPanel.classList.add('show-panel');
                        if (overlay) overlay.classList.add('active');
                    });
                }
                
                if (leftCloseButton) {
                    leftCloseButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        if (leftPanel) leftPanel.classList.remove('show-panel');
                        if (overlay) overlay.classList.remove('active');
                    });
                }

                // Right menu events
                if (rightMenuButton && rightPanel) {
                    rightMenuButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        rightPanel.classList.add('show-panel');
                        if (overlay) overlay.classList.add('active');
                    });
                }
                
                if (rightCloseButton) {
                    rightCloseButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        if (rightPanel) rightPanel.classList.remove('show-panel');
                        if (overlay) overlay.classList.remove('active');
                    });
                }

                // Overlay click to close
                if (overlay) {
                    overlay.addEventListener('click', function() {
                        if (leftPanel) leftPanel.classList.remove('show-panel');
                        if (rightPanel) rightPanel.classList.remove('show-panel');
                        overlay.classList.remove('active');
                    });
                }
            }
            
            // Initialize both menus
            initBothMenus();
        `;
        doc.body.appendChild(initScript);
    }

    generateMobileMenuHTML(settings) {
        // Determine which menus to show
        const showLeftMenu = settings.enable_left_menu !== false;
        const showRightMenu = settings.enable_right_menu === true;
        
        // Get logo/header content
        let headerContent = '';
        if (settings.header_branding === 'logo' && settings.logo_img) {
            headerContent = `<div class="mob-menu-logo-holder"><img src="${settings.logo_img}" alt="Logo" style="max-height: ${(settings.header_height || 60) - 20}px;"></div>`;
        } else if (settings.header_branding === 'text' || settings.header_text) {
            headerContent = `<div class="mob-menu-logo-holder"><span class="headertext" style="color: ${settings.header_text_color || '#333333'};">${settings.header_text || 'Site Title'}</span></div>`;
        } else if (settings.header_branding === 'logo-text' && settings.logo_img && settings.header_text) {
            headerContent = `<div class="mob-menu-logo-holder">
                <img src="${settings.logo_img}" alt="Logo" style="max-height: ${(settings.header_height || 60) - 20}px; margin-right: 10px;">
                <span class="headertext" style="color: ${settings.header_text_color || '#333333'};">${settings.header_text}</span>
            </div>`;
        }

        // Generate menu HTML
        return `
            <div class="mobmenu">
                <div class="mob-menu-header-holder" style="background-color: ${settings.header_bg_color || '#ffffff'}; height: ${settings.header_height || 60}px;">
                    ${showLeftMenu ? `
                    <div class="mobmenul-container">
                        <a href="#" class="mobmenu-left-bt mobmenu-trigger-action" data-panel-target="mobmenu-left-panel" style="color: ${settings.left_menu_icon_color || '#333333'};">
                            <i class="mobmenu-font mob-icon-${settings.left_menu_icon || 'menu'}" style="font-size: ${settings.left_icon_font_size || 25}px;"></i>
                            ${settings.left_menu_text ? `<span class="left-menu-icon-text">${settings.left_menu_text}</span>` : ''}
                        </a>
                    </div>` : ''}
                    
                    ${headerContent}
                    
                    ${showRightMenu ? `
                    <div class="mobmenur-container">
                        <a href="#" class="mobmenu-right-bt mobmenu-trigger-action" data-panel-target="mobmenu-right-panel" style="color: ${settings.right_menu_icon_color || '#333333'};">
                            ${settings.right_menu_text ? `<span class="right-menu-icon-text">${settings.right_menu_text}</span>` : ''}
                            <i class="mobmenu-font mob-icon-${settings.right_menu_icon || 'menu'}" style="font-size: ${settings.right_icon_font_size || 25}px;"></i>
                        </a>
                    </div>` : ''}
                </div>
                
                <div class="mobmenu-overlay" style="background-color: ${settings.overlay_bg_color || 'rgba(0,0,0,0.5)'};"></div>
                
                ${showLeftMenu ? `
                <div class="mobmenu-panel mobmenu-left-panel" style="background-color: ${settings.left_panel_bg_color || '#ffffff'}; width: ${settings.left_menu_width || 270}px;">
                    <div class="mobmenu-content">
                        <a href="#" class="mob-cancel-button" style="color: ${settings.left_panel_cancel_button_color || '#333333'};">
                            <i class="mobmenu-font mob-cancel-button mob-icon-cancel"></i>
                        </a>
                        <ul class="wp-mobile-menu">
                            <li><a href="#" style="color: ${settings.left_panel_text_color || '#333333'};">Home</a></li>
                            <li><a href="#" style="color: ${settings.left_panel_text_color || '#333333'};">About Us</a></li>
                            <li class="menu-item-has-children">
                                <a href="#" style="color: ${settings.left_panel_text_color || '#333333'};">Services</a>
                                <ul class="sub-menu" style="background-color: ${settings.left_panel_submenu_bgcolor || '#f5f5f5'};">
                                    <li><a href="#" style="color: ${settings.left_panel_submenu_text_color || '#666666'};">Web Design</a></li>
                                    <li><a href="#" style="color: ${settings.left_panel_submenu_text_color || '#666666'};">Development</a></li>
                                    <li><a href="#" style="color: ${settings.left_panel_submenu_text_color || '#666666'};">SEO Services</a></li>
                                </ul>
                            </li>
                            <li><a href="#" style="color: ${settings.left_panel_text_color || '#333333'};">Portfolio</a></li>
                            <li><a href="#" style="color: ${settings.left_panel_text_color || '#333333'};">Contact</a></li>
                        </ul>
                    </div>
                </div>` : ''}
                
                ${showRightMenu ? `
                <div class="mobmenu-panel mobmenu-right-panel" style="background-color: ${settings.right_panel_bg_color || '#ffffff'}; width: ${settings.right_menu_width || 270}px;">
                    <div class="mobmenu-content">
                        <a href="#" class="mob-cancel-button" style="color: ${settings.right_panel_cancel_button_color || '#333333'};">
                            <i class="mobmenu-font mob-cancel-button mob-icon-cancel"></i>
                        </a>
                        <ul class="wp-mobile-menu">
                            <li><a href="#" style="color: ${settings.right_panel_text_color || '#333333'};">Account</a></li>
                            <li><a href="#" style="color: ${settings.right_panel_text_color || '#333333'};">Settings</a></li>
                            <li class="menu-item-has-children">
                                <a href="#" style="color: ${settings.right_panel_text_color || '#333333'};">Categories</a>
                                <ul class="sub-menu" style="background-color: ${settings.right_panel_submenu_bgcolor || '#f5f5f5'};">
                                    <li><a href="#" style="color: ${settings.right_panel_submenu_text_color || '#666666'};">Technology</a></li>
                                    <li><a href="#" style="color: ${settings.right_panel_submenu_text_color || '#666666'};">Business</a></li>
                                    <li><a href="#" style="color: ${settings.right_panel_submenu_text_color || '#666666'};">Lifestyle</a></li>
                                </ul>
                            </li>
                            <li><a href="#" style="color: ${settings.right_panel_text_color || '#333333'};">Help</a></li>
                            <li><a href="#" style="color: ${settings.right_panel_text_color || '#333333'};">Logout</a></li>
                        </ul>
                    </div>
                </div>` : ''}
            </div>
        `;
    }

    generateDynamicCSS() {
        const settings = this.getCurrentSettings();
        
        return `
            @media screen and (max-width: 1024px) {
                .mobmenu { display: block !important; }
                
                .mobmenu-left-panel {
                    background-color: ${settings.left_panel_bg_color || '#ffffff'} !important;
                    width: ${settings.left_menu_width || 270}px !important;
                }
                
                .mobmenu-right-panel {
                    background-color: ${settings.right_panel_bg_color || '#ffffff'} !important;
                    width: ${settings.right_menu_width || 270}px !important;
                }
                
                .mobmenu-left-panel a {
                    color: ${settings.left_panel_text_color || '#333333'} !important;
                }
                
                .mobmenu-right-panel a {
                    color: ${settings.right_panel_text_color || '#333333'} !important;
                }
                
                .mobmenu-left-panel .sub-menu {
                    background-color: ${settings.left_panel_submenu_bgcolor || '#f5f5f5'} !important;
                }
                
                .mobmenu-right-panel .sub-menu {
                    background-color: ${settings.right_panel_submenu_bgcolor || '#f5f5f5'} !important;
                }
                
                .mobmenu-left-panel .sub-menu a {
                    color: ${settings.left_panel_submenu_text_color || '#666666'} !important;
                }
                
                .mobmenu-right-panel .sub-menu a {
                    color: ${settings.right_panel_submenu_text_color || '#666666'} !important;
                }
                
                .mob-menu-header-holder {
                    background-color: ${settings.header_bg_color || '#ffffff'} !important;
                    height: ${settings.header_height || 60}px !important;
                }
                
                .mobmenul-container i {
                    color: ${settings.left_menu_icon_color || '#333333'} !important;
                    font-size: ${settings.left_icon_font_size || 25}px !important;
                }
                
                .mobmenur-container i {
                    color: ${settings.right_menu_icon_color || '#333333'} !important;
                    font-size: ${settings.right_icon_font_size || 25}px !important;
                }
                
                .left-menu-icon-text {
                    color: ${settings.left_menu_text_color || '#333333'} !important;
                }
                
                .right-menu-icon-text {
                    color: ${settings.right_menu_text_color || '#333333'} !important;
                }
                
                .headertext {
                    color: ${settings.header_text_color || '#333333'} !important;
                }
                
                .mobmenu-left-panel .mob-cancel-button {
                    color: ${settings.left_panel_cancel_button_color || '#333333'} !important;
                }
                
                .mobmenu-right-panel .mob-cancel-button {
                    color: ${settings.right_panel_cancel_button_color || '#333333'} !important;
                }
                
                .mobmenu-overlay {
                    background-color: ${settings.overlay_bg_color || 'rgba(0,0,0,0.5)'} !important;
                }
                
                .mobmenu-left-panel a:hover {
                    background-color: ${settings.left_panel_hover_bgcolor || 'rgba(0,0,0,0.1)'} !important;
                    color: ${settings.left_panel_hover_text_color || '#0073aa'} !important;
                }
                
                .mobmenu-right-panel a:hover {
                    background-color: ${settings.right_panel_hover_bgcolor || 'rgba(0,0,0,0.1)'} !important;
                    color: ${settings.right_panel_hover_text_color || '#0073aa'} !important;
                }
            }
        `;
    }

    getCurrentSettings() {
        const settings = {};
        
        // Helper function to get option value by ID
        const getOptionValue = (id) => {
            // Try different selectors for the option
            const selectors = [
                `input[name="${id}"]`,
                `select[name="${id}"]`,
                `textarea[name="${id}"]`,
                `input[id="${id}"]`,
                `select[id="${id}"]`,
                `textarea[id="${id}"]`,
                `input[name="mobmenu_options[${id}]"]`,
                `select[name="mobmenu_options[${id}]"]`,
                `textarea[name="mobmenu_options[${id}]"]`,
                `input[data-option="${id}"]`,
                `select[data-option="${id}"]`,
                `textarea[data-option="${id}"]`,
                `.wp-color-picker[data-option="${id}"]`,
                `.wp-color-picker[name="mobmenu_options[${id}]"]`
            ];
            
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    if (element.type === 'checkbox') {
                        return element.checked;
                    } else if (element.type === 'radio') {
                        const checkedRadio = document.querySelector(`${selector}:checked`);
                        return checkedRadio ? checkedRadio.value : '';
                    } else if (element.classList && element.classList.contains('wp-color-picker')) {
                        // WordPress color picker value
                        return element.value;
                    } else {
                        return element.value;
                    }
                }
            }
            
            // Try WordPress color picker format
            const colorPicker = document.querySelector(`#${id}`);
            if (colorPicker && colorPicker.classList.contains('wp-color-picker')) {
                return colorPicker.value;
            }
            
            return '';
        };

        // Get all form values with enhanced detection
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.name) {
                let settingName = input.name;
                // Remove array brackets from name
                if (settingName.includes('[') && settingName.includes(']')) {
                    settingName = settingName.match(/\[([^\]]+)\]/)?.[1] || settingName;
                }
                
                if (input.type === 'checkbox') {
                    settings[settingName] = input.checked;
                } else if (input.type === 'radio') {
                    if (input.checked) {
                        settings[settingName] = input.value;
                    }
                } else {
                    settings[settingName] = input.value;
                }
            }
        });

        // Specifically get key mobile menu settings
        const keySettings = {
            'left_menu': getOptionValue('left_menu'),
            'right_menu': getOptionValue('right_menu'),
            'left_menu_icon': getOptionValue('left_menu_icon'),
            'right_menu_icon': getOptionValue('right_menu_icon'),
            'left_menu_icon_color': getOptionValue('left_menu_icon_color'),
            'right_menu_icon_color': getOptionValue('right_menu_icon_color'),
            'header_bg_color': getOptionValue('header_bg_color'),
            'header_text_color': getOptionValue('header_text_color'),
            'header_height': getOptionValue('header_height'),
            'left_panel_bg_color': getOptionValue('left_panel_bg_color'),
            'right_panel_bg_color': getOptionValue('right_panel_bg_color'),
            'left_panel_text_color': getOptionValue('left_panel_text_color'),
            'right_panel_text_color': getOptionValue('right_panel_text_color'),
            'left_panel_submenu_text_color': getOptionValue('left_panel_submenu_text_color'),
            'right_panel_submenu_text_color': getOptionValue('right_panel_submenu_text_color'),
            'left_panel_submenu_bgcolor': getOptionValue('left_panel_submenu_bgcolor'),
            'right_panel_submenu_bgcolor': getOptionValue('right_panel_submenu_bgcolor'),
            'left_menu_width': getOptionValue('left_menu_width'),
            'right_menu_width': getOptionValue('right_menu_width'),
            'left_menu_text': getOptionValue('left_menu_text'),
            'right_menu_text': getOptionValue('right_menu_text'),
            'header_text': getOptionValue('header_text'),
            'header_branding': getOptionValue('header_branding'),
            'logo_img': getOptionValue('logo_img'),
            'left_icon_font_size': getOptionValue('left_icon_font_size'),
            'right_icon_font_size': getOptionValue('right_icon_font_size'),
            'enable_left_menu': getOptionValue('enable_left_menu'),
            'enable_right_menu': getOptionValue('enable_right_menu'),
            'left_panel_cancel_button_color': getOptionValue('left_panel_cancel_button_color'),
            'right_panel_cancel_button_color': getOptionValue('right_panel_cancel_button_color'),
            'overlay_bg_color': getOptionValue('overlay_bg_color'),
            'left_panel_hover_bgcolor': getOptionValue('left_panel_hover_bgcolor'),
            'right_panel_hover_bgcolor': getOptionValue('right_panel_hover_bgcolor'),
            'left_panel_hover_text_color': getOptionValue('left_panel_hover_text_color'),
            'right_panel_hover_text_color': getOptionValue('right_panel_hover_text_color'),
        };

        // Merge key settings with general settings
        Object.assign(settings, keySettings);

        return settings;
    }

    updatePreview() {
        if (!this.isPreviewActive) return;
        
        this.debounce(() => {
            this.loadPreviewContent();
        }, 300)();
    }

    debounce(func, wait) {
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on mobile menu options page
    if (document.querySelector('#mobmenu-options') || window.location.href.includes('mobile-menu-options')) {
        new MobileMenuLivePreview();
    }
});