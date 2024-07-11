import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProfileForm from './ProfileForm';
import { useParams } from 'react-router-dom';

const ProfilePage = ({ auth }) => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token provided.');
      setLoading(false);
      return;
    }
    axios.get(`http://localhost:8000/user/${id}`, {
      headers: { 'x-access-token': token },
    })
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleSave = (updatedUser) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token provided.');
      return;
    }
    axios.put(`http://localhost:8000/user/${id}`, updatedUser, {
      headers: { 'x-access-token': token },
    })
      .then(response => {
        console.log(response.data);
        setUser(response.data); // Update the user state with the new data
      })
      .catch(error => console.error('Error updating user data:', error));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 rounded-full bg-gray-300 mr-4"></div>
        <div>
          <h1 className="text-3xl font-bold">Loading...</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gray-300 mr-4"></div>
        <div>
          <h1 className="text-3xl font-bold">{`${user.firstName} ${user.lastName}`}</h1>
          <p className="text-gray-600">{user.headline}</p>
        </div>
      </div>
      <ProfileForm user={user} onSave={handleSave} />
    </div>
  );
};

export default ProfilePage;


