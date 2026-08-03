// Striver SDE Sheet — Full problem data for the playground
// Source: https://takeuforward.org/dsa/strivers-sde-sheet-top-coding-interview-problems

export interface StriverProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  tags: string[];
  xp: number;
  solved: boolean;
  description: string;
  hint: string;
  starterCode: Record<string, string>;
  testCases: { input: string; expected: string }[];
}

export const striverProblems: StriverProblem[] = [
  // ─── Arrays ────────────────────────────────────────────
  {
    id: "s1",
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    category: "Arrays",
    tags: ["Array", "Matrix"],
    xp: 100,
    solved: false,
    description:
      "Given an m×n integer matrix, if an element is 0, set its entire row and column to 0's. You must do it in-place.\n\nExample 1:\nInput: matrix = [[1,1,1],[1,0,1],[1,1,1]]\nOutput: [[1,0,1],[0,0,0],[1,0,1]]\n\nExample 2:\nInput: matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]\nOutput: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]\n\nConstraints:\n• m == matrix.length, n == matrix[0].length\n• 1 <= m, n <= 200\n• -2³¹ <= matrix[i][j] <= 2³¹ - 1\n\nFollow up: Can you do it using O(1) extra space?",
    hint: "Use the first row and first column as markers. Track whether they originally had zeroes with two booleans.",
    starterCode: {
      python: `def setZeroes(matrix: list[list[int]]) -> None:
    # Modify matrix in-place
    pass`,
      javascript: `function setZeroes(matrix) {
    // Modify matrix in-place
}`,
      java: `class Solution {
    public void setZeroes(int[][] matrix) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]", expected: "[[1,0,1],[0,0,0],[1,0,1]]" },
      { input: "matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]", expected: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]" },
    ],
  },
  {
    id: "s2",
    title: "Pascal's Triangle",
    difficulty: "Easy",
    category: "Arrays",
    tags: ["Array", "Math"],
    xp: 50,
    solved: false,
    description:
      "Given an integer numRows, return the first numRows of Pascal's triangle.\n\nIn Pascal's triangle, each number is the sum of the two numbers directly above it.\n\nExample 1:\nInput: numRows = 5\nOutput: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]\n\nExample 2:\nInput: numRows = 1\nOutput: [[1]]\n\nConstraints:\n• 1 <= numRows <= 30",
    hint: "Each row starts and ends with 1. For interior elements, row[j] = prevRow[j-1] + prevRow[j].",
    starterCode: {
      python: `def generate(numRows: int) -> list[list[int]]:
    # Your solution here
    pass`,
      javascript: `function generate(numRows) {
    // Your solution here
}`,
      java: `class Solution {
    public List<List<Integer>> generate(int numRows) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    vector<vector<int>> generate(int numRows) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "numRows = 5", expected: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]" },
      { input: "numRows = 1", expected: "[[1]]" },
    ],
  },
  {
    id: "s3",
    title: "Next Permutation",
    difficulty: "Medium",
    category: "Arrays",
    tags: ["Array", "Two Pointers"],
    xp: 100,
    solved: false,
    description:
      "Implement next permutation, which rearranges numbers into the lexicographically next greater permutation. If no such arrangement exists, rearrange to the lowest possible order (sorted ascending). The replacement must be in-place with only constant extra memory.\n\nExample 1:\nInput: nums = [1,2,3]\nOutput: [1,3,2]\n\nExample 2:\nInput: nums = [3,2,1]\nOutput: [1,2,3]\n\nExample 3:\nInput: nums = [1,1,5]\nOutput: [1,5,1]\n\nConstraints:\n• 1 <= nums.length <= 100\n• 0 <= nums[i] <= 100",
    hint: "Find the rightmost element that is smaller than its next. Swap it with the smallest element to its right that's larger, then reverse the suffix.",
    starterCode: {
      python: `def nextPermutation(nums: list[int]) -> None:
    # Modify nums in-place
    pass`,
      javascript: `function nextPermutation(nums) {
    // Modify nums in-place
}`,
      java: `class Solution {
    public void nextPermutation(int[] nums) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "nums = [1,2,3]", expected: "[1,3,2]" },
      { input: "nums = [3,2,1]", expected: "[1,2,3]" },
      { input: "nums = [1,1,5]", expected: "[1,5,1]" },
    ],
  },
  {
    id: "s4",
    title: "Kadane's Algorithm (Maximum Subarray)",
    difficulty: "Medium",
    category: "Arrays",
    tags: ["Array", "DP"],
    xp: 100,
    solved: false,
    description:
      "Given an integer array nums, find the subarray with the largest sum, and return its sum.\n\nExample 1:\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.\n\nExample 2:\nInput: nums = [1]\nOutput: 1\n\nExample 3:\nInput: nums = [5,4,-1,7,8]\nOutput: 23\n\nConstraints:\n• 1 <= nums.length <= 10⁵\n• -10⁴ <= nums[i] <= 10⁴\n\nFollow up: Can you find the subarray indices as well?",
    hint: "Maintain a running sum. If it goes negative, reset to 0. Track the maximum seen so far.",
    starterCode: {
      python: `def maxSubArray(nums: list[int]) -> int:
    # Your solution here
    pass`,
      javascript: `function maxSubArray(nums) {
    // Your solution here
}`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", expected: "6" },
      { input: "nums = [1]", expected: "1" },
      { input: "nums = [5,4,-1,7,8]", expected: "23" },
    ],
  },
  {
    id: "s5",
    title: "Sort Colors (Dutch National Flag)",
    difficulty: "Medium",
    category: "Arrays",
    tags: ["Array", "Two Pointers"],
    xp: 100,
    solved: false,
    description:
      "Given an array nums with n objects colored red (0), white (1), or blue (2), sort them in-place so that objects of the same color are adjacent, in order red, white, blue.\n\nYou must solve this without using the library sort function.\n\nExample 1:\nInput: nums = [2,0,2,1,1,0]\nOutput: [0,0,1,1,2,2]\n\nExample 2:\nInput: nums = [2,0,1]\nOutput: [0,1,2]\n\nConstraints:\n• n == nums.length\n• 1 <= n <= 300\n• nums[i] is 0, 1, or 2\n\nFollow up: One-pass algorithm using O(1) space?",
    hint: "Use three pointers: low, mid, high. Move 0s to the front, 2s to the back, leave 1s in the middle.",
    starterCode: {
      python: `def sortColors(nums: list[int]) -> None:
    # Modify in-place, do not return
    pass`,
      javascript: `function sortColors(nums) {
    // Modify in-place
}`,
      java: `class Solution {
    public void sortColors(int[] nums) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    void sortColors(vector<int>& nums) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "nums = [2,0,2,1,1,0]", expected: "[0,0,1,1,2,2]" },
      { input: "nums = [2,0,1]", expected: "[0,1,2]" },
    ],
  },
  {
    id: "s6",
    title: "Stock Buy and Sell",
    difficulty: "Easy",
    category: "Arrays",
    tags: ["Array", "Greedy"],
    xp: 50,
    solved: false,
    description:
      "You are given an array prices where prices[i] is the price of a given stock on the iᵗʰ day. You want to maximize your profit by choosing a single day to buy and a single day to sell in the future.\n\nReturn the maximum profit. If no profit is possible, return 0.\n\nExample 1:\nInput: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 6-1 = 5.\n\nExample 2:\nInput: prices = [7,6,4,3,1]\nOutput: 0\n\nConstraints:\n• 1 <= prices.length <= 10⁵\n• 0 <= prices[i] <= 10⁴",
    hint: "Track the minimum price seen so far and compute profit at each step.",
    starterCode: {
      python: `def maxProfit(prices: list[int]) -> int:
    # Your solution here
    pass`,
      javascript: `function maxProfit(prices) {
    // Your solution here
}`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "prices = [7,1,5,3,6,4]", expected: "5" },
      { input: "prices = [7,6,4,3,1]", expected: "0" },
    ],
  },
  {
    id: "s7",
    title: "Rotate Matrix (90 Degrees)",
    difficulty: "Medium",
    category: "Arrays",
    tags: ["Array", "Matrix"],
    xp: 100,
    solved: false,
    description:
      "You are given an n×n 2D matrix representing an image. Rotate the image by 90 degrees clockwise. You must rotate in-place.\n\nExample 1:\nInput: matrix = [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [[7,4,1],[8,5,2],[9,6,3]]\n\nExample 2:\nInput: matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]\nOutput: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]\n\nConstraints:\n• n == matrix.length == matrix[i].length\n• 1 <= n <= 20\n• -1000 <= matrix[i][j] <= 1000",
    hint: "First transpose the matrix (swap rows and columns), then reverse each row.",
    starterCode: {
      python: `def rotate(matrix: list[list[int]]) -> None:
    # Rotate matrix in-place
    pass`,
      javascript: `function rotate(matrix) {
    // Rotate matrix in-place
}`,
      java: `class Solution {
    public void rotate(int[][] matrix) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", expected: "[[7,4,1],[8,5,2],[9,6,3]]" },
    ],
  },
  {
    id: "s8",
    title: "Merge Overlapping Intervals",
    difficulty: "Medium",
    category: "Arrays",
    tags: ["Array", "Sorting"],
    xp: 100,
    solved: false,
    description:
      "Given an array of intervals where intervals[i] = [startᵢ, endᵢ], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals.\n\nExample 1:\nInput: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]\nExplanation: [1,3] and [2,6] overlap, merged into [1,6].\n\nExample 2:\nInput: intervals = [[1,4],[4,5]]\nOutput: [[1,5]]\n\nConstraints:\n• 1 <= intervals.length <= 10⁴\n• intervals[i].length == 2\n• 0 <= startᵢ <= endᵢ <= 10⁴",
    hint: "Sort intervals by start time. Then iterate and merge if the current interval overlaps with the previous.",
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
    },
    testCases: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", expected: "[[1,6],[8,10],[15,18]]" },
      { input: "intervals = [[1,4],[4,5]]", expected: "[[1,5]]" },
    ],
  },
  {
    id: "s9",
    title: "Find the Duplicate Number",
    difficulty: "Medium",
    category: "Arrays",
    tags: ["Array", "Binary Search"],
    xp: 100,
    solved: false,
    description:
      "Given an array of integers nums containing n+1 integers where each integer is in the range [1, n] inclusive, there is exactly one repeated number. Return this repeated number.\n\nYou must solve it without modifying the array and using only O(1) extra space.\n\nExample 1:\nInput: nums = [1,3,4,2,2]\nOutput: 2\n\nExample 2:\nInput: nums = [3,1,3,4,2]\nOutput: 3\n\nConstraints:\n• 1 <= n <= 10⁵\n• nums.length == n + 1\n• 1 <= nums[i] <= n",
    hint: "Use Floyd's Tortoise and Hare (cycle detection). Treat each value as a pointer to the next index.",
    starterCode: {
      python: `def findDuplicate(nums: list[int]) -> int:
    # Your solution here
    pass`,
      javascript: `function findDuplicate(nums) {
    // Your solution here
}`,
      java: `class Solution {
    public int findDuplicate(int[] nums) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "nums = [1,3,4,2,2]", expected: "2" },
      { input: "nums = [3,1,3,4,2]", expected: "3" },
    ],
  },
  {
    id: "s10",
    title: "Repeat and Missing Number",
    difficulty: "Medium",
    category: "Arrays",
    tags: ["Array", "Math"],
    xp: 100,
    solved: false,
    description:
      "Given an unsorted array of size n containing numbers from 1 to n. One number appears twice and one is missing. Find both numbers.\n\nExample 1:\nInput: arr = [3,1,2,5,3]\nOutput: [3, 4]\nExplanation: 3 is repeated and 4 is missing.\n\nExample 2:\nInput: arr = [2,2]\nOutput: [2, 1]\n\nConstraints:\n• 2 <= n <= 10⁵\n• 1 <= arr[i] <= n",
    hint: "Use the sum and sum-of-squares formulas: S - S' gives missing - repeated, S² - S'² gives their sum.",
    starterCode: {
      python: `def findMissingRepeating(arr: list[int]) -> list[int]:
    # Return [repeating, missing]
    pass`,
      javascript: `function findMissingRepeating(arr) {
    // Return [repeating, missing]
}`,
      java: `class Solution {
    public int[] findMissingRepeating(int[] arr) {
        // Return [repeating, missing]
    }
}`,
      "c++": `class Solution {
public:
    vector<int> findMissingRepeating(vector<int>& arr) {
        // Return {repeating, missing}
    }
};`,
    },
    testCases: [
      { input: "arr = [3,1,2,5,3]", expected: "[3, 4]" },
      { input: "arr = [2,2]", expected: "[2, 1]" },
    ],
  },
  {
    id: "s11",
    title: "Count Inversions (Merge Sort)",
    difficulty: "Hard",
    category: "Arrays",
    tags: ["Array", "Merge Sort"],
    xp: 200,
    solved: false,
    description:
      "Given an array of N integers, count the number of inversions. An inversion is a pair (i, j) where i < j but arr[i] > arr[j].\n\nExample 1:\nInput: arr = [2, 4, 1, 3, 5]\nOutput: 3\nExplanation: Inversions are (2,1), (4,1), (4,3).\n\nExample 2:\nInput: arr = [5, 4, 3, 2, 1]\nOutput: 10\n\nExample 3:\nInput: arr = [1, 2, 3, 4, 5]\nOutput: 0\n\nConstraints:\n• 1 <= N <= 5×10⁵\n• 1 <= arr[i] <= 10⁹",
    hint: "Modify merge sort. During the merge step, count how many elements from the right half come before elements from the left half.",
    starterCode: {
      python: `def countInversions(arr: list[int]) -> int:
    # Your solution here
    pass`,
      javascript: `function countInversions(arr) {
    // Your solution here
}`,
      java: `class Solution {
    public long countInversions(int[] arr) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    long long countInversions(vector<int>& arr) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "arr = [2, 4, 1, 3, 5]", expected: "3" },
      { input: "arr = [5, 4, 3, 2, 1]", expected: "10" },
      { input: "arr = [1, 2, 3, 4, 5]", expected: "0" },
    ],
  },

  // ─── Linked List ───────────────────────────────────────
  {
    id: "s12",
    title: "Reverse a Linked List",
    difficulty: "Easy",
    category: "Linked List",
    tags: ["Linked List"],
    xp: 50,
    solved: false,
    description:
      "Given the head of a singly linked list, reverse the list and return the reversed list.\n\nExample 1:\nInput: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]\n\nExample 2:\nInput: head = [1,2]\nOutput: [2,1]\n\nConstraints:\n• 0 <= Number of nodes <= 5000\n• -5000 <= Node.val <= 5000\n\nFollow up: Can you solve it both iteratively and recursively?",
    hint: "Use three pointers: prev, curr, next. Move curr.next to point to prev, then advance all pointers.",
    starterCode: {
      python: `def reverseList(head):
    # head: Optional[ListNode]
    # Return the new head
    pass`,
      javascript: `function reverseList(head) {
    // Return the new head
}`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "head = [1,2,3,4,5]", expected: "[5,4,3,2,1]" },
      { input: "head = [1,2]", expected: "[2,1]" },
    ],
  },
  {
    id: "s13",
    title: "Middle of Linked List",
    difficulty: "Easy",
    category: "Linked List",
    tags: ["Linked List", "Two Pointers"],
    xp: 50,
    solved: false,
    description:
      "Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second one.\n\nExample 1:\nInput: head = [1,2,3,4,5]\nOutput: [3,4,5]\nExplanation: Middle node is 3.\n\nExample 2:\nInput: head = [1,2,3,4,5,6]\nOutput: [4,5,6]\nExplanation: Two middles (3 and 4), return 4.\n\nConstraints:\n• 1 <= Number of nodes <= 100\n• 1 <= Node.val <= 100",
    hint: "Use slow and fast pointers. Slow moves one step, fast moves two. When fast reaches end, slow is at middle.",
    starterCode: {
      python: `def middleNode(head):
    # Return the middle node
    pass`,
      javascript: `function middleNode(head) {
    // Return the middle node
}`,
      java: `class Solution {
    public ListNode middleNode(ListNode head) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    ListNode* middleNode(ListNode* head) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "head = [1,2,3,4,5]", expected: "[3,4,5]" },
      { input: "head = [1,2,3,4,5,6]", expected: "[4,5,6]" },
    ],
  },
  {
    id: "s14",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    tags: ["Linked List", "Recursion"],
    xp: 50,
    solved: false,
    description:
      "Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the two lists.\n\nExample 1:\nInput: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]\n\nExample 2:\nInput: list1 = [], list2 = [0]\nOutput: [0]\n\nConstraints:\n• 0 <= Number of nodes <= 50\n• -100 <= Node.val <= 100\n• Both lists are sorted in non-decreasing order",
    hint: "Use a dummy head node. Compare current nodes of both lists and append the smaller one.",
    starterCode: {
      python: `def mergeTwoLists(list1, list2):
    # Return the merged list head
    pass`,
      javascript: `function mergeTwoLists(list1, list2) {
    // Return the merged list head
}`,
      java: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", expected: "[1,1,2,3,4,4]" },
      { input: "list1 = [], list2 = [0]", expected: "[0]" },
    ],
  },
  {
    id: "s15",
    title: "Remove N-th Node From End",
    difficulty: "Medium",
    category: "Linked List",
    tags: ["Linked List", "Two Pointers"],
    xp: 100,
    solved: false,
    description:
      "Given the head of a linked list, remove the nᵗʰ node from the end and return its head.\n\nExample 1:\nInput: head = [1,2,3,4,5], n = 2\nOutput: [1,2,3,5]\n\nExample 2:\nInput: head = [1], n = 1\nOutput: []\n\nConstraints:\n• 1 <= Number of nodes <= 30\n• 0 <= Node.val <= 100\n• 1 <= n <= Number of nodes\n\nFollow up: Can you do this in one pass?",
    hint: "Use two pointers spaced n apart. When the fast pointer reaches the end, the slow pointer is just before the target node.",
    starterCode: {
      python: `def removeNthFromEnd(head, n: int):
    # Return the modified list head
    pass`,
      javascript: `function removeNthFromEnd(head, n) {
    // Return the modified list head
}`,
      java: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "head = [1,2,3,4,5], n = 2", expected: "[1,2,3,5]" },
      { input: "head = [1], n = 1", expected: "[]" },
    ],
  },
  {
    id: "s16",
    title: "Add Two Numbers (Linked List)",
    difficulty: "Medium",
    category: "Linked List",
    tags: ["Linked List", "Math"],
    xp: 100,
    solved: false,
    description:
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order and each node contains a single digit. Add the two numbers and return the sum as a linked list.\n\nExample 1:\nInput: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]\nExplanation: 342 + 465 = 807\n\nExample 2:\nInput: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]\nOutput: [8,9,9,9,0,0,0,1]\n\nConstraints:\n• Each list is non-empty\n• Each node value is 0–9\n• No leading zeros",
    hint: "Iterate both lists simultaneously, keeping a carry variable. Create new nodes for the result.",
    starterCode: {
      python: `def addTwoNumbers(l1, l2):
    # Return the head of the sum list
    pass`,
      javascript: `function addTwoNumbers(l1, l2) {
    // Return the head of the sum list
}`,
      java: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "l1 = [2,4,3], l2 = [5,6,4]", expected: "[7,0,8]" },
      { input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]", expected: "[8,9,9,9,0,0,0,1]" },
    ],
  },
  {
    id: "s17",
    title: "Detect Cycle in Linked List",
    difficulty: "Easy",
    category: "Linked List",
    tags: ["Linked List", "Floyd"],
    xp: 50,
    solved: false,
    description:
      "Given head, the head of a linked list, determine if the linked list has a cycle in it. Return true if there is a cycle, false otherwise.\n\nA cycle exists if some node can be reached again by continuously following the next pointer.\n\nExample 1:\nInput: head = [3,2,0,-4], pos = 1\nOutput: true (tail connects to node at index 1)\n\nExample 2:\nInput: head = [1], pos = -1\nOutput: false\n\nConstraints:\n• 0 <= Number of nodes <= 10⁴\n• -10⁵ <= Node.val <= 10⁵\n• pos is -1 or a valid index",
    hint: "Floyd's algorithm: use slow (1 step) and fast (2 steps) pointers. If they meet, there's a cycle.",
    starterCode: {
      python: `def hasCycle(head) -> bool:
    # Return True if cycle exists
    pass`,
      javascript: `function hasCycle(head) {
    // Return true if cycle exists
}`,
      java: `class Solution {
    public boolean hasCycle(ListNode head) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    bool hasCycle(ListNode* head) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "head = [3,2,0,-4], pos = 1", expected: "true" },
      { input: "head = [1], pos = -1", expected: "false" },
    ],
  },
  {
    id: "s18",
    title: "Flatten a Linked List",
    difficulty: "Medium",
    category: "Linked List",
    tags: ["Linked List"],
    xp: 100,
    solved: false,
    description:
      "Given a linked list where every node has a next and a bottom (child) pointer. Each node's bottom list is sorted. Flatten the list into a single sorted list using the bottom pointer.\n\nExample:\nInput:\n5 -> 10 -> 19 -> 28\n|     |     |     |\n7    20    22    35\n|          |     |\n8         50    40\n|               |\n30              45\n\nOutput: 5 -> 7 -> 8 -> 10 -> 19 -> 20 -> 22 -> 28 -> 30 -> 35 -> 40 -> 45 -> 50\n\nConstraints:\n• 0 <= Number of nodes <= 500\n• 1 <= Node.val <= 1000",
    hint: "Merge lists pairwise from the end. Merge each pair like merging two sorted lists.",
    starterCode: {
      python: `def flatten(root):
    # Return the flattened list head
    pass`,
      javascript: `function flatten(root) {
    // Return the flattened list head
}`,
      java: `class Solution {
    public Node flatten(Node root) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    Node* flatten(Node* root) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "5->10->19->28 with bottom pointers", expected: "5->7->8->10->19->20->22->28->30->35->40->45->50" },
    ],
  },

  // ─── Binary Trees ──────────────────────────────────────
  {
    id: "s19",
    title: "Inorder Traversal",
    difficulty: "Easy",
    category: "Binary Trees",
    tags: ["Tree", "DFS"],
    xp: 50,
    solved: false,
    description:
      "Given the root of a binary tree, return the inorder traversal of its nodes' values (Left → Root → Right).\n\nExample 1:\nInput: root = [1,null,2,3]\nOutput: [1,3,2]\n\nExample 2:\nInput: root = [1]\nOutput: [1]\n\nConstraints:\n• 0 <= Number of nodes <= 100\n• -100 <= Node.val <= 100\n\nFollow up: Can you solve it iteratively?",
    hint: "Recursively visit left subtree, then root, then right. For iterative, use a stack.",
    starterCode: {
      python: `def inorderTraversal(root) -> list[int]:
    # Your solution here
    pass`,
      javascript: `function inorderTraversal(root) {
    // Your solution here
}`,
      java: `class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "root = [1,null,2,3]", expected: "[1,3,2]" },
      { input: "root = [1]", expected: "[1]" },
    ],
  },
  {
    id: "s20",
    title: "Preorder Traversal",
    difficulty: "Easy",
    category: "Binary Trees",
    tags: ["Tree", "DFS"],
    xp: 50,
    solved: false,
    description:
      "Given the root of a binary tree, return the preorder traversal of its nodes' values (Root → Left → Right).\n\nExample 1:\nInput: root = [1,null,2,3]\nOutput: [1,2,3]\n\nExample 2:\nInput: root = [1]\nOutput: [1]\n\nConstraints:\n• 0 <= Number of nodes <= 100\n• -100 <= Node.val <= 100",
    hint: "Visit root first, then recursively visit left and right. For iterative, push right first onto stack then left.",
    starterCode: {
      python: `def preorderTraversal(root) -> list[int]:
    # Your solution here
    pass`,
      javascript: `function preorderTraversal(root) {
    // Your solution here
}`,
      java: `class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    vector<int> preorderTraversal(TreeNode* root) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "root = [1,null,2,3]", expected: "[1,2,3]" },
      { input: "root = [1]", expected: "[1]" },
    ],
  },
  {
    id: "s21",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    category: "Binary Trees",
    tags: ["Tree", "Recursion"],
    xp: 50,
    solved: false,
    description:
      "Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from root to the farthest leaf.\n\nExample 1:\nInput: root = [3,9,20,null,null,15,7]\nOutput: 3\n\nExample 2:\nInput: root = [1,null,2]\nOutput: 2\n\nConstraints:\n• 0 <= Number of nodes <= 10⁴\n• -100 <= Node.val <= 100",
    hint: "Depth = 1 + max(depth(left), depth(right)). Base case: null node returns 0.",
    starterCode: {
      python: `def maxDepth(root) -> int:
    # Your solution here
    pass`,
      javascript: `function maxDepth(root) {
    // Your solution here
}`,
      java: `class Solution {
    public int maxDepth(TreeNode root) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    int maxDepth(TreeNode* root) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "root = [3,9,20,null,null,15,7]", expected: "3" },
      { input: "root = [1,null,2]", expected: "2" },
    ],
  },
  {
    id: "s22",
    title: "Check if Balanced Binary Tree",
    difficulty: "Easy",
    category: "Binary Trees",
    tags: ["Tree"],
    xp: 50,
    solved: false,
    description:
      "Given a binary tree, determine if it is height-balanced. A height-balanced tree is one where the depth of the two subtrees of every node never differs by more than 1.\n\nExample 1:\nInput: root = [3,9,20,null,null,15,7]\nOutput: true\n\nExample 2:\nInput: root = [1,2,2,3,3,null,null,4,4]\nOutput: false\n\nConstraints:\n• 0 <= Number of nodes <= 5000\n• -10⁴ <= Node.val <= 10⁴",
    hint: "Return -1 from the height function if a subtree is unbalanced. This avoids redundant computation.",
    starterCode: {
      python: `def isBalanced(root) -> bool:
    # Your solution here
    pass`,
      javascript: `function isBalanced(root) {
    // Your solution here
}`,
      java: `class Solution {
    public boolean isBalanced(TreeNode root) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    bool isBalanced(TreeNode* root) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "root = [3,9,20,null,null,15,7]", expected: "true" },
      { input: "root = [1,2,2,3,3,null,null,4,4]", expected: "false" },
    ],
  },
  {
    id: "s23",
    title: "Diameter of Binary Tree",
    difficulty: "Easy",
    category: "Binary Trees",
    tags: ["Tree", "DFS"],
    xp: 50,
    solved: false,
    description:
      "Given the root of a binary tree, return the length of the diameter. The diameter is the longest path between any two nodes (measured by number of edges).\n\nExample 1:\nInput: root = [1,2,3,4,5]\nOutput: 3\nExplanation: Path is [4,2,1,3] or [5,2,1,3].\n\nExample 2:\nInput: root = [1,2]\nOutput: 1\n\nConstraints:\n• 1 <= Number of nodes <= 10⁴\n• -100 <= Node.val <= 100",
    hint: "At each node, diameter through it = height(left) + height(right). Track the global maximum.",
    starterCode: {
      python: `def diameterOfBinaryTree(root) -> int:
    # Your solution here
    pass`,
      javascript: `function diameterOfBinaryTree(root) {
    // Your solution here
}`,
      java: `class Solution {
    public int diameterOfBinaryTree(TreeNode root) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    int diameterOfBinaryTree(TreeNode* root) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "root = [1,2,3,4,5]", expected: "3" },
      { input: "root = [1,2]", expected: "1" },
    ],
  },
  {
    id: "s24",
    title: "Lowest Common Ancestor",
    difficulty: "Medium",
    category: "Binary Trees",
    tags: ["Tree", "DFS"],
    xp: 100,
    solved: false,
    description:
      "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes p and q. The LCA is the deepest node that has both p and q as descendants (a node can be a descendant of itself).\n\nExample 1:\nInput: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1\nOutput: 3\n\nExample 2:\nInput: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4\nOutput: 5\n\nConstraints:\n• 2 <= Number of nodes <= 10⁵\n• All node values are unique\n• p ≠ q, both exist in the tree",
    hint: "If root is null or equals p or q, return root. Recurse left and right. If both return non-null, root is LCA.",
    starterCode: {
      python: `def lowestCommonAncestor(root, p, q):
    # Return the LCA node
    pass`,
      javascript: `function lowestCommonAncestor(root, p, q) {
    // Return the LCA node
}`,
      java: `class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1", expected: "3" },
      { input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4", expected: "5" },
    ],
  },

  // ─── Greedy ────────────────────────────────────────────
  {
    id: "s25",
    title: "N Meetings in One Room",
    difficulty: "Easy",
    category: "Greedy",
    tags: ["Greedy", "Sorting"],
    xp: 50,
    solved: false,
    description:
      "There is one meeting room. You are given N meetings with their start and end times. Find the maximum number of meetings that can take place without overlapping.\n\nExample:\nInput: start = [1,3,0,5,8,5], end = [2,4,6,7,9,9]\nOutput: 4\nExplanation: Meetings (1,2), (3,4), (5,7), (8,9) can be held.\n\nConstraints:\n• 1 <= N <= 10⁵\n• 0 <= start[i] < end[i] <= 10⁵",
    hint: "Sort meetings by end time. Greedily pick the next meeting that starts after the last selected meeting ends.",
    starterCode: {
      python: `def maxMeetings(start: list[int], end: list[int]) -> int:
    # Your solution here
    pass`,
      javascript: `function maxMeetings(start, end) {
    // Your solution here
}`,
      java: `class Solution {
    public int maxMeetings(int[] start, int[] end) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    int maxMeetings(vector<int>& start, vector<int>& end) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "start = [1,3,0,5,8,5], end = [2,4,6,7,9,9]", expected: "4" },
    ],
  },
  {
    id: "s26",
    title: "Minimum Platforms",
    difficulty: "Medium",
    category: "Greedy",
    tags: ["Greedy", "Sorting"],
    xp: 100,
    solved: false,
    description:
      "Given arrival and departure times of all trains at a railway station, find the minimum number of platforms required so that no train waits.\n\nExample:\nInput: arr = [900, 940, 950, 1100, 1500, 1800], dep = [910, 1200, 1120, 1130, 1900, 2000]\nOutput: 3\n\nConstraints:\n• 1 <= N <= 10⁵\n• Times are in 24hr HHMM format",
    hint: "Sort both arrival and departure arrays. Use two pointers to simulate trains arriving and departing.",
    starterCode: {
      python: `def minPlatforms(arr: list[int], dep: list[int]) -> int:
    # Your solution here
    pass`,
      javascript: `function minPlatforms(arr, dep) {
    // Your solution here
}`,
      java: `class Solution {
    public int minPlatforms(int[] arr, int[] dep) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    int minPlatforms(vector<int>& arr, vector<int>& dep) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "arr = [900,940,950,1100,1500,1800], dep = [910,1200,1120,1130,1900,2000]", expected: "3" },
    ],
  },
  {
    id: "s27",
    title: "Job Sequencing Problem",
    difficulty: "Medium",
    category: "Greedy",
    tags: ["Greedy"],
    xp: 100,
    solved: false,
    description:
      "Given N jobs, each with a deadline and profit. Every job takes 1 unit of time and only one job can be done at a time. Maximize total profit if each job is done before its deadline.\n\nExample:\nInput: jobs = [(1,4,20), (2,1,10), (3,1,40), (4,1,30)] (id, deadline, profit)\nOutput: 2 jobs, profit = 60\nExplanation: Jobs 3 (profit=40) and 1 (profit=20).\n\nConstraints:\n• 1 <= N <= 10⁵\n• 1 <= Deadline <= N\n• 1 <= Profit <= 500",
    hint: "Sort jobs by profit descending. For each job, find the latest available slot before its deadline.",
    starterCode: {
      python: `def jobSequencing(jobs: list[tuple[int,int,int]]) -> tuple[int,int]:
    # Return (number_of_jobs, total_profit)
    pass`,
      javascript: `function jobSequencing(jobs) {
    // Return [numberOfJobs, totalProfit]
}`,
      java: `class Solution {
    public int[] jobSequencing(int[][] jobs) {
        // Return [numberOfJobs, totalProfit]
    }
}`,
      "c++": `class Solution {
public:
    vector<int> jobSequencing(vector<vector<int>>& jobs) {
        // Return {numberOfJobs, totalProfit}
    }
};`,
    },
    testCases: [
      { input: "jobs = [(1,4,20),(2,1,10),(3,1,40),(4,1,30)]", expected: "[2, 60]" },
    ],
  },
  {
    id: "s28",
    title: "Fractional Knapsack",
    difficulty: "Medium",
    category: "Greedy",
    tags: ["Greedy", "Sorting"],
    xp: 100,
    solved: false,
    description:
      "Given weights and values of N items, and a knapsack capacity W, maximize total value. You can take fractions of items.\n\nExample:\nInput: values = [60,100,120], weights = [10,20,30], W = 50\nOutput: 240.0\nExplanation: Take full items 1 & 2 (value=160, weight=30), then 2/3 of item 3 (value=80).\n\nConstraints:\n• 1 <= N <= 10⁵\n• 1 <= W <= 10⁹",
    hint: "Sort by value/weight ratio in decreasing order. Take as much as possible of each item greedily.",
    starterCode: {
      python: `def fractionalKnapsack(values: list[int], weights: list[int], W: int) -> float:
    # Your solution here
    pass`,
      javascript: `function fractionalKnapsack(values, weights, W) {
    // Your solution here
}`,
      java: `class Solution {
    public double fractionalKnapsack(int[] values, int[] weights, int W) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    double fractionalKnapsack(vector<int>& values, vector<int>& weights, int W) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "values = [60,100,120], weights = [10,20,30], W = 50", expected: "240.0" },
    ],
  },

  // ─── Dynamic Programming ──────────────────────────────
  {
    id: "s29",
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    tags: ["DP", "String"],
    xp: 100,
    solved: false,
    description:
      "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nA subsequence is derived by deleting some or no characters without changing the order.\n\nExample 1:\nInput: text1 = \"abcde\", text2 = \"ace\"\nOutput: 3\nExplanation: LCS is \"ace\".\n\nExample 2:\nInput: text1 = \"abc\", text2 = \"def\"\nOutput: 0\n\nConstraints:\n• 1 <= text1.length, text2.length <= 1000\n• Strings consist of lowercase English letters only",
    hint: "Build a 2D DP table. If characters match, dp[i][j] = dp[i-1][j-1] + 1; else max(dp[i-1][j], dp[i][j-1]).",
    starterCode: {
      python: `def longestCommonSubsequence(text1: str, text2: str) -> int:
    # Your solution here
    pass`,
      javascript: `function longestCommonSubsequence(text1, text2) {
    // Your solution here
}`,
      java: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: 'text1 = "abcde", text2 = "ace"', expected: "3" },
      { input: 'text1 = "abc", text2 = "def"', expected: "0" },
    ],
  },
  {
    id: "s30",
    title: "0/1 Knapsack",
    difficulty: "Medium",
    category: "Dynamic Programming",
    tags: ["DP"],
    xp: 100,
    solved: false,
    description:
      "Given N items, each with a weight and value, and a knapsack capacity W, find the maximum value you can carry. Each item can only be taken once (0/1 choice).\n\nExample:\nInput: values = [60,100,120], weights = [10,20,30], W = 50\nOutput: 220\nExplanation: Take items 2 and 3 (100+120=220, weight=50).\n\nConstraints:\n• 1 <= N <= 1000\n• 1 <= W <= 1000\n• 1 <= values[i], weights[i] <= 1000",
    hint: "Use a 2D DP table where dp[i][w] = max value using first i items with capacity w. Either include or skip item i.",
    starterCode: {
      python: `def knapsack(values: list[int], weights: list[int], W: int) -> int:
    # Your solution here
    pass`,
      javascript: `function knapsack(values, weights, W) {
    // Your solution here
}`,
      java: `class Solution {
    public int knapsack(int[] values, int[] weights, int W) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    int knapsack(vector<int>& values, vector<int>& weights, int W) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "values = [60,100,120], weights = [10,20,30], W = 50", expected: "220" },
    ],
  },
  {
    id: "s31",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    tags: ["DP", "Binary Search"],
    xp: 100,
    solved: false,
    description:
      "Given an integer array nums, return the length of the longest strictly increasing subsequence.\n\nExample 1:\nInput: nums = [10,9,2,5,3,7,101,18]\nOutput: 4\nExplanation: LIS is [2,3,7,101].\n\nExample 2:\nInput: nums = [0,1,0,3,2,3]\nOutput: 4\n\nConstraints:\n• 1 <= nums.length <= 2500\n• -10⁴ <= nums[i] <= 10⁴\n\nFollow up: Can you solve in O(n log n)?",
    hint: "O(n²): dp[i] = 1 + max(dp[j]) for j < i where nums[j] < nums[i]. O(n log n): maintain a tails array with binary search.",
    starterCode: {
      python: `def lengthOfLIS(nums: list[int]) -> int:
    # Your solution here
    pass`,
      javascript: `function lengthOfLIS(nums) {
    // Your solution here
}`,
      java: `class Solution {
    public int lengthOfLIS(int[] nums) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "nums = [10,9,2,5,3,7,101,18]", expected: "4" },
      { input: "nums = [0,1,0,3,2,3]", expected: "4" },
    ],
  },
  {
    id: "s32",
    title: "Edit Distance",
    difficulty: "Hard",
    category: "Dynamic Programming",
    tags: ["DP", "String"],
    xp: 200,
    solved: false,
    description:
      "Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) to convert word1 to word2.\n\nExample 1:\nInput: word1 = \"horse\", word2 = \"ros\"\nOutput: 3\nExplanation: horse → rorse → rose → ros\n\nExample 2:\nInput: word1 = \"intention\", word2 = \"execution\"\nOutput: 5\n\nConstraints:\n• 0 <= word1.length, word2.length <= 500\n• Strings contain lowercase English letters",
    hint: "Use DP. If chars match, dp[i][j] = dp[i-1][j-1]. Else, 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).",
    starterCode: {
      python: `def minDistance(word1: str, word2: str) -> int:
    # Your solution here
    pass`,
      javascript: `function minDistance(word1, word2) {
    // Your solution here
}`,
      java: `class Solution {
    public int minDistance(String word1, String word2) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    int minDistance(string word1, string word2) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: 'word1 = "horse", word2 = "ros"', expected: "3" },
      { input: 'word1 = "intention", word2 = "execution"', expected: "5" },
    ],
  },
  {
    id: "s33",
    title: "Matrix Chain Multiplication",
    difficulty: "Hard",
    category: "Dynamic Programming",
    tags: ["DP"],
    xp: 200,
    solved: false,
    description:
      "Given a sequence of matrix dimensions, find the most efficient way to multiply them. The problem is not to perform the multiplication but to decide the order that minimizes total scalar multiplications.\n\nExample:\nInput: arr = [40, 20, 30, 10, 30]\nOutput: 26000\nExplanation: Optimal is (A(BC))D = 20×30×10 + 40×20×10 + 40×10×30 = 26000.\n\nConstraints:\n• 2 <= N <= 100\n• 1 <= arr[i] <= 500",
    hint: "Use interval DP. dp[i][j] = min cost to multiply matrices i through j. Try all split points k.",
    starterCode: {
      python: `def matrixChainMultiplication(arr: list[int]) -> int:
    # Your solution here
    pass`,
      javascript: `function matrixChainMultiplication(arr) {
    // Your solution here
}`,
      java: `class Solution {
    public int matrixChainMultiplication(int[] arr) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    int matrixChainMultiplication(vector<int>& arr) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "arr = [40, 20, 30, 10, 30]", expected: "26000" },
    ],
  },

  // ─── Graphs ────────────────────────────────────────────
  {
    id: "s34",
    title: "BFS of Graph",
    difficulty: "Easy",
    category: "Graphs",
    tags: ["Graph", "BFS"],
    xp: 50,
    solved: false,
    description:
      "Given a directed graph represented as an adjacency list, return its BFS traversal starting from vertex 0.\n\nExample:\nInput: V = 5, adj = [[1,2],[3],[4],[],[2]]\nOutput: [0, 1, 2, 3, 4]\n\nConstraints:\n• 1 <= V, E <= 10⁴\n• 0-indexed vertices",
    hint: "Use a queue. Start from 0, mark visited, and process all unvisited neighbors at each step.",
    starterCode: {
      python: `def bfsOfGraph(V: int, adj: list[list[int]]) -> list[int]:
    # Your solution here
    pass`,
      javascript: `function bfsOfGraph(V, adj) {
    // Your solution here
}`,
      java: `class Solution {
    public ArrayList<Integer> bfsOfGraph(int V, ArrayList<ArrayList<Integer>> adj) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    vector<int> bfsOfGraph(int V, vector<vector<int>>& adj) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "V = 5, adj = [[1,2],[3],[4],[],[2]]", expected: "[0, 1, 2, 3, 4]" },
    ],
  },
  {
    id: "s35",
    title: "DFS of Graph",
    difficulty: "Easy",
    category: "Graphs",
    tags: ["Graph", "DFS"],
    xp: 50,
    solved: false,
    description:
      "Given a directed graph represented as an adjacency list, return its DFS traversal starting from vertex 0.\n\nExample:\nInput: V = 5, adj = [[2,3],[],[4],[1],[]]\nOutput: [0, 2, 4, 3, 1]\n\nConstraints:\n• 1 <= V, E <= 10⁴\n• 0-indexed vertices",
    hint: "Use recursion or a stack. Visit the current node, mark it, then recurse on unvisited neighbors.",
    starterCode: {
      python: `def dfsOfGraph(V: int, adj: list[list[int]]) -> list[int]:
    # Your solution here
    pass`,
      javascript: `function dfsOfGraph(V, adj) {
    // Your solution here
}`,
      java: `class Solution {
    public ArrayList<Integer> dfsOfGraph(int V, ArrayList<ArrayList<Integer>> adj) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    vector<int> dfsOfGraph(int V, vector<vector<int>>& adj) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "V = 5, adj = [[2,3],[],[4],[1],[]]", expected: "[0, 2, 4, 3, 1]" },
    ],
  },
  {
    id: "s36",
    title: "Detect Cycle in Undirected Graph",
    difficulty: "Medium",
    category: "Graphs",
    tags: ["Graph", "BFS"],
    xp: 100,
    solved: false,
    description:
      "Given an undirected graph with V vertices and E edges, check whether it contains any cycle.\n\nExample 1:\nInput: V = 5, edges = [[0,1],[1,2],[2,3],[3,4],[4,1]]\nOutput: true\n\nExample 2:\nInput: V = 4, edges = [[0,1],[1,2],[2,3]]\nOutput: false\n\nConstraints:\n• 1 <= V, E <= 10⁵",
    hint: "BFS/DFS from each unvisited node. If you visit a node that's already visited and it's not the parent, there's a cycle.",
    starterCode: {
      python: `def isCycle(V: int, adj: list[list[int]]) -> bool:
    # Your solution here
    pass`,
      javascript: `function isCycle(V, adj) {
    // Your solution here
}`,
      java: `class Solution {
    public boolean isCycle(int V, ArrayList<ArrayList<Integer>> adj) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    bool isCycle(int V, vector<vector<int>>& adj) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "V = 5, edges = [[0,1],[1,2],[2,3],[3,4],[4,1]]", expected: "true" },
      { input: "V = 4, edges = [[0,1],[1,2],[2,3]]", expected: "false" },
    ],
  },
  {
    id: "s37",
    title: "Topological Sort",
    difficulty: "Medium",
    category: "Graphs",
    tags: ["Graph", "DFS"],
    xp: 100,
    solved: false,
    description:
      "Given a Directed Acyclic Graph (DAG) with V vertices and E edges, find any topological ordering.\n\nA topological ordering is a linear ordering of vertices such that for every directed edge (u, v), u appears before v.\n\nExample:\nInput: V = 6, adj = [[],[],[3],[1],[0,1],[0,2]]\nOutput: [5, 4, 2, 3, 1, 0] (one valid ordering)\n\nConstraints:\n• 2 <= V <= 10⁴\n• 1 <= E <= V*(V-1)/2",
    hint: "DFS approach: post-order traversal, then reverse. BFS (Kahn's): process nodes with in-degree 0 first.",
    starterCode: {
      python: `def topologicalSort(V: int, adj: list[list[int]]) -> list[int]:
    # Your solution here
    pass`,
      javascript: `function topologicalSort(V, adj) {
    // Your solution here
}`,
      java: `class Solution {
    public int[] topologicalSort(int V, ArrayList<ArrayList<Integer>> adj) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    vector<int> topologicalSort(int V, vector<vector<int>>& adj) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "V = 6, adj = [[],[],[3],[1],[0,1],[0,2]]", expected: "[5, 4, 2, 3, 1, 0]" },
    ],
  },
  {
    id: "s38",
    title: "Dijkstra's Algorithm",
    difficulty: "Medium",
    category: "Graphs",
    tags: ["Graph", "Shortest Path"],
    xp: 100,
    solved: false,
    description:
      "Given a weighted, undirected, connected graph with V vertices and E edges, find the shortest distances from the source vertex src to all other vertices using Dijkstra's algorithm.\n\nExample:\nInput: V = 3, edges = [[0,1,1],[0,2,6],[1,2,3]], src = 0\nOutput: [0, 1, 4]\nExplanation: 0→1 = 1, 0→1→2 = 4 (shorter than direct 0→2 = 6).\n\nConstraints:\n• 1 <= V <= 1000\n• 1 <= E <= V*(V-1)/2\n• 0 <= edge weight <= 10⁴\n• No negative weights",
    hint: "Use a min-heap (priority queue). Always process the unvisited vertex with the smallest known distance.",
    starterCode: {
      python: `def dijkstra(V: int, adj: list[list[tuple[int,int]]], src: int) -> list[int]:
    # Return distances from src to all vertices
    pass`,
      javascript: `function dijkstra(V, adj, src) {
    // Return distances from src to all vertices
}`,
      java: `class Solution {
    public int[] dijkstra(int V, ArrayList<ArrayList<int[]>> adj, int src) {
        // Your solution here
    }
}`,
      "c++": `class Solution {
public:
    vector<int> dijkstra(int V, vector<vector<pair<int,int>>>& adj, int src) {
        // Your solution here
    }
};`,
    },
    testCases: [
      { input: "V = 3, edges = [[0,1,1],[0,2,6],[1,2,3]], src = 0", expected: "[0, 1, 4]" },
    ],
  },
];

export const striverCategories = [...new Set(striverProblems.map((q) => q.category))];
