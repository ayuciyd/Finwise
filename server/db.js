const { Pool } = require('pg');
const net = require('net');
require('dotenv').config();

if (process.env.DATABASE_URL) {
  try {
    const parsedUrl = new URL(process.env.DATABASE_URL);
    console.log(`Database Connection Config: host=${parsedUrl.hostname}, port=${parsedUrl.port}, user=${parsedUrl.username}, database=${parsedUrl.pathname}`);
  } catch (e) {
    console.log('Error parsing DATABASE_URL:', e.message);
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  stream: (config) => {
    const socket = new net.Socket();
    const originalConnect = socket.connect;
    socket.connect = function(port, host, cb) {
      let targetHost = host;
      if (host && host.includes('db.puljxgyccrojbvwlycxd.supabase.co')) {
        targetHost = 'aws-1-ap-southeast-2.pooler.supabase.com';
      }
      return originalConnect.call(this, { port, host: targetHost, family: 4 }, cb);
    };
    return socket;
  }
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
