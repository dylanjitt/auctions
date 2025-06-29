// sseManager.js
const streams = {};

function getEventStream(productId) {
  if (!streams[productId]) {
    streams[productId] = {
      clients: [],
      addClient(res) {
        this.clients.push(res);
      },
      removeClient(res) {
        this.clients = this.clients.filter(c => c !== res);
      },
      send(data) {
        const payload = `data: ${JSON.stringify(data)}\n\n`;
        this.clients.forEach(res => res.write(payload));
      }
    };
  }
  return streams[productId];
}

module.exports = { getEventStream };
