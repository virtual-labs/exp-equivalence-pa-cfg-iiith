// Main Application Controller for PDA-CFG Equivalence Experiment
// Initializes and orchestrates the entire application

class EquivalenceExperiment {
    constructor() {
        this.controller = null;
        this.isInitialized = false;
        this.debugMode = false;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    // Initialize the application
    async initialize() {
        try {
            console.log('🚀 Initializing PDA-CFG Equivalence Experiment...');
            
            // Check for required dependencies
            this.checkDependencies();
            
            // Initialize the interactive controller
            this.controller = new InteractiveController();
            
            // Setup application-level event handlers
            this.setupGlobalEventHandlers();
            
            // Initialize UI components
            this.initializeUI();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('✅ PDA-CFG Equivalence Experiment initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize experiment:', error);
            this.showErrorMessage('Failed to initialize experiment. Please refresh the page.');
        }
    }

    // Check for required dependencies
    checkDependencies() {
        const required = [
            { name: 'D3.js', check: () => typeof d3 !== 'undefined' },
            { name: 'SweetAlert', check: () => typeof swal !== 'undefined' },
            { name: 'Equivalence Data', check: () => typeof equivalenceData !== 'undefined' },
            { name: 'Helper Classes', check: () => typeof EquivalenceHelper !== 'undefined' }
        ];

        const missing = required.filter(dep => !dep.check());
        
        if (missing.length > 0) {
            throw new Error(`Missing dependencies: ${missing.map(d => d.name).join(', ')}`);
        }
    }

    // Setup global event handlers
    setupGlobalEventHandlers() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.showErrorMessage('An unexpected error occurred. The experiment will continue to function.');
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showErrorMessage('A background operation failed. The experiment will continue to function.');
        });

        // Handle visibility changes (pause/resume)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onPageHidden();
            } else {
                this.onPageVisible();
            }
        });

        // Handle before unload (save state)
        window.addEventListener('beforeunload', (event) => {
            this.saveApplicationState();
        });

        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        const shortcuts = {
            'KeyH': () => this.showHelp(),
            'KeyR': () => this.controller?.resetSimulation(),
            'KeyC': () => this.controller?.changeLanguage(),
            'KeyS': () => this.saveApplicationState(),
            'KeyL': () => this.loadApplicationState(),
            'Escape': () => this.closeModals(),
            'F1': (e) => { e.preventDefault(); this.showHelp(); }
        };

        document.addEventListener('keydown', (event) => {
            // Only process if not typing in an input field
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            const key = event.code || event.key;
            if (shortcuts[key]) {
                event.preventDefault();
                shortcuts[key](event);
            }
        });
    }

    // Initialize UI components
    initializeUI() {
        // Setup responsive design handlers
        this.setupResponsiveDesign();
        
        // Initialize tooltips
        this.initializeTooltips();
        
        // Setup accessibility features
        this.setupAccessibility();
        
        // Initialize progress tracking
        this.initializeProgressTracking();
        
        // Setup theme handling
        this.setupThemeHandling();
    }

    // Setup responsive design
    setupResponsiveDesign() {
        const updateLayout = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            // Update CSS custom properties for responsive design
            document.documentElement.style.setProperty('--viewport-width', `${width}px`);
            document.documentElement.style.setProperty('--viewport-height', `${height}px`);
            
            // Handle mobile layout
            if (width < 768) {
                document.body.classList.add('mobile-layout');
            } else {
                document.body.classList.remove('mobile-layout');
            }
            
            // Handle tablet layout
            if (width >= 768 && width < 1024) {
                document.body.classList.add('tablet-layout');
            } else {
                document.body.classList.remove('tablet-layout');
            }
        };

        // Initial layout update
        updateLayout();
        
        // Update on resize (debounced)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateLayout, 150);
        });
    }

    // Initialize tooltips for help
    initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            element.addEventListener('mouseenter', (e) => {
                const rect = element.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - 40}px`;
                tooltip.classList.add('visible');
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });
        });
    }

    // Setup accessibility features
    setupAccessibility() {
        // Add ARIA labels and roles
        this.addAccessibilityAttributes();
        
        // Setup focus management
        this.setupFocusManagement();
        
        // Setup screen reader announcements
        this.setupScreenReaderAnnouncements();
    }

    // Add accessibility attributes
    addAccessibilityAttributes() {
        // Add roles and labels to key elements
        const elements = [
            { selector: '.simulation-panel', role: 'region', label: 'Simulation Panel' },
            { selector: '.action-selection-panel', role: 'form', label: 'Action Selection' },
            { selector: '.control-panel', role: 'toolbar', label: 'Experiment Controls' },
            { selector: '.choice-button', role: 'button', label: 'Choice Option' }
        ];

        elements.forEach(({ selector, role, label }) => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.setAttribute('role', role);
                el.setAttribute('aria-label', `${label} ${index + 1}`);
            });
        });
    }

    // Setup focus management
    setupFocusManagement() {
        // Focus trap for modal dialogs
        this.currentFocusTrap = null;
    }

    // Setup screen reader announcements
    setupScreenReaderAnnouncements() {
        // Create live region for announcements
        const announcer = document.createElement('div');
        announcer.className = 'sr-only live-region';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(announcer);
        
        this.announcer = announcer;
    }

    // Announce message to screen readers
    announce(message) {
        if (this.announcer) {
            this.announcer.textContent = message;
            setTimeout(() => {
                this.announcer.textContent = '';
            }, 1000);
        }
    }

    // Initialize progress tracking
    initializeProgressTracking() {
        // Track user interactions
        this.interactionLog = [];
        
        // Setup interaction tracking
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('choice-button')) {
                this.logInteraction('choice_selected', {
                    choice: event.target.textContent,
                    timestamp: Date.now()
                });
            }
        });
    }

    // Log user interaction
    logInteraction(type, data) {
        this.interactionLog.push({
            type,
            data,
            timestamp: Date.now(),
            url: window.location.href
        });
        
        // Keep only last 100 interactions
        if (this.interactionLog.length > 100) {
            this.interactionLog = this.interactionLog.slice(-100);
        }
    }

    // Setup theme handling
    setupThemeHandling() {
        // Detect system theme preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Apply theme
        this.applyTheme(prefersDark.matches ? 'dark' : 'light');
        
        // Listen for changes
        prefersDark.addEventListener('change', (e) => {
            this.applyTheme(e.matches ? 'dark' : 'light');
        });
    }

    // Apply theme
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('preferred-theme', theme);
    }

    // Setup performance monitoring
    setupPerformanceMonitoring() {
        // Monitor performance metrics
        if ('performance' in window) {
            this.performanceMetrics = {
                loadTime: performance.now(),
                interactions: 0,
                errors: 0
            };
            
            // Log performance periodically
            setInterval(() => {
                this.logPerformanceMetrics();
            }, 60000); // Every minute
        }
    }

    // Log performance metrics
    logPerformanceMetrics() {
        if (this.performanceMetrics) {
            const metrics = {
                ...this.performanceMetrics,
                memoryUsage: performance.memory ? {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                } : null,
                timestamp: Date.now()
            };
            
            console.log('Performance metrics:', metrics);
        }
    }

    // Handle page hidden
    onPageHidden() {
        // Pause any running animations or intervals
        if (this.controller) {
            this.controller.stopAutoStep();
        }
        
        // Save current state
        this.saveApplicationState();
    }

    // Handle page visible
    onPageVisible() {
        // Resume normal operation
        console.log('Page became visible again');
    }

    // Show welcome message
    showWelcomeMessage() {
        const message = `
            <div class="welcome-content">
                <h3>🎯 Welcome to PDA-CFG Equivalence Experiment</h3>
                <p>This experiment demonstrates the equivalence between Pushdown Automata (PDA) and Context-Free Grammars (CFG).</p>
                <ul>
                    <li>✨ Select actions step-by-step to see how both models recognize the same language</li>
                    <li>🔄 Use <kbd>Ctrl+C</kbd> to change languages</li>
                    <li>💡 Press <kbd>H</kbd> for hints</li>
                    <li>🔄 Press <kbd>R</kbd> to reset</li>
                </ul>
                <p><strong>Ready to explore the duality of formal language recognition?</strong></p>
            </div>
        `;
        
        swal({
            title: "PDA-CFG Equivalence",
            content: {
                element: "div",
                attributes: {
                    innerHTML: message
                }
            },
            icon: "info",
            button: "Let's Start!",
            className: "welcome-modal"
        });
    }

    // Show help dialog
    showHelp() {
        const helpContent = `
            <div class="help-content">
                <h4>🎯 Experiment Objective</h4>
                <p>Demonstrate that PDAs and CFGs recognize exactly the same class of languages (context-free languages).</p>
                
                <h4>📋 How to Use</h4>
                <ul>
                    <li><strong>Select Actions:</strong> Choose the correct PDA transition or CFG production rule</li>
                    <li><strong>Step Through:</strong> Follow the simulation step-by-step for both models</li>
                    <li><strong>Observe Equivalence:</strong> See how both approaches accept the same string</li>
                    <li><strong>Get Hints:</strong> Use the hint button when stuck</li>
                </ul>
                
                <h4>⌨️ Keyboard Shortcuts</h4>
                <ul>
                    <li><kbd>Ctrl+C</kbd> - Change language</li>
                    <li><kbd>R</kbd> - Reset simulation</li>
                    <li><kbd>H</kbd> - Show hint</li>
                    <li><kbd>S</kbd> - Save progress</li>
                    <li><kbd>L</kbd> - Load progress</li>
                </ul>
                
                <h4>🎨 Visual Elements</h4>
                <ul>
                    <li><strong>Purple:</strong> Current/active elements</li>
                    <li><strong>Green:</strong> Accept states and terminals</li>
                    <li><strong>Blue:</strong> Information and guidance</li>
                    <li><strong>Red:</strong> Errors and corrections</li>
                </ul>
            </div>
        `;
        
        swal({
            title: "Help & Instructions",
            content: {
                element: "div",
                attributes: {
                    innerHTML: helpContent
                }
            },
            icon: "info",
            button: "Got it!",
            className: "help-modal"
        });
    }

    // Show error message
    showErrorMessage(message) {
        swal({
            title: "Error",
            text: message,
            icon: "error",
            button: "OK"
        });
    }

    // Save application state
    saveApplicationState() {
        try {
            if (this.controller) {
                const state = this.controller.exportState();
                localStorage.setItem('pda-cfg-experiment-state', JSON.stringify(state));
                console.log('Application state saved');
            }
        } catch (error) {
            console.error('Failed to save application state:', error);
        }
    }

    // Load application state
    loadApplicationState() {
        try {
            const savedState = localStorage.getItem('pda-cfg-experiment-state');
            if (savedState && this.controller) {
                const state = JSON.parse(savedState);
                const success = this.controller.importState(state);
                if (success) {
                    UIHelper.showToast('Previous session restored', 'success');
                } else {
                    UIHelper.showToast('Failed to restore session', 'error');
                }
            }
        } catch (error) {
            console.error('Failed to load application state:', error);
            UIHelper.showToast('Failed to restore session', 'error');
        }
    }

    // Close any open modals
    closeModals() {
        // Close SweetAlert modals
        swal.close();
        
        // Close any custom modals
        document.querySelectorAll('.modal.open').forEach(modal => {
            modal.classList.remove('open');
        });
    }

    // Get application statistics
    getStatistics() {
        const stats = {
            version: '2.0.0',
            initialized: this.isInitialized,
            languages: equivalenceData.languages.length,
            interactions: this.interactionLog.length,
            uptime: Date.now() - (this.performanceMetrics?.loadTime || 0),
            currentLanguage: this.controller?.helper?.currentLanguage?.name || 'None',
            mode: this.controller?.mode || 'Unknown'
        };
        
        return stats;
    }

    // Export experiment data
    exportExperimentData() {
        const data = {
            statistics: this.getStatistics(),
            interactionLog: this.interactionLog,
            currentState: this.controller?.exportState(),
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `pda-cfg-experiment-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        UIHelper.showToast('Experiment data exported', 'success');
    }

    // Destroy the application
    destroy() {
        // Stop any running intervals
        if (this.controller) {
            this.controller.stopAutoStep();
        }
        
        // Save final state
        this.saveApplicationState();
        
        // Clean up event listeners
        window.removeEventListener('error', this.errorHandler);
        window.removeEventListener('unhandledrejection', this.rejectionHandler);
        document.removeEventListener('visibilitychange', this.visibilityHandler);
        window.removeEventListener('beforeunload', this.unloadHandler);
        
        // Mark as destroyed
        this.isInitialized = false;
        
        console.log('🔥 PDA-CFG Equivalence Experiment destroyed');
    }
}

// Initialize the application when the script loads
let experimentApp;

// Auto-initialize unless explicitly disabled
if (typeof window !== 'undefined' && !window.DISABLE_AUTO_INIT) {
    experimentApp = new EquivalenceExperiment();
}

// Export for manual initialization if needed
if (typeof window !== 'undefined') {
    window.EquivalenceExperiment = EquivalenceExperiment;
    window.experimentApp = experimentApp;
}

// Development helpers
if (typeof window !== 'undefined') {
    window.debugExperiment = () => {
        console.log('=== PDA-CFG Experiment Debug Info ===');
        console.log('Statistics:', experimentApp.getStatistics());
        console.log('Current State:', experimentApp.controller?.exportState());
        console.log('Interaction Log:', experimentApp.interactionLog.slice(-10));
        console.log('=====================================');
    };
}
