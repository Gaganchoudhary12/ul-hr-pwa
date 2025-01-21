import React from 'react';
import Success from '../../../assets/ratingSuccess.svg';

const RatingSubmittedCard = ({
  title,
  handleGoToHome,
  handleNextValueCard,
  isLastCard,
  primaryButtonTitle,
  secondaryButtonTitle,
}) => {
  return (
    <div className="flex justify-center items-center bg-gray-100 h-screen">
      <div className="flex justify-center items-center p-5 w-full">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-left">
          <img src={Success} alt="Success" width={48} height={48} />
          <h2 className="text-lg font-medium mt-5 text-gray-900">{title}</h2>
          <div className="mt-6">
            <p className="text-sm font-normal text-gray-600 mt-3">Rating Submitted!</p>
          </div>
          <div className="flex justify-between w-full mt-6">
            <button
              className="flex-1 py-3 mr-2 rounded-lg bg-white flex justify-center items-center border border-gray-200"
              onClick={handleGoToHome}
            >
              <span className="text-base font-semibold text-gray-900">{primaryButtonTitle}</span>
            </button>
            {!isLastCard && (
              <button
                className="flex-1 py-3 rounded-lg bg-blue-500 flex justify-center items-center"
                onClick={handleNextValueCard}
              >
                <span className="text-base font-semibold text-white">{secondaryButtonTitle}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingSubmittedCard;
