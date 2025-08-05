// Interactive Controller for PDA-CFG Equivalence Experiment
// Manages user interactions, step validation, and dual simulation coordination

class InteractiveController {
    constructor() {
        this.helper = new EquivalenceHelper();
        this.pdaVisualizer = null;
        this.cfgVisualizer = null;
        this.currentLanguageIndex = 0;
        this.mode = 'pda'; // 'pda' or 'cfg'
        this.isSimulationRunning = false;
        this.autoStepInterval = null;
        
        this.initializeComponents();
        this.setupEventListeners();
        this.loadInitialLanguage();
    }

    // Initialize visualizers and components
    initializeComponents() {
        // Initialize PDA visualizer
        this.pdaVisualizer = new PDAVisualizer('pda_visualization');
        this.pdaVisualizer.initialize();

        // Initialize CFG visualizer
        this.cfgVisualizer = new CFGVisualizer('cfg_visualization');
        this.cfgVisualizer.initialize();
    }

    // Setup event listeners
    setupEventListeners() {
        // Tab switching
        document.getElementById('pda_tab')?.addEventListener('click', () => {
            this.switchTab('pda');
        });

        document.getElementById('cfg_tab')?.addEventListener('click', () => {
            this.switchTab('cfg');
        });

        // Control buttons
        document.getElementById('change_language')?.addEventListener('click', () => {
            this.changeLanguage();
        });

        document.getElementById('reset_simulation')?.addEventListener('click', () => {
            this.resetSimulation();
        });

        document.getElementById('show_hint')?.addEventListener('click', () => {
            this.showHint();
        });

        document.getElementById('previous_step')?.addEventListener('click', () => {
            this.goToPreviousStep();
        });

        document.getElementById('auto_step')?.addEventListener('click', () => {
            this.toggleAutoStep();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'c') {
                event.preventDefault();
                this.changeLanguage();
            } else if (event.key === 'h' && !event.ctrlKey) {
                this.showHint();
            } else if (event.key === 'r' && !event.ctrlKey) {
                this.resetSimulation();
            } else if (event.key === 'p' && !event.ctrlKey) {
                this.goToPreviousStep();
            } else if (event.key === 'a' && !event.ctrlKey) {
                this.toggleAutoStep();
            }
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    // Load initial language
    loadInitialLanguage() {
        const firstLanguage = equivalenceData.languages[0];
        this.helper.setLanguage(firstLanguage.id);
        
        // Ensure helper mode matches controller mode
        this.helper.mode = this.mode;
        
        this.updateDisplay();
        this.updateActionChoices();
    }

    // Change to next language
    changeLanguage() {
        this.currentLanguageIndex = (this.currentLanguageIndex + 1) % equivalenceData.languages.length;
        const nextLanguage = equivalenceData.languages[this.currentLanguageIndex];
        
        this.helper.setLanguage(nextLanguage.id);
        this.mode = 'pda'; // Reset to PDA mode
        this.updateDisplay();
        this.updateActionChoices();
        
        UIHelper.showToast(`Switched to: ${nextLanguage.name}`, 'info');
    }

    // Reset current simulation
    resetSimulation() {
        this.helper.resetProgress();
        this.mode = 'pda'; // Reset to PDA mode
        this.updateDisplay();
        this.updateActionChoices();
        
        UIHelper.showToast('Simulation reset', 'success');
    }

    // Show hint for current step
    showHint() {
        const hint = this.helper.getHint();
        if (hint) {
            this.showFeedbackWithHighlight(hint, 'info', true);
            UIHelper.showToast('Hint displayed', 'info');
        } else {
            UIHelper.showToast('No hint available', 'warning');
        }
    }

    // Go to previous step
    goToPreviousStep() {
        this.helper.goToPreviousStep();
        this.updateDisplay();
        this.updateActionChoices();
        
        UIHelper.showToast('Moved to previous step', 'info');
    }

    // Update all display elements
    updateDisplay() {
        this.updateLanguageInfo();
        this.updateModeDisplay();
        this.updateCurrentState();
        this.updateStepsList();
        this.updateVisualizations();
        this.updateProgress();
    }

    // Update language information display
    updateLanguageInfo() {
        const stats = this.helper.getLanguageStats();
        if (!stats) return;

        const languageNameEl = document.getElementById('language_name');
        const testStringEl = document.getElementById('test_string');
        const remainingInputEl = document.getElementById('remaining_input_display');

        if (languageNameEl) languageNameEl.textContent = stats.name;
        if (testStringEl) testStringEl.textContent = `"${stats.testString}"`;
        
        // Update remaining input based on current mode
        if (remainingInputEl) {
            if (this.mode === 'pda') {
                const state = this.helper.getCurrentPDAState();
                if (state && state.input !== undefined) {
                    remainingInputEl.textContent = `"${state.input}"`;
                } else {
                    // Fallback to test string for initial state
                    remainingInputEl.textContent = stats ? `"${stats.testString}"` : '""';
                }
            } else {
                const state = this.helper.getCurrentCFGState();
                if (state && state.targetString !== undefined) {
                    remainingInputEl.textContent = `"${state.targetString}"`;
                } else {
                    // Fallback to test string for initial state
                    remainingInputEl.textContent = stats ? `"${stats.testString}"` : '""';
                }
            }
        }
    }

    // Update mode display (PDA vs CFG)
    updateModeDisplay() {
        const selectionModeEl = document.getElementById('selection_mode');
        const selectionTitleEl = document.getElementById('selection_title');

        if (selectionModeEl) {
            selectionModeEl.textContent = this.mode === 'pda' ? 'PDA Mode' : 'CFG Mode';
            selectionModeEl.className = `mode-badge ${this.mode === 'pda' ? 'pda-mode' : 'cfg-mode'}`;
        }

        if (selectionTitleEl) {
            selectionTitleEl.textContent = this.mode === 'pda' ? 
                'Select PDA Transition' : 'Select CFG Production';
        }
    }

    // Update current state information
    updateCurrentState() {
        if (this.mode === 'pda') {
            this.updatePDAState();
        } else {
            this.updateCFGState();
        }
    }

    // Update PDA state display
    updatePDAState() {
        const state = this.helper.getCurrentPDAState();
        if (!state) return;

        const currentStateEl = document.getElementById('pda_current_state');
        const remainingInputEl = document.getElementById('pda_remaining_input');
        const stackContentsEl = document.getElementById('pda_stack_contents');

        if (currentStateEl) currentStateEl.textContent = state.state;
        if (remainingInputEl) remainingInputEl.textContent = this.helper.formatInput(state.input);
        if (stackContentsEl) stackContentsEl.textContent = this.helper.formatStack(state.stack);
    }

    // Update CFG state display
    updateCFGState() {
        const state = this.helper.getCurrentCFGState();
        if (!state) return;

        const currentStringEl = document.getElementById('cfg_current_string');
        const targetStringEl = document.getElementById('cfg_target_string');

        if (currentStringEl) currentStringEl.textContent = this.helper.formatCFGString(state.currentString);
        if (targetStringEl) targetStringEl.textContent = `"${state.targetString}"`;
    }

    // Update steps list
    updateStepsList() {
        const pdaStepsEl = document.getElementById('pda_steps_list');
        const cfgStepsEl = document.getElementById('cfg_steps_list');

        if (pdaStepsEl) this.populateStepsList(pdaStepsEl, 'pda');
        if (cfgStepsEl) this.populateStepsList(cfgStepsEl, 'cfg');
    }

    // Populate steps list for a specific mode
    populateStepsList(container, mode) {
        if (!container) return;

        container.innerHTML = '';
        const completedSteps = this.helper.getCompletedSteps(mode);
        const currentStep = this.helper.getCurrentStep();

        // Add completed steps
        completedSteps.forEach((step, index) => {
            const stepEl = document.createElement('div');
            stepEl.className = 'step-item completed';
            stepEl.innerHTML = `
                <div class="step-number">${step.stepNumber}</div>
                <div class="step-description">${step.description}</div>
            `;
            container.appendChild(stepEl);
        });

        // Add current step if exists and matches mode
        if (currentStep && this.helper.mode === mode) {
            const stepEl = document.createElement('div');
            stepEl.className = 'step-item current';
            stepEl.innerHTML = `
                <div class="step-number">${currentStep.stepNumber}</div>
                <div class="step-description">${currentStep.description}</div>
            `;
            container.appendChild(stepEl);
        }

        // Add placeholder if no steps
        if (container.children.length === 0) {
            const placeholderEl = document.createElement('div');
            placeholderEl.className = 'step-item';
            placeholderEl.textContent = 'No steps completed yet';
            container.appendChild(placeholderEl);
        }
    }

    // Update visualizations
    updateVisualizations() {
        // Update PDA visualization
        if (this.pdaVisualizer && this.helper.currentLanguage) {
            this.pdaVisualizer.setPDA(this.helper.currentLanguage.pda);
            const pdaState = this.helper.getCurrentPDAState();
            if (pdaState) {
                console.log('Updating PDA with enhanced state:', pdaState);
                this.pdaVisualizer.updateState(
                    pdaState.state, 
                    pdaState.description, // Use description as transition label
                    pdaState.stack, 
                    pdaState.input
                );
            }
        }

        // Update CFG visualization
        if (this.cfgVisualizer && this.helper.currentLanguage) {
            this.cfgVisualizer.setCFG(this.helper.currentLanguage.cfg);
            const cfgState = this.helper.getCurrentCFGState();
            if (cfgState) {
                console.log('Updating CFG with state:', cfgState);
                // Pass the current string directly, not split into array
                this.cfgVisualizer.updateDerivation(cfgState.currentString);
            }
        }
    }

    // Update progress indicator
    updateProgress() {
        const progress = this.helper.getProgress();
        const progressElements = document.querySelectorAll('.progress-fill');
        
        progressElements.forEach(el => {
            UIHelper.updateProgress(el.parentElement, progress);
        });
    }

    // Update action choices
    updateActionChoices() {
        // Determine which container to use based on current mode
        const containerId = this.mode === 'pda' ? 'pda_action_choices_container' : 'cfg_action_choices_container';
        const container = document.getElementById(containerId);
        if (!container) return;

        // Ensure helper mode matches controller mode
        this.helper.mode = this.mode;

        container.innerHTML = '';
        
        // Get current choices
        const choices = this.helper.getCurrentChoices();

        if (!choices || choices.length === 0) {
            // No more choices - simulation complete
            const completionEl = document.createElement('div');
            completionEl.className = 'completion-message';
            completionEl.innerHTML = `
                <h4>🎉 ${this.mode.toUpperCase()} simulation complete!</h4>
                <p>Switch modes or change language to continue exploring.</p>
            `;
            container.appendChild(completionEl);
            this.showFeedback('Simulation completed successfully!', 'success');
            return;
        }

        // Create choice buttons
        choices.forEach((choice, index) => {
            const choiceEl = document.createElement('div');
            choiceEl.className = 'choice-button';
            choiceEl.textContent = choice;
            choiceEl.setAttribute('data-choice-index', index);
            
            choiceEl.addEventListener('click', () => {
                this.selectChoice(index);
            });

            container.appendChild(choiceEl);
        });
    }

    // Handle choice selection
    selectChoice(choiceIndex) {
        if (this.isSimulationRunning) return;

        this.isSimulationRunning = true;

        // Clear previous selections
        document.querySelectorAll('.choice-button').forEach(btn => {
            btn.classList.remove('selected', 'correct', 'incorrect');
        });

        // Mark selected choice
        const selectedButton = document.querySelector(`[data-choice-index="${choiceIndex}"]`);
        if (selectedButton) {
            selectedButton.classList.add('selected');
            console.log('Button selected:', selectedButton, 'Choice index:', choiceIndex);
        }

        // Validate the choice
        const feedback = this.helper.validateAnswer(choiceIndex);
        console.log('Feedback:', feedback);
        
        setTimeout(() => {
            if (feedback.correct) {
                if (selectedButton) {
                    selectedButton.classList.add('correct');
                    console.log('Added correct class to button:', selectedButton.classList.toString());
                }
                this.showFeedback(feedback.message, 'success');
                
                // Check if we should switch modes
                this.checkModeSwitch();
                
                // Update display and choices
                setTimeout(() => {
                    this.updateDisplay();
                    this.updateActionChoices();
                    this.isSimulationRunning = false;
                }, 1000);
            } else {
                if (selectedButton) {
                    selectedButton.classList.add('incorrect');
                    console.log('Added incorrect class to button:', selectedButton.classList.toString());
                }
                this.showFeedback(feedback.message, 'error');
                
                // Re-enable choices after showing feedback
                setTimeout(() => {
                    document.querySelectorAll('.choice-button').forEach(btn => {
                        btn.classList.remove('selected', 'correct', 'incorrect');
                    });
                    this.isSimulationRunning = false;
                }, 2000);
            }
        }, 500);
    }

    // Check if we should switch modes automatically
    checkModeSwitch() {
        const currentStep = this.helper.getCurrentStep();
        
        // If current mode is complete and other mode has steps remaining
        if (!currentStep) {
            const otherMode = this.mode === 'pda' ? 'cfg' : 'pda';
            this.helper.mode = otherMode;
            
            const otherModeStep = this.helper.getCurrentStep();
            if (otherModeStep) {
                // Use the tab switching functionality with a slight delay
                setTimeout(() => {
                    this.switchTab(otherMode);
                }, 800);
            }
        }
    }

    // Show feedback message
    showFeedback(message, type = 'info') {
        // Determine which feedback area to use based on current mode
        const feedbackAreaId = this.mode === 'pda' ? 'pda_feedback_area' : 'cfg_feedback_area';
        const feedbackMessageId = this.mode === 'pda' ? 'pda_feedback_message' : 'cfg_feedback_message';
        
        const feedbackArea = document.getElementById(feedbackAreaId);
        const feedbackMessage = document.getElementById(feedbackMessageId);

        if (feedbackArea && feedbackMessage) {
            // Map feedback types to CSS classes
            const typeClass = type === 'success' ? 'correct' : type === 'error' ? 'incorrect' : type;
            
            feedbackArea.className = `feedback-area ${typeClass}`;
            feedbackMessage.className = `feedback-message ${typeClass}`;
            feedbackMessage.textContent = message;
            
            UIHelper.animateElement(feedbackArea, 'fade-in');
        }
    }

    showFeedbackWithHighlight(message, type = 'info', isHint = false) {
        // Determine which feedback area to use based on current mode
        const feedbackAreaId = this.mode === 'pda' ? 'pda_feedback_area' : 'cfg_feedback_area';
        const feedbackMessageId = this.mode === 'pda' ? 'pda_feedback_message' : 'cfg_feedback_message';
        
        const feedbackArea = document.getElementById(feedbackAreaId);
        const feedbackMessage = document.getElementById(feedbackMessageId);

        if (feedbackArea && feedbackMessage) {
            // Map feedback types to CSS classes
            const typeClass = type === 'success' ? 'correct' : type === 'error' ? 'incorrect' : type;
            
            // Remove any existing highlight class first
            feedbackArea.classList.remove('hint-highlight');
            
            feedbackArea.className = `feedback-area ${typeClass}`;
            feedbackMessage.className = `feedback-message ${typeClass}`;
            feedbackMessage.textContent = message;
            
            if (isHint) {
                // Add hint highlight class with a small delay to ensure the element is visible
                setTimeout(() => {
                    feedbackArea.classList.add('hint-highlight');
                    
                    // Scroll the feedback area into view smoothly
                    feedbackArea.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 100);
            } else {
                UIHelper.animateElement(feedbackArea, 'fade-in');
            }
        }
    }

    // Handle window resize
    handleResize() {
        if (this.pdaVisualizer) {
            this.pdaVisualizer.resize();
        }
        if (this.cfgVisualizer) {
            this.cfgVisualizer.resize();
        }
    }

    // Get simulation summary
    getSummary() {
        return this.helper.generateSummary();
    }

    // Export current state
    exportState() {
        return {
            progress: this.helper.exportProgress(),
            mode: this.mode,
            languageIndex: this.currentLanguageIndex,
            timestamp: new Date().toISOString()
        };
    }

    // Import state
    importState(stateData) {
        try {
            if (stateData.progress) {
                this.helper.importProgress(stateData.progress);
            }
            if (stateData.mode) {
                this.mode = stateData.mode;
            }
            if (stateData.languageIndex !== undefined) {
                this.currentLanguageIndex = stateData.languageIndex;
            }
            
            this.updateDisplay();
            this.updateActionChoices();
            
            return true;
        } catch (error) {
            console.error('Failed to import state:', error);
            return false;
        }
    }

    // Start auto-stepping for demonstration
    startAutoStep(intervalMs = 3000) {
        if (this.autoStepInterval) {
            clearInterval(this.autoStepInterval);
        }

        this.autoStepInterval = setInterval(() => {
            const currentStep = this.helper.getCurrentStep();
            if (currentStep && currentStep.correctAnswer >= 0) {
                this.selectChoice(currentStep.correctAnswer);
            } else {
                this.stopAutoStep();
            }
        }, intervalMs);
    }

    // Stop auto-stepping
    stopAutoStep() {
        if (this.autoStepInterval) {
            clearInterval(this.autoStepInterval);
            this.autoStepInterval = null;
        }
    }

    // Apply the correct choice for the current step (single auto step)
    toggleAutoStep() {
        const currentStep = this.helper.getCurrentStep();
        if (currentStep && currentStep.correctAnswer >= 0) {
            this.selectChoice(currentStep.correctAnswer);
            UIHelper.showToast('Applied correct choice', 'success');
        } else {
            UIHelper.showToast('No correct choice available', 'warning');
        }
    }

    // Check if both PDA and CFG simulations are complete
    isFullyComplete() {
        return this.helper.isLanguageCompleted();
    }

    // Generate completion report
    generateCompletionReport() {
        const summary = this.getSummary();
        const report = {
            ...summary,
            completionTime: new Date().toLocaleString(),
            totalInteractions: this.helper.userProgress.pda.completed.length + 
                             this.helper.userProgress.cfg.completed.length,
            equivalenceDemonstrated: summary.isComplete
        };

        return report;
    }

    // Switch between PDA and CFG tabs
    switchTab(targetMode) {
        if (targetMode === this.mode) return; // Already on this tab

        // Update the mode
        this.mode = targetMode;
        
        // Synchronize helper mode
        this.helper.mode = targetMode;

        // Update tab buttons
        const pdaTab = document.getElementById('pda_tab');
        const cfgTab = document.getElementById('cfg_tab');
        
        if (pdaTab && cfgTab) {
            if (targetMode === 'pda') {
                pdaTab.classList.add('active');
                cfgTab.classList.remove('active');
            } else {
                cfgTab.classList.add('active');
                pdaTab.classList.remove('active');
            }
        }

        // Update tab content active states
        const pdaContent = document.getElementById('pda_content');
        const cfgContent = document.getElementById('cfg_content');
        
        if (pdaContent && cfgContent) {
            if (targetMode === 'pda') {
                pdaContent.classList.add('active');
                cfgContent.classList.remove('active');
            } else {
                cfgContent.classList.add('active');
                pdaContent.classList.remove('active');
            }
        }

        // Update all displays
        this.updateDisplay();
        this.updateActionChoices();
        
        // Update remaining input for new mode
        const remainingInputEl = document.getElementById('remaining_input_display');
        if (remainingInputEl) {
            if (targetMode === 'pda') {
                const state = this.helper.getCurrentPDAState();
                if (state && state.input !== undefined) {
                    remainingInputEl.textContent = `"${state.input}"`;
                } else {
                    remainingInputEl.textContent = '""';
                }
            } else {
                const state = this.helper.getCurrentCFGState();
                if (state && state.targetString !== undefined) {
                    remainingInputEl.textContent = `"${state.targetString}"`;
                } else {
                    remainingInputEl.textContent = '""';
                }
            }
        }
        
        // Show feedback about tab switch
        UIHelper.showToast(`Switched to ${targetMode.toUpperCase()} mode`, 'info');
    }

    // Check if PDA simulation is complete and auto-switch to CFG
    checkForAutoTabSwitch() {
        if (this.mode === 'pda' && this.helper.isPDACompleted()) {
            // Small delay to let user see PDA completion
            setTimeout(() => {
                UIHelper.showToast('PDA simulation complete! Switching to CFG...', 'success');
                this.switchTab('cfg');
            }, 1500);
        }
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.InteractiveController = InteractiveController;
}
