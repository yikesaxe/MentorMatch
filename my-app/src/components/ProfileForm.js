import React, { useState, useEffect } from 'react';

const ProfileForm = ({ user, onSave }) => {
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [preferredName, setPreferredName] = useState(user.preferredName || '');
  const [headline, setHeadline] = useState(user.headline || '');
  const [location, setLocation] = useState(user.location || '');

  useEffect(() => {
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setPreferredName(user.preferredName || '');
    setHeadline(user.headline || '');
    setLocation(user.location || '');
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      firstName,
      lastName,
      preferredName,
      headline,
      location
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label className="mb-2 text-lg font-medium">First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-2 text-lg font-medium">Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-2 text-lg font-medium">Preferred Name:</label>
        <input
          type="text"
          value={preferredName}
          onChange={(e) => setPreferredName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-2 text-lg font-medium">Headline:</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-2 text-lg font-medium">Location:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Save
      </button>
    </form>
  );
};

export default ProfileForm;


