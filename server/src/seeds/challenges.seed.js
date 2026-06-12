const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const CodingChallenge = require('../models/CodingChallenge');

function getStarterCode() {
  return {
    javascript: 'function solve(input) {\n  // TODO\n  return input;\n}\n\nconst fs = require("fs");\nconst input = fs.readFileSync(0, "utf8").trim();\nconsole.log(solve(input));',
    python: 'def solve(input_str):\n    # TODO\n    return input_str\n\nimport sys\ninput_str = sys.stdin.read().strip()\nprint(solve(input_str))',
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main(){\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    string s;\n    getline(cin, s);\n    cout << s << "\\n";\n    return 0;\n}',
    java: 'import java.io.*;\npublic class Main {\n  public static void main(String[] args) throws Exception {\n    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n    String s = br.readLine();\n    System.out.println(s == null ? "" : s);\n  }\n}',
  };
}

function buildChallenges() {
  const starterCode = getStarterCode();
  return [
    { title: 'Reverse String', slug: 'reverse-string', difficulty: 'easy', topics: ['strings'], description: 'Given a string, print it in reverse.', constraints: ['1 <= n <= 10^5'], examples: [{ input: 'hello', output: 'olleh' }], testCases: [{ input: 'hello', output: 'olleh', isHidden: false }, { input: 'abcd', output: 'dcba', isHidden: true }], allowedLanguages: ['javascript', 'python', 'cpp', 'java'], starterCode },
    { title: 'Sum of Array', slug: 'sum-of-array', difficulty: 'easy', topics: ['arrays'], description: 'Given space-separated integers, output their sum.', constraints: ['1 <= n <= 10^5'], examples: [{ input: '1 2 3', output: '6' }], testCases: [{ input: '1 2 3', output: '6', isHidden: false }, { input: '10 20 30', output: '60', isHidden: true }], allowedLanguages: ['javascript', 'python', 'cpp', 'java'], starterCode },
    { title: 'Valid Parentheses', slug: 'valid-parentheses', difficulty: 'medium', topics: ['stack'], description: 'Check if bracket sequence is valid.', constraints: ['n <= 10^5'], examples: [{ input: '()[]{}', output: 'true' }], testCases: [{ input: '()[]{}', output: 'true', isHidden: false }, { input: '(]', output: 'false', isHidden: true }], allowedLanguages: ['javascript', 'python', 'cpp', 'java'], starterCode },
    { title: 'Two Sum Indices', slug: 'two-sum-indices', difficulty: 'medium', topics: ['hashmap'], description: 'Given nums and target, return two indices.', constraints: ['n <= 10^5'], examples: [{ input: '2 7 11 15\n9', output: '0 1' }], testCases: [{ input: '2 7 11 15\n9', output: '0 1', isHidden: false }, { input: '3 2 4\n6', output: '1 2', isHidden: true }], allowedLanguages: ['javascript', 'python', 'cpp', 'java'], starterCode },
    { title: 'Longest Substring Without Repeat', slug: 'longest-substring-without-repeat', difficulty: 'medium', topics: ['sliding-window'], description: 'Find max length of substring without duplicate chars.', constraints: ['n <= 10^5'], examples: [{ input: 'abcabcbb', output: '3' }], testCases: [{ input: 'abcabcbb', output: '3', isHidden: false }, { input: 'bbbbb', output: '1', isHidden: true }], allowedLanguages: ['javascript', 'python', 'cpp', 'java'], starterCode },
    { title: 'Binary Search', slug: 'binary-search', difficulty: 'medium', topics: ['binary-search'], description: 'Return index of target in sorted array else -1.', constraints: ['n <= 10^5'], examples: [{ input: '1 3 5 7 9\n7', output: '3' }], testCases: [{ input: '1 3 5 7 9\n7', output: '3', isHidden: false }, { input: '1 2 3\n4', output: '-1', isHidden: true }], allowedLanguages: ['javascript', 'python', 'cpp', 'java'], starterCode },
    { title: 'Merge Intervals', slug: 'merge-intervals', difficulty: 'medium', topics: ['intervals'], description: 'Merge overlapping intervals and print flattened output.', constraints: ['n <= 10^4'], examples: [{ input: '1 3\n2 6\n8 10', output: '1 6\n8 10' }], testCases: [{ input: '1 3\n2 6\n8 10', output: '1 6\n8 10', isHidden: false }, { input: '1 4\n4 5', output: '1 5', isHidden: true }], allowedLanguages: ['javascript', 'python', 'cpp', 'java'], starterCode },
    { title: 'LRU Cache Simulation', slug: 'lru-cache-simulation', difficulty: 'hard', topics: ['design'], description: 'Simulate LRU cache operations and output final state.', constraints: ['ops <= 10^5'], examples: [{ input: '2\nput 1 1\nput 2 2\nget 1', output: '1' }], testCases: [{ input: '2\nput 1 1\nput 2 2\nget 1', output: '1', isHidden: false }, { input: '2\nput 1 1\nput 2 2\nput 3 3\nget 2', output: '-1', isHidden: true }], allowedLanguages: ['javascript', 'python', 'cpp', 'java'], starterCode },
    { title: 'Word Ladder Length', slug: 'word-ladder-length', difficulty: 'hard', topics: ['bfs'], description: 'Find shortest transformation length.', constraints: ['n <= 5000'], examples: [{ input: 'hit\ncog\nhot dot dog lot log cog', output: '5' }], testCases: [{ input: 'hit\ncog\nhot dot dog lot log cog', output: '5', isHidden: false }, { input: 'hit\ncog\nhot dot dog lot log', output: '0', isHidden: true }], allowedLanguages: ['javascript', 'python', 'cpp', 'java'], starterCode },
    { title: 'Median of Two Sorted Arrays', slug: 'median-two-sorted-arrays', difficulty: 'hard', topics: ['binary-search'], description: 'Find median of two sorted arrays in O(log(m+n)).', constraints: ['m,n <= 10^5'], examples: [{ input: '1 3\n2', output: '2' }], testCases: [{ input: '1 3\n2', output: '2', isHidden: false }, { input: '1 2\n3 4', output: '2.5', isHidden: true }], allowedLanguages: ['javascript', 'python', 'cpp', 'java'], starterCode },
  ];
}

async function run() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codeloom-seed';
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  } catch (err) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  }

  let instructor = await User.findOne({ role: 'instructor' });
  if (!instructor) {
    instructor = await User.create({
      name: 'Challenge Instructor',
      email: 'challenge.instructor@example.com',
      password: 'password123',
      role: 'instructor',
    });
  }

  await CodingChallenge.deleteMany({});

  const challenges = buildChallenges().map((c) => ({ ...c, createdBy: instructor._id }));
  await CodingChallenge.insertMany(challenges);

  console.log('Seeded 10 coding challenges');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
