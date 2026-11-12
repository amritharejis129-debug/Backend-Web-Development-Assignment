const crypto = require('node:crypto');
const { handleEvent } = require('./eventHandlers');

const _processedIds = new Set();

function verifySignature(rawBody, sigHeader, secret) {
  if (!sigHeader || typeof sigHeader !== 'string' || !secret) {
    return false;
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody) // rawBuffer from express.raw()
    .digest('hex');

  // Extract hex after 'sha256='
  const received = sigHeader.split('=').slice(1).join('=');

  const expectedBuf = Buffer.from(expected, 'hex');
  const receivedBuf = Buffer.from(received, 'hex');

  // timingSafeEqual throws an error if buffers have different byte lengths
  if (expectedBuf.length !== receivedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

async function handleWebhook(req, res) {
  // 1. Verify HMAC-SHA256 signature over the raw Buffer
  const sig = req.headers['x-webhook-signature'];
  if (!verifySignature(req.body, sig, process.env.WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 2. Parse body AFTER verification
  const event = JSON.parse(req.body);

  // 3. Idempotency check
  if (_processedIds.has(event.id)) {
    return res.status(200).json({ status: 'already_processed' });
  }

  // 4. Mark event ID as processed BEFORE calling handleEvent
  _processedIds.add(event.id);

  // 5. Acknowledge fast with 200, then process asynchronously
  res.status(200).json({ status: 'received' });

  setImmediate(() => {
    handleEvent(event);
  });
}

module.exports = {
  handleWebhook,
  _processedIds,
};