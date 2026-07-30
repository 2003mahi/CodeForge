// Mock data for CodeBridge AI platform

export const mockUser = {
  name: "Aryan Sharma",
  email: "aryan@example.com",
  avatar: "AS",
  level: "Intermediate",
  streak: 14,
  totalXP: 4280,
  weeklyXP: 620,
  joinedDays: 42,
  college: "BITS Pilani",
  goal: "SDE at a Product Company",
};

export const mockLeaderboard = [
  { rank: 1, name: "Alice", avatar: "A", xp: 5400, streak: 30 },
  { rank: 2, name: "Bob", avatar: "B", xp: 4700, streak: 22 },
  { rank: 3, name: "Charlie", avatar: "C", xp: 4200, streak: 18 },
  { rank: 4, name: "Dana", avatar: "D", xp: 3800, streak: 15 },
  { rank: 5, name: "Evan", avatar: "E", xp: 3500, streak: 12 },
];

export const mockSkills = [
  { name: "Data Structures", score: 78, color: "#7C3AED" },
  { name: "Algorithms", score: 65, color: "#3B82F6" },
  { name: "Debugging", score: 82, color: "#10B981" },
  { name: "System Design", score: 45, color: "#F59E0B" },
  { name: "SQL", score: 70, color: "#EC4899" },
  { name: "Git & DevOps", score: 55, color: "#06B6D4" },
];

export const mockWeeklyActivity = [
  { day: "Mon", problems: 4, xp: 120 },
  { day: "Tue", problems: 7, xp: 210 },
  { day: "Wed", problems: 2, xp: 60 },
  { day: "Thu", problems: 9, xp: 270 },
  { day: "Fri", problems: 5, xp: 150 },
  { day: "Sat", problems: 11, xp: 330 },
  { day: "Sun", problems: 3, xp: 90 },
];

export const mockProblems = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "HashMap"],
    solved: true,
    xp: 50,
    language: "Python",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    starterCode: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Your solution here
    pass`,
      javascript: `function twoSum(nums, target) {
    // Your solution here
}`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your solution here
    }
};`,
      sql: `-- Two Sum is not a SQL problem\n-- Try Python or JavaScript above`,
    },
    testCases: [
      { input: "nums = [2,7,11,15], target = 9", expected: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", expected: "[1,2]" },
      { input: "nums = [3,3], target = 6", expected: "[0,1]" },
    ],
  },
  {
    id: "2",
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    solved: true,
    xp: 50,
    language: "JavaScript",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    starterCode: {
      python: `def isValid(s: str) -> bool:
    # Your solution here
    pass`,
      javascript: `function isValid(s) {
    // Your solution here
}`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    bool isValid(string s) {
        // Your solution here
    }
};`,
      sql: `-- Valid Parentheses is not a SQL problem\n-- Try Python or JavaScript above`,
    },
    testCases: [
      { input: 's = "()"', expected: "true" },
      { input: 's = "()[]{}"', expected: "true" },
      { input: 's = "(]"', expected: "false" },
    ],
  },
  {
    id: "3",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["Sliding Window", "HashMap"],
    solved: false,
    xp: 100,
    language: "Python",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    starterCode: {
      python: `def lengthOfLongestSubstring(s: str) -> int:
    # Your solution here
    pass`,
      javascript: `function lengthOfLongestSubstring(s) {
    // Your solution here
}`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Your solution here
    }
};`,
      sql: `-- Longest Substring is not a SQL problem\n-- Try Python or JavaScript above`,
    },
    testCases: [
      { input: 's = "abcabcbb"', expected: "3" },
      { input: 's = "bbbbb"', expected: "1" },
    ],
  },
  {
    id: "4",
    title: "Merge Intervals",
    difficulty: "Medium",
    tags: ["Array", "Sorting"],
    solved: false,
    xp: 100,
    language: "Python",
    description: "Given an array of intervals, merge all overlapping intervals.",
    starterCode: {
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    # Your solution here
    pass`,
      javascript: `function merge(intervals) {
    // Your solution here
}`,
      java: `class Solution {
    public int[][] merge(int[][] intervals) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        // Your solution here
    }
};`,
      sql: `-- Merge Intervals is not a SQL problem\n-- Try Python or JavaScript above`,
    },
    testCases: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", expected: "[[1,6],[8,10],[15,18]]" },
      { input: "intervals = [[1,4],[4,5]]", expected: "[[1,5]]" },
    ],
  },
  {
    id: "5",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Hard",
    tags: ["BFS", "Tree"],
    solved: false,
    xp: 200,
    language: "Python",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
    starterCode: {
      python: `def levelOrder(root) -> list[list[int]]:
    # Your solution here
    pass`,
      javascript: `function levelOrder(root) {
    // Your solution here
}`,
      java: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        // Your solution here
    }
};`,
      sql: `-- Binary Tree Traversal is not a SQL problem\n-- Try Python or JavaScript above`,
    },
    testCases: [
      { input: "root = [3,9,20,null,null,15,7]", expected: "[[3],[9,20],[15,7]]" },
    ],
  },
];

export const mockDebugChallenges = [
  {
    id: "d1",
    title: "Off-by-One Error in Binary Search",
    difficulty: "Easy",
    language: "Python",
    buggyCode: `def binary_search(arr, target):
    left, right = 0, len(arr)  # Bug here
    
    while left < right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1  # Bug here
    
    return -1

# Test
arr = [1, 3, 5, 7, 9, 11]
print(binary_search(arr, 7))  # Should return 3`,
    bugs: [
      { line: 2, description: "Should be len(arr) - 1, not len(arr)" },
      { line: 12, description: "Should be right = mid, not mid - 1 to avoid skipping elements" },
    ],
    fixedCode: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
    explanation: "Two classic bugs: right boundary should be len-1 to stay in bounds, and the while condition must be <= to check all elements.",
  },
  {
    id: "d2",
    title: "SQL Injection Vulnerability",
    difficulty: "Medium",
    language: "JavaScript",
    buggyCode: `const express = require('express');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'users_db'
});

app.get('/user', (req, res) => {
  const userId = req.query.id;
  // CRITICAL BUG: SQL injection vulnerability
  const query = \`SELECT * FROM users WHERE id = \${userId}\`;
  
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});`,
    bugs: [
      { line: 14, description: "Direct string interpolation in SQL query allows SQL injection" },
    ],
    fixedCode: `app.get('/user', (req, res) => {
  const userId = req.query.id;
  // Safe: Use parameterized query
  const query = 'SELECT * FROM users WHERE id = ?';
  
  db.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});`,
    explanation: "Never interpolate user input directly into SQL strings. Use parameterized queries (? placeholders) which MySQL escapes automatically.",
  },
];

export const mockSimulationTickets = [
  {
    id: "CB-101",
    title: "Fix: Payment API returns 500 on checkout",
    type: "Bug",
    priority: "Critical",
    status: "todo",
    description: "Production alert: 23% of checkout requests failing with 500 error. Stripe webhook not responding. Revenue impact: $12k/hr.",
    tags: ["API", "Production", "Stripe"],
    estimatedTime: "2h",
    xp: 300,
  },
  {
    id: "CB-102",
    title: "Feat: Add dark mode to user dashboard",
    type: "Feature",
    priority: "Medium",
    status: "in-progress",
    description: "PM request: 67% of users prefer dark mode per survey. Implement CSS variables and toggle logic across all dashboard components.",
    tags: ["Frontend", "CSS", "UX"],
    estimatedTime: "4h",
    xp: 200,
  },
  {
    id: "CB-103",
    title: "Perf: Dashboard query taking 8s",
    type: "Performance",
    priority: "High",
    status: "todo",
    description: "Analytics dashboard main query exceeds 8000ms. DB logs show full table scan on user_events table with 2M rows. Add indexes.",
    tags: ["SQL", "Performance", "Database"],
    estimatedTime: "3h",
    xp: 250,
  },
  {
    id: "CB-104",
    title: "Fix: Merge conflict in auth module",
    type: "Bug",
    priority: "High",
    status: "review",
    description: "Two feature branches modified auth middleware simultaneously. Resolve conflicts while preserving JWT refresh token logic from both branches.",
    tags: ["Git", "Backend", "Auth"],
    estimatedTime: "1h",
    xp: 150,
  },
  {
    id: "CB-105",
    title: "Feat: Build user notification system",
    type: "Feature",
    priority: "Low",
    status: "done",
    description: "Implement real-time notifications using WebSockets. Users should receive alerts for: new messages, assignment deadlines, review feedback.",
    tags: ["WebSocket", "Backend", "Frontend"],
    estimatedTime: "6h",
    xp: 400,
  },
];

export const mockMentorMessages = [
  {
    role: "ai",
    content: "Hey Aryan! 👋 I'm your AI Mentor. I've analyzed your recent submissions and noticed you're struggling with **time complexity analysis**. Want me to walk you through Big-O notation with some examples from your recent Two Sum solution?",
    timestamp: "10:32 AM",
  },
  {
    role: "user",
    content: "Yes please! I always get confused between O(n) and O(n²) solutions.",
    timestamp: "10:33 AM",
  },
  {
    role: "ai",
    content: `Great question! Let me show you with your actual Two Sum code:

\`\`\`python
# Your O(n²) brute force approach:
def twoSum(nums, target):
    for i in range(len(nums)):      # O(n)
        for j in range(i+1, len(nums)):  # O(n) nested
            if nums[i] + nums[j] == target:
                return [i, j]
# Total: O(n × n) = O(n²)
\`\`\`

\`\`\`python
# Optimized O(n) using HashMap:
def twoSum(nums, target):
    seen = {}                    # O(1) space
    for i, num in enumerate(nums):   # O(n) once
        complement = target - num
        if complement in seen:        # O(1) lookup
            return [seen[complement], i]
        seen[num] = i
# Total: O(n) — much faster! 🚀
\`\`\`

The key insight: trading **space** (HashMap) for **time** (one pass instead of nested loops). This pattern appears in 40% of array problems!`,
    timestamp: "10:33 AM",
  },
];

export const mockAnalyticsData = {
  growthChart: [
    { week: "W1", score: 32, problems: 8, debugging: 40 },
    { week: "W2", score: 38, problems: 12, debugging: 45 },
    { week: "W3", score: 41, problems: 10, debugging: 52 },
    { week: "W4", score: 50, problems: 18, debugging: 60 },
    { week: "W5", score: 58, problems: 22, debugging: 65 },
    { week: "W6", score: 63, problems: 19, debugging: 70 },
  ],
  topicMastery: [
    { topic: "Arrays", mastery: 85, problems: 24 },
    { topic: "Strings", mastery: 78, problems: 18 },
    { topic: "Linked Lists", mastery: 60, problems: 12 },
    { topic: "Trees", mastery: 45, problems: 8 },
    { topic: "DP", mastery: 30, problems: 5 },
    { topic: "Graphs", mastery: 20, problems: 3 },
    { topic: "Sorting", mastery: 90, problems: 15 },
    { topic: "Binary Search", mastery: 72, problems: 11 },
  ],
  interviewReadiness: [
    { category: "Problem Solving", score: 72 },
    { category: "Code Quality", score: 68 },
    { category: "Communication", score: 55 },
    { category: "System Design", score: 40 },
    { category: "Debugging", score: 82 },
  ],
};

export const mockStreakData = (): Record<string, number> => {
  const data: Record<string, number> = {};
  const today = new Date();
  for (let i = 180; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toISOString().split("T")[0];
    const random = Math.random();
    if (random > 0.35) {
      data[key] = Math.floor(Math.random() * 4) + 1;
    }
  }
  return data;
};

export const mockRoadmap = [
  {
    phase: 1,
    title: "DSA Foundations",
    duration: "3 weeks",
    status: "completed",
    topics: ["Arrays", "Strings", "HashMaps", "Time Complexity"],
    problems: 30,
  },
  {
    phase: 2,
    title: "Core Data Structures",
    duration: "4 weeks",
    status: "active",
    topics: ["Linked Lists", "Stacks", "Queues", "Trees", "Heaps"],
    problems: 40,
  },
  {
    phase: 3,
    title: "Algorithms Deep Dive",
    duration: "4 weeks",
    status: "locked",
    topics: ["Sorting", "Binary Search", "BFS/DFS", "Backtracking"],
    problems: 50,
  },
  {
    phase: 4,
    title: "Advanced Topics",
    duration: "5 weeks",
    status: "locked",
    topics: ["Dynamic Programming", "Graphs", "Tries", "Segment Trees"],
    problems: 60,
  },
  {
    phase: 5,
    title: "Industry Simulation",
    duration: "3 weeks",
    status: "locked",
    topics: ["System Design", "API Design", "Database Optimization", "Git Workflows"],
    problems: 20,
  },
];

export const mockInterviews = [
  {
    id: "i1",
    company: "Google",
    type: "Coding",
    difficulty: "Hard",
    duration: 60,
    questions: [
      {
        title: "Word Ladder",
        description: "A transformation sequence from beginWord to endWord using a word list where each step changes exactly one letter.",
        tags: ["BFS", "Graph"],
      },
    ],
  },
  {
    id: "i2",
    company: "Amazon",
    type: "System Design",
    difficulty: "Medium",
    duration: 45,
    questions: [
      {
        title: "Design a URL Shortener",
        description: "Design a service like bit.ly that takes long URLs and creates shorter aliases.",
        tags: ["System Design", "Database", "Caching"],
      },
    ],
  },
  {
    id: "i3",
    company: "Microsoft",
    type: "Behavioral",
    difficulty: "Easy",
    duration: 30,
    questions: [
      {
        title: "Tell me about a time you handled a conflict",
        description: "Behavioral STAR method question focusing on teamwork and conflict resolution.",
        tags: ["Behavioral", "Leadership", "STAR"],
      },
    ],
  },
];

export const features = [
  {
    icon: "🧠",
    title: "AI Skill Assessment",
    description: "15-minute personalized evaluation that maps your exact strengths, blind spots, and generates a custom learning path.",
    color: "#7C3AED",
  },
  {
    icon: "⚡",
    title: "Live Coding Playground",
    description: "VS Code-quality editor with real-time execution, test cases, AI hints, and instant feedback on your code quality.",
    color: "#3B82F6",
  },
  {
    icon: "🐛",
    title: "Debugging Simulator",
    description: "Practice finding and fixing intentional bugs in production-style code. Build the debugging instinct companies test for.",
    color: "#10B981",
  },
  {
    icon: "🏢",
    title: "Industry Simulation",
    description: "Complete real Jira tickets, fix production APIs, resolve merge conflicts — feel like a junior dev on day one.",
    color: "#F59E0B",
  },
  {
    icon: "🤖",
    title: "AI Mentor",
    description: "Context-aware AI that teaches, motivates, explains mistakes, and adapts to your pace — available 24/7.",
    color: "#EC4899",
  },
  {
    icon: "📊",
    title: "Interview Readiness Score",
    description: "Real-time assessment of your interview preparedness with detailed breakdown by skill area and company type.",
    color: "#06B6D4",
  },
];
