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
        ,
        // New example: Balanced parentheses (classic CFL)
        {
            id: 4,
            name: "L = {w ∈ {(,)}* | parentheses balanced}",
            description: "Language of well-balanced parentheses",
            testString: "()()",
            pda: {
                states: [
                    { id: "q0", x: 150, y: 150, isStart: true, isAccept: false, label: "q₀" },
                    { id: "q1", x: 350, y: 150, isStart: false, isAccept: true, label: "q₁" }
                ],
                alphabet: ["(", ")"],
                stackAlphabet: ["Z", "P"],
                startState: "q0",
                acceptStates: ["q1"],
                transitions: [
                    { from: "q0", to: "q0", input: "(", stackPop: "Z", stackPush: "PZ", label: "(, Z → PZ" },
                    { from: "q0", to: "q0", input: "(", stackPop: "P", stackPush: "PP", label: "(, P → PP" },
                    { from: "q0", to: "q0", input: ")", stackPop: "P", stackPush: "", label: "), P → ε" },
                    { from: "q0", to: "q1", input: "ε", stackPop: "Z", stackPush: "Z", label: "ε, Z → Z" }
                ]
            },
            cfg: {
                startSymbol: "S",
                nonTerminals: ["S"],
                terminals: ["(", ")"],
                productions: [
                    { left: "S", right: "(S)S", id: "p1" },
                    { left: "S", right: "ε", id: "p2" }
                ]
            },
            pdaSteps: [
                {
                    stepNumber: 1,
                    currentState: "q0",
                    remainingInput: "()()",
                    stack: ["Z"],
                    description: "Initial configuration",
                    choices: [
                        "δ(q0, (, P) = {(q0, PP)}",
                        "δ(q0, (, Z) = {(q0, PZ)}",
                        "δ(q0, ε, Z) = {(q1, Z)}",
                        "δ(q0, ), Z) = {(q0, Z)}"
                    ],
                    correctAnswer: 1,
                    explanation: "Read '(' and push a P onto stack (P represents '(')",
                    hint: "Push for every '('"
                },
                {
                    stepNumber: 2,
                    currentState: "q0",
                    remainingInput: ")()",
                    stack: ["Z", "P"],
                    description: "After reading first '('",
                    choices: [
                        "δ(q0, (, P) = {(q0, PP)}",
                        "δ(q0, ε, Z) = {(q1, Z)}",
                        "δ(q0, ), P) = {(q0, ε)}",
                        "δ(q0, (, Z) = {(q0, PZ)}"
                    ],
                    correctAnswer: 2,
                    explanation: "Read ')', match and pop a P",
                    hint: "Pop when you encounter a matching ')'."
                },
                {
                    stepNumber: 3,
                    currentState: "q0",
                    remainingInput: "()",
                    stack: ["Z"],
                    description: "After completing first pair",
                    choices: [
                        "δ(q0, ), Z) = {(q0, Z)}",
                        "δ(q0, ε, Z) = {(q1, Z)}",
                        "δ(q0, (, Z) = {(q0, PZ)}",
                        "δ(q0, ), P) = {(q0, ε)}"
                    ],
                    correctAnswer: 2,
                    explanation: "Push for next '('",
                    hint: "Continue processing the remaining input"
                },
                {
                    stepNumber: 4,
                    currentState: "q0",
                    remainingInput: ")",
                    stack: ["Z", "P"],
                    description: "Prepare to pop second pair",
                    choices: [
                        "δ(q0, ), Z) = {(q0, Z)}",
                        "δ(q0, (, P) = {(q0, PP)}",
                        "δ(q0, ε, Z) = {(q1, Z)}",
                        "δ(q0, ), P) = {(q0, ε)}"
                    ],
                    correctAnswer: 2,
                    explanation: "Pop the P to match the last ')', leaving Z on stack",
                    hint: "Finish matching the parentheses"
                },
                {
                    stepNumber: 5,
                    currentState: "q0",
                    remainingInput: "",
                    stack: ["Z"],
                    description: "All input processed",
                    choices: [
                        "δ(q0, ε, Z) = {(q1, Z)}",
                        "δ(q0, (, Z) = {(q0, PZ)}",
                        "δ(q0, ), Z) = {(q0, Z)}",
                        "δ(q0, ), P) = {(q0, ε)}"
                    ],
                    correctAnswer: 0,
                    explanation: "Use epsilon transition on Z to accept",
                    hint: "When input is empty and only Z is on stack, accept"
                }
            ],
            cfgSteps: [
                {
                    stepNumber: 1,
                    currentString: "S",
                    targetString: "()()",
                    description: "Start with start symbol",
                    choices: [
                        "S → ε",
                        "S → (S)S"
                    ],
                    correctAnswer: 1,
                    explanation: "Apply S → (S)S to start introducing parentheses",
                    hint: "We need to generate pairs and possibly concatenate them"
                },
                {
                    stepNumber: 2,
                    currentString: "(S)S",
                    targetString: "()()",
                    description: "After first production",
                    choices: [
                        "S → (S)S",
                        "S → ε"
                    ],
                    correctAnswer: 1,
                    explanation: "Replace the S inside parentheses with ε to make '()'",
                    hint: "Close the inner parentheses when possible"
                },
                {
                    stepNumber: 3,
                    currentString: "()S",
                    targetString: "()()",
                    description: "We have one unit, generate the next",
                    choices: [
                        "S → ε",
                        "S → (S)S"
                    ],
                    correctAnswer: 1,
                    explanation: "Apply S → (S)S to generate another '()'",
                    hint: "Generate the second parentheses pair"
                },
                {
                    stepNumber: 4,
                    currentString: "()(S)S",
                    targetString: "()()",
                    description: "Finish derivation",
                    choices: [
                        "S → (S)S",
                        "S → ε"
                    ],
                    correctAnswer: 1,
                    explanation: "Use S → ε to end the derivation",
                    hint: "Stop when target string is reached"
                }
            ]
        }

        ,
        // New example: Union of two CFLs: a^n b^n c^m  ∪  a^m b^n c^n
        {
            id: 5,
            name: "L = {a^n b^n c^m | n,m≥0} ∪ {a^m b^n c^n | m,n≥0}",
            description: "Union of two context-free languages; nondeterministic PDA guesses which case",
            testString: "aabbbccc",
            pda: {
                states: [
                    { id: "q0", x: 120, y: 120, isStart: true, isAccept: false, label: "q₀" },
                    { id: "q1", x: 300, y: 120, isStart: false, isAccept: false, label: "q₁" },
                    { id: "q2", x: 480, y: 120, isStart: false, isAccept: false, label: "q₂" },
                    { id: "q3", x: 660, y: 120, isStart: false, isAccept: true, label: "q₃" },
                    { id: "q4", x: 300, y: 240, isStart: false, isAccept: false, label: "q₄" },
                    { id: "q5", x: 480, y: 240, isStart: false, isAccept: false, label: "q₅" }
                ],
                alphabet: ["a", "b", "c"],
                stackAlphabet: ["Z", "A"],
                startState: "q0",
                acceptStates: ["q3"],
                transitions: [
                    // Epsilon branch to choose case 1: a^n b^n c^m
                    { from: "q0", to: "q1", input: "ε", stackPop: "Z", stackPush: "Z", label: "ε, Z → Z (choose case 1)" },
                    { from: "q1", to: "q1", input: "a", stackPop: "Z", stackPush: "AZ", label: "a, Z → AZ" },
                    { from: "q1", to: "q1", input: "a", stackPop: "A", stackPush: "AA", label: "a, A → AA" },
                    { from: "q1", to: "q2", input: "b", stackPop: "A", stackPush: "", label: "b, A → ε" },
                    { from: "q2", to: "q2", input: "b", stackPop: "A", stackPush: "", label: "b, A → ε" },
                    { from: "q2", to: "q3", input: "ε", stackPop: "Z", stackPush: "Z", label: "ε, Z → Z" },
                    { from: "q3", to: "q3", input: "c", stackPop: "Z", stackPush: "Z", label: "c, Z → Z" },
                    // Epsilon branch to choose case 2: a^m b^n c^n
                    { from: "q0", to: "q4", input: "ε", stackPop: "Z", stackPush: "Z", label: "ε, Z → Z (choose case 2)" },
                    { from: "q4", to: "q4", input: "a", stackPop: "Z", stackPush: "Z", label: "a, Z → Z" },
                    { from: "q4", to: "q5", input: "b", stackPop: "Z", stackPush: "AZ", label: "b, Z → AZ" },
                    { from: "q5", to: "q5", input: "b", stackPop: "A", stackPush: "AA", label: "b, A → AA" },
                    { from: "q5", to: "q5", input: "c", stackPop: "A", stackPush: "", label: "c, A → ε" },
                    { from: "q5", to: "q3", input: "ε", stackPop: "Z", stackPush: "Z", label: "ε, Z → Z" }
                ]
            },
            cfg: {
                startSymbol: "S",
                nonTerminals: ["S", "X", "Y", "Z"],
                terminals: ["a", "b", "c"],
                productions: [
                    // union of two cases
                    { left: "S", right: "X", id: "p1" },
                    { left: "S", right: "Y", id: "p2" },

                    // Case X (a^n b^n c^m): a balanced a/b part then c*
                    { left: "X", right: "aXb", id: "p3" },
                    { left: "X", right: "Z", id: "p4" },
                    { left: "Z", right: "cZ", id: "p5" },
                    { left: "Z", right: "ε", id: "p6" },

                    // Case Y (a^m b^n c^n): arbitrary a* then balanced b/c
                    { left: "Y", right: "aY", id: "p7" },
                    { left: "Y", right: "W", id: "p8" },
                    { left: "W", right: "bWc", id: "p9" },
                    { left: "W", right: "ε", id: "p10" }
                ]
            },
            pdaSteps: [
                {
                    stepNumber: 1,
                    currentState: "q0",
                    remainingInput: "aabbbccc",
                    stack: ["Z"],
                    description: "Initial configuration (nondeterministic choice)",
                    choices: [
                        "Read a and push (ambiguous)",
                        "ε-branch to case2: q4",
                        "ε-branch to case1: q1",
                        "Reject immediately"
                    ],
                    correctAnswer: 1,
                    explanation: "Choose case 1 or case 2 nondeterministically; here we show case 2 path",
                    hint: "We need to decide which pattern to follow"
                },
                {
                    stepNumber: 2,
                    currentState: "q4",
                    remainingInput: "abbbccc",
                    stack: ["Z"],
                    description: "Reading initial a's (case 2), a's are ignored on stack",
                    choices: [
                        "δ(q4, b, Z) -> (q5, AZ)",
                        "δ(q4, a, Z) -> (q4, Z)",
                        "δ(q4, ε, Z) -> (q4, Z)",
                        "δ(q0, b, Z) -> (q1, Z)"
                    ],
                    correctAnswer: 1,
                    explanation: "Consume an 'a' without changing the stack in case 2",
                    hint: "In case 2 'a' is free and does not affect the b/c equality"
                },
                {
                    stepNumber: 3,
                    currentState: "q5",
                    remainingInput: "bbbccc",
                    stack: ["Z", "A"],
                    description: "Start counting b's by pushing A for each b",
                    choices: [
                        "δ(q5, c, A) = {(q5, ε)}",
                        "δ(q5, b, A) = {(q5, AA)}",
                        "δ(q5, ε, Z) = {(q3, Z)}",
                        "δ(q5, a, Z) = {(q4, Z)}"
                    ],
                    correctAnswer: 1,
                    explanation: "Push A for another 'b'",
                    hint: "Count the number of b's to match later with c's"
                },
                {
                    stepNumber: 4,
                    currentState: "q5",
                    remainingInput: "ccc",
                    stack: ["Z", "A", "A", "A"],
                    description: "After pushing for all b's, switch to popping on c's",
                    choices: [
                        "δ(q5, b, A) = {(q5, AA)}",
                        "δ(q5, c, A) = {(q5, ε)}",
                        "δ(q5, ε, Z) = {(q3, Z)}",
                        "δ(q4, b, Z) = {(q5, AZ)}"
                    ],
                    correctAnswer: 1,
                    explanation: "Read c and pop an A for each c",
                    hint: "Match each c with a corresponding b count"
                },
                {
                    stepNumber: 5,
                    currentState: "q5",
                    remainingInput: "",
                    stack: ["Z"],
                    description: "After all b/c matched and stack reduced to Z",
                    choices: [
                        "δ(q5, ε, A) = {(q5, A)}",
                        "δ(q1, ε, Z) = {(q2, Z)}",
                        "δ(q2, c, Z) = {(q2, Z)}",
                        "δ(q5, ε, Z) = {(q3, Z)}"
                    ],
                    correctAnswer: 3,
                    explanation: "Use epsilon transition to accept; we matched b's and c's",
                    hint: "Accept if stack is back to Z and no input left"
                }
            ],
            cfgSteps: [
                {
                    stepNumber: 1,
                    currentString: "S",
                    targetString: "aabbbccc",
                    description: "Start; choose union branch",
                    choices: [
                        "S → X (case a^n b^n c^m)",
                        "S → Y (case a^m b^n c^n)"
                    ],
                    correctAnswer: 1,
                    explanation: "Choose case Y to generate b^n c^n; we still must handle initial a's",
                    hint: "We need to pick the grammar branch that produces equal b/c counts"
                },
                {
                    stepNumber: 2,
                    currentString: "Y",
                    targetString: "aabbbccc",
                    description: "Generate initial a* for Y",
                    choices: [
                        "Y → W",
                        "Y → aY"
                    ],
                    correctAnswer: 1,
                    explanation: "Consume one 'a' using Y → aY",
                    hint: "Repeat to generate 'aa' at the start"
                },
                {
                    stepNumber: 3,
                    currentString: "aaW",
                    targetString: "aabbbccc",
                    description: "Now produce the b^n c^n part from W",
                    choices: [
                        "W → ε",
                        "W → bWc"
                    ],
                    correctAnswer: 1,
                    explanation: "Apply W → bWc to start matching b's and c's",
                    hint: "Each application adds a pair 'b...c'"
                },
                {
                    stepNumber: 4,
                    currentString: "aabWcc",
                    targetString: "aabbbccc",
                    description: "Continue until counts match",
                    choices: [
                        "W → ε",
                        "W → bWc"
                    ],
                    correctAnswer: 1,
                    explanation: "Apply W → bWc twice more to produce 'bbb' and 'ccc'",
                    hint: "Stop when you have 'bbb' and 'ccc'"
                },
                {
                    stepNumber: 5,
                    currentString: "aabbbccc",
                    targetString: "aabbbccc",
                    description: "Derivation complete",
                    choices: [],
                    correctAnswer: -1,
                    explanation: "String generated correctly under union branch Y",
                    hint: "Union of grammars allows this non-overlapping form"
                }
            ]
        }
    ]
};

// Export the data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = equivalenceData;
}
