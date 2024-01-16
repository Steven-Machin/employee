const mysql = require('mysql2');
const inquirer = require('inquirer');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Password1',
  database: 'employee_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to handle database queries
async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

// Main function to run the application
async function startApp() {
  // Your application logic using Inquirer and database queries goes here
}

// Call the main function to start the application
startApp();
