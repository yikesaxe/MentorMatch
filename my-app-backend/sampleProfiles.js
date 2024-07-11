const bcrypt = require('bcryptjs');

const sampleProfiles = [
  // Mentors
  {
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.mentor@example.com',
    password: bcrypt.hashSync('password', 8),
    userType: 'mentor',
    location: 'New York',
    university: 'NYU',
    skills: JSON.stringify(['Python', 'Machine Learning', 'Data Science']),
    interests: JSON.stringify(['Artificial Intelligence']),
    goals: 'Help mentees learn AI',
    headline: 'AI Expert at NYU'
  },
  {
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.mentor@example.com',
    password: bcrypt.hashSync('password', 8),
    userType: 'mentor',
    location: 'New York',
    university: 'NYU',
    skills: JSON.stringify(['JavaScript', 'React', 'Node.js']),
    interests: JSON.stringify(['Web Development']),
    goals: 'Guide mentees in web development',
    headline: 'Full Stack Developer'
  },
  {
    firstName: 'Eve',
    lastName: 'Davis',
    email: 'eve.mentor@example.com',
    password: bcrypt.hashSync('password', 8),
    userType: 'mentor',
    location: 'New York',
    university: 'NYU',
    skills: JSON.stringify(['Java', 'Spring', 'Microservices']),
    interests: JSON.stringify(['Backend Development']),
    goals: 'Mentor students in enterprise application development',
    headline: 'Backend Specialist'
  },
  {
    firstName: 'Frank',
    lastName: 'Miller',
    email: 'frank.mentor@example.com',
    password: bcrypt.hashSync('password', 8),
    userType: 'mentor',
    location: 'New York',
    university: 'NYU',
    skills: JSON.stringify(['C++', 'Embedded Systems', 'Robotics']),
    interests: JSON.stringify(['Hardware and Robotics']),
    goals: 'Inspire interest in robotics and hardware programming',
    headline: 'Robotics Engineer'
  },
  {
    firstName: 'Grace',
    lastName: 'Wilson',
    email: 'grace.mentor@example.com',
    password: bcrypt.hashSync('password', 8),
    userType: 'mentor',
    location: 'New York',
    university: 'NYU',
    skills: JSON.stringify(['HTML', 'CSS', 'UI/UX Design']),
    interests: JSON.stringify(['Design']),
    goals: 'Help students build intuitive user interfaces',
    headline: 'UI/UX Designer'
  },
  {
    firstName: 'Hank',
    lastName: 'Moore',
    email: 'hank.mentor@example.com',
    password: bcrypt.hashSync('password', 8),
    userType: 'mentor',
    location: 'New York',
    university: 'NYU',
    skills: JSON.stringify(['R', 'Statistics', 'Data Analysis']),
    interests: JSON.stringify(['Data Science']),
    goals: 'Guide students in statistical analysis and data interpretation',
    headline: 'Data Scientist'
  },

  // Mentees
  {
    firstName: 'Charlie',
    lastName: 'Taylor',
    email: 'charlie.mentee@example.com',
    password: bcrypt.hashSync('password', 8),
    userType: 'mentee',
    location: 'New York',
    university: 'NYU',
    skills: JSON.stringify(['Python', 'Data Analysis']),
    interests: JSON.stringify(['Artificial Intelligence']),
    goals: 'Learn more about AI',
    headline: 'Aspiring Data Scientist'
  },
  {
    firstName: 'Diana',
    lastName: 'Anderson',
    email: 'diana.mentee@example.com',
    password: bcrypt.hashSync('password', 8),
    userType: 'mentee',
    location: 'New York',
    university: 'NYU',
    skills: JSON.stringify(['JavaScript', 'CSS']),
    interests: JSON.stringify(['Web Development']),
    goals: 'Become a full-stack developer',
    headline: 'Web Development Enthusiast'
  },
  {
    firstName: 'Ivy',
    lastName: 'Thomas',
    email: 'ivy.mentee@example.com',
    password: bcrypt.hashSync('password', 8),
    userType: 'mentee',
    location: 'New York',
    university: 'NYU',
    skills: JSON.stringify(['Java', 'Data Structures']),
    interests: JSON.stringify(['Backend Development']),
    goals: 'Master backend technologies',
    headline: 'Backend Development Learner'
  },
  {
    firstName: 'Jack',
    lastName: 'Jackson',
    email: 'jack.mentee@example.com',
    password: bcrypt.hashSync('password', 8),
    userType: 'mentee',
    location: 'New York',
    university: 'NYU',
    skills: JSON.stringify(['C++', 'Algorithms']),
    interests: JSON.stringify(['Competitive Programming']),
    goals: 'Improve problem-solving skills',
    headline: 'Competitive Programmer'
  },
  {
    firstName: 'Kate',
    lastName: 'White',
    email: 'kate.mentee@example.com',
    password: bcrypt.hashSync('password', 8),
    userType: 'mentee',
    location: 'New York',
    university: 'NYU',
    skills: JSON.stringify(['HTML', 'CSS', 'JavaScript']),
    interests: JSON.stringify(['Frontend Development']),
    goals: 'Enhance frontend development skills',
    headline: 'Frontend Developer'
  },
  {
    firstName: 'Leo',
    lastName: 'Harris',
    email: 'leo.mentee@example.com',
    password: bcrypt.hashSync('password', 8),
    userType: 'mentee',
    location: 'New York',
    university: 'NYU',
    skills: JSON.stringify(['R', 'Excel']),
    interests: JSON.stringify(['Data Analysis']),
    goals: 'Gain expertise in data visualization and analysis',
    headline: 'Data Analyst'
  }
];

module.exports = sampleProfiles;
