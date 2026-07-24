const mongoose = require("mongoose");
require("dotenv").config();
const Module = require("../models/Module");
const Problem = require("../models/Problem");

const rawProblemsData = [
  // Module 01
  {
    moduleNumber: "Module 01",
    slug: "fibonacci-number",
    name: "Fibonacci Number",
    subtitle: "Compute the N-th Fibonacci term",
    difficulty: "Easy",
    description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).",
    examples: [
      { input: "n = 2", output: "1" },
      { input: "n = 4", output: "3" }
    ],
    hints: [
      "You can solve this iteratively to avoid O(2^N) recursion runtime.",
      "Use memoization or bottom-up tabulation to solve it in linear O(N) time."
    ],
    tags: ["Math", "Recursion", "Dynamic Programming"],
    companies: ["Google", "Apple", "Microsoft"],
    estimatedTime: "15 mins",
    successRate: "88%",
    order: 1
  },
  {
    moduleNumber: "Module 01",
    slug: "power-of-two",
    name: "Power of Two",
    subtitle: "Check if an integer is a power of two",
    difficulty: "Easy",
    description: "Given an integer n, return true if it is a power of two. Otherwise, return false. An integer n is a power of two if there exists an integer x such that n == 2^x.",
    examples: [
      { input: "n = 1", output: "true" },
      { input: "n = 16", output: "true" },
      { input: "n = 3", output: "false" }
    ],
    hints: [
      "Look at the binary representation of powers of two; only one bit is set.",
      "Use the bitwise operation n & (n - 1) to clear the lowest set bit and check if the result is 0."
    ],
    tags: ["Math", "Bitwise"],
    companies: ["Amazon", "Bloomberg", "Qualcomm"],
    estimatedTime: "10 mins",
    successRate: "92%",
    order: 2
  },

  // Module 02
  {
    moduleNumber: "Module 02",
    slug: "two-sum",
    name: "Two Sum",
    subtitle: "Find indices of elements that sum to a target",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]" },
      { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]" }
    ],
    hints: [
      "Use a hash map to search for the complement of each element.",
      "A nested loops approach takes O(N^2) time, but caching values in a map takes O(N) time and O(N) space."
    ],
    tags: ["Arrays", "Hashing"],
    companies: ["Meta", "Google", "Amazon", "Uber"],
    estimatedTime: "20 mins",
    successRate: "51%",
    order: 1
  },
  {
    moduleNumber: "Module 02",
    slug: "best-time-to-buy-and-sell-stock",
    name: "Best Time to Buy and Sell Stock",
    subtitle: "Maximize profit from stock prices",
    difficulty: "Easy",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve. If you cannot achieve any profit, return 0.",
    examples: [
      { input: "prices = [7, 1, 5, 3, 6, 4]", output: "5" },
      { input: "prices = [7, 6, 4, 3, 1]", output: "0" }
    ],
    hints: [
      "Keep track of the minimum price seen so far as you iterate through the prices.",
      "Calculate profit for each price against the minimum seen, updating the maximum profit dynamically."
    ],
    tags: ["Arrays", "Sliding Window"],
    companies: ["Microsoft", "Uber", "Apple", "Goldman Sachs"],
    estimatedTime: "20 mins",
    successRate: "54%",
    order: 2
  },

  // Module 03
  {
    moduleNumber: "Module 03",
    slug: "valid-palindrome",
    name: "Valid Palindrome",
    subtitle: "Check string symmetry, ignoring case/non-alphanumeric",
    difficulty: "Easy",
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
    examples: [
      { input: "s = \"A man, a plan, a canal: Panama\"", output: "true" },
      { input: "s = \"race a car\"", output: "false" }
    ],
    hints: [
      "Use two pointers starting from opposite ends and moving inward, skipping non-alphanumeric characters.",
      "You can filter out characters first or check them dynamically in-place to ensure O(1) space."
    ],
    tags: ["Strings", "Two Pointers"],
    companies: ["Meta", "Apple", "Facebook"],
    estimatedTime: "15 mins",
    successRate: "46%",
    order: 1
  },
  {
    moduleNumber: "Module 03",
    slug: "longest-substring-without-repeating-characters",
    name: "Longest Substring Without Repeating Characters",
    subtitle: "Find length of longest substring with unique chars",
    difficulty: "Medium",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      { input: "s = \"abcabcbb\"", output: "3" },
      { input: "s = \"bbbbb\"", output: "1" }
    ],
    hints: [
      "Maintain a sliding window of character indices and adjust the start position on repeats.",
      "Use a hash map to keep track of the last seen index of each character to contract the window left pointer efficiently."
    ],
    tags: ["Strings", "Sliding Window", "Hashing"],
    companies: ["Google", "Meta", "Netflix", "Adobe"],
    estimatedTime: "30 mins",
    successRate: "34%",
    order: 2
  },

  // Module 04
  {
    moduleNumber: "Module 04",
    slug: "contains-duplicate",
    name: "Contains Duplicate",
    subtitle: "Check for duplicate values in an array",
    difficulty: "Easy",
    description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    examples: [
      { input: "nums = [1, 2, 3, 1]", output: "true" },
      { input: "nums = [1, 2, 3, 4]", output: "false" }
    ],
    hints: [
      "Insert elements into a Hash Set and check if they are already present.",
      "Using a set trades O(N) space for O(N) linear time runtime."
    ],
    tags: ["Hashing", "Arrays"],
    companies: ["Google", "Adobe", "Apple"],
    estimatedTime: "10 mins",
    successRate: "61%",
    order: 1
  },
  {
    moduleNumber: "Module 04",
    slug: "group-anagrams",
    name: "Group Anagrams",
    subtitle: "Collect list of anagram configurations together",
    difficulty: "Medium",
    description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    examples: [
      { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" }
    ],
    hints: [
      "Sort each string as a key or create a character count frequency key for a hash map.",
      "Grouping sorted strings takes O(N * K log K) where K is max string length."
    ],
    tags: ["Hashing", "Strings"],
    companies: ["Amazon", "Uber", "Yelp"],
    estimatedTime: "30 mins",
    successRate: "63%",
    order: 2
  },

  // Module 05
  {
    moduleNumber: "Module 05",
    slug: "reverse-linked-list",
    name: "Reverse Linked List",
    subtitle: "Reverse singly linked list references in-place",
    difficulty: "Easy",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      { input: "head = [1, 2, 3, 4, 5]", output: "[5, 4, 3, 2, 1]" }
    ],
    hints: [
      "Change the pointer orientation of each node iteratively by tracking prev, curr, and next.",
      "Can be solved both iteratively and recursively in O(N) time and O(1) space."
    ],
    tags: ["Linked Lists"],
    companies: ["Amazon", "Meta", "Google", "Adobe"],
    estimatedTime: "15 mins",
    successRate: "75%",
    order: 1
  },
  {
    moduleNumber: "Module 05",
    slug: "linked-list-cycle",
    name: "Linked List Cycle",
    subtitle: "Detect cycle loops inside linked node chains",
    difficulty: "Easy",
    description: "Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.",
    examples: [
      { input: "head = [3, 2, 0, -4] (pos = 1)", output: "true" }
    ],
    hints: [
      "Use slow and fast pointers (Tortoise and Hare algorithm).",
      "If a cycle exists, the fast pointer will eventually overlap and catch up with the slow pointer."
    ],
    tags: ["Linked Lists", "Two Pointers"],
    companies: ["Microsoft", "Bloomberg", "Yahoo"],
    estimatedTime: "20 mins",
    successRate: "49%",
    order: 2
  },

  // Module 06
  {
    moduleNumber: "Module 06",
    slug: "valid-parentheses",
    name: "Valid Parentheses",
    subtitle: "Check matching brackets LIFO boundaries",
    difficulty: "Easy",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and Open brackets must be closed in the correct order.",
    examples: [
      { input: "s = \"()\"", output: "true" },
      { input: "s = \"()[]{}\"", output: "true" },
      { input: "s = \"(]\"", output: "false" }
    ],
    hints: [
      "Use a stack to push opening brackets and pop/check match on closing brackets.",
      "If you try to pop from an empty stack or end with a non-empty stack, the brackets are invalid."
    ],
    tags: ["Stacks"],
    companies: ["Meta", "Microsoft", "Intel", "Cisco"],
    estimatedTime: "15 mins",
    successRate: "41%",
    order: 1
  },
  {
    moduleNumber: "Module 06",
    slug: "min-stack",
    name: "Min Stack",
    subtitle: "Design stack with constant-time min lookup",
    difficulty: "Medium",
    description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement the MinStack class.",
    examples: [
      { input: "[\"MinStack\",\"push\",\"push\",\"push\",\"getMin\",\"pop\",\"top\",\"getMin\"] (operations)", output: "[null,null,null,null,-3,null,2,-2] (outputs)" }
    ],
    hints: [
      "Maintain a second stack that stores the minimum values corresponding to each state.",
      "Every time you push to the main stack, push the current minimum to the min-stack."
    ],
    tags: ["Stacks", "Design"],
    companies: ["Amazon", "Google", "Snapchat"],
    estimatedTime: "25 mins",
    successRate: "53%",
    order: 2
  },

  // Module 07
  {
    moduleNumber: "Module 07",
    slug: "maximum-depth-of-binary-tree",
    name: "Maximum Depth of Binary Tree",
    subtitle: "Find height of a hierarchical binary tree",
    difficulty: "Easy",
    description: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    examples: [
      { input: "root = [3, 9, 20, null, null, 15, 7]", output: "3" }
    ],
    hints: [
      "Write a recursive function that returns 1 plus the maximum depth of the left and right subtrees.",
      "Can also be solved iteratively using level-order BFS traversal, counting layers."
    ],
    tags: ["Trees", "DFS", "BFS"],
    companies: ["Google", "LinkedIn", "Twitter"],
    estimatedTime: "15 mins",
    successRate: "74%",
    order: 1
  },
  {
    moduleNumber: "Module 07",
    slug: "validate-binary-search-tree",
    name: "Validate Binary Search Tree",
    subtitle: "Validate BST search range rules on nodes",
    difficulty: "Medium",
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as: The left subtree of a node contains only nodes with keys less than the node's key. The right subtree of a node contains only nodes with keys greater than the node's key. Both the left and right subtrees must also be binary search trees.",
    examples: [
      { input: "root = [2, 1, 3]", output: "true" },
      { input: "root = [5, 1, 4, null, null, 3, 6]", output: "false" }
    ],
    hints: [
      "Recursively check if each node falls within a valid range of minimum and maximum boundaries.",
      "Pass min and max bounds downwards. On moving left, update max; on moving right, update min."
    ],
    tags: ["Trees", "BST", "DFS"],
    companies: ["Amazon", "Bloomberg", "Meta", "Google"],
    estimatedTime: "30 mins",
    successRate: "32%",
    order: 2
  },

  // Module 08
  {
    moduleNumber: "Module 08",
    slug: "kth-largest-element-in-an-array",
    name: "Kth Largest Element in an Array",
    subtitle: "Retrieve target index from Priority Queue",
    difficulty: "Medium",
    description: "Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element.",
    examples: [
      { input: "nums = [3, 2, 1, 5, 6, 4], k = 2", output: "5" }
    ],
    hints: [
      "Use a Min-Heap of size K to keep track of the largest elements.",
      "Iterate over numbers; if the heap size exceeds K, extract the minimum, leaving the largest K at the end."
    ],
    tags: ["Heaps", "Priority Queue", "Arrays"],
    companies: ["Meta", "Amazon", "Salesforce"],
    estimatedTime: "25 mins",
    successRate: "66%",
    order: 1
  },
  {
    moduleNumber: "Module 08",
    slug: "top-k-frequent-elements",
    name: "Top K Frequent Elements",
    subtitle: "Find dynamic highest occurrence arrays",
    difficulty: "Medium",
    description: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
    examples: [
      { input: "nums = [1, 1, 1, 2, 2, 3], k = 2", output: "[1, 2]" }
    ],
    hints: [
      "First count frequencies using a Map, then insert elements into a Max-Heap or Bucket Sort array.",
      "A min-heap approach takes O(N log K) time, which is optimal for dynamic streaming inputs."
    ],
    tags: ["Heaps", "Hashing", "Sorting"],
    companies: ["Google", "Meta", "Yandex"],
    estimatedTime: "30 mins",
    successRate: "64%",
    order: 2
  },

  // Module 09
  {
    moduleNumber: "Module 09",
    slug: "number-of-islands",
    name: "Number of Islands",
    subtitle: "Search 2D grid partitions using traversal",
    difficulty: "Medium",
    description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    examples: [
      {
        input: "grid = [ [\"1\",\"1\",\"1\",\"1\",\"0\"], [\"1\",\"1\",\"0\",\"1\",\"0\"], [\"1\",\"1\",\"0\",\"0\",\"0\"], [\"0\",\"0\",\"0\",\"0\",\"0\"] ]",
        output: "1"
      }
    ],
    hints: [
      "Iterate through the grid; when you find an island, trigger DFS/BFS to mark all connected land as visited.",
      "Set visited cells to '0' to avoid using extra space for tracking visited paths."
    ],
    tags: ["Graphs", "DFS", "BFS"],
    companies: ["Amazon", "Google", "Meta", "Bloomberg"],
    estimatedTime: "30 mins",
    successRate: "58%",
    order: 1
  },
  {
    moduleNumber: "Module 09",
    slug: "clone-graph",
    name: "Clone Graph",
    subtitle: "Make a deep copy of an adjacency vertex graph",
    difficulty: "Medium",
    description: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node in the graph contains a value (int) and a list (List[Node]) of its neighbors.",
    examples: [
      { input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]] (cloned)" }
    ],
    hints: [
      "Use a hash map to store clones of vertices to prevent cyclic infinite recursion.",
      "Explore the graph recursively using DFS or iteratively using BFS to populate clone lists."
    ],
    tags: ["Graphs", "DFS", "BFS"],
    companies: ["Google", "Meta", "Microsoft"],
    estimatedTime: "30 mins",
    successRate: "55%",
    order: 2
  },

  // Module 10
  {
    moduleNumber: "Module 10",
    slug: "climbing-stairs",
    name: "Climbing Stairs",
    subtitle: "Find dynamic climbing permutations",
    difficulty: "Easy",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2" },
      { input: "n = 3", output: "3" }
    ],
    hints: [
      "This is a Fibonacci subproblem. The pathways to step N is the sum of pathways to N-1 and N-2.",
      "Tabulate bottom-up. Optimize space to O(1) by only tracking the previous two step sums."
    ],
    tags: ["Dynamic Programming", "Math"],
    companies: ["Amazon", "Google", "Adobe", "Intel"],
    estimatedTime: "15 mins",
    successRate: "52%",
    order: 1
  },
  {
    moduleNumber: "Module 10",
    slug: "longest-common-subsequence",
    name: "Longest Common Subsequence",
    subtitle: "Find length of longest matching subsequence",
    difficulty: "Medium",
    description: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0. A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.",
    examples: [
      { input: "text1 = \"abcde\", text2 = \"ace\"", output: "3" }
    ],
    hints: [
      "Build a 2D table representing lengths of common subsequences between prefixes of two strings.",
      "If text1[i] === text2[j], the LCS is 1 + LCS(i-1, j-1). Otherwise, it is max(LCS(i-1, j), LCS(i, j-1))."
    ],
    tags: ["Dynamic Programming", "Strings"],
    companies: ["Meta", "Google", "Apple", "Oracle"],
    estimatedTime: "35 mins",
    successRate: "59%",
    order: 2
  },

  // Module 11
  {
    moduleNumber: "Module 11",
    slug: "implement-trie-prefix-tree",
    name: "Implement Trie (Prefix Tree)",
    subtitle: "Design prefix tree auto-completer",
    difficulty: "Medium",
    description: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker. Implement the Trie class.",
    examples: [
      { input: "[\"Trie\",\"insert\",\"search\",\"startsWith\"] (operations)", output: "[null,null,true,true] (outputs)" }
    ],
    hints: [
      "Create a node class containing a children map and an isEndOfWord boolean flag.",
      "Traverse down nodes character by character. If a character node does not exist on insert, create a new one."
    ],
    tags: ["Trie", "Design", "Trees"],
    companies: ["Google", "Microsoft", "Twitter", "Pinterest"],
    estimatedTime: "30 mins",
    successRate: "63%",
    order: 1
  },
  {
    moduleNumber: "Module 11",
    slug: "number-of-connected-components-in-an-undirected-graph",
    name: "Number of Connected Components",
    subtitle: "Find isolated networks using Union-Find DSU",
    difficulty: "Medium",
    description: "You have a graph of n nodes. You are given an integer n and an array edges where edges[i] = [ai, bi] indicates that there is an edge between ai and bi in the graph. Return the number of connected components in the graph.",
    examples: [
      { input: "n = 5, edges = [[0,1],[1,2],[3,4]]", output: "2" }
    ],
    hints: [
      "Use a Union-Find (DSU) data structure initialized with N components.",
      "Loop over edges; merge components. For each successful merge, decrement the components count."
    ],
    tags: ["Union-Find", "Graphs"],
    companies: ["Meta", "Amazon", "Twitter", "Salesforce"],
    estimatedTime: "25 mins",
    successRate: "62%",
    order: 2
  }
];

async function seedProblems() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/syntac_admin";
    console.log("Connecting to MongoDB for seeding problems...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    console.log("Clearing existing Problems...");
    await Problem.deleteMany({});
    console.log("Existing problems cleared.");

    // Fetch all modules from the database to map moduleId references
    console.log("Fetching modules to map references...");
    const modulesList = await Module.find();
    if (modulesList.length === 0) {
      throw new Error("No modules found in the database. Please seed modules first!");
    }

    console.log("Mapping module numbers to MongoDB ObjectIDs...");
    const moduleMap = {};
    modulesList.forEach((mod) => {
      // mod.number is e.g. "Module 01"
      moduleMap[mod.number] = {
        id: mod._id,
        slug: mod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      };
    });

    // Translate raw problems to include mapped moduleId and moduleSlug
    console.log("Translating problem references...");
    const problemsToInsert = [];
    rawProblemsData.forEach((prob) => {
      const match = moduleMap[prob.moduleNumber];
      if (match) {
        const { moduleNumber, ...rest } = prob;
        problemsToInsert.push({
          ...rest,
          moduleId: match.id,
          moduleSlug: match.slug,
        });
      } else {
        console.warn(`WARNING: Could not find module matching ${prob.moduleNumber}`);
      }
    });

    console.log(`Seeding ${problemsToInsert.length} coding problems...`);
    await Problem.insertMany(problemsToInsert);
    console.log("Problems seeded successfully.");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding Problems Error:", err);
    process.exit(1);
  }
}

seedProblems();
