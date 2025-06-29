const jsonServer = require('json-server');
const { getEventStream } = require('./ssemanager');
const server = jsonServer.create();
const router = jsonServer.router('products.json');
const middlewares = jsonServer.defaults();
const cors = require('cors');
server.use(cors());

const compress = require('compression');
server.use(
  compress({
    filter: () => false
  })
);
server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // 🔥 Permite CORS
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});
// --- SSE endpoint per product ---
server.get('/api/products/:id/stream', (req, res) => {
  console.log('New SSE connection for product:', req.params.id); // Debug log
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  res.flushHeaders(); // Ensure headers are sent immediately

  res.write('\n'); // Initial empty line to establish connection

  const productId = req.params.id;
  const stream = getEventStream(productId);
  stream.addClient(res);

  // Send a test message immediately to verify connection
  //res.write(`data: ${JSON.stringify({ type: 'CONNECTED', payload: { productId }})}\n\n`);
  res.write(`event: CONNECTED\ndata: ${JSON.stringify({ payload: { productId }})}\n\n`);
  res.flush && res.flush();

  req.on('close', () => {
    console.log('SSE connection closed for product:', productId); // Debug log
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
  console.log('🔴 Sending SSE bid:', bid); 
  stream.send({ type: 'NEW_BID', payload: bid });

  res.status(201).json(bid);
});

server.use('/api', router);

server.listen(3003, () => {
  console.log('✅ Mock Server is running at http://localhost:3003');
});
