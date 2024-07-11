import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ handleLogout, id }) => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed">
      <h2 className="text-center text-2xl py-4">Mentor Match</h2>
      <ul className="list-none p-0">
        <li className="p-4 text-center cursor-pointer hover:bg-gray-700">
          <Link to="/">Home</Link>
        </li>
        <li className="p-4 text-center cursor-pointer hover:bg-gray-700">
          <Link to={`/profile/${id}`}>Profile</Link>
        </li>
        <li className="p-4 text-center cursor-pointer hover:bg-gray-700" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;







