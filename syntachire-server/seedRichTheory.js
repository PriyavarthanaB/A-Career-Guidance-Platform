const mongoose = require("mongoose");
require("dotenv").config();
const Module = require("./models/Module");

const modulesWithRichTheory = [
  {
    number: "Module 01",
    name: "Programming Basics & Complexity",
    topic: "Programming Basics & Complexity",
    difficulty: "Easy",
    estimatedTime: "2.5 hrs",
    progress: 0,
    description: "Understand language syntax, execution runtimes, memory scopes, and mathematical representations of Big O time and space complexities.",
    theory: {
      overview: "Time complexity measures the execution steps of an algorithm, while Space complexity tracks auxiliary memory allocation. Both are expressed using Big O asymptotic notation.",
      learningObjectives: [
        "Understand compilation, memory allocation, stack vs heap behavior.",
        "Master Big-O, Big-Theta, and Big-Omega asymptotic notations.",
        "Calculate time and space bounds for iterative and recursive procedures.",
        "Differentiate between best-case, average-case, and worst-case analysis."
      ],
      theoryText: "Programming Basics encompasses variables, scopes, loops, conditionals, and functions. Memory models divide storage into the stack (fast, fixed-size allocation for local variables and function calls) and the heap (dynamic, variable-size allocation for objects and collections). Time Complexity measures the rate of growth of the operations relative to input size N, while Space Complexity measures auxiliary storage.",
      sections: [
        {
          title: "1. Asymptotic Notation (Big O, Big Ω, Big Θ)",
          content: "Big O notation describes the formal mathematical upper bound on algorithm growth as input size N approaches infinity. It guarantees that the execution time will not exceed a given mathematical curve regardless of input configuration.\n\n• Big O (O): Upper bound (worst-case performance ceiling)\n• Big Omega (Ω): Lower bound (best-case performance floor)\n• Big Theta (Θ): Tight bound (exact asymptotic growth rate)",
          codeSnippet: "// O(1) Constant Time\nfunction getFirstElement(arr) {\n  return arr[0];\n}\n\n// O(N) Linear Time\nfunction findElement(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}"
        },
        {
          title: "2. Memory Allocation: Stack vs Heap",
          content: "Understanding memory layout is essential for analyzing space complexity.\n\n• Stack Memory: Automatically managed, LIFO structure that stores primitive local variables and function call frames. Frame allocation/deallocation occurs in O(1) time.\n• Heap Memory: Dynamically allocated memory used for reference objects, arrays, and dynamic data structures. Garbage collected automatically in managed runtimes.",
          codeSnippet: "function callStackExample(n) {\n  if (n <= 0) return 0;\n  // Each recursive step pushes a call frame to the stack\n  return n + callStackExample(n - 1);\n} // Auxiliary Space: O(N) recursion stack depth"
        },
        {
          title: "3. Analyzing Iterative & Recursive Loop Structures",
          content: "To analyze loops:\n1. Count total iterations as a function of N.\n2. For nested loops, multiply outer iterations by inner iterations if inner loops depend on outer variables.\n3. For logarithmic loops, observe if the loop control variable is multiplied or divided by a constant factor in each step.",
          codeSnippet: "// Logarithmic Loop O(log N)\nlet i = N;\nwhile (i > 1) {\n  i = Math.floor(i / 2);\n}\n\n// Nested Dependent Loop O(N^2 / 2) -> O(N^2)\nfor (let i = 0; i < N; i++) {\n  for (let j = i; j < N; j++) {\n    // Executed N(N+1)/2 times\n  }\n}"
        }
      ],
      patterns: [
        { title: "Asymptotic Bounds", desc: "Determining O(1), O(log N), O(N), O(N log N), O(N^2), and O(2^N) limits." },
        { title: "Auxiliary Space", desc: "Accounting for recursion stack frames and dynamically allocated collections." },
        { title: "Drop Constants & Lower Terms", desc: "Simplifying O(3N + 5) to O(N) since dominant terms dictate infinite growth." }
      ],
      complexities: [
        { op: "Single Loop Traversal", time: "O(N)", space: "O(1)" },
        { op: "Nested Loops Traverse", time: "O(N^2)", space: "O(1)" },
        { op: "Halving Loop (Binary style)", time: "O(log N)", space: "O(1)" },
        { op: "Recursive branching (2 calls/level)", time: "O(2^N)", space: "O(N)" }
      ],
      codeExamples: [
        {
          title: "Binary Search Implementation O(log N)",
          code: "function binarySearch(arr, val) {\n  let l = 0, r = arr.length - 1;\n  while (l <= r) {\n    let m = Math.floor((l + r) / 2);\n    if (arr[m] === val) return m;\n    else if (arr[m] < val) l = m + 1;\n    else r = m - 1;\n  }\n  return -1;\n}",
          explanation: "Halves the search space in each step, yielding logarithmic runtime O(log N)."
        }
      ],
      commonMistakes: [
        { mistake: "Assuming all nested loops result in O(N^2) complexity.", solution: "Analyze loop variables carefully; some nested loops divide index space leading to O(N log N) or O(N)." },
        { mistake: "Neglecting recursion stack space.", solution: "Always count the maximum depth of the recursive call stack." }
      ],
      summary: "Mastering Big O complexity analysis is the foundational prerequisite for all technical interviews.",
      quiz: [
        {
          question: "What is the time complexity of a loop that halves its search range each iteration?",
          options: ["O(N)", "O(log N)", "O(N log N)", "O(1)"],
          correctAnswer: "O(log N)",
          explanation: "Halving the range each step means the number of iterations grows logarithmically with N, as in binary search."
        },
        {
          question: "A function makes two recursive calls per invocation with no memoization. What is its time complexity?",
          options: ["O(N)", "O(N log N)", "O(2^N)", "O(log N)"],
          correctAnswer: "O(2^N)",
          explanation: "Unmemoized branching recursion (like naive Fibonacci) explores an exponential number of call paths."
        }
      ]
    }
  },
  {
    number: "Module 02",
    name: "Arrays",
    topic: "Arrays",
    difficulty: "Easy",
    estimatedTime: "3.5 hrs",
    progress: 0,
    description: "Master array operations, contiguous memory representations, in-place modifications, and prefix sum arrays.",
    theory: {
      overview: "Arrays are contiguous blocks of memory containing indexed elements. They offer instant O(1) random access by index.",
      learningObjectives: [
        "Understand contiguous memory address calculation.",
        "Master Two-Pointer & Sliding Window techniques.",
        "Implement Prefix Sums and Difference Arrays for range queries.",
        "Perform in-place element mutations efficiently."
      ],
      theoryText: "Arrays store elements in sequential memory locations. Indexing is computed directly via pointer arithmetic: Address(arr[i]) = BaseAddress + i * ElementSize. This enables instant O(1) indexing, but inserting or deleting elements forces shifting existing items, costing O(N) linear time.",
      sections: [
        {
          title: "1. Two-Pointer Technique (Opposite & Same Direction)",
          content: "The Two-Pointer approach uses two index variables to scan an array simultaneously, reducing runtime from O(N^2) to O(N).\n\n• Opposite-direction pointers: Start at opposite ends (left=0, right=N-1) and move inward. Used for searching pairs in sorted arrays, palindrome checking, and container capacity calculations.\n• Fast & Slow pointers: Both start at the beginning but advance at different speeds. Used for in-place deduplication and cycle detection.",
          codeSnippet: "// Two Sum II - Input Array Is Sorted (Opposite Pointers)\nfunction twoSum(numbers, target) {\n  let left = 0, right = numbers.length - 1;\n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n    if (sum === target) return [left + 1, right + 1];\n    else if (sum < target) left++;\n    else right--;\n  }\n  return [];\n}"
        },
        {
          title: "2. Sliding Window Pattern (Fixed & Variable Size)",
          content: "Sliding Window converts nested loops into a linear scan by maintaining a running window over contiguous elements.\n\n• Fixed Window: Window size K remains constant. Slide window right by adding the incoming element and subtracting the outgoing element in O(1) time.\n• Variable Window: Window expands right to include elements and shrinks left when constraints are violated, tracking maximum or minimum window length.",
          codeSnippet: "// Maximum Sum Subarray of Size K (Fixed Window)\nfunction maxSubarraySum(arr, k) {\n  let maxSum = 0, windowSum = 0;\n  for (let i = 0; i < k; i++) windowSum += arr[i];\n  maxSum = windowSum;\n  for (let i = k; i < arr.length; i++) {\n    windowSum += arr[i] - arr[i - k];\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}"
        },
        {
          title: "3. Prefix Sum Technique for Range Queries",
          content: "Prefix Sum preprocessing builds an array P where P[i] stores the sum of elements from index 0 to i-1. Querying the sum of subarray [L, R] takes instant O(1) time: Sum(L..R) = P[R + 1] - P[L].",
          codeSnippet: "class PrefixSum {\n  constructor(nums) {\n    this.prefix = new Array(nums.length + 1).fill(0);\n    for (let i = 0; i < nums.length; i++) {\n      this.prefix[i + 1] = this.prefix[i] + nums[i];\n    }\n  }\n  query(left, right) {\n    return this.prefix[right + 1] - this.prefix[left];\n  }\n}"
        }
      ],
      patterns: [
        { title: "Two-Pointer Converge", desc: "Scan sorted arrays from both ends inward to find matching pairs in O(N)." },
        { title: "Sliding Window", desc: "Maintain running statistics over contiguous subarrays without re-scanning." },
        { title: "Prefix Sum Precomputation", desc: "Pre-calculate cumulative sums to evaluate range sum queries in O(1) time." }
      ],
      complexities: [
        { op: "Random Index Access", time: "O(1)", space: "O(1)" },
        { op: "Insertion/Deletion at Start/Middle", time: "O(N)", space: "O(1)" },
        { op: "Push to End (Dynamic Array)", time: "Amortized O(1)", space: "O(1)" },
        { op: "Prefix Sum Range Query", time: "O(1)", space: "O(N) aux" }
      ],
      codeExamples: [
        {
          title: "Move Zeroes In-Place O(N) Time O(1) Space",
          code: "function moveZeroes(nums) {\n  let insertPos = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== 0) {\n      nums[insertPos++] = nums[i];\n    }\n  }\n  while (insertPos < nums.length) {\n    nums[insertPos++] = 0;\n  }\n}",
          explanation: "Maintains a slow insertion pointer to overwrite zero values, modifying the array in-place."
        }
      ],
      commonMistakes: [
        { mistake: "Off-by-one errors when managing sliding window bounds.", solution: "Define whether window boundaries [left, right] are inclusive or exclusive and stick to it." },
        { mistake: "Creating new array slices inside loops.", solution: "Slicing creates shallow copies costing O(K) time and space. Use pointers instead." }
      ],
      summary: "Arrays form the backbone of memory layout. Mastering two-pointer, sliding window, and prefix sums resolves majority of array interview challenges.",
      quiz: [
        {
          question: "What is the time complexity of looking up an element in an array by its index?",
          options: ["O(N)", "O(log N)", "O(1)", "O(N^2)"],
          correctAnswer: "O(1)",
          explanation: "Array memory is contiguous, so the address can be calculated directly using index offset."
        },
        {
          question: "Which technique is best suited for finding the longest contiguous subarray with sum <= K?",
          options: ["Binary Search Tree", "Variable-size Sliding Window", "Graph BFS", "Recursion"],
          correctAnswer: "Variable-size Sliding Window",
          explanation: "Variable sliding window expands right and contracts left to find max length in linear O(N) time."
        }
      ]
    }
  },
  {
    number: "Module 03",
    name: "Strings",
    topic: "Strings",
    difficulty: "Easy",
    estimatedTime: "3 hrs",
    progress: 0,
    description: "Understand string immutability, character encodings (ASCII/UTF-8), anagram checking, and sliding window substring searches.",
    theory: {
      overview: "Strings are sequences of characters. In languages like JS, Python, and Java, strings are immutable, making string modification an O(N) copy operation.",
      learningObjectives: [
        "Understand string immutability and memory overhead.",
        "Master frequency arrays and hash maps for character accounting.",
        "Implement anagram and palindrome verification algorithms.",
        "Apply sliding window to complex substring challenges."
      ],
      theoryText: "String immutability means modifying a string generates a completely new string in memory. Repeated string concatenation in a loop (e.g., s += char) creates O(N^2) runtime due to copying N characters N times. Always use an array accumulator (e.g. arr.push() then arr.join('')) to build strings in linear O(N) time.",
      sections: [
        {
          title: "1. String Immutability & StringBuilder Pattern",
          content: "In JavaScript, Java, and Python, string operations like concatenation create a new string object.\n\n• Concatenating in a loop: O(N^2) time.\n• Array join / StringBuilder pattern: Push characters into an array and call .join('') at the end, taking O(N) total time.",
          codeSnippet: "// Efficient String Building\nfunction reverseString(s) {\n  const chars = s.split('');\n  let l = 0, r = chars.length - 1;\n  while (l < r) {\n    [chars[l], chars[r]] = [chars[r], chars[l]];\n    l++; r--;\n  }\n  return chars.join('');\n}"
        },
        {
          title: "2. Frequency Mapping for Anagrams & Palindromes",
          content: "Character counting using fixed-size frequency arrays (size 26 for lowercase English letters) provides fast O(1) extra space comparison.\n\nTwo strings are valid anagrams if their character frequency maps are identical.",
          codeSnippet: "function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = new Array(26).fill(0);\n  for (let i = 0; i < s.length; i++) {\n    count[s.charCodeAt(i) - 97]++;\n    count[t.charCodeAt(i) - 97]--;\n  }\n  return count.every(c => c === 0);\n}"
        },
        {
          title: "3. Longest Substring Without Repeating Characters",
          content: "Use a sliding window with a Set or Map tracking the last seen index of each character to expand and contract the active substring window.",
          codeSnippet: "function lengthOfLongestSubstring(s) {\n  const map = new Map();\n  let maxLen = 0, left = 0;\n  for (let right = 0; right < s.length; right++) {\n    if (map.has(s[right])) {\n      left = Math.max(left, map.get(s[right]) + 1);\n    }\n    map.set(s[right], right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}"
        }
      ],
      patterns: [
        { title: "Fixed Character Array", desc: "Use array of size 26 or 128 instead of HashMaps for constant space character counts." },
        { title: "Expand Around Center", desc: "Find palindromic substrings by expanding outward from every index in O(N^2) time and O(1) space." },
        { title: "Sliding Window Substring", desc: "Track character frequencies within a window to find minimum/maximum substrings in linear time." }
      ],
      complexities: [
        { op: "Character Access by Index", time: "O(1)", space: "O(1)" },
        { op: "String Concatenation (In loop)", time: "O(N^2)", space: "O(N)" },
        { op: "Array Join / StringBuilder", time: "O(N)", space: "O(N)" },
        { op: "Anagram Check", time: "O(N)", space: "O(1) aux (26 chars)" }
      ],
      codeExamples: [
        {
          title: "Valid Palindrome Verification",
          code: "function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let l = 0, r = clean.length - 1;\n  while (l < r) {\n    if (clean[l] !== clean[r]) return false;\n    l++; r--;\n  }\n  return true;\n}",
          explanation: "Cleans string and uses two pointers to verify character matching from outside inward."
        }
      ],
      commonMistakes: [
        { mistake: "Doing string concatenation `s += char` inside a loop.", solution: "Collect characters in an array and join them once at the end." },
        { mistake: "Ignoring Unicode or multi-byte character encodings.", solution: "Be aware of character code points when dealing with non-ASCII strings." }
      ],
      summary: "Strings are fundamental across web APIs and data parsing. Always account for immutability memory overhead.",
      quiz: [
        {
          question: "Why does repeated string concatenation `s += char` in a loop take O(N^2) time in JavaScript?",
          options: [
            "Strings are immutable, so every iteration copies the entire growing string.",
            "JavaScript loops run in quadratic time by default.",
            "Character lookup is O(N).",
            "Strings are stored as trees."
          ],
          correctAnswer: "Strings are immutable, so every iteration copies the entire growing string.",
          explanation: "Because strings are immutable, creating a new string of length k takes O(k) time, summing to O(N^2) over N iterations."
        }
      ]
    }
  },
  {
    number: "Module 04",
    name: "Hashing & Hash Tables",
    topic: "Hashing",
    difficulty: "Medium",
    estimatedTime: "4 hrs",
    progress: 0,
    description: "Explore hash functions, hash maps, sets, collision resolution strategies, and frequency counting patterns.",
    theory: {
      overview: "Hash tables map key-value pairs using a hash function. They provide average O(1) constant time for insertion, lookup, and deletion.",
      learningObjectives: [
        "Understand hash functions and collision mechanisms.",
        "Master Separate Chaining vs Open Addressing.",
        "Apply HashMaps for O(N) Two-Sum and complementary target searches.",
        "Implement Set operations for duplicate tracking and intersection."
      ],
      theoryText: "A Hash Table uses a hash function to map keys into indices of an array of buckets. When two keys yield the same index (a hash collision), resolution strategies like Separate Chaining (linked list at bucket) or Open Addressing (linear/quadratic probing) preserve key lookup capability.",
      sections: [
        {
          title: "1. Hash Functions & Collision Resolution",
          content: "A collision occurs when hash(key1) === hash(key2).\n\n• Separate Chaining: Buckets store linked lists or balanced trees. Average lookup remains O(1); worst case degrades to O(N) if all keys hash to one bucket.\n• Open Addressing: Searches neighboring slots via linear probing, quadratic probing, or double hashing until an empty bucket is found.",
          codeSnippet: "// HashMap Frequency Counter Pattern\nfunction topKFrequent(nums, k) {\n  const countMap = new Map();\n  for (const num of nums) {\n    countMap.set(num, (countMap.get(num) || 0) + 1);\n  }\n  return Array.from(countMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, k).map(entry => entry[0]);\n}"
        },
        {
          title: "2. Two Sum & Complement Lookup Pattern",
          content: "Instead of nested loops checking every pair (O(N^2)), store visited elements in a HashMap. For current element X, check if target - X exists in the Map in O(1) time.",
          codeSnippet: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) {\n      return [map.get(diff), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}"
        }
      ],
      patterns: [
        { title: "Complement Lookup", desc: "Store seen numbers in HashMap to locate matching target pairs in one linear pass." },
        { title: "Group Anagrams", desc: "Use sorted strings or character frequency tuples as keys in a HashMap." }
      ],
      complexities: [
        { op: "HashMap Insertion / Lookup (Avg)", time: "O(1)", space: "O(N)" },
        { op: "HashMap Insertion / Lookup (Worst)", time: "O(N)", space: "O(N)" }
      ],
      codeExamples: [
        {
          title: "Group Anagrams Implementation",
          code: "function groupAnagrams(strs) {\n  const map = new Map();\n  for (const s of strs) {\n    const key = s.split('').sort().join('');\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(s);\n  }\n  return Array.from(map.values());\n}",
          explanation: "Sorts each word to create a normalized key, grouping anagrams together."
        }
      ],
      commonMistakes: [
        { mistake: "Using mutable objects as map keys in custom implementations.", solution: "Ensure keys produce immutable hash values." }
      ],
      summary: "Hash Tables are the single most frequently used data structure in coding interviews due to their O(1) lookups.",
      quiz: [
        {
          question: "What is the average time complexity for searching a key in a Hash Table?",
          options: ["O(N)", "O(log N)", "O(1)", "O(N^2)"],
          correctAnswer: "O(1)",
          explanation: "Hash computation and direct bucket indexing provide O(1) average lookup time."
        }
      ]
    }
  },
  {
    number: "Module 05",
    name: "Linked Lists",
    topic: "Linked Lists",
    difficulty: "Medium",
    estimatedTime: "4 hrs",
    progress: 0,
    description: "Master singly & doubly linked lists, pointer manipulation, Fast & Slow pointer techniques, and list reversal.",
    theory: {
      overview: "Linked lists store nodes containing data and pointers to subsequent nodes. They offer O(1) insertion/deletion at known nodes without memory re-allocation.",
      learningObjectives: [
        "Understand node structures and pointer updates.",
        "Implement in-place iterative and recursive list reversal.",
        "Use Fast & Slow pointers for cycle detection (Floyd's Algorithm).",
        "Utilize dummy head nodes to simplify boundary conditions."
      ],
      theoryText: "Unlike arrays, linked lists do not store elements contiguously in memory. Each node contains a value and a next pointer (plus a prev pointer in doubly linked lists). Accessing an element requires sequential traversal from the head, taking O(N) time.",
      sections: [
        {
          title: "1. Pointer Reversal (Iterative & Recursive)",
          content: "Reversing a linked list requires updating next pointers to point backwards while keeping track of previous, current, and next nodes.",
          codeSnippet: "function reverseList(head) {\n  let prev = null, curr = head;\n  while (curr !== null) {\n    let nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}"
        },
        {
          title: "2. Fast & Slow Pointers (Floyd's Cycle Detection)",
          content: "Advance slow by 1 step and fast by 2 steps. If a cycle exists, fast will eventually meet slow inside the cycle.",
          codeSnippet: "function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast !== null && fast.next !== null) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}"
        },
        {
          title: "3. Dummy Head Pattern for Boundary Simplification",
          content: "Creating a dummy head node eliminates edge-case checks for inserting or removing the first node of a list.",
          codeSnippet: "function mergeTwoLists(l1, l2) {\n  const dummy = { val: 0, next: null };\n  let tail = dummy;\n  while (l1 && l2) {\n    if (l1.val < l2.val) { tail.next = l1; l1 = l1.next; }\n    else { tail.next = l2; l2 = l2.next; }\n    tail = tail.next;\n  }\n  tail.next = l1 || l2;\n  return dummy.next;\n}"
        }
      ],
      patterns: [
        { title: "Dummy Head", desc: "Use a dummy head node to streamline head node insertion and deletion." },
        { title: "Tortoise & Hare", desc: "Find midpoints or detect cycles using 1-step and 2-step pointers." }
      ],
      complexities: [
        { op: "Insertion/Deletion at Head", time: "O(1)", space: "O(1)" },
        { op: "Search by Value / Index", time: "O(N)", space: "O(1)" },
        { op: "List Reversal In-Place", time: "O(N)", space: "O(1)" }
      ],
      codeExamples: [
        {
          title: "Middle of the Linked List",
          code: "function middleNode(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n  return slow;\n}",
          explanation: "When fast reaches the end, slow is exactly at the middle node."
        }
      ],
      commonMistakes: [
        { mistake: "Losing head reference by advancing head directly without dummy pointers.", solution: "Keep head pointer intact or use dummy nodes." },
        { mistake: "Dereferencing null pointer (`curr.next.val` when `curr.next` is null).", solution: "Always check `curr && curr.next` before access." }
      ],
      summary: "Linked lists test your mastery of pointers. The Dummy Head and Fast & Slow pointer techniques solve 90% of list problems.",
      quiz: [
        {
          question: "What is the time complexity of reversing a singly linked list in-place?",
          options: ["O(N^2)", "O(N)", "O(log N)", "O(1)"],
          correctAnswer: "O(N)",
          explanation: "Iterative reversal visits each node once and updates pointer directions in O(N) time."
        }
      ]
    }
  },
  {
    number: "Module 06",
    name: "Stacks & Queues",
    topic: "Stacks & Queues",
    difficulty: "Medium",
    estimatedTime: "4 hrs",
    progress: 0,
    description: "Understand LIFO stack and FIFO queue mechanics, monotonic stacks, and priority queue applications.",
    theory: {
      overview: "Stacks operate on Last-In-First-Out (LIFO) and Queues operate on First-In-First-Out (FIFO) semantics.",
      learningObjectives: [
        "Understand LIFO vs FIFO execution order.",
        "Implement balanced parenthesis and expression evaluation algorithms.",
        "Master Monotonic Stack pattern for next greater element problems.",
        "Design Double-Ended Queues (Deque) for sliding window maximum."
      ],
      theoryText: "A Stack pushes and pops items from the top (LIFO). A Queue enqueues items at the back and dequeues items from the front (FIFO). Monotonic Stacks maintain elements in strict increasing or decreasing order to solve next-greater or daily temperature problems in linear O(N) time.",
      sections: [
        {
          title: "1. Stack Basics & Expression Parsing",
          content: "Stacks are ideal for tracking nested state, matching parentheses, and evaluating infix/postfix algebraic expressions.",
          codeSnippet: "function isValidParentheses(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (let char of s) {\n    if (char in map) {\n      if (stack.pop() !== map[char]) return false;\n    } else {\n      stack.push(char);\n    }\n  }\n  return stack.length === 0;\n}"
        },
        {
          title: "2. Monotonic Stack Pattern",
          content: "A Monotonic Stack keeps elements in monotonic order. When a new element breaks the order, pop items off the stack, computing next-greater or next-smaller properties.",
          codeSnippet: "// Daily Temperatures - Next Greater Element\nfunction dailyTemperatures(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = []; // stores indices\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prevIdx = stack.pop();\n      res[prevIdx] = i - prevIdx;\n    }\n    stack.push(i);\n  }\n  return res;\n}"
        }
      ],
      patterns: [
        { title: "Matching Brackets", desc: "Push opening brackets and pop matching closing brackets." },
        { title: "Monotonic Stack", desc: "Maintain ordered items to calculate nearest greater/smaller boundaries in O(N)." }
      ],
      complexities: [
        { op: "Stack Push / Pop", time: "O(1)", space: "O(1)" },
        { op: "Queue Enqueue / Dequeue", time: "O(1)", space: "O(1)" },
        { op: "Monotonic Stack Processing", time: "O(N)", space: "O(N)" }
      ],
      codeExamples: [
        {
          title: "Min Stack Design O(1) All Ops",
          code: "class MinStack {\n  constructor() { this.stack = []; this.minStack = []; }\n  push(val) {\n    this.stack.push(val);\n    const currentMin = this.minStack.length > 0 ? Math.min(val, this.getMin()) : val;\n    this.minStack.push(currentMin);\n  }\n  pop() { this.stack.pop(); this.minStack.pop(); }\n  top() { return this.stack[this.stack.length - 1]; }\n  getMin() { return this.minStack[this.minStack.length - 1]; }\n}",
          explanation: "Maintains an auxiliary stack tracking the minimum element up to each stack height."
        }
      ],
      commonMistakes: [
        { mistake: "Using `Array.shift()` for queues in JS.", solution: "`shift()` takes O(N) time. Use index pointers or a custom linked queue for O(1) dequeue." }
      ],
      summary: "Stacks and Queues manage evaluation order. Monotonic stacks turn O(N^2) boundary searches into linear O(N) algorithms.",
      quiz: [
        {
          question: "Which data structure follows Last-In-First-Out (LIFO)?",
          options: ["Queue", "Stack", "Heap", "Graph"],
          correctAnswer: "Stack",
          explanation: "Stacks add and remove elements from the top (LIFO)."
        }
      ]
    }
  },
  {
    number: "Module 07",
    name: "Trees & Binary Search Trees",
    topic: "Trees",
    difficulty: "Medium",
    estimatedTime: "5 hrs",
    progress: 0,
    description: "Understand tree hierarchies, DFS traversals (Pre, In, Post-order), BFS level-order traversal, and BST properties.",
    theory: {
      overview: "Trees are non-linear hierarchical data structures consisting of root, parent, and child nodes without cycles.",
      learningObjectives: [
        "Master Pre-order, In-order, and Post-order DFS traversals.",
        "Implement BFS Level-Order Traversal using Queues.",
        "Leverage Binary Search Tree (BST) ordering properties.",
        "Solve Lowest Common Ancestor (LCA) and Tree Depth problems."
      ],
      theoryText: "A Binary Tree is a tree where each node has at most two children. In a Binary Search Tree (BST), for every node, values in its left subtree are strictly smaller and values in its right subtree are strictly larger. In-order traversal of a BST yields values in sorted order.",
      sections: [
        {
          title: "1. DFS Traversals (Pre-order, In-order, Post-order)",
          content: "• Pre-order (Root, Left, Right): Used for cloning trees and serialization.\n• In-order (Left, Root, Right): Returns sorted node values for BSTs.\n• Post-order (Left, Right, Root): Used for node deletion and evaluating recursive subtree metrics.",
          codeSnippet: "function maxDepth(root) {\n  if (root === null) return 0;\n  const leftDepth = maxDepth(root.left);\n  const rightDepth = maxDepth(root.right);\n  return Math.max(leftDepth, rightDepth) + 1;\n}"
        },
        {
          title: "2. BFS Level-Order Traversal",
          content: "Use a Queue to process nodes level by level from top to bottom, left to right.",
          codeSnippet: "function levelOrder(root) {\n  if (!root) return [];\n  const result = [], queue = [root];\n  while (queue.length > 0) {\n    const levelSize = queue.length;\n    const currentLevel = [];\n    for (let i = 0; i < levelSize; i++) {\n      const node = queue.shift();\n      currentLevel.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    result.push(currentLevel);\n  }\n  return result;\n}"
        }
      ],
      patterns: [
        { title: "DFS Subtree Recursion", desc: "Compute subtree heights and values recursively from bottom up." },
        { title: "BST Property Search", desc: "Navigate left or right branches to achieve O(log N) search runtime." }
      ],
      complexities: [
        { op: "Tree Traversal (DFS / BFS)", time: "O(N)", space: "O(H) call stack" },
        { op: "BST Search / Insert (Balanced)", time: "O(log N)", space: "O(log N)" },
        { op: "BST Search (Degenerate skewed)", time: "O(N)", space: "O(N)" }
      ],
      codeExamples: [
        {
          title: "Validate Binary Search Tree",
          code: "function isValidBST(root, min = null, max = null) {\n  if (!root) return true;\n  if ((min !== null && root.val <= min) || (max !== null && root.val >= max)) return false;\n  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);\n}",
          explanation: "Validates that every node satisfies the strict subtree range bounds [min, max]."
        }
      ],
      commonMistakes: [
        { mistake: "Assuming checking child values directly proves a tree is a valid BST.", solution: "All nodes in the left subtree must be smaller than root, not just the immediate child." }
      ],
      summary: "Trees test recursive thinking. DFS explores subtrees deeply while BFS explores level by level.",
      quiz: [
        {
          question: "Which tree traversal order yields values of a BST in ascending sorted order?",
          options: ["Pre-order", "In-order", "Post-order", "Level-order"],
          correctAnswer: "In-order",
          explanation: "In-order traversal visits Left -> Root -> Right, generating sorted elements for BSTs."
        }
      ]
    }
  },
  {
    number: "Module 08",
    name: "Heaps & Priority Queues",
    topic: "Heaps",
    difficulty: "Hard",
    estimatedTime: "4.5 hrs",
    progress: 0,
    description: "Learn min-heap and max-heap array representations, bubble-up/sift-down operations, and Top-K elements patterns.",
    theory: {
      overview: "A Heap is a complete binary tree satisfying the heap property: parent nodes are always smaller (min-heap) or larger (max-heap) than their children.",
      learningObjectives: [
        "Understand heap representation inside flat arrays.",
        "Implement Heapify, Sift-Up, and Sift-Down operations.",
        "Solve Top-K Frequent and Kth Largest Element challenges.",
        "Master the Two-Heap pattern for continuous median finding."
      ],
      theoryText: "Heaps store elements in an array without explicitly allocating pointers: for parent index i, left child is at `2i + 1`, right child at `2i + 2`, and parent at `floor((i - 1) / 2)`. Insertions and removals run in O(log N) time, while accessing the minimum/maximum element takes O(1) time.",
      sections: [
        {
          title: "1. Array Representation & Heap Property",
          content: "• Min-Heap: Root contains the minimum element (`arr[parent] <= arr[child]`).\n• Max-Heap: Root contains the maximum element (`arr[parent] >= arr[child]`).",
          codeSnippet: "// MinHeap Class Skeleton\nclass MinHeap {\n  constructor() { this.heap = []; }\n  getParent(i) { return Math.floor((i - 1) / 2); }\n  getLeft(i) { return 2 * i + 1; }\n  getRight(i) { return 2 * i + 2; }\n  peek() { return this.heap[0] || null; }\n}"
        },
        {
          title: "2. Top-K Elements Pattern",
          content: "To find the Kth largest element in an array, maintain a Min-Heap of size K. When heap size exceeds K, pop the smallest item. At the end, the root is the Kth largest element, running in O(N log K) time.",
          codeSnippet: "function findKthLargest(nums, k) {\n  const minHeap = new MinHeap();\n  for (let num of nums) {\n    minHeap.insert(num);\n    if (minHeap.size() > k) minHeap.extractMin();\n  }\n  return minHeap.peek();\n}"
        }
      ],
      patterns: [
        { title: "Top-K Elements", desc: "Use a Min-Heap of size K to find top elements in O(N log K) time." },
        { title: "Two-Heaps", desc: "Combine a Max-Heap (smaller half) and Min-Heap (larger half) for running median computation." }
      ],
      complexities: [
        { op: "Peek Max / Min", time: "O(1)", space: "O(1)" },
        { op: "Insert / Push", time: "O(log N)", space: "O(1)" },
        { op: "Extract Max / Min", time: "O(log N)", space: "O(1)" },
        { op: "Heapify Array of size N", time: "O(N)", space: "O(1)" }
      ],
      codeExamples: [
        {
          title: "Merge K Sorted Lists Strategy",
          code: "// Push head of each list to MinHeap, extract min, push next node.\n// Time: O(N log K) where N is total nodes, K is list count.",
          explanation: "Extracting the global minimum across K lists efficiently using a Min-Heap."
        }
      ],
      commonMistakes: [
        { mistake: "Building a heap by N calls to insert (O(N log N)) instead of `heapify` (O(N)).", solution: "Use bottom-up heapify for O(N) initial construction." }
      ],
      summary: "Heaps provide fast access to extreme values (min/max). Top-K and Two-Heap patterns are essential interview tools.",
      quiz: [
        {
          question: "What is the time complexity of finding the minimum element in a valid Min-Heap?",
          options: ["O(N)", "O(log N)", "O(1)", "O(N log N)"],
          correctAnswer: "O(1)",
          explanation: "The minimum element always resides at the root index 0 of a Min-Heap."
        }
      ]
    }
  },
  {
    number: "Module 09",
    name: "Graphs & Graph Algorithms",
    topic: "Graphs",
    difficulty: "Hard",
    estimatedTime: "6 hrs",
    progress: 0,
    description: "Master graph representations (adjacency lists), BFS shortest paths, DFS connected components, Topological Sort, and Dijkstra's algorithm.",
    theory: {
      overview: "Graphs consist of vertices (nodes) and edges (connections). They model networks, social connections, and dependencies.",
      learningObjectives: [
        "Represent graphs using Adjacency Lists and Matrices.",
        "Implement BFS for unweighted shortest path calculation.",
        "Implement DFS for cycle detection and connected components.",
        "Master Topological Sort (Kahn's Algorithm / Indegree).",
        "Apply Dijkstra's algorithm for weighted shortest paths."
      ],
      theoryText: "A Graph G = (V, E) is directed or undirected, weighted or unweighted. Adjacency lists use O(V + E) space and are optimal for sparse graphs. Breadth-First Search (BFS) explores level-by-level using a Queue, guaranteeing shortest path in unweighted graphs.",
      sections: [
        {
          title: "1. Graph Representation: Adjacency List",
          content: "Map each node to an array of its neighbors. This takes O(V + E) space.",
          codeSnippet: "const graph = {\n  0: [1, 2],\n  1: [0, 3],\n  2: [0, 3],\n  3: [1, 2]\n};"
        },
        {
          title: "2. BFS Shortest Path & DFS Cycle Detection",
          content: "• BFS: Uses a queue and visited set. Guarantees fewest edges path from source to target.\n• DFS: Uses recursion stack to explore branches deeply. Used for cycle detection and connected components.",
          codeSnippet: "function bfsShortestPath(graph, start, target) {\n  const visited = new Set([start]);\n  const queue = [[start, 0]]; // [node, distance]\n  while (queue.length > 0) {\n    const [curr, dist] = queue.shift();\n    if (curr === target) return dist;\n    for (let neighbor of (graph[curr] || [])) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push([neighbor, dist + 1]);\n      }\n    }\n  }\n  return -1;\n}"
        },
        {
          title: "3. Topological Sort (Kahn's Algorithm)",
          content: "Orders vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u comes before v. Used for task scheduling and build dependencies.",
          codeSnippet: "function canFinish(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0);\n  const adj = Array.from({ length: numCourses }, () => []);\n  for (let [course, pre] of prerequisites) {\n    adj[pre].push(course);\n    inDegree[course]++;\n  }\n  const queue = [];\n  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i);\n  let count = 0;\n  while (queue.length > 0) {\n    const curr = queue.shift();\n    count++;\n    for (let neighbor of adj[curr]) {\n      inDegree[neighbor]--;\n      if (inDegree[neighbor] === 0) queue.push(neighbor);\n    }\n  }\n  return count === numCourses;\n}"
        }
      ],
      patterns: [
        { title: "BFS Level Order", desc: "Find shortest paths on unweighted graphs level by level." },
        { title: "Topological Order", desc: "Resolve dependency orderings using indegree counts and queue processing." }
      ],
      complexities: [
        { op: "BFS / DFS Traversal", time: "O(V + E)", space: "O(V)" },
        { op: "Topological Sort (Kahn's)", time: "O(V + E)", space: "O(V)" },
        { op: "Dijkstra's Algorithm (with MinHeap)", time: "O((V + E) log V)", space: "O(V)" }
      ],
      codeExamples: [
        {
          title: "Number of Islands (DFS Grid Traversal)",
          code: "function numIslands(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  const rows = grid.length, cols = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === '0') return;\n    grid[r][c] = '0'; // mark visited\n    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);\n  }\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}",
          explanation: "Sinks connected land tiles using DFS to count connected components."
        }
      ],
      commonMistakes: [
        { mistake: "Forgetting to mark nodes as visited before pushing to the BFS queue.", solution: "Mark visited immediately upon queue insertion to prevent duplicate node pushes." }
      ],
      summary: "Graphs represent real-world networks. BFS finds unweighted shortest paths; DFS explores components and cycles.",
      quiz: [
        {
          question: "Which algorithm finds the shortest path between nodes in an unweighted graph?",
          options: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Pre-order Traversal", "Binary Search"],
          correctAnswer: "Breadth-First Search (BFS)",
          explanation: "BFS expands outward in concentric levels, guaranteeing shortest edge distance in unweighted graphs."
        }
      ]
    }
  },
  {
    number: "Module 10",
    name: "Dynamic Programming",
    topic: "Dynamic Programming",
    difficulty: "Hard",
    estimatedTime: "6 hrs",
    progress: 0,
    description: "Master subproblem breakdown, memoization (top-down), tabulation (bottom-up), 1D/2D DP tables, and state optimization.",
    theory: {
      overview: "Dynamic Programming breaks complex optimization problems into overlapping subproblems with optimal substructure.",
      learningObjectives: [
        "Identify Optimal Substructure and Overlapping Subproblems.",
        "Implement Top-Down DP with Memoization.",
        "Implement Bottom-Up DP with Tabulation.",
        "Optimize 2D DP space down to 1D space."
      ],
      theoryText: "DP applies when a problem satisfies:\n1. Optimal Substructure: An optimal solution contains optimal solutions to subproblems.\n2. Overlapping Subproblems: The same subproblems are solved repeatedly.\n\nMemoization caches recursive results in a Map/Array. Tabulation fills a table iteratively from base cases up.",
      sections: [
        {
          title: "1. Memoization (Top-Down) vs Tabulation (Bottom-Up)",
          content: "• Top-Down (Memoization): Start from the final target and recursively break it down, caching outputs in a map.\n• Bottom-Up (Tabulation): Start from base cases (0, 1) and iteratively build up the DP array to the target index.",
          codeSnippet: "// Climbing Stairs (Tabulation O(N) Time O(1) Space)\nfunction climbStairs(n) {\n  if (n <= 2) return n;\n  let prev2 = 1, prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    let curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}"
        },
        {
          title: "2. 0/1 Knapsack & Subset Sum Pattern",
          content: "For each item, decide whether to include it or exclude it: `dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w - weight[i]])`.",
          codeSnippet: "function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (let coin of coins) {\n      if (i - coin >= 0) {\n        dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n      }\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}"
        }
      ],
      patterns: [
        { title: "1D State Array", desc: "Build solution iteratively using previous subproblem states." },
        { title: "0/1 Knapsack", desc: "Include or exclude decision tree with weight constraints." }
      ],
      complexities: [
        { op: "Fibonacci (Naive Recursive)", time: "O(2^N)", space: "O(N)" },
        { op: "Fibonacci (DP Tabulated)", time: "O(N)", space: "O(1)" },
        { op: "0/1 Knapsack (N items, W capacity)", time: "O(N * W)", space: "O(W) space optimized" }
      ],
      codeExamples: [
        {
          title: "Longest Increasing Subsequence (LIS)",
          code: "function lengthOfLIS(nums) {\n  if (!nums.length) return 0;\n  const dp = new Array(nums.length).fill(1);\n  let maxLen = 1;\n  for (let i = 1; i < nums.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (nums[i] > nums[j]) {\n        dp[i] = Math.max(dp[i], dp[j] + 1);\n      }\n    }\n    maxLen = Math.max(maxLen, dp[i]);\n  }\n  return maxLen;\n}",
          explanation: "Computes longest strictly increasing subsequence in O(N^2) using tabulation."
        }
      ],
      commonMistakes: [
        { mistake: "Forgetting base cases in DP table initialization.", solution: "Explicitly set base case values (e.g. dp[0] = 0 or 1) before running iterations." }
      ],
      summary: "DP turns exponential recursive algorithms into polynomial time solutions by storing subproblem answers.",
      quiz: [
        {
          question: "What two properties are required to solve a problem using Dynamic Programming?",
          options: [
            "Optimal Substructure & Overlapping Subproblems",
            "Sorted Array & Binary Tree",
            "Graph Cycles & Indegrees",
            "LIFO & FIFO queues"
          ],
          correctAnswer: "Optimal Substructure & Overlapping Subproblems",
          explanation: "DP relies on combining optimal subproblem solutions that recur repeatedly."
        }
      ]
    }
  },
  {
    number: "Module 11",
    name: "Advanced Topics (Trie, DSU, Bit Manipulation)",
    topic: "Advanced Topics",
    difficulty: "Hard",
    estimatedTime: "5.5 hrs",
    progress: 0,
    description: "Explore Prefix Trees (Trie), Disjoint Set Union (DSU / Union-Find) with path compression, and bitwise operations.",
    theory: {
      overview: "Advanced structures optimize specific operations: Tries for prefix lookups, DSU for set connectivity, and Bitwise operations for micro-optimizations.",
      learningObjectives: [
        "Build and search Trie prefix trees.",
        "Implement DSU with Path Compression & Union by Rank.",
        "Utilize bitwise operators (&, |, ^, ~, <<, >>) for fast bit manipulation."
      ],
      theoryText: "A Trie (Prefix Tree) stores characters along node edges, enabling prefix searches in O(L) time where L is word length. DSU maintains disjoint sets with Union and Find operations in near-constant O(alpha(N)) time using path compression.",
      sections: [
        {
          title: "1. Trie (Prefix Tree) Architecture",
          content: "Trie nodes store a children map/array and a boolean flag `isEndOfWord`. Inserting and searching takes O(L) time.",
          codeSnippet: "class TrieNode {\n  constructor() { this.children = {}; this.isEnd = false; }\n}\nclass Trie {\n  constructor() { this.root = new TrieNode(); }\n  insert(word) {\n    let node = this.root;\n    for (let char of word) {\n      if (!node.children[char]) node.children[char] = new TrieNode();\n      node = node.children[char];\n    }\n    node.isEnd = true;\n  }\n}"
        },
        {
          title: "2. Disjoint Set Union (DSU) with Path Compression",
          content: "DSU manages partitioned sets. Path compression re-links visited nodes directly to the root during Find operations, yielding O(alpha(N)) runtime.",
          codeSnippet: "class DSU {\n  constructor(n) {\n    this.parent = Array.from({ length: n }, (_, i) => i);\n  }\n  find(i) {\n    if (this.parent[i] === i) return i;\n    return this.parent[i] = this.find(this.parent[i]); // Path compression\n  }\n  union(i, j) {\n    const rootI = this.find(i), rootJ = this.find(j);\n    if (rootI !== rootJ) this.parent[rootI] = rootJ;\n  }\n}"
        },
        {
          title: "3. Bit Manipulation Fundamentals",
          content: "• Bitwise AND (&): `x & 1` checks odd/even.\n• Clear lowest set bit: `x & (x - 1)` removes the rightmost 1-bit.\n• Bitwise XOR (^): `x ^ x = 0` and `x ^ 0 = x`, ideal for finding single non-duplicate numbers.",
          codeSnippet: "function singleNumber(nums) {\n  let result = 0;\n  for (let num of nums) result ^= num;\n  return result;\n}"
        }
      ],
      patterns: [
        { title: "Prefix Tree Traversal", desc: "Walk Trie branches character by character for instant prefix matching." },
        { title: "XOR Cancellation", desc: "Use a ^ a = 0 property to identify unique unpaired numbers." }
      ],
      complexities: [
        { op: "Trie Word Insert / Search", time: "O(L)", space: "O(L * N)" },
        { op: "DSU Find / Union (Amortized)", time: "O(α(N)) ≈ O(1)", space: "O(N)" },
        { op: "Bitwise Operation", time: "O(1)", space: "O(1)" }
      ],
      codeExamples: [
        {
          title: "Number of 1 Bits (Hamming Weight)",
          code: "function hammingWeight(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1); // clears lowest set bit\n    count++;\n  }\n  return count;\n}",
          explanation: "Clears one set bit per loop iteration, running in O(number of 1 bits)."
        }
      ],
      commonMistakes: [
        { mistake: "Forgetting bitwise operator precedence in expressions.", solution: "Always wrap bitwise operations in parentheses e.g. `(x & mask) === 0`." }
      ],
      summary: "Tries enable fast prefix lookup, DSU manages dynamic connectivity, and Bitwise math optimizes execution speed.",
      quiz: [
        {
          question: "What does the expression `x & (x - 1)` compute?",
          options: ["Clears the lowest set bit in x", "Doubles the value of x", "Returns 0 always", "Flips all bits in x"],
          correctAnswer: "Clears the lowest set bit in x",
          explanation: "Subtracting 1 flips all bits after the lowest set bit; ANDing clears that bit."
        }
      ]
    }
  }
];

async function seedRichTheory() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/syntac_admin";
    console.log("Connecting to MongoDB for rich theory seeding...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    for (const mod of modulesWithRichTheory) {
      await Module.findOneAndUpdate(
        { number: mod.number },
        {
          $set: {
            name: mod.name,
            topic: mod.topic,
            difficulty: mod.difficulty,
            estimatedTime: mod.estimatedTime,
            description: mod.description,
            theory: mod.theory,
          },
        },
        { upsert: true, new: true }
      );
      console.log(`Updated rich theory for ${mod.number}: ${mod.name}`);
    }

    console.log("All 11 modules successfully updated with rich detailed theory and quizzes!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Rich theory seeding error:", err);
    process.exit(1);
  }
}

seedRichTheory();
