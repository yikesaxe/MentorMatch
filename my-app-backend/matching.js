const { db } = require('./db');
const axios = require('axios');

async function fetchProfiles() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM user', (err, rows) => {
      if (err) {
        console.error('Error fetching profiles:', err);
        reject(err);
      } else {
        // Parse the JSON strings into arrays
        rows.forEach(row => {
          row.skills = JSON.parse(row.skills);
          row.interests = JSON.parse(row.interests);
        });
        console.log('Fetched profiles:', rows);
        resolve(rows);
      }
    });
  });
}

function intersect(a, b) {
  return a.filter(e => b.includes(e));
}

function computeSimilarity(mentor, mentee) {
  const skillsSimilarity = intersect(mentor.skills, mentee.skills).length;
  const interestsSimilarity = intersect(mentor.interests, mentee.interests).length;
  const goalsSimilarity = mentor.goals === mentee.goals ? 1 : 0;
  return skillsSimilarity + interestsSimilarity + goalsSimilarity;
}

async function rankMentorsForMentees(profiles) {
  const mentors = profiles.filter(profile => profile.userType === 'mentor');
  const mentees = profiles.filter(profile => profile.userType === 'mentee');

  const rankedMatches = mentees.map(mentee => {
    const mentorScores = mentors.map(mentor => ({
      mentor,
      score: computeSimilarity(mentor, mentee)
    }));
    mentorScores.sort((a, b) => b.score - a.score);
    return {
      mentee,
      mentors: mentorScores.slice(0, 6)
    };
  });

  return rankedMatches;
}

module.exports = {
  fetchProfiles,
  rankMentorsForMentees
};

