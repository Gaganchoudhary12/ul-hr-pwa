import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../state/UserProvider.js";
import { useManagerRating } from "../../../services/managerRating.ts";
import HeaderWithBackButton from "../../../components/organism/HeaderWithBackButton.tsx/HeaderWithBackButton.tsx";
import RatingSubmittedCard from "../../../components/atoms/RatingSubmittedcard/RatingSubmittedCard.tsx";
import { useEmployeesCardsData } from "../../../state/EmployeesValueCardsData.js";

const FeedBack = () => {
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const { title, cardId, cardsData, date, selfRating, employeeEmail } =
    location.state;
  const { ManagerRating } = useManagerRating();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { setCardsData } = useEmployeesCardsData();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLastCard, setIsLastCard] = useState(false);
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
      const { data, isError } = await ManagerRating(
        employeeEmail,
        date,
        title,
        question,
        ratings[currentQuestionIndex],
        user.email
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
      replace:true,
      state: { updatedCard: { id: cardId }, defaultTab: "rateEmployees", },
    });
  };

  const handleNextValueCard = () => {
    const updatedCardsData = [...cardsData];
    const currentCardIndex = cardsData.findIndex((card) => card.id === cardId);
    setCardsData(updatedCardsData);

    const nextCardIndex = currentCardIndex + 1;
    if (nextCardIndex < cardsData.length) {
      setIsCompleted(false);
      setQuestions([]);
      setRatings([]);
      setCompletedQuestions(0);
      setCurrentQuestionIndex(0);

      navigate("/employees-question", {
        replace: true,
        state: {
          title: cardsData[nextCardIndex].title,
          cardId: cardsData[nextCardIndex].id,
          cardsData,
          date,
          selfRating,
          employeeEmail: employeeEmail,
        },
      });
    }
  };

  const isNextButtonEnabled =
    selfRating[title]?.[questions[currentQuestionIndex]?.question] ||
    ratings[currentQuestionIndex] > 0;

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

  if (isCompleted) {
    return (
      <RatingSubmittedCard
        cardName="Rating"
        title={title}
        handleGoToHome={handleRatingSubmittedCardGoToHome}
        handleNextValueCard={handleNextValueCard}
        isLastCard={isLastCard}
        totalRating={totalRating}
        primaryButtonTitle="Go to Assessment"
        secondaryButtonTitle="Next Assessment"
      />
    );
  }

  const imageToShow =
    currentQuestionIndex % 2 === 0
      ? "https://cdn.universityliving.com/files/17297688958216892158_closeup_colorful_3840x2160-1-1.webp"
      : "https://cdn.universityliving.com/files/17297690151176892158_closeup_colorful_3840x2160-1-1-1.webp";

  return (
    <>
      <HeaderWithBackButton
        title={title}
        subTitle={
          <div className="flex justify-center">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index <= currentQuestionIndex
                    ? "bg-orange-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        }
      />
      <div className="bg-white rounded-t-2xl px-2">
        <div className="py-4">
          <div className="relative flex flex-col justify-center items-center">
            <img
              src={imageToShow}
              alt="Question"
              className="w-full h-36 object-cover rounded-lg mb-4"
            />
            <div className="absolute flex flex-col justify-center items-center w-full h-full">
              <p className="text-lg font-bold text-white text-center w-3/4">
                {questions[currentQuestionIndex]?.question || "No question"}
              </p>
              <p className="text-xs font-semibold text-white mt-2 text-center">
                1=Lowest-10=highest
              </p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 mt-4 mx-8">
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
                  !!selfRating[title]?.[
                    questions[currentQuestionIndex]?.question
                  ]
                }
              >
                {rating}
              </button>
            ))}
          </div>
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
