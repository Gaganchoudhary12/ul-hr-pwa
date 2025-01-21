import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RatingSubmittedCard from '../../components/atoms/RatingSubmittedcard/RatingSubmittedCard.tsx';
import { UserContext } from '../../state/UserProvider.js';
import { useOnboardingEmployeeRating } from '../../services/onboardingemployeerating.ts';
import { useOnboardingCardsData } from '../../state/OnboardingCardData.js';
import HeaderWithBackButton from '../../components/organism/HeaderWithBackButton.tsx/HeaderWithBackButton.tsx';

const OnboardingQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const { state } = useLocation();
  const {
    title,
    cardId,
    selfRating,
    days,
  } = state || {};
  const { cardsData, setCardsData } = useOnboardingCardsData();
  const { employeeRating } = useOnboardingEmployeeRating();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLastCard, setIsLastCard] = useState(false);
  const question = questions[currentQuestionIndex]?.question;

  useEffect(() => {
    const card = cardsData?.find((data) => data.id === cardId);
    if (card) {
      setQuestions(card.questionsData || []);
      setRatings(new Array(card.questionsData?.length).fill(0));
    }
  }, [cardId, cardsData]);

  useEffect(() => {
    const currentCardIndex = cardsData?.findIndex((card) => card.id === cardId);
    setIsLastCard(currentCardIndex === cardsData.length - 1);
  }, [cardId, cardsData]);

  const handleRating = (rating) => {
    const updatedRatings = [...ratings];
    updatedRatings[currentQuestionIndex] = rating;
    setRatings(updatedRatings);
  };

  const handleNext = async () => {
    try {
      await employeeRating(
        user.email,
        title,
        question,
        ratings[currentQuestionIndex],
        days
      );
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Unexpected error submitting rating:', error);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRatingSubmittedCardGoToHome = () => {
    navigate('/onboarding', { replace:true, state: { updatedCard: { id: cardId }, days,defaultTab : 'self' } });
  };

  const handleNextValueCard = () => {
    const currentCardIndex = cardsData.findIndex((card) => card.id === cardId);

    const nextCardIndex = currentCardIndex + 1;
    if (nextCardIndex < cardsData.length) {
      setIsCompleted(false);
      setQuestions([]);
      setRatings([]);
      setCurrentQuestionIndex(0);
      navigate('/onboarding-questions', {
        replace: true,
        state: {
          title: cardsData[nextCardIndex].title,
          cardId: cardsData[nextCardIndex].id,
          selfRating,
          days,
        },
      });
    }
  };

  const isNextButtonEnabled =
    selfRating[title]?.[questions[currentQuestionIndex]?.question] ||
    ratings[currentQuestionIndex] > 0;

  if (isCompleted) {
    return (
      <RatingSubmittedCard
        cardName="Rating"
        title={title}
        handleGoToHome={handleRatingSubmittedCardGoToHome}
        handleNextValueCard={handleNextValueCard}
        isLastCard={isLastCard}
        primaryButtonTitle="Go to Assessment"
        secondaryButtonTitle="Next Assessment"
      />
    );
  }

  const imageToShow =
    currentQuestionIndex % 2 === 0
      ? 'https://cdn.universityliving.com/files/17297688958216892158_closeup_colorful_3840x2160-1-1.webp'
      : 'https://cdn.universityliving.com/files/17297690151176892158_closeup_colorful_3840x2160-1-1-1.webp';

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderWithBackButton
        title={title}
        subTitle={
          <div className="flex justify-center mb-4">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index <= currentQuestionIndex ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        }
      />
      <div className="bg-white rounded-t-lg p-4">
        <div className="relative text-center">
          <img
            src={imageToShow}
            alt="Question"
            className="w-full h-48 object-cover rounded-md"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
            <p className="text-lg font-bold">
              {questions[currentQuestionIndex]?.question || 'No question'}
            </p>
            <p className="text-sm font-semibold mt-2">1=Lowest-5=Highest</p>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              className={`w-12 h-12 rounded-full flex justify-center items-center ${
                (selfRating[title]?.[questions[currentQuestionIndex]?.question] ||
                  ratings[currentQuestionIndex]) === rating
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => handleRating(rating)}
              disabled={
                !!selfRating[title]?.[questions[currentQuestionIndex]?.question]
              }
            >
              {rating}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              isNextButtonEnabled ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
            onClick={handleNext}
            disabled={!isNextButtonEnabled}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingQuestions;
