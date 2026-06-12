const http = require('http');

const API_URL = 'http://localhost:5000/api/v1';

async function fetchAPI(endpoint, method = 'GET', body = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  if (body) {
    options.body = JSON.stringify(body);
  }

  const start = Date.now();
  try {
    const res = await fetch(`${API_URL}${endpoint}`, options);
    const data = await res.json();
    const time = Date.now() - start;
    return { status: res.status, data, time };
  } catch (error) {
    return { status: 'ERROR', error: error.message, time: Date.now() - start };
  }
}

async function runE2ETests() {
  console.log('Running End-to-End Tests for OneCompiler Integration...');

  // 1. Login to get token
  const loginRes = await fetchAPI('/auth/login', 'POST', { email: 'student@test.com', password: 'password123' });
  if (!loginRes.data || !loginRes.data.data || !loginRes.data.data.token) {
    console.error('Failed to login:', loginRes.data);
    process.exit(1);
  }
  const token = loginRes.data.data.token;

  // 2. Get challenges
  const challengesRes = await fetchAPI('/challenges', 'GET', null, token);
  const challenges = challengesRes.data?.data?.items || [];
  if (challenges.length === 0) {
    console.error('No challenges found.');
    process.exit(1);
  }

  // Find a simple challenge like "Reverse String"
  const challenge = challenges.find(c => c.slug === 'reverse-string') || challenges[0];
  const challengeId = challenge._id;

  console.log(`Using Challenge: ${challenge.title} (${challengeId})`);

  // Define passing code for each language for "Reverse String"
  const codes = {
    javascript: `
function solve(input) {
  return input.split('').reverse().join('');
}
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim();
console.log(solve(input));
    `,
    python: `
def solve(input_str):
    return input_str[::-1]
import sys
input_str = sys.stdin.read().strip()
print(solve(input_str))
    `,
    cpp: `
#include <bits/stdc++.h>
using namespace std;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    getline(cin, s);
    reverse(s.begin(), s.end());
    cout << s << "\\n";
    return 0;
}
    `,
    java: `
import java.io.*;
public class Main {
  public static void main(String[] args) throws Exception {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    String s = br.readLine();
    if (s == null) s = "";
    System.out.println(new StringBuilder(s).reverse().toString());
  }
}
    `
  };

  const results = [];

  for (const lang of ['javascript', 'python', 'cpp', 'java']) {
    console.log(`Submitting ${lang}...`);
    const runRes = await fetchAPI(`/challenges/${challengeId}/submit`, 'POST', {
      code: codes[lang],
      language: lang
    }, token);

    const data = runRes.data?.data || {};
    results.push({
      Language: lang,
      Status: data.status || 'unknown',
      Time: `${runRes.time}ms`,
      Passed: `${data.passedCount}/${data.totalCount}`
    });
  }

  console.log('\n--- E2E TEST RESULTS ---');
  console.table(results);
}

runE2ETests();
