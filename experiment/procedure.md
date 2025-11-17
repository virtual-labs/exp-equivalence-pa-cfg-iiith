## Getting Started

1. **Open the Simulation**: Launch the PDA-CFG Equivalence demonstration in your web browser
2. **Review the Interface**: The simulation displays tabbed views for PDA and CFG modes, shared language information, and interactive step-by-step execution
3. **Choose Your Language**: Use "Change Language" to select different context-free languages for exploration

## Understanding the Interface

### Dual-Model Visualization
- **PDA Tab**: Shows pushdown automaton with state diagram, visual stack, and transition selection
- **CFG Tab**: Displays context-free grammar with production rules, derivation tree, and rule selection
- **Shared Information**: Language description, test string, and remaining input visible in both modes

### Navigation Controls
- **Change Language**: Switch between different language examples (aⁿbⁿ, palindromes, etc.)
- **Previous Step**: Undo the last transition or production rule application
- **Show Hint**: Get guidance on the correct next step for the current situation
- **Apply Correct**: Automatically execute the correct transition or production
- **Reset**: Return to the initial configuration for both PDA and CFG

### Other Elements
- **Action Choices**: Multiple-choice selection for PDA transitions or CFG productions
- **Visual Feedback**: Immediate confirmation or correction of your selections
- **Step Tracking**: Complete execution history for both computational models

## Step-by-Step Procedure

### Step 1: Select Language Example
1. Use **Change Language** to choose from available context-free languages:
   - **L = {aⁿbⁿ | n ≥ 0}**: Equal numbers of a's followed by b's
   - **L = {wwᴿ | w ∈ {a,b}*}**: Palindromes over alphabet {a,b}
   - Additional language patterns as available

2. **Review Language Description**: Understand the formal definition and test string
3. **Observe Initial Setup**: Note the starting configurations for both PDA and CFG

### Step 2: PDA Mode Execution
1. **Switch to PDA Tab**: Click the "Pushdown Automaton (PDA)" tab
2. **Examine PDA Structure**:
   - **State Diagram**: Visual representation of states and transitions
   - **Visual Stack**: Real-time display of stack contents
   - **Current Status**: Current state, remaining input, and stack configuration

3. **Execute PDA Transitions**:
   - **Read Action Choices**: Available transitions displayed as multiple-choice options
   - **Select Transition**: Choose the correct transition from 4 options
   - **Observe Changes**: Watch state changes, input consumption, and stack operations
   - **Follow Progression**: Continue until string is accepted or rejected

4. **PDA Step Analysis**:
   - **Input Processing**: See how each input symbol is consumed
   - **Stack Operations**: Observe push/pop operations maintaining computation history
   - **State Transitions**: Track movement through the automaton's state space

### Step 3: CFG Mode Execution
1. **Switch to CFG Tab**: Click the "Context-Free Grammar (CFG)" tab
2. **Examine CFG Structure**:
   - **Production Rules**: Complete set of grammar productions
   - **Derivation Tree**: Visual tree showing string generation process
   - **Current String**: Current form in the derivation sequence

3. **Execute CFG Derivations**:
   - **Select Productions**: Choose appropriate production rules to apply
   - **Apply Rules**: Replace non-terminals according to selected productions
   - **Build Derivation**: Construct the complete derivation sequence
   - **Reach Target**: Continue until the target string is fully derived

4. **CFG Step Analysis**:
   - **Rule Selection**: Understand which production rules apply at each step
   - **String Evolution**: See how the string transforms through derivation
   - **Tree Construction**: Watch the parse tree grow with each application

### Step 4: Equivalence Verification
1. **Compare Execution Paths**: Switch between PDA and CFG tabs to observe parallel recognition
2. **Analyze Correspondence**: Notice how PDA transitions correspond to CFG derivation steps
3. **Verify Acceptance**: Confirm both models accept/reject the same strings
4. **Understand Mapping**: See how stack operations relate to production rule applications

