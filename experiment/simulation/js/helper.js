// Helper functions for PDA-CFG Equivalence Experiment

class EquivalenceHelper {
    constructor() {
        this.currentLanguage = null;
        this.currentStep = 0;
        this.mode = 'pda'; // 'pda' or 'cfg'
        this.userProgress = {
            pda: { completed: [], current: 0 },
            cfg: { completed: [], current: 0 }
        };
    }

    // Initialize with a specific language
    setLanguage(languageId) {
        this.currentLanguage = equivalenceData.languages.find(lang => lang.id === languageId);
        this.resetProgress();
        return this.currentLanguage;
    }

    // Reset progress for current language
    resetProgress() {
        if (!this.currentLanguage) return;
        
        this.userProgress = {
            pda: { 
                completed: [], 
                current: 0,
                steps: [...this.currentLanguage.pdaSteps]
            },
            cfg: { 
                completed: [], 
                current: 0,
                steps: [...this.currentLanguage.cfgSteps]
            }
        };
        this.mode = 'pda';
    }

    // Get current step based on mode
    getCurrentStep() {
        if (!this.currentLanguage) return null;
        
        const progress = this.userProgress[this.mode];
        const steps = this.mode === 'pda' ? 
            this.currentLanguage.pdaSteps : 
            this.currentLanguage.cfgSteps;
            
        if (progress.current >= steps.length) {
            return null; // No more steps
        }
        
        return steps[progress.current];
    }

    // Get choices for current step
    getCurrentChoices() {
        const step = this.getCurrentStep();
        return step ? step.choices : [];
    }

    // Validate answer and provide feedback
    validateAnswer(choiceIndex) {
        const step = this.getCurrentStep();
        if (!step) return { valid: false, message: "No current step" };

        const isCorrect = choiceIndex === step.correctAnswer;
        
        let feedback = {
            correct: isCorrect,
            explanation: step.explanation,
            hint: step.hint,
            message: ""
        };

        if (isCorrect) {
            feedback.message = "Correct! " + step.explanation;
            this.markStepCompleted();
        } else {
            feedback.message = "Incorrect. " + step.hint;
        }

        return feedback;
    }

    // Mark current step as completed and advance
    markStepCompleted() {
        const progress = this.userProgress[this.mode];
        progress.completed.push(progress.current);
        progress.current++;
    }

    // Move to previous step
    goToPreviousStep() {
        const progress = this.userProgress[this.mode];
        if (progress.current > 0) {
            progress.current--;
            // Remove from completed if it was completed
            const index = progress.completed.indexOf(progress.current);
            if (index > -1) {
                progress.completed.splice(index, 1);
            }
        }
    }

    // Switch between PDA and CFG modes
    switchMode() {
        this.mode = this.mode === 'pda' ? 'cfg' : 'pda';
        return this.mode;
    }

    // Check if current language is completed
    isLanguageCompleted() {
        if (!this.currentLanguage) return false;
        
        const pdaCompleted = this.userProgress.pda.current >= this.currentLanguage.pdaSteps.length;
        const cfgCompleted = this.userProgress.cfg.current >= this.currentLanguage.cfgSteps.length;
        
        return pdaCompleted && cfgCompleted;
    }

    // Get progress percentage
    getProgress() {
        if (!this.currentLanguage) return 0;
        
        const pdaTotal = this.currentLanguage.pdaSteps.length;
        const cfgTotal = this.currentLanguage.cfgSteps.length;
        const totalSteps = pdaTotal + cfgTotal;
        
        const pdaCompleted = this.userProgress.pda.completed.length;
        const cfgCompleted = this.userProgress.cfg.completed.length;
        const completedSteps = pdaCompleted + cfgCompleted;
        
        return Math.round((completedSteps / totalSteps) * 100);
    }

    // Get current PDA state information
    getCurrentPDAState() {
        const step = this.getCurrentStep();
        if (!step || this.mode !== 'pda') return null;
        
        return {
            state: step.currentState,
            input: step.remainingInput,
            stack: [...step.stack].reverse(), // Show stack top-to-bottom
            description: step.description
        };
    }

    // Get current CFG derivation information
    getCurrentCFGState() {
        const step = this.getCurrentStep();
        if (!step || this.mode !== 'cfg') return null;
        
        return {
            currentString: step.currentString,
            targetString: step.targetString,
            description: step.description
        };
    }

    // Generate hint for current step
    getHint() {
        const step = this.getCurrentStep();
        return step ? step.hint : "No hint available";
    }

    // Get all completed steps for display
    getCompletedSteps(mode = null) {
        const targetMode = mode || this.mode;
        const progress = this.userProgress[targetMode];
        const steps = targetMode === 'pda' ? 
            this.currentLanguage.pdaSteps : 
            this.currentLanguage.cfgSteps;
            
        return progress.completed.map(stepIndex => ({
            ...steps[stepIndex],
            index: stepIndex
        }));
    }

    // Format stack for display
    formatStack(stack) {
        if (!stack || stack.length === 0) return "[ empty ]";
        return "[ " + [...stack].reverse().join(", ") + " ]";
    }

    // Format input string for display
    formatInput(input) {
        if (!input || input.length === 0) return '""';
        return `"${input}"`;
    }

    // Format CFG string for display
    formatCFGString(str) {
        if (!str || str.length === 0) return "ε";
        return str;
    }

    // Get language statistics
    getLanguageStats() {
        if (!this.currentLanguage) return null;
        
        return {
            name: this.currentLanguage.name,
            description: this.currentLanguage.description,
            testString: this.currentLanguage.testString,
            pdaSteps: this.currentLanguage.pdaSteps.length,
            cfgSteps: this.currentLanguage.cfgSteps.length,
            progress: this.getProgress()
        };
    }

    // Validate PDA transition
    validatePDATransition(fromState, input, stackTop, toState, stackAction) {
        if (!this.currentLanguage || !this.currentLanguage.pda) return false;
        
        const transitions = this.currentLanguage.pda.transitions;
        return transitions.some(t => 
            t.from === fromState &&
            t.input === input &&
            t.stackPop === stackTop &&
            t.to === toState
        );
    }

    // Validate CFG production
    validateCFGProduction(leftSide, rightSide) {
        if (!this.currentLanguage || !this.currentLanguage.cfg) return false;
        
        const productions = this.currentLanguage.cfg.productions;
        return productions.some(p => 
            p.left === leftSide && p.right === rightSide
        );
    }

    // Get next language in sequence
    getNextLanguage() {
        if (!this.currentLanguage) return null;
        
        const currentIndex = equivalenceData.languages.findIndex(
            lang => lang.id === this.currentLanguage.id
        );
        
        if (currentIndex < equivalenceData.languages.length - 1) {
            return equivalenceData.languages[currentIndex + 1];
        }
        
        return equivalenceData.languages[0]; // Wrap around
    }

    // Export progress data
    exportProgress() {
        return {
            languageId: this.currentLanguage ? this.currentLanguage.id : null,
            mode: this.mode,
            progress: { ...this.userProgress },
            timestamp: new Date().toISOString()
        };
    }

    // Import progress data
    importProgress(progressData) {
        if (!progressData) return false;
        
        try {
            if (progressData.languageId) {
                this.setLanguage(progressData.languageId);
            }
            
            if (progressData.mode) {
                this.mode = progressData.mode;
            }
            
            if (progressData.progress) {
                this.userProgress = { ...progressData.progress };
            }
            
            return true;
        } catch (error) {
            console.error('Failed to import progress:', error);
            return false;
        }
    }

    // Generate summary report
    generateSummary() {
        if (!this.currentLanguage) return null;
        
        const stats = this.getLanguageStats();
        const pdaCompleted = this.userProgress.pda.completed.length;
        const cfgCompleted = this.userProgress.cfg.completed.length;
        
        return {
            language: stats.name,
            testString: stats.testString,
            totalSteps: stats.pdaSteps + stats.cfgSteps,
            completedSteps: pdaCompleted + cfgCompleted,
            progress: stats.progress,
            pdaProgress: {
                completed: pdaCompleted,
                total: stats.pdaSteps,
                percentage: Math.round((pdaCompleted / stats.pdaSteps) * 100)
            },
            cfgProgress: {
                completed: cfgCompleted,
                total: stats.cfgSteps,
                percentage: Math.round((cfgCompleted / stats.cfgSteps) * 100)
            },
            isComplete: this.isLanguageCompleted()
        };
    }
}

// Utility functions for DOM manipulation and animation
class UIHelper {
    static animateElement(element, animationClass, duration = 300) {
        return new Promise((resolve) => {
            element.classList.add(animationClass);
            setTimeout(() => {
                element.classList.remove(animationClass);
                resolve();
            }, duration);
        });
    }

    static showToast(message, type = 'info', duration = 3000) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Style the toast
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        toast.style.backgroundColor = colors[type] || colors.info;

        // Add to document
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    static updateProgress(element, percentage) {
        if (!element) return;
        
        const fill = element.querySelector('.progress-fill');
        if (fill) {
            fill.style.width = `${percentage}%`;
        }
    }

    static highlightElement(element, duration = 2000) {
        if (!element) return;
        
        element.classList.add('highlighted');
        setTimeout(() => {
            element.classList.remove('highlighted');
        }, duration);
    }

    static createSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.innerHTML = `
            <div class="spinner-circle"></div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .spinner {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            .spinner-circle {
                width: 24px;
                height: 24px;
                border: 2px solid #e5e7eb;
                border-top: 2px solid #7c3aed;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        return spinner;
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.EquivalenceHelper = EquivalenceHelper;
    window.UIHelper = UIHelper;
}
