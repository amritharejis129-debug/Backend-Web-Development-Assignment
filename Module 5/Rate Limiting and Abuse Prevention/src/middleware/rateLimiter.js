'use strict';

const rateLimit = require('express-rate-limit');

// Configure the strict auth rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5,                   // Limit each IP to 5 failed requests per windowMs
  skipSuccessfulRequests: true, // Only failed attempts count (successful logins don't burn quota)
  standardHeaders: true,    // Send standard RateLimit-* headers and Retry-After on 429
  legacyHeaders: false,     // Disable legacy X-RateLimit-* headers
});

module.exports = authLimiter;

/*
 * ==============================================================================
 * MULTI-INSTANCE SCALING & REDIS STORE EXPLANATION
 * ==============================================================================
 * 
 * 1. Why the default in-memory store fails across multiple instances:
 *    By default, express-rate-limit uses an in-memory store (MemoryStore) tied 
 *    to the specific Node.js process instance. When a production application scales 
 *    horizontally behind a load balancer (running multiple app instances), each 
 *    instance maintains its own separate, isolated request counter. An attacker 
 *    can distribute their requests across all instances, effectively multiplying 
 *    their allowed limit (e.g., 5 attempts × 3 instances = 15 attempts), bypassing 
 *    the strict rate-limiting protection.
 * 
 * 2. How a Redis-backed store solves this:
 *    Using a Redis-backed store (such as `rate-limit-redis`) moves the rate counter 
 *    out of individual server memory and into a centralized Redis cluster. Every app 
 *    instance queries and updates this single shared Redis counter atomically. This 
 *    ensures the rate limit is strictly enforced globally across the entire cluster, 
 *    regardless of which instance receives the incoming client request.
 * ==============================================================================
 */