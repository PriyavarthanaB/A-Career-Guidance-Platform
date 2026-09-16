/**
 * Role-Specific Learning Roadmap Service
 * 
 * Maps Job Roles -> Required Skills -> Recommended Modules -> Topics -> Structured Theory -> Practical Relevance -> Interview Relevance -> Quizzes
 */

const ROLE_ROADMAPS = {
  "UI/UX Designer": {
    role: "UI/UX Designer",
    description: "Design intuitive, user-centered digital interfaces, wireframes, prototypes, and accessible design systems.",
    requiredSkills: ["UX Principles & Psychology", "User Research & Personas", "Wireframing & Prototyping", "Design Systems", "Usability Testing & Figma"],
    recommendedModules: [
      {
        id: "uiux-mod-01",
        number: "UX-01",
        name: "UX Principles & User-Centered Design",
        topic: "UX Design & Usability Principles",
        requiredSkill: "UX Principles & Psychology",
        difficulty: "Beginner",
        estimatedTime: "3.5 hrs",
        toolsAndTech: ["Figma", "Miro", "Balsamiq", "Whimsical"],
        topics: [
          "Jakob's Law & Fitts's Law",
          "Nielsen's 10 Usability Heuristics",
          "Accessibility & WCAG 2.1 Guidelines",
          "Information Architecture & User Flows"
        ],
        theoryContent: {
          overview: "User Experience (UX) design focuses on creating products that provide meaningful and relevant experiences to users. It involves designing the entire process of acquiring and integrating the product, including aspects of branding, design, usability, and function.",
          learningObjectives: [
            "Understand foundational UX laws (Fitts's Law, Hick's Law, Jakob's Law).",
            "Apply Nielsen's 10 Usability Heuristics to critique and improve digital products.",
            "Design accessible interfaces complying with WCAG 2.1 AA contrast and navigation standards.",
            "Construct clear Information Architecture (IA) and frictionless user task flows."
          ],
          importantConcepts: [
            {
              concept: "Jakob's Law",
              explanation: "Users spend most of their time on other sites. This means that users prefer your site to work the same way as all the other sites they already know."
            },
            {
              concept: "Hick's Law",
              explanation: "The time it takes to make a decision increases logarithmically with the number and complexity of choices presented to the user."
            },
            {
              concept: "Fitts's Law",
              explanation: "The time to acquire a target is a function of the distance to and size of the target. Make primary action buttons large and easy to reach."
            },
            {
              concept: "WCAG 2.1 Contrast Ratio",
              explanation: "Text must maintain a minimum contrast ratio of 4.5:1 against its background for normal text and 3:1 for large text to ensure readability for visually impaired users."
            }
          ],
          detailedExplanations: [
            {
              title: "1. Nielsen's 10 Usability Heuristics in Action",
              content: "Jakob Nielsen's usability heuristics are ten general principles for interaction design. They are called 'heuristics' because they are broad rules of thumb rather than specific usability guidelines.\n\n1. Visibility of System Status: Always keep users informed through appropriate feedback within reasonable time (e.g. progress bars, loading indicators).\n2. Match between System and Real World: Use words, phrases, and concepts familiar to the user rather than internal technical jargon.\n3. User Control & Freedom: Provide a clearly marked 'emergency exit' to leave unwanted states without an extended process (e.g. Undo/Redo actions).",
              snippet: "/* WCAG Accessible Button Design Token Example */\n.btn-primary {\n  background-color: #004ac6; /* High contrast blue */\n  color: #ffffff;            /* 8.5:1 Contrast Ratio (AAA) */\n  min-height: 48px;          /* Fitts's Law Touch Target Size */\n  padding: 12px 24px;\n  border-radius: 12px;\n}",
              language: "css"
            },
            {
              title: "2. Information Architecture (IA) & Card Sorting",
              content: "Information Architecture structures, labels, and organizes content so users can find information and complete tasks intuitively. Card sorting is a research technique where participants organize topics into categories that make sense to them, informing navigation structures."
            }
          ],
          realWorldExamples: [
            "E-commerce Checkout: Simplifying multi-step checkouts into clear progress bars (Visibility of System Status) with one-click payment options (Hick's Law).",
            "Mobile App Navigation: Placing main CTA buttons at the bottom of the smartphone screen within natural thumb reach (Fitts's Law)."
          ],
          bestPractices: [
            "Always design for accessibility first (color contrast, screen-reader labels, minimum 48px touch targets).",
            "Keep navigation consistent across all viewports and screen sizes.",
            "Conduct usability heuristic evaluations before launching prototypes."
          ],
          commonMistakes: [
            {
              mistake: "Designing for aesthetic appeal at the expense of usability and contrast.",
              solution: "Validate design tokens against WCAG contrast checkers (minimum 4.5:1 contrast)."
            },
            {
              mistake: "Overwhelming users with too many options on a single screen.",
              solution: "Apply Hick's Law: Progressive disclosure—show only essential choices first, revealing advanced options on demand."
            }
          ],
          keyPoints: [
            "UX is about user problem-solving and task friction reduction, not just visual aesthetics.",
            "WCAG 2.1 compliance is a strict requirement for enterprise digital products.",
            "Jakob's Law dictates that familiar UX patterns reduce cognitive load."
          ]
        },
        practicalRelevance: "UI/UX Designers apply these principles daily in Figma when planning site navigation, establishing layout grids, choosing accessible color palettes, and optimizing checkout or onboarding flows to maximize user conversion and retention.",
        interviewRelevance: {
          summary: "Expect questions on usability heuristics, design decisions, and accessibility standards during portfolio reviews.",
          commonQuestions: [
            {
              question: "Walk me through how you applied Nielsen's Usability Heuristics in a recent project.",
              idealAnswer: "I explain how I identified usability friction during a heuristic evaluation—such as unclear system status during file uploads—and resolved it by adding live progress indicators and clear error recovery paths (User Control & Freedom)."
            },
            {
              question: "How do you ensure your UI designs meet WCAG accessibility requirements?",
              idealAnswer: "I audit color tokens using contrast plugins to ensure 4.5:1 ratio, specify minimum 48x48px touch targets for mobile, and define focus states and screen-reader semantics for developers during handoff."
            }
          ]
        },
        quiz: [
          {
            id: "q-uiux-01-1",
            question: "Which law states that the time to make a decision increases with the number and complexity of choices?",
            options: ["Fitts's Law", "Hick's Law", "Jakob's Law", "Miller's Law"],
            correctAnswer: "Hick's Law",
            explanation: "Hick's Law models decision-time as a logarithmic function of the number of choices presented."
          },
          {
            id: "q-uiux-01-2",
            question: "What is the minimum WCAG 2.1 AA contrast ratio required for normal body text against its background?",
            options: ["2:1", "3:1", "4.5:1", "7:1"],
            correctAnswer: "4.5:1",
            explanation: "WCAG 2.1 AA requires at least 4.5:1 contrast ratio for standard text to ensure visual accessibility."
          },
          {
            id: "q-uiux-01-3",
            question: "According to Fitts's Law, how can you improve button usability on mobile screens?",
            options: ["Make buttons smaller to save space", "Increase button touch target size and place them within thumb reach", "Hide buttons inside hamburger menus", "Use low-contrast colors"],
            correctAnswer: "Increase button touch target size and place them within thumb reach",
            explanation: "Fitts's Law shows that larger targets closer to the user's natural pointer/thumb position require less time and effort to hit."
          }
        ]
      },
      {
        id: "uiux-mod-02",
        number: "UX-02",
        name: "User Research & Personas",
        topic: "User Research & Insights",
        requiredSkill: "User Research & Personas",
        difficulty: "Intermediate",
        estimatedTime: "4.0 hrs",
        toolsAndTech: ["Figma", "UserTesting", "Maze", "Typeform", "Notion"],
        topics: [
          "Qualitative vs Quantitative User Research",
          "Empathy Maps & User Personas",
          "User Journey Mapping & Pain Point Identification",
          "Usability Testing & Feedback Synthesis"
        ],
        theoryContent: {
          overview: "User Research focuses on understanding user behaviors, needs, and motivations through observation techniques, task analysis, and feedback methodologies.",
          learningObjectives: [
            "Distinguish between generative qualitative research and evaluative quantitative research.",
            "Create data-driven User Personas and Empathy Maps representing target audiences.",
            "Construct User Journey Maps identifying friction points and feature opportunities.",
            "Plan and execute unmoderated and moderated usability testing sessions."
          ],
          importantConcepts: [
            {
              concept: "Qualitative Research",
              explanation: "In-depth exploratory research (interviews, field studies) answering 'Why' and 'How' users behave."
            },
            {
              concept: "Quantitative Research",
              explanation: "Measurable metrics (surveys, analytics, bounce rates) answering 'How many' and 'How much'."
            },
            {
              concept: "User Journey Map",
              explanation: "A visual timeline detailing the stages, touchpoints, thoughts, emotions, and pain points a user experiences while achieving a goal."
            }
          ],
          detailedExplanations: [
            {
              title: "1. Building Data-Driven User Personas",
              content: "A persona is a semi-fictional representation of your ideal customer based on real data and research. A robust persona includes: Demographics, Goals/Motivations, Frustrations/Pain Points, Tech Tech Literacy, and Key Behaviors."
            }
          ],
          realWorldExamples: [
            "Fintech App Onboarding: Interviewing 20 users who abandoned sign-up to discover that identity verification was causing high anxiety, leading to a redesigned, step-by-step progress flow."
          ],
          bestPractices: [
            "Base personas on empirical user interview data rather than team assumptions.",
            "Synthesize interview notes into affinity maps to uncover recurring themes."
          ],
          commonMistakes: [
            {
              mistake: "Creating idealized 'proto-personas' without speaking to actual users.",
              solution: "Validate all persona pain points with at least 5-8 user interviews."
            }
          ],
          keyPoints: [
            "Research prevents teams from building features nobody wants.",
            "Usability testing with 5 users reveals ~85% of usability issues."
          ]
        },
        practicalRelevance: "Ensures UI designers build features that solve real user pain points rather than relying on gut feelings.",
        interviewRelevance: {
          summary: "Hiring managers evaluate whether your design decisions are backed by user research and testing metrics.",
          commonQuestions: [
            {
              question: "How do you handle a situation where a stakeholder disagrees with your user research findings?",
              idealAnswer: "I present user testing video clips and quantitative metrics from Maze/Analytics, framing design iterations around business goals and user task success rates."
            }
          ]
        },
        quiz: [
          {
            id: "q-uiux-02-1",
            question: "How many usability test participants are typically required to uncover 85% of usability issues according to Jakob Nielsen?",
            options: ["1 participant", "5 participants", "50 participants", "500 participants"],
            correctAnswer: "5 participants",
            explanation: "Testing with 5 representative users uncovers approximately 85% of core usability flaws in an interface."
          }
        ]
      },
      {
        id: "uiux-mod-03",
        number: "UX-03",
        name: "Wireframing & Prototyping in Figma",
        topic: "Wireframing, Component Libraries & Prototyping",
        requiredSkill: "Wireframing & Prototyping",
        difficulty: "Intermediate",
        estimatedTime: "5.0 hrs",
        toolsAndTech: ["Figma", "Principle", "Protopie", "Storybook"],
        topics: [
          "Low-Fidelity vs High-Fidelity Wireframes",
          "Figma Auto Layout 5.0 & Responsive Components",
          "Design Systems & Component Variants",
          "Interactive Micro-animations & Handoff"
        ],
        theoryContent: {
          overview: "Wireframing and Prototyping bridge conceptual design and front-end implementation. Low-fidelity wireframes test structural flow, while high-fidelity prototypes model visual hierarchy and component interactions.",
          learningObjectives: [
            "Master Figma Auto-Layout, Constraints, and Resizing properties.",
            "Build scalable Design Systems using Tokens, Components, and Variants.",
            "Create realistic interactive prototypes with smart-animate transitions.",
            "Execute seamless Developer Handoff with detailed spec documentation."
          ],
          importantConcepts: [
            {
              concept: "Auto Layout",
              explanation: "Figma property that creates dynamic containers that grow or shrink automatically based on content and responsive breakpoint constraints."
            },
            {
              concept: "Design Tokens",
              explanation: "Agreed-upon visual values (colors, typography, spacing, shadows) stored as variables shared between Figma and code repositories."
            }
          ],
          detailedExplanations: [
            {
              title: "1. Constructing Scalable Component Design Systems",
              content: "Atomic Design methodology divides interfaces into Atoms (buttons, inputs), Molecules (form groups), Organisms (header nav), Templates, and Pages. Storing states (Default, Hover, Focused, Disabled, Loading) as Figma Component Variants streamlines design updates across large applications.",
              snippet: "/* Design Token JSON Structure */\n{\n  \"color\": {\n    \"brand\": { \"primary\": { \"value\": \"#004ac6\" } },\n    \"neutral\": { \"surface\": { \"value\": \"#0d1b2e\" } }\n  },\n  \"spacing\": {\n    \"md\": { \"value\": \"16px\" }\n  }\n}",
              language: "json"
            }
          ],
          realWorldExamples: [
            "Enterprise Design System: Building a multi-brand component library used by 50+ engineers, reducing frontend development time by 40%."
          ],
          bestPractices: [
            "Use Auto Layout on all component variants to ensure responsive flexibility.",
            "Store color and typography styles as Design Tokens for developer handoff."
          ],
          commonMistakes: [
            {
              mistake: "Creating static, unconstrained frames that break when text or screen size changes.",
              solution: "Apply Auto Layout with Hug and Fill container rules."
            }
          ],
          keyPoints: [
            "Components and Variants drastically increase design velocity and team consistency.",
            "Developer handoff documentation should include component states, token values, and responsive constraints."
          ]
        },
        practicalRelevance: "Essential skill for creating interactive mockups and design systems that software developers can easily translate into code.",
        interviewRelevance: {
          summary: "Figma technical skills and design system architecture are tested in portfolio walkthroughs and whiteboard challenges.",
          commonQuestions: [
            {
              question: "How do you structure component variants and auto-layout in Figma for developer handoff?",
              idealAnswer: "I use Atomic Design, mapping Figma Component Variants to props (variant, size, state) matching React component definitions, and publish Tokens using Figma variables."
            }
          ]
        },
        quiz: [
          {
            id: "q-uiux-03-1",
            question: "In Figma, which property allows a container to dynamically resize when its child text changes?",
            options: ["Fixed Width", "Auto Layout (Hug Contents)", "Clip Content", "Mask"],
            correctAnswer: "Auto Layout (Hug Contents)",
            explanation: "Auto Layout with 'Hug Contents' instructs the container boundary to adjust dynamically around internal child elements."
          }
        ]
      }
    ]
  },

  "Software Developer": {
    role: "Software Developer",
    description: "Build robust, scalable software applications covering Data Structures, OOP, Databases, APIs, Git, Testing, and System Design.",
    requiredSkills: ["Data Structures & Algorithms", "OOP & Design Patterns", "Database Management (SQL/NoSQL)", "Web Development & REST APIs", "Git & CI/CD", "Software Testing & QA", "System Design & Scalability"],
    recommendedModules: [
      {
        id: "dev-mod-01",
        number: "DEV-01",
        name: "Data Structures & Algorithm Complexity",
        topic: "Data Structures & Complexity Analysis",
        requiredSkill: "Data Structures & Algorithms",
        difficulty: "Intermediate",
        estimatedTime: "6.0 hrs",
        toolsAndTech: ["Java", "Python", "C++", "JavaScript", "LeetCode"],
        topics: [
          "Big O Notation (Time & Space Complexity)",
          "Arrays, Two Pointers & Sliding Window",
          "Hash Tables & Collision Resolution",
          "Trees, BST & Graph Traversals (BFS/DFS)",
          "Dynamic Programming & Memoization"
        ],
        theoryContent: {
          overview: "Data Structures and Algorithms form the foundation of efficient software engineering. This module covers memory management, algorithmic complexity bounds, linear data structures, tree/graph algorithms, and optimization paradigms.",
          learningObjectives: [
            "Master asymptotic notation bounds (O, Ω, Θ) for time and auxiliary space complexity.",
            "Apply Two-Pointer and Sliding Window techniques to solve linear array queries in O(N) time.",
            "Implement Hash Table lookup algorithms and collision resolution strategies.",
            "Execute Tree and Graph traversals (BFS, DFS, Dijkstra) for pathfinding and optimization.",
            "Construct Dynamic Programming solutions using top-down memoization and bottom-up tabulation."
          ],
          importantConcepts: [
            {
              concept: "Big O Notation",
              explanation: "A mathematical notation describing the limiting behavior of a function when the argument tends towards infinity, representing upper-bound algorithmic complexity."
            },
            {
              concept: "Hash Table O(1) Lookup",
              explanation: "Key-value mapping using a hash function to compute array bucket indices, achieving average-case constant time operations."
            },
            {
              concept: "Dynamic Programming (DP)",
              explanation: "An optimization technique that solves complex problems by breaking them into overlapping subproblems and storing subproblem results to avoid redundant work."
            }
          ],
          detailedExplanations: [
            {
              title: "1. Two Pointers & Sliding Window Pattern",
              content: "Linear scanning patterns optimize brute-force O(N^2) nested loops into optimal O(N) single-pass solutions.\n\n• Opposite Direction Pointers: Used on sorted arrays (e.g. Two Sum, Container With Most Water).\n• Sliding Window: Maintains a window bounds [left...right] over contiguous subarrays (e.g. Longest Substring Without Repeating Characters).",
              snippet: "// Optimal Sliding Window: Longest Substring Without Repeating Characters\nfunction lengthOfLongestSubstring(s) {\n  let charMap = new Map();\n  let maxLen = 0, left = 0;\n  for (let right = 0; right < s.length; right++) {\n    if (charMap.has(s[right])) {\n      left = Math.max(left, charMap.get(s[right]) + 1);\n    }\n    charMap.set(s[right], right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n} // Time: O(N), Space: O(min(N, M))",
              language: "javascript"
            },
            {
              title: "2. Graph Traversals: BFS vs DFS",
              content: "Graphs model network relationships. Breadth-First Search (BFS) explores neighbor nodes layer-by-layer using a Queue, guaranteeing shortest path distances in unweighted graphs. Depth-First Search (DFS) explores as deep as possible along branches using a Stack or recursion."
            }
          ],
          realWorldExamples: [
            "GPS Navigation & Google Maps: Using Dijkstra's/A* search graph algorithms to compute shortest driving routes.",
            "Database Indexing: B-Trees and Hash Indexes enabling sub-millisecond query lookups across millions of database records."
          ],
          bestPractices: [
            "Always analyze runtime time and auxiliary memory space before choosing a data structure.",
            "Use hash maps for instant key lookups instead of nested array loops."
          ],
          commonMistakes: [
            {
              mistake: "Using naive recursion for overlapping subproblems causing exponential O(2^N) runtime.",
              solution: "Apply Memoization or Tabulation to cache subproblem results, reducing complexity to O(N)."
            }
          ],
          keyPoints: [
            "Data structures organize memory; algorithms process data efficiently.",
            "Mastering Space vs Time trade-offs is crucial for technical interviews and production scale."
          ]
        },
        practicalRelevance: "Directly applied in daily engineering tasks when optimizing database query performance, building scalable data pipelines, and designing low-latency backend systems.",
        interviewRelevance: {
          summary: "Core requirement for all software engineering technical interviews and algorithmic coding rounds.",
          commonQuestions: [
            {
              question: "How do you choose between BFS and DFS for searching a graph?",
              idealAnswer: "I choose BFS when looking for the shortest path in unweighted graphs or level-order relationships. I choose DFS when memory is constrained or when exploring all decision paths/backtracking."
            }
          ]
        },
        quiz: [
          {
            id: "q-dev-01-1",
            question: "What is the average-case time complexity for search operations in a Hash Map?",
            options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
            correctAnswer: "O(1)",
            explanation: "Hash maps compute key hash indices directly, achieving average-case constant time O(1) operations."
          },
          {
            id: "q-dev-01-2",
            question: "Which algorithm guarantees finding the shortest path in an unweighted graph?",
            options: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Pre-Order Traversal", "Binary Search"],
            correctAnswer: "Breadth-First Search (BFS)",
            explanation: "BFS explores nodes layer by layer outward from the source node, making it optimal for unweighted shortest path calculation."
          }
        ]
      },
      {
        id: "dev-mod-02",
        number: "DEV-02",
        name: "Object-Oriented Programming & SOLID Principles",
        topic: "OOP, Clean Code & SOLID Design",
        requiredSkill: "OOP & Design Patterns",
        difficulty: "Intermediate",
        estimatedTime: "4.5 hrs",
        toolsAndTech: ["Java", "TypeScript", "C#", "Python"],
        topics: [
          "4 Pillars of OOP (Encapsulation, Inheritance, Polymorphism, Abstraction)",
          "SOLID Principles Deep Dive",
          "Design Patterns (Factory, Singleton, Observer, Strategy)",
          "Clean Code & Refactoring Techniques"
        ],
        theoryContent: {
          overview: "Object-Oriented Programming (OOP) and SOLID design principles enable engineers to write modular, maintainable, and testable codebases that scale seamlessly across development teams.",
          learningObjectives: [
            "Implement the 4 pillars of Object-Oriented Design.",
            "Apply SOLID principles to eliminate code rigidity and fragility.",
            "Utilize Gang of Four (GoF) design patterns to solve common architectural challenges.",
            "Refactor monolithic functions into clean, decoupled classes."
          ],
          importantConcepts: [
            {
              concept: "Single Responsibility Principle (SRP)",
              explanation: "A class should have one, and only one, reason to change—meaning it should possess only one job or responsibility."
            },
            {
              concept: "Open/Closed Principle (OCP)",
              explanation: "Software entities (classes, modules, functions) should be open for extension, but closed for modification."
            },
            {
              concept: "Dependency Inversion Principle (DIP)",
              explanation: "High-level modules should not depend on low-level modules; both should depend on abstractions (interfaces)."
            }
          ],
          detailedExplanations: [
            {
              title: "1. SOLID Principles in Action",
              content: "SOLID represents 5 design principles for maintainable object-oriented software:\n\n• S - Single Responsibility\n• O - Open/Closed\n• L - Liskov Substitution\n• I - Interface Segregation\n• D - Dependency Inversion",
              snippet: "// Dependency Inversion Principle (DIP) Example in TypeScript\ninterface PaymentProcessor {\n  pay(amount: number): Promise<boolean>;\n}\n\nclass StripeProcessor implements PaymentProcessor {\n  async pay(amount: number) { return true; }\n}\n\nclass CheckoutService {\n  constructor(private paymentProcessor: PaymentProcessor) {} // Injected abstraction\n  async completeOrder(price: number) {\n    return await this.paymentProcessor.pay(price);\n  }\n}",
              language: "typescript"
            }
          ],
          realWorldExamples: [
            "E-commerce Payment Gateway: Swapping payment providers (Stripe vs PayPal) seamlessly without modifying core Checkout business logic by injecting a common PaymentProcessor interface."
          ],
          bestPractices: [
            "Favor composition over inheritance to avoid brittle deep class hierarchies.",
            "Program to interfaces, not concrete implementations."
          ],
          commonMistakes: [
            {
              mistake: "Creating 'God Classes' that handle database access, business logic, and API formatting simultaneously.",
              solution: "Break monolithic classes into dedicated services following SRP."
            }
          ],
          keyPoints: [
            "SOLID principles reduce technical debt and make software resilient to changing requirements.",
            "Design patterns provide proven vocabularies for structural challenges."
          ]
        },
        practicalRelevance: "Crucial for writing enterprise backend code that is easy to extend, test with unit tests, and maintain without breaking existing features.",
        interviewRelevance: {
          summary: "Frequently assessed in Low-Level Design (LLD) and Object-Oriented Design (OOD) interview rounds.",
          commonQuestions: [
            {
              question: "Explain the Dependency Inversion Principle with an example.",
              idealAnswer: "DIP states that high-level modules should depend on interfaces rather than concrete implementations. For example, a NotificationService depends on a MessageSender interface rather than directly instantiating a MailchimpSender class."
            }
          ]
        },
        quiz: [
          {
            id: "q-dev-02-1",
            question: "Which SOLID principle states that software entities should be open for extension but closed for modification?",
            options: ["Single Responsibility Principle", "Open/Closed Principle", "Liskov Substitution Principle", "Interface Segregation Principle"],
            correctAnswer: "Open/Closed Principle",
            explanation: "The Open/Closed Principle allows system behavior to be extended through polymorphism without altering existing source code."
          }
        ]
      },
      {
        id: "dev-mod-03",
        number: "DEV-03",
        name: "Database Management Systems (SQL & NoSQL)",
        topic: "DBMS, SQL Queries & NoSQL Schema Design",
        requiredSkill: "Database Management (SQL/NoSQL)",
        difficulty: "Intermediate",
        estimatedTime: "5.5 hrs",
        toolsAndTech: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma"],
        topics: [
          "Relational Database Design & ER Diagrams",
          "SQL Joins, Aggregations & Indexing",
          "ACID Transactions & Concurrency Control",
          "NoSQL MongoDB Document Design & Aggregation Pipeline"
        ],
        theoryContent: {
          overview: "Data management is core to all enterprise applications. This module covers Relational Database Management Systems (RDBMS), SQL query optimization, ACID compliance, and NoSQL document modeling.",
          learningObjectives: [
            "Design normalized relational database schemas up to 3NF.",
            "Write complex SQL queries utilizing Joins, Group By, Subqueries, and Window Functions.",
            "Understand Database Indexing (B-Tree, Hash Index) for O(log N) lookup optimization.",
            "Model document schemas in MongoDB using embedding vs referencing paradigms."
          ],
          importantConcepts: [
            {
              concept: "ACID Properties",
              explanation: "Atomicity, Consistency, Isolation, and Durability guarantee reliable execution of database transactions even during power failures or system crashes."
            },
            {
              concept: "Database Indexing",
              explanation: "A data structure (usually a B-Tree) that improves the speed of data retrieval operations on a database table at the cost of additional write overhead and storage space."
            }
          ],
          detailedExplanations: [
            {
              title: "1. Relational Joins vs Indexing Optimization",
              content: "SQL Joins combine rows from two or more tables based on a related column between them.\n\n• INNER JOIN: Returns records with matching values in both tables.\n• LEFT JOIN: Returns all records from the left table and matched records from the right.\n• Database Indexing: Without an index, the database engine performs a full table scan O(N). With a B-Tree index, index traversal takes O(log N) operations.",
              snippet: "-- SQL Query with Indexing and Group By Aggregation\nSELECT \n  c.category_name, \n  COUNT(p.id) AS total_products, \n  AVG(p.price) AS avg_price\nFROM categories c\nINNER JOIN products p ON c.id = p.category_id\nWHERE p.status = 'ACTIVE'\nGROUP BY c.category_name\nHAVING COUNT(p.id) > 5\nORDER BY avg_price DESC;",
              language: "sql"
            }
          ],
          realWorldExamples: [
            "Banking Transactions: Enforcing ACID Atomicity to guarantee that money deducted from Account A is atomically credited to Account B, or completely rolled back if an error occurs."
          ],
          bestPractices: [
            "Always create database indexes on columns frequently used in WHERE, JOIN, and ORDER BY clauses.",
            "Avoid SELECT * queries; retrieve only explicit required columns."
          ],
          commonMistakes: [
            {
              mistake: "Over-indexing tables leading to severe write performance degradation.",
              solution: "Index selectively based on slow query logs and EXPLAIN ANALYZE execution paths."
            }
          ],
          keyPoints: [
            "SQL is ideal for structured data requiring strong consistency; NoSQL is ideal for unstructured or rapidly changing document schemas.",
            "Indexes speed up reads but slow down writes."
          ]
        },
        practicalRelevance: "Essential for designing backend data models, crafting performant database queries, and ensuring data integrity across high-traffic platforms.",
        interviewRelevance: {
          summary: "SQL query writing and schema design are standard topics in technical interviews.",
          commonQuestions: [
            {
              question: "What is the difference between WHERE and HAVING in SQL?",
              idealAnswer: "WHERE filters rows before any groupings are applied. HAVING filters aggregated group results after the GROUP BY clause."
            }
          ]
        },
        quiz: [
          {
            id: "q-dev-03-1",
            question: "Which ACID property guarantees that all operations in a database transaction complete successfully, or all are rolled back?",
            options: ["Atomicity", "Consistency", "Isolation", "Durability"],
            correctAnswer: "Atomicity",
            explanation: "Atomicity ensures 'all-or-nothing' execution of transaction steps."
          }
        ]
      },
      {
        id: "dev-mod-04",
        number: "DEV-04",
        name: "Web Development & RESTful API Architecture",
        topic: "Web Architecture, REST APIs & HTTP Protocol",
        requiredSkill: "Web Development & REST APIs",
        difficulty: "Intermediate",
        estimatedTime: "5.0 hrs",
        toolsAndTech: ["Express.js", "Node.js", "Postman", "Swagger", "FastAPI"],
        topics: [
          "HTTP Request/Response Lifecycle & Status Codes",
          "REST Architectural Constraints & Resource Naming",
          "Authentication: JWT, OAuth2 & Session Cookies",
          "CORS, Rate Limiting & Web Security Fundamentals"
        ],
        theoryContent: {
          overview: "Web development relies on client-server communications over the HTTP protocol. This module covers REST API design, HTTP verbs, status codes, authentication protocols, and web security.",
          learningObjectives: [
            "Understand HTTP/1.1 and HTTP/2 protocols, headers, and status code families.",
            "Design RESTful API endpoints adhering to resource-oriented architecture principles.",
            "Implement stateless authentication using JSON Web Tokens (JWT) and HTTPS.",
            "Apply security middleware for Rate Limiting, CORS, and Input Validation."
          ],
          importantConcepts: [
            {
              concept: "REST (Representational State Transfer)",
              explanation: "A stateless, client-server architectural style that uses standard HTTP methods (GET, POST, PUT, DELETE) to manipulate resource URIs."
            },
            {
              concept: "JWT (JSON Web Token)",
              explanation: "A compact, URL-safe means of representing claims to be transferred between two parties, digitally signed using a secret key or RSA pair."
            }
          ],
          detailedExplanations: [
            {
              title: "1. Designing RESTful API Endpoints",
              content: "RESTful URIs should represent nouns (resources) rather than verbs (actions):\n\n• GET /api/v1/users - Retrieve user list\n• POST /api/v1/users - Create new user\n• GET /api/v1/users/:id - Fetch single user\n• PUT /api/v1/users/:id - Replace user resource\n• DELETE /api/v1/users/:id - Remove user resource",
              snippet: "// Express.js REST Endpoint with Input Validation & JWT Protection\nconst express = require('express');\nconst router = express.Router();\n\nrouter.post('/api/v1/orders', authenticateToken, async (req, res) => {\n  const { items, shippingAddress } = req.body;\n  if (!items || items.length === 0) {\n    return res.status(400).json({ error: 'Order items are required' });\n  }\n  const newOrder = await createOrder(req.user.id, items, shippingAddress);\n  return res.status(201).json({ success: true, data: newOrder });\n});",
              language: "javascript"
            }
          ],
          realWorldExamples: [
            "Stripe API: Industry-standard RESTful API using explicit HTTP status codes (200 OK, 400 Bad Request, 401 Unauthorized, 429 Too Many Requests) and JSON payloads."
          ],
          bestPractices: [
            "Use plural nouns for resource endpoints (/api/v1/products).",
            "Always return proper HTTP status codes matching transaction outcomes."
          ],
          commonMistakes: [
            {
              mistake: "Using verbs in URIs like /api/getUserData or /api/deleteItem.",
              solution: "Use HTTP verbs (GET, DELETE) with resource nouns (/api/users, /api/items/:id)."
            }
          ],
          keyPoints: [
            "REST APIs must be stateless; each request contains all context needed for processing.",
            "JWTs enable scalable stateless authentication."
          ]
        },
        practicalRelevance: "Essential for building backend microservices, frontend-backend integrations, and public third-party APIs.",
        interviewRelevance: {
          summary: "REST API design and HTTP fundamentals are core topics in backend coding interviews.",
          commonQuestions: [
            {
              question: "What is the difference between PUT and PATCH in REST APIs?",
              idealAnswer: "PUT replaces the entire target resource with the request payload. PATCH applies a partial modification to the existing resource."
            }
          ]
        },
        quiz: [
          {
            id: "q-dev-04-1",
            question: "Which HTTP status code should be returned when a client attempts to access a protected resource without valid authentication credentials?",
            options: ["200 OK", "400 Bad Request", "401 Unauthorized", "404 Not Found"],
            correctAnswer: "401 Unauthorized",
            explanation: "401 Unauthorized explicitly indicates missing or invalid authentication credentials."
          }
        ]
      },
      {
        id: "dev-mod-05",
        number: "DEV-05",
        name: "System Design & Distributed Scalability",
        topic: "System Design, Load Balancing & Distributed Architecture",
        requiredSkill: "System Design & Scalability",
        difficulty: "Advanced",
        estimatedTime: "6.0 hrs",
        toolsAndTech: ["Nginx", "Redis", "Kafka", "Docker", "AWS S3"],
        topics: [
          "Vertical vs Horizontal Scaling & Load Balancing",
          "Caching Strategies (In-Memory Redis & Content Delivery Networks)",
          "Database Sharding, Replication & CAP Theorem",
          "Asynchronous Message Queues (Kafka & RabbitMQ)"
        ],
        theoryContent: {
          overview: "System Design covers building large-scale distributed applications capable of serving millions of concurrent requests while maintaining low latency, high availability, and fault tolerance.",
          learningObjectives: [
            "Analyze vertical vs horizontal scaling trade-offs.",
            "Design distributed caching layers using Redis and CDNs (Cache-Aside, Write-Through).",
            "Apply the CAP Theorem (Consistency, Availability, Partition Tolerance) to system choices.",
            "Decouple services using asynchronous event-driven message queues."
          ],
          importantConcepts: [
            {
              concept: "CAP Theorem",
              explanation: "A distributed data store can simultaneously provide at most two out of three guarantees: Consistency, Availability, and Partition Tolerance."
            },
            {
              concept: "Load Balancer",
              explanation: "A reverse proxy that distributes incoming network traffic across multiple backend servers to prevent any single server from becoming a bottleneck."
            }
          ],
          detailedExplanations: [
            {
              title: "1. Caching Strategies: Redis Cache-Aside Pattern",
              content: "Caching stores copies of frequently accessed data in fast in-memory storage (e.g. Redis) to bypass expensive database queries.\n\nCache-Aside Pattern:\n1. Application checks Redis cache for key.\n2. If Cache Hit: Return data immediately.\n3. If Cache Miss: Query SQL database, write result to Redis with TTL (Time To Live), and return data to user.",
              snippet: "// Cache-Aside Pattern Implementation\nasync function getProductDetail(productId) {\n  const cacheKey = `product:${productId}`;\n  const cached = await redis.get(cacheKey);\n  if (cached) return JSON.parse(cached); // Cache Hit\n\n  const product = await db.products.findById(productId); // Cache Miss\n  if (product) {\n    await redis.set(cacheKey, JSON.stringify(product), 'EX', 3600); // 1 hour TTL\n  }\n  return product;\n}",
              language: "javascript"
            }
          ],
          realWorldExamples: [
            "Netflix Streaming: Utilizing CDNs to cache video content close to end-users geographically, drastically reducing latency and backbone bandwidth."
          ],
          bestPractices: [
            "Set explicit TTL (Time-to-Live) expiry on all cached entries to prevent stale data.",
            "Use message queues (Kafka) for asynchronous heavy background tasks like sending emails or processing video encoding."
          ],
          commonMistakes: [
            {
              mistake: "Relying solely on database vertical scaling (bigger CPU/RAM) instead of horizontal scaling with load balancers.",
              solution: "Design stateless API servers behind a load balancer to scale horizontally by adding instances."
            }
          ],
          keyPoints: [
            "Stateless API servers make horizontal scaling trivial.",
            "Caching reduces database read pressure by 90%+ in read-heavy applications."
          ]
        },
        practicalRelevance: "Essential for senior software engineering roles and designing high-traffic web applications.",
        interviewRelevance: {
          summary: "System Design interviews evaluate your ability to design scalable architectures (e.g., 'Design URL Shortener', 'Design Twitter/WhatsApp').",
          commonQuestions: [
            {
              question: "How would you design a URL Shortener like Bitly to handle 10,000 requests per second?",
              idealAnswer: "I would use a stateless REST API behind an Nginx load balancer, a Base62 encoding algorithm for 7-character short keys, a Redis caching layer for top URLs (Cache-Aside), and a sharded MongoDB/NoSQL database for key-url mappings."
            }
          ]
        },
        quiz: [
          {
            id: "q-dev-05-1",
            question: "According to the CAP Theorem, which two properties do traditional SQL databases choose during a network partition?",
            options: ["Consistency & Availability (CA)", "Consistency & Partition Tolerance (CP)", "Availability & Partition Tolerance (AP)", "Speed & Storage"],
            correctAnswer: "Consistency & Partition Tolerance (CP)",
            explanation: "In a network partition (P), traditional RDBMS sacrifice availability (A) to guarantee strict data consistency (C)."
          }
        ]
      }
    ]
  },

  "Frontend Developer": {
    role: "Frontend Developer",
    description: "Build modern, responsive, high-performance web applications using HTML5, CSS3, JavaScript ES6+, React 19, and web performance tooling.",
    requiredSkills: ["Web Fundamentals (HTML/CSS/JS)", "React 19 & State Management", "UI/UX Principles for Frontend", "Web Performance & Optimization", "Frontend Testing & Tools"],
    recommendedModules: [
      {
        id: "fe-mod-01",
        number: "FE-01",
        name: "HTML5, CSS3 & JavaScript ES6+ Core",
        topic: "Frontend Foundations & Modern JavaScript",
        requiredSkill: "Web Fundamentals (HTML/CSS/JS)",
        difficulty: "Beginner",
        estimatedTime: "4.0 hrs",
        toolsAndTech: ["HTML5", "CSS3", "JavaScript ES6+", "Tailwind CSS"],
        topics: [
          "Semantic HTML5 & Accessibility (ARIA)",
          "CSS Flexbox, Grid & Responsive Media Queries",
          "JS Event Loop, Closures & Asynchronous Promises",
          "DOM Manipulation & Browser Event Delegation"
        ],
        theoryContent: {
          overview: "Frontend engineering relies on the core triad of HTML5 for structure, CSS3 for layout and styling, and JavaScript ES6+ for dynamic interactive behavior.",
          learningObjectives: [
            "Build semantic, accessible web pages adhering to HTML5 standards.",
            "Construct responsive layouts using CSS Flexbox and Grid without external libraries.",
            "Master JavaScript event loop execution, closures, higher-order functions, and Async/Await.",
            "Perform efficient DOM manipulation and event delegation."
          ],
          importantConcepts: [
            {
              concept: "Event Loop",
              explanation: "The mechanism that allows JavaScript (a single-threaded language) to perform non-blocking I/O operations by offloading tasks to the browser Web APIs."
            },
            {
              concept: "Closure",
              explanation: "A function bundled together with references to its surrounding state (lexical environment), allowing inner functions to access outer scope variables even after outer function execution finishes."
            }
          ],
          detailedExplanations: [
            {
              title: "1. Master Async/Await & Promises",
              content: "Promises handle asynchronous operations cleanly without callback hell.\n\nAsync/Await is syntactic sugar over Promises, making asynchronous code look synchronous.",
              snippet: "// Fetch API with Async/Await & Error Handling\nasync function fetchUserData(userId) {\n  try {\n    const response = await fetch(`https://api.example.com/users/${userId}`);\n    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Fetch Failed:', error);\n    throw error;\n  }\n}",
              language: "javascript"
            }
          ],
          realWorldExamples: [
            "Infinite Scroll Feed: Attaching an IntersectionObserver event listener to detect when a user scrolls to the bottom of a page, triggering an async fetch."
          ],
          bestPractices: [
            "Use semantic HTML tags (<main>, <nav>, <article>, <header>) instead of generic <div> tags.",
            "Use CSS Flexbox for 1D layouts and CSS Grid for 2D multi-row layouts."
          ],
          commonMistakes: [
            {
              mistake: "Blocking the main UI thread with heavy synchronous loops.",
              solution: "Offload computational tasks using Web Workers or chunk execution using requestAnimationFrame/setTimeout."
            }
          ],
          keyPoints: [
            "JavaScript is single-threaded and event-driven.",
            "Semantic HTML improves SEO and screen-reader accessibility."
          ]
        },
        practicalRelevance: "The foundation of all web application development.",
        interviewRelevance: {
          summary: "Every frontend interview tests JS core concepts (closures, event loop, promises, prototypes).",
          commonQuestions: [
            {
              question: "Explain the JavaScript Event Loop and Microtask Queue vs Macrotask Queue.",
              idealAnswer: "The event loop continuously checks if the Call Stack is empty. Promises (.then/await) enter the Microtask Queue which executes immediately after the current stack frame, before Macrotasks (setTimeout, setInterval) in the Task Queue."
            }
          ]
        },
        quiz: [
          {
            id: "q-fe-01-1",
            question: "Which queue takes priority execution immediately after the current call stack completes?",
            options: ["Macrotask Queue", "Microtask Queue (Promises)", "Timer Queue", "Animation Frame Queue"],
            correctAnswer: "Microtask Queue (Promises)",
            explanation: "Microtasks (Promise callbacks, queueMicrotask) are processed completely before the event loop pulls the next macrotask."
          }
        ]
      },
      {
        id: "fe-mod-02",
        number: "FE-02",
        name: "React 19 & Modern State Management",
        topic: "React Architecture, Hooks & State",
        requiredSkill: "React 19 & State Management",
        difficulty: "Intermediate",
        estimatedTime: "5.0 hrs",
        toolsAndTech: ["React 19", "Vite", "Zustand", "Redux Toolkit", "React Query"],
        topics: [
          "Virtual DOM & Reconciliation Algorithm",
          "React 19 Hooks (useState, useEffect, useMemo, useCallback, use)",
          "Global State Management (Context API vs Zustand)",
          "Server Components & Data Fetching with TanStack Query"
        ],
        theoryContent: {
          overview: "React 19 revolutionizes frontend development with Component-Based Architecture, Virtual DOM Reconciliation, custom Hooks, and Server Components.",
          learningObjectives: [
            "Understand Virtual DOM diffing and component lifecycle rendering cycles.",
            "Utilize React Hooks (useState, useEffect, useMemo, useCallback) effectively.",
            "Manage global application state cleanly using Zustand or Redux Toolkit.",
            "Handle server state caching, revalidation, and optimistic updates with TanStack Query."
          ],
          importantConcepts: [
            {
              concept: "Virtual DOM & Fiber",
              explanation: "React creates a lightweight copy of the real DOM in memory. During state changes, it compares the new Virtual DOM tree with the old one (diffing) and batch updates only changed nodes in the real DOM."
            }
          ],
          detailedExplanations: [
            {
              title: "1. Preventing Unnecessary Re-renders with useMemo & useCallback",
              content: "Every time a parent component re-renders, all child components re-render by default. useCallback memoizes function instances, while useMemo memoizes computed values.",
              snippet: "import React, { useState, useCallback, useMemo } from 'react';\n\nfunction ProductList({ products, onSelect }) {\n  const sortedProducts = useMemo(() => {\n    return [...products].sort((a, b) => b.price - a.price);\n  }, [products]);\n\n  const handleItemClick = useCallback((id) => {\n    onSelect(id);\n  }, [onSelect]);\n\n  return (\n    <div>\n      {sortedProducts.map(p => (\n        <button key={p.id} onClick={() => handleItemClick(p.id)}>{p.name} - ${p.price}</button>\n      ))}\n    </div>\n  );\n}",
              language: "javascript"
            }
          ],
          realWorldExamples: [
            "E-commerce Shopping Cart: Managing local cart state in Zustand with persistent localStorage syncing and optimistic server updates."
          ],
          bestPractices: [
            "Keep state as local as possible; lift state up only when siblings need shared access.",
            "Always specify dependency arrays accurately in useEffect and useMemo."
          ],
          commonMistakes: [
            {
              mistake: "Creating infinite rendering loops by updating state unconditionally inside useEffect.",
              solution: "Include appropriate state variables in the useEffect dependency array."
            }
          ],
          keyPoints: [
            "React components are pure functions of props and state.",
            "Hooks must be called at the top level of React function components."
          ]
        },
        practicalRelevance: "Essential for modern frontend development roles.",
        interviewRelevance: {
          summary: "React architecture, component rendering, and custom hooks are asked in almost every frontend interview.",
          commonQuestions: [
            {
              question: "How does React Fiber diffing algorithm work?",
              idealAnswer: "React Fiber breaks rendering work into incremental units (fibers), prioritizing user interactions while diffing virtual DOM nodes by key and component type to update the real DOM efficiently."
            }
          ]
        },
        quiz: [
          {
            id: "q-fe-02-1",
            question: "What is the primary purpose of the useCallback hook in React?",
            options: ["To memoize calculated values", "To memoize function definitions between renders to prevent child re-renders", "To perform side effects after render", "To fetch data from an API"],
            correctAnswer: "To memoize function definitions between renders to prevent child re-renders",
            explanation: "useCallback returns a memoized version of the callback function that only changes if one of the dependencies has changed."
          }
        ]
      }
    ]
  },

  "Backend Developer": {
    role: "Backend Developer",
    description: "Design server-side logic, microservices, databases, API gateways, security authentication, and distributed system architectures.",
    requiredSkills: ["Backend Architecture & Node.js/Python", "Database Architecture (SQL & NoSQL)", "System Design & Distributed Systems", "Authentication & Web Security", "DevOps & CI/CD"],
    recommendedModules: [
      {
        id: "be-mod-01",
        number: "BE-01",
        name: "Backend Architecture & Node.js Asynchronous Runtime",
        topic: "Node.js Event Loop, Microservices & Architecture",
        requiredSkill: "Backend Architecture & Node.js/Python",
        difficulty: "Intermediate",
        estimatedTime: "5.0 hrs",
        toolsAndTech: ["Node.js", "Express.js", "FastAPI", "NestJS", "PM2"],
        topics: [
          "Node.js Event Loop (Phases & Non-blocking I/O)",
          "Express/NestJS Middleware Architecture",
          "Error Handling, Logging (Winston) & Monitoring",
          "Microservices vs Monolithic Architecture"
        ],
        theoryContent: {
          overview: "Backend development involves building server-side applications that handle business logic, process client requests, interact with databases, and ensure system reliability.",
          learningObjectives: [
            "Understand Node.js single-threaded Event Loop execution phases (Timers, Poll, Check).",
            "Build scalable Express/NestJS backend APIs using modular middleware patterns.",
            "Implement global error handling boundaries and structured JSON logging.",
            "Compare Monolithic vs Microservices trade-offs."
          ],
          importantConcepts: [
            {
              concept: "Event Loop Phases",
              explanation: "Node.js executes I/O callbacks across phases: Timers (setTimeout) -> Pending I/O -> Poll (incoming connections/data) -> Check (setImmediate) -> Close Callbacks."
            }
          ],
          detailedExplanations: [
            {
              title: "1. Node.js Non-Blocking I/O Architecture",
              content: "Node.js uses libuv to handle asynchronous I/O operations (file system, network calls, database queries) using a thread pool behind the single-threaded event loop.",
              snippet: "// Express Centralized Error Handling Middleware\napp.use((err, req, res, next) => {\n  logger.error({\n    message: err.message,\n    stack: err.stack,\n    path: req.path,\n    method: req.method,\n  });\n  res.status(err.statusCode || 500).json({\n    success: false,\n    message: err.isOperational ? err.message : 'Internal Server Error',\n  });\n});",
              language: "javascript"
            }
          ],
          realWorldExamples: [
            "Uber Dispatch Service: Using Node.js asynchronous event loop to handle hundreds of thousands of concurrent driver location pings simultaneously."
          ],
          bestPractices: [
            "Never block the main event loop with CPU-intensive sync loops.",
            "Use centralized error handling middleware for uniform API error responses."
          ],
          commonMistakes: [
            {
              mistake: "Using synchronous methods like fs.readFileSync in API request handlers.",
              solution: "Always use asynchronous methods (fs.promises) to keep the event loop non-blocking."
            }
          ],
          keyPoints: [
            "Node.js excels at I/O-heavy applications (chat, streaming, REST APIs).",
            "Middleware functions process requests sequentially before returning a response."
          ]
        },
        practicalRelevance: "Core foundation for writing high-performance server APIs.",
        interviewRelevance: {
          summary: "Node.js event loop phases and async concurrency are heavily tested in backend engineering interviews.",
          commonQuestions: [
            {
              question: "How does Node.js handle concurrency despite being single-threaded?",
              idealAnswer: "Node.js uses an event-driven, non-blocking I/O model powered by libuv. Heavy I/O tasks are delegated to OS kernel threads or the libuv thread pool, firing callbacks back on the main event loop when complete."
            }
          ]
        },
        quiz: [
          {
            id: "q-be-01-1",
            question: "Which C++ library powers the asynchronous I/O and thread pool in Node.js?",
            options: ["V8", "libuv", "Boost", "OpenSSL"],
            correctAnswer: "libuv",
            explanation: "libuv is the multi-platform C library that provides Node.js with its event loop and asynchronous thread pool."
          }
        ]
      }
    ]
  },

  "Data Scientist": {
    role: "Data Scientist",
    description: "Extract insights from complex datasets using Statistical Modeling, Python Data Science Stack, Machine Learning, Deep Learning, and MLOps.",
    requiredSkills: ["Python Data Stack & EDA", "Statistical Foundations & Probability", "Machine Learning Algorithms", "Deep Learning & Neural Networks", "MLOps & Model Deployment"],
    recommendedModules: [
      {
        id: "ds-mod-01",
        number: "DS-01",
        name: "Python Data Science Stack & Exploratory Data Analysis",
        topic: "Pandas, NumPy & Feature Engineering",
        requiredSkill: "Python Data Stack & EDA",
        difficulty: "Intermediate",
        estimatedTime: "5.0 hrs",
        toolsAndTech: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter"],
        topics: [
          "Vectorized Computations with NumPy Arrays",
          "Data Wrangling & Cleaning with Pandas DataFrames",
          "Exploratory Data Analysis (EDA) & Data Visualization",
          "Feature Engineering & Outlier Treatment"
        ],
        theoryContent: {
          overview: "Exploratory Data Analysis (EDA) and numerical computing enable data scientists to clean, transform, visualize, and extract statistical patterns from raw data before training machine learning models.",
          learningObjectives: [
            "Perform vectorized matrix operations using NumPy arrays.",
            "Clean missing values, handle outliers, and engineer domain-specific features in Pandas.",
            "Create informative data visualizations using Matplotlib and Seaborn.",
            "Execute feature scaling (StandardScaler, MinMaxScaler) and categorical encoding."
          ],
          importantConcepts: [
            {
              concept: "Vectorization",
              explanation: "Performing operations on entire arrays simultaneously in C-level optimized code rather than iterating through explicit Python loops."
            }
          ],
          detailedExplanations: [
            {
              title: "1. Data Wrangling & Feature Scaling in Pandas/Scikit-Learn",
              content: "Data preprocessing converts raw noisy data into ML-ready feature matrices.\n\n• One-Hot Encoding: Converts nominal categorical variables into binary indicator vectors.\n• StandardScaler: Centers data around mean 0 with unit variance (Z-score scaling).",
              snippet: "# Data Preprocessing Pipeline in Python\nimport pandas as pd\nimport numpy as np\nfrom sklearn.preprocessing import StandardScaler\n\ndf = pd.read_csv('dataset.csv')\n# Handle Missing Values\ndf['age'].fillna(df['age'].median(), inplace=True)\n\n# Feature Scaling\nscaler = StandardScaler()\ndf[['age', 'income']] = scaler.fit_transform(df[['age', 'income']])\nprint(df.head())",
              language: "python"
            }
          ],
          realWorldExamples: [
            "Churn Prediction: Analyzing customer subscription logs to engineer features like 'login frequency drop rate' before training a churn prediction model."
          ],
          bestPractices: [
            "Fit scalers only on training data to prevent data leakage from validation/test sets.",
            "Use vectorized Pandas operations instead of .apply() or .iterrows() for speed."
          ],
          commonMistakes: [
            {
              mistake: "Filling missing values using statistics computed from the entire dataset including test data.",
              solution: "Compute imputation values (mean/median) strictly on the training partition."
            }
          ],
          keyPoints: [
            "Data preparation consumes ~80% of a Data Scientist's workflow.",
            "Vectorized NumPy operations are up to 100x faster than standard Python loops."
          ]
        },
        practicalRelevance: "Essential for data analysis, business intelligence, and building ML pipelines.",
        interviewRelevance: {
          summary: "Live coding interviews evaluate Pandas data manipulation, feature engineering, and EDA insights.",
          commonQuestions: [
            {
              question: "How do you detect and handle outliers in a skewed continuous feature?",
              idealAnswer: "I use Interquartile Range (IQR) boxplot bounds [Q1 - 1.5*IQR, Q3 + 1.5*IQR] or Z-scores for normal distributions, then clip, log-transform, or remove invalid outliers based on domain context."
            }
          ]
        },
        quiz: [
          {
            id: "q-ds-01-1",
            question: "Why should feature scalers (like StandardScaler) be fitted ONLY on the training dataset?",
            options: ["To save computation memory", "To prevent data leakage from the test dataset into the model training phase", "Because test data does not contain numerical values", "StandardScaler does not support test data"],
            correctAnswer: "To prevent data leakage from the test dataset into the model training phase",
            explanation: "Fitting scalers on test data leaks global mean and variance information, yielding overly optimistic evaluation metrics."
          }
        ]
      }
    ]
  },

  "DevOps Engineer": {
    role: "DevOps Engineer",
    description: "Automate infrastructure, containerization, CI/CD deployment pipelines, cloud provisioning, and system monitoring.",
    requiredSkills: ["Linux & Scripting", "Containerization (Docker & K8s)", "Infrastructure as Code (Terraform)", "CI/CD Pipeline Automation", "Cloud Architecture (AWS/GCP)"],
    recommendedModules: [
      {
        id: "devops-mod-01",
        number: "DEVOPS-01",
        name: "Docker Containerization & Kubernetes Orchestration",
        topic: "Containers, Microservices & Orchestration",
        requiredSkill: "Containerization (Docker & K8s)",
        difficulty: "Intermediate",
        estimatedTime: "5.5 hrs",
        toolsAndTech: ["Docker", "Kubernetes", "Helm", "kubectl", "AWS EKS"],
        topics: [
          "Docker Images, Container Layering & Multi-Stage Builds",
          "Docker Compose for Multi-Container Apps",
          "Kubernetes Architecture (Pods, Deployments, Services, Ingress)",
          "ConfigMaps, Secrets & Helm Chart Package Management"
        ],
        theoryContent: {
          overview: "Containerization packages software applications with all dependencies into lightweight, isolated containers that run consistently across any environment.",
          learningObjectives: [
            "Write optimized multi-stage Dockerfiles to minimize image size.",
            "Orchestrate multi-container setups using Docker Compose.",
            "Deploy applications onto Kubernetes clusters using Pods, Deployments, and Services.",
            "Manage environment configurations securely using Kubernetes ConfigMaps and Secrets."
          ],
          importantConcepts: [
            {
              concept: "Docker Container",
              explanation: "A standardized, lightweight unit of software that packages code and all its dependencies so the application runs quickly and reliably from one computing environment to another."
            },
            {
              concept: "Kubernetes Pod",
              explanation: "The smallest deployable unit of computing in Kubernetes, representing a single instance of a running process in your cluster."
            }
          ],
          detailedExplanations: [
            {
              title: "1. Optimized Multi-Stage Dockerfile",
              content: "Multi-stage Docker builds separate the build environment from the lean runtime container, drastically reducing security vulnerabilities and image sizes.",
              snippet: "# Multi-Stage Dockerfile for Node.js Application\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Stage 2: Production Runtime\nFROM node:18-alpine AS runner\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/package*.json ./\nRUN npm ci --only=production\nEXPOSE 3000\nCMD [\"node\", \"dist/server.js\"]",
              language: "dockerfile"
            }
          ],
          realWorldExamples: [
            "Microservices Cloud Deployment: Running 200+ microservice instances on Kubernetes with horizontal pod autoscaling (HPA) during peak e-commerce sales."
          ],
          bestPractices: [
            "Use minimal base images (Alpine / Distroless) for security and fast deployment times.",
            "Never store passwords or API keys inside Docker images; inject via Kubernetes Secrets."
          ],
          commonMistakes: [
            {
              mistake: "Running container processes as root user inside production containers.",
              solution: "Create and switch to a non-privileged USER in the Dockerfile."
            }
          ],
          keyPoints: [
            "Docker solves 'works on my machine' problems by standardizing execution environments.",
            "Kubernetes automates deployment, scaling, and self-healing container management."
          ]
        },
        practicalRelevance: "Essential for modern cloud deployment, microservice architectures, and CI/CD pipelines.",
        interviewRelevance: {
          summary: "Docker building, Kubernetes debugging, and pod lifecycle questions are standard in DevOps interviews.",
          commonQuestions: [
            {
              question: "What is the difference between a Kubernetes Deployment and a StatefulSet?",
              idealAnswer: "Deployments manage stateless pods where instances are interchangeable. StatefulSets manage stateful pods with persistent network IDs and dedicated persistent volumes (e.g., databases)."
            }
          ]
        },
        quiz: [
          {
            id: "q-devops-01-1",
            question: "What is the primary benefit of using multi-stage Docker builds?",
            options: ["Speed up container network latency", "Reduce final production container image size and security attack surface", "Enable automatic database scaling", "Bypass container health checks"],
            correctAnswer: "Reduce final production container image size and security attack surface",
            explanation: "Multi-stage builds leave behind compilers and build tools, copying only compiled production artifacts into the final lightweight image."
          }
        ]
      }
    ]
  },

  "Cybersecurity Specialist": {
    role: "Cybersecurity Specialist",
    description: "Protect systems, networks, and applications from cyber threats through Penetration Testing, OWASP Security, Cryptography, and Incident Response.",
    requiredSkills: ["Network Security & Protocols", "Web Application Security (OWASP)", "Ethical Hacking & PenTesting", "Cryptography & PKI", "Incident Response & Forensics"],
    recommendedModules: [
      {
        id: "sec-mod-01",
        number: "SEC-01",
        name: "Web Application Security & OWASP Top 10",
        topic: "Application Security & Threat Prevention",
        requiredSkill: "Web Application Security (OWASP)",
        difficulty: "Intermediate",
        estimatedTime: "5.0 hrs",
        toolsAndTech: ["Burp Suite", "OWASP ZAP", "Wireshark", "Metasploit", "Nmap"],
        topics: [
          "OWASP Top 10 Vulnerabilities (SQLi, XSS, CSRF, Broken Auth)",
          "Cross-Site Scripting (XSS) & Content Security Policy (CSP)",
          "SQL Injection (SQLi) & Parameterized Queries",
          "Cross-Site Request Forgery (CSRF) & SameSite Cookie Protection"
        ],
        theoryContent: {
          overview: "Web Application Security focuses on identifying, exploiting, and remediating vulnerabilities in web applications before malicious hackers can compromise sensitive data.",
          learningObjectives: [
            "Identify and exploit OWASP Top 10 vulnerabilities in a sandbox environment.",
            "Remediate SQL Injection using Parameterized Queries and ORMs.",
            "Mitigate XSS attacks using HTML Escaping and Content Security Policy (CSP) headers.",
            "Secure session cookies against CSRF using Anti-CSRF Tokens and SameSite flags."
          ],
          importantConcepts: [
            {
              concept: "SQL Injection (SQLi)",
              explanation: "An attack vector where untrusted user input is concatenated directly into SQL queries, allowing attackers to manipulate query logic to access or destroy data."
            },
            {
              concept: "Cross-Site Scripting (XSS)",
              explanation: "A vulnerability where an attacker injects malicious client-side JavaScript code into pages viewed by other users."
            }
          ],
          detailedExplanations: [
            {
              title: "1. Preventing SQL Injection with Parameterized Statements",
              content: "Concatenating user strings into SQL enables SQLi attacks.\n\nVulnerable Query:\n`SELECT * FROM users WHERE email = '` + userInput + `'`\nInput: `' OR '1'='1` -> Bypasses authentication!\n\nRemediation:\nUse Parameterized Queries (Prepared Statements) where input is treated strictly as data, never executable code.",
              snippet: "// Secure Prepared Statement in Node.js PostgreSQL\nconst { Client } = require('pg');\nconst client = new Client();\n\nasync function getUserByEmail(userEmail) {\n  // Parameterized Query using $1 placeholder\n  const query = 'SELECT id, email, role FROM users WHERE email = $1';\n  const res = await client.query(query, [userEmail]); // Safe from SQLi\n  return res.rows[0];\n}",
              language: "javascript"
            }
          ],
          realWorldExamples: [
            "Data Breach Remediation: Auditing legacy web forms using Burp Suite to identify blind SQL injection endpoints and replacing queries with ORM prepared statements."
          ],
          bestPractices: [
            "Never trust user input; validate on length, type, format, and sanitize output.",
            "Set HttpOnly, Secure, and SameSite=Strict flags on authentication cookies."
          ],
          commonMistakes: [
            {
              mistake: "Relying solely on frontend client-side validation for security.",
              solution: "Enforce strict server-side input validation on every API endpoint."
            }
          ],
          keyPoints: [
            "Security must be built into the SDLC (DevSecOps) rather than bolted on at the end.",
            "Defense in Depth: Combine input sanitization, least privilege, and security headers."
          ]
        },
        practicalRelevance: "Essential for application security engineers, penetration testers, and secure software developers.",
        interviewRelevance: {
          summary: "OWASP Top 10 exploitation and remediation scenarios are asked in cybersecurity and AppSec interviews.",
          commonQuestions: [
            {
              question: "How does Stored XSS differ from Reflected XSS?",
              idealAnswer: "Stored XSS permanently saves the malicious script in the database to execute whenever users view the affected page. Reflected XSS reflects the script off the web server immediately in a single request (e.g. via search URL parameters)."
            }
          ]
        },
        quiz: [
          {
            id: "q-sec-01-1",
            question: "Which technique is the primary defense against SQL Injection vulnerabilities?",
            options: ["Input length limits", "Parameterized Queries / Prepared Statements", "Base64 encoding", "Client-side JS validation"],
            correctAnswer: "Parameterized Queries / Prepared Statements",
            explanation: "Prepared Statements separate query code from user data, ensuring input parameters cannot alter query logic."
          }
        ]
      }
    ]
  },

  "Product Manager": {
    role: "Product Manager",
    description: "Lead product vision, feature prioritization, user analytics, sprint planning, and cross-functional team execution.",
    requiredSkills: ["Product Strategy & Roadmaps", "User Research & Product Analytics", "Agile & Scrum Execution", "Technical Fundamentals for PMs", "Product Launch & GTM"],
    recommendedModules: [
      {
        id: "pm-mod-01",
        number: "PM-01",
        name: "Product Strategy & Feature Prioritization",
        topic: "Product Discovery, Prioritization & Metrics",
        requiredSkill: "Product Strategy & Roadmaps",
        difficulty: "Intermediate",
        estimatedTime: "4.0 hrs",
        toolsAndTech: ["Jira", "Mixpanel", "Amplitude", "Notion", "Figma"],
        topics: [
          "Product Vision & North Star Metric",
          "Prioritization Frameworks (RICE, Kano Model, Eisenhower Matrix)",
          "Product Analytics (A/B Testing, Cohort Analysis, Funnels)",
          "Writing High-Quality User Stories & Acceptance Criteria"
        ],
        theoryContent: {
          overview: "Product Management combines business strategy, user experience, and technology to define product direction, prioritize engineering roadmaps, and ship high-impact features.",
          learningObjectives: [
            "Define a clear Product Vision and identify a company's North Star Metric.",
            "Apply RICE (Reach, Impact, Confidence, Effort) and Kano frameworks to prioritize backlog items.",
            "Analyze product funnels, retention cohorts, and A/B test results in Amplitude/Mixpanel.",
            "Write unambiguous User Stories with clear Acceptance Criteria using Gherkin syntax."
          ],
          importantConcepts: [
            {
              concept: "North Star Metric",
              explanation: "A single key metric that best captures the core value a product delivers to its customers, aligning long-term product strategy."
            },
            {
              concept: "RICE Score Formula",
              explanation: "RICE = (Reach * Impact * Confidence) / Effort. Used to rank features objectively."
            }
          ],
          detailedExplanations: [
            {
              title: "1. Writing User Stories with Acceptance Criteria",
              content: "User stories describe a feature from the end-user perspective:\n\nFormat: 'As a <user role>, I want to <action>, so that <business value>.'\n\nAcceptance Criteria (Gherkin Syntax):\nGiven <initial context>\nWhen <user action>\nThen <expected outcome>",
              snippet: "# Sample User Story & Acceptance Criteria\nUser Story: As a job candidate, I want to record voice interview answers so that I can practice spoken responses naturally.\n\nAcceptance Criteria:\n1. GIVEN the candidate is on a question screen\n   WHEN they click 'Start Recording'\n   THEN the microphone captures audio and live transcript appears within 500ms.\n2. GIVEN recording is active\n   WHEN candidate clicks 'Stop'\n   THEN audio playback is generated and saved to MongoDB.",
              language: "markdown"
            }
          ],
          realWorldExamples: [
            "Spotify North Star Metric: 'Time spent listening to music'—aligning recommendation algorithms, UI playlists, and offline downloads to drive this single metric."
          ],
          bestPractices: [
            "Prioritize features using quantitative user data (RICE score) rather than loud stakeholder opinions.",
            "Validate product-market fit using small MVP experiments before committing full engineering Sprints."
          ],
          commonMistakes: [
            {
              mistake: "Building features without defining clear success metrics before launch.",
              solution: "Define success KPIs (e.g., 20% increase in checkout conversion) before writing PRDs."
            }
          ],
          keyPoints: [
            "Product Managers own the 'Why' and 'What'; engineering owns the 'How'.",
            "Data-driven decision making minimizes feature waste."
          ]
        },
        practicalRelevance: "Essential for guiding engineering teams, conducting sprint planning, and aligning company product goals.",
        interviewRelevance: {
          summary: "Product Sense, Product Design, and Metric Execution cases are evaluated in PM interview rounds.",
          commonQuestions: [
            {
              question: "How would you prioritize between a technical debt refactor requested by engineering and a new feature requested by sales?",
              idealAnswer: "I evaluate the RICE score and business risk of both. If technical debt threatens system uptime or engineering velocity for upcoming core roadmap goals, I allocate a dedicated percentage (~20%) of sprint capacity to tech debt while prioritizing high-impact sales features."
            }
          ]
        },
        quiz: [
          {
            id: "q-pm-01-1",
            question: "In the RICE prioritization framework, what does the 'E' stand for?",
            options: ["Efficiency", "Effort (person-weeks/months)", "Engagement", "Execution"],
            correctAnswer: "Effort (person-weeks/months)",
            explanation: "RICE stands for Reach, Impact, Confidence, and Effort. Effort is the denominator representing total team time required."
          }
        ]
      }
    ]
  }
};

/**
 * Generate interactive revision flashcards for a module
 */
function buildFlashcardsForModule(mod) {
  const cards = [];
  let cardId = 1;

  // 1. Important Concepts
  if (mod.theoryContent?.importantConcepts) {
    mod.theoryContent.importantConcepts.forEach((ic) => {
      cards.push({
        id: `fc-${mod.id}-${cardId++}`,
        front: ic.concept,
        back: ic.explanation,
        category: "Core Concept",
        tagColor: "bg-purple-500/10 text-purple-300 border-purple-500/30"
      });
    });
  }

  // 2. Interview Questions & Ideal Answers
  if (mod.interviewRelevance?.commonQuestions) {
    mod.interviewRelevance.commonQuestions.forEach((iq) => {
      cards.push({
        id: `fc-${mod.id}-${cardId++}`,
        front: iq.question,
        back: iq.idealAnswer,
        category: "Interview Question",
        tagColor: "bg-blue-500/10 text-blue-300 border-blue-500/30"
      });
    });
  }

  // 3. Best Practices
  if (mod.theoryContent?.bestPractices) {
    mod.theoryContent.bestPractices.forEach((bp) => {
      cards.push({
        id: `fc-${mod.id}-${cardId++}`,
        front: `Best Practice: ${mod.name}`,
        back: bp,
        category: "Best Practice",
        tagColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
      });
    });
  }

  // 4. Common Pitfalls & Solutions
  if (mod.theoryContent?.commonMistakes) {
    mod.theoryContent.commonMistakes.forEach((cm) => {
      cards.push({
        id: `fc-${mod.id}-${cardId++}`,
        front: `Common Pitfall: ${cm.mistake}`,
        back: `Recommended Fix: ${cm.solution}`,
        category: "Common Pitfall",
        tagColor: "bg-rose-500/10 text-rose-300 border-rose-500/30"
      });
    });
  }

  // 5. Primary Tools & Tech
  if (mod.toolsAndTech && mod.toolsAndTech.length > 0) {
    cards.push({
      id: `fc-${mod.id}-${cardId++}`,
      front: `Key Tools & Technologies for ${mod.name}`,
      back: `Essential stack: ${mod.toolsAndTech.join(", ")}.`,
      category: "Tools & Tech",
      tagColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
    });
  }

  return cards;
}

/**
 * Get comprehensive learning roadmap for a specific job role
 */
function getRoadmapForRole(roleName) {
  const normalizedRole = roleName ? roleName.trim() : "Full Stack Software Developer";

  let roadmapObj = ROLE_ROADMAPS[normalizedRole];

  if (!roadmapObj) {
    const lower = normalizedRole.toLowerCase();
    if (lower.includes("ui") || lower.includes("ux") || lower.includes("design")) {
      roadmapObj = ROLE_ROADMAPS["UI/UX Designer"];
    } else if (lower.includes("front")) {
      roadmapObj = ROLE_ROADMAPS["Frontend Developer"];
    } else if (lower.includes("back")) {
      roadmapObj = ROLE_ROADMAPS["Backend Developer"];
    } else if (lower.includes("data scientist") || lower.includes("machine learning") || lower.includes("ai")) {
      roadmapObj = ROLE_ROADMAPS["Data Scientist"];
    } else if (lower.includes("devops") || lower.includes("cloud") || lower.includes("sre")) {
      roadmapObj = ROLE_ROADMAPS["DevOps Engineer"];
    } else if (lower.includes("security") || lower.includes("cyber") || lower.includes("pentest")) {
      roadmapObj = ROLE_ROADMAPS["Cybersecurity Specialist"];
    } else if (lower.includes("product") || lower.includes("manager")) {
      roadmapObj = ROLE_ROADMAPS["Product Manager"];
    } else {
      roadmapObj = ROLE_ROADMAPS["Software Developer"];
    }
  }

  // Deep clone to attach generated flashcards dynamically
  const cloned = JSON.parse(JSON.stringify(roadmapObj));
  cloned.recommendedModules = cloned.recommendedModules.map((mod) => ({
    ...mod,
    flashcards: buildFlashcardsForModule(mod)
  }));

  return cloned;
}

module.exports = {
  ROLE_ROADMAPS,
  getRoadmapForRole,
};
