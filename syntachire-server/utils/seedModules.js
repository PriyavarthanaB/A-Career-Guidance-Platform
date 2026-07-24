const mongoose = require("mongoose");
require("dotenv").config();
const Module = require("../models/Module");

const modulesData = [
  {
    number: "Module 01",
    name: "Programming Basics & Complexity",
    topic: "Programming Basics & Complexity",
    difficulty: "Easy",
    estimatedTime: "2.5 hrs",
    progress: 100,
    description: "Understand language syntax, execution runtimes, memory scopes, and mathematical representations of Big O time and space complexities.",
    theory: {
      overview: "Time complexity measures the execution steps of an algorithm, while Space complexity tracks auxiliary memory allocation. Both are expressed using Big O asymptotic notation.",
      learningObjectives: [
        "Understand compilation, memory allocation, and call stack behavior.",
        "Master Big-O, Big-Theta, and Big-Omega asymptotic concepts.",
        "Learn to calculate time/space bounds for iterative and recursive procedures."
      ],
      theoryText: "Programming Basics encompasses variables, scopes, loops, conditionals, and functions. Memory models divide storage into the stack (fast, fixed-size allocation for local variables and function calls) and the heap (dynamic, variable-size allocation for objects and collections). Time Complexity measures the rate of growth of the operations relative to input size N, while Space Complexity measures auxiliary storage. Big O notation describes the upper bound (worst-case), Big Omega describes the lower bound (best-case), and Big Theta describes the tight bound.",
      patterns: [
        { title: "Asymptotic Bounds", desc: "Determining O(1), O(log N), O(N), O(N log N), O(N^2), and O(2^N) limits." },
        { title: "Auxiliary Space", desc: "Accounting for recursion stack frames and dynamically allocated collections." }
      ],
      complexities: [
        { op: "Single Loop Traversal", time: "O(N)", space: "O(1)" },
        { op: "Nested Loops Traverse", time: "O(N^2)", space: "O(1)" }
      ],
      codeExamples: [
        {
          title: "Iterative O(N) Search",
          code: "function contains(arr, val) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === val) return true;\n  }\n  return false;\n}",
          explanation: "A simple linear loop check. It visits each element once, resulting in O(N) worst-case time complexity and O(1) space complexity."
        },
        {
          title: "Binary Search O(log N)",
          code: "function binarySearch(arr, val) {\n  let l = 0, r = arr.length - 1;\n  while (l <= r) {\n    let m = Math.floor((l + r) / 2);\n    if (arr[m] === val) return m;\n    else if (arr[m] < val) l = m + 1;\n    else r = m - 1;\n  }\n  return -1;\n}",
          explanation: "Each iteration cuts the search space in half. Hence, the runtime grows logarithmically: O(log N) time and O(1) auxiliary space."
        }
      ],
      importantNotes: [
        "Always evaluate both auxiliary space (extra data structures created) and recursion stack frames.",
        "Don't confuse worst-case time with average-case or best-case time.",
        "Constant terms (like O(2N)) are omitted in asymptotic analysis, leaving O(N)."
      ],
      interviewQuestions: [
        { question: "Given a recursive Fibonacci function, analyze its time and space complexity.", optimalComplexity: "Time: O(2^N), Space: O(N) recursion stack" },
        { question: "What is the difference between Amortized Time and Average Time?", optimalComplexity: "Amortized accounts for infrequent high-cost operations (like array resizing) spread over many low-cost ones." }
      ],
      commonMistakes: [
        { mistake: "Assuming all nested loops result in O(N^2) complexity.", solution: "Analyze loop variables carefully; some nested loops only traverse a portion of the array or divide index space, leading to O(N log N) or O(N)." },
        { mistake: "Neglecting recursion stack space in recursive algorithms.", solution: "Always count the maximum depth of the call stack toward space complexity." }
      ],
      summary: "Mastering Big O complexity analysis is the foundational prerequisite for all technical interviews. It allows comparing solutions objectively and finding optimal trade-offs.",
      codeLanguage: "javascript"
    }
  },
  {
    number: "Module 02",
    name: "Arrays",
    topic: "Arrays",
    difficulty: "Easy",
    estimatedTime: "3.5 hrs",
    progress: 100,
    description: "Master array operations, contiguous memory representations, in-place modifications, and prefix sum arrays.",
    theory: {
      overview: "Arrays are contiguous blocks of memory holding references or values. Lookups by index are O(1), but insertion or deletion at the beginning requires shifting elements, taking O(N) time.",
      learningObjectives: [
        "Master contiguous memory storage benefits and access limitations.",
        "Understand static vs dynamic array allocations.",
        "Implement common pointer techniques, cyclic swaps, and prefix sums."
      ],
      theoryText: "Arrays are contiguous blocks of memory containing homogenous elements. Accessing elements by index is O(1) since the compiler calculates the memory address offsets directly. Inserting or deleting elements at the beginning or middle is O(N) because subsequent elements must shift. Dynamic arrays (like arrays in JS, Python Lists, or ArrayLists in Java) automatically resize when they reach capacity. This resize copies elements to a new, larger array, yielding O(N) copy cost, but because this happens infrequently, insertions have an amortized time complexity of O(1).",
      patterns: [
        { title: "Prefix Sum Array", desc: "Precomputing cumulative sums to answer range sum queries in O(1) time." },
        { title: "Two-pointer Swaps", desc: "Reversing or modifying an array in-place to ensure O(1) extra space usage." }
      ],
      complexities: [
        { op: "Index Lookup / Update", time: "O(1)", space: "O(1)" },
        { op: "In-place Reversal", time: "O(N)", space: "O(1)" }
      ],
      codeExamples: [
        {
          title: "Prefix Sum Array",
          code: "class NumArray {\n  constructor(nums) {\n    this.prefix = [0];\n    for (let n of nums) {\n      this.prefix.push(this.prefix[this.prefix.length - 1] + n);\n    }\n  }\n  sumRange(left, right) {\n    return this.prefix[right + 1] - this.prefix[left];\n  }\n}",
          explanation: "Computes running totals on instantiation. Allows querying sum of any subarray range in O(1) time."
        },
        {
          title: "In-place Array Reverse using Two-pointers",
          code: "function reverseArray(arr) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    [arr[left], arr[right]] = [arr[right], arr[left]];\n    left++;\n    right--;\n  }\n  return arr;\n}",
          explanation: "Reverses arrays in-place using opposite direction pointers. Minimizes memory overhead to O(1) space."
        }
      ],
      importantNotes: [
        "Dynamic arrays resize by doubling their capacity (factor of 2), achieving O(1) amortized insertion.",
        "Subarrays must be contiguous; subsets do not need to be contiguous."
      ],
      interviewQuestions: [
        { question: "Find the maximum subarray sum using Kadane's Algorithm.", optimalComplexity: "Time: O(N), Space: O(1)" },
        { question: "Merge sorted arrays in-place without using extra space.", optimalComplexity: "Time: O(N + M), Space: O(1)" }
      ],
      commonMistakes: [
        { mistake: "Creating a new array copy inside a loop.", solution: "Generates O(N^2) complexity. Re-use existing arrays or allocate target sizes beforehand." }
      ],
      summary: "Arrays represent the most fundamental linear structure, offering constant-time access at the price of linear-time size modifications.",
      codeLanguage: "javascript"
    }
  },
  {
    number: "Module 03",
    name: "Strings",
    topic: "Strings",
    difficulty: "Easy",
    estimatedTime: "3.0 hrs",
    progress: 80,
    description: "Learn immutable sequence configurations, pattern match checks, anagram validations, and sliding window boundaries.",
    theory: {
      overview: "Strings are sequence variables of characters. In JavaScript, strings are immutable, meaning any modification generates a new string variable. This makes string building via arrays a common practice.",
      learningObjectives: [
        "Navigate character arrays and immutable string scopes.",
        "Validate palindromes, anagrams, and palindromic substrings.",
        "Build strings efficiently without duplicate allocations."
      ],
      theoryText: "Strings are ordered arrays of characters. In some languages (like C++), strings are mutable and can be modified in place. In others (like JavaScript, Java, and Python), strings are immutable. Every modification to an immutable string generates a brand new string reference in memory. Therefore, repeated concatenation in a loop (e.g. s += char) leads to O(N^2) copy runtimes. To construct strings efficiently, push characters to an array and join them at the end, taking O(N) total time.",
      patterns: [
        { title: "Frequency Mapping", desc: "Count occurrences of characters in a string to validate anagrams or substrings." },
        { title: "String Matching", desc: "Utilizing pointer shifts to detect matching substrings or palindromes." }
      ],
      complexities: [
        { op: "String Concat (N times)", time: "O(N^2)", space: "O(N)" },
        { op: "Array Join Method", time: "O(N)", space: "O(N)" }
      ],
      codeExamples: [
        {
          title: "Palindromic Substring Checks",
          code: "function isPalindrome(s) {\n  let l = 0, r = s.length - 1;\n  while (l < r) {\n    if (s[l] !== s[r]) return false;\n    l++; r--;\n  }\n  return true;\n}",
          explanation: "Compares characters from both ends moving inward. O(N) time and O(1) space."
        },
        {
          title: "Anagram check using character frequency maps",
          code: "function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (let char of s) count[char] = (count[char] || 0) + 1;\n  for (let char of t) {\n    if (!count[char]) return false;\n    count[char]--;\n  }\n  return true;\n}",
          explanation: "Computes frequency map of first string, then subtracts character counts of the second string. Resolves in linear O(N) time."
        }
      ],
      importantNotes: [
        "Always ask if string comparisons are case-sensitive and if alphanumeric characters should ignore spaces/punctuation.",
        "Strings are represented under ASCII (8-bit) or Unicode (16/32-bit)."
      ],
      interviewQuestions: [
        { question: "Find the longest substring without repeating characters.", optimalComplexity: "Time: O(N), Space: O(min(A, N)) where A is charset size" }
      ],
      commonMistakes: [
        { mistake: "Using string concatenation inside a loop in Javascript.", solution: "Pushes character insertions to arrays and performs .join('') at the end." }
      ],
      summary: "Strings are immutable sequences in JavaScript. Manipulation requires converting them to arrays or using character indexes to stay within optimal runtimes.",
      codeLanguage: "javascript"
    }
  },
  {
    number: "Module 04",
    name: "Hashing",
    topic: "Hashing",
    difficulty: "Medium",
    estimatedTime: "4.0 hrs",
    progress: 60,
    description: "Explore hash functions, hash maps, hash sets, bucket collisions, and constant-time frequency indexing.",
    theory: {
      overview: "Hashing maps keys to indexes using a hash function. In-memory data collections like Map and Set resolve collisions to deliver O(1) average lookups.",
      learningObjectives: [
        "Explain hash functions and collision resolution strategies.",
        "Contrast Map and Set collections.",
        "Use hash tables to track elements in constant time."
      ],
      theoryText: "Hashing is the process of mapping arbitrary data keys to fixed-size array indices using a hash function. Collisions (when two keys hash to the same index) are resolved via Separate Chaining (linked lists at bucket indices) or Open Addressing (probing nearby buckets). A well-designed hash table maintains a low load factor, enabling average search, insert, and delete operations in O(1) constant time.",
      patterns: [
        { title: "Hash Map Cache", desc: "Caching previous values and their indexes to solve search tasks like Two Sum." },
        { title: "Hash Set Check", desc: "Checking whether an element has been seen in O(1) to avoid duplicate iterations." }
      ],
      complexities: [
        { op: "Insert / Search key", time: "O(1) Avg", space: "O(N)" },
        { op: "Deletions / Resizes", time: "O(1) Avg", space: "O(N)" }
      ],
      codeExamples: [
        {
          title: "Two Sum using a Hash Map index cache",
          code: "function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (seen.has(diff)) return [seen.get(diff), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}",
          explanation: "Saves visited elements and indices inside a Map, looking up diff counterparts in constant time O(1)."
        },
        {
          title: "Frequency Counter Pattern",
          code: "function frequencyCounter(arr) {\n  const map = new Map();\n  for (let val of arr) {\n    map.set(val, (map.get(val) || 0) + 1);\n  }\n  return map;\n}",
          explanation: "Loops over the array and populates occurrence counters in O(N) time and O(N) space."
        }
      ],
      importantNotes: [
        "Hash tables do not maintain ordering. If insertion order is needed, use Linked Hash Maps.",
        "Worst-case time complexity of hash tables can degrade to O(N) if many keys collide in a single bucket."
      ],
      interviewQuestions: [
        { question: "Check if a subarray has a sum equal to K.", optimalComplexity: "Time: O(N), Space: O(N)" }
      ],
      commonMistakes: [
        { mistake: "Using complex objects directly as keys without proper hash functions.", solution: "Ensure keys are simple strings, numbers, or primitive references." }
      ],
      summary: "Hashing trades space for time, using memory arrays to deliver average-case O(1) lookups for search, insert, and delete actions.",
      codeLanguage: "javascript"
    }
  },
  {
    number: "Module 05",
    name: "Linked Lists",
    topic: "Linked Lists",
    difficulty: "Easy",
    estimatedTime: "3.5 hrs",
    progress: 40,
    description: "Construct pointer-based node references, list reversals, cycle detections, and node deletion bounds.",
    theory: {
      overview: "A Linked List is a linear data structure where nodes are scattered in memory, connected via pointer references (next and optionally prev). Unlike arrays, list size is dynamic and insertion/deletion at a known node position is O(1) since it only requires re-linking pointers.",
      learningObjectives: [
        "Implement Singly, Doubly, and Circular Linked Lists.",
        "Reverse linked list references in-place.",
        "Detect cycle loops using two-pointer algorithms."
      ],
      theoryText: "Unlike arrays, linked list nodes are not saved sequentially in memory. Accessing a node requires traversing starting links from head down via node references. This means lookup is O(N) linear time, but modifying nodes at known pointers resolves in constant O(1) time.",
      patterns: [
        { title: "Fast & Slow Pointers", desc: "Detect list loops (Floyd's algorithm) or return the exact middle list node." },
        { title: "Dummy Node Reference", desc: "Creating a temporary dummy node before the head to simplify edge conditions." }
      ],
      complexities: [
        { op: "Insertion at Head", time: "O(1)", space: "O(1)" },
        { op: "Linear Node Lookup", time: "O(N)", space: "O(1)" }
      ],
      codeExamples: [
        {
          title: "In-Place Singly LinkedList Reversal",
          code: "function reverse(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    let next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}",
          explanation: "Iterates through the list, flipping the next pointer of each node to point to the previous node in O(N) time and O(1) auxiliary space."
        },
        {
          title: "Floyd's Cycle Detection (Tortoise and Hare)",
          code: "function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}",
          explanation: "Uses slow and fast pointers. If they meet, a cycle exists. Takes O(N) time and constant O(1) space."
        }
      ],
      importantNotes: [
        "Initialize a dummy node pointing to the head to simplify edge cases (inserting at the head, empty lists).",
        "Always check for null pointers on node traversal (curr.next.next)."
      ],
      interviewQuestions: [
        { question: "Merge two sorted linked lists into one sorted list.", optimalComplexity: "Time: O(N + M), Space: O(1)" },
        { question: "Find the node where a cycle begins in a linked list.", optimalComplexity: "Time: O(N), Space: O(1) via Floyd's Cycle Detection" }
      ],
      commonMistakes: [
        { mistake: "Losing the reference to the rest of the list during pointer reassignments.", solution: "Save references in temporary variable variables (e.g. let next = curr.next) before modifying node pointers." }
      ],
      summary: "Linked Lists offer dynamic sizing and constant-time inserts/deletes, but suffer from linear-time access speeds due to scattered heap memory allocations.",
      codeLanguage: "javascript"
    }
  },
  {
    number: "Module 06",
    name: "Stacks & Queues",
    topic: "Stacks & Queues",
    difficulty: "Medium",
    estimatedTime: "4.0 hrs",
    progress: 20,
    description: "Learn LIFO stack limits, FIFO queue buffers, monostatic stack ranges, and valid brackets validation.",
    theory: {
      overview: "Stacks follow Last-In-First-Out (LIFO), whereas Queues follow First-In-First-Out (FIFO). Monotonic stacks maintain elements in sorted sequence to find next larger/smaller items.",
      learningObjectives: [
        "Explain stack LIFO and queue FIFO behaviors.",
        "Master monotonic stacks for range search tasks.",
        "Implement queues using stacks and circular arrays."
      ],
      theoryText: "Stacks are Last-In-First-Out (LIFO) collections supporting push (insert) and pop (remove) from the top. Queues are First-In-First-Out (FIFO) collections supporting enqueue (insert at rear) and dequeue (remove from front). Monotonic stacks maintain elements in increasing or decreasing sorted order. They are used to find next-greater or next-smaller elements in linear time O(N).",
      patterns: [
        { title: "Monotonic Stack", desc: "Maintain stack in strictly increasing/decreasing order to solve range problems." },
        { title: "Double-pointer Buffer", desc: "Circular queues using arrays and index offsets to manage bounds." }
      ],
      complexities: [
        { op: "Stack Push / Pop", time: "O(1)", space: "O(1)" },
        { op: "Queue Enqueue / Dequeue", time: "O(1)", space: "O(1)" }
      ],
      codeExamples: [
        {
          title: "Valid Parentheses check using a Stack",
          code: "function isValid(s) {\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  for (let char of s) {\n    if (char in pairs) {\n      if (stack.pop() !== pairs[char]) return false;\n    } else {\n      stack.push(char);\n    }\n  }\n  return stack.length === 0;\n}",
          explanation: "Pushes opening brackets. On closing brackets, pops and validates matching pairs. Runs in O(N) time and O(N) space."
        },
        {
          title: "Next Greater Element",
          code: "function nextGreaterElement(nums) {\n  const res = new Array(nums.length).fill(-1);\n  const stack = [];\n  for (let i = 0; i < nums.length; i++) {\n    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {\n      const idx = stack.pop();\n      res[idx] = nums[i];\n    }\n    stack.push(i);\n  }\n  return res;\n}",
          explanation: "Maintains indices in a monotonic stack. Pops items when a larger value is found, matching the next greater element in O(N) time."
        }
      ],
      importantNotes: [
        "Queues implemented with standard JS arrays (using .shift()) run in O(N) time. In production, use linked nodes or circular buffers for O(1) dequeue.",
        "Stacks are the foundation of recursive runtimes, managing execution contexts in call stack frames."
      ],
      interviewQuestions: [
        { question: "Design a stack that supports push, pop, and retrieving the minimum element in O(1) time.", optimalComplexity: "Use a secondary auxiliary stack tracking minimum values" }
      ],
      commonMistakes: [
        { mistake: "Using standard arrays as queues in high-frequency applications.", solution: "Use a dedicated Double Ended Queue (Deque) or pointer indexes to achieve constant-time removals." }
      ],
      summary: "Stacks and Queues are crucial buffer structures. Monotonic properties enable solving adjacent element dependency queries in linear time.",
      codeLanguage: "javascript"
    }
  },
  {
    number: "Module 07",
    name: "Trees & BST",
    topic: "Trees & BST",
    difficulty: "Medium",
    estimatedTime: "6.0 hrs",
    progress: 0,
    description: "Traverse hierarchical trees, pre/in/post-order loops, depth lookups, and Binary Search Tree properties.",
    theory: {
      overview: "A tree is a hierarchical structure of nodes where each node contains values and children references, starting from a single root. A Binary Tree limits each node to at most two children. A Binary Search Tree (BST) enforces that the left subtree contains values smaller than the parent node, and the right subtree contains values larger.",
      learningObjectives: [
        "Master Tree structures, Binary Trees, and Binary Search Trees.",
        "Perform DFS (pre/in/post-order) and BFS traversals.",
        "Analyze BST search and balance limits."
      ],
      theoryText: "Traversal occurs via DFS (depth-first: pre-order, in-order, post-order) or BFS (breadth-first: level-order). In BSTs, in-order traversal yields nodes in sorted order. Searches run in O(log N) time if the tree is balanced, but can degrade to O(N) if it becomes skewed.",
      patterns: [
        { title: "In-order traversal", desc: "Traversing BST nodes in-order (left, root, right) yields sorted keys." },
        { title: "Recursive Depth First", desc: "Propagating heights bottom-up to calculate tree balances or diameters." }
      ],
      complexities: [
        { op: "BST Search (Balanced)", time: "O(log N)", space: "O(H) recursion" },
        { op: "Tree Traversal (V nodes)", time: "O(V)", space: "O(H) recursion" }
      ],
      codeExamples: [
        {
          title: "In-Order Traversal (Recursive)",
          code: "function inOrder(root, res = []) {\n  if (root) {\n    inOrder(root.left, res);\n    res.push(root.val);\n    inOrder(root.right, res);\n  }\n  return res;\n}",
          explanation: "Traverses tree recursively. For BSTs, this yields elements in sorted ascending order in O(N) time."
        },
        {
          title: "Recursive Depth Check of Binary Tree",
          code: "function maxDepth(root) {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}",
          explanation: "Traverses the tree to find leaf nodes, returning max depths recursively in O(N) time."
        }
      ],
      importantNotes: [
        "BST operations degrade to O(N) if the tree becomes unbalanced (skewed list). Balanced BSTs (e.g., AVL, Red-Black) maintain height of O(log N).",
        "BFS uses a Queue; DFS uses a Stack (or the call stack via recursion)."
      ],
      interviewQuestions: [
        { question: "Validate if a Binary Tree is a valid Binary Search Tree.", optimalComplexity: "Time: O(N), Space: O(H) recursive stack" },
        { question: "Invert a binary tree in-place.", optimalComplexity: "Time: O(N), Space: O(H)" }
      ],
      commonMistakes: [
        { mistake: "Assuming BST lookup is always O(log N) without verifying tree balance.", solution: "Mention that unbalanced BSTs behave like linked lists with O(N) runtimes." }
      ],
      summary: "Trees represent hierarchical structures. BSTs offer fast search and insertions in average-case logarithmic O(log N) times, provided balance constraints are met.",
      codeLanguage: "javascript"
    }
  },
  {
    number: "Module 08",
    name: "Heap & Priority Queue",
    topic: "Heap & Priority Queue",
    difficulty: "Medium",
    estimatedTime: "4.5 hrs",
    progress: 0,
    description: "Implement binary min/max heaps, extract priorities, maintain element bounds, and solve K-way merges.",
    theory: {
      overview: "A Heap is a complete binary tree that maintains the Heap Invariant: in a Max-Heap, any node's value is greater than or equal to its children (root holds the maximum value); in a Min-Heap, it is smaller than or equal (root holds the minimum value).",
      learningObjectives: [
        "Understand complete binary tree arrays and heap invariants.",
        "Implement min-heap and max-heap insertions and extractions.",
        "Use priority queues to track dynamic top-K subsets."
      ],
      theoryText: "Heaps are stored in arrays: index i has left child at 2i + 1 and right child at 2i + 2. Priority Queues return elements based on priority rather than arrival order, usually implemented via heaps.",
      patterns: [
        { title: "K-largest elements", desc: "Using a min-heap of size K to find largest elements in O(N log K) time." },
        { title: "Heap Sort Partitioning", desc: "Repeatedly retrieving the root priority node to sort elements." }
      ],
      complexities: [
        { op: "Insert / Delete node", time: "O(log N)", space: "O(1)" },
        { op: "Peek Top Priority", time: "O(1)", space: "O(1)" }
      ],
      codeExamples: [
        {
          title: "Dynamic Top-K Elements",
          code: "function topK(nums, k) {\n  // Using a Min-Heap of size K\n  const minHeap = new MinHeap(); // Pseudocode implementation\n  for (let n of nums) {\n    minHeap.insert(n);\n    if (minHeap.size() > k) {\n      minHeap.extractMin();\n    }\n  }\n  return minHeap.toArray();\n}",
          explanation: "Maintains a heap of size K. Extracts smaller elements, leaving only the K largest elements. Takes O(N log K) time."
        }
      ],
      importantNotes: [
        "Heapifying an array takes O(N) time, whereas inserting elements one by one takes O(N log N) time.",
        "Retrieving the min/max element is O(1); inserting or extracting requires bubbleUp/bubbleDown operations, taking O(log N) time."
      ],
      interviewQuestions: [
        { question: "Merge K sorted lists of total size N.", optimalComplexity: "Time: O(N log K) using a Min-Heap, Space: O(K)" }
      ],
      commonMistakes: [
        { mistake: "Trying to search for a specific value in a heap in O(log N) time.", solution: "Heaps are not sorted for arbitrary search. Searching is O(N) linear time." }
      ],
      summary: "Heaps maintain dynamic order, supporting extraction of the highest or lowest priority items in logarithmic time.",
      codeLanguage: "javascript"
    }
  },
  {
    number: "Module 09",
    name: "Graphs",
    topic: "Graphs",
    difficulty: "Hard",
    estimatedTime: "7.5 hrs",
    progress: 0,
    description: "Model vertices and edges using adjacency lists, DFS search recursive loops, BFS queues, and topological sorting.",
    theory: {
      overview: "Graphs are collections of nodes (vertices) linked by edges. They can be directed (one-way edges) or undirected (two-way), weighted or unweighted. Common representations include Adjacency Matrices and Adjacency Lists.",
      learningObjectives: [
        "Differentiate between Directed, Undirected, Weighted, and Unweighted Graphs.",
        "Represent structures with Adjacency Lists and Matrices.",
        "Solve search queries using BFS, DFS, and topological sorts."
      ],
      theoryText: "DFS utilizes recursion/stack to go deep, while BFS uses queues to explore level by level. BFS is optimal for finding the shortest path on unweighted graphs.",
      patterns: [
        { title: "Cycle Check (DFS)", desc: "Using vertex state colors (unvisited, visiting, visited) to detect loops." },
        { title: "Kahn's BFS Sorting", desc: "Topological ordering by processing vertices with zero incoming dependencies." }
      ],
      complexities: [
        { op: "DFS/BFS (Adjacency List)", time: "O(V + E)", space: "O(V)" },
        { op: "Dijkstra Shortest Path", time: "O((V + E) log V)", space: "O(V)" }
      ],
      codeExamples: [
        {
          title: "DFS Path Finder",
          code: "function hasPath(adjList, src, dst, visited = new Set()) {\n  if (src === dst) return true;\n  visited.add(src);\n  for (let neighbor of adjList[src] || []) {\n    if (!visited.has(neighbor)) {\n      if (hasPath(adjList, neighbor, dst, visited)) return true;\n    }\n  }\n  return false;\n}",
          explanation: "Explores neighbors recursively to check connectivity. Prevents cycles by tracking visited nodes. Runs in O(V + E) time."
        },
        {
          title: "Breadth-First Search on a Graph adjacency list",
          code: "function bfs(graph, start) {\n  const visited = new Set([start]);\n  const queue = [start];\n  while (queue.length) {\n    const node = queue.shift();\n    for (let neighbor of graph[node] || []) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n}",
          explanation: "Traverses graph level by level, ensuring shortest path discovery on unweighted vertices. Time: O(V + E)."
        }
      ],
      importantNotes: [
        "BFS is guaranteed to find the shortest path in an unweighted graph.",
        "Detecting cycles in a directed graph requires three-state coloring (visiting/visited/unvisited) to find back edges."
      ],
      interviewQuestions: [
        { question: "Find a topological sorting of a DAG (Directed Acyclic Graph) using Kahn's algorithm.", optimalComplexity: "Time: O(V + E), Space: O(V)" }
      ],
      commonMistakes: [
        { mistake: "Forgetting to track visited vertices in graphs containing cycles.", solution: "Causes infinite recursive loops. Always pass a visited set or array." }
      ],
      summary: "Graphs represent complex relations. Adjacency lists paired with BFS or DFS form the foundation of traversal, pathfinding, and topological ordering.",
      codeLanguage: "javascript"
    }
  },
  {
    number: "Module 10",
    name: "Dynamic Programming",
    topic: "Dynamic Programming",
    difficulty: "Hard",
    estimatedTime: "8.5 hrs",
    progress: 0,
    description: "Learn overlapping subproblem optimizations, top-down memoization, bottom-up tabulation, and knapsack variations.",
    theory: {
      overview: "Dynamic Programming (DP) is an optimization technique for recursive algorithms with overlapping subproblems. Instead of re-evaluating subproblems, solutions are saved in memory cache arrays.",
      learningObjectives: [
        "Identify overlapping subproblems and optimal substructure traits.",
        "Formulate state variables and transition recurrence relations.",
        "Implement top-down memoization and bottom-up tabulation."
      ],
      theoryText: "Dynamic Programming requires two conditions: Optimal Substructure (an optimal solution to the problem contains optimal solutions to its subproblems) and Overlapping Subproblems (subproblems are computed repeatedly). Top-down DP (Memoization) stores recursive outputs in a map or array. Bottom-up DP (Tabulation) computes results iteratively, filling up a DP table from the base cases to the target value. Space optimization is often possible by only storing the previous rows or states.",
      patterns: [
        { title: "0/1 Knapsack", desc: "Choices to include or exclude items under a weight limit." },
        { title: "Longest Common Subsequence", desc: "Comparing strings across multidimensional tables to match character arrays." }
      ],
      complexities: [
        { op: "Fibonacci (Brute-Force)", time: "O(2^N)", space: "O(N) recursion" },
        { op: "Fibonacci (DP memoized)", time: "O(N)", space: "O(N)" }
      ],
      codeExamples: [
        {
          title: "Unique Paths grid tabulation",
          code: "function uniquePaths(m, n) {\n  const dp = Array(m).fill().map(() => Array(n).fill(1));\n  for (let r = 1; r < m; r++) {\n    for (let c = 1; c < n; c++) {\n      dp[r][c] = dp[r-1][c] + dp[r][c-1];\n    }\n  }\n  return dp[m-1][n-1];\n}",
          explanation: "Fills a 2D grid from base values. Since you can only move down or right, paths to a cell are the sum of paths from the top and left. Takes O(M*N) time."
        }
      ],
      importantNotes: [
        "Top-down is easier to write when the state space is sparse.",
        "Bottom-up avoids call stack limit issues, making it faster in practice."
      ],
      interviewQuestions: [
        { question: "Find the minimum coins needed to make change for amount K.", optimalComplexity: "Time: O(N * K), Space: O(K)" }
      ],
      commonMistakes: [
        { mistake: "Incorrect base case initialization in the DP table.", solution: "Carefully trace base values (like i=0 or amount=0) before running transitions." }
      ],
      summary: "Dynamic Programming resolves overlapping subproblem iterations by storing results, trading memory space for optimal linear or polynomial runtime speeds.",
      codeLanguage: "javascript"
    }
  },
  {
    number: "Module 11",
    name: "Advanced Algorithms",
    topic: "Advanced Algorithms",
    difficulty: "Hard",
    estimatedTime: "6.5 hrs",
    progress: 0,
    description: "Study advanced concepts like Segment Trees, Trie prefix lookups, Union-Find network connections, and bit manipulation bounds.",
    theory: {
      overview: "Advanced algorithms solve niche constraints. Tries provide prefix lookups in O(L) time. Union-Find processes network merges in near O(1) time.",
      learningObjectives: [
        "Construct Trie node hierarchies for prefix lookups.",
        "Implement Union-Find (Disjoint Set Union) with path compression.",
        "Use bit manipulation operators for constant-time flag checks."
      ],
      theoryText: "A Trie (Prefix Tree) is a search tree used to store associative keys (typically strings) where node steps represent characters. Disjoint Set Union (DSU or Union-Find) manages partitions of elements, supporting Union and Find operations in near-constant time. Path Compression flattens trees during Find calls, making future lookups faster. Bit manipulation utilizes binary logical operators (&, |, ^, ~, <<, >>) to compute values in constant CPU cycles.",
      patterns: [
        { title: "Path Compression (DSU)", desc: "Directly linking child nodes to the absolute root to compress tree height." },
        { title: "Bitwise Masking", desc: "Using integers as bit flags to store boolean states compactly." }
      ],
      complexities: [
        { op: "Trie insert / search word", time: "O(L) word length", space: "O(L * Words)" },
        { op: "Union Find Union / Find", time: "O(alpha(N)) near O(1)", space: "O(N)" }
      ],
      codeExamples: [
        {
          title: "Union Find DSU with Path Compression",
          code: "class DSU {\n  constructor(size) {\n    this.parent = Array.from({length: size}, (_, i) => i);\n  }\n  find(i) {\n    if (this.parent[i] === i) return i;\n    this.parent[i] = this.find(this.parent[i]); // Path compression\n    return this.parent[i];\n  }\n  union(i, j) {\n    const rootI = this.find(i);\n    const rootJ = this.find(j);\n    if (rootI !== rootJ) {\n      this.parent[rootI] = rootJ;\n    }\n  }\n}",
          explanation: "A Disjoint Set Union implementation. Path compression inside the recursive find makes subsequent calls run in amortized O(alpha(N)) time."
        }
      ],
      importantNotes: [
        "Tries are optimal for search-by-prefix systems.",
        "Bitwise x & (x - 1) removes the lowest set bit from integer x, which is useful for counting active bits."
      ],
      interviewQuestions: [
        { question: "Count the number of set bits in an integer.", optimalComplexity: "Time: O(1) constant iterations, Space: O(1)" }
      ],
      commonMistakes: [
        { mistake: "Forgetting path compression in DSU find operations.", solution: "Results in tree heights degrading to O(N) paths. Always apply path compression." }
      ],
      summary: "Advanced data structures and bitwise operations solve complex subset and network partitioning challenges under strict resource limits.",
      codeLanguage: "javascript"
    }
  }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/syntac_admin";
    console.log(`Connecting to MongoDB for seeding modules...`);
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    console.log("Clearing existing Coding Modules...");
    await Module.deleteMany({});
    console.log("Existing modules cleared.");

    console.log(`Seeding ${modulesData.length} Coding Modules...`);
    await Module.insertMany(modulesData);
    console.log("Seeding completed successfully.");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding Error:", err);
    process.exit(1);
  }
}

seedDatabase();
