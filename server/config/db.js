const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'foodtruth_user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'foodtruth',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to MySQL database.');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to MySQL database:', err);
    });

module.exports = pool;
