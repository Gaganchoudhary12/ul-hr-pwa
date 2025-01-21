import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import EmployeeSelectModal from "./EmployeeSelectModal.tsx";
import ProgressCard from "../../../components/atoms/ProgressCard/ProgressCard.tsx";
import { useQuestions } from "../../../services/Questions.ts";
import { UserContext } from "../../../state/UserProvider.js";
import { useSelectedDate } from "../../../state/SelectedDateContext.js";
import { useGetManagerRating } from "../../../services/reporting.ts";
import { EmployeesContext } from "../../../state/Employees.js";
import { ReactComponent as DownIcon } from "../../../assets/down_icon.svg";
import { useEmployeesCardsData } from "../../../state/EmployeesValueCardsData.js";

const RateEmployees = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { questions } = useQuestions();
  const { cardsData, setCardsData } = useEmployeesCardsData();
  const history = useNavigate();
  const { user } = useContext(UserContext);
  const { selectedValue } = useSelectedDate();
  const { getManagerRating } = useGetManagerRating();
  const [managerRatings, setManagerRatings] = useState("");
  const [firstName] = "Mukul";
  const fullName = selectedEmployee?.fullName || "";
  const [name] = fullName.split(" ");
  const [allCardsCompleted, setAllCardsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [milestone, setMilestone] = useState(null);

  const { employees } = useContext(EmployeesContext);

  const fetchManagerRating = async () => {
    setLoading(true);
    const { data, isError } = await getManagerRating(
      selectedEmployee?.email,
      selectedValue
    );
    if (!isError) {
      setManagerRatings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedEmployee) {
      fetchManagerRating();
    }
  }, [selectedEmployee]);

  useEffect(() => {
    if (cardsData.length > 0 && managerRatings) {
      const allManagerCardsCompleted = cardsData.every((card) => {
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
  }, [cardsData, managerRatings, selectedEmployee]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const selectEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

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

  useEffect(() => {
    if (selectedEmployee) {
      fetchQuestion();
    }
  }, [selectedEmployee]);

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
      <ProgressCard
        title={item.title}
        progress={item.progress || progressInPercentage}
        progressBarColor={item.progressBarColor}
        onPress={() =>
          history("/employees-question", {
            state: {
              title: item.title,
              cardId: item.id,
              initialProgress: item.progress,
              cardsData: [...cardsData],
              employeeEmail: selectedEmployee?.email,
              date: selectedValue,
              selfRating: managerRatings,
            },
          })
        }
        month={selectedValue}
        managerScore={managerScore}
        iconSource={getIconForTitle(item.title)}
        backgroundColor="#B33000"
        completedText={`Thanks for valuing ${name}'s ratings!`}
      />
    );
  };

  const calculateMilestone = () => {
    const joiningDate = moment(selectedEmployee?.joiningDate);
    const currentDate = moment();
    const daysSinceJoining = currentDate.diff(joiningDate, "days");
    if (daysSinceJoining >= 80 && daysSinceJoining < 90) {
      setMilestone(90);
    } else if (daysSinceJoining >= 60 && daysSinceJoining < 70) {
      setMilestone(60);
    } else if (daysSinceJoining >= 30 && daysSinceJoining < 40) {
      setMilestone(30);
    } else {
      setMilestone(null);
    }
  };

  useEffect(() => {
    calculateMilestone();
  }, [selectedEmployee]);

  return (
    <div className="flex flex-col p-5">
      <div className="mb-5" onClick={() => setModalVisible(!modalVisible)}>
        <label className="text-sm text-gray-600 mb-2">Select Employee</label>
        <div className="flex justify-between items-center border border-gray-200 rounded-lg p-2 text-sm font-semibold text-gray-500">
          <p className="flex-1">
            {selectedEmployee ? selectedEmployee.fullName : "Employee name"}
          </p>
          <button
            className="border-none bg-none p-2"
            onClick={(e) => {
              e.stopPropagation(); // Prevents triggering the container's onClick
              setModalVisible(!modalVisible);
            }}
          >
            <DownIcon width={24} height={24} />
          </button>
        </div>
      </div>

      {selectedEmployee && milestone && (
        <div className="mb-4">
          <button
            className="border border-blue-400 p-2 bg-blue-100 rounded-lg w-full text-center"
            onClick={() =>
              history("/onboarding", {
                state: {
                  from: "managerRatings",
                  employee: selectedEmployee,
                  days: milestone,
                },
              })
            }
          >
            <p className="text-sm">
              Click here to complete Selected Employee Onboarding
            </p>
          </button>
        </div>
      )}

      <EmployeeSelectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        employees={employees}
        selectedValue={selectedEmployee}
        selectEmployee={setSelectedEmployee}
      />

      {loading && (
        <div className="flex justify-center items-center py-5">
          <span className="text-sm text-gray-600">Loading...</span>
        </div>
      )}

      {!selectedEmployee && !loading && (
        <div className="text-center">
          <img
            src="https://cdn.universityliving.com/files/17297691856493drenderinghandholdingsmartphonefingerchoosingstarbluebackgroundcustomerreviewexperienceconcept-1.webp"
            alt="Welcome"
            className="w-[217px] h-[173px] mx-auto"
          />
          <p className="text-sm font-normal text-gray-700 mt-4">
            ✨ Welcome! Select employee to get started and help them shine!
          </p>
        </div>
      )}

      {selectedEmployee && !loading && (
        <div className="mt-5">
          {cardsData.map((item) => renderItem({ item }))}
        </div>
      )}

      {!selectedEmployee && !loading && (
        <div className="mt-5 flex justify-center">
          <button
            className="bg-blue-500 text-white p-3 rounded-lg font-semibold"
            onClick={() => setModalVisible(true)}
          >
            Select Employee
          </button>
        </div>
      )}
    </div>
  );
};

export default RateEmployees;
