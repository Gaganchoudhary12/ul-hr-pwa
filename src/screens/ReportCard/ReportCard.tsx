import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../state/UserProvider.js";
import { useSelectedDate } from "../../state/SelectedDateContext.js";
import { useGetUserRating } from "../../services/getUserRating.ts";
import { useGetManagerRating } from "../../services/reporting.ts";
import HeaderWithBackButton from "../../components/organism/HeaderWithBackButton.tsx/HeaderWithBackButton.tsx";

const ReportCard = () => {
  const { user } = useContext(UserContext);
  const [firstName] = user.fullName.split(" ");
  const { selectedValue } = useSelectedDate();
  const [selfRating, setSelfRating] = useState({});
  const { getUserRating } = useGetUserRating();
  const { getManagerRating } = useGetManagerRating();
  const [managerRatings, setManagerRatings] = useState({});
  const [questionTypes, setQuestionTypes] = useState([]);

  const score = user.score || 8;
  const progress = score / 10;

  const fetchUserRating = async () => {
    const { data, isError } = await getUserRating(user.email, selectedValue);
    if (!isError) {
      const newRatings = Object.keys(data).reduce((acc, type) => {
        const length = Object.values(data[type]).length;
        const rating = Object.values(data[type]).reduce(
          (sum, value) => sum + value,
          0
        );
        return { ...acc, [type]: rating / length };
      }, {});
      setSelfRating((prev) => ({ ...prev, ...newRatings }));
    }
  };

  useEffect(() => {
    fetchUserRating();
  }, [selectedValue]);

  const fetchManagerRating = async () => {
    const { data, isError } = await getManagerRating(user.email, selectedValue);
    if (!isError) {
      setQuestionTypes(Object.keys(data));
      const newRatings = Object.keys(data).reduce((acc, type) => {
        const length = Object.values(data[type]).length;
        const rating = Object.values(data[type]).reduce(
          (sum, value) => sum + value,
          0
        );
        return { ...acc, [type]: rating / length };
      }, {});
      setManagerRatings((prev) => ({ ...prev, ...newRatings }));
    }
  };

  useEffect(() => {
    fetchManagerRating();
  }, []);

  const renderRatingCards = () =>
    questionTypes.map((item, index) => {
      const managerRating = managerRatings[item];
      const selfRatingValue = selfRating[item];

      if (managerRating !== undefined && selfRatingValue !== undefined) {
        const ratingDifference = Math.abs(managerRating - selfRatingValue);
        let statusText = "Excellent";

        if (ratingDifference > 0.5 && ratingDifference <= 1) {
          statusText = "Acceptable";
        } else if (ratingDifference > 1 && ratingDifference <= 1.5) {
          statusText = "Needs Attention";
        } else if (ratingDifference > 1.5) {
          statusText = "Alarming";
        }

        return (
          <div
            key={index}
            className="flex justify-between bg-white border border-gray-300 p-4 rounded-lg mb-2"
          >
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-1 w-40">{item}</h3>
              <p
                className={`text-sm font-semibold mb-2 ${
                  statusText === "Needs Attention" || statusText === "Alarming"
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {statusText}
              </p>
            </div>
            <div>
              <p
                className={`text-lg font-bold text-right ${
                  statusText === "Needs Attention" || statusText === "Alarming"
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {parseFloat(selfRatingValue).toFixed(2)}
              </p>
              <p className="text-xs font-normal text-gray-500 mt-2">
                Your Score
              </p>
            </div>
            <div className="w-px bg-gray-300 mx-3 h-full"></div>
            <div>
              <p
                className={`text-lg font-bold text-right ${
                  statusText === "Needs Attention" || statusText === "Alarming"
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {parseFloat(managerRating).toFixed(2)}
              </p>
              <p className="text-xs font-normal text-gray-500 mt-2">
                Manager Score
              </p>
            </div>
          </div>
        );
      } else {
        return null;
      }
    });

  const overallSelfRating =
    Object.values(selfRating).reduce((acc, val) => acc + val, 0) /
    Object.values(selfRating).length;

  const overallManagerRating =
    Object.values(managerRatings).reduce((acc, val) => acc + val, 0) /
    Object.values(managerRatings).length;

  const ratingDifference = Math.abs(overallSelfRating - overallManagerRating);
  let overallStatus = "Excellent";
  if (ratingDifference > 0.5 && ratingDifference <= 1) {
    overallStatus = "Acceptable";
  } else if (ratingDifference > 1 && ratingDifference <= 1.5) {
    overallStatus = "Needs Attention";
  } else if (ratingDifference > 1.5) {
    overallStatus = "Alarming";
  }

  const normalizedScore = ((ratingDifference + 5) / 10) * 100;

  return (
    <>
      <HeaderWithBackButton
        title="Quiz Results 🏆"
        subTitle="View your performance and detailed scores now!"
      />
      <div className="mt-[-8px] pb-10 pt-8 px-4 bg-white rounded-t-lg">
        <h1 className="text-sm font-bold text-black">Hi, {firstName}!</h1>
        <p className="text-sm font-normal my-2 text-black">
          Your overall Value score combines the ratings from both you and your
          manager.
        </p>
        <h2 className="text-2xl font-bold text-gray-800">
          Overall Score : {overallSelfRating.toFixed(2)}
        </h2>
        <div className="my-5">
          <div className="h-[6px] bg-gray-200 rounded-lg overflow-hidden relative">
            <div
              className="h-full"
              style={{
                width: `${normalizedScore}%`,
                background:
                  "linear-gradient(to right, #00FF00, #FFFF00, #FF0000)",
              }}
            />
          </div>

          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-600">-5</span>
            <span className="text-xs text-gray-600">0</span>
            <span className="text-xs text-gray-600">5</span>
          </div>
        </div>

        <div className="bg-green-50 p-3 rounded-md">
          <p className="text-xs font-bold text-center text-black">
            The deviation between your score and your manager's is{" "}
            {ratingDifference.toFixed(2)} :{" "}
            <span
              className={`${
                overallStatus === "Needs Attention" ||
                overallStatus === "Alarming"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {overallStatus}
            </span>
          </p>
        </div>

        <div className="my-4">
          <h3 className="text-xl font-semibold text-gray-800">Results</h3>
          <p className="text-xs font-normal text-gray-800">
            Acknowledging your journey and gearing up for more!
          </p>
          <p className="text-center mt-3 text-lg font-semibold text-gray-800">
            Overall Score
          </p>
        </div>
        <div className="space-y-2">{renderRatingCards()}</div>
      </div>
    </>
  );
};

export default ReportCard;
