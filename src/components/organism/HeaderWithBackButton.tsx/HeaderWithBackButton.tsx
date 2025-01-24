import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import BackIcon from '../../../assets/backIcon.svg';

const HeaderWithBackButton = ({ title, subTitle }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center border-b border-gray-300 py-5 px-5 bg-gray-800">
      <button className="bg-none border-none cursor-pointer" onClick={() => navigate(-1)}>
        <img src={BackIcon} alt="Back" width={24} height={24} />
      </button>
      <div className="flex-1 text-center">
        <h1 className="text-xl font-bold text-white m-0 font-serif">{title}</h1>
        {subTitle && <p className="text-xs font-semibold text-white mt-2 font-serif">{subTitle}</p>}
      </div>
    </div>
  );
};

HeaderWithBackButton.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
};

export default HeaderWithBackButton;
