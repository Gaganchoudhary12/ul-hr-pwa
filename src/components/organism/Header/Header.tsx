import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../state/UserProvider';
import Profile from '../../../assets/profile.png';
import Avatar from 'react-avatar';

const Header = ({ enableBackButton, fromScreen }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [firstName] = user.fullName.split(' ');

  const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
  };

  return (
    <div className="flex justify-between items-center border-b border-gray-300 bg-gray-800 shadow-md py-5 px-5">
      {enableBackButton ? (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center bg-none border-none cursor-pointer text-white"
        >
          <span className="text-xl">&#8592;</span>
        </button>
      ) : (
        <div>
          <h1 className="text-xl font-bold text-white leading-6 font-serif">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm font-normal text-white mt-1 font-serif">
            Let's be productive today!
          </p>
        </div>
      )}
      <button
        onClick={() => navigate('/profile-setup', { state: { fromScreen } })}
        className="cursor-pointer"
      >
        <Avatar name={user.fullName} size="56" round color="#9087E5" />
      </button>
    </div>
  );
};

export default Header;
