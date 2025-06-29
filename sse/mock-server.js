const jsonServer = require('json-server');
const { getEventStream } = require('./ssemanager');
const server = jsonServer.create();
const router = jsonServer.router('products.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// --- SSE endpoint per product ---
server.get('/api/products/:id/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const productId = req.params.id;
  const stream = getEventStream(productId);
  stream.addClient(res);

  // Clean up when client disconnects
  req.on('close', () => {
    stream.removeClient(res);
  });
});

// --- POST /api/bids ---
server.post('/api/bids', (req, res) => {
  const bid = req.body;
  bid.id = Date.now();
  bid.timestamp = new Date().toISOString();

  const db = router.db;
  db.get('bids').push(bid).write();

  // Notify via SSE
  const stream = getEventStream(bid.productId);
  stream.send({ type: 'NEW_BID', payload: bid });

  res.status(201).json(bid);
});

server.use('/api', router);

server.listen(3003, () => {
  console.log('✅ Mock Server is running at http://localhost:3003');
});
