import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileForm from './ProfileForm';

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('id');
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8001/user/${userId}`, {
          headers: { 'x-access-token': token }
        });
        setProfile(response.data);
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

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
        <div className="ml-4">
          <h1 className="text-3xl font-semibold">{profile.firstName} {profile.lastName}</h1>
          <p className="text-gray-600">{profile.headline}</p>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <ProfileForm user={profile} onSave={handleSave} />
    </div>
  );
};

export default ProfilePage;
