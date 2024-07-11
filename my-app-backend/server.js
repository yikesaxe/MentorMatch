const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, initializeDatabase } = require('./db');
const { PythonShell } = require('python-shell'); // Add this line

const app = express();
const port = 8000;
const secretKey = 'your_secret_key'; // Use a secure key in production

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

// User registration
app.post('/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  db.run(
    `INSERT INTO user (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`,
    [firstName, lastName, email, hashedPassword],
    function (err) {
      if (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'User registration failed' });
      } else {
        const token = jwt.sign({ id: this.lastID }, secretKey, { expiresIn: 86400 }); // 24 hours
        res.status(200).json({ auth: true, token, id: this.lastID });
      }
    }
  );
});

// User login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM user WHERE email = ?', [email], (err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: 'Login failed' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
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
      }
    }
  );
});

// Matching endpoint (protected)
app.get('/match/:id', verifyToken, (req, res) => {
  if (req.userId != req.params.id) {
    return res.status(403).send({ auth: false, message: 'Unauthorized access.' });
  }

  db.all('SELECT * FROM user', (err, rows) => {
    if (err) {
      console.error('Error fetching profiles:', err);
      res.status(500).json({ error: 'Failed to fetch profiles' });
      return;
    }

    const profiles = rows.map(row => ({
      ...row,
      skills: JSON.parse(row.skills || '[]'),
      interests: JSON.parse(row.interests || '[]'),
      goals: JSON.parse(row.goals || '[]')
    }));

    PythonShell.run('matching.py', { args: [JSON.stringify(profiles)] }, (err, results) => {
      if (err) {
        console.error('Error running matching script:', err);
        res.status(500).json({ error: 'Failed to run matching algorithm' });
        return;
      }

      const matches = JSON.parse(results[0]);
      const userMatches = matches.find(match => match.mentee.id == req.params.id);

      res.json(userMatches);
    });
  });
});

// Initialize the database and start the server
initializeDatabase()
  .then(() => {
    console.log('Database initialized successfully');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });