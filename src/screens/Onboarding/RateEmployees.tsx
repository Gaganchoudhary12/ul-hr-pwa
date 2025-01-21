import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../state/UserProvider.js';
import { useSelectedDate } from '../../state/SelectedDateContext.js';
import { useGetOnboardingManagerRating } from '../../services/getOnboardingManagerRating.ts';
import { EmployeesContext } from '../../state/Employees.js';
import EmployeeSelectModal from '../Values/RateEmployees/EmployeeSelectModal.tsx';
import OnboardingCard from './OnboardingCard.tsx';
import { useOnboardingQuestions } from '../../services/onboardingQuestions.ts';
import ProgressBar from 'react-progressbar.js';  // Importing progress bar library
import { useQuestions } from '../../services/Questions.ts';
import { useEmployeesQuestionOnboardingCardsData } from '../../state/EmployeesQuestionOnboarding.js';

const RateEmployees = () => {
  const location = useLocation();
  const days = location.state.days;
  const employee = location.state.employee

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { questions } = useQuestions();
  const { cardsData, setCardsData } = useEmployeesQuestionOnboardingCardsData();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { selectedValue } = useSelectedDate();
  const { getManagerOnboardingRating } = useGetOnboardingManagerRating();
  const [managerRatings, setManagerRatings] = useState('');
  const [firstName] = user.fullName.split(' ');
  const fullName = selectedEmployee?.fullName || '';
  const [name] = fullName.split(' ');
  const [allCardsCompleted, setAllCardsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { onboardingQuestions } = useOnboardingQuestions();
  const { employees } = useContext(EmployeesContext);

  const fetchManagerRating = async () => {
    setLoading(true);
    const { data, isError } = await getManagerOnboardingRating(
      employee?.email,
      days
    );
    if (!isError) {
      setManagerRatings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchManagerRating();
  }, [employee]);

  useEffect(() => {
    if (cardsData.length > 0 && managerRatings) {
      const allManagerCardsCompleted = cardsData.every(card => {
        const managerRatingsData = managerRatings[card.title] || {};
        return (
          Object.keys(managerRatingsData).length > 0 &&
          Object.keys(managerRatingsData).length === card.questionsData.length
        );
      });
      setAllCardsCompleted(allManagerCardsCompleted);
    } else {
      setAllCardsCompleted(false);
    }
  }, [cardsData, managerRatings, employee]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const selectEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

  const fetchQuestion = async () => {
    setLoading(true);

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

    setLoading(false);
  };

  useEffect(() => {
    if (employee) {
      fetchQuestion();
    }
  }, [employee]);

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

  const renderItem = ({ item }) => {
    let progress = 0;
    let progressInPercentage = 0;
    let managerScore = 0;

    if (managerRatings?.[item.title]) {
      const ratings = Object.values(managerRatings[item.title]);
      progress = ratings.length;
      progressInPercentage = (
        (progress / item?.questionsData?.length) *
        100
      ).toFixed(0);
      managerScore = (
        ratings.reduce((sum, rating) => sum + rating, 0) / progress
      ).toFixed(2);
    }

    return (
      <OnboardingCard
        title={item.title}
        progress={progressInPercentage}
        onPress={() =>
          navigate('/employees-question-onboarding', {
            state: {
              title: item.title,
              cardId: item.id,
              initialProgress: item.progress,
              employeeEmail: employee.email,
              date: selectedValue,
              selfRating: managerRatings,
              days: days,
              employee: employee,
            }
          })
        }
        managerScore={managerScore}
        iconSource={getIconForTitle(item.title)}
        backgroundColor="#B33000"
        completedText={`Thanks for valuing ${employee.fullName}'s ratings!`}
        progressBar={<ProgressBar.Circle progress={progressInPercentage / 100} options={{ strokeWidth: 2, color: '#007bff' }} />}
      />
    );
  };

  return (
    <div className="flex flex-col">
      <div className="mb-5 mx-4">
        <div className="relative px-2">
          <input
            type="text"
            placeholder={employee.fullName}
            className="h-14 border border-gray-300 rounded-lg bg-white px-3 text-sm font-semibold text-gray-400 w-full"
            value={employee.fullName}
            disabled
          />
        </div>
      </div>

      <EmployeeSelectModal
        visible={modalVisible}
        onClose={toggleModal}
        employees={employees}
        selectedValue={selectedEmployee}
        selectEmployee={selectEmployee}
      />

      {loading && (
        <div className="flex justify-center items-center mb-5">
          <div className="spinner w-12 h-12" />
        </div>
      )}

      {!employee && !loading && (
        <>
          <img
            src="https://cdn.universityliving.com/files/17297691856493drenderinghandholdingsmartphonefingerchoosingstarbluebackgroundcustomerreviewexperienceconcept-1.webp"
            className="h-44 w-56 mx-auto"
            alt="Welcome"
          />
          <p className="text-xs font-normal text-gray-700 text-center mt-4">
            ✨ Welcome! Select employee to get started and help them shine!
          </p>
        </>
      )}

      {employee && !loading && (
        <div className="max-h-[80vh] overflow-y-scroll">
          {cardsData.map(item => renderItem({ item }))}
        </div>
      )}
    </div>
  );
};

export default RateEmployees;
