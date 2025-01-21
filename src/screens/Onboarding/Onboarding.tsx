import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../state/UserProvider';
import OnboardingCard from './OnboardingCard.tsx';
import { useOnboardingQuestions } from '../../services/onboardingQuestions.ts';
import RateEmployees from './RateEmployees.tsx';
import ByManagerOnboarding from './ByManagerOnboarding.tsx';
import {ReactComponent as LockIcon} from '../../assets/lockIcon.svg';
import { useGetOnboardingEmployeeRatings } from '../../services/getOnboardingEmployeeRatings.ts';
import { useGetOnboardingManagerRating } from '../../services/getOnboardingManagerRating.ts';
import { EmployeesContext } from '../../state/Employees.js';
import Tab from '../../components/atoms/Tab/Tab.tsx';
import { useOnboardingCardsData } from '../../state/OnboardingCardData.js';
import HeaderWithBackButton from '../../components/organism/HeaderWithBackButton.tsx/HeaderWithBackButton.tsx';

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const propdDays = location.state?.days;
  const defaultTab = location.state?.defaultTab;
  
  const { employees } = useContext(EmployeesContext);
  const [view, setView] = useState(employees.length > 0 ? 'rateEmployees' : '' || defaultTab);
  const { cardsData, setCardsData } = useOnboardingCardsData();
 
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const { onboardingQuestions } = useOnboardingQuestions();
  const { getOnboardingEmployeeRatings } = useGetOnboardingEmployeeRatings();
  const [selfRating, setSelfRating] = useState('');
  const [allCardsCompleted, setAllCardsCompleted] = useState(false);
  const [userCardsCompleted, setUserCardsCompleted] = useState(false);
  const { getManagerOnboardingRating } = useGetOnboardingManagerRating();
  const [managerRatings, setManagerRatings] = useState('');
  const [days, setDays] = useState(propdDays|| 30);

  const getIconForTitle = (title) => {
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

  const fetchManagersRating = async () => {
    const { data, isError } = await getManagerOnboardingRating(user.email, days);
    if (!isError) {
      setManagerRatings(data);
    }
  };

  useEffect(() => {
    fetchManagersRating();
  }, [days]);

  const fetchUserRating = async () => {
    const { data, isError } = await getOnboardingEmployeeRatings(user.email, days);
    if (!isError) {
      setSelfRating(data);
    }
  };

  useEffect(() => {
    fetchUserRating();
  }, [days]);

  useEffect(() => {
    if (cardsData.length > 0 && selfRating) {
      const allUserCardsCompleted = cardsData.every((card) => {
        const userRatings = selfRating[card.title] || {};
        return (
          Object.keys(userRatings).length > 0 &&
          Object.keys(userRatings).length === card.questionsData.length
        );
      });

      const allManagerCardsCompleted = cardsData.every((card) => {
        const managerRatingsData = managerRatings[card.title] || {};
        return (
          Object.keys(managerRatingsData).length > 0 &&
          Object.keys(managerRatingsData).length === card.questionsData.length
        );
      });

      setUserCardsCompleted(allUserCardsCompleted);
      setAllCardsCompleted(allManagerCardsCompleted);
    } else {
      setUserCardsCompleted(false);
      setAllCardsCompleted(false);
    }
  }, [cardsData, selfRating, days]);

  const fetchQuestion = async () => {
    setLoading(true);

    const forRole = view === 'self' ? 'employee' : 'manager';

    const { data, isError } = await onboardingQuestions(days, forRole);
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

    setLoading(false);
  };

  useEffect(() => {
    fetchQuestion();
  }, [view, days]);

  const renderItem = (item) => {
    let progress = 0;
    let progressInPercentage = 0;
    let selfScore = 0;

    if (selfRating?.[item.title]) {
      const ratings = Object.values(selfRating[item.title]);
      progress = ratings.length;
      progressInPercentage = ((progress / item?.questionsData?.length) * 100).toFixed(0);
      selfScore = (ratings.reduce((sum, rating) => sum + rating, 0) / progress).toFixed(1);
    }

    return (
      <OnboardingCard
        title={item.title}
        progress={item.progress || progressInPercentage}
        onPress={() =>
          navigate('/onboarding-questions', {
            state: {
              title: item.title,
              cardId: item.id,
              initialProgress: item.progress,
              selfRating: selfRating,
              days: days,
            },
          })
        }
        iconSource={getIconForTitle(item.title)}
        backgroundColor={'#003264'}
        completedText="Get ready for the next quiz!"
        selfScore={selfScore}
      />
    );
  };

  const handleDaysChange = (selectedDays) => {
    setDays(selectedDays);
  };
  
 return (
    <>
      <HeaderWithBackButton title='Onboarding' />
      <div className="p-5 space-y-6 bg-white rounded-2xl">
        <div className="space-y-4">
          <Tab
            selectedView={view}
            onSelectView={setView}
            from={location.state?.from}
            tabs={employees.length > 0 ? ['Rate Employees', 'Self', 'By Manager'] : ['Self', 'By Manager']}
          />
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          {['30', '60', '90'].map((d) => {
            const dayValue = parseInt(d);
            const isDisabled = propdDays && dayValue > propdDays;

            return (
              <button
                key={d}
                className={`px-6 py-2 rounded-lg text-lg ${days === dayValue ? 'bg-blue-500 text-white' : 'bg-gray-200'} ${isDisabled ? 'cursor-not-allowed bg-gray-300' : ''}`}
                onClick={() => !isDisabled && handleDaysChange(dayValue)}
                disabled={isDisabled}
              >
                {`${d} Days`}
              </button>
            );
          })}
        </div>

        <div className="content">
          {loading ? (
            <div className="text-center text-blue-500">Loading...</div>
          ) : view === 'rateEmployees' && employees.length > 0 ? (
            <RateEmployees employeeSelected={location.state?.employee} days={days} />
          ) : view === 'manager' ? (
            <ByManagerOnboarding days={days} />
          ) : (
            cardsData.map((item) => renderItem(item))
          )}
        </div>

        {view !== 'rateEmployees' && (
          <button
            className={`w-full py-3 text-white rounded-lg text-center ${userCardsCompleted && allCardsCompleted ? 'bg-blue-500' : 'bg-gray-300 cursor-not-allowed'}`}
            onClick={() => {
              if (userCardsCompleted && allCardsCompleted) {
                navigate('/onboarding-report-card', { state: { days: days } });
              }
            }}
            disabled={!(userCardsCompleted && allCardsCompleted)}
          >
            {userCardsCompleted && allCardsCompleted ? 'Discover Your Performance' : (
              <div className="flex justify-center items-center">
                <LockIcon height={24} width={24} />
                <span className="ml-2">Results Coming Soon!</span>
              </div>
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default Onboarding;
