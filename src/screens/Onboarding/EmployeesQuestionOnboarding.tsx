import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../state/UserProvider";
import { useManagerRatingOnboarding } from "../../services/managerRatingOnboarding.ts";
import RatingSubmittedCard from "../../components/atoms/RatingSubmittedcard/RatingSubmittedCard.tsx";
import HeaderWithBackButton from "../../components/organism/HeaderWithBackButton.tsx/HeaderWithBackButton.tsx";
import { useEmployeesQuestionOnboardingCardsData } from "../../state/EmployeesQuestionOnboarding.js";

const EmployeesQuestionOnboarding = () => {
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const { title, cardId, date, selfRating, employeeEmail, days, employee } =
    location.state;

  const { ManagerRatingOnboarding } = useManagerRatingOnboarding();
  const history = useNavigate();
  const { user } = useContext(UserContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { cardsData, setCardsData } = useEmployeesQuestionOnboardingCardsData();
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
      const { data, isError } = await ManagerRatingOnboarding(
        employeeEmail,
        days,
        title,
        question,
        ratings[currentQuestionIndex],
        user.email,
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
    history("/onboarding", {
      replace: true,
      state: {
        updatedCard: { id: cardId },
        defaultTab: "rateEmployees",
        from: "managerRatings",
        days,
        employee,
      },
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
      history("/employees-question-onboarding", {
        replace: true,
        state: {
          title: cardsData[nextCardIndex].title,
          cardId: cardsData[nextCardIndex].id,
          date,
          selfRating,
          employeeEmail,
          days,
          employee,
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
                className={`w-2.5 h-2.5 rounded-full mx-1 ${
                  index <= currentQuestionIndex
                    ? "bg-orange-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        }
      />
      <div className="px-5 py-8 bg-white rounded-t-2xl pb-10">
        <div className="pb-5">
          <div className="relative text-center">
            <img
              src={imageToShow}
              alt="Question"
              className="w-full h-36 object-cover rounded-md"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
              <p className="text-lg font-bold w-72 text-center">
                {questions[currentQuestionIndex]?.question || "No question"}
              </p>
              <p className="text-xs font-semibold mt-2">1=Lowest-5=highest</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-between mt-3">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                className={`w-10 h-10 flex justify-center items-center rounded-full my-2 text-lg cursor-pointer transition-all ${
                  (selfRating[title]?.[
                    questions[currentQuestionIndex]?.question
                  ] || ratings[currentQuestionIndex]) === rating
                    ? "bg-gray-400 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => handleRating(rating)}
                disabled={
                  !!selfRating[title]?.[
                    questions[currentQuestionIndex]?.question
                  ]
                }
              >
                <span
                  className={`text-sm  ${
                    (selfRating[title]?.[
                      questions[currentQuestionIndex]?.question
                    ] || ratings[currentQuestionIndex]) === rating
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  {rating}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-5">
          {currentQuestionIndex > 0 && (
            <button
              className="px-6 py-2 bg-white border border-blue-500 text-gray-800 rounded-md mr-3"
              onClick={handlePrevious}
            >
              Previous
            </button>
          )}
          <button
            className={`px-6 py-2 bg-blue-500 text-white rounded-md ${
              isNextButtonEnabled ? "" : "bg-gray-300"
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

export default EmployeesQuestionOnboarding;
