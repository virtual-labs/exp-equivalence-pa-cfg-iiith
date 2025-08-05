// CFG Visualizer for PDA-CFG Equivalence Experiment
// Creates derivation trees and step-by-step grammar rule applications

class CFGVisualizer {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = d3.select(`#${containerId}`);
        this.svg = null;
        this.width = 0;
        this.height = 0;
        this.cfg = null;
        this.currentDerivation = [];
        this.derivationTree = null;
        this.margin = { top: 20, right: 20, bottom: 40, left: 20 };
        
        // Debug: Check if container exists
        if (this.container.empty()) {
            console.error(`CFG Visualizer: Container with ID '${containerId}' not found`);
        } else {
            console.log(`CFG Visualizer: Successfully found container '${containerId}'`);
        }
    }

    // Initialize the SVG container
    initialize() {
        console.log('CFG Visualizer: Initializing...');
        
        if (this.container.empty()) {
            console.error('CFG Visualizer: Container is empty, cannot initialize');
            return;
        }
        
        // Clear existing content
        this.container.selectAll("*").remove();

        // Get container dimensions
        const containerRect = this.container.node().getBoundingClientRect();
        this.width = Math.max(600, containerRect.width - this.margin.left - this.margin.right);
        this.height = Math.max(300, containerRect.height - this.margin.top - this.margin.bottom);

        console.log(`CFG Visualizer: Container dimensions - ${this.width}x${this.height}`);

        // Create SVG
        this.svg = this.container
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        console.log('CFG Visualizer: SVG created successfully');

        // Create main group
        this.mainGroup = this.svg
            .append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

        // Define markers for tree connections
        this.svg.append("defs")
            .append("marker")
            .attr("id", "tree-arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 5)
            .attr("refY", 0)
            .attr("markerWidth", 4)
            .attr("markerHeight", 4)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "#6b7280");
            
        console.log('CFG Visualizer: Initialization complete');
        
        // Render initial placeholder
        this.render();
    }

    // Set CFG data and initialize
    setCFG(cfgData) {
        this.cfg = cfgData;
        this.initializeDerivation();
        this.render();
    }

    // Initialize derivation with start symbol
    initializeDerivation() {
        this.currentDerivation = [this.cfg.startSymbol];
        this.derivationTree = {
            symbol: this.cfg.startSymbol,
            children: [],
            level: 0,
            id: 'root'
        };
    }

    // Apply a production rule
    applyProduction(leftSide, rightSide, position = 0) {
        // Find the leftmost occurrence of leftSide in current derivation
        const derivationString = this.currentDerivation.join('');
        const index = this.findNonTerminalPosition(leftSide, position);
        
        if (index === -1) return false;

        // Apply the production
        const newDerivation = [...this.currentDerivation];
        newDerivation.splice(index, 1, ...(rightSide === 'ε' ? [] : rightSide.split('')));
        this.currentDerivation = newDerivation;

        // Update derivation tree
        this.updateDerivationTree(leftSide, rightSide, position);
        
        return true;
    }

    // Find position of non-terminal for replacement
    findNonTerminalPosition(nonTerminal, occurrence = 0) {
        let count = 0;
        for (let i = 0; i < this.currentDerivation.length; i++) {
            if (this.cfg.nonTerminals.includes(this.currentDerivation[i]) && 
                this.currentDerivation[i] === nonTerminal) {
                if (count === occurrence) {
                    return i;
                }
                count++;
            }
        }
        return -1;
    }

    // Update derivation tree with new production
    updateDerivationTree(leftSide, rightSide, position) {
        // Find the node to expand
        const nodeToExpand = this.findTreeNode(this.derivationTree, leftSide, position);
        if (!nodeToExpand) return;

        // Add children for the production
        if (rightSide === 'ε') {
            nodeToExpand.children = [{
                symbol: 'ε',
                children: [],
                level: nodeToExpand.level + 1,
                id: `${nodeToExpand.id}_epsilon`,
                isTerminal: true
            }];
        } else {
            nodeToExpand.children = rightSide.split('').map((symbol, index) => ({
                symbol: symbol,
                children: [],
                level: nodeToExpand.level + 1,
                id: `${nodeToExpand.id}_${index}`,
                isTerminal: this.cfg.terminals.includes(symbol)
            }));
        }
    }

    // Find tree node for expansion
    findTreeNode(node, symbol, occurrence, currentOccurrence = { count: 0 }) {
        if (node.symbol === symbol && 
            this.cfg.nonTerminals.includes(node.symbol) && 
            node.children.length === 0) {
            if (currentOccurrence.count === occurrence) {
                return node;
            }
            currentOccurrence.count++;
        }

        for (let child of node.children) {
            const found = this.findTreeNode(child, symbol, occurrence, currentOccurrence);
            if (found) return found;
        }

        return null;
    }

    // Main rendering function
    render() {
        console.log('CFG Visualizer: Rendering...');
        
        if (!this.mainGroup) {
            console.error('CFG Visualizer: Main group not initialized');
            return;
        }
        
        // Clear previous content from visualization container
        this.mainGroup.selectAll("*").remove();

        if (!this.cfg) {
            // Show placeholder when no CFG is loaded
            this.renderPlaceholder();
            return;
        }

        // Render to separate containers:
        // 1. Parse tree in #cfg_visualization (current container)
        // 2. Grammar rules in .production-rules-display
        // 3. Current/target strings in .current-derivation-info
        this.renderDerivationTree();
        this.renderProductionRulesToHTML();
        this.renderStringComparisonToHTML();
    }

    // Render placeholder when no CFG is loaded
    renderPlaceholder() {
        const placeholderGroup = this.mainGroup.append("g")
            .attr("class", "cfg-placeholder")
            .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);

        placeholderGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("font-size", "16px")
            .attr("font-weight", "500")
            .attr("fill", "#6b7280")
            .text("CFG Visualization");

        placeholderGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("y", 25)
            .attr("font-size", "14px")
            .attr("fill", "#9ca3af")
            .text("Select a language to begin");
    }

    // Render current derivation string
    renderCurrentDerivation() {
        const derivationGroup = this.mainGroup.append("g")
            .attr("class", "current-derivation")
            .attr("transform", "translate(10, 30)");

        // Title
        derivationGroup.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "#374151")
            .text("Current Derivation:");

        // Derivation string - handle both array and string input
        let derivationString;
        if (Array.isArray(this.currentDerivation)) {
            derivationString = this.currentDerivation.length === 0 ? 'ε' : this.currentDerivation.join('');
        } else {
            derivationString = this.currentDerivation || this.cfg.startSymbol;
        }
        
        console.log('Rendering derivation string:', derivationString);

        derivationGroup.append("text")
            .attr("x", 140)
            .attr("y", 0)
            .attr("font-size", "18px")
            .attr("font-weight", "bold")
            .attr("font-family", "Courier New, monospace")
            .attr("fill", "#7c3aed")
            .text(derivationString);

        // Highlight non-terminals in the derivation string
        let xOffset = 140;
        const symbols = Array.isArray(this.currentDerivation) ? 
            this.currentDerivation : 
            derivationString.split('');
            
        symbols.forEach((symbol, index) => {
            const isNonTerminal = this.cfg && this.cfg.nonTerminals && this.cfg.nonTerminals.includes(symbol);
            if (isNonTerminal) {
                // Add highlight background for non-terminals
                derivationGroup.append("rect")
                    .attr("x", xOffset - 2)
                    .attr("y", -14)
                    .attr("width", 16)
                    .attr("height", 20)
                    .attr("fill", "#ddd6fe")
                    .attr("stroke", "#7c3aed")
                    .attr("stroke-width", 1)
                    .attr("rx", 3)
                    .attr("opacity", 0.7);
            }
            
            const charWidth = 12; // Approximate character width for monospace
            xOffset += charWidth;
        });
    }

    // Render string comparison (bottom section)
    renderStringComparison() {
        const stringGroup = this.mainGroup.append("g")
            .attr("class", "string-comparison")
            .attr("transform", "translate(20, 220)"); // Positioned at bottom

        // Get current derivation string
        let currentString;
        if (Array.isArray(this.currentDerivation)) {
            currentString = this.currentDerivation.length === 0 ? this.cfg.startSymbol : this.currentDerivation.join('');
        } else {
            currentString = this.currentDerivation || this.cfg.startSymbol;
        }

        // Get target string from helper if available
        let targetString = "aaabbb"; // Default fallback
        if (window.interactiveController && window.interactiveController.helper) {
            const cfgState = window.interactiveController.helper.getCurrentCFGState();
            if (cfgState && cfgState.targetString) {
                targetString = cfgState.targetString;
            }
        }

        // Current String
        const currentGroup = stringGroup.append("g").attr("class", "current-string-display");
        
        currentGroup.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "#374151")
            .text("Current String:");

        // Background for current string
        const currentStringBg = currentGroup.append("rect")
            .attr("x", 120)
            .attr("y", -16)
            .attr("height", 22)
            .attr("fill", "#e0e7ff")
            .attr("stroke", "#7c3aed")
            .attr("stroke-width", 2)
            .attr("rx", 6);

        const currentStringText = currentGroup.append("text")
            .attr("x", 126)
            .attr("y", 0)
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("font-family", "Courier New, monospace")
            .attr("fill", "#5b21b6")
            .text(currentString);

        // Adjust background width to fit text
        const currentBbox = currentStringText.node().getBBox();
        currentStringBg.attr("width", currentBbox.width + 12);

        // Target String
        const targetGroup = stringGroup.append("g").attr("class", "target-string-display");
        
        targetGroup.append("text")
            .attr("x", 0)
            .attr("y", 35)
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "#374151")
            .text("Target String:");

        // Background for target string
        const targetStringBg = targetGroup.append("rect")
            .attr("x", 120)
            .attr("y", 19)
            .attr("height", 22)
            .attr("fill", "#dcfce7")
            .attr("stroke", "#10b981")
            .attr("stroke-width", 2)
            .attr("rx", 6);

        const targetStringText = targetGroup.append("text")
            .attr("x", 126)
            .attr("y", 35)
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("font-family", "Courier New, monospace")
            .attr("fill", "#065f46")
            .text(`"${targetString}"`);

        // Adjust background width to fit text
        const targetBbox = targetStringText.node().getBBox();
        targetStringBg.attr("width", targetBbox.width + 12);

        // Status indicator
        const isComplete = currentString === targetString;
        const statusGroup = stringGroup.append("g").attr("class", "status-indicator");
        
        if (isComplete) {
            statusGroup.append("text")
                .attr("x", 350)
                .attr("y", 17)
                .attr("font-size", "14px")
                .attr("font-weight", "bold")
                .attr("fill", "#10b981")
                .text("✓ Match!");
        } else {
            statusGroup.append("text")
                .attr("x", 350)
                .attr("y", 17)
                .attr("font-size", "14px")
                .attr("font-weight", "bold")
                .attr("fill", "#f59e0b")
                .text("→ Deriving...");
        }
    }

    // Render production rules to HTML container
    renderProductionRulesToHTML() {
        const rulesContainer = document.getElementById('cfg_production_rules');
        if (!rulesContainer) {
            console.warn('CFG Production rules container not found');
            return;
        }

        // Clear existing content
        rulesContainer.innerHTML = '';

        // Create production rules HTML
        this.cfg.productions.forEach((production, index) => {
            const ruleDiv = document.createElement('div');
            ruleDiv.className = `production-rule rule-${production.id || index}`;
            ruleDiv.innerHTML = `
                <span class="rule-text">${production.left} → ${production.right}</span>
            `;
            rulesContainer.appendChild(ruleDiv);
        });
    }

    // Render string comparison to HTML container
    renderStringComparisonToHTML() {
        // Update current string
        const currentStringEl = document.getElementById('cfg_current_string');
        if (currentStringEl) {
            let currentString;
            if (Array.isArray(this.currentDerivation)) {
                currentString = this.currentDerivation.length === 0 ? this.cfg.startSymbol : this.currentDerivation.join('');
            } else {
                currentString = this.currentDerivation || this.cfg.startSymbol;
            }
            currentStringEl.textContent = currentString;
        }

        // Update target string
        const targetStringEl = document.getElementById('cfg_target_string');
        if (targetStringEl) {
            let targetString = "aaabbb"; // Default fallback
            if (window.interactiveController && window.interactiveController.helper) {
                const cfgState = window.interactiveController.helper.getCurrentCFGState();
                if (cfgState && cfgState.targetString) {
                    targetString = cfgState.targetString;
                }
            }
            targetStringEl.textContent = `"${targetString}"`;
        }
    }

    // Render derivation tree (in visualization container only)
    renderDerivationTree() {
        const treeGroup = this.mainGroup.append("g")
            .attr("class", "derivation-tree")
            .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`); // Centered in container

        // Get current derivation string
        let derivationString;
        if (Array.isArray(this.currentDerivation)) {
            derivationString = this.currentDerivation.length === 0 ? this.cfg.startSymbol : this.currentDerivation.join('');
        } else {
            derivationString = this.currentDerivation || this.cfg.startSymbol;
        }

        // Simple tree visualization based on current derivation
        this.renderSimpleTree(treeGroup, derivationString);
    }

    // Render a simple tree representation (centered in container)
    renderSimpleTree(container, derivationString) {
        // If just the start symbol, show single node
        if (derivationString === this.cfg.startSymbol) {
            const node = container.append("g").attr("class", "tree-node");
            
            node.append("circle")
                .attr("r", 25)
                .attr("fill", "#ddd6fe")
                .attr("stroke", "#7c3aed")
                .attr("stroke-width", 3);

            node.append("text")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr("font-size", "18px")
                .attr("font-weight", "bold")
                .attr("fill", "#5b21b6")
                .text(this.cfg.startSymbol);
            return;
        }

        // For more complex derivations, show a basic tree structure
        const symbols = derivationString.split('');
        const nodeSpacing = 60;
        const totalWidth = symbols.length * nodeSpacing;
        const startX = -totalWidth / 2;

        // Root node (centered)
        const rootNode = container.append("g")
            .attr("class", "tree-node root");

        rootNode.append("circle")
            .attr("r", 25)
            .attr("fill", "#f3f4f6")
            .attr("stroke", "#6b7280")
            .attr("stroke-width", 3);

        rootNode.append("text")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("font-size", "18px")
            .attr("font-weight", "bold")
            .attr("fill", "#374151")
            .text(this.cfg.startSymbol);

        // Child nodes for current derivation
        symbols.forEach((symbol, index) => {
            const x = startX + (index * nodeSpacing);
            const y = 80;

            // Connection line
            container.append("line")
                .attr("x1", 0)
                .attr("y1", 25)
                .attr("x2", x)
                .attr("y2", y - 22)
                .attr("stroke", "#6b7280")
                .attr("stroke-width", 3);

            // Child node
            const childNode = container.append("g")
                .attr("class", "tree-node child")
                .attr("transform", `translate(${x}, ${y})`);

            const isTerminal = this.cfg.terminals && this.cfg.terminals.includes(symbol);
            const isNonTerminal = this.cfg.nonTerminals && this.cfg.nonTerminals.includes(symbol);

            childNode.append("circle")
                .attr("r", 22)
                .attr("fill", isTerminal ? "#dcfce7" : (isNonTerminal ? "#ddd6fe" : "#f9fafb"))
                .attr("stroke", isTerminal ? "#10b981" : (isNonTerminal ? "#7c3aed" : "#6b7280"))
                .attr("stroke-width", 3);

            childNode.append("text")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr("font-size", "16px")
                .attr("font-weight", "bold")
                .attr("fill", isTerminal ? "#065f46" : (isNonTerminal ? "#5b21b6" : "#374151"))
                .text(symbol);
        });
    }

    // Calculate tree layout positions
    calculateTreeLayout(root) {
        const nodeWidth = 40;
        const levelHeight = 50;
        
        // Calculate positions using a simple tree layout
        const positions = new Map();
        const levels = [];
        
        // Traverse tree to organize by levels
        const traverse = (node, level) => {
            if (!levels[level]) levels[level] = [];
            levels[level].push(node);
            
            node.children.forEach(child => traverse(child, level + 1));
        };
        
        traverse(root, 0);
        
        // Position nodes
        levels.forEach((levelNodes, level) => {
            const levelWidth = levelNodes.length * nodeWidth;
            const startX = (this.width - levelWidth) / 2;
            
            levelNodes.forEach((node, index) => {
                positions.set(node.id, {
                    x: startX + (index * nodeWidth) + nodeWidth / 2,
                    y: 180 + (level * levelHeight),
                    node: node
                });
            });
        });
        
        return positions;
    }

    // Render the derivation tree
    renderTree(positions) {
        const treeGroup = this.mainGroup.append("g").attr("class", "derivation-tree");
        
        // Render edges first
        positions.forEach(pos => {
            pos.node.children.forEach(child => {
                const childPos = positions.get(child.id);
                if (childPos) {
                    treeGroup.append("line")
                        .attr("x1", pos.x)
                        .attr("y1", pos.y + 15)
                        .attr("x2", childPos.x)
                        .attr("y2", childPos.y - 15)
                        .attr("stroke", "#6b7280")
                        .attr("stroke-width", 2);
                }
            });
        });
        
        // Render nodes
        positions.forEach(pos => {
            const nodeGroup = treeGroup.append("g")
                .attr("transform", `translate(${pos.x}, ${pos.y})`)
                .attr("class", "cfg-node");
            
            // Node circle
            nodeGroup.append("circle")
                .attr("r", 15)
                .attr("fill", pos.node.isTerminal ? "#dcfce7" : "#ddd6fe")
                .attr("stroke", pos.node.isTerminal ? "#10b981" : "#7c3aed")
                .attr("stroke-width", 2);
            
            // Node label
            nodeGroup.append("text")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr("font-size", "12px")
                .attr("font-weight", "bold")
                .attr("fill", pos.node.isTerminal ? "#065f46" : "#5b21b6")
                .text(pos.node.symbol);
        });
    }

    // Highlight a production rule
    highlightRule(ruleId) {
        // Clear previous highlights
        const rulesContainer = document.getElementById('cfg_production_rules');
        if (rulesContainer) {
            const allRules = rulesContainer.querySelectorAll('.production-rule');
            allRules.forEach(rule => {
                rule.classList.remove('highlighted');
            });
            
            // Highlight the specific rule
            const targetRule = rulesContainer.querySelector(`.rule-${ruleId}`);
            if (targetRule) {
                targetRule.classList.add('highlighted');
            }
        }
    }

    // Clear rule highlighting
    clearRuleHighlight() {
        const rulesContainer = document.getElementById('cfg_production_rules');
        if (rulesContainer) {
            const allRules = rulesContainer.querySelectorAll('.production-rule');
            allRules.forEach(rule => {
                rule.classList.remove('highlighted');
            });
        }
    }

    // Update with new derivation state
    updateDerivation(derivationArray) {
        console.log('CFG Visualizer: Updating derivation to:', derivationArray);
        this.currentDerivation = derivationArray;
        
        // If this is a single symbol (start state), reinitialize
        if (derivationArray.length === 1 && derivationArray[0] === this.cfg.startSymbol) {
            this.initializeDerivation();
        }
        
        this.render();
    }

    // Apply production step by step (for interactive mode)
    applyProductionStep(leftSide, rightSide) {
        console.log(`Applying production: ${leftSide} → ${rightSide}`);
        return this.applyProduction(leftSide, rightSide);
    }

    // Reset to initial state
    reset() {
        this.initializeDerivation();
        this.render();
    }

    // Get current derivation as string
    getCurrentDerivationString() {
        return this.currentDerivation.length === 0 ? 'ε' : this.currentDerivation.join('');
    }

    // Check if derivation is complete (no more non-terminals)
    isDerivationComplete() {
        return this.currentDerivation.every(symbol => 
            this.cfg.terminals.includes(symbol) || symbol === 'ε'
        );
    }

    // Get available productions for current derivation
    getAvailableProductions() {
        const availableProductions = [];
        
        // Find all non-terminals in current derivation
        const nonTerminals = this.currentDerivation.filter(symbol => 
            this.cfg.nonTerminals.includes(symbol)
        );
        
        // Get unique non-terminals
        const uniqueNonTerminals = [...new Set(nonTerminals)];
        
        // Find applicable productions
        uniqueNonTerminals.forEach(nonTerminal => {
            const productions = this.cfg.productions.filter(p => p.left === nonTerminal);
            availableProductions.push(...productions);
        });
        
        return availableProductions;
    }

    // Animate production application
    animateProduction(leftSide, rightSide, callback) {
        // Highlight the rule being applied
        const production = this.cfg.productions.find(p => 
            p.left === leftSide && p.right === rightSide
        );
        
        if (production) {
            this.highlightRule(production.id);
            
            setTimeout(() => {
                this.applyProduction(leftSide, rightSide);
                this.render();
                this.clearRuleHighlight();
                if (callback) callback();
            }, 1000);
        }
    }

    // Export derivation history
    getDerivationHistory() {
        return {
            steps: this.derivationSteps || [],
            current: this.getCurrentDerivationString(),
            tree: this.derivationTree
        };
    }

    // Resize the visualization
    resize() {
        const containerRect = this.container.node().getBoundingClientRect();
        const newWidth = Math.max(600, containerRect.width - this.margin.left - this.margin.right);
        const newHeight = Math.max(300, containerRect.height - this.margin.top - this.margin.bottom);

        if (newWidth !== this.width || newHeight !== this.height) {
            this.width = newWidth;
            this.height = newHeight;
            this.render();
        }
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.CFGVisualizer = CFGVisualizer;
}
