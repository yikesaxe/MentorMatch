import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileForm from './ProfileForm';
import linkedinIcon from '../linkedin.png'; // Update with the correct path to your LinkedIn icon
import defaultProfileImg from '../person.png'; // Import the default profile image

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('id');
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8001/user/${userId}`, {
          headers: { 'x-access-token': token }
        });
        setProfile(response.data);
        setProfileImageUrl(response.data.profileImageUrl || '');
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Error fetching profile');
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (updatedProfile) => {
    try {
      const userId = localStorage.getItem('id');
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8001/user/${userId}`, updatedProfile, {
        headers: { 'x-access-token': token }
      });
      setProfile(updatedProfile);
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error updating profile');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profileImage', file);
      const response = await axios.post('http://localhost:8001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfileImageUrl(response.data.profileImageUrl);
      setProfile((prevProfile) => ({ ...prevProfile, profileImageUrl: response.data.profileImageUrl }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center mb-6 relative">
        <div className="relative w-24 h-24">
          <img
            src={profileImageUrl ? `http://localhost:8001${profileImageUrl}` : defaultProfileImg}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-24 h-24 rounded-full object-cover"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="ml-4">
          <h1 className="text-3xl font-semibold">{profile.firstName} {profile.lastName}</h1>
          <p className="text-gray-600">{profile.headline}</p>
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
              <img src={linkedinIcon} alt="LinkedIn" className="w-6 h-6 mt-2" />
            </a>
          )}
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <ProfileForm user={profile} onSave={handleSave} />
    </div>
  );
};

export default ProfilePage;



