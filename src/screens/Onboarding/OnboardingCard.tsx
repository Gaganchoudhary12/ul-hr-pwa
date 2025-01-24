import React from "react";
import PropTypes from "prop-types";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const SimpleProgressCard = ({
  title,
  progress,
  onPress,
  iconSource,
  backgroundColor,
  completedText,
  selfScore,
  managerScore,
}) => {
  const score = selfScore || managerScore || 0;
  const buttonText = progress === 0 ? "Start" : "Continue";

  return (
    <div
      className={`flex items-center w-11/12 mx-auto rounded-lg shadow-lg mb-6 p-4`}
      style={{ backgroundColor }}
      onClick={onPress}
    >
      <div className="flex items-center justify-center mr-4">
        {progress === "100" ? (
          <div className="w-20 h-20">
            <CircularProgressbar
              value={(score / 5) * 100}
              text={
                <tspan className="text-white">
                  <tspan
                    x="50%"
                    dy="-8"
                    textAnchor="middle"
                    className="text-s"
                  >
                    Score
                  </tspan>
                  <tspan
                    x="50%"
                    dy="20"
                    textAnchor="middle"
                    className="text-sm font-bold"
                  >
                    {score}/5
                  </tspan>
                </tspan>
              }
              styles={buildStyles({
                pathColor: "#10C710",
                textColor: "#FAFAFA",
                trailColor: "#FAFAFA",
                strokeLinecap: "round",
              })}
            />
          </div>
        ) : (
          <img src={iconSource} alt="Icon" className="w-20 h-20 object-cover" />
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
        {progress === "100" ? (
          <p className="text-sm text-white">{completedText}</p>
        ) : (
          <button
            className="bg-white text-orange-500 text-xs font-semibold px-4 py-1 rounded-full"
            onClick={onPress}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

SimpleProgressCard.propTypes = {
  title: PropTypes.string.isRequired,
  progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onPress: PropTypes.func.isRequired,
  iconSource: PropTypes.string,
  backgroundColor: PropTypes.string,
  completedText: PropTypes.string,
  selfScore: PropTypes.number,
  managerScore: PropTypes.number,
};

SimpleProgressCard.defaultProps = {
  iconSource: "",
  backgroundColor: "#FFFFFF",
  completedText: "",
  selfScore: 0,
  managerScore: 0,
};

export default SimpleProgressCard;
