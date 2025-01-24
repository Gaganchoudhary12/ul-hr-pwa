import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../state/UserProvider.js';
import { useSelectedDate } from '../../state/SelectedDateContext.js';
import { useGetUserRating } from '../../services/getUserRating.ts';
import { useGetManagerRating } from '../../services/reporting.ts';
import { useGetOnboardingEmployeeRatings } from '../../services/getOnboardingEmployeeRatings.ts';
import { useGetOnboardingManagerRating } from '../../services/getOnboardingManagerRating.ts';
import HeaderWithBackButton from '../../components/organism/HeaderWithBackButton.tsx/HeaderWithBackButton.tsx';
import { useLocation } from 'react-router-dom';

const OnboardingReportCard = () => {
  const location = useLocation();
  const  days  = location.state.days;
  const { user } = useContext(UserContext);
  const [firstName] = user.fullName.split(' ');
  const { selectedValue } = useSelectedDate();
  const [selfRating, setSelfRating] = useState({});
  const { getUserRating } = useGetUserRating();
  const { getManagerRating } = useGetManagerRating();
  const [managerRatings, setManagerRatings] = useState({});
  const [questionTypes, setQuestionTypes] = useState([]);
  const { getOnboardingEmployeeRatings } = useGetOnboardingEmployeeRatings();
  const { getManagerOnboardingRating } = useGetOnboardingManagerRating();

  const score = user.score || 8;
  const progress = score / 10;

  const fetchUserRating = async () => {
    const { data, isError } = await getOnboardingEmployeeRatings(
      user.email,
      days
    );
    
    if (!isError) {
      const newRatings = Object.keys(data)
        .filter((type) => type !== 'days') // Exclude 'days'
        .reduce((acc, type) => {
          const length = Object.values(data[type]).length;
          const rating = Object.values(data[type]).reduce(
            (sum, value) => sum + value,
            0
          );
          return { ...acc, [type]: rating / length };
        }, {});

      setSelfRating((prev) => ({ ...prev, ...newRatings }));
    }
  };

  useEffect(() => {
    fetchUserRating();
  }, [days]);

  const fetchManagerRating = async () => {
    const { data, isError } = await getManagerOnboardingRating(user.email, days);

    if (!isError) {
      const filteredQuestionTypes = Object.keys(data).filter(
        (type) => type !== 'days'
      );
      setQuestionTypes(filteredQuestionTypes);

      const newRatings = filteredQuestionTypes.reduce((acc, type) => {
        const length = Object.values(data[type]).length;
        const rating = Object.values(data[type]).reduce(
          (sum, value) => sum + value,
          0
        );
        return { ...acc, [type]: rating / length };
      }, {});

      setManagerRatings((prev) => ({ ...prev, ...newRatings }));
    }
  };

  useEffect(() => {
    fetchManagerRating();
  }, [days]);

  const renderRatingCards = () =>
    questionTypes.map((item, index) => {
      const managerRating = managerRatings[item];
      const selfRatingValue = selfRating[item];

      if (managerRating !== undefined && selfRatingValue !== undefined) {
        const ratingDifference = Math.abs(managerRating - selfRatingValue);
        let statusText = 'Excellent';

        if (ratingDifference > 0.5 && ratingDifference <= 1) {
          statusText = 'Acceptable';
        } else if (ratingDifference > 1 && ratingDifference <= 1.5) {
          statusText = 'Needs Attention';
        } else if (ratingDifference > 1.5) {
          statusText = 'Alarming';
        }

        return (
          <div key={index} className="flex justify-between bg-white border border-gray-200 p-4 rounded-lg mb-2">
            <div>
              <span className="text-xs font-semibold text-gray-800 mb-2 block w-20">{item}</span>
              <span
                className={`text-xs font-semibold mb-2 block ${
                  statusText === 'Needs Attention' || statusText === 'Alarming'
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}
              >
                {statusText}
              </span>
            </div>
            <div>
              <span
                className={`text-xs text-right font-semibold block ${
                  statusText === 'Needs Attention' || statusText === 'Alarming'
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}
              >
                {parseFloat(selfRatingValue).toFixed(2)}
              </span>
              <span className="text-xs text-right font-normal text-gray-500 mt-2 block">Your Score</span>
            </div>
            <div className="w-px bg-gray-300 mx-2 h-full" />
            <div>
              <span
                className={`text-xs text-right font-semibold block ${
                  statusText === 'Needs Attention' || statusText === 'Alarming'
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}
              >
                {parseFloat(managerRating).toFixed(2)}
              </span>
              <span className="text-xs font-normal text-gray-500 mt-2 text-right block">Manager Score</span>
            </div>
          </div>
        );
      } else {
        return null;
      }
    });

  const filterValidRatings = (ratings) => {
    return Object.values(ratings).filter(
      (value) => typeof value === 'number' && !isNaN(value)
    );
  };

  const overallSelfRating = (() => {
    const validSelfRatings = filterValidRatings(selfRating);
    return validSelfRatings.length > 0
      ? validSelfRatings.reduce((acc, val) => acc + val, 0) / validSelfRatings.length
      : 0;
  })();

  const overallManagerRating = (() => {
    const validManagerRatings = filterValidRatings(managerRatings);
    return validManagerRatings.length > 0
      ? validManagerRatings.reduce((acc, val) => acc + val, 0) / validManagerRatings.length
      : 0;
  })();

  const ratingDifference = Math.abs(overallSelfRating - overallManagerRating);
  let overallStatus = 'Excellent';
  if (ratingDifference > 0.5 && ratingDifference <= 1) {
    overallStatus = 'Acceptable';
  } else if (ratingDifference > 1 && ratingDifference <= 1.5) {
    overallStatus = 'Needs Attention';
  } else if (ratingDifference > 1.5) {
    overallStatus = 'Alarming';
  }

  const normalizedScore = ((ratingDifference + 5) / 10) * 100;

  return (
    <>
      <HeaderWithBackButton
        title="Quiz Results 🏆"
        subTitle="View your performance and detailed scores now!"
      />
      <div className="flex-1 bg-white rounded-t-2xl">
        <div className="bg-white p-5 rounded-lg shadow-sm mb-3">
          <span className="text-sm font-bold text-black">Hi, {firstName}!</span>
          <span className="text-xs font-normal my-2 text-black block">
            Your overall Value score combines the ratings from both you and your manager.
          </span>
          <span className="text-2xl font-bold text-gray-800 block mb-5">
            Overall Score : {overallSelfRating.toFixed(2)}
          </span>
          <div className="my-5">
            <div className="h-[6px] bg-gray-200 rounded-lg overflow-hidden relative">
              <div
                className="h-full"
                style={{
                  width: `${normalizedScore}%`,
                  background: 'linear-gradient(to right, #00FF00, #FFFF00, #FF0000)',
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-600">-5</span>
              <span className="text-xs text-gray-600">0</span>
              <span className="text-xs text-gray-600">5</span>
            </div>
          </div>
          <div className="bg-green-100 p-3 rounded-md">
            <span className="text-black text-center text-xs font-bold">
              The deviation between your score and your manager's is {ratingDifference.toFixed(2)} :
              <span
                className={`${
                  overallStatus === 'Needs Attention' || overallStatus === 'Alarming'
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}
              >
                {' '}{overallStatus}
              </span>
            </span>
          </div>
        </div>
        <div className="my-2 mx-6">
          <span className="text-sm font-bold text-gray-800">Onboarding Results</span>
          <span className="text-xs font-normal text-gray-600 block mt-1">Acknowledging your journey and gearing up for more!</span>
          <span className="text-center text-sm font-semibold text-gray-800 mt-2 block">
            Overall Score
          </span>
        </div>
        <div className="mt-2 mx-6">{renderRatingCards()}</div>
      </div>
    </>
  );
};

export default OnboardingReportCard;
