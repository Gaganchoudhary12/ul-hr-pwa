import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PlayButton from "../../assets/playButton.svg";
import {ReactComponent as Valuesbanner} from "../../assets/valuesbanner.svg";
import {ReactComponent as ManagerBanner} from "../../assets/managerBanner.svg";
import { UserContext } from "../../state/UserProvider";
import { EmployeesContext } from "../../state/Employees";

const HighlightedSection = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();
  const { user } = useContext(UserContext);
  const email = user.email;
  const { employees } = useContext(EmployeesContext);

  const data = [
    ...(employees.length > 0
      ? [
          {
            id: "1",
            title: "Rate Your Team",
            subtitle: "Rate your team and celebrate their contributions! 🚀✨",
            buttonText: "Rate Now",
            onPress: () =>
              navigate("/values", { state: { defaultTab: "rateEmployees" } }),
            ImageComponent: ManagerBanner,
            backgroundColor: "bg-yellow-100",
            buttonBackgroundColor: "bg-orange-500",
            buttonTextColor: "text-white",
            showPlayButton: true,
          },
        ]
      : []),
    {
      id: "2",
      title: "Culture Quotient",
      subtitle: "Discover how you align with our values & culture!",
      buttonText: "Play",
      onPress: () => navigate("/values", { state: { defaultTab: "self" } }),
      ImageComponent: Valuesbanner,
      backgroundColor: "bg-orange-100",
      buttonBackgroundColor: "bg-orange-500",
      buttonTextColor: "text-white",
      showPlayButton: true,
    },
    {
      id: "3",
      title: "The Innovation Hub",
      subtitle: "Your space to share ideas that drive change.",
      buttonText: "Share Now",
      onPress: () => navigate("/idea"),
      backgroundColor: "bg-blue-100",
      buttonBackgroundColor: "bg-blue-500",
      buttonTextColor: "text-white",
      showPlayButton: false,
    },
  ];

  const renderItem = ({ item }) => {
    const isFirstCard = item.id === "1";
    const isSecondCard = item.id === "2";
    const lastcard = item.length - 1;
    const {
      title,
      subtitle,
      buttonText,
      onPress,
      ImageComponent,
      buttonBackgroundColor,
      buttonTextColor,
      showPlayButton,
    } = item;
  
    return (
      <div
        className={`flex flex-row p-2 rounded-lg items-center justify-center mt-5 w-[80vw] mr-3 ${item.backgroundColor}`}
        style={{ height: "150px" }}  // Set a fixed height for the banner
      >
        <div className="flex flex-col justify-between" style={{ flex: 1 }}>
          <div>
            <h3 className="text-gray-800 text-sm font-normal leading-[22px] mb-1">
              {title}
            </h3>
            <p className="text-gray-800 text-sm font-bold mb-2">{subtitle}</p>
          </div>
          <button
            className={`flex flex-row rounded-full justify-center items-center px-3 py-2 ${buttonBackgroundColor}`}
            onClick={onPress}
            style={{ width: 120 }}
          >
            <span className={`${buttonTextColor} text-sm font-medium mr-2`}>
              {buttonText}
            </span>
            {showPlayButton && <img src={PlayButton} alt="Play" />}
          </button>
        </div>
        <div className="flex-shrink-0">
          {isFirstCard || isSecondCard ? (
            <ImageComponent style={{ width: 100, height: 100 }} />
          ) : (
            <img
              src="https://cdn.universityliving.com/files/1729769428545amazoncard.webp"
              style={{ width: 100, height: 100 }} // Ensure consistent image size
            />
          )}
        </div>
      </div>
    );
  };
  

  const handleScroll = (event) => {
    const index = Math.round(
      event.target.scrollLeft / event.target.offsetWidth
    );
    setActiveIndex(index);
  };

  return (
    <div>
      <div
        ref={flatListRef}
        className="flex overflow-x-auto"
        onScroll={handleScroll}
        style={{
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          msOverflowStyle: "none", // Internet Explorer 10+
          scrollbarWidth: "none", // Firefox
        }}
      >
        {data.map((item, index) => (
          <div key={index} style={{ scrollSnapAlign: "start" }}>
            {renderItem({ item })}
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mt-2">
        {data.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === activeIndex ? "bg-orange-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HighlightedSection;
