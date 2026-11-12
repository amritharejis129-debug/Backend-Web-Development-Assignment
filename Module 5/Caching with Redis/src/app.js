const express = require('express');
const db = require('./db');
const { cacheGet, cacheSet, cacheDel } = require('./cache');

const app = express();
app.use(express.json());

const FEED_KEY = 'feed:trending';
const FEED_TTL = 60;

// GET /feed with Cache-Aside
app.get('/feed', async (req, res) => {
  const start = Date.now();

  // 1. Check cache first
  const cached = await cacheGet(FEED_KEY);
  if (cached) {
    const ms = Date.now() - start;
    console.log(`[feed] HIT ${ms}ms`);
    res.set('X-Cache', 'HIT');
    return res.json(cached);
  }

  // 2. Cache miss — query database
  const posts = await db.getTrendingPosts();

  // 3. Populate cache with 60s TTL
  await cacheSet(FEED_KEY, posts, FEED_TTL);

  const ms = Date.now() - start;
  console.log(`[feed] MISS ${ms}ms`);
  res.set('X-Cache', 'MISS');
  res.json(posts);
});

// POST /posts with Cache Invalidation
app.post('/posts', async (req, res) => {
  const post = await db.createPost(req.body);
  
  // Invalidate the trending feed cache on write
  await cacheDel(FEED_KEY);

  res.status(201).json(post);
});

// Export as an object because tests/run.js expects { app }
module.exports = { app };