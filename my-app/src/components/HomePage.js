import React, { useEffect, useState } from 'react';
import axios from 'axios';
import linkedinIcon from '../linkedin.png'; // Update with the correct path to your LinkedIn icon
import emailIcon from '../mail.png'; // Update with the correct path to your email icon

const HomePage = () => {
  const [matchedMentor, setMatchedMentor] = useState(null);
  const [similarMentors, setSimilarMentors] = useState([]);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileAndMatches = async () => {
      try {
        const userId = localStorage.getItem('id');
        const token = localStorage.getItem('token');

        // Fetch user profile
        const profileResponse = await axios.get(`http://localhost:8001/user/${userId}`, {
          headers: { 'x-access-token': token }
        });
        setUserName(profileResponse.data.firstName);

        // Fetch matches
        const matchesResponse = await axios.get(`http://localhost:8001/user/${userId}/matches`, {
          headers: { 'x-access-token': token }
        });

        if (matchesResponse.data.length > 0) {
          setMatchedMentor(matchesResponse.data[0]);
          setSimilarMentors(matchesResponse.data.slice(1));
        } else {
          console.log('No matches found');
        }
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Error fetching matches');
      }
    };

    fetchProfileAndMatches();
  }, []);

  const formatArray = (arr) => (Array.isArray(arr) ? arr.join(', ') : '');

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Welcome {userName}!</h1>
      {error && <p className="text-red-500">{error}</p>}
      {!error && matchedMentor && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Your Matched Mentor</h2>
          <div className="flex items-center mb-4">
            <img
              src={`http://localhost:8001${matchedMentor.profileImageUrl}`}
              alt={`${matchedMentor.firstName} ${matchedMentor.lastName}`}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="ml-4">
              <p className="text-xl font-semibold">{matchedMentor.firstName} {matchedMentor.lastName}</p>
              <p className="text-gray-600">{matchedMentor.headline}</p>
              <div className="flex space-x-2 mt-2">
                {matchedMentor.linkedinUrl && (
                  <a href={matchedMentor.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <img src={linkedinIcon} alt="LinkedIn" className="w-6 h-6" />
                  </a>
                )}
                <a href={`mailto:${matchedMentor.email}`} target="_blank" rel="noopener noreferrer">
                  <img src={emailIcon} alt="Email" className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <p><span className="font-medium">Location:</span> {matchedMentor.location}</p>
          <p><span className="font-medium">University:</span> {matchedMentor.university}</p>
          <p><span className="font-medium">Skills:</span> {formatArray(matchedMentor.skills)}</p>
          <p><span className="font-medium">Interests:</span> {formatArray(matchedMentor.interests)}</p>
          <p><span className="font-medium">Goals:</span> {matchedMentor.goals}</p>
        </div>
      )}
      {!error && similarMentors.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Similar Mentors</h2>
          <ul>
            {similarMentors.map(mentor => (
              <li key={mentor.id} className="mb-4 pb-4 border-b last:border-none">
                <div className="flex items-center mb-2">
                  <img
                    src={`http://localhost:8001${mentor.profileImageUrl}`}
                    alt={`${mentor.firstName} ${mentor.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="text-lg font-semibold">{mentor.firstName} {mentor.lastName}</p>
                    <p className="text-gray-600">{mentor.headline}</p>
                    <div className="flex space-x-2 mt-2">
                      {mentor.linkedinUrl && (
                        <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer">
                          <img src={linkedinIcon} alt="LinkedIn" className="w-6 h-6" />
                        </a>
                      )}
                      <a href={`mailto:${mentor.email}`} target="_blank" rel="noopener noreferrer">
                        <img src={emailIcon} alt="Email" className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                </div>
                <p><span className="font-medium">Location:</span> {mentor.location}</p>
                <p><span className="font-medium">University:</span> {mentor.university}</p>
                <p><span className="font-medium">Skills:</span> {formatArray(mentor.skills)}</p>
                <p><span className="font-medium">Interests:</span> {formatArray(mentor.interests)}</p>
                <p><span className="font-medium">Goals:</span> {mentor.goals}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HomePage;
