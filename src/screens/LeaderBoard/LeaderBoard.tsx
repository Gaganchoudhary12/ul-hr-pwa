import React, { useEffect, useState } from "react";
import { ReactComponent as Rank1 } from "../../assets/Rank1.svg";
import { ReactComponent as Rank2 } from "../../assets/Rank2.svg";
import { ReactComponent as Rank3 } from "../../assets/Rank3.svg";
import Avatar from "react-avatar";
import { useLeaderBoard } from "../../services/leaderboard.ts";
import HeaderWithBackButton from "../../components/organism/HeaderWithBackButton.tsx/HeaderWithBackButton.tsx";

const Leaderboard = () => {
  const [selectedMode, setSelectedMode] = useState("weekly");
  const { getLeaderBoard } = useLeaderBoard();
  const [leaderBoardData, setLeaderBoardData] = useState([]);

  const fetchLeaderBoardData = async () => {
    const { data, isError } = await getLeaderBoard();
    if (!isError) {
      setLeaderBoardData(data);
    } else {
      console.error("Error fetching leaderBoard:", isError);
    }
  };

  useEffect(() => {
    fetchLeaderBoardData();
  }, []);

  const formatTime = (time) => {
    if (!time || typeof time !== "string") {
      return "Invalid time format"; // or return a default value like '0h 0m'
    }

    const [hours, minutes, seconds] = time.split(":").map(Number);
    return `${hours}h ${minutes}m`; // Return hours, minutes, and seconds
  };

  const renderTopThree = () => {
    const topThree = leaderBoardData.slice(0, 3);

    return (
      <div className="flex justify-center items-center mt-[160px]">
        <div className="relative flex flex-col items-center justify-center">
          <Rank2 width={104} height={180} />
          <div className="absolute top-[-250px] left-0 right-0 bottom-[100px] flex flex-col justify-center items-center">
            <Avatar name={topThree[1]?.name} size="56" round color="#9087E5" />
            <p className="mt-2 text-lg font-medium text-black">
              {topThree[1]?.name}
            </p>
            <p className="mt-2 text-sm font-medium text-white bg-[#9087E5] rounded-xl py-2 px-4">
              {formatTime(topThree[1]?.time)}
            </p>
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center">
          <Rank1 width={110} height={262} />
          <div className="absolute top-[-250px] left-0 right-0 bottom-[170px] flex flex-col justify-center items-center">
            <Avatar name={topThree[0]?.name} size="56" round color="#9087E5" />
            <p className="mt-2 text-lg font-medium text-black">
              {topThree[0]?.name}
            </p>
            <p className="mt-2 text-sm font-medium text-white bg-[#9087E5] rounded-xl py-2 px-4">
              {formatTime(topThree[0]?.time)}
            </p>
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center">
          <Rank3 width={104} height={180} className="mt-[40px]" />
          <div className="absolute top-[-250px] left-0 right-0 bottom-[50px] flex flex-col justify-center items-center">
            <Avatar name={topThree[2]?.name} size="56" round color="#9087E5" />
            <p className="mt-2 text-lg font-medium text-black">
              {topThree[2]?.name}
            </p>
            <p className="mt-2 text-sm font-medium text-white bg-[#9087E5] rounded-xl py-2 px-4">
              {formatTime(topThree[2]?.time)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderItem = ({ item }) => (
    <div className="flex items-center p-4 my-2 mx-1 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-center w-[30px] h-[30px] border border-[#ddd] rounded-full mr-2">
        <p className="text-sm font-medium text-[#858494]">{item.position}</p>
      </div>
      <div className="ml-5">
        <Avatar name={item.name} size="56" round color="#9087E5" />
      </div>
      <div className="ml-10 flex-1">
        <p className="text-lg font-medium text-[#0C092A]">{item.name}</p>
        <p className="mt-2 text-sm font-normal text-[#858494]">
          {formatTime(item.time)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex-1">
      <HeaderWithBackButton title="LeaderBoard" />
      <div className="flex-1 pb-[40px] pt-[30px] bg-white rounded-tl-[20px] rounded-tr-[20px] relative ">
        <div className="overflow-hidden relative mx-3">
          {renderTopThree()}

          <div
            className="bg-[#EFEEFC] p-4 rounded-2xl  w-[359px] mx-auto z-[10] relative"
            style={{ position: "relative", top: "-50px" }} // Adjust position to overlap
          >
            <div className="overflow-auto">
              {leaderBoardData.slice(3).map((item) => renderItem({ item }))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
