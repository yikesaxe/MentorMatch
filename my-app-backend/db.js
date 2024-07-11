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
          password TEXT,
          skills TEXT,
          interests TEXT,
          goals TEXT,
          userType TEXT
        )`,
        (err) => {
          if (err) {
            reject(err);
          } else {
            prefillDatabase()
              .then(resolve)
              .catch(reject);
          }
        }
      );
    });
  });
}

function prefillDatabase() {
  const users = [
    { firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password', location: 'New York', skills: '["JavaScript", "React"]', interests: '["Coding", "Hiking"]', goals: '["Learn React"]', userType: 'mentor' },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', password: 'password', location: 'Los Angeles', skills: '["Python", "Django"]', interests: '["Reading", "Cooking"]', goals: '["Build a website"]', userType: 'mentee' }
    // Add more dummy data as needed
  ];

  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO user (firstName, lastName, email, password, location, skills, interests, goals, userType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    users.forEach(user => {
      stmt.run(user.firstName, user.lastName, user.email, user.password, user.location, user.skills, user.interests, user.goals, user.userType);
    });
    stmt.finalize((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = { db, initializeDatabase };