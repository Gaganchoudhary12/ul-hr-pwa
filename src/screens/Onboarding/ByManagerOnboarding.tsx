import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../state/UserProvider.js';
import { EmployeesContext } from '../../state/Employees.js';
import { useQuestions } from '../../services/Questions.ts';
import { useNavigate } from 'react-router-dom';  // For navigation in React.js
import { useOnboardingQuestions } from '../../services/onboardingQuestions.ts';
import { useGetOnboardingManagerRating } from '../../services/getOnboardingManagerRating.ts';
import OnboardingCard from './OnboardingCard.tsx';
import { useGetOnboardingEmployeeRatings } from '../../services/getOnboardingEmployeeRatings.ts';

const ByManagerOnboarding = ({ days }) => {
  const { user } = useContext(UserContext);
  const { questions } = useQuestions();
  const [cardsData, setCardsData] = useState([]);
  const history = useNavigate();  // Used for navigation
  const { getManagerOnboardingRating } = useGetOnboardingManagerRating();
  const [managerRatings, setManagerRatings] = useState('');
  const [allCardsCompleted, setAllCardsCompleted] = useState(false);
  const [employeeAllCardsCompleted, setEmployeeAllCardsCompleted] = useState(false);
  const { onboardingQuestions } = useOnboardingQuestions();
  const { getOnboardingEmployeeRatings } = useGetOnboardingEmployeeRatings();
  const [selfRating, setSelfRating] = useState(null);

  const { employees } = useContext(EmployeesContext);

  const fetchManagersRating = async () => {
    const { data, isError } = await getManagerOnboardingRating(user.email, days);
    if (!isError) {
      setManagerRatings(data);
    }
  };

  const fetchUserRating = async () => {
    const { data, isError } = await getOnboardingEmployeeRatings(user.email, days);
    if (!isError) {
      setSelfRating(data);
    }
  };

  useEffect(() => {
    fetchManagersRating();
    fetchUserRating();
  }, [days]);

  const fetchQuestion = async () => {
    const { data, isError } = await onboardingQuestions(days, 'manager');
    if (!isError && data) {
      const mappedData = data.map((item, index) => ({
        id: index + 1,
        title: item.title,
        questionsData: item.questions,
      }));
      setCardsData(mappedData);
    } else {
      console.error('Error fetching questions:', isError);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(() => {
    if (cardsData.length > 0 && managerRatings) {
      const allCompleted = cardsData.every(card => {
        const ratings = managerRatings[card.title] || {};
        return (
          Object.keys(ratings).length > 0 &&
          Object.keys(ratings).length === card.questionsData.length
        );
      });
      setAllCardsCompleted(allCompleted);
    } else {
      setAllCardsCompleted(false);
    }
  }, [cardsData, managerRatings, days]);

  useEffect(() => {
    if (cardsData.length > 0 && selfRating) {
      const allSelfCompleted = cardsData.every(card => {
        const ratings = selfRating[card.title] || {};
        return (
          Object.keys(ratings).length > 0 &&
          Object.keys(ratings).length === card.questionsData.length
        );
      });
      setEmployeeAllCardsCompleted(allSelfCompleted);
    } else {
      setEmployeeAllCardsCompleted(false);
    }
  }, [cardsData, selfRating, days]);

  useEffect(() => {
    const combinedCompletion = allCardsCompleted && employeeAllCardsCompleted;
    setAllCardsCompleted(combinedCompletion);
  }, [allCardsCompleted, employeeAllCardsCompleted]);

  const getIconForTitle = title => {
    switch (title) {
      case 'Adaptability':
      case 'Adaptability and Growth':
      case 'Communication and Influence':
        return 'https://cdn.universityliving.com/files/1729767852218fi_10930043.webp';

      case 'Collaboration and Teamwork':
      case 'Communication and Initiative':
      case 'Cultural Fit and Team Integration':
        return 'https://cdn.universityliving.com/files/1729767705888fi_15552480.webp';

      case 'Goal Orientation and Achievement':
      case 'Long-Term Potential':
      case 'Initiative and Independence':
        return 'https://cdn.universityliving.com/files/1729767789142fi_12164528.webp';

      case 'Job Knowledge':
      case 'Role Competency and Performance':
      case 'Long-Term Potential and Development':
        return 'https://cdn.universityliving.com/files/1729767940592fi_763965.webp';

      case 'Work Ethic and Dependability':
      case 'Team Integration':
      case 'Role Competency and Mastery':
        return 'https://cdn.universityliving.com/files/1729767340086fi_8386465.webp';

      default:
        return null;
    }
  };

  const renderItem = (item) => {
    let progress = 0;
    let progressInPercentage = 0;
    let Score = 0;

    if (managerRatings?.[item.title]) {
      const ratings = Object.values(managerRatings[item.title]);
      progress = ratings.length;
      progressInPercentage = (
        (progress / item?.questionsData?.length) *
        100
      ).toFixed(0);
      Score = (
        ratings.reduce((sum, rating) => sum + rating, 0) / progress
      ).toFixed(1);
    }

    return (
      <OnboardingCard
        title={item.title}
        progress={item.progress || progressInPercentage}
        isEditable={false}
        managerScore={Score}
        iconSource={getIconForTitle(item.title)}
        backgroundColor="#003264"
        completedText={`Reviewed`}
      />
    );
  };

  return (
    <div style={{ marginTop: '10px', marginBottom: '10px' }}>
      {allCardsCompleted ? (
        <div>
          {cardsData.map(item => (
            <div key={item.id}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#E74C3C',
            fontWeight: '600',
          }}
        >
          Review in progress by Manager
        </p>
      )}
    </div>
  );
};

export default ByManagerOnboarding;

