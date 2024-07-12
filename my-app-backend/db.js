const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

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
          userType TEXT,
          headline TEXT,
          location TEXT,
          university TEXT,
          skills TEXT,
          interests TEXT,
          goals TEXT,
          email TEXT UNIQUE,
          password TEXT,
          matchedMentor INTEGER,
          similarMentors TEXT,
          linkedinUrl TEXT,
          profileImageUrl TEXT,
          FOREIGN KEY (matchedMentor) REFERENCES user (id)
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

// Insert sample data
function insertSampleData() {
  const sampleProfiles = require('./sampleProfiles');

  sampleProfiles.forEach((profile) => {
    const {
      firstName,
      lastName,
      preferredName,
      userType,
      headline,
      location,
      university,
      skills,
      interests,
      goals,
      email,
      password,
      matchedMentor,
      similarMentors,
      linkedinUrl,
      profileImageUrl,
    } = profile;

    db.run(
      `INSERT INTO user (firstName, lastName, preferredName, userType, headline, location, university, skills, interests, goals, email, password, matchedMentor, similarMentors, linkedinUrl, profileImageUrl)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        preferredName,
        userType,
        headline,
        location,
        university,
        skills,
        interests,
        goals,
        email,
        password,
        matchedMentor,
        similarMentors,
        linkedinUrl,
        profileImageUrl,
      ],
      function (err) {
        if (err) {
          console.error(`Error inserting profile: ${email}`, err);
        } else {
          console.log(`Profile inserted successfully for email: ${email}`);
        }
      }
    );
  });
}

module.exports = { db, initializeDatabase, insertSampleData };
