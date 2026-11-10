import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const loginFailRate = new Rate('login_failures');
const apiResponseTime = new Trend('api_response_time');
const totalRequests = new Counter('total_requests');

// Configuration - SAFE for GCP free tier with max-instances=1
// Cloud Run free tier: 2M requests/month, 360K GB-seconds, 360K GHz-seconds
// With max-instances=1, single instance handles all requests
// 
// IMPORTANT: This is a LOAD test (safe), not a STRESS test (breaks things)
// Adjust LOAD_PROFILE env var: 'safe' | 'moderate' | 'stress'
const BASE_URL = __ENV.BASE_URL || 'https://twilight-struggle-backend-test-346529809697.us-central1.run.app/api';
const LOAD_PROFILE = __ENV.LOAD_PROFILE || 'safe';

// Load profiles - pick based on your risk tolerance
const PROFILES = {
  safe: {     // ~60 requests/min, won't spike billing
    logged_out_vus: 2,
    logged_in_vus: 1,
    duration: '1m',
    think_time: 5,  // seconds between request groups
  },
  moderate: { // ~180 requests/min, still safe for free tier
    logged_out_vus: 5,
    logged_in_vus: 3,
    duration: '2m',
    think_time: 3,
  },
  stress: {   // Pushes limits - use only if you want to find breaking point
    logged_out_vus: 10,
    logged_in_vus: 5,
    duration: '3m',
    think_time: 1,
  },
};

const profile = PROFILES[LOAD_PROFILE] || PROFILES.safe;

// Test credentials for logged-in scenario (provide via env vars)
const TEST_USERS = [
  { email: __ENV.TEST_EMAIL_1 || 'user1@example.com', password: __ENV.TEST_PASSWORD_1 || 'password1' },
  { email: __ENV.TEST_EMAIL_2 || 'user2@example.com', password: __ENV.TEST_PASSWORD_2 || 'password2' },
  { email: __ENV.TEST_EMAIL_3 || 'user3@example.com', password: __ENV.TEST_PASSWORD_3 || 'password3' },
];

export const options = {
  scenarios: {
    // Scenario 1: Logged out (anonymous) users
    // Simulates public page visits - tournaments list, standings, health checks
    logged_out_users: {
      executor: 'constant-vus',
      vus: profile.logged_out_vus,
      duration: profile.duration,
      exec: 'loggedOutScenario',
      tags: { scenario: 'logged_out' },
    },
    // Scenario 2: Logged in (authenticated) users
    // Simulates authenticated actions - profile, my tournaments, schedule
    logged_in_users: {
      executor: 'constant-vus',
      vus: profile.logged_in_vus,
      duration: profile.duration,
      exec: 'loggedInScenario',
      tags: { scenario: 'logged_in' },
      startTime: '10s', // Start 10s after logged_out scenario
    },
  },
  thresholds: {
    // Global thresholds - stricter for free tier safety
    http_req_duration: ['p(95)<3000'], // 95% of requests under 3s (accounts for cold starts)
    http_req_failed: ['rate<0.10'],    // Less than 10% requests failed
    
    // Custom metric thresholds
    login_failures: ['rate<0.15'],     // Less than 15% login failures
    api_response_time: ['p(95)<4000'], // 95% of API calls under 4s
  },
};

// Helper: Login and get token
function login(email, password) {
  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ mail: email, pwd: password }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  totalRequests.add(1);

  const success = check(res, {
    'login status is 200': (r) => r.status === 200,
    'login has token': (r) => {
      try {
        const body = r.json();
        return body.token !== undefined;
      } catch {
        return false;
      }
    },
  });

  loginFailRate.add(!success);

  if (success) {
    return res.json().token;
  }
  return null;
}

// Helper: Get auth headers
function authHeaders(token) {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
}

// Scenario 1: Logged out (anonymous) user actions
export function loggedOutScenario() {
  group('Logged Out - Public Endpoints', function() {

    // 1. Health check
    group('Health Check', function() {
      const res = http.get(`${BASE_URL}/auth/health`);
      totalRequests.add(1);
      check(res, {
        'health status is 200': (r) => r.status === 200,
      });
      apiResponseTime.add(res.timings.duration);
      sleep(profile.think_time);
    });

    // 2. Get tournaments list (public)
    group('Tournaments List', function() {
      // Get tournaments by status (active tournaments)
      const res = http.get(`${BASE_URL}/tournaments?status=2,3,4`);
      totalRequests.add(1);
      check(res, {
        'tournaments status is 200': (r) => r.status === 200,
        'tournaments response is array': (r) => {
          try {
            return Array.isArray(r.json());
          } catch {
            return false;
          }
        },
      });
      apiResponseTime.add(res.timings.duration);
      sleep(profile.think_time);
    });

    // 3. Get standings (public)
    group('Standings', function() {
      // Get standings for tournament 359 (current season)
      const res = http.get(`${BASE_URL}/standings?id=359`);
      totalRequests.add(1);
      check(res, {
        'standings status is 200': (r) => r.status === 200,
      });
      apiResponseTime.add(res.timings.duration);
      sleep(profile.think_time);
    });

    // 4. Get tournament details
    group('Tournament Details', function() {
      const res = http.get(`${BASE_URL}/tournaments?id=359`);
      totalRequests.add(1);
      check(res, {
        'tournament details status is 200': (r) => r.status === 200,
      });
      apiResponseTime.add(res.timings.duration);
      sleep(profile.think_time);
    });

    // 5. Get countries (if public)
    group('Countries', function() {
      const res = http.get(`${BASE_URL}/countries`);
      totalRequests.add(1);
      check(res, {
        'countries status is 200': (r) => r.status === 200,
      });
      apiResponseTime.add(res.timings.duration);
      sleep(profile.think_time);
    });
  });

  // Think time between user sessions
  sleep(profile.think_time * 2);
}

// Scenario 2: Logged in (authenticated) user actions
export function loggedInScenario() {
  // Pick a test user based on VU id
  const vuId = __VU;
  const userIndex = (vuId % TEST_USERS.length);
  const testUser = TEST_USERS[userIndex];

  // Login first
  const token = login(testUser.email, testUser.password);

  if (!token) {
    // Login failed, skip this iteration
    console.warn(`Login failed for user ${testUser.email}, skipping iteration`);
    sleep(profile.think_time * 2);
    return;
  }

  group('Logged In - Authenticated Endpoints', function() {

    // 1. Get profile
    group('Profile', function() {
      const res = http.get(`${BASE_URL}/auth/profile`, authHeaders(token));
      totalRequests.add(1);
      check(res, {
        'profile status is 200': (r) => r.status === 200,
        'profile has id': (r) => {
          try {
            return r.json().id !== undefined;
          } catch {
            return false;
          }
        },
      });
      apiResponseTime.add(res.timings.duration);
      sleep(profile.think_time);
    });

    // 2. Get user's registered tournaments
    group('My Tournaments', function() {
      const res = http.get(`${BASE_URL}/tournaments/user/registered`, authHeaders(token));
      totalRequests.add(1);
      check(res, {
        'my tournaments status is 200': (r) => r.status === 200,
      });
      apiResponseTime.add(res.timings.duration);
      sleep(profile.think_time);
    });

    // 3. Get user's admin tournaments
    group('Admin Tournaments', function() {
      const res = http.get(`${BASE_URL}/tournaments/user/admin`, authHeaders(token));
      totalRequests.add(1);
      check(res, {
        'admin tournaments status is 200': (r) => r.status === 200,
      });
      apiResponseTime.add(res.timings.duration);
      sleep(profile.think_time);
    });

    // 4. Get available tournaments with schedule
    group('Available Tournaments', function() {
      const res = http.get(`${BASE_URL}/tournaments/user/available-with-schedule`, authHeaders(token));
      totalRequests.add(1);
      check(res, {
        'available tournaments status is 200': (r) => r.status === 200,
      });
      apiResponseTime.add(res.timings.duration);
      sleep(profile.think_time);
    });

    // 5. Get standings (authenticated)
    group('Standings Authenticated', function() {
      const res = http.get(`${BASE_URL}/standings?id=359`, authHeaders(token));
      totalRequests.add(1);
      check(res, {
        'authenticated standings status is 200': (r) => r.status === 200,
      });
      apiResponseTime.add(res.timings.duration);
      sleep(profile.think_time);
    });

    // 6. Get tournaments list (authenticated)
    group('Tournaments List Authenticated', function() {
      const res = http.get(`${BASE_URL}/tournaments?status=2,3,4,5`, authHeaders(token));
      totalRequests.add(1);
      check(res, {
        'authenticated tournaments status is 200': (r) => r.status === 200,
      });
      apiResponseTime.add(res.timings.duration);
      sleep(profile.think_time);
    });
  });

  // Think time between user sessions
  sleep(profile.think_time * 2);
}

// Setup function - runs once before all tests
export function setup() {
  console.log(`\n========================================`);
  console.log(`K6 Load Test - Profile: ${LOAD_PROFILE.toUpperCase()}`);
  console.log(`========================================`);
  console.log(`Logged out VUs: ${profile.logged_out_vus}`);
  console.log(`Logged in VUs:  ${profile.logged_in_vus}`);
  console.log(`Duration:       ${profile.duration}`);
  console.log(`Think time:     ${profile.think_time}s`);
  console.log(`Target:         ${BASE_URL}`);
  console.log(`========================================\n`);

  // Verify API is reachable
  const res = http.get(`${BASE_URL}/auth/health`);
  if (res.status !== 200) {
    console.error(`API health check failed: ${res.status}`);
    return { apiHealthy: false };
  }
  console.log(`API is healthy at ${BASE_URL}`);
  return { apiHealthy: true };
}

// Teardown function - runs once after all tests
export function teardown(data) {
  console.log('\n========================================');
  console.log('Load test completed');
  console.log(`API was healthy: ${data.apiHealthy}`);
  console.log('========================================\n');
}
