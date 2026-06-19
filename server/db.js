const { Pool } = require('pg');
const net = require('net');
require('dotenv').config();

let connectionString = process.env.DATABASE_URL;
if (connectionString && connectionString.includes('db.puljxgyccrojbvwlycxd.supabase.co')) {
  connectionString = connectionString.replace('db.puljxgyccrojbvwlycxd.supabase.co', 'aws-1-ap-southeast-2.pooler.supabase.com');
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  stream: (config) => {
    const socket = new net.Socket();
    const originalConnect = socket.connect;
    socket.connect = function(port, host, cb) {
      return originalConnect.call(this, { port, host, family: 4 }, cb);
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
