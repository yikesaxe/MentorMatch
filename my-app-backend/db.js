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
    { firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password', location: 'New York', skills: '["JavaScript", "React"]', interests: '["Coding", "Machine Learning"]', goals: '["Learn React"]', userType: 'mentor' },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', password: 'password', location: 'Los Angeles', skills: '["Python", "Django"]', interests: '["Machine Learning", "Data Analysis"]', goals: '["Build a website"]', userType: 'mentee' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', password: 'password', location: 'San Francisco', skills: '["Java", "Spring Boot"]', interests: '["Machine Learning", "Data Science"]', goals: '["Learn Spring Boot"]', userType: 'mentor' },
    { firstName: 'Bob', lastName: 'Williams', email: 'bob@example.com', password: 'password', location: 'Seattle', skills: '["C++", "Qt"]', interests: '["AI Ethics", "Robotics"]', goals: '["Develop AI applications"]', userType: 'mentee' },
    { firstName: 'Emily', lastName: 'Brown', email: 'emily@example.com', password: 'password', location: 'Chicago', skills: '["Ruby", "Rails"]', interests: '["Web Development", "UX/UI Design"]', goals: '["Build scalable web apps"]', userType: 'mentor' },
    { firstName: 'Michael', lastName: 'Jones', email: 'michael@example.com', password: 'password', location: 'Boston', skills: '["PHP", "Laravel"]', interests: '["Backend Development", "Cloud Computing"]', goals: '["Master Laravel"]', userType: 'mentee' },
    { firstName: 'Sophia', lastName: 'Davis', email: 'sophia@example.com', password: 'password', location: 'Austin', skills: '["SQL", "Database Management"]', interests: '["Data Analysis", "Business Intelligence"]', goals: '["Become a DBA"]', userType: 'mentor' },
    { firstName: 'Oliver', lastName: 'Miller', email: 'oliver@example.com', password: 'password', location: 'Denver', skills: '["Angular", "TypeScript"]', interests: '["Frontend Development", "Mobile Apps"]', goals: '["Master Angular"]', userType: 'mentee' },
    { firstName: 'Isabella', lastName: 'Wilson', email: 'isabella@example.com', password: 'password', location: 'Portland', skills: '["Node.js", "Express"]', interests: '["Full Stack Development", "DevOps"]', goals: '["Deploy scalable apps"]', userType: 'mentor' },
    { firstName: 'William', lastName: 'Moore', email: 'william@example.com', password: 'password', location: 'Miami', skills: '["Python", "Flask"]', interests: '["Machine Learning", "Artificial Intelligence"]', goals: '["Develop AI models"]', userType: 'mentee' }
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