import React from "react";
import { ProgressBar } from "react-bootstrap";
import PlayButton from "../../../assets/playButtonRed.svg";

const ProgressCard = ({
  title,
  progress,
  month,
  selfScore,
  managerScore,
  progressBarColor,
  onPress,
  isEditable,
  iconSource,
  backgroundColor,
  completedText,
}) => {
  const score = selfScore || managerScore;
  const buttonText = progress === 0 ? "Start" : "Continue";
  const progressBarColorStyle = {
    backgroundColor: progress >= 50 ? "yellow" : "white",
  };

  return (
    <div
      className={`flex justify-between items-center p-3 my-3 mx-auto rounded-xl shadow-lg ${backgroundColor}`}
      style={{ width: "100%", backgroundColor: backgroundColor }}
      onClick={onPress}
    >
      <div className="flex items-center">
        {/* Icon on the left side */}
        <div className="flex items-center justify-center">
          {progress === "100" ? (
            <div
              className="flex items-center justify-center"
              style={{ width: 90, height: 90 }}
            >
              <div className="relative">
                {/* Circular progress bar */}
                <svg
                  width="90"
                  height="90"
                  viewBox="0 0 36 36"
                  className="circular-chart"
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <circle
                    className="background"
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth="3"
                  />
                  <circle
                    className="foreground"
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke={progressBarColor || "#39FF39"}
                    strokeWidth="3"
                    strokeDasharray={`${(score / 10) * 94.248} 94.248`}
                    strokeLinecap="round"
                  />
                </svg>
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-sm text-white font-semibold">
                  {parseFloat(score)}/10
                </p>
              </div>
            </div>
          ) : (
            <img src={iconSource} alt={title} className="w-20 h-20 mr-3" />
          )}
        </div>

        <div className="ml-4 flex flex-col">
          <p className="text-white text-m font-semibold">{title}</p>
          {progress === "100" && (
            <p className="text-white text-xs mt-2">{completedText}</p>
          )}
          {progress !== "100" && (
            <>
              {progress ? (
                <div className="my-2">
                  <p className="text-white text-sm mb-2">{`${progress}% Completed`}</p>
                  <ProgressBar
                    now={progress}
                    className="rounded-full"
                    style={{
                      height: 4,
                      backgroundColor: "#e6e6e6",
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: "100%",
                        backgroundColor: progressBarColor || "#39FF39",
                      }}
                    ></div>
                  </ProgressBar>
                </div>
              ) : (
                <p className="text-white text-xs mt-2">
                  For the month of {month}
                </p>
              )}
            </>
          )}
          {progress !== "100" && (
            <button
              className="mt-4 px-4 py-1 bg-white rounded-xl flex items-center text-orange-600 font-semibold"
              onClick={onPress}
              disabled={!isEditable}
              style={{ width: "fit-content" }}
            >
              <p className="mr-2 text-sm">{buttonText}</p>
              <img src={PlayButton} alt="Play Button" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
