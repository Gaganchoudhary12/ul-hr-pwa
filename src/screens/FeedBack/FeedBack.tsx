import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../state/UserProvider";
import RatingSubmittedCard from "../../components/atoms/RatingSubmittedcard/RatingSubmittedCard.tsx";
import HeaderWithBackButton from "../../components/organism/HeaderWithBackButton.tsx/HeaderWithBackButton.tsx";
import { useUserRating } from "../../services/userRating.ts";
import { useCardsData } from "../../state/ValuesCardsdata.js";

const FeedBack = () => {
  const [questions, setQuestions] = useState([]);
  const { setCardsData } = useCardsData();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLastCard, setIsLastCard] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { userRating } = useUserRating();

  const { title, cardId, cardsData, date, selfRating } = location.state;

  const question = questions[currentQuestionIndex]?.question;

  useEffect(() => {
    const card = cardsData.find((data) => data.id === cardId);
    if (card) {
      setQuestions(card.questionsData || []);
      setRatings(new Array(card.questionsData.length).fill(0));
      setCompletedQuestions(0);
      setCurrentQuestionIndex(0);
    }
  }, [cardId, cardsData]);

  useEffect(() => {
    const currentCardIndex = cardsData.findIndex((card) => card.id === cardId);
    setIsLastCard(currentCardIndex === cardsData.length - 1);
  }, [cardId, cardsData]);

  const handleRating = (rating) => {
    const updatedRatings = [...ratings];
    updatedRatings[currentQuestionIndex] = rating;
    setRatings(updatedRatings);
    setCompletedQuestions(updatedRatings.filter((r) => r > 0).length);
  };

  const handleNext = async () => {
    try {
      const { data, isError } = await userRating(
        user.email,
        date,
        title,
        question,
        ratings[currentQuestionIndex]
      );

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Unexpected error submitting rating:", error);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRatingSubmittedCardGoToHome = () => {
    navigate("/values", {
      replace: true,
      state: {
        updatedCard: { id: cardId },
      },
    });
  };

  const handleNextValueCard = () => {
    const currentCardIndex = cardsData.findIndex((card) => card.id === cardId);
    const nextCardIndex = currentCardIndex + 1;

    if (nextCardIndex < cardsData.length) {
      setIsCompleted(false);
      setQuestions([]);
      setRatings([]);
      setCompletedQuestions(0);
      setCurrentQuestionIndex(0);

      navigate("/feedback", {
        replace: true,
        state: {
          title: cardsData[nextCardIndex].title,
          cardId: cardsData[nextCardIndex].id,
          cardsData,
          date,
          selfRating,
        },
      });
    }
  };

  const calculateTotalRating = () => {
    let totalSum = 0;
    let totalQuestions = 0;

    Object.values(selfRating).forEach((category) => {
      Object.values(category).forEach((rating) => {
        totalSum += rating;
        totalQuestions += 1;
      });
    });

    return totalQuestions > 0 ? (totalSum / totalQuestions).toFixed(2) : 0;
  };

  const totalRating = calculateTotalRating();

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
        totalRating={totalRating}
        primaryButtonTitle="Go to Values"
        secondaryButtonTitle="Next Value"
      />
    );
  }

  return (
    <>
      <HeaderWithBackButton
        title={title}
        subTitle={
          <div className="flex justify-center mb-4">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index <= currentQuestionIndex ? "bg-red-500" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        }
      />
      <div className="flex flex-col items-center bg-white rounded-t-lg pt-6 pb-10  relative">
        <div className="w-full flex flex-col items-center relative">
          <img
            src={
              currentQuestionIndex % 2 === 0
                ? "https://cdn.universityliving.com/files/17297688958216892158_closeup_colorful_3840x2160-1-1.webp"
                : "https://cdn.universityliving.com/files/17297690151176892158_closeup_colorful_3840x2160-1-1-1.webp"
            }
            alt="Question Illustration"
            className="w-full h-40 object-cover rounded-md"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-white text-lg font-bold text-center">
              {questions[currentQuestionIndex]?.question || "No question"}
            </p>
            <p className="text-white text-sm mt-2">1=Lowest-10=Highest</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 mt-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
            <button
              key={rating}
              className={`rounded-full w-12 h-12 flex items-center justify-center border ${
                (selfRating[title]?.[
                  questions[currentQuestionIndex]?.question
                ] || ratings[currentQuestionIndex]) === rating
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
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

        <div className="flex justify-end w-full mt-8 space-x-4">
          {currentQuestionIndex > 0 && (
            <button
              className="bg-gray-200 text-black px-4 py-2 rounded-lg"
              onClick={handlePrevious}
            >
              Previous
            </button>
          )}
          <button
            className={`px-4 py-2 rounded-lg ${
              isNextButtonEnabled
                ? "bg-blue-500 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            onClick={handleNext}
            disabled={!isNextButtonEnabled}
          >
            {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </>
  );
};

export default FeedBack;
