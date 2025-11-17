// PDA Visualizer for PDA-CFG Equivalence Experiment
// Uses D3.js to create interactive PDA diagrams

class PDAVisualizer {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = d3.select(`#${containerId} .pda-diagram-area`);
        // Fallback to the main container if pda-diagram-area doesn't exist
        if (this.container.empty()) {
            this.container = d3.select(`#${containerId}`);
        }
        this.svg = null;
        this.width = 0;
        this.height = 0;
        this.pda = null;
        this.currentState = null;
        this.currentTransition = null;
        this.margin = { top: 20, right: 20, bottom: 60, left: 20 };
    }

    // Initialize the SVG container
    initialize() {
        // Clear existing content
        this.container.selectAll("*").remove();

        // Get container dimensions
        const containerRect = this.container.node().getBoundingClientRect();
        this.width = Math.max(600, containerRect.width - this.margin.left - this.margin.right);
        this.height = Math.max(300, containerRect.height - this.margin.top - this.margin.bottom);

        // Create SVG
        this.svg = this.container
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        // Create main group
        this.mainGroup = this.svg
            .append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

        // Define arrow markers
        this.svg.append("defs")
            .append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "#6b7280");

        // Define highlighted arrow marker
        this.svg.select("defs")
            .append("marker")
            .attr("id", "arrowhead-active")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "#7c3aed");

        // Add enhanced glow filter for active states
        const defs = this.svg.select("defs");
        
        // Current state glow filter
        const currentStateGlow = defs.append("filter")
            .attr("id", "currentStateGlow")
            .attr("x", "-50%")
            .attr("y", "-50%")
            .attr("width", "200%")
            .attr("height", "200%");
        
        currentStateGlow.append("feGaussianBlur")
            .attr("stdDeviation", "4")
            .attr("result", "coloredBlur");
        
        const currentStateMerge = currentStateGlow.append("feMerge");
        currentStateMerge.append("feMergeNode").attr("in", "coloredBlur");
        currentStateMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // Transition glow filter
        const transitionGlow = defs.append("filter")
            .attr("id", "transitionGlow")
            .attr("x", "-50%")
            .attr("y", "-50%")
            .attr("width", "200%")
            .attr("height", "200%");
        
        transitionGlow.append("feGaussianBlur")
            .attr("stdDeviation", "3")
            .attr("result", "coloredBlur");
        
        const transitionMerge = transitionGlow.append("feMerge");
        transitionMerge.append("feMergeNode").attr("in", "coloredBlur");
        transitionMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // Initialize current state and stack
        this.currentState = null;
        this.currentTransition = null;
        this.currentStack = [];
        this.remainingInput = "";
    }

    // Set PDA data and render
    setPDA(pdaData) {
        this.pda = pdaData;
        this.currentState = pdaData.startState;
        this.render();
    }

    // Update current state and transition with enhanced visual feedback
    updateState(stateName, transitionLabel = null, stackContents = [], remainingInput = "") {
        console.log('PDA updateState called with:', {
            stateName,
            transitionLabel,
            stackContents,
            remainingInput
        });
        
        this.currentState = stateName;
        this.currentTransition = transitionLabel;
        this.currentStack = stackContents || [];
        this.remainingInput = remainingInput || "";
        
        console.log(`PDA Visualizer: Updating to state ${stateName}, transition: ${transitionLabel}`);
        console.log(`Stack: [${this.currentStack.join(', ')}], Remaining: "${this.remainingInput}"`);
        
        this.updateVisualization();
        this.updateStackVisualization();
        this.updateInputVisualization();
    }

    // Main rendering function
    render() {
        if (!this.pda) return;

        // Clear previous content
        this.mainGroup.selectAll("*").remove();

        // Adjust state positions to fit container
        this.adjustStatePositions();

        // Render transitions first (so they appear behind states)
        this.renderTransitions();

        // Render states
        this.renderStates();

        // Add start state indicator
        this.addStartIndicator();

        // Add legend
        this.addLegend();
    }

    // Adjust state positions to fit the container
    adjustStatePositions() {
        if (!this.pda || !this.pda.states) return;

        const states = this.pda.states;
        const padding = 80;
        const availableWidth = this.width - 2 * padding;
        const availableHeight = this.height - 2 * padding;

        // Scale positions proportionally
        const minX = Math.min(...states.map(s => s.x));
        const maxX = Math.max(...states.map(s => s.x));
        const minY = Math.min(...states.map(s => s.y));
        const maxY = Math.max(...states.map(s => s.y));

        const scaleX = availableWidth / (maxX - minX || 1);
        const scaleY = availableHeight / (maxY - minY || 1);
        const scale = Math.min(scaleX, scaleY);

        states.forEach(state => {
            state.scaledX = padding + (state.x - minX) * scale;
            state.scaledY = padding + (state.y - minY) * scale;
        });
    }

    // Render PDA states
    renderStates() {
        const stateGroup = this.mainGroup.append("g").attr("class", "states");

        const states = stateGroup
            .selectAll(".pda-state")
            .data(this.pda.states)
            .enter()
            .append("g")
            .attr("class", "pda-state")
            .attr("transform", d => `translate(${d.scaledX},${d.scaledY})`);

        // State circles - apply initial styling
        states.append("circle")
            .attr("r", 25)
            .attr("class", d => {
                let classes = "state-circle";
                if (d.isStart) classes += " start";
                if (d.isAccept) classes += " accept";
                if (d.id === this.currentState) classes += " current";
                return classes;
            })
            .style("fill", d => {
                if (d.id === this.currentState) return "#7c3aed";
                if (d.isAccept) return "#f0fdf4";
                if (d.isStart) return "#faf5ff";
                return "#f9fafb";
            })
            .style("stroke", d => {
                if (d.id === this.currentState) return "#5b21b6";
                if (d.isStart) return "#7c3aed";
                if (d.isAccept) return "#10b981";
                return "#6b7280";
            })
            .style("stroke-width", d => {
                if (d.id === this.currentState) return "4px";
                return d.isStart || d.isAccept ? "3px" : "2px";
            })
            .style("filter", d => {
                if (d.id === this.currentState) return "drop-shadow(0 0 12px rgba(124, 58, 237, 0.6)) drop-shadow(0 0 20px rgba(124, 58, 237, 0.4))";
                if (d.isStart) return "drop-shadow(0 0 8px rgba(124, 58, 237, 0.3))";
                if (d.isAccept) return "drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))";
                return "none";
            })
            .style("animation", d => {
                if (d.id === this.currentState) return "currentStatePulse 2s infinite ease-in-out";
                return "none";
            });

        // Accept state double circle
        states
            .filter(d => d.isAccept)
            .append("circle")
            .attr("r", 20)
            .attr("fill", "none")
            .attr("stroke", d => {
                if (d.id === this.currentState) return "#5b21b6";
                return "#10b981";
            })
            .attr("stroke-width", d => d.id === this.currentState ? 3 : 2)
            .attr("class", d => {
                let classes = "accept-inner-circle";
                if (d.id === this.currentState) classes += " current";
                return classes;
            });

        // State labels with proper current state styling
        states.append("text")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("font-size", "14px")
            .attr("font-weight", d => d.id === this.currentState ? "bold" : "500")
            .attr("fill", d => d.id === this.currentState ? "white" : "#374151")
            .attr("class", d => d.id === this.currentState ? "current" : "")
            .text(d => d.label);

        // Add tooltips
        states.append("title")
            .text(d => {
                let tooltip = `State: ${d.label}`;
                if (d.isStart) tooltip += " (Start)";
                if (d.isAccept) tooltip += " (Accept)";
                if (d.id === this.currentState) tooltip += " (Current)";
                return tooltip;
            });
    }

    // Render PDA transitions
    renderTransitions() {
        const transitionGroup = this.mainGroup.append("g").attr("class", "transitions");

        // Group transitions by state pairs
        const transitionGroups = new Map();
        
        this.pda.transitions.forEach((transition, index) => {
            const fromState = this.pda.states.find(s => s.id === transition.from);
            const toState = this.pda.states.find(s => s.id === transition.to);

            if (!fromState || !toState) return;

            // Create unique key for state pair (order matters for direction)
            const key = `${fromState.id}-${toState.id}`;
            
            if (!transitionGroups.has(key)) {
                transitionGroups.set(key, {
                    fromState,
                    toState,
                    transitions: [],
                    reverseExists: false
                });
            }
            
            transitionGroups.get(key).transitions.push(transition);
        });

        // Check for bidirectional transitions
        transitionGroups.forEach((group, key) => {
            const reverseKey = `${group.toState.id}-${group.fromState.id}`;
            if (transitionGroups.has(reverseKey)) {
                group.reverseExists = true;
            }
        });

        // Render each group of transitions
        transitionGroups.forEach((group, key) => {
            const { fromState, toState, transitions, reverseExists } = group;
            
            if (fromState.id === toState.id) {
                // Self-loop - group all self-loop transitions together
                const transGroup = transitionGroup.append("g")
                    .attr("class", `pda-transition self-loop`)
                    .attr("data-transitions", transitions.map(t => t.label).join(','));
                this.renderSelfLoop(transGroup, fromState, transitions);
            } else if (transitions.length === 1 && !reverseExists) {
                // Single straight arrow
                const transGroup = transitionGroup.append("g")
                    .attr("class", `pda-transition straight`)
                    .attr("data-transition", transitions[0].label);
                this.renderStraightTransition(transGroup, fromState, toState, transitions[0]);
            } else if (reverseExists) {
                // Bidirectional - use curved arrows
                transitions.forEach((transition, index) => {
                    const transGroup = transitionGroup.append("g")
                        .attr("class", `pda-transition curved`)
                        .attr("data-transition", transition.label);
                    this.renderCurvedTransition(transGroup, fromState, toState, transition, index);
                });
            } else {
                // Multiple transitions in same direction - straight arrow with stacked labels
                const transGroup = transitionGroup.append("g")
                    .attr("class", `pda-transition stacked`)
                    .attr("data-transitions", transitions.map(t => t.label).join(','));
                this.renderStackedTransitions(transGroup, fromState, toState, transitions);
            }
        });
    }

    // Render self-loop transition
    // Render self-loop transition(s) with proper label stacking
    renderSelfLoop(group, state, transitions) {
        const x = state.scaledX;
        const y = state.scaledY;
        const stateRadius = 25;
        const loopHeight = 35; // Increased height for more curvature
        const loopWidth = 30;  // Increased width for more elegance
        
        // Create a beautiful curved self-loop that goes above the state
        // Start point: top-left of the state circle
        const startAngle = -Math.PI / 2 - 0.4;
        const startX = x + stateRadius * Math.cos(startAngle);
        const startY = y + stateRadius * Math.sin(startAngle);
        
        // Control points for a more curved, elegant bezier path
        const cp1X = x - loopWidth;
        const cp1Y = y - stateRadius - loopHeight;
        const cp2X = x + loopWidth;
        const cp2Y = y - stateRadius - loopHeight;
        
        // End point: top-right of the state circle
        const endAngle = -Math.PI / 2 + 0.4;
        const endX = x + stateRadius * Math.cos(endAngle);
        const endY = y + stateRadius * Math.sin(endAngle);

        // Check if any transition is currently active
        const hasActiveTransition = transitions.some(t => this.currentTransition === t.label);

        // Create the smooth curved path using cubic bezier with more curvature
        const pathData = `M ${startX} ${startY} 
                         C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

        // Draw the self-loop path with enhanced curvature
        group.append("path")
            .attr("d", pathData)
            .attr("fill", "none")
            .attr("stroke", hasActiveTransition ? "#7c3aed" : "#6b7280")
            .attr("stroke-width", hasActiveTransition ? 3 : 2)
            .attr("stroke-linecap", "round") // Rounded line caps for smoother appearance
            .attr("marker-end", `url(#${hasActiveTransition ? 'arrowhead-active' : 'arrowhead'})`);

        // Smart layout based on number of transitions
        const numTransitions = transitions.length;
        let labelLayout;

        if (numTransitions <= 2) {
            // For 1-2 transitions: simple vertical stacking
            labelLayout = this.createVerticalLayout(x, y, stateRadius, loopHeight, transitions);
        } else if (numTransitions <= 4) {
            // For 3-4 transitions: compact vertical with smaller spacing
            labelLayout = this.createCompactVerticalLayout(x, y, stateRadius, loopHeight, transitions);
        } else {
            // For 5+ transitions: two-column layout
            labelLayout = this.createTwoColumnLayout(x, y, stateRadius, loopHeight, transitions);
        }

        // Add background rectangle
        group.append("rect")
            .attr("x", labelLayout.rectX)
            .attr("y", labelLayout.rectY)
            .attr("width", labelLayout.rectWidth)
            .attr("height", labelLayout.rectHeight)
            .attr("fill", "white")
            .attr("stroke", "#e5e7eb")
            .attr("stroke-width", 1)
            .attr("rx", 3)
            .attr("opacity", 0.95);

        // Add each label
        labelLayout.labels.forEach(labelInfo => {
            group.append("text")
                .attr("x", labelInfo.x)
                .attr("y", labelInfo.y)
                .attr("text-anchor", "middle")
                .attr("font-size", labelInfo.fontSize)
                .attr("font-family", "Courier New, monospace")
                .attr("fill", this.currentTransition === labelInfo.transition.label ? "#7c3aed" : "#374151")
                .attr("font-weight", this.currentTransition === labelInfo.transition.label ? "bold" : "500")
                .text(labelInfo.transition.label);
        });

        // Add vertical separators between columns for rows that have both left and right labels
        if (labelLayout.separators) {
            labelLayout.separators.forEach(separatorInfo => {
                group.append("text")
                    .attr("x", separatorInfo.x)
                    .attr("y", separatorInfo.y)
                    .attr("text-anchor", "middle")
                    .attr("font-size", separatorInfo.fontSize)
                    .attr("font-family", "Courier New, monospace")
                    .attr("fill", "#9ca3af")
                    .attr("font-weight", "normal")
                    .text("|");
            });
        }
    }

    // Create vertical layout for 1-2 transitions
    createVerticalLayout(x, y, stateRadius, loopHeight, transitions) {
        const labelX = x;
        const labelBaseY = y - stateRadius - loopHeight - 10;
        const labelHeight = 14;
        const totalHeight = transitions.length * labelHeight;
        const startOffset = -(totalHeight / 2) + (labelHeight / 2);
        const maxTextWidth = Math.max(...transitions.map(t => t.label.length)) * 6;

        return {
            rectX: labelX - maxTextWidth / 2 - 3,
            rectY: labelBaseY + startOffset - labelHeight / 2,
            rectWidth: maxTextWidth + 6,
            rectHeight: totalHeight,
            labels: transitions.map((transition, index) => ({
                x: labelX,
                y: labelBaseY + startOffset + (index * labelHeight) + 3,
                fontSize: "9px",
                transition
            }))
        };
    }

    // Create compact vertical layout for 3-4 transitions
    createCompactVerticalLayout(x, y, stateRadius, loopHeight, transitions) {
        const labelX = x;
        const labelBaseY = y - stateRadius - loopHeight - 8;
        const labelHeight = 13; // Increased from 12 to 13 for consistency
        const totalHeight = transitions.length * labelHeight + 2; // Added small padding
        const startOffset = -(totalHeight / 2) + (labelHeight / 2) + 1; // Adjusted offset
        const maxTextWidth = Math.max(...transitions.map(t => t.label.length)) * 5.2; // Better width calculation

        return {
            rectX: labelX - maxTextWidth / 2 - 4, // Increased padding from 2 to 4
            rectY: labelBaseY + startOffset - labelHeight / 2 - 1, // Added top padding
            rectWidth: maxTextWidth + 8, // Increased padding from 4 to 8
            rectHeight: totalHeight,
            labels: transitions.map((transition, index) => ({
                x: labelX,
                y: labelBaseY + startOffset + (index * labelHeight) + 3, // Better vertical centering
                fontSize: "8px",
                transition
            }))
        };
    }

    // Create two-column layout for 5+ transitions
    createTwoColumnLayout(x, y, stateRadius, loopHeight, transitions) {
        const baseY = y - stateRadius - loopHeight - 8;
        const labelHeight = 13; // Increased from 11 to 13 for better spacing
        const columnSpacing = 70; // Increased from 60 to 70 for better separation between columns
        const leftX = x - columnSpacing / 2;
        const rightX = x + columnSpacing / 2;
        
        const leftTransitions = transitions.filter((_, index) => index % 2 === 0);
        const rightTransitions = transitions.filter((_, index) => index % 2 === 1);
        
        const maxRows = Math.max(leftTransitions.length, rightTransitions.length);
        const totalHeight = maxRows * labelHeight + 4; // Added padding to height
        const startOffset = -(totalHeight / 2) + (labelHeight / 2) + 2; // Adjusted offset
        
        // Calculate more accurate text width based on actual content
        const maxLeftWidth = leftTransitions.length > 0 ? Math.max(...leftTransitions.map(t => t.label.length)) * 4.8 : 0;
        const maxRightWidth = rightTransitions.length > 0 ? Math.max(...rightTransitions.map(t => t.label.length)) * 4.8 : 0;
        const totalWidth = Math.max(maxLeftWidth, maxRightWidth) * 2 + columnSpacing * 0.6; // Better width calculation

        const labels = [];
        const separators = [];
        
        // Left column
        leftTransitions.forEach((transition, index) => {
            labels.push({
                x: leftX,
                y: baseY + startOffset + (index * labelHeight) + 3, // Better vertical centering
                fontSize: "8px",
                transition
            });
        });
        
        // Right column
        rightTransitions.forEach((transition, index) => {
            labels.push({
                x: rightX,
                y: baseY + startOffset + (index * labelHeight) + 3, // Better vertical centering
                fontSize: "8px",
                transition
            });
        });

        // Add separators for rows that have both left and right labels
        const minRows = Math.min(leftTransitions.length, rightTransitions.length);
        for (let i = 0; i < minRows; i++) {
            separators.push({
                x: x, // Center between the two columns
                y: baseY + startOffset + (i * labelHeight) + 3,
                fontSize: "8px"
            });
        }

        return {
            rectX: x - totalWidth / 2 - 4, // Increased padding from 2 to 4
            rectY: baseY + startOffset - labelHeight / 2 - 2, // Added top padding
            rectWidth: totalWidth + 8, // Increased padding from 4 to 8
            rectHeight: totalHeight,
            labels,
            separators
        };
    }

    // Render straight transition (single arrow, no curves)
    renderStraightTransition(group, fromState, toState, transition) {
        const x1 = fromState.scaledX;
        const y1 = fromState.scaledY;
        const x2 = toState.scaledX;
        const y2 = toState.scaledY;

        // Calculate angle and adjust start/end points to circle edge
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const radius = 25;
        
        const startX = x1 + Math.cos(angle) * radius;
        const startY = y1 + Math.sin(angle) * radius;
        const endX = x2 - Math.cos(angle) * radius;
        const endY = y2 - Math.sin(angle) * radius;

        // Draw straight line
        group.append("line")
            .attr("x1", startX)
            .attr("y1", startY)
            .attr("x2", endX)
            .attr("y2", endY)
            .attr("stroke", this.currentTransition === transition.label ? "#7c3aed" : "#6b7280")
            .attr("stroke-width", this.currentTransition === transition.label ? 3 : 2)
            .attr("stroke-linecap", "round")
            .attr("marker-end", `url(#${this.currentTransition === transition.label ? 'arrowhead-active' : 'arrowhead'})`);

        // Add label at midpoint with better formatting
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        
        // Calculate perpendicular offset for label
        const perpAngle = angle + Math.PI / 2;
        const labelOffsetX = Math.cos(perpAngle) * 15;
        const labelOffsetY = Math.sin(perpAngle) * 15;

        // Add background rectangle for better readability
        const labelText = transition.label;
        const textWidth = labelText.length * 7; // Approximate text width
        const textHeight = 16;

        group.append("rect")
            .attr("x", midX + labelOffsetX - textWidth / 2)
            .attr("y", midY + labelOffsetY - textHeight / 2)
            .attr("width", textWidth)
            .attr("height", textHeight)
            .attr("fill", "white")
            .attr("stroke", "#e5e7eb")
            .attr("stroke-width", 1)
            .attr("rx", 3)
            .attr("opacity", 0.9);

        group.append("text")
            .attr("x", midX + labelOffsetX)
            .attr("y", midY + labelOffsetY + 4)
            .attr("text-anchor", "middle")
            .attr("font-size", "11px")
            .attr("font-family", "Courier New, monospace")
            .attr("fill", this.currentTransition === transition.label ? "#7c3aed" : "#374151")
            .attr("font-weight", this.currentTransition === transition.label ? "bold" : "500")
            .text(labelText);
    }

    // Render curved transition (for bidirectional arrows)
    renderCurvedTransition(group, fromState, toState, transition, index) {
        const x1 = fromState.scaledX;
        const y1 = fromState.scaledY;
        const x2 = toState.scaledX;
        const y2 = toState.scaledY;

        // Calculate angle and adjust start/end points to circle edge
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const radius = 25;
        
        const startX = x1 + Math.cos(angle) * radius;
        const startY = y1 + Math.sin(angle) * radius;
        const endX = x2 - Math.cos(angle) * radius;
        const endY = y2 - Math.sin(angle) * radius;

        // Create curved path for bidirectional transitions
        const dx = endX - startX;
        const dy = endY - startY;
        const dr = Math.sqrt(dx * dx + dy * dy);
        
        // Curve based on index to separate bidirectional arrows
        const sweep = index % 2;
        const arc = `M${startX},${startY}A${dr * 0.8},${dr * 0.8} 0 0,${sweep} ${endX},${endY}`;

        group.append("path")
            .attr("d", arc)
            .attr("fill", "none")
            .attr("stroke", this.currentTransition === transition.label ? "#7c3aed" : "#6b7280")
            .attr("stroke-width", this.currentTransition === transition.label ? 3 : 2)
            .attr("stroke-linecap", "round")
            .attr("marker-end", `url(#${this.currentTransition === transition.label ? 'arrowhead-active' : 'arrowhead'})`);

        // Add label with background for better readability
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        
        // Offset label based on curve direction
        const offsetX = sweep ? -15 : 15;
        const offsetY = sweep ? -15 : 15;

        const labelText = transition.label;
        const textWidth = labelText.length * 7;
        const textHeight = 16;

        group.append("rect")
            .attr("x", midX + offsetX - textWidth / 2)
            .attr("y", midY + offsetY - textHeight / 2)
            .attr("width", textWidth)
            .attr("height", textHeight)
            .attr("fill", "white")
            .attr("stroke", "#e5e7eb")
            .attr("stroke-width", 1)
            .attr("rx", 3)
            .attr("opacity", 0.9);

        group.append("text")
            .attr("x", midX + offsetX)
            .attr("y", midY + offsetY + 4)
            .attr("text-anchor", "middle")
            .attr("font-size", "11px")
            .attr("font-family", "Courier New, monospace")
            .attr("fill", this.currentTransition === transition.label ? "#7c3aed" : "#374151")
            .attr("font-weight", this.currentTransition === transition.label ? "bold" : "500")
            .text(labelText);
    }

    // Render multiple transitions with stacked labels
    renderStackedTransitions(group, fromState, toState, transitions) {
        const x1 = fromState.scaledX;
        const y1 = fromState.scaledY;
        const x2 = toState.scaledX;
        const y2 = toState.scaledY;

        // Calculate angle and adjust start/end points to circle edge
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const radius = 25;
        
        const startX = x1 + Math.cos(angle) * radius;
        const startY = y1 + Math.sin(angle) * radius;
        const endX = x2 - Math.cos(angle) * radius;
        const endY = y2 - Math.sin(angle) * radius;

        // Check if any transition is currently active
        const hasActiveTransition = transitions.some(t => this.currentTransition === t.label);

        // Draw single straight line for all transitions
        group.append("line")
            .attr("x1", startX)
            .attr("y1", startY)
            .attr("x2", endX)
            .attr("y2", endY)
            .attr("stroke", hasActiveTransition ? "#7c3aed" : "#6b7280")
            .attr("stroke-width", hasActiveTransition ? 3 : 2)
            .attr("stroke-linecap", "round")
            .attr("marker-end", `url(#${hasActiveTransition ? 'arrowhead-active' : 'arrowhead'})`);

        // Stack labels vertically at midpoint
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        
        // Calculate perpendicular offset for labels
        const perpAngle = angle + Math.PI / 2;
        const baseOffsetX = Math.cos(perpAngle) * 20;
        const baseOffsetY = Math.sin(perpAngle) * 20;

        // Calculate total height needed for all labels
        const labelHeight = 18;
        const totalHeight = transitions.length * labelHeight;
        const startOffset = -(totalHeight / 2) + (labelHeight / 2);

        // Add background rectangle for all labels
        const maxTextWidth = Math.max(...transitions.map(t => t.label.length)) * 7;
        
        group.append("rect")
            .attr("x", midX + baseOffsetX - maxTextWidth / 2 - 4)
            .attr("y", midY + baseOffsetY + startOffset - labelHeight / 2)
            .attr("width", maxTextWidth + 8)
            .attr("height", totalHeight)
            .attr("fill", "white")
            .attr("stroke", "#e5e7eb")
            .attr("stroke-width", 1)
            .attr("rx", 4)
            .attr("opacity", 0.95);

        // Add each label
        transitions.forEach((transition, index) => {
            const labelY = midY + baseOffsetY + startOffset + (index * labelHeight);
            
            group.append("text")
                .attr("x", midX + baseOffsetX)
                .attr("y", labelY + 4)
                .attr("text-anchor", "middle")
                .attr("font-size", "10px")
                .attr("font-family", "Courier New, monospace")
                .attr("fill", this.currentTransition === transition.label ? "#7c3aed" : "#374151")
                .attr("font-weight", this.currentTransition === transition.label ? "bold" : "500")
                .text(transition.label);
        });
    }

    // Add start state indicator
    addStartIndicator() {
        const startState = this.pda.states.find(s => s.isStart);
        if (!startState) return;

        const indicatorGroup = this.mainGroup.append("g").attr("class", "start-indicator");

        // Arrow pointing to start state
        const arrowLength = 40;
        const startX = startState.scaledX - 25 - arrowLength;
        const startY = startState.scaledY;
        const endX = startState.scaledX - 25;
        const endY = startState.scaledY;

        indicatorGroup.append("line")
            .attr("x1", startX)
            .attr("y1", startY)
            .attr("x2", endX)
            .attr("y2", endY)
            .attr("stroke", "#7c3aed")
            .attr("stroke-width", 3)
            .attr("marker-end", "url(#arrowhead-active)");

        indicatorGroup.append("text")
            .attr("x", startX - 10)
            .attr("y", startY)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .attr("fill", "#7c3aed")
            .text("START");
    }

    // Add legend explaining PDA components
    addLegend() {
        const legendGroup = this.mainGroup.append("g")
            .attr("class", "pda-legend")
            .attr("transform", `translate(10, ${this.height - 50})`);

        const legendData = [
            { color: "#7c3aed", text: "Start State", symbol: "circle" },
            { color: "#10b981", text: "Accept State", symbol: "double-circle" },
            { color: "#7c3aed", text: "Current State", symbol: "filled-circle" }
        ];

        const legendItems = legendGroup
            .selectAll(".legend-item")
            .data(legendData)
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(${i * 120}, 0)`);

        // Legend symbols
        legendItems.each(function(d) {
            const item = d3.select(this);
            
            if (d.symbol === "circle") {
                item.append("circle")
                    .attr("r", 8)
                    .attr("fill", "none")
                    .attr("stroke", d.color)
                    .attr("stroke-width", 2);
            } else if (d.symbol === "double-circle") {
                item.append("circle")
                    .attr("r", 8)
                    .attr("fill", "none")
                    .attr("stroke", d.color)
                    .attr("stroke-width", 2);
                item.append("circle")
                    .attr("r", 5)
                    .attr("fill", "none")
                    .attr("stroke", d.color)
                    .attr("stroke-width", 2);
            } else if (d.symbol === "filled-circle") {
                item.append("circle")
                    .attr("r", 8)
                    .attr("fill", d.color)
                    .attr("stroke", d.color)
                    .attr("stroke-width", 2);
            }
        });

        // Legend text
        legendItems.append("text")
            .attr("x", 15)
            .attr("y", 0)
            .attr("dominant-baseline", "central")
            .attr("font-size", "11px")
            .attr("fill", "#374151")
            .text(d => d.text);
    }

    // Update visualization for current state/transition with animations
    updateVisualization() {
        if (!this.svg) return;

        // Update state highlighting with CSS classes AND inline styles for compatibility
        this.mainGroup.selectAll(".pda-state")
            .each((d, i, nodes) => {
                const stateGroup = d3.select(nodes[i]);
                const circle = stateGroup.select("circle");
                const text = stateGroup.select("text");
                const isCurrentState = d.id === this.currentState;
                
                // Update circle classes and force styling
                circle
                    .classed("current", isCurrentState)
                    .classed("start", d.isStart)
                    .classed("accept", d.isAccept);

                // Apply styles immediately to ensure they show
                if (isCurrentState) {
                    circle
                        .style("fill", "#7c3aed")
                        .style("stroke", "#5b21b6")
                        .style("stroke-width", "4px")
                        .style("filter", "drop-shadow(0 0 12px rgba(124, 58, 237, 0.6)) drop-shadow(0 0 20px rgba(124, 58, 237, 0.4))")
                        .style("animation", "currentStatePulse 2s infinite ease-in-out");
                } else if (d.isStart) {
                    circle
                        .style("fill", "#faf5ff")
                        .style("stroke", "#7c3aed")
                        .style("stroke-width", "3px")
                        .style("filter", "drop-shadow(0 0 8px rgba(124, 58, 237, 0.3))")
                        .style("animation", "none");
                } else if (d.isAccept) {
                    circle
                        .style("fill", "#f0fdf4")
                        .style("stroke", "#10b981")
                        .style("stroke-width", "3px")
                        .style("filter", "drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))")
                        .style("animation", "none");
                } else {
                    circle
                        .style("fill", "#f9fafb")
                        .style("stroke", "#6b7280")
                        .style("stroke-width", "2px")
                        .style("filter", "none")
                        .style("animation", "none");
                }

                // Update text styling
                text
                    .classed("current", isCurrentState)
                    .style("fill", isCurrentState ? "white" : "#374151")
                    .style("font-weight", isCurrentState ? "bold" : "500");
            });

        // Update accept state inner circles
        this.mainGroup.selectAll(".pda-state")
            .filter(d => d.isAccept)
            .select("circle:last-child")
            .classed("current", d => d.id === this.currentState)
            .style("stroke", d => d.id === this.currentState ? "#5b21b6" : "#047857")
            .style("stroke-width", d => d.id === this.currentState ? "3px" : "2px")
            .style("filter", d => d.id === this.currentState ? "drop-shadow(0 0 8px rgba(124, 58, 237, 0.4))" : "none");

        // Update transition highlighting with enhanced visual feedback
        const currentTransition = this.currentTransition;
        this.mainGroup.selectAll(".pda-transition")
            .each(function(d, i) {
                const transitionGroup = d3.select(this);
                
                // Safely get transition text from the data or from the DOM element
                let transitionText = '';
                if (d && d.text) {
                    transitionText = d.text;
                } else {
                    // Fallback: get text from the text element within this group
                    const textElement = transitionGroup.select("text");
                    if (!textElement.empty()) {
                        transitionText = textElement.text();
                    }
                }
                
                // Check if this transition matches the current transition
                const isActive = currentTransition && transitionText && 
                    (transitionText.includes(currentTransition) || currentTransition.includes(transitionText));
                
                console.log('Checking transition:', transitionText, 'against current:', currentTransition, 'active:', isActive);
                
                // Update path styling with shadow effects
                transitionGroup.select("path")
                    .classed("active", isActive)
                    .style("stroke", isActive ? "#dc2626" : "#6b7280")
                    .style("stroke-width", isActive ? "4px" : "2px")
                    .style("opacity", isActive ? 1 : 0.7)
                    .style("filter", isActive ? "drop-shadow(0 0 8px rgba(124, 58, 237, 0.6))" : "none");
                
                // Update transition label styling with shadow effects
                transitionGroup.select("text")
                    .classed("active", isActive)
                    .style("fill", isActive ? "#dc2626" : "#374151")
                    .style("font-weight", isActive ? "bold" : "normal")
                    .style("font-size", isActive ? "14px" : "12px")
                    .style("filter", isActive ? "drop-shadow(0 1px 2px rgba(124, 58, 237, 0.4))" : "none");
            });
    }

    // Add stack visualization to the PDA
    updateStackVisualization() {
        console.log('Updating stack visualization with:', this.currentStack);
        
        // Update the HTML stack display
        const stackElement = document.getElementById('pda_stack_contents');
        if (stackElement && this.currentStack) {
            // Show stack from top to bottom (no reversal needed, show as-is)
            const stackDisplay = this.currentStack.length > 0 ? 
                `[${this.currentStack.join(', ')}]` : 
                '[ ]';
            stackElement.textContent = stackDisplay;
        }

        // Update visual stack representation
        const visualStackElement = document.getElementById('visual_stack');
        if (visualStackElement) {
            console.log('Visual stack element found, updating with stack:', this.currentStack);
            
            // Clear existing stack elements with animation
            const existingElements = visualStackElement.querySelectorAll('.stack-element');
            existingElements.forEach(el => {
                el.style.animation = 'stackPop 0.3s ease-out forwards';  
                setTimeout(() => el.remove(), 300);
            });
            
            // Small delay before adding new elements
            setTimeout(() => {
                if (this.currentStack && this.currentStack.length > 0) {
                    // Create stack elements from bottom to top (reverse the array for display)
                    const stackForDisplay = [...this.currentStack].reverse();
                    stackForDisplay.forEach((symbol, index) => {
                        const stackItem = document.createElement('div');
                        stackItem.className = 'stack-element';
                        if (index === 0) {
                            stackItem.className += ' top'; // Highlight top element (first in reversed array)
                        }
                        stackItem.textContent = symbol;
                        stackItem.title = `Stack position: ${stackForDisplay.length - index} (from bottom)`;
                        
                        // Add with animation delay
                        stackItem.style.animationDelay = `${index * 0.1}s`;
                        visualStackElement.appendChild(stackItem);
                    });
                } else {
                    // Show empty stack indicator
                    const emptyIndicator = document.createElement('div');
                    emptyIndicator.className = 'stack-element empty-indicator';
                    emptyIndicator.textContent = 'Empty';
                    visualStackElement.appendChild(emptyIndicator);
                }
            }, 150);
        } else {
            console.warn('Visual stack element not found!');
        }
    }

    // Add input visualization to the PDA
    updateInputVisualization() {
        // Update the HTML input display
        const inputElement = document.getElementById('pda_remaining_input');
        if (inputElement) {
            inputElement.textContent = `"${this.remainingInput}"`;
        }
    }

    // Highlight available transitions from current state
    highlightAvailableTransitions(availableTransitions = []) {
        this.mainGroup.selectAll(".pda-transition")
            .each(function(d, i) {
                const transitionGroup = d3.select(this);
                const transitionLabel = transitionGroup.attr("data-transition");
                const isAvailable = availableTransitions.some(t => 
                    transitionLabel && transitionLabel.includes(t)
                );
                
                // Add subtle highlighting for available transitions
                if (isAvailable) {
                    transitionGroup.select("path")
                        .attr("stroke-dasharray", "5,5")
                        .attr("opacity", 0.8);
                } else {
                    transitionGroup.select("path")
                        .attr("stroke-dasharray", null)
                        .attr("opacity", 0.4);
                }
            });
    }

    // Clear transition highlighting
    clearTransitionHighlighting() {
        this.mainGroup.selectAll(".pda-transition path")
            .attr("stroke-dasharray", null)
            .attr("opacity", 1);
    }

    // Animate transition
    animateTransition(fromState, toState, transitionLabel, callback) {
        this.currentTransition = transitionLabel;
        this.updateVisualization();

        // Animate for a brief moment
        setTimeout(() => {
            this.currentState = toState;
            this.currentTransition = null;
            this.updateVisualization();
            if (callback) callback();
        }, 1000);
    }

    // Reset to initial state
    reset() {
        if (this.pda) {
            this.currentState = this.pda.startState;
            this.currentTransition = null;
            this.currentStack = [];
            this.remainingInput = "";
            this.updateVisualization();
            this.updateStackVisualization();
            this.updateInputVisualization();
        }
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
    window.PDAVisualizer = PDAVisualizer;
}
