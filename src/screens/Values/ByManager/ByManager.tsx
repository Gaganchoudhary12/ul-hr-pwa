import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../state/UserProvider';
import { useQuestions } from '../../../services/Questions.ts';
import { EmployeesContext } from '../../../state/Employees';
import { useGetManagerRating } from '../../../services/reporting.ts';
import ProgressCard from '../../../components/atoms/ProgressCard/ProgressCard.tsx';

const ByManager = ({ selectedValue }) => {
  const { user } = useContext(UserContext);
  const { questions } = useQuestions();
  const [cardsData, setCardsData] = useState([]);
  const { getManagerRating } = useGetManagerRating();
  const [managerRatings, setManagerRatings] = useState('');
  const [allCardsCompleted, setAllCardsCompleted] = useState(false);

  const { employees } = useContext(EmployeesContext);

  const fetchManagersRating = async () => {
    const { data, isError } = await getManagerRating(user.email, selectedValue);
    if (!isError) {
      setManagerRatings(data);
    }
  };

  useEffect(() => {
    fetchManagersRating();
  }, [selectedValue]);

  const fetchQuestion = async () => {
    const { data, isError } = await questions();
    if (!isError && data) {
      const cardColors = {
        1: '#2ECC71',
        2: '#3498DB',
        3: '#E74C3C',
        4: '#1ABC9C',
        5: '#F39C12',
      };
      const mappedData = data.map((item, index) => ({
        id: index + 1,
        title: item.title,
        questionsData: item.questions,
        progressBarColor: cardColors[index + 1] || 'gray',
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
  }, [cardsData, managerRatings, selectedValue]);

  const getIconForTitle = title => {
    switch (title) {
      case 'ADAPTABILITY':
        return 'https://cdn.universityliving.com/files/1729767852218fi_10930043.webp';
      case 'INTEGRITY':
        return 'https://cdn.universityliving.com/files/1729767705888fi_15552480.webp';
      case 'EMPATHY & RESPECT':
        return 'https://cdn.universityliving.com/files/1729767789142fi_12164528.webp';
      case 'ACCOUNTABILITY':
        return 'https://cdn.universityliving.com/files/1729767940592fi_763965.webp';
      case 'TRANSPARENCY':
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
      progressInPercentage = ((progress / item?.questionsData?.length) * 100).toFixed(0);
      Score = (ratings.reduce((sum, rating) => sum + rating, 0) / progress).toFixed(1);
    }

    return (
      <ProgressCard
        title={item.title}
        progress={item.progress || progressInPercentage}
        isEditable={false}
        month={selectedValue}
        managerScore={Score}
        iconSource={getIconForTitle(item.title)}
        backgroundColor="#003264"
        completedText={`Reviewed on ${selectedValue}`}
      />
    );
  };

  return (
    <div style={{ marginTop: '10px', marginBottom: '10px' }}>
      {allCardsCompleted ? (
        <>
          <p style={{
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: '600',
            color: '#333333',
            marginBottom: '10px',
          }}>
            You Got a score from {user.reportingTo}
          </p>

          <div>
            {cardsData.map(item => (
              <div key={item.id}>
                {renderItem(item)}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#E74C3C',
          fontWeight: '600',
        }}>
          Manager's review in progress for {selectedValue}
        </p>
      )}
    </div>
  );
};

export default ByManager;

