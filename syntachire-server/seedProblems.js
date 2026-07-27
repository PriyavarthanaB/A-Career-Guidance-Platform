/**
 * seedProblems.js
 * Seeds 10+ practice problems for each module in the database.
 * Run with: node seedProblems.js
 *
 * This script:
 * 1. Connects to MongoDB
 * 2. Fetches all existing modules
 * 3. For each module, creates 10 problems (if they don't already exist)
 * 4. Links them via moduleId + moduleSlug
 */

const mongoose = require("mongoose");
require("dotenv").config();

const Module = require("./models/Module");
const Problem = require("./models/Problem");

// ─── Problem Templates per Topic ─────────────────────────────────────────────

const TOPIC_PROBLEMS = {
  "Programming Basics & Complexity": [
    { name: "Big-O Analysis", subtitle: "Determine the time and space complexity of given code snippets", difficulty: "Easy", estimatedTime: "20 mins", successRate: "78%", companies: ["Amazon", "Google"], tags: ["complexity", "theory"], hints: ["Count the dominant term", "Ignore constants and lower-order terms", "Nested loops multiply complexities"] },
    { name: "Fibonacci Sequence", subtitle: "Return the Nth Fibonacci number using multiple approaches", difficulty: "Easy", estimatedTime: "25 mins", successRate: "85%", companies: ["Microsoft", "Facebook"], tags: ["recursion", "dp"], hints: ["Start with the base cases: F(0)=0, F(1)=1", "Try iterative bottom-up approach for O(n)", "Can you solve in O(log n) using matrix exponentiation?"] },
    { name: "Power of Two", subtitle: "Check if a given integer is a power of two", difficulty: "Easy", estimatedTime: "15 mins", successRate: "88%", companies: ["Apple"], tags: ["bit-manipulation", "math"], hints: ["n & (n-1) == 0 for powers of two", "What about n <= 0?", "Try the log approach as well"] },
    { name: "Reverse Integer", subtitle: "Reverse digits of a 32-bit signed integer", difficulty: "Easy", estimatedTime: "20 mins", successRate: "80%", companies: ["Google", "Amazon"], tags: ["math", "overflow"], hints: ["Check for overflow at each step", "Use modulo and integer division", "Consider negative numbers"] },
    { name: "Count Primes", subtitle: "Count the number of primes less than n using Sieve of Eratosthenes", difficulty: "Medium", estimatedTime: "30 mins", successRate: "65%", companies: ["LinkedIn"], tags: ["math", "sieve"], hints: ["Initialize a boolean array of size n", "Mark multiples of each prime as composite", "Start from 2 and iterate up to sqrt(n)"] },
    { name: "Missing Number", subtitle: "Find the missing number in array [0..n]", difficulty: "Easy", estimatedTime: "15 mins", successRate: "90%", companies: ["Amazon"], tags: ["math", "bit-manipulation"], hints: ["Use Gauss formula: n*(n+1)/2", "XOR approach: XOR all indices and values", "Sort and scan"] },
    { name: "GCD & LCM", subtitle: "Compute the greatest common divisor and LCM of two numbers", difficulty: "Easy", estimatedTime: "20 mins", successRate: "82%", companies: ["Atlassian"], tags: ["math", "euclidean"], hints: ["Euclidean algorithm: gcd(a, b) = gcd(b, a%b)", "LCM = (a * b) / gcd(a, b)", "Handle base case: gcd(a, 0) = a"] },
    { name: "Roman to Integer", subtitle: "Convert a Roman numeral string to an integer", difficulty: "Easy", estimatedTime: "20 mins", successRate: "83%", companies: ["Facebook", "Apple"], tags: ["string", "math"], hints: ["Build a map of symbol values", "Subtract when a smaller value precedes a larger one", "Iterate left to right"] },
    { name: "Pascal's Triangle", subtitle: "Generate the first n rows of Pascal's triangle", difficulty: "Easy", estimatedTime: "25 mins", successRate: "79%", companies: ["Amazon"], tags: ["array", "math"], hints: ["Each element is the sum of the two elements above it", "Initialize with 1s on the edges", "Use the previous row to compute the current row"] },
    { name: "Trailing Zeroes in Factorial", subtitle: "Count trailing zeros in n! without computing the factorial", difficulty: "Medium", estimatedTime: "25 mins", successRate: "70%", companies: ["Microsoft"], tags: ["math"], hints: ["Count factors of 5 in n!", "n/5 + n/25 + n/125 + ...", "Trailing zeros come from 2×5 pairs"] },
  ],

  "Arrays": [
    { name: "Two Sum", subtitle: "Return indices of two numbers that add up to target", difficulty: "Easy", estimatedTime: "20 mins", successRate: "92%", companies: ["Google", "Amazon", "Facebook"], tags: ["array", "hash-map"], hints: ["Use a hash map to store complement", "For each element check if target-element is in map", "One-pass solution is O(n)"] },
    { name: "Best Time to Buy & Sell Stock", subtitle: "Maximize profit from a single buy and sell", difficulty: "Easy", estimatedTime: "20 mins", successRate: "88%", companies: ["Amazon", "Goldman Sachs"], tags: ["array", "greedy"], hints: ["Track the minimum price seen so far", "Calculate profit at each step", "Single pass O(n) solution exists"] },
    { name: "Maximum Subarray", subtitle: "Find contiguous subarray with the largest sum (Kadane's Algorithm)", difficulty: "Medium", estimatedTime: "30 mins", successRate: "75%", companies: ["Amazon", "Microsoft"], tags: ["array", "dp", "kadane"], hints: ["Kadane: max(current+num, num)", "Track global maximum through iteration", "Handle all-negative arrays"] },
    { name: "Merge Intervals", subtitle: "Merge all overlapping intervals in a list", difficulty: "Medium", estimatedTime: "35 mins", successRate: "68%", companies: ["Facebook", "Google"], tags: ["array", "sorting"], hints: ["Sort intervals by start time", "Compare end of last merged with start of current", "Initialize result with first interval"] },
    { name: "Product of Array Except Self", subtitle: "Return array where each element is product of all others without division", difficulty: "Medium", estimatedTime: "35 mins", successRate: "72%", companies: ["Amazon", "Apple"], tags: ["array", "prefix-suffix"], hints: ["Build prefix products left-to-right", "Build suffix products right-to-left", "Multiply prefix and suffix at each position"] },
    { name: "Container With Most Water", subtitle: "Find two lines that together with x-axis form a container holding the most water", difficulty: "Medium", estimatedTime: "30 mins", successRate: "70%", companies: ["Amazon", "Bloomberg"], tags: ["array", "two-pointers"], hints: ["Use two pointers from both ends", "Move the shorter line inward", "Area = min(height[l], height[r]) * (r - l)"] },
    { name: "Rotate Array", subtitle: "Rotate array to the right by k steps", difficulty: "Medium", estimatedTime: "25 mins", successRate: "74%", companies: ["Microsoft"], tags: ["array"], hints: ["Reverse entire array, then reverse first k, then rest", "k = k % n to handle large k", "In-place rotation using the reverse trick"] },
    { name: "Find Minimum in Rotated Sorted Array", subtitle: "Locate the minimum element in a rotated sorted array", difficulty: "Medium", estimatedTime: "30 mins", successRate: "67%", companies: ["Microsoft", "Amazon"], tags: ["array", "binary-search"], hints: ["Use modified binary search", "If mid > right, minimum is in right half", "Continue until low == high"] },
    { name: "3Sum", subtitle: "Find all unique triplets in array that sum to zero", difficulty: "Medium", estimatedTime: "40 mins", successRate: "62%", companies: ["Amazon", "Facebook"], tags: ["array", "two-pointers", "sorting"], hints: ["Sort the array first", "For each element, use two-pointer on the rest", "Skip duplicates to avoid repeated triplets"] },
    { name: "Spiral Matrix", subtitle: "Return all elements of matrix in spiral order", difficulty: "Medium", estimatedTime: "35 mins", successRate: "66%", companies: ["Microsoft", "Google"], tags: ["array", "matrix", "simulation"], hints: ["Track top, bottom, left, right boundaries", "Shrink boundaries after each direction pass", "Handle single row/column edge cases"] },
    { name: "First Missing Positive", subtitle: "Find the smallest missing positive integer in O(n) time and O(1) space", difficulty: "Hard", estimatedTime: "45 mins", successRate: "45%", companies: ["Google", "Airbnb"], tags: ["array", "cyclic-sort"], hints: ["Place each positive integer at its correct index (value-1)", "Ignore numbers outside [1,n]", "Scan for the first index where arr[i] != i+1"] },
  ],

  "Strings": [
    { name: "Valid Anagram", subtitle: "Determine if two strings are anagrams of each other", difficulty: "Easy", estimatedTime: "20 mins", successRate: "89%", companies: ["Facebook", "Amazon"], tags: ["string", "hash-map"], hints: ["Count character frequencies", "Use a fixed-size array of 26 for lowercase letters", "Sort both strings and compare"] },
    { name: "Longest Common Prefix", subtitle: "Find the longest common prefix string among an array of strings", difficulty: "Easy", estimatedTime: "20 mins", successRate: "85%", companies: ["Google"], tags: ["string"], hints: ["Compare characters column by column", "Sort and compare first and last strings", "Use binary search on prefix length"] },
    { name: "Palindrome Check", subtitle: "Given a string, check if it is a palindrome ignoring non-alphanumeric characters", difficulty: "Easy", estimatedTime: "15 mins", successRate: "90%", companies: ["Facebook"], tags: ["string", "two-pointers"], hints: ["Use two pointers from both ends", "Skip non-alphanumeric chars", "Compare lowercase versions"] },
    { name: "Longest Palindromic Substring", subtitle: "Find the longest palindromic substring in a string", difficulty: "Medium", estimatedTime: "40 mins", successRate: "60%", companies: ["Amazon", "Microsoft"], tags: ["string", "dp", "expand-around-center"], hints: ["Expand around each center (odd/even length)", "DP table approach: dp[i][j] if s[i..j] is palindrome", "Manacher's algorithm achieves O(n)"] },
    { name: "Group Anagrams", subtitle: "Group strings that are anagrams of each other", difficulty: "Medium", estimatedTime: "30 mins", successRate: "73%", companies: ["Amazon", "Facebook"], tags: ["string", "hash-map", "sorting"], hints: ["Sort each string to create a canonical key", "Group by canonical key in a hash map", "Use character count tuple as key for better performance"] },
    { name: "Minimum Window Substring", subtitle: "Find smallest window in s that contains all chars of t", difficulty: "Hard", estimatedTime: "50 mins", successRate: "45%", companies: ["Facebook", "Uber"], tags: ["string", "sliding-window", "two-pointers"], hints: ["Use sliding window with two pointers", "Expand right until window is valid, then shrink from left", "Track character frequencies with hash maps"] },
    { name: "Decode Ways", subtitle: "Count ways to decode a digit string to letters (A=1..Z=26)", difficulty: "Medium", estimatedTime: "40 mins", successRate: "58%", companies: ["Facebook"], tags: ["string", "dp"], hints: ["DP: dp[i] = ways to decode s[0..i-1]", "Single digit 1-9 is valid", "Two digits 10-26 is valid"] },
    { name: "String to Integer (atoi)", subtitle: "Implement the atoi function with proper edge case handling", difficulty: "Medium", estimatedTime: "35 mins", successRate: "60%", companies: ["Amazon", "Microsoft"], tags: ["string", "math"], hints: ["Skip leading whitespace", "Handle sign character", "Check for overflow during digit accumulation"] },
    { name: "Zigzag Conversion", subtitle: "Convert string to zigzag pattern and read row by row", difficulty: "Medium", estimatedTime: "30 mins", successRate: "64%", companies: ["Bloomberg"], tags: ["string", "simulation"], hints: ["Simulate the zigzag with numRows strings", "Toggle direction when reaching top or bottom row", "Concatenate all rows at the end"] },
    { name: "Word Search", subtitle: "Check if a word exists in a 2D board of characters", difficulty: "Medium", estimatedTime: "45 mins", successRate: "55%", companies: ["Microsoft", "Snapchat"], tags: ["string", "backtracking", "dfs"], hints: ["DFS + backtracking from each cell", "Mark cell as visited temporarily", "Restore cell after recursive call"] },
  ],

  "Hashing": [
    { name: "Two Sum II", subtitle: "Return one pair of indices that sum to target in sorted array", difficulty: "Easy", estimatedTime: "20 mins", successRate: "91%", companies: ["Amazon"], tags: ["hash-map", "two-pointers"], hints: ["Use two-pointer since array is sorted", "Or use hash map as in Two Sum I", "Binary search on complement is also valid"] },
    { name: "Subarray Sum Equals K", subtitle: "Count number of continuous subarrays that sum to k", difficulty: "Medium", estimatedTime: "35 mins", successRate: "64%", companies: ["Facebook", "Google"], tags: ["hash-map", "prefix-sum"], hints: ["Use prefix sums with a hash map", "For each prefix sum, check if (prefixSum - k) exists in map", "Initialize map with {0: 1} for subarrays starting at index 0"] },
    { name: "Longest Consecutive Sequence", subtitle: "Find the length of the longest consecutive elements sequence", difficulty: "Medium", estimatedTime: "35 mins", successRate: "66%", companies: ["Facebook", "Google"], tags: ["hash-set", "array"], hints: ["Use a hash set for O(1) lookups", "Only start counting from sequence starters (n-1 not in set)", "Extend sequence by checking n+1, n+2 etc."] },
    { name: "Top K Frequent Elements", subtitle: "Return k most frequent elements from an array", difficulty: "Medium", estimatedTime: "30 mins", successRate: "72%", companies: ["Facebook", "Amazon"], tags: ["hash-map", "heap", "bucket-sort"], hints: ["Count frequencies with a hash map", "Bucket sort: create buckets indexed by frequency", "Use a max-heap of size k"] },
    { name: "4Sum II", subtitle: "Count tuples (a,b,c,d) from four arrays such that a+b+c+d=0", difficulty: "Medium", estimatedTime: "35 mins", successRate: "60%", companies: ["Amazon"], tags: ["hash-map"], hints: ["Store sums of pairs from A and B in a hash map", "Check if -(c+d) exists in map for each pair from C and D", "O(n^2) time complexity"] },
    { name: "Intersection of Two Arrays", subtitle: "Find the intersection of two arrays with unique elements", difficulty: "Easy", estimatedTime: "20 mins", successRate: "87%", companies: ["Microsoft"], tags: ["hash-set"], hints: ["Convert first array to a set", "Iterate second array and check membership", "Result set avoids duplicates"] },
    { name: "Word Frequency Count", subtitle: "Return the k most common words in a list (alphabetical tiebreak)", difficulty: "Medium", estimatedTime: "30 mins", successRate: "65%", companies: ["Amazon", "Bloomberg"], tags: ["hash-map", "heap", "sorting"], hints: ["Count frequencies with a hash map", "Use a min-heap of size k", "Break ties alphabetically using negative string comparison"] },
    { name: "Isomorphic Strings", subtitle: "Check if two strings are isomorphic (same structure of character mapping)", difficulty: "Easy", estimatedTime: "20 mins", successRate: "82%", companies: ["LinkedIn"], tags: ["hash-map", "string"], hints: ["Map each char in s to char in t and vice versa", "Ensure one-to-one mapping in both directions", "Check both mappings are consistent"] },
    { name: "Number of Distinct Substrings", subtitle: "Count distinct substrings of a string using hashing", difficulty: "Medium", estimatedTime: "40 mins", successRate: "58%", companies: ["Google"], tags: ["hash-set", "string", "rolling-hash"], hints: ["Use a hash set to store all substrings", "Rolling hash (Rabin-Karp) avoids O(n^3) brute force", "Total substrings = n*(n+1)/2; subtract from set size"] },
    { name: "Random Pick with Blacklist", subtitle: "Pick a random integer in [0,n) excluding blacklisted numbers", difficulty: "Hard", estimatedTime: "50 mins", successRate: "42%", companies: ["Google", "Two Sigma"], tags: ["hash-map", "math", "randomization"], hints: ["Map blacklisted nums in [0, n-m) to safe nums in [n-m, n)", "Random pick in [0, n-m), remap using the hash map", "Use reservoir sampling alternatively"] },
  ],

  "Linked Lists": [
    { name: "Reverse Linked List", subtitle: "Reverse a singly linked list iteratively and recursively", difficulty: "Easy", estimatedTime: "20 mins", successRate: "91%", companies: ["Amazon", "Microsoft"], tags: ["linked-list", "pointers"], hints: ["Track prev, curr, next pointers", "At each step: next=curr.next; curr.next=prev; prev=curr; curr=next", "Return prev as the new head"] },
    { name: "Detect Cycle in Linked List", subtitle: "Check if a linked list has a cycle using Floyd's algorithm", difficulty: "Easy", estimatedTime: "25 mins", successRate: "88%", companies: ["Amazon", "Microsoft"], tags: ["linked-list", "two-pointers", "floyd"], hints: ["Use slow and fast pointers", "If they meet, there is a cycle", "fast moves 2 steps, slow moves 1 step"] },
    { name: "Merge Two Sorted Lists", subtitle: "Merge two sorted linked lists into one sorted list", difficulty: "Easy", estimatedTime: "20 mins", successRate: "92%", companies: ["Amazon", "Google"], tags: ["linked-list", "recursion"], hints: ["Compare heads of both lists", "Recursively attach smaller node", "Use a dummy head node for cleaner code"] },
    { name: "LRU Cache", subtitle: "Implement an LRU cache with O(1) get and put operations", difficulty: "Medium", estimatedTime: "50 mins", successRate: "50%", companies: ["Amazon", "Facebook", "Google"], tags: ["linked-list", "hash-map", "design"], hints: ["Use a doubly linked list + hash map", "Recently used goes to front", "Evict from the tail"] },
    { name: "Reorder List", subtitle: "Reorder list L0→L1→…→Ln to L0→Ln→L1→Ln-1→…", difficulty: "Medium", estimatedTime: "40 mins", successRate: "60%", companies: ["Facebook"], tags: ["linked-list", "two-pointers"], hints: ["Find the middle with slow/fast pointers", "Reverse the second half", "Merge the two halves alternately"] },
    { name: "Add Two Numbers", subtitle: "Add two numbers represented as linked lists in reverse order", difficulty: "Medium", estimatedTime: "30 mins", successRate: "70%", companies: ["Amazon", "Microsoft"], tags: ["linked-list", "math"], hints: ["Traverse both lists simultaneously", "Track carry", "Handle different-length lists and remaining carry"] },
    { name: "Remove Nth Node From End", subtitle: "Remove the nth node from the end of the list in one pass", difficulty: "Medium", estimatedTime: "25 mins", successRate: "73%", companies: ["Amazon"], tags: ["linked-list", "two-pointers"], hints: ["Use two pointers n+1 apart", "When fast reaches end, slow is at (n+1)th from end", "Use a dummy head to handle removing the first node"] },
    { name: "Copy List With Random Pointer", subtitle: "Deep copy a linked list where each node has a random pointer", difficulty: "Medium", estimatedTime: "40 mins", successRate: "58%", companies: ["Amazon", "Microsoft"], tags: ["linked-list", "hash-map"], hints: ["Two-pass: first create all nodes, then set pointers", "Hash map: original node → copy node", "Or interleave original and copy nodes"] },
    { name: "Find the Duplicate Number", subtitle: "Find duplicate in array [1..n] without modifying array, O(1) space", difficulty: "Medium", estimatedTime: "40 mins", successRate: "60%", companies: ["Google"], tags: ["linked-list", "floyd", "cycle-detection"], hints: ["Treat array values as next pointers (Floyd's cycle detection)", "Phase 1: find intersection point", "Phase 2: find cycle entrance = duplicate"] },
    { name: "Sort List", subtitle: "Sort a linked list in O(n log n) time and O(1) space", difficulty: "Medium", estimatedTime: "45 mins", successRate: "57%", companies: ["Amazon"], tags: ["linked-list", "merge-sort", "divide-conquer"], hints: ["Use merge sort with the find-middle approach", "Split at midpoint using slow/fast pointers", "Merge two sorted halves recursively"] },
  ],

  "Stacks & Queues": [
    { name: "Valid Parentheses", subtitle: "Check if a string of brackets is valid using a stack", difficulty: "Easy", estimatedTime: "15 mins", successRate: "93%", companies: ["Google", "Amazon", "Facebook"], tags: ["stack", "string"], hints: ["Push opening brackets onto stack", "Pop when closing bracket matches top", "Stack should be empty at the end"] },
    { name: "Min Stack", subtitle: "Design a stack that supports push, pop, top, and retrieving the minimum element in O(1)", difficulty: "Easy", estimatedTime: "25 mins", successRate: "85%", companies: ["Amazon", "Microsoft"], tags: ["stack", "design"], hints: ["Maintain an auxiliary min stack", "Push to min stack only when new element <= current min", "Pop from both stacks simultaneously"] },
    { name: "Daily Temperatures", subtitle: "Return array of days until a warmer temperature for each day", difficulty: "Medium", estimatedTime: "30 mins", successRate: "71%", companies: ["Google"], tags: ["stack", "monotonic-stack"], hints: ["Use a monotonic decreasing stack of indices", "When temp[i] > temp[stack.top()], pop and record difference", "Remaining elements in stack have answer 0"] },
    { name: "Largest Rectangle in Histogram", subtitle: "Find the largest rectangle in a histogram", difficulty: "Hard", estimatedTime: "50 mins", successRate: "45%", companies: ["Amazon", "Google"], tags: ["stack", "monotonic-stack"], hints: ["Maintain a monotonic increasing stack of indices", "Pop when current bar is shorter than stack top", "Width = current index - stack top - 1"] },
    { name: "Sliding Window Maximum", subtitle: "Find the maximum element in each sliding window of size k", difficulty: "Hard", estimatedTime: "45 mins", successRate: "48%", companies: ["Amazon", "Google"], tags: ["deque", "sliding-window", "monotonic"], hints: ["Use a monotonic deque storing indices", "Remove elements outside window from front", "Remove elements smaller than current from back"] },
    { name: "Implement Queue Using Stacks", subtitle: "Implement a FIFO queue using only two stacks", difficulty: "Easy", estimatedTime: "20 mins", successRate: "87%", companies: ["Microsoft"], tags: ["stack", "queue", "design"], hints: ["Use two stacks: inbox and outbox", "Transfer inbox to outbox only when outbox is empty", "Amortized O(1) per operation"] },
    { name: "Evaluate Reverse Polish Notation", subtitle: "Evaluate an arithmetic expression in RPN format", difficulty: "Medium", estimatedTime: "25 mins", successRate: "76%", companies: ["Amazon"], tags: ["stack"], hints: ["Push operands onto stack", "For operators, pop two operands and push result", "Handle integer division truncating toward zero"] },
    { name: "Next Greater Element", subtitle: "Find the next greater element for each element in the array", difficulty: "Medium", estimatedTime: "30 mins", successRate: "74%", companies: ["Facebook"], tags: ["stack", "monotonic-stack"], hints: ["Use monotonic decreasing stack", "For circular array, iterate 2n elements using modulo", "Pop and record answer when greater element found"] },
    { name: "Decode String", subtitle: "Decode a string encoded as k[encoded_string] format", difficulty: "Medium", estimatedTime: "35 mins", successRate: "68%", companies: ["Google", "Amazon"], tags: ["stack", "string"], hints: ["Push current string and count onto stack at '['", "At ']', pop and repeat string by count", "Use two stacks: one for strings, one for counts"] },
    { name: "Basic Calculator II", subtitle: "Evaluate a string expression with +, -, *, / operators", difficulty: "Medium", estimatedTime: "40 mins", successRate: "61%", companies: ["Facebook", "Apple"], tags: ["stack", "math", "string"], hints: ["Process higher precedence (* /) immediately", "For +/-, push to stack (negate for -)", "Sum the stack at the end"] },
  ],

  "Trees & BST": [
    { name: "Maximum Depth of Binary Tree", subtitle: "Find the maximum depth (height) of a binary tree", difficulty: "Easy", estimatedTime: "20 mins", successRate: "92%", companies: ["Amazon"], tags: ["tree", "dfs", "recursion"], hints: ["Recursively: 1 + max(left depth, right depth)", "BFS: count levels", "Base case: null node returns 0"] },
    { name: "Validate BST", subtitle: "Check if a binary tree is a valid BST", difficulty: "Medium", estimatedTime: "30 mins", successRate: "75%", companies: ["Amazon", "Facebook"], tags: ["tree", "bst", "dfs"], hints: ["Pass min and max bounds through recursion", "Left subtree: all values < node.val", "Right subtree: all values > node.val"] },
    { name: "Level Order Traversal", subtitle: "Return level-by-level traversal of a binary tree (BFS)", difficulty: "Medium", estimatedTime: "25 mins", successRate: "80%", companies: ["Amazon", "Microsoft"], tags: ["tree", "bfs", "queue"], hints: ["Use a queue for BFS", "Track level size to separate levels", "Process nodes level by level"] },
    { name: "Lowest Common Ancestor", subtitle: "Find the LCA of two nodes in a binary tree", difficulty: "Medium", estimatedTime: "35 mins", successRate: "70%", companies: ["Facebook", "Amazon"], tags: ["tree", "recursion", "dfs"], hints: ["If root is p or q, return root", "Recurse left and right", "If both sides non-null, root is LCA"] },
    { name: "Binary Tree Right Side View", subtitle: "Return values visible from the right side of the tree", difficulty: "Medium", estimatedTime: "30 mins", successRate: "72%", companies: ["Facebook"], tags: ["tree", "bfs", "dfs"], hints: ["BFS: take last element of each level", "DFS: track depth, update result for each new max depth", "Process right child first in DFS"] },
    { name: "Invert Binary Tree", subtitle: "Invert (mirror) a binary tree", difficulty: "Easy", estimatedTime: "15 mins", successRate: "91%", companies: ["Google", "Amazon"], tags: ["tree", "recursion", "bfs"], hints: ["Swap left and right children", "Recursively invert subtrees", "Iterative BFS approach also works"] },
    { name: "Diameter of Binary Tree", subtitle: "Find the length of the longest path between any two nodes", difficulty: "Easy", estimatedTime: "25 mins", successRate: "82%", companies: ["Facebook"], tags: ["tree", "dfs"], hints: ["Diameter through node = left height + right height", "Use a global variable to track maximum", "Height function returns 1 + max(left, right) depth"] },
    { name: "Kth Smallest in BST", subtitle: "Return the kth smallest element in a BST", difficulty: "Medium", estimatedTime: "30 mins", successRate: "73%", companies: ["Facebook", "Amazon"], tags: ["tree", "bst", "inorder"], hints: ["Inorder traversal gives elements in sorted order", "Count k elements during inorder traversal", "Morris traversal achieves O(1) space"] },
    { name: "Serialize and Deserialize BST", subtitle: "Implement serialization and deserialization of a binary tree", difficulty: "Hard", estimatedTime: "55 mins", successRate: "50%", companies: ["Facebook", "Amazon", "Google"], tags: ["tree", "bfs", "design"], hints: ["Use level-order BFS with null markers", "Or preorder DFS with special null character", "Deserialize by reversing the process"] },
    { name: "Path Sum II", subtitle: "Find all root-to-leaf paths where path sum equals target", difficulty: "Medium", estimatedTime: "35 mins", successRate: "67%", companies: ["Amazon", "Microsoft"], tags: ["tree", "backtracking", "dfs"], hints: ["DFS with backtracking", "Add current node to path, subtract from target", "At leaf: if remaining == 0, add path to result"] },
  ],

  "Heap & Priority Queue": [
    { name: "Kth Largest Element in Array", subtitle: "Find the kth largest element without sorting the full array", difficulty: "Medium", estimatedTime: "30 mins", successRate: "74%", companies: ["Facebook", "Amazon"], tags: ["heap", "quickselect"], hints: ["Use a min-heap of size k", "Pop when heap exceeds k elements", "Quickselect achieves O(n) average"] },
    { name: "Merge K Sorted Lists", subtitle: "Merge k sorted linked lists into one sorted list", difficulty: "Hard", estimatedTime: "50 mins", successRate: "52%", companies: ["Amazon", "Facebook", "Google"], tags: ["heap", "linked-list", "divide-conquer"], hints: ["Use a min-heap to always extract the smallest head", "Push next node of extracted element into heap", "Divide and conquer merge pairs of lists"] },
    { name: "Find Median from Data Stream", subtitle: "Maintain a data structure that can find the median in O(log n) time", difficulty: "Hard", estimatedTime: "55 mins", successRate: "50%", companies: ["Amazon", "Google"], tags: ["heap", "design"], hints: ["Use a max-heap for lower half and min-heap for upper half", "Balance heap sizes so they differ by at most 1", "Median is top of max-heap or average of both tops"] },
    { name: "Task Scheduler", subtitle: "Find the minimum number of intervals to finish all tasks with cooldown n", difficulty: "Medium", estimatedTime: "40 mins", successRate: "60%", companies: ["Facebook", "Amazon"], tags: ["heap", "greedy", "math"], hints: ["Use a max-heap by frequency", "Simulate rounds: pick top k tasks each round", "Math formula: max(n * (f_max - 1) + count_max, total_tasks)"] },
    { name: "K Closest Points to Origin", subtitle: "Find k closest points to origin from a list of points", difficulty: "Medium", estimatedTime: "30 mins", successRate: "72%", companies: ["Facebook", "Amazon"], tags: ["heap", "sort", "quickselect"], hints: ["Sort by Euclidean distance (no need for sqrt)", "Max-heap of size k to track k smallest", "Quickselect for O(n) average time"] },
    { name: "Reorganize String", subtitle: "Rearrange string so no two adjacent characters are the same", difficulty: "Medium", estimatedTime: "35 mins", successRate: "61%", companies: ["Google"], tags: ["heap", "greedy"], hints: ["Use a max-heap by character frequency", "Always pick the most frequent char, then second most frequent", "Impossible if max frequency > (n+1)/2"] },
    { name: "Meeting Rooms II", subtitle: "Find the minimum number of conference rooms required", difficulty: "Medium", estimatedTime: "35 mins", successRate: "65%", companies: ["Facebook", "Google"], tags: ["heap", "greedy", "sorting"], hints: ["Sort meetings by start time", "Use a min-heap to track end times of ongoing meetings", "Pop from heap if earliest end <= current start"] },
    { name: "Smallest Range Covering Elements from K Lists", subtitle: "Find the smallest range covering at least one element from each of k lists", difficulty: "Hard", estimatedTime: "55 mins", successRate: "45%", companies: ["Google"], tags: ["heap", "sliding-window"], hints: ["Put first element of each list in a min-heap", "Track current max and min to compute range", "Advance the list that contributed the minimum"] },
    { name: "Top K Frequent Words", subtitle: "Return k most frequent words sorted by frequency then alphabetically", difficulty: "Medium", estimatedTime: "35 mins", successRate: "63%", companies: ["Amazon", "Bloomberg"], tags: ["heap", "hash-map"], hints: ["Count frequencies with a map", "Use a min-heap of size k with custom comparator", "Break frequency ties alphabetically"] },
    { name: "IPO (Maximize Capital)", subtitle: "Maximize capital after completing at most k projects", difficulty: "Hard", estimatedTime: "50 mins", successRate: "48%", companies: ["Amazon"], tags: ["heap", "greedy"], hints: ["Sort projects by capital requirement", "Use a max-heap of profits for affordable projects", "Greedily pick highest-profit affordable project each round"] },
  ],

  "Graphs": [
    { name: "Number of Islands", subtitle: "Count the number of islands in a 2D grid using DFS/BFS", difficulty: "Medium", estimatedTime: "30 mins", successRate: "75%", companies: ["Amazon", "Google", "Facebook"], tags: ["graph", "dfs", "bfs", "matrix"], hints: ["DFS/BFS from each unvisited '1' cell", "Mark visited cells as '0' or use a visited set", "Count times you initiate DFS/BFS"] },
    { name: "Clone Graph", subtitle: "Deep copy a graph where each node has a list of neighbors", difficulty: "Medium", estimatedTime: "35 mins", successRate: "68%", companies: ["Facebook"], tags: ["graph", "bfs", "dfs", "hash-map"], hints: ["Use a hash map from original to cloned node", "BFS/DFS from the given node", "Create clone first, then set neighbors"] },
    { name: "Course Schedule (Cycle Detection)", subtitle: "Determine if you can finish all courses given prerequisites (detect cycle)", difficulty: "Medium", estimatedTime: "35 mins", successRate: "67%", companies: ["Amazon", "Facebook"], tags: ["graph", "topological-sort", "dfs"], hints: ["Build adjacency list", "DFS with 3 states: unvisited, visiting, visited", "Cycle found if a 'visiting' node is revisited"] },
    { name: "Word Ladder", subtitle: "Find shortest transformation sequence from beginWord to endWord", difficulty: "Hard", estimatedTime: "55 mins", successRate: "48%", companies: ["Amazon", "Google"], tags: ["graph", "bfs", "hash-set"], hints: ["BFS level by level from beginWord", "For each word, try changing each character to a-z", "Use a visited set to avoid revisiting"] },
    { name: "Dijkstra's Shortest Path", subtitle: "Find the shortest path from source to all nodes in a weighted graph", difficulty: "Medium", estimatedTime: "45 mins", successRate: "60%", companies: ["Google", "Uber"], tags: ["graph", "dijkstra", "heap"], hints: ["Use a min-heap (priority queue)", "Process nodes in order of current shortest distance", "Update neighbor distances when shorter path found"] },
    { name: "Pacific Atlantic Water Flow", subtitle: "Find cells from which water can flow to both Pacific and Atlantic", difficulty: "Medium", estimatedTime: "40 mins", successRate: "58%", companies: ["Google"], tags: ["graph", "bfs", "dfs", "matrix"], hints: ["BFS/DFS from both ocean borders inward", "Water flows uphill in reverse direction", "Intersection of reachable sets is the answer"] },
    { name: "Redundant Connection", subtitle: "Find the edge that creates a cycle in an undirected graph", difficulty: "Medium", estimatedTime: "35 mins", successRate: "66%", companies: ["Amazon"], tags: ["graph", "union-find"], hints: ["Use Union-Find (DSU)", "Process edges in order", "The first edge connecting two already-connected nodes is the answer"] },
    { name: "Minimum Spanning Tree (Kruskal's)", subtitle: "Find the MST of a weighted undirected graph", difficulty: "Medium", estimatedTime: "40 mins", successRate: "62%", companies: ["Google", "Microsoft"], tags: ["graph", "union-find", "greedy"], hints: ["Sort edges by weight", "Use Union-Find to detect cycles", "Add edge if it doesn't create a cycle"] },
    { name: "Alien Dictionary", subtitle: "Derive the order of characters in an alien language from sorted words", difficulty: "Hard", estimatedTime: "55 mins", successRate: "45%", companies: ["Facebook", "Airbnb"], tags: ["graph", "topological-sort", "bfs"], hints: ["Build a directed graph from adjacent word pairs", "Use Kahn's algorithm (BFS topological sort)", "Cycle means invalid ordering"] },
    { name: "Network Delay Time", subtitle: "Find the time for all nodes to receive a signal from source k", difficulty: "Medium", estimatedTime: "40 mins", successRate: "60%", companies: ["Google"], tags: ["graph", "dijkstra", "heap"], hints: ["Run Dijkstra from source k", "Answer is the maximum shortest distance", "Return -1 if any node is unreachable"] },
  ],

  "Dynamic Programming": [
    { name: "Climbing Stairs", subtitle: "Count ways to climb n stairs taking 1 or 2 steps at a time", difficulty: "Easy", estimatedTime: "20 mins", successRate: "90%", companies: ["Amazon", "Google"], tags: ["dp"], hints: ["dp[i] = dp[i-1] + dp[i-2]", "Base cases: dp[1]=1, dp[2]=2", "This is essentially the Fibonacci sequence"] },
    { name: "Coin Change", subtitle: "Find minimum coins to make up a target amount", difficulty: "Medium", estimatedTime: "35 mins", successRate: "68%", companies: ["Amazon", "Google"], tags: ["dp", "bfs"], hints: ["dp[amount] = min coins to make amount", "For each coin, dp[i] = min(dp[i], dp[i-coin] + 1)", "Initialize dp with Infinity except dp[0]=0"] },
    { name: "Longest Increasing Subsequence", subtitle: "Find the length of the longest strictly increasing subsequence", difficulty: "Medium", estimatedTime: "40 mins", successRate: "65%", companies: ["Microsoft", "Amazon"], tags: ["dp", "binary-search"], hints: ["dp[i] = LIS ending at index i", "O(n^2): dp[i] = max(dp[j]+1) for j<i and nums[j]<nums[i]", "O(n log n): patience sorting with binary search"] },
    { name: "0/1 Knapsack", subtitle: "Maximize value with items having weight and value constraints", difficulty: "Medium", estimatedTime: "40 mins", successRate: "63%", companies: ["Amazon"], tags: ["dp"], hints: ["dp[i][w] = max value using first i items with capacity w", "Either include item i or exclude it", "Space optimize to 1D array (iterate weight backwards)"] },
    { name: "Longest Common Subsequence", subtitle: "Find LCS of two strings", difficulty: "Medium", estimatedTime: "35 mins", successRate: "67%", companies: ["Google", "Amazon"], tags: ["dp", "string"], hints: ["dp[i][j] = LCS of s1[0..i-1] and s2[0..j-1]", "If chars match: dp[i][j] = dp[i-1][j-1] + 1", "Otherwise: max(dp[i-1][j], dp[i][j-1])"] },
    { name: "Word Break", subtitle: "Check if string can be segmented into dictionary words", difficulty: "Medium", estimatedTime: "35 mins", successRate: "66%", companies: ["Google", "Amazon"], tags: ["dp", "hash-set"], hints: ["dp[i] = true if s[0..i-1] can be segmented", "For each j < i, check dp[j] && s[j..i-1] in dictionary", "BFS alternative: try all words from current position"] },
    { name: "Partition Equal Subset Sum", subtitle: "Determine if array can be partitioned into two equal-sum subsets", difficulty: "Medium", estimatedTime: "40 mins", successRate: "62%", companies: ["Facebook"], tags: ["dp", "subset"], hints: ["Target = total sum / 2 (must be integer)", "Boolean knapsack: can we pick subset summing to target?", "dp[j] = can we make sum j with seen elements"] },
    { name: "Maximum Product Subarray", subtitle: "Find the contiguous subarray with the largest product", difficulty: "Medium", estimatedTime: "35 mins", successRate: "64%", companies: ["Amazon", "LinkedIn"], tags: ["dp", "array"], hints: ["Track both max and min product ending at each position", "Negative × negative = positive (min becomes max)", "Reset on zeros"] },
    { name: "Edit Distance", subtitle: "Find minimum operations to convert one string to another", difficulty: "Hard", estimatedTime: "50 mins", successRate: "55%", companies: ["Google", "Microsoft"], tags: ["dp", "string"], hints: ["dp[i][j] = edit distance between s1[0..i] and s2[0..j]", "If chars match: dp[i][j] = dp[i-1][j-1]", "Otherwise: 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])"] },
    { name: "Burst Balloons", subtitle: "Maximize coins from bursting balloons with interval DP", difficulty: "Hard", estimatedTime: "60 mins", successRate: "42%", companies: ["Google"], tags: ["dp", "interval-dp"], hints: ["Think of k as the LAST balloon burst in range [l, r]", "dp[l][r] = max coins from bursting all balloons in (l, r)", "Recurrence: dp[l][r] = max over k of (nums[l]*nums[k]*nums[r] + dp[l][k] + dp[k][r])"] },
  ],

  "Advanced Algorithms": [
    { name: "N-Queens", subtitle: "Place N queens on an NxN chessboard so no two queens attack each other", difficulty: "Hard", estimatedTime: "55 mins", successRate: "48%", companies: ["Google", "Facebook"], tags: ["backtracking"], hints: ["Backtrack row by row", "Track used columns, diagonals, anti-diagonals with sets", "A queen at (r,c) occupies diagonal r-c and anti-diagonal r+c"] },
    { name: "Sudoku Solver", subtitle: "Solve a Sudoku puzzle by filling empty cells", difficulty: "Hard", estimatedTime: "60 mins", successRate: "46%", companies: ["Google", "Microsoft"], tags: ["backtracking", "matrix"], hints: ["Try digits 1-9 for each empty cell", "Validate row, column, and 3x3 box constraints", "Backtrack if no valid digit is found"] },
    { name: "Merge Sort Implementation", subtitle: "Implement merge sort and count inversions in an array", difficulty: "Medium", estimatedTime: "40 mins", successRate: "65%", companies: ["Amazon"], tags: ["divide-conquer", "sorting"], hints: ["Split array at midpoint", "Recursively sort both halves", "Count inversions while merging"] },
    { name: "Quick Sort with Median Pivot", subtitle: "Implement quick sort using the median-of-three pivot strategy", difficulty: "Medium", estimatedTime: "40 mins", successRate: "62%", companies: ["Microsoft"], tags: ["divide-conquer", "sorting"], hints: ["Choose pivot as median of first, mid, last elements", "Partition: swap elements less than pivot to the left", "Recurse on both partitions"] },
    { name: "KMP String Search", subtitle: "Implement the KMP pattern matching algorithm", difficulty: "Hard", estimatedTime: "55 mins", successRate: "47%", companies: ["Google"], tags: ["string", "kmp"], hints: ["Build the failure function (LPS array)", "LPS[i] = length of longest proper prefix suffix", "Use LPS to avoid redundant comparisons during matching"] },
    { name: "Trie: Insert and Search", subtitle: "Build a Trie supporting insert, search, and startsWith operations", difficulty: "Medium", estimatedTime: "35 mins", successRate: "68%", companies: ["Google", "Facebook"], tags: ["trie", "design"], hints: ["Each TrieNode has children[26] and isEnd flag", "Insert: create nodes for each character", "Search: traverse and check isEnd at final node"] },
    { name: "Segment Tree: Range Sum Query", subtitle: "Build a segment tree for range sum queries and point updates", difficulty: "Hard", estimatedTime: "60 mins", successRate: "44%", companies: ["Google", "Codeforces"], tags: ["segment-tree", "range-query"], hints: ["Build tree bottom-up with n leaves", "Query: split range into O(log n) tree nodes", "Update: propagate change up the tree in O(log n)"] },
    { name: "Floyd-Warshall All-Pairs Shortest Path", subtitle: "Compute shortest paths between all pairs of nodes", difficulty: "Medium", estimatedTime: "40 mins", successRate: "64%", companies: ["Google"], tags: ["graph", "dp", "shortest-path"], hints: ["dp[i][j][k] = shortest path from i to j using nodes 0..k", "Recurrence: dp[i][j][k] = min(dp[i][j][k-1], dp[i][k][k-1] + dp[k][j][k-1])", "O(n^3) time and O(n^2) space"] },
    { name: "Convex Hull (Graham Scan)", subtitle: "Find the convex hull of a set of 2D points", difficulty: "Hard", estimatedTime: "60 mins", successRate: "42%", companies: ["Google", "Palantir"], tags: ["geometry", "sorting", "stack"], hints: ["Sort points by polar angle from lowest-leftmost point", "Use a stack to maintain hull", "Remove points making right turns"] },
    { name: "Maximal Rectangle", subtitle: "Find the largest rectangle containing only 1s in a binary matrix", difficulty: "Hard", estimatedTime: "55 mins", successRate: "46%", companies: ["Amazon", "Google"], tags: ["stack", "dp", "matrix"], hints: ["Build histogram of consecutive 1s for each row", "Apply 'Largest Rectangle in Histogram' on each row's histogram", "Track heights incrementally"] },
  ],
};

// ─── Seed Runner ─────────────────────────────────────────────────────────────

async function seed() {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/syntac_admin";
  
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  // Fetch all modules from DB
  const modules = await Module.find().sort({ number: 1 });
  
  if (modules.length === 0) {
    console.log("❌ No modules found! Please seed your modules first.");
    process.exit(1);
  }

  console.log(`📦 Found ${modules.length} modules. Seeding problems...\n`);

  let totalCreated = 0;
  let totalSkipped = 0;

  for (const mod of modules) {
    const topic = mod.topic;
    const problems = TOPIC_PROBLEMS[topic];

    if (!problems) {
      console.log(`⚠️  No problem set for topic: "${topic}" (Module: ${mod.number} - ${mod.name})`);
      continue;
    }

    console.log(`📝 Seeding ${problems.length} problems for: [${mod.number}] ${mod.name} (${topic})`);

    for (let i = 0; i < problems.length; i++) {
      const p = problems[i];
      const slug = `${mod.number.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${p.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

      // Check if problem already exists
      const exists = await Problem.findOne({ slug });
      if (exists) {
        console.log(`   ↳ ⏭️  Skipped (exists): ${p.name}`);
        totalSkipped++;
        continue;
      }

      // Create problem
      await Problem.create({
        slug,
        moduleId: mod._id,
        moduleSlug: mod.number,
        name: p.name,
        subtitle: p.subtitle,
        difficulty: p.difficulty,
        estimatedTime: p.estimatedTime,
        successRate: p.successRate,
        companies: p.companies || [],
        tags: p.tags || [],
        hints: p.hints || [],
        order: i,
        status: "unsolved",
        isBookmarked: false,
        description: `**${p.name}**\n\n${p.subtitle}\n\nSolve this problem to strengthen your understanding of ${topic}. Focus on understanding the optimal algorithm and its time/space complexity trade-offs.`,
        examples: [
          {
            input: "See problem statement above",
            output: "See expected output in workspace"
          }
        ]
      });

      console.log(`   ↳ ✅ Created: ${p.name} [${p.difficulty}]`);
      totalCreated++;
    }

    console.log();
  }

  console.log("─".repeat(50));
  console.log(`✅ Seeding complete!`);
  console.log(`   → ${totalCreated} problems created`);
  console.log(`   → ${totalSkipped} problems skipped (already existed)`);
  console.log("─".repeat(50));

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB");
}

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  mongoose.disconnect();
  process.exit(1);
});
