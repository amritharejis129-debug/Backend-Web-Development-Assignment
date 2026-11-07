const express = require('express');
const router = express.Router();
const store = require('../store');

router.post('/', (req, res) => {
  const key = req.headers['idempotency-key'];

  // Rule 1: Missing key -> return 400 Bad Request
  if (!key) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Header Idempotency-Key is required.'
      }
    });
  }

  // Rule 2: Repeat key -> return cached response
  if (store.idempotency.has(key)) {
    const saved = store.idempotency.get(key);
    return res.status(saved.status).json(saved.body);
  }

  // Rule 3 & 4: New / Different key -> create single charge and cache response
  const chargeId = store.nextChargeId();
  store.charges.push({ id: chargeId, amount: req.body?.amount || 4999 });

  const responseBody = { id: chargeId, status: 'charged' };
  const responseStatus = 201;

  // Save the key and response in memory
  store.idempotency.set(key, { status: responseStatus, body: responseBody });

  return res.status(responseStatus).json(responseBody);
});

module.exports = router;