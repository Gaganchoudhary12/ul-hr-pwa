import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MultiColumnDropdown from "../../components/molecules/DropDown/DropDown.tsx";
import { useSelectedDate } from "../../state/SelectedDateContext";
import { useQuestions } from "../../services/Questions.ts";
import ProgressCard from "../../components/atoms/ProgressCard/ProgressCard.tsx";
import Tab from "../../components/atoms/Tab/Tab.tsx";
import { useGetUserRating } from "../../services/getUserRating.ts";
import { UserContext } from "../../state/UserProvider";
import RateEmployees from "./RateEmployees/RateEmployees.tsx";
import ByManager from "./ByManager/ByManager.tsx";
import { useGetManagerRating } from "../../services/reporting.ts";
import LockIcon from "../../assets/lockIcon.svg";
import HeaderWithBackButton from "../../components/organism/HeaderWithBackButton.tsx/HeaderWithBackButton.tsx";
import { useCardsData } from "../../state/ValuesCardsdata.js";

const Values = () => {
  const location = useLocation();
  const defaultTab  = location.state.defaultTab
  
  const [fadeAnim, setFadeAnim] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { selectedValue, setSelectedValue } = useSelectedDate();
  const [view, setView] = useState(defaultTab || 'self');
  const { questions } = useQuestions();
  const { getUserRating } = useGetUserRating();
  const { cardsData, setCardsData } = useCardsData();
  const [selfRating, setSelfRating] = useState(0);
  const { user } = useContext(UserContext);
  const email = user.email;
  const [employees, setEmployees] = useState([]);
  const [managerRatings, setManagerRatings] = useState("");
  const { getManagerRating } = useGetManagerRating();
  const [allCardsCompleted, setAllCardsCompleted] = useState(false);
  const [userCardsCompleted, setUserCardsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch manager's rating when selectedValue changes
  useEffect(() => {
    const fetchManagersRating = async () => {
      const { data, isError } = await getManagerRating(
        user.email,
        selectedValue
      );
      if (!isError) {
        setManagerRatings(data);
      }
    };

    fetchManagersRating();
  }, [selectedValue]);

  // Fetch user's rating when selectedValue changes
  useEffect(() => {
    const fetchUserRating = async () => {
      const { data, isError } = await getUserRating(user.email, selectedValue);
      if (!isError) {
        setSelfRating(data);
      }
    };

    fetchUserRating();
  }, [selectedValue]);

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      const { data, isError } = await questions();
      if (!isError && data) {
        const cardColors = {
          1: "#2ECC71",
          2: "#3498DB",
          3: "#E74C3C",
          4: "#1ABC9C",
          5: "#F39C12",
        };
        const mappedData = data.map((item, index) => ({
          id: index + 1,
          title: item.title,
          questionsData: item.questions,
          progressBarColor: cardColors[index + 1] || "gray",
        }));
        setCardsData(mappedData);
      } else {
        console.error("Error fetching questions:", isError);
      }
      setLoading(false);
    };

    fetchQuestion();
  }, [selectedValue]);

  useEffect(() => {
    if (cardsData.length > 0 && selfRating && managerRatings) {
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
  }, [cardsData, selfRating, managerRatings]);

  useEffect(() => {
    setFadeAnim(1);
  }, []);

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.toLocaleString("default", { month: "long" });
    const currentYear = now.getFullYear().toString();

    setSelectedValue(`${currentMonth} ${currentYear}`);
  }, []);

  // Function to get the icon URL based on card title
  const getIconForTitle = (title) => {
    switch (title) {
      case "ADAPTABILITY":
        return "https://cdn.universityliving.com/files/1729767852218fi_10930043.webp";
      case "INTEGRITY":
        return "https://cdn.universityliving.com/files/1729767705888fi_15552480.webp";
      case "EMPATHY & RESPECT":
        return "https://cdn.universityliving.com/files/1729767789142fi_12164528.webp";
      case "ACCOUNTABILITY":
        return "https://cdn.universityliving.com/files/1729767940592fi_763965.webp";
      case "TRANSPARENCY":
        return "https://cdn.universityliving.com/files/1729767340086fi_8386465.webp";
      default:
        return null;
    }
  };

  const renderItem = (item) => {
    let progress = 0;
    let progressInPercentage = 0;
    let selfScore = 0;

    if (selfRating?.[item.title]) {
      const ratings = Object.values(selfRating[item.title]);
      progress = ratings.length;
      progressInPercentage = (
        (progress / item?.questionsData?.length) *
        100
      ).toFixed(0);
      selfScore = (
        ratings.reduce((sum, rating) => sum + rating, 0) / progress
      ).toFixed(1);
    }

    return (
      <ProgressCard
        title={item.title}
        progress={item.progress || progressInPercentage}
        progressBarColor={item.progressBarColor}
        onPress={() =>
          navigate('/feedback', {
            state: {
              title: item.title,
              cardId: item.id,
              initialProgress: item.progress,
              cardsData: [...cardsData],
              date: selectedValue,
              selfRating,
            },
          })
        }
        isEditable={view === "self"}
        month={selectedValue}
        selfScore={selfScore}
        iconSource={getIconForTitle(item.title)}
        backgroundColor={"#003264"}
        completedText="Get ready for the next quiz!"
      />
    );
  };

  return (
    <>
    <HeaderWithBackButton
        title="Values"
        subTitle="Play & match your vision with company culture"
      />
    <div className="px-5 bg-white rounded-xl">
      
      <div className="flex justify-center mt-6">
        <button
          className="w-80 py-2.5 px-3 bg-transparent border border-gray-300 rounded-lg text-lg text-gray-800 text-center"
          onClick={() => setDropdownOpen(true)}
        >
          <span className="text-lg">{selectedValue}</span>
        </button>
        <MultiColumnDropdown
          open={dropdownOpen}
          setOpen={setDropdownOpen}
          value={selectedValue}
          setValue={setSelectedValue}
        />
      </div>
      <div className="mt-5">
        <Tab
          selectedView={view}
          onSelectView={setView}
          tabs={["Rate Employees", "Self", "By Manager"]}
        />
      </div>
      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span>Loading...</span>
          </div>
        ) : view === "rateEmployees" ? (
          <RateEmployees />
        ) : view === "manager" ? (
          <ByManager selectedValue={selectedValue} />
        ) : (
          cardsData.map(renderItem)
        )}
      </div>
      {view !== "rateEmployees" && (
        <button
          className="w-full py-3 bg-blue-600 text-white text-center rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed mb-2"
          onClick={() => {
            if (userCardsCompleted && allCardsCompleted) {
              navigate("/report-card");
            }
          }}
          disabled={!(userCardsCompleted && allCardsCompleted)}
        >
          {userCardsCompleted && allCardsCompleted ? (
            "Discover Your Performance"
          ) : (
            <div className="flex items-center justify-center">
              <img src={LockIcon} height={24} width={24} alt="lock icon" />
              <span className="ml-3 mt-0.5">Results Coming Soon!</span>
            </div>
          )}
        </button>
      )}
    </div>
    </>
  );
};

export default Values;
