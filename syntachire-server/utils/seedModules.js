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
        "Learn to calculate time/space bounds for iterative and recursive procedures.",
        "Differentiate between best-case, average-case, and worst-case analysis.",
        "Recognize common complexity classes on sight (O(1) through O(2^N))."
      ],
      theoryText: "Programming Basics encompasses variables, scopes, loops, conditionals, and functions. Memory models divide storage into the stack (fast, fixed-size allocation for local variables and function calls) and the heap (dynamic, variable-size allocation for objects and collections). Time Complexity measures the rate of growth of the operations relative to input size N, while Space Complexity measures auxiliary storage. Big O notation describes the upper bound (worst-case), Big Omega describes the lower bound (best-case), and Big Theta describes the tight bound. In interviews, Big O is used almost exclusively because it guarantees a performance ceiling regardless of input arrangement — this is what lets engineers reason about scalability before code ever touches production data.",
      patterns: [
        { title: "Asymptotic Bounds", desc: "Determining O(1), O(log N), O(N), O(N log N), O(N^2), and O(2^N) limits." },
        { title: "Auxiliary Space", desc: "Accounting for recursion stack frames and dynamically allocated collections." },
        { title: "Drop Constants & Lower Terms", desc: "Simplifying O(3N + 5) to O(N) since growth rate dominates as N approaches infinity." }
      ],
      complexities: [
        { op: "Single Loop Traversal", time: "O(N)", space: "O(1)" },
        { op: "Nested Loops Traverse", time: "O(N^2)", space: "O(1)" },
        { op: "Halving Loop (binary style)", time: "O(log N)", space: "O(1)" },
        { op: "Recursive branching (2 calls/level)", time: "O(2^N)", space: "O(N)" }
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
        },
        {
          title: "Recursive Factorial (Stack Space)",
          code: "function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}",
          explanation: "Each recursive call adds a new frame to the call stack until the base case is hit. This yields O(N) time and O(N) space due to the unwound stack depth."
        }
      ],
      importantNotes: [
        "Always evaluate both auxiliary space (extra data structures created) and recursion stack frames.",
        "Don't confuse worst-case time with average-case or best-case time.",
        "Constant terms (like O(2N)) are omitted in asymptotic analysis, leaving O(N).",
        "Input size N always refers to the dominant variable — with two inputs of different sizes, use O(N + M) or O(N * M) as appropriate, never collapse them into a single N."
      ],
      interviewQuestions: [
        { question: "Given a recursive Fibonacci function, analyze its time and space complexity.", optimalComplexity: "Time: O(2^N), Space: O(N) recursion stack" },
        { question: "What is the difference between Amortized Time and Average Time?", optimalComplexity: "Amortized accounts for infrequent high-cost operations (like array resizing) spread over many low-cost ones." },
        { question: "Why is O(N log N) considered the practical lower bound for comparison-based sorting?", optimalComplexity: "Comparison sorts must resolve N! possible orderings, and log2(N!) simplifies to O(N log N) by Stirling's approximation." }
      ],
      commonMistakes: [
        { mistake: "Assuming all nested loops result in O(N^2) complexity.", solution: "Analyze loop variables carefully; some nested loops only traverse a portion of the array or divide index space, leading to O(N log N) or O(N)." },
        { mistake: "Neglecting recursion stack space in recursive algorithms.", solution: "Always count the maximum depth of the call stack toward space complexity." },
        { mistake: "Confusing 'runs fast on my test case' with 'is asymptotically efficient'.", solution: "Always analyze against the worst-case input, not the sample input given in the problem statement." }
      ],
      summary: "Mastering Big O complexity analysis is the foundational prerequisite for all technical interviews. It allows comparing solutions objectively and finding optimal trade-offs.",
      codeLanguage: "javascript",
      realWorldApplications: [
        "Database query planners choose between index scans (O(log N)) and full table scans (O(N)) based on cost estimation rooted in complexity analysis.",
        "Autocomplete and search-as-you-type features must stay near O(1)-O(log N) per keystroke to feel instantaneous.",
        "Cloud cost estimation: an O(N^2) job that's fine at N=1,000 can become financially ruinous at N=10,000,000 records."
      ],
      keyTakeaways: [
        "Big O describes growth rate, not exact runtime — two O(N) algorithms can still have very different real-world speeds.",
        "Space complexity is just as interview-relevant as time complexity; always state both.",
        "When stuck, trace through the code with a small N and count operations before naming a complexity class."
      ],
      quiz: [
        {
          question: "What is the time complexity of a loop that halves its search range each iteration?",
          options: ["O(N)", "O(log N)", "O(N log N)", "O(1)"],
          correctAnswer: "O(log N)",
          explanation: "Halving the range each step means the number of iterations grows logarithmically with N, as in binary search."
        },
        {
          question: "A function makes two recursive calls per invocation with no memoization. What is its typical time complexity?",
          options: ["O(N)", "O(N log N)", "O(2^N)", "O(log N)"],
          correctAnswer: "O(2^N)",
          explanation: "Unmemoized branching recursion (like naive Fibonacci) explores an exponential number of call paths."
        },
        {
          question: "Which best describes Big Omega notation?",
          options: ["Worst-case upper bound", "Best-case lower bound", "Average-case only", "Constant-time guarantee"],
          correctAnswer: "Best-case lower bound",
          explanation: "Big Omega expresses the lower bound on growth — the fastest the algorithm could possibly run."
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
    progress: 100,
    description: "Master array operations, contiguous memory representations, in-place modifications, and prefix sum arrays.",
    theory: {
      overview: "Arrays are contiguous blocks of memory holding references or values. Lookups by index are O(1), but insertion or deletion at the beginning requires shifting elements, taking O(N) time.",
      learningObjectives: [
        "Master contiguous memory storage benefits and access limitations.",
        "Understand static vs dynamic array allocations.",
        "Implement common pointer techniques, cyclic swaps, and prefix sums.",
        "Apply the sliding window technique to subarray problems.",
        "Recognize when in-place array manipulation avoids unnecessary space usage."
      ],
      theoryText: "Arrays are contiguous blocks of memory containing homogenous elements. Accessing elements by index is O(1) since the compiler calculates the memory address offsets directly. Inserting or deleting elements at the beginning or middle is O(N) because subsequent elements must shift. Dynamic arrays (like arrays in JS, Python Lists, or ArrayLists in Java) automatically resize when they reach capacity. This resize copies elements to a new, larger array, yielding O(N) copy cost, but because this happens infrequently, insertions have an amortized time complexity of O(1). Sliding window and two-pointer variations extend plain traversal into powerful subarray/substring techniques that avoid brute-force O(N^2) re-scanning.",
      patterns: [
        { title: "Prefix Sum Array", desc: "Precomputing cumulative sums to answer range sum queries in O(1) time." },
        { title: "Two-pointer Swaps", desc: "Reversing or modifying an array in-place to ensure O(1) extra space usage." },
        { title: "Sliding Window", desc: "Maintaining a moving subarray boundary to solve max/min subarray constraint problems in O(N)." },
        { title: "Kadane's Technique", desc: "Tracking running and global maximums to solve maximum subarray sum in a single pass." }
      ],
      complexities: [
        { op: "Index Lookup / Update", time: "O(1)", space: "O(1)" },
        { op: "In-place Reversal", time: "O(N)", space: "O(1)" },
        { op: "Sliding Window Scan", time: "O(N)", space: "O(1)" },
        { op: "Sorting an Array", time: "O(N log N)", space: "O(N) or O(log N)" }
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
        },
        {
          title: "Sliding Window: Max Sum Subarray of Size K",
          code: "function maxSumSubarray(arr, k) {\n  let windowSum = 0;\n  for (let i = 0; i < k; i++) windowSum += arr[i];\n  let maxSum = windowSum;\n  for (let i = k; i < arr.length; i++) {\n    windowSum += arr[i] - arr[i - k];\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}",
          explanation: "Slides a fixed-size window across the array, adding the new element and removing the outgoing one, avoiding recomputation. Runs in O(N) time."
        }
      ],
      importantNotes: [
        "Dynamic arrays resize by doubling their capacity (factor of 2), achieving O(1) amortized insertion.",
        "Subarrays must be contiguous; subsets do not need to be contiguous.",
        "Sorting an already-mostly-sorted array can still cost O(N log N) unless an adaptive sort (like insertion sort or Timsort) is used."
      ],
      interviewQuestions: [
        { question: "Find the maximum subarray sum using Kadane's Algorithm.", optimalComplexity: "Time: O(N), Space: O(1)" },
        { question: "Merge sorted arrays in-place without using extra space.", optimalComplexity: "Time: O(N + M), Space: O(1)" },
        { question: "Find all pairs in an array that sum to a target value.", optimalComplexity: "Time: O(N), Space: O(N) using a hash set" }
      ],
      commonMistakes: [
        { mistake: "Creating a new array copy inside a loop.", solution: "Generates O(N^2) complexity. Re-use existing arrays or allocate target sizes beforehand." },
        { mistake: "Off-by-one errors when computing prefix sum ranges.", solution: "Always pad the prefix array with a leading 0 so sumRange(l, r) = prefix[r+1] - prefix[l] holds cleanly." }
      ],
      summary: "Arrays represent the most fundamental linear structure, offering constant-time access at the price of linear-time size modifications.",
      codeLanguage: "javascript",
      realWorldApplications: [
        "Image processing represents pixel grids as 2D arrays, where operations like blurring rely on windowed traversal.",
        "Financial dashboards use prefix sums to instantly compute rolling revenue totals over arbitrary date ranges.",
        "Spreadsheet applications use dynamic arrays under the hood to support growing rows/columns without constant reallocation."
      ],
      keyTakeaways: [
        "O(1) access is the array's superpower; O(N) shifting is its cost for insert/delete in the middle.",
        "Two-pointer and sliding window patterns convert many O(N^2) brute-force scans into O(N) solutions.",
        "Precomputation (like prefix sums) trades one-time O(N) setup for repeated O(1) queries."
      ],
      quiz: [
        {
          question: "What is the time complexity of accessing an element by index in an array?",
          options: ["O(N)", "O(log N)", "O(1)", "O(N^2)"],
          correctAnswer: "O(1)",
          explanation: "Arrays support direct memory address calculation from the index, making access constant time."
        },
        {
          question: "Why do dynamic arrays achieve O(1) amortized insertion despite occasional O(N) resizes?",
          options: [
            "Resizing never actually happens in practice",
            "The cost of infrequent resizes is spread across many cheap insertions",
            "Arrays are stored on the stack",
            "JavaScript optimizes all array pushes automatically"
          ],
          correctAnswer: "The cost of infrequent resizes is spread across many cheap insertions",
          explanation: "Amortized analysis averages the rare expensive resize operation across the many O(1) pushes that occur between resizes."
        },
        {
          question: "Which technique is most efficient for finding the max sum of every contiguous subarray of fixed size K?",
          options: ["Brute force recomputation", "Sliding window", "Binary search", "Recursion with memoization"],
          correctAnswer: "Sliding window",
          explanation: "Sliding window reuses the previous window's sum, updating in O(1) per step instead of recomputing O(K) each time."
        }
      ]
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
        "Build strings efficiently without duplicate allocations.",
        "Apply sliding window techniques to substring search problems.",
        "Use frequency maps to solve character-counting problems in linear time."
      ],
      theoryText: "Strings are ordered arrays of characters. In some languages (like C++), strings are mutable and can be modified in place. In others (like JavaScript, Java, and Python), strings are immutable. Every modification to an immutable string generates a brand new string reference in memory. Therefore, repeated concatenation in a loop (e.g. s += char) leads to O(N^2) copy runtimes. To construct strings efficiently, push characters to an array and join them at the end, taking O(N) total time. Many string problems (longest substring without repeats, minimum window substring) are solved with the sliding window pattern combined with a frequency map, avoiding brute-force re-scanning of every substring.",
      patterns: [
        { title: "Frequency Mapping", desc: "Count occurrences of characters in a string to validate anagrams or substrings." },
        { title: "String Matching", desc: "Utilizing pointer shifts to detect matching substrings or palindromes." },
        { title: "Sliding Window on Strings", desc: "Expanding/contracting a window over the string to track a substring constraint (e.g. no repeating characters)." }
      ],
      complexities: [
        { op: "String Concat (N times)", time: "O(N^2)", space: "O(N)" },
        { op: "Array Join Method", time: "O(N)", space: "O(N)" },
        { op: "Sliding Window Substring Scan", time: "O(N)", space: "O(min(A, N))" }
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
        },
        {
          title: "Longest Substring Without Repeating Characters",
          code: "function lengthOfLongestSubstring(s) {\n  const seen = new Map();\n  let start = 0, maxLen = 0;\n  for (let end = 0; end < s.length; end++) {\n    if (seen.has(s[end]) && seen.get(s[end]) >= start) {\n      start = seen.get(s[end]) + 1;\n    }\n    seen.set(s[end], end);\n    maxLen = Math.max(maxLen, end - start + 1);\n  }\n  return maxLen;\n}",
          explanation: "Expands the window's right edge each step; when a repeat is found within the current window, the left edge jumps past the previous occurrence. Runs in O(N) time."
        }
      ],
      importantNotes: [
        "Always ask if string comparisons are case-sensitive and if alphanumeric characters should ignore spaces/punctuation.",
        "Strings are represented under ASCII (8-bit) or Unicode (16/32-bit).",
        "Fixed-size frequency arrays (size 26 for lowercase letters) are often faster in practice than hash maps for character counting."
      ],
      interviewQuestions: [
        { question: "Find the longest substring without repeating characters.", optimalComplexity: "Time: O(N), Space: O(min(A, N)) where A is charset size" },
        { question: "Find the minimum window substring of s that contains all characters of t.", optimalComplexity: "Time: O(N + M), Space: O(M) using sliding window + frequency map" }
      ],
      commonMistakes: [
        { mistake: "Using string concatenation inside a loop in Javascript.", solution: "Pushes character insertions to arrays and performs .join('') at the end." },
        { mistake: "Forgetting to shrink the sliding window when a constraint is violated.", solution: "Always move the left pointer forward until the window becomes valid again before continuing to expand." }
      ],
      summary: "Strings are immutable sequences in JavaScript. Manipulation requires converting them to arrays or using character indexes to stay within optimal runtimes.",
      codeLanguage: "javascript",
      realWorldApplications: [
        "Spell-checkers and autocorrect use frequency maps and edit-distance algorithms rooted in string manipulation.",
        "URL routers and search engines rely on efficient substring matching to route or index content.",
        "Plagiarism detectors compare documents using substring and subsequence matching techniques."
      ],
      keyTakeaways: [
        "Immutability means every '+=' on a string in JS silently allocates a new string — batch changes in an array instead.",
        "Sliding window turns many 'find the best substring' problems from O(N^2) or O(N^3) brute force into O(N).",
        "Frequency maps (or fixed arrays for known alphabets) are the workhorse of anagram and substring-constraint problems."
      ],
      quiz: [
        {
          question: "Why is repeated string concatenation (s += char) in a loop inefficient in JavaScript?",
          options: [
            "Strings are stored on the heap only",
            "Each concatenation creates a new string, causing O(N^2) total copying",
            "JavaScript strings can't be concatenated more than once",
            "It causes a stack overflow"
          ],
          correctAnswer: "Each concatenation creates a new string, causing O(N^2) total copying",
          explanation: "Because strings are immutable, every += allocates and copies a new string, and doing this N times costs O(N^2) overall."
        },
        {
          question: "Which pattern is best suited for 'longest substring without repeating characters'?",
          options: ["Binary search", "Sliding window with a hash map", "Sorting the string first", "Recursion with backtracking"],
          correctAnswer: "Sliding window with a hash map",
          explanation: "A sliding window tracks the current valid substring while a hash map records the last seen index of each character, achieving O(N)."
        },
        {
          question: "What data structure best answers 'are two strings anagrams of each other'?",
          options: ["A stack", "A frequency map/array", "A linked list", "A binary search tree"],
          correctAnswer: "A frequency map/array",
          explanation: "Comparing character counts between two strings is the standard O(N) approach to anagram validation."
        }
      ]
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
        "Use hash tables to track elements in constant time.",
        "Understand load factor and its effect on hash table performance.",
        "Design custom hash keys for compound or object-based lookups."
      ],
      theoryText: "Hashing is the process of mapping arbitrary data keys to fixed-size array indices using a hash function. Collisions (when two keys hash to the same index) are resolved via Separate Chaining (linked lists at bucket indices) or Open Addressing (probing nearby buckets). A well-designed hash table maintains a low load factor, enabling average search, insert, and delete operations in O(1) constant time. The load factor (number of entries divided by bucket count) directly governs collision frequency — most implementations automatically resize (rehash) once the load factor crosses a threshold like 0.75, similar in spirit to dynamic array resizing.",
      patterns: [
        { title: "Hash Map Cache", desc: "Caching previous values and their indexes to solve search tasks like Two Sum." },
        { title: "Hash Set Check", desc: "Checking whether an element has been seen in O(1) to avoid duplicate iterations." },
        { title: "Grouping by Computed Key", desc: "Using a derived signature (e.g. sorted characters) as a hash key to bucket related items, as in Group Anagrams." }
      ],
      complexities: [
        { op: "Insert / Search key", time: "O(1) Avg", space: "O(N)" },
        { op: "Deletions / Resizes", time: "O(1) Avg", space: "O(N)" },
        { op: "Worst-case lookup (heavy collisions)", time: "O(N)", space: "O(N)" }
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
        },
        {
          title: "Group Anagrams using a computed hash key",
          code: "function groupAnagrams(strs) {\n  const groups = new Map();\n  for (let s of strs) {\n    const key = s.split('').sort().join('');\n    if (!groups.has(key)) groups.set(key, []);\n    groups.get(key).push(s);\n  }\n  return [...groups.values()];\n}",
          explanation: "Sorts each string's characters to form a canonical signature key, then buckets originals under that key. Runs in O(N * K log K) for N strings of length K."
        }
      ],
      importantNotes: [
        "Hash tables do not maintain ordering. If insertion order is needed, use Linked Hash Maps.",
        "Worst-case time complexity of hash tables can degrade to O(N) if many keys collide in a single bucket.",
        "Choosing a good hash function (uniform distribution) is critical — a poor hash function can turn all O(1) operations into O(N)."
      ],
      interviewQuestions: [
        { question: "Check if a subarray has a sum equal to K.", optimalComplexity: "Time: O(N), Space: O(N)" },
        { question: "Find the first non-repeating character in a string.", optimalComplexity: "Time: O(N), Space: O(1) for fixed alphabet size" }
      ],
      commonMistakes: [
        { mistake: "Using complex objects directly as keys without proper hash functions.", solution: "Ensure keys are simple strings, numbers, or primitive references." },
        { mistake: "Assuming Map/Set operations are always O(1) even in adversarial cases.", solution: "State the average-case O(1) explicitly and note worst-case O(N) degradation under heavy collisions." }
      ],
      summary: "Hashing trades space for time, using memory arrays to deliver average-case O(1) lookups for search, insert, and delete actions.",
      codeLanguage: "javascript",
      realWorldApplications: [
        "Database indexes and caching layers (like Redis) rely on hashing for near-instant key lookups.",
        "Password storage uses cryptographic hash functions (a specialized, one-way form of hashing) rather than reversible encoding.",
        "Compilers use symbol tables backed by hash maps to resolve variable and function names quickly."
      ],
      keyTakeaways: [
        "Hashing converts 'is this here?' questions from O(N) scans into O(1) average-time lookups.",
        "Collisions are inevitable — how they're resolved (chaining vs open addressing) determines worst-case behavior.",
        "A derived/canonical key (like sorted characters) unlocks powerful grouping and deduplication patterns."
      ],
      quiz: [
        {
          question: "What happens when two different keys hash to the same bucket index?",
          options: ["The second insert silently fails", "A collision occurs and must be resolved", "The hash table crashes", "Both keys are automatically merged"],
          correctAnswer: "A collision occurs and must be resolved",
          explanation: "Collisions are resolved via chaining (linked lists per bucket) or open addressing (probing for the next free slot)."
        },
        {
          question: "What is the average-case time complexity for lookup in a well-implemented hash map?",
          options: ["O(N)", "O(log N)", "O(1)", "O(N^2)"],
          correctAnswer: "O(1)",
          explanation: "With a good hash function and reasonable load factor, hash map operations average out to constant time."
        },
        {
          question: "In the Group Anagrams pattern, what is typically used as the hash map key?",
          options: ["The original string itself", "The string's length", "A canonical form like sorted characters", "A random UUID"],
          correctAnswer: "A canonical form like sorted characters",
          explanation: "Sorting each string's characters produces an identical key for all anagrams of one another, enabling grouping."
        }
      ]
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
        "Detect cycle loops using two-pointer algorithms.",
        "Merge and split linked lists without extra space.",
        "Compare linked lists against arrays for insertion/deletion trade-offs."
      ],
      theoryText: "Unlike arrays, linked list nodes are not saved sequentially in memory. Accessing a node requires traversing starting links from head down via node references. This means lookup is O(N) linear time, but modifying nodes at known pointers resolves in constant O(1) time. Doubly linked lists add a 'prev' pointer, allowing O(1) backward traversal and O(1) removal given only a node reference (no need to find its predecessor), at the cost of extra memory per node.",
      patterns: [
        { title: "Fast & Slow Pointers", desc: "Detect list loops (Floyd's algorithm) or return the exact middle list node." },
        { title: "Dummy Node Reference", desc: "Creating a temporary dummy node before the head to simplify edge conditions." },
        { title: "Recursive Reversal", desc: "Reversing sublists or entire lists using the call stack instead of iterative pointer swaps." }
      ],
      complexities: [
        { op: "Insertion at Head", time: "O(1)", space: "O(1)" },
        { op: "Linear Node Lookup", time: "O(N)", space: "O(1)" },
        { op: "Cycle Detection (Floyd's)", time: "O(N)", space: "O(1)" }
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
        },
        {
          title: "Merge Two Sorted Linked Lists",
          code: "function mergeTwoLists(l1, l2) {\n  const dummy = { next: null };\n  let curr = dummy;\n  while (l1 && l2) {\n    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }\n    else { curr.next = l2; l2 = l2.next; }\n    curr = curr.next;\n  }\n  curr.next = l1 || l2;\n  return dummy.next;\n}",
          explanation: "Uses a dummy head to simplify pointer bookkeeping, splicing nodes from both lists in sorted order in O(N + M) time and O(1) extra space."
        }
      ],
      importantNotes: [
        "Initialize a dummy node pointing to the head to simplify edge cases (inserting at the head, empty lists).",
        "Always check for null pointers on node traversal (curr.next.next).",
        "To find the start of a cycle, after slow and fast meet, reset one pointer to head and advance both one step at a time until they meet again."
      ],
      interviewQuestions: [
        { question: "Merge two sorted linked lists into one sorted list.", optimalComplexity: "Time: O(N + M), Space: O(1)" },
        { question: "Find the node where a cycle begins in a linked list.", optimalComplexity: "Time: O(N), Space: O(1) via Floyd's Cycle Detection" },
        { question: "Remove the Nth node from the end of a list in a single pass.", optimalComplexity: "Time: O(N), Space: O(1) using two pointers offset by N" }
      ],
      commonMistakes: [
        { mistake: "Losing the reference to the rest of the list during pointer reassignments.", solution: "Save references in temporary variable variables (e.g. let next = curr.next) before modifying node pointers." },
        { mistake: "Forgetting to handle an empty list or single-node list as an edge case.", solution: "Explicitly test head === null and head.next === null before running the main algorithm." }
      ],
      summary: "Linked Lists offer dynamic sizing and constant-time inserts/deletes, but suffer from linear-time access speeds due to scattered heap memory allocations.",
      codeLanguage: "javascript",
      realWorldApplications: [
        "Browser history (back/forward navigation) is commonly modeled as a doubly linked list.",
        "Music/video playlist 'next' and 'previous' controls map naturally onto linked list traversal.",
        "Operating systems use linked lists to manage free memory blocks and process scheduling queues."
      ],
      keyTakeaways: [
        "Linked lists trade O(1) random access (which they lack) for O(1) insert/delete at a known position.",
        "The fast & slow pointer technique is the go-to tool for cycle detection and finding the middle node.",
        "A dummy head node eliminates a large class of null-pointer edge-case bugs."
      ],
      quiz: [
        {
          question: "What is the time complexity to access the 5th element in a singly linked list of length N?",
          options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
          correctAnswer: "O(N)",
          explanation: "Linked lists require sequential traversal from the head, so arbitrary access is linear time."
        },
        {
          question: "Which technique detects a cycle in a linked list using O(1) extra space?",
          options: ["Hash set of visited nodes", "Floyd's fast & slow pointers", "Recursive DFS", "Sorting the node values"],
          correctAnswer: "Floyd's fast & slow pointers",
          explanation: "Two pointers moving at different speeds will eventually meet inside a cycle without needing extra memory to track visited nodes."
        },
        {
          question: "Why is a dummy head node useful when merging or modifying linked lists?",
          options: [
            "It makes the list circular",
            "It simplifies edge cases like an empty result list or inserting at the head",
            "It reduces time complexity to O(1)",
            "It is required by JavaScript syntax"
          ],
          correctAnswer: "It simplifies edge cases like an empty result list or inserting at the head",
          explanation: "A dummy node gives you a stable 'previous' reference from the very first insertion, avoiding special-casing the head."
        }
      ]
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
        "Implement queues using stacks and circular arrays.",
        "Design a min-stack supporting O(1) minimum retrieval.",
        "Apply stack-based evaluation to expression parsing problems."
      ],
      theoryText: "Stacks are Last-In-First-Out (LIFO) collections supporting push (insert) and pop (remove) from the top. Queues are First-In-First-Out (FIFO) collections supporting enqueue (insert at rear) and dequeue (remove from front). Monotonic stacks maintain elements in increasing or decreasing sorted order. They are used to find next-greater or next-smaller elements in linear time O(N). A queue can be built from two stacks by reversing the transfer order between an 'in' stack and an 'out' stack, giving amortized O(1) enqueue/dequeue — a classic example of amortized analysis applied outside of array resizing.",
      patterns: [
        { title: "Monotonic Stack", desc: "Maintain stack in strictly increasing/decreasing order to solve range problems." },
        { title: "Double-pointer Buffer", desc: "Circular queues using arrays and index offsets to manage bounds." },
        { title: "Auxiliary Stack for O(1) Min/Max", desc: "Tracking a secondary stack of running minimums alongside the main stack." }
      ],
      complexities: [
        { op: "Stack Push / Pop", time: "O(1)", space: "O(1)" },
        { op: "Queue Enqueue / Dequeue", time: "O(1)", space: "O(1)" },
        { op: "Monotonic Stack full pass", time: "O(N) total", space: "O(N)" }
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
        },
        {
          title: "Min Stack with O(1) getMin",
          code: "class MinStack {\n  constructor() {\n    this.stack = [];\n    this.minStack = [];\n  }\n  push(val) {\n    this.stack.push(val);\n    const currMin = this.minStack.length ? Math.min(val, this.minStack[this.minStack.length - 1]) : val;\n    this.minStack.push(currMin);\n  }\n  pop() {\n    this.stack.pop();\n    this.minStack.pop();\n  }\n  top() { return this.stack[this.stack.length - 1]; }\n  getMin() { return this.minStack[this.minStack.length - 1]; }\n}",
          explanation: "A parallel stack tracks the running minimum at each push, so getMin() is answered in O(1) without rescanning the main stack."
        }
      ],
      importantNotes: [
        "Queues implemented with standard JS arrays (using .shift()) run in O(N) time. In production, use linked nodes or circular buffers for O(1) dequeue.",
        "Stacks are the foundation of recursive runtimes, managing execution contexts in call stack frames.",
        "A monotonic stack processes each element at most twice (one push, one pop) across the whole array, which is why it totals O(N) despite the nested-looking while loop."
      ],
      interviewQuestions: [
        { question: "Design a stack that supports push, pop, and retrieving the minimum element in O(1) time.", optimalComplexity: "Use a secondary auxiliary stack tracking minimum values" },
        { question: "Evaluate a Reverse Polish Notation (postfix) expression.", optimalComplexity: "Time: O(N), Space: O(N) using a single stack" }
      ],
      commonMistakes: [
        { mistake: "Using standard arrays as queues in high-frequency applications.", solution: "Use a dedicated Double Ended Queue (Deque) or pointer indexes to achieve constant-time removals." },
        { mistake: "Assuming a monotonic stack's nested while loop makes it O(N^2).", solution: "Each element is pushed and popped at most once overall, so total work across the full pass is O(N), not O(N^2)." }
      ],
      summary: "Stacks and Queues are crucial buffer structures. Monotonic properties enable solving adjacent element dependency queries in linear time.",
      codeLanguage: "javascript",
      realWorldApplications: [
        "Browser 'undo' functionality and text editor undo/redo stacks are literal LIFO stacks.",
        "Print job scheduling and task processing pipelines use FIFO queues to preserve request order.",
        "Compilers use stacks to match brackets/parentheses and to evaluate arithmetic expressions."
      ],
      keyTakeaways: [
        "LIFO (stack) and FIFO (queue) are opposite retrieval orders serving very different real-world needs.",
        "Monotonic stacks are the standard tool for 'next greater/smaller element' style problems in O(N).",
        "A second auxiliary stack is a cheap way to add O(1) min/max tracking to a stack-based structure."
      ],
      quiz: [
        {
          question: "What retrieval order does a stack follow?",
          options: ["First-In-First-Out", "Last-In-First-Out", "Random order", "Sorted order"],
          correctAnswer: "Last-In-First-Out",
          explanation: "Stacks pop the most recently pushed element first, i.e., LIFO."
        },
        {
          question: "Why is a monotonic stack pass over an array considered O(N) despite the inner while loop?",
          options: [
            "The while loop never actually executes",
            "Each element is pushed and popped at most once across the entire pass",
            "JavaScript optimizes while loops automatically",
            "It is actually O(N^2), the description is misleading"
          ],
          correctAnswer: "Each element is pushed and popped at most once across the entire pass",
          explanation: "Amortized across the whole traversal, total pushes and pops are bounded by N each, giving O(N) overall."
        },
        {
          question: "What is the standard way to achieve O(1) dequeue from a queue implemented with arrays?",
          options: [
            "Use Array.shift() directly",
            "Use two stacks or a circular buffer/index pointers",
            "Sort the array before removing",
            "It is impossible to achieve O(1) dequeue"
          ],
          correctAnswer: "Use two stacks or a circular buffer/index pointers",
          explanation: "Array.shift() is O(N) because it re-indexes every element; a two-stack design or circular buffer avoids that cost."
        }
      ]
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
        "Analyze BST search and balance limits.",
        "Compute tree height, diameter, and balance factor recursively.",
        "Validate and reconstruct trees from traversal sequences."
      ],
      theoryText: "Traversal occurs via DFS (depth-first: pre-order, in-order, post-order) or BFS (breadth-first: level-order). In BSTs, in-order traversal yields nodes in sorted order. Searches run in O(log N) time if the tree is balanced, but can degrade to O(N) if it becomes skewed. Self-balancing variants like AVL trees and Red-Black trees enforce height constraints after every insertion/deletion via rotations, guaranteeing O(log N) operations regardless of insertion order — this is precisely what backs many production database indexes.",
      patterns: [
        { title: "In-order traversal", desc: "Traversing BST nodes in-order (left, root, right) yields sorted keys." },
        { title: "Recursive Depth First", desc: "Propagating heights bottom-up to calculate tree balances or diameters." },
        { title: "Level-order BFS with a Queue", desc: "Processing nodes level by level, useful for shortest-path-like tree problems and level-averages." }
      ],
      complexities: [
        { op: "BST Search (Balanced)", time: "O(log N)", space: "O(H) recursion" },
        { op: "Tree Traversal (V nodes)", time: "O(V)", space: "O(H) recursion" },
        { op: "BST Search (Skewed/Worst)", time: "O(N)", space: "O(N) recursion" }
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
        },
        {
          title: "Level-Order (BFS) Traversal",
          code: "function levelOrder(root) {\n  if (!root) return [];\n  const result = [];\n  const queue = [root];\n  while (queue.length) {\n    const levelSize = queue.length;\n    const level = [];\n    for (let i = 0; i < levelSize; i++) {\n      const node = queue.shift();\n      level.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    result.push(level);\n  }\n  return result;\n}",
          explanation: "Uses a queue to process nodes level by level, snapshotting the queue size at the start of each level. Runs in O(V) time and O(V) space."
        }
      ],
      importantNotes: [
        "BST operations degrade to O(N) if the tree becomes unbalanced (skewed list). Balanced BSTs (e.g., AVL, Red-Black) maintain height of O(log N).",
        "BFS uses a Queue; DFS uses a Stack (or the call stack via recursion).",
        "Tree height H is bounded by O(log N) for balanced trees but can reach O(N) for skewed ones — always state which case your complexity assumes."
      ],
      interviewQuestions: [
        { question: "Validate if a Binary Tree is a valid Binary Search Tree.", optimalComplexity: "Time: O(N), Space: O(H) recursive stack" },
        { question: "Invert a binary tree in-place.", optimalComplexity: "Time: O(N), Space: O(H)" },
        { question: "Find the Lowest Common Ancestor (LCA) of two nodes in a BST.", optimalComplexity: "Time: O(H), Space: O(1) iterative using BST ordering property" }
      ],
      commonMistakes: [
        { mistake: "Assuming BST lookup is always O(log N) without verifying tree balance.", solution: "Mention that unbalanced BSTs behave like linked lists with O(N) runtimes." },
        { mistake: "Validating a BST by only comparing each node to its immediate children.", solution: "Must pass down a valid (min, max) range through recursion, since a node deep in the left subtree must be less than all ancestors above it, not just its parent." }
      ],
      summary: "Trees represent hierarchical structures. BSTs offer fast search and insertions in average-case logarithmic O(log N) times, provided balance constraints are met.",
      codeLanguage: "javascript",
      realWorldApplications: [
        "File systems represent directories and files as a tree structure (folders containing folders and files).",
        "Database indexes (B-Trees, B+ Trees) are generalized, disk-optimized versions of balanced BSTs.",
        "HTML/DOM is a tree structure, and rendering engines traverse it depth-first to paint the page."
      ],
      keyTakeaways: [
        "In-order traversal of a BST always yields sorted output — a fact worth memorizing cold.",
        "Balance is everything: an unbalanced BST is secretly a linked list wearing a tree costume.",
        "BFS naturally processes trees level-by-level; DFS naturally processes them branch-by-branch."
      ],
      quiz: [
        {
          question: "What traversal order yields sorted output for a Binary Search Tree?",
          options: ["Pre-order", "Post-order", "In-order", "Level-order"],
          correctAnswer: "In-order",
          explanation: "In-order visits left subtree, then node, then right subtree — which for a BST always produces ascending sorted order."
        },
        {
          question: "What is the worst-case time complexity of search in an unbalanced BST?",
          options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
          correctAnswer: "O(N)",
          explanation: "A skewed BST (essentially a linked list) forces a linear scan in the worst case."
        },
        {
          question: "Which traversal strategy uses a Queue rather than a Stack or recursion?",
          options: ["Pre-order DFS", "In-order DFS", "Post-order DFS", "Level-order BFS"],
          correctAnswer: "Level-order BFS",
          explanation: "BFS processes nodes level by level using a FIFO queue, unlike DFS variants which use a stack or the call stack."
        }
      ]
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
        "Use priority queues to track dynamic top-K subsets.",
        "Apply heapify to build a heap from an unsorted array in O(N).",
        "Solve K-way merge and median-tracking problems with two heaps."
      ],
      theoryText: "Heaps are stored in arrays: index i has left child at 2i + 1 and right child at 2i + 2. Priority Queues return elements based on priority rather than arrival order, usually implemented via heaps. Building a heap from scratch via repeated insertion costs O(N log N), but the 'heapify' bottom-up algorithm builds the same heap in O(N) by sifting down from the last non-leaf node upward — a classic case where a smarter algorithmic order beats the naive approach's total cost.",
      patterns: [
        { title: "K-largest elements", desc: "Using a min-heap of size K to find largest elements in O(N log K) time." },
        { title: "Heap Sort Partitioning", desc: "Repeatedly retrieving the root priority node to sort elements." },
        { title: "Two-Heap Median Tracking", desc: "Balancing a max-heap of smaller half and min-heap of larger half to retrieve the running median in O(log N) per insert." }
      ],
      complexities: [
        { op: "Insert / Delete node", time: "O(log N)", space: "O(1)" },
        { op: "Peek Top Priority", time: "O(1)", space: "O(1)" },
        { op: "Build Heap (heapify)", time: "O(N)", space: "O(1)" }
      ],
      codeExamples: [
        {
          title: "Dynamic Top-K Elements",
          code: "function topK(nums, k) {\n  // Using a Min-Heap of size K\n  const minHeap = new MinHeap(); // Pseudocode implementation\n  for (let n of nums) {\n    minHeap.insert(n);\n    if (minHeap.size() > k) {\n      minHeap.extractMin();\n    }\n  }\n  return minHeap.toArray();\n}",
          explanation: "Maintains a heap of size K. Extracts smaller elements, leaving only the K largest elements. Takes O(N log K) time."
        },
        {
          title: "Array-backed Min-Heap Core Operations",
          code: "class MinHeap {\n  constructor() { this.data = []; }\n  insert(val) {\n    this.data.push(val);\n    let i = this.data.length - 1;\n    while (i > 0) {\n      const parent = Math.floor((i - 1) / 2);\n      if (this.data[parent] <= this.data[i]) break;\n      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];\n      i = parent;\n    }\n  }\n  extractMin() {\n    const min = this.data[0];\n    const last = this.data.pop();\n    if (this.data.length) {\n      this.data[0] = last;\n      let i = 0;\n      while (true) {\n        let left = 2 * i + 1, right = 2 * i + 2, smallest = i;\n        if (left < this.data.length && this.data[left] < this.data[smallest]) smallest = left;\n        if (right < this.data.length && this.data[right] < this.data[smallest]) smallest = right;\n        if (smallest === i) break;\n        [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];\n        i = smallest;\n      }\n    }\n    return min;\n  }\n}",
          explanation: "Implements bubbleUp on insert and bubbleDown (sift-down) on extraction, each running in O(log N) since heap height is log N."
        }
      ],
      importantNotes: [
        "Heapifying an array takes O(N) time, whereas inserting elements one by one takes O(N log N) time.",
        "Retrieving the min/max element is O(1); inserting or extracting requires bubbleUp/bubbleDown operations, taking O(log N) time.",
        "JavaScript has no built-in heap/priority queue — interviewees are expected to implement or simulate one, often via a sorted insertion array for simplicity if performance isn't the focus."
      ],
      interviewQuestions: [
        { question: "Merge K sorted lists of total size N.", optimalComplexity: "Time: O(N log K) using a Min-Heap, Space: O(K)" },
        { question: "Find the median of a running data stream.", optimalComplexity: "Time: O(log N) per insert, Space: O(N) using two heaps" }
      ],
      commonMistakes: [
        { mistake: "Trying to search for a specific value in a heap in O(log N) time.", solution: "Heaps are not sorted for arbitrary search. Searching is O(N) linear time." },
        { mistake: "Confusing a heap's array representation with a fully sorted array.", solution: "Only the root-to-leaf ordering invariant holds; siblings and cousins can be in any relative order." }
      ],
      summary: "Heaps maintain dynamic order, supporting extraction of the highest or lowest priority items in logarithmic time.",
      codeLanguage: "javascript",
      realWorldApplications: [
        "Operating system task schedulers use priority queues to decide which process runs next.",
        "Dijkstra's shortest path algorithm relies on a min-heap to always expand the closest unvisited node.",
        "Event-driven simulations and calendar apps use heaps to always process the next-soonest event."
      ],
      keyTakeaways: [
        "A heap guarantees fast access to the min or max, not full sorted order — don't conflate the two.",
        "Heapify builds a heap in O(N), not O(N log N), by working bottom-up from the last non-leaf node.",
        "The 'min-heap of size K' pattern is the standard trick for top-K / K-largest problems."
      ],
      quiz: [
        {
          question: "In a Min-Heap, where is the smallest element always located?",
          options: ["At a leaf node", "At the root", "In the middle of the array", "It varies with each insertion"],
          correctAnswer: "At the root",
          explanation: "The min-heap invariant guarantees the smallest value sits at the root (index 0 in the array representation)."
        },
        {
          question: "What is the time complexity to build a heap from an unsorted array using the heapify algorithm?",
          options: ["O(N log N)", "O(N)", "O(log N)", "O(N^2)"],
          correctAnswer: "O(N)",
          explanation: "Bottom-up heapify does less work than repeated insertion because most nodes are near the bottom with short sift-down paths, summing to O(N) overall."
        },
        {
          question: "What is the time complexity to search for an arbitrary value in a heap?",
          options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
          correctAnswer: "O(N)",
          explanation: "Heaps only guarantee parent-child ordering, not full sort order, so finding an arbitrary value requires scanning all elements."
        }
      ]
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
        "Solve search queries using BFS, DFS, and topological sorts.",
        "Implement Dijkstra's algorithm for weighted shortest paths.",
        "Detect cycles in both directed and undirected graphs."
      ],
      theoryText: "DFS utilizes recursion/stack to go deep, while BFS uses queues to explore level by level. BFS is optimal for finding the shortest path on unweighted graphs. When edges carry weights, plain BFS no longer guarantees shortest paths — algorithms like Dijkstra's (non-negative weights, greedy + min-heap) or Bellman-Ford (handles negative weights, detects negative cycles) are required instead. Adjacency lists are preferred over adjacency matrices for sparse graphs since they use O(V + E) space instead of O(V^2).",
      patterns: [
        { title: "Cycle Check (DFS)", desc: "Using vertex state colors (unvisited, visiting, visited) to detect loops." },
        { title: "Kahn's BFS Sorting", desc: "Topological ordering by processing vertices with zero incoming dependencies." },
        { title: "Union-Find for Connectivity", desc: "Using Disjoint Set Union to detect cycles or connected components without full traversal." }
      ],
      complexities: [
        { op: "DFS/BFS (Adjacency List)", time: "O(V + E)", space: "O(V)" },
        { op: "Dijkstra Shortest Path", time: "O((V + E) log V)", space: "O(V)" },
        { op: "Adjacency Matrix traversal", time: "O(V^2)", space: "O(V^2)" }
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
        },
        {
          title: "Topological Sort (Kahn's Algorithm)",
          code: "function topoSort(numNodes, edges) {\n  const adj = Array.from({length: numNodes}, () => []);\n  const inDegree = new Array(numNodes).fill(0);\n  for (const [u, v] of edges) { adj[u].push(v); inDegree[v]++; }\n  const queue = [];\n  for (let i = 0; i < numNodes; i++) if (inDegree[i] === 0) queue.push(i);\n  const order = [];\n  while (queue.length) {\n    const node = queue.shift();\n    order.push(node);\n    for (const next of adj[node]) {\n      if (--inDegree[next] === 0) queue.push(next);\n    }\n  }\n  return order.length === numNodes ? order : []; // empty means a cycle exists\n}",
          explanation: "Repeatedly removes vertices with zero incoming edges. If fewer than all vertices are processed, the graph contains a cycle. Runs in O(V + E) time."
        }
      ],
      importantNotes: [
        "BFS is guaranteed to find the shortest path in an unweighted graph.",
        "Detecting cycles in a directed graph requires three-state coloring (visiting/visited/unvisited) to find back edges.",
        "Dijkstra's algorithm fails on graphs with negative edge weights; use Bellman-Ford in that case."
      ],
      interviewQuestions: [
        { question: "Find a topological sorting of a DAG (Directed Acyclic Graph) using Kahn's algorithm.", optimalComplexity: "Time: O(V + E), Space: O(V)" },
        { question: "Count the number of connected components in an undirected graph.", optimalComplexity: "Time: O(V + E), Space: O(V) using DFS/BFS or Union-Find" }
      ],
      commonMistakes: [
        { mistake: "Forgetting to track visited vertices in graphs containing cycles.", solution: "Causes infinite recursive loops. Always pass a visited set or array." },
        { mistake: "Using Dijkstra's algorithm on a graph with negative edge weights.", solution: "Dijkstra's greedy assumption breaks with negative weights; switch to Bellman-Ford, which tolerates them and detects negative cycles." }
      ],
      summary: "Graphs represent complex relations. Adjacency lists paired with BFS or DFS form the foundation of traversal, pathfinding, and topological ordering.",
      codeLanguage: "javascript",
      realWorldApplications: [
        "GPS navigation systems model road networks as weighted graphs and use shortest-path algorithms to route drivers.",
        "Social networks represent friendships/follows as graphs to power friend suggestions and community detection.",
        "Build systems and package managers use topological sort to determine safe compilation/installation order for dependencies."
      ],
      keyTakeaways: [
        "Adjacency lists (O(V+E) space) beat adjacency matrices (O(V^2) space) for sparse real-world graphs.",
        "BFS finds shortest paths only when all edges are unweighted; weighted graphs need Dijkstra's or Bellman-Ford.",
        "Topological sort only exists for Directed Acyclic Graphs (DAGs) — if Kahn's algorithm can't process all nodes, a cycle exists."
      ],
      quiz: [
        {
          question: "Which traversal guarantees the shortest path in an unweighted graph?",
          options: ["DFS", "BFS", "Topological sort", "Union-Find"],
          correctAnswer: "BFS",
          explanation: "BFS explores nodes level by level, so the first time it reaches a node is guaranteed to be via the shortest (fewest-edges) path."
        },
        {
          question: "Why does Dijkstra's algorithm fail with negative edge weights?",
          options: [
            "It cannot process floating point weights",
            "Its greedy 'closest node first' assumption breaks when a longer path could later become cheaper via a negative edge",
            "It only works on directed graphs",
            "It requires an adjacency matrix"
          ],
          correctAnswer: "Its greedy 'closest node first' assumption breaks when a longer path could later become cheaper via a negative edge",
          explanation: "Dijkstra finalizes a node's shortest distance once visited, assuming no cheaper path could appear later — negative weights violate that assumption."
        },
        {
          question: "What does it mean if Kahn's algorithm (BFS-based topological sort) cannot process all vertices?",
          options: ["The graph is undirected", "The graph contains a cycle", "The graph has isolated vertices only", "There was an implementation bug, always"],
          correctAnswer: "The graph contains a cycle",
          explanation: "If some vertices never reach an in-degree of zero, they're part of a cycle and can never be topologically ordered."
        }
      ]
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
        "Implement top-down memoization and bottom-up tabulation.",
        "Apply space optimization by collapsing DP tables to rolling arrays.",
        "Recognize classic DP archetypes: knapsack, LCS, LIS, and grid path problems."
      ],
      theoryText: "Dynamic Programming requires two conditions: Optimal Substructure (an optimal solution to the problem contains optimal solutions to its subproblems) and Overlapping Subproblems (subproblems are computed repeatedly). Top-down DP (Memoization) stores recursive outputs in a map or array. Bottom-up DP (Tabulation) computes results iteratively, filling up a DP table from the base cases to the target value. Space optimization is often possible by only storing the previous rows or states — for example, a 2D grid DP that only ever reads the previous row can be compressed to a single 1D array, cutting space from O(M*N) to O(N).",
      patterns: [
        { title: "0/1 Knapsack", desc: "Choices to include or exclude items under a weight limit." },
        { title: "Longest Common Subsequence", desc: "Comparing strings across multidimensional tables to match character arrays." },
        { title: "Longest Increasing Subsequence (LIS)", desc: "Tracking the best subsequence length ending at each index, optionally optimized to O(N log N) with binary search." }
      ],
      complexities: [
        { op: "Fibonacci (Brute-Force)", time: "O(2^N)", space: "O(N) recursion" },
        { op: "Fibonacci (DP memoized)", time: "O(N)", space: "O(N)" },
        { op: "0/1 Knapsack (N items, capacity W)", time: "O(N * W)", space: "O(N * W) or O(W) optimized" }
      ],
      codeExamples: [
        {
          title: "Unique Paths grid tabulation",
          code: "function uniquePaths(m, n) {\n  const dp = Array(m).fill().map(() => Array(n).fill(1));\n  for (let r = 1; r < m; r++) {\n    for (let c = 1; c < n; c++) {\n      dp[r][c] = dp[r-1][c] + dp[r][c-1];\n    }\n  }\n  return dp[m-1][n-1];\n}",
          explanation: "Fills a 2D grid from base values. Since you can only move down or right, paths to a cell are the sum of paths from the top and left. Takes O(M*N) time."
        },
        {
          title: "Fibonacci with Top-Down Memoization",
          code: "function fib(n, memo = {}) {\n  if (n <= 1) return n;\n  if (memo[n]) return memo[n];\n  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);\n  return memo[n];\n}",
          explanation: "Caches previously computed Fibonacci values, turning the naive exponential recursion into O(N) time and O(N) space."
        },
        {
          title: "0/1 Knapsack Tabulation",
          code: "function knapsack(weights, values, capacity) {\n  const n = weights.length;\n  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));\n  for (let i = 1; i <= n; i++) {\n    for (let w = 0; w <= capacity; w++) {\n      dp[i][w] = dp[i - 1][w];\n      if (weights[i - 1] <= w) {\n        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);\n      }\n    }\n  }\n  return dp[n][capacity];\n}",
          explanation: "Builds a table where dp[i][w] represents the best value using the first i items within capacity w. Runs in O(N * W) time and space."
        }
      ],
      importantNotes: [
        "Top-down is easier to write when the state space is sparse.",
        "Bottom-up avoids call stack limit issues, making it faster in practice.",
        "Always define the DP state (what dp[i] or dp[i][j] actually represents) in words before writing the recurrence — most DP bugs come from an ambiguous state definition."
      ],
      interviewQuestions: [
        { question: "Find the minimum coins needed to make change for amount K.", optimalComplexity: "Time: O(N * K), Space: O(K)" },
        { question: "Find the length of the Longest Increasing Subsequence (LIS).", optimalComplexity: "Time: O(N log N) with binary search, Space: O(N)" }
      ],
      commonMistakes: [
        { mistake: "Incorrect base case initialization in the DP table.", solution: "Carefully trace base values (like i=0 or amount=0) before running transitions." },
        { mistake: "Iterating item and capacity loops in the wrong order for 0/1 vs unbounded knapsack.", solution: "For 0/1 knapsack, iterate capacity in reverse to avoid reusing the same item twice; unbounded knapsack iterates forward on purpose." }
      ],
      summary: "Dynamic Programming resolves overlapping subproblem iterations by storing results, trading memory space for optimal linear or polynomial runtime speeds.",
      codeLanguage: "javascript",
      realWorldApplications: [
        "DNA sequence alignment in bioinformatics uses Longest Common Subsequence-style DP to compare genetic sequences.",
        "Resource allocation and budgeting problems (choosing which projects to fund under a budget) map directly onto the knapsack problem.",
        "Spell-checkers compute edit distance (a DP problem) to suggest the closest valid word to a typo."
      ],
      keyTakeaways: [
        "DP applies only when a problem has both optimal substructure and overlapping subproblems — check for both before reaching for it.",
        "Memoization and tabulation solve the same recurrence; memoization is often easier to derive, tabulation is often faster in practice.",
        "Space optimization (rolling arrays) is a strong signal of DP mastery in interviews — always mention it even if you don't implement it."
      ],
      quiz: [
        {
          question: "What two properties must a problem have for Dynamic Programming to apply?",
          options: [
            "Sorted input and constant space",
            "Optimal substructure and overlapping subproblems",
            "A single recursive call and no base case",
            "A graph structure and weighted edges"
          ],
          correctAnswer: "Optimal substructure and overlapping subproblems",
          explanation: "DP is only a valid optimization when subproblems repeat (overlap) and combining optimal subproblem solutions yields the optimal overall solution."
        },
        {
          question: "What is the main difference between top-down and bottom-up DP?",
          options: [
            "Top-down uses recursion with memoization; bottom-up uses iteration with a table",
            "They always produce different final answers",
            "Bottom-up cannot be space-optimized",
            "Top-down is always faster"
          ],
          correctAnswer: "Top-down uses recursion with memoization; bottom-up uses iteration with a table",
          explanation: "Both solve the same recurrence — top-down starts from the target and recurses down to base cases, bottom-up starts from base cases and builds up."
        },
        {
          question: "In the naive recursive Fibonacci function, why is memoization so effective?",
          options: [
            "It changes the recurrence relation entirely",
            "It eliminates redundant recomputation of the same subproblems, cutting time from O(2^N) to O(N)",
            "It reduces the space complexity to O(1)",
            "It removes the need for a base case"
          ],
          correctAnswer: "It eliminates redundant recomputation of the same subproblems, cutting time from O(2^N) to O(N)",
          explanation: "Without memoization, fib(n-2) is recomputed many times across different call branches; caching results removes that redundancy."
        }
      ]
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
        "Use bit manipulation operators for constant-time flag checks.",
        "Apply Union by Rank alongside path compression for near-constant DSU operations.",
        "Recognize when a Segment Tree or Fenwick Tree is needed for range queries with updates."
      ],
      theoryText: "A Trie (Prefix Tree) is a search tree used to store associative keys (typically strings) where node steps represent characters. Disjoint Set Union (DSU or Union-Find) manages partitions of elements, supporting Union and Find operations in near-constant time. Path Compression flattens trees during Find calls, making future lookups faster. Combined with Union by Rank (always attaching the smaller tree under the bigger tree's root), DSU achieves an amortized time complexity of O(alpha(N)), where alpha is the inverse Ackermann function — for all practical input sizes this is effectively constant. Bit manipulation utilizes binary logical operators (&, |, ^, ~, <<, >>) to compute values in constant CPU cycles, and is often the key to O(1) space solutions in problems that otherwise seem to need a hash set.",
      patterns: [
        { title: "Path Compression (DSU)", desc: "Directly linking child nodes to the absolute root to compress tree height." },
        { title: "Bitwise Masking", desc: "Using integers as bit flags to store boolean states compactly." },
        { title: "Trie Prefix Search", desc: "Descending character-by-character through Trie nodes to answer 'starts with' queries in O(L) time." }
      ],
      complexities: [
        { op: "Trie insert / search word", time: "O(L) word length", space: "O(L * Words)" },
        { op: "Union Find Union / Find", time: "O(alpha(N)) near O(1)", space: "O(N)" },
        { op: "Segment Tree range query/update", time: "O(log N)", space: "O(N)" }
      ],
      codeExamples: [
        {
          title: "Union Find DSU with Path Compression",
          code: "class DSU {\n  constructor(size) {\n    this.parent = Array.from({length: size}, (_, i) => i);\n  }\n  find(i) {\n    if (this.parent[i] === i) return i;\n    this.parent[i] = this.find(this.parent[i]); // Path compression\n    return this.parent[i];\n  }\n  union(i, j) {\n    const rootI = this.find(i);\n    const rootJ = this.find(j);\n    if (rootI !== rootJ) {\n      this.parent[rootI] = rootJ;\n    }\n  }\n}",
          explanation: "A Disjoint Set Union implementation. Path compression inside the recursive find makes subsequent calls run in amortized O(alpha(N)) time."
        },
        {
          title: "Trie Implementation for Prefix Search",
          code: "class TrieNode {\n  constructor() { this.children = {}; this.isEnd = false; }\n}\nclass Trie {\n  constructor() { this.root = new TrieNode(); }\n  insert(word) {\n    let node = this.root;\n    for (let ch of word) {\n      if (!node.children[ch]) node.children[ch] = new TrieNode();\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n  startsWith(prefix) {\n    let node = this.root;\n    for (let ch of prefix) {\n      if (!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return true;\n  }\n}",
          explanation: "Each character forms a node link. Insertion and prefix search both run in O(L), where L is the word/prefix length, independent of dictionary size."
        },
        {
          title: "Counting Set Bits with Bit Manipulation",
          code: "function countSetBits(x) {\n  let count = 0;\n  while (x) {\n    x &= (x - 1); // clears the lowest set bit\n    count++;\n  }\n  return count;\n}",
          explanation: "The trick x & (x - 1) removes the lowest set bit each iteration, so the loop runs once per set bit rather than once per bit position — O(popcount(x)) time and O(1) space."
        }
      ],
      importantNotes: [
        "Tries are optimal for search-by-prefix systems.",
        "Bitwise x & (x - 1) removes the lowest set bit from integer x, which is useful for counting active bits.",
        "Union by Rank/Size combined with path compression is what gets DSU down to near-constant amortized time — either technique alone is weaker than both together."
      ],
      interviewQuestions: [
        { question: "Count the number of set bits in an integer.", optimalComplexity: "Time: O(1) constant iterations, Space: O(1)" },
        { question: "Detect if adding an edge creates a cycle in an undirected graph using DSU.", optimalComplexity: "Time: O(E * alpha(N)), Space: O(N)" }
      ],
      commonMistakes: [
        { mistake: "Forgetting path compression in DSU find operations.", solution: "Results in tree heights degrading to O(N) paths. Always apply path compression." },
        { mistake: "Using a Trie when a simple hash set would suffice (no prefix queries needed).", solution: "Tries add overhead for exact-match-only lookups; reserve them for prefix/autocomplete-style requirements." }
      ],
      summary: "Advanced data structures and bitwise operations solve complex subset and network partitioning challenges under strict resource limits.",
      codeLanguage: "javascript",
      realWorldApplications: [
        "Autocomplete and IDE code-completion engines are built on Tries for fast prefix lookups.",
        "Network connectivity and image segmentation algorithms use Union-Find to group connected regions efficiently.",
        "Bitwise flags are used extensively in low-level systems programming and permission systems (e.g. Unix file permission bits)."
      ],
      keyTakeaways: [
        "Tries turn prefix-based string operations into O(L) time, independent of how many words are stored.",
        "Union-Find with both path compression and union by rank is the gold standard for dynamic connectivity problems.",
        "Bit tricks like x & (x - 1) often replace what looks like an O(N) or O(N) space problem with an O(1) space, near-O(1) time solution."
      ],
      quiz: [
        {
          question: "What does path compression do in a Union-Find (DSU) structure?",
          options: [
            "It deletes unused nodes",
            "It flattens the tree by linking nodes directly to the root during find operations",
            "It sorts all elements",
            "It reverses the union operation"
          ],
          correctAnswer: "It flattens the tree by linking nodes directly to the root during find operations",
          explanation: "Path compression shortens future find() calls by re-pointing visited nodes directly to the root."
        },
        {
          question: "What is the time complexity of inserting a word of length L into a Trie?",
          options: ["O(1)", "O(L)", "O(N) where N is total words stored", "O(L^2)"],
          correctAnswer: "O(L)",
          explanation: "Insertion walks one node per character in the word, independent of how many other words exist in the Trie."
        },
        {
          question: "What does the expression x & (x - 1) compute?",
          options: [
            "x with its lowest set bit cleared",
            "x doubled",
            "The two's complement of x",
            "x divided by 2"
          ],
          correctAnswer: "x with its lowest set bit cleared",
          explanation: "Subtracting 1 flips all bits after (and including) the lowest set bit; ANDing with the original clears just that lowest set bit."
        }
      ]
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