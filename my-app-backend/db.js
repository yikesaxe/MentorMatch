const sqlite3 = require('sqlite3').verbose();

// Create a new database in memory
const db = new sqlite3.Database(':memory:');

// Initialize the database and create the tables
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY,
          firstName TEXT,
          lastName TEXT,
          preferredName TEXT,
          headline TEXT,
          location TEXT,
          email TEXT UNIQUE,
          password TEXT
        )`,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  });
}

module.exports = { db, initializeDatabase };
