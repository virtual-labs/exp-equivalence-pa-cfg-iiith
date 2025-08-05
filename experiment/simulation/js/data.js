// Data for PDA-CFG Equivalence Experiment
// This file contains comprehensive data structures for demonstrating equivalence 
// between Pushdown Automata and Context-Free Grammars

const equivalenceData = {
    languages: [
        {
            id: 1,
            name: "L = {aⁿbⁿ | n ≥ 0}",
            description: "Language of equal numbers of a's followed by b's",
            testString: "aaabbb",
            
            // PDA Definition
            pda: {
                states: [
                    { id: "q0", x: 150, y: 150, isStart: true, isAccept: false, label: "q₀" },
                    { id: "q1", x: 350, y: 150, isStart: false, isAccept: false, label: "q₁" },
                    { id: "q2", x: 550, y: 150, isStart: false, isAccept: true, label: "q₂" }
                ],
                alphabet: ["a", "b"],
                stackAlphabet: ["Z", "A"],
                startState: "q0",
                acceptStates: ["q2"],
                transitions: [
                    { from: "q0", to: "q0", input: "a", stackPop: "Z", stackPush: "AZ", label: "a, Z → AZ" },
                    { from: "q0", to: "q0", input: "a", stackPop: "A", stackPush: "AA", label: "a, A → AA" },
                    { from: "q0", to: "q1", input: "b", stackPop: "A", stackPush: "", label: "b, A → ε" },
                    { from: "q1", to: "q1", input: "b", stackPop: "A", stackPush: "", label: "b, A → ε" },
                    { from: "q1", to: "q2", input: "ε", stackPop: "Z", stackPush: "Z", label: "ε, Z → Z" }
                ]
            },
            
            // CFG Definition
            cfg: {
                startSymbol: "S",
                nonTerminals: ["S"],
                terminals: ["a", "b"],
                productions: [
                    { left: "S", right: "aSb", id: "p1" },
                    { left: "S", right: "ε", id: "p2" }
                ]
            },
            
            // Step-by-step execution for PDA
            pdaSteps: [
                {
                    stepNumber: 1,
                    currentState: "q0",
                    remainingInput: "aaabbb",
                    stack: ["Z"],
                    description: "Initial configuration",
                    choices: [
                        "δ(q0, a, Z) = {(q0, AZ)}",
                        "δ(q0, b, Z) = {(q1, ε)}",
                        "δ(q0, ε, Z) = {(q2, Z)}",
                        "δ(q1, a, A) = {(q1, AA)}"
                    ],
                    correctAnswer: 0,
                    explanation: "Read 'a' and push 'A' onto stack with Z at bottom",
                    hint: "We need to process the first 'a' by pushing it onto the stack"
                },
                {
                    stepNumber: 2,
                    currentState: "q0",
                    remainingInput: "aabbb",
                    stack: ["Z", "A"],
                    description: "After reading first 'a'",
                    choices: [
                        "δ(q0, a, A) = {(q0, AA)}",
                        "δ(q0, b, A) = {(q1, ε)}",
                        "δ(q0, ε, A) = {(q2, A)}",
                        "δ(q1, a, A) = {(q1, AA)}"
                    ],
                    correctAnswer: 0,
                    explanation: "Read second 'a' and push another 'A' onto stack",
                    hint: "Continue reading a's and pushing them onto the stack"
                },
                {
                    stepNumber: 3,
                    currentState: "q0",
                    remainingInput: "abbb",
                    stack: ["Z", "A", "A"],
                    description: "After reading second 'a'",
                    choices: [
                        "δ(q0, a, A) = {(q0, AA)}",
                        "δ(q0, b, A) = {(q1, ε)}",
                        "δ(q0, ε, A) = {(q2, A)}",
                        "δ(q1, b, A) = {(q1, ε)}"
                    ],
                    correctAnswer: 0,
                    explanation: "Read third 'a' and push another 'A' onto stack",
                    hint: "We still have more a's to process"
                },
                {
                    stepNumber: 4,
                    currentState: "q0",
                    remainingInput: "bbb",
                    stack: ["Z", "A", "A", "A"],
                    description: "After reading all a's",
                    choices: [
                        "δ(q0, a, A) = {(q0, AA)}",
                        "δ(q0, b, A) = {(q1, ε)}",
                        "δ(q0, ε, A) = {(q2, A)}",
                        "δ(q1, b, A) = {(q1, ε)}"
                    ],
                    correctAnswer: 1,
                    explanation: "Read first 'b', transition to q1 and pop 'A' from stack",
                    hint: "Now we switch to reading b's and popping from the stack"
                },
                {
                    stepNumber: 5,
                    currentState: "q1",
                    remainingInput: "bb",
                    stack: ["Z", "A", "A"],
                    description: "After reading first 'b'",
                    choices: [
                        "δ(q0, b, A) = {(q1, ε)}",
                        "δ(q1, b, A) = {(q1, ε)}",
                        "δ(q1, ε, Z) = {(q2, Z)}",
                        "δ(q1, a, A) = {(q1, AA)}"
                    ],
                    correctAnswer: 1,
                    explanation: "Read second 'b' and pop another 'A' from stack",
                    hint: "Continue matching b's with the A's on the stack"
                },
                {
                    stepNumber: 6,
                    currentState: "q1",
                    remainingInput: "b",
                    stack: ["Z", "A"],
                    description: "After reading second 'b'",
                    choices: [
                        "δ(q0, b, A) = {(q1, ε)}",
                        "δ(q1, b, A) = {(q1, ε)}",
                        "δ(q1, ε, Z) = {(q2, Z)}",
                        "δ(q1, a, A) = {(q1, AA)}"
                    ],
                    correctAnswer: 1,
                    explanation: "Read third 'b' and pop the last 'A' from stack",
                    hint: "Match the final b with the last A"
                },
                {
                    stepNumber: 7,
                    currentState: "q1",
                    remainingInput: "",
                    stack: ["Z"],
                    description: "After reading all input",
                    choices: [
                        "δ(q0, b, A) = {(q1, ε)}",
                        "δ(q1, b, A) = {(q1, ε)}",
                        "δ(q1, ε, Z) = {(q2, Z)}",
                        "δ(q1, a, A) = {(q1, AA)}"
                    ],
                    correctAnswer: 2,
                    explanation: "Make epsilon transition to accept state q2 with Z on stack",
                    hint: "With only Z left on stack and no input, transition to accept state"
                }
            ],
            
            // Step-by-step derivation for CFG
            cfgSteps: [
                {
                    stepNumber: 1,
                    currentString: "S",
                    targetString: "aaabbb",
                    description: "Start with start symbol",
                    choices: [
                        "S → aSb",
                        "S → ε"
                    ],
                    correctAnswer: 0,
                    explanation: "Apply production S → aSb to generate outer a and b",
                    hint: "We need to generate the structure for multiple a's and b's"
                },
                {
                    stepNumber: 2,
                    currentString: "aSb",
                    targetString: "aaabbb",
                    description: "After first production",
                    choices: [
                        "S → aSb",
                        "S → ε"
                    ],
                    correctAnswer: 0,
                    explanation: "Apply S → aSb again to the middle S",
                    hint: "We still need to generate more a's and b's"
                },
                {
                    stepNumber: 3,
                    currentString: "aaSbb",
                    targetString: "aaabbb",
                    description: "After second production",
                    choices: [
                        "S → aSb",
                        "S → ε"
                    ],
                    correctAnswer: 0,
                    explanation: "Apply S → aSb once more to the middle S",
                    hint: "We need one more layer of a's and b's"
                },
                {
                    stepNumber: 4,
                    currentString: "aaaSbbb",
                    targetString: "aaabbb",
                    description: "After third production",
                    choices: [
                        "S → aSb",
                        "S → ε"
                    ],
                    correctAnswer: 1,
                    explanation: "Apply S → ε to eliminate the remaining S",
                    hint: "No more a's and b's needed, remove the S"
                },
                {
                    stepNumber: 5,
                    currentString: "aaabbb",
                    targetString: "aaabbb",
                    description: "Final derivation complete",
                    choices: [],
                    correctAnswer: -1,
                    explanation: "Derivation complete: aaabbb successfully generated",
                    hint: "Success! The string has been fully derived"
                }
            ]
        },
        
        {
            id: 2,
            name: "L = {wwᴿ | w ∈ {a,b}*}",
            description: "Language of palindromes (strings followed by their reverse)",
            testString: "abba",
            
            pda: {
                states: [
                    { id: "q0", x: 150, y: 150, isStart: true, isAccept: false, label: "q₀" },
                    { id: "q1", x: 350, y: 150, isStart: false, isAccept: false, label: "q₁" },
                    { id: "q2", x: 550, y: 150, isStart: false, isAccept: true, label: "q₂" }
                ],
                alphabet: ["a", "b"],
                stackAlphabet: ["Z", "a", "b"],
                startState: "q0",
                acceptStates: ["q2"],
                transitions: [
                    { from: "q0", to: "q0", input: "a", stackPop: "Z", stackPush: "aZ", label: "a, Z → aZ" },
                    { from: "q0", to: "q0", input: "b", stackPop: "Z", stackPush: "bZ", label: "b, Z → bZ" },
                    { from: "q0", to: "q0", input: "a", stackPop: "a", stackPush: "aa", label: "a, a → aa" },
                    { from: "q0", to: "q0", input: "a", stackPop: "b", stackPush: "ab", label: "a, b → ab" },
                    { from: "q0", to: "q0", input: "b", stackPop: "a", stackPush: "ba", label: "b, a → ba" },
                    { from: "q0", to: "q0", input: "b", stackPop: "b", stackPush: "bb", label: "b, b → bb" },
                    { from: "q0", to: "q1", input: "ε", stackPop: "Z", stackPush: "Z", label: "ε, Z → Z" },
                    { from: "q0", to: "q1", input: "ε", stackPop: "a", stackPush: "a", label: "ε, a → a" },
                    { from: "q0", to: "q1", input: "ε", stackPop: "b", stackPush: "b", label: "ε, b → b" },
                    { from: "q1", to: "q1", input: "a", stackPop: "a", stackPush: "", label: "a, a → ε" },
                    { from: "q1", to: "q1", input: "b", stackPop: "b", stackPush: "", label: "b, b → ε" },
                    { from: "q1", to: "q2", input: "ε", stackPop: "Z", stackPush: "Z", label: "ε, Z → Z" }
                ]
            },
            
            cfg: {
                startSymbol: "S",
                nonTerminals: ["S"],
                terminals: ["a", "b"],
                productions: [
                    { left: "S", right: "aSa", id: "p1" },
                    { left: "S", right: "bSb", id: "p2" },
                    { left: "S", right: "ε", id: "p3" }
                ]
            },
            
            pdaSteps: [
                {
                    stepNumber: 1,
                    currentState: "q0",
                    remainingInput: "abba",
                    stack: ["Z"],
                    description: "Initial configuration",
                    choices: [
                        "δ(q0, a, Z) = {(q0, aZ)}",
                        "δ(q0, b, Z) = {(q0, bZ)}",
                        "δ(q0, ε, Z) = {(q1, Z)}",
                        "δ(q1, a, a) = {(q1, ε)}"
                    ],
                    correctAnswer: 0,
                    explanation: "Read 'a' and push it onto stack",
                    hint: "Start by pushing the first symbol onto the stack"
                },
                {
                    stepNumber: 2,
                    currentState: "q0",
                    remainingInput: "bba",
                    stack: ["Z", "a"],
                    description: "After reading first 'a'",
                    choices: [
                        "δ(q0, b, a) = {(q0, ba)}",
                        "δ(q0, a, a) = {(q0, aa)}",
                        "δ(q0, ε, a) = {(q1, a)}",
                        "δ(q1, b, b) = {(q1, ε)}"
                    ],
                    correctAnswer: 0,
                    explanation: "Read 'b' and push it onto stack",
                    hint: "Continue pushing symbols for the first half"
                },
                {
                    stepNumber: 3,
                    currentState: "q0",
                    remainingInput: "ba",
                    stack: ["Z", "a", "b"],
                    description: "After reading first half",
                    choices: [
                        "δ(q0, b, b) = {(q0, bb)}",
                        "δ(q0, ε, b) = {(q1, b)}",
                        "δ(q1, b, b) = {(q1, ε)}",
                        "δ(q1, a, a) = {(q1, ε)}"
                    ],
                    correctAnswer: 1,
                    explanation: "Guess middle of palindrome, transition to q1",
                    hint: "Time to switch to matching mode"
                },
                {
                    stepNumber: 4,
                    currentState: "q1",
                    remainingInput: "ba",
                    stack: ["Z", "a", "b"],
                    description: "Switched to matching mode",
                    choices: [
                        "δ(q0, b, b) = {(q0, bb)}",
                        "δ(q1, b, b) = {(q1, ε)}",
                        "δ(q1, a, a) = {(q1, ε)}",
                        "δ(q1, ε, Z) = {(q2, Z)}"
                    ],
                    correctAnswer: 1,
                    explanation: "Read 'b' and match with top of stack",
                    hint: "Match the input symbol with the stack top"
                },
                {
                    stepNumber: 5,
                    currentState: "q1",
                    remainingInput: "a",
                    stack: ["Z", "a"],
                    description: "After matching first 'b'",
                    choices: [
                        "δ(q1, b, b) = {(q1, ε)}",
                        "δ(q1, a, a) = {(q1, ε)}",
                        "δ(q1, ε, Z) = {(q2, Z)}",
                        "δ(q0, a, a) = {(q0, aa)}"
                    ],
                    correctAnswer: 1,
                    explanation: "Read 'a' and match with top of stack",
                    hint: "Match the final input symbol"
                },
                {
                    stepNumber: 6,
                    currentState: "q1",
                    remainingInput: "",
                    stack: ["Z"],
                    description: "After matching all input",
                    choices: [
                        "δ(q1, b, b) = {(q1, ε)}",
                        "δ(q1, a, a) = {(q1, ε)}",
                        "δ(q1, ε, Z) = {(q2, Z)}",
                        "δ(q0, a, a) = {(q0, aa)}"
                    ],
                    correctAnswer: 2,
                    explanation: "Transition to accept state with empty input and Z on stack",
                    hint: "Accept the palindrome"
                }
            ],
            
            cfgSteps: [
                {
                    stepNumber: 1,
                    currentString: "S",
                    targetString: "abba",
                    description: "Start with start symbol",
                    choices: [
                        "S → aSa",
                        "S → bSb",
                        "S → ε"
                    ],
                    correctAnswer: 0,
                    explanation: "Apply S → aSa to generate outer a's",
                    hint: "The palindrome starts and ends with 'a'"
                },
                {
                    stepNumber: 2,
                    currentString: "aSa",
                    targetString: "abba",
                    description: "After first production",
                    choices: [
                        "S → aSa",
                        "S → bSb",
                        "S → ε"
                    ],
                    correctAnswer: 1,
                    explanation: "Apply S → bSb to the middle S",
                    hint: "The inner part has b's on both sides"
                },
                {
                    stepNumber: 3,
                    currentString: "abSba",
                    targetString: "abba",
                    description: "After second production",
                    choices: [
                        "S → aSa",
                        "S → bSb",
                        "S → ε"
                    ],
                    correctAnswer: 2,
                    explanation: "Apply S → ε to eliminate the middle S",
                    hint: "No more symbols needed in the middle"
                },
                {
                    stepNumber: 4,
                    currentString: "abba",
                    targetString: "abba",
                    description: "Final derivation complete",
                    choices: [],
                    correctAnswer: -1,
                    explanation: "Derivation complete: abba successfully generated",
                    hint: "Success! The palindrome has been fully derived"
                }
            ]
        },
        
        {
            id: 3,
            name: "L = {aⁿbᵐcⁿ | n,m ≥ 0}",
            description: "Language where number of a's equals number of c's",
            testString: "aabbcc",
            
            pda: {
                states: [
                    { id: "q0", x: 120, y: 150, isStart: true, isAccept: false, label: "q₀" },
                    { id: "q1", x: 270, y: 150, isStart: false, isAccept: false, label: "q₁" },
                    { id: "q2", x: 420, y: 150, isStart: false, isAccept: false, label: "q₂" },
                    { id: "q3", x: 570, y: 150, isStart: false, isAccept: true, label: "q₃" }
                ],
                alphabet: ["a", "b", "c"],
                stackAlphabet: ["Z", "A"],
                startState: "q0",
                acceptStates: ["q3"],
                transitions: [
                    { from: "q0", to: "q0", input: "a", stackPop: "Z", stackPush: "AZ", label: "a, Z → AZ" },
                    { from: "q0", to: "q0", input: "a", stackPop: "A", stackPush: "AA", label: "a, A → AA" },
                    { from: "q0", to: "q1", input: "b", stackPop: "Z", stackPush: "Z", label: "b, Z → Z" },
                    { from: "q0", to: "q1", input: "b", stackPop: "A", stackPush: "A", label: "b, A → A" },
                    { from: "q1", to: "q1", input: "b", stackPop: "Z", stackPush: "Z", label: "b, Z → Z" },
                    { from: "q1", to: "q1", input: "b", stackPop: "A", stackPush: "A", label: "b, A → A" },
                    { from: "q1", to: "q2", input: "c", stackPop: "A", stackPush: "", label: "c, A → ε" },
                    { from: "q2", to: "q2", input: "c", stackPop: "A", stackPush: "", label: "c, A → ε" },
                    { from: "q2", to: "q3", input: "ε", stackPop: "Z", stackPush: "Z", label: "ε, Z → Z" }
                ]
            },
            
            cfg: {
                startSymbol: "S",
                nonTerminals: ["S", "A"],
                terminals: ["a", "b", "c"],
                productions: [
                    { left: "S", right: "aSc", id: "p1" },
                    { left: "S", right: "A", id: "p2" },
                    { left: "A", right: "bA", id: "p3" },
                    { left: "A", right: "ε", id: "p4" }
                ]
            },
            
            pdaSteps: [
                {
                    stepNumber: 1,
                    currentState: "q0",
                    remainingInput: "aabbcc",
                    stack: ["Z"],
                    description: "Initial configuration",
                    choices: [
                        "δ(q0, a, Z) = {(q0, AZ)}",
                        "δ(q0, b, Z) = {(q1, Z)}",
                        "δ(q0, c, Z) = {(q2, Z)}",
                        "δ(q1, a, A) = {(q1, AA)}"
                    ],
                    correctAnswer: 0,
                    explanation: "Read first 'a' and push 'A' onto stack",
                    hint: "Start by processing the a's and pushing them onto the stack"
                },
                {
                    stepNumber: 2,
                    currentState: "q0",
                    remainingInput: "abbcc",
                    stack: ["Z", "A"],
                    description: "After reading first 'a'",
                    choices: [
                        "δ(q0, a, A) = {(q0, AA)}",
                        "δ(q0, b, A) = {(q1, A)}",
                        "δ(q0, c, A) = {(q2, ε)}",
                        "δ(q1, a, A) = {(q1, AA)}"
                    ],
                    correctAnswer: 0,
                    explanation: "Read second 'a' and push another 'A'",
                    hint: "Continue processing the remaining a's"
                },
                {
                    stepNumber: 3,
                    currentState: "q0",
                    remainingInput: "bbcc",
                    stack: ["Z", "A", "A"],
                    description: "After reading all a's",
                    choices: [
                        "δ(q0, a, A) = {(q0, AA)}",
                        "δ(q0, b, A) = {(q1, A)}",
                        "δ(q0, c, A) = {(q2, ε)}",
                        "δ(q1, b, A) = {(q1, A)}"
                    ],
                    correctAnswer: 1,
                    explanation: "Read first 'b' and transition to q1",
                    hint: "Switch to the b-processing state"
                },
                {
                    stepNumber: 4,
                    currentState: "q1",
                    remainingInput: "bcc",
                    stack: ["Z", "A", "A"],
                    description: "After reading first 'b'",
                    choices: [
                        "δ(q0, b, A) = {(q1, A)}",
                        "δ(q1, b, A) = {(q1, A)}",
                        "δ(q1, c, A) = {(q2, ε)}",
                        "δ(q2, c, A) = {(q2, ε)}"
                    ],
                    correctAnswer: 1,
                    explanation: "Read second 'b', stay in q1",
                    hint: "Continue processing b's without changing the stack"
                },
                {
                    stepNumber: 5,
                    currentState: "q1",
                    remainingInput: "cc",
                    stack: ["Z", "A", "A"],
                    description: "After reading all b's",
                    choices: [
                        "δ(q1, b, A) = {(q1, A)}",
                        "δ(q1, c, A) = {(q2, ε)}",
                        "δ(q2, c, A) = {(q2, ε)}",
                        "δ(q2, ε, Z) = {(q3, Z)}"
                    ],
                    correctAnswer: 1,
                    explanation: "Read first 'c', transition to q2 and pop 'A'",
                    hint: "Start matching c's with the A's on the stack"
                },
                {
                    stepNumber: 6,
                    currentState: "q2",
                    remainingInput: "c",
                    stack: ["Z", "A"],
                    description: "After reading first 'c'",
                    choices: [
                        "δ(q1, c, A) = {(q2, ε)}",
                        "δ(q2, c, A) = {(q2, ε)}",
                        "δ(q2, ε, Z) = {(q3, Z)}",
                        "δ(q3, c, A) = {(q3, ε)}"
                    ],
                    correctAnswer: 1,
                    explanation: "Read second 'c' and pop another 'A'",
                    hint: "Match the remaining c with the last A"
                },
                {
                    stepNumber: 7,
                    currentState: "q2",
                    remainingInput: "",
                    stack: ["Z"],
                    description: "After reading all input",
                    choices: [
                        "δ(q2, c, A) = {(q2, ε)}",
                        "δ(q2, ε, Z) = {(q3, Z)}",
                        "δ(q3, c, A) = {(q3, ε)}",
                        "δ(q1, ε, Z) = {(q2, Z)}"
                    ],
                    correctAnswer: 1,
                    explanation: "Transition to accept state q3",
                    hint: "Accept the string with Z remaining on stack"
                }
            ],
            
            cfgSteps: [
                {
                    stepNumber: 1,
                    currentString: "S",
                    targetString: "aabbcc",
                    description: "Start with start symbol",
                    choices: [
                        "S → aSc",
                        "S → A"
                    ],
                    correctAnswer: 0,
                    explanation: "Apply S → aSc to generate first a and last c",
                    hint: "We need to match a's with c's"
                },
                {
                    stepNumber: 2,
                    currentString: "aSc",
                    targetString: "aabbcc",
                    description: "After first production",
                    choices: [
                        "S → aSc",
                        "S → A"
                    ],
                    correctAnswer: 0,
                    explanation: "Apply S → aSc again to generate second a and c",
                    hint: "We need another a-c pair"
                },
                {
                    stepNumber: 3,
                    currentString: "aaScc",
                    targetString: "aabbcc",
                    description: "After second production",
                    choices: [
                        "S → aSc",
                        "S → A"
                    ],
                    correctAnswer: 1,
                    explanation: "Apply S → A to generate the middle part",
                    hint: "Now generate the b's in the middle"
                },
                {
                    stepNumber: 4,
                    currentString: "aaAcc",
                    targetString: "aabbcc",
                    description: "After introducing A",
                    choices: [
                        "A → bA",
                        "A → ε"
                    ],
                    correctAnswer: 0,
                    explanation: "Apply A → bA to generate first b",
                    hint: "Generate the b's one by one"
                },
                {
                    stepNumber: 5,
                    currentString: "aabAcc",
                    targetString: "aabbcc",
                    description: "After generating first b",
                    choices: [
                        "A → bA",
                        "A → ε"
                    ],
                    correctAnswer: 0,
                    explanation: "Apply A → bA to generate second b",
                    hint: "We need one more b"
                },
                {
                    stepNumber: 6,
                    currentString: "aabbAcc",
                    targetString: "aabbcc",
                    description: "After generating second b",
                    choices: [
                        "A → bA",
                        "A → ε"
                    ],
                    correctAnswer: 1,
                    explanation: "Apply A → ε to finish the derivation",
                    hint: "No more b's needed"
                },
                {
                    stepNumber: 7,
                    currentString: "aabbcc",
                    targetString: "aabbcc",
                    description: "Final derivation complete",
                    choices: [],
                    correctAnswer: -1,
                    explanation: "Derivation complete: aabbcc successfully generated",
                    hint: "Success! The string has been fully derived"
                }
            ]
        }
    ]
};

// Export the data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = equivalenceData;
}
