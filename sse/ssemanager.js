// sseManager.js
const streams = {};

function getEventStream(productId) {
  if (!streams[productId]) {
    streams[productId] = {
      clients: [],
      addClient(res) {
        console.log('Client added to stream for product:', productId);
        this.clients.push(res);
      },
      removeClient(res) {
        this.clients = this.clients.filter(c => c !== res);
      },
      send(data) {
        const type = data.type || 'message';
        const payload = `event: ${type}\ndata: ${JSON.stringify({payload:data.payload})}\n\n`;
        console.log('Sending SSE message for product:', productId, payload);
        this.clients.forEach(res => {res.write(payload);
          res.flush && res.flush();
        }
      );
      }
    };
  }
  return streams[productId];
}

module.exports = { getEventStream };
