const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, initializeDatabase } = require('./db');
const { fetchProfiles, rankMentorsForMentees } = require('./matching');
const sampleProfiles = require('./sampleProfiles');

const app = express();
const port = 8001;
const secretKey = 'your_secret_key';

app.use(cors());
app.use(bodyParser.json());

// Authentication middleware
function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id;
    next();
  });
}

// Root route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Function to insert sample data
const insertSampleData = () => {
  sampleProfiles.forEach(profile => {
    // Check if the email already exists
    db.get('SELECT COUNT(*) AS count FROM user WHERE email = ?', [profile.email], (err, row) => {
      if (err) {
        console.error('Error checking for existing email:', profile.email, err);
        return;
      }

      if (row.count > 0) {
        console.log(`Skipping insertion for existing email: ${profile.email}`);
      } else {
        db.run(
          `INSERT INTO user (firstName, lastName, email, password, userType, location, university, skills, interests, goals, headline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            profile.firstName,
            profile.lastName,
            profile.email,
            bcrypt.hashSync(profile.password, 8),
            profile.userType,
            profile.location,
            profile.university,
            profile.skills,
            profile.interests,
            profile.goals,
            profile.headline
          ],
          (err) => {
            if (err) {
              console.error('Error inserting profile:', profile.email, err);
            } else {
              console.log(`Profile inserted successfully for email: ${profile.email}`);
            }
          }
        );
      }
    });
  });

  console.log('Sample data insertion complete');
};

// Function to run matching algorithm and update matches for all users
const updateAllUserMatches = async () => {
  try {
    const profiles = await fetchProfiles();
    console.log('Profiles fetched:', profiles);

    const rankedMatches = await rankMentorsForMentees(profiles);
    console.log('Ranked matches:', rankedMatches);

    rankedMatches.forEach(({ mentee, mentors }) => {
      if (mentors.length > 0) {
        db.run(
          `UPDATE user SET matchedMentor = ?, similarMentors = ? WHERE id = ?`,
          [
            mentors[0].mentor.id,
            JSON.stringify(mentors.map(mentor => mentor.mentor.id)),
            mentee.id
          ],
          (err) => {
            if (err) {
              console.error('Error updating user matches:', err);
            }
          }
        );
      }
    });
    console.log('All user matches updated successfully');
  } catch (error) {
    console.error('Error in updateAllUserMatches:', error);
  }
};

// User registration
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, ...otherFields } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const hashedPassword = bcrypt.hashSync(password, 8);

  db.run(
    `INSERT INTO user (firstName, lastName, email, password, ${Object.keys(otherFields).join(', ')}) VALUES (?, ?, ?, ?, ${Object.keys(otherFields).map(() => '?').join(', ')})`,
    [firstName, lastName, email, hashedPassword, ...Object.values(otherFields)],
    async function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          console.error('Error: Email already in use.');
          res.status(400).json({ error: 'Email already in use' });
        } else {
          console.error('Error registering user:', err);
          res.status(500).json({ error: 'User registration failed' });
        }
      } else {
        console.log(`User registered successfully with ID: ${this.lastID}`);
        const token = jwt.sign({ id: this.lastID }, secretKey, { expiresIn: 86400 }); // 24 hours
        res.status(200).json({ auth: true, token, id: this.lastID });
        await updateAllUserMatches(); // Update matches after registration
      }
    }
  );
});

// User login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM user WHERE email = ?', [email], (err, user) => {
    if (err || !user) {
      console.error('Login failed: User not found.');
      return res.status(500).json({ error: 'Login failed' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      console.error('Login failed: Invalid password.');
      return res.status(401).json({ auth: false, token: null });
    }

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: 86400 }); // 24 hours
    res.status(200).json({ auth: true, token, id: user.id });
  });
});

// Get user data (protected)
app.get('/user/:id', verifyToken, (req, res) => {
  if (req.userId != req.params.id) {
    return res.status(403).send({ auth: false, message: 'Unauthorized access.' });
  }

  db.get('SELECT * FROM user WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.status(500).json({ error: err.message });
    } else {
      res.json(row);
    }
  });
});

// Get user matches (protected)
app.get('/user/:id/matches', verifyToken, async (req, res) => {
  if (req.userId != req.params.id) {
    return res.status(403).send({ auth: false, message: 'Unauthorized access.' });
  }

  try {
    const profiles = await fetchProfiles();
    console.log('Profiles fetched:', profiles);

    const rankedMatches = await rankMentorsForMentees(profiles);
    console.log('Ranked matches:', rankedMatches);

    const userMatches = rankedMatches.find(match => match.mentee.id === parseInt(req.params.id));
    console.log('User matches:', userMatches);

    if (userMatches) {
      const mentorsData = userMatches.mentors.map(mentor => ({
        id: mentor.mentor.id,
        firstName: mentor.mentor.firstName,
        lastName: mentor.mentor.lastName,
        location: mentor.mentor.location,
        university: mentor.mentor.university,
        skills: mentor.mentor.skills,
        interests: mentor.mentor.interests,
        goals: mentor.mentor.goals,
        headline: mentor.mentor.headline,
      }));
      console.log('Mentors data:', mentorsData);
      res.json(mentorsData);
    } else {
      res.status(404).json({ message: 'No matches found for the user.' });
    }
  } catch (err) {
    console.error('Error fetching matches:', err);
    res.status(500).json({ error: 'Error fetching matches' });
  }
});

// Update user data (protected)
app.put('/user/:id', verifyToken, (req, res) => {
  if (req.userId != req.params.id) {
    return res.status(403).send({ auth: false, message: 'Unauthorized access.' });
  }

  const { firstName, lastName, preferredName, headline, location } = req.body;
  db.run(
    `UPDATE user SET firstName = ?, lastName = ?, preferredName = ?, headline = ?, location = ? WHERE id = ?`,
    [firstName, lastName, preferredName, headline, location, req.params.id],
    function (err) {
      if (err) {
        console.error('Error updating user data:', err);
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: 'User updated successfully', changes: this.changes });
        updateAllUserMatches(); // Update matches after user data change
      }
    }
  );
});

// Reset database
app.post('/reset-database', async (req, res) => {
  try {
    await initializeDatabase();
    insertSampleData();
    await updateAllUserMatches(); // Update matches after inserting sample data
    res.status(200).json({ message: 'Database reset successfully' });
  } catch (err) {
    console.error('Failed to reset database:', err);
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

// Initialize the database and start the server
initializeDatabase()
  .then(() => {
    console.log('Database initialized successfully');
    insertSampleData(); // Insert sample data after initializing the database
    app.listen(port, async () => {
      console.log(`Server is running on http://localhost:${port}`);
      await updateAllUserMatches(); // Update matches after inserting sample data
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });
