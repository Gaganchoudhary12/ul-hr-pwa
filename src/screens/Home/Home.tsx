import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";

import { UserContext } from "../../state/UserProvider.js";
import { EmployeesContext } from "../../state/Employees.js";

import HomeFeedbackCard from "../../components/atoms/HomeFeedbackCard/HomeFeedbackCard.tsx";
import Banners from "./Banner.tsx";
import EventsSection from "./EventsSection.tsx";
import HighlightedSection from "./HighlightedSection.tsx";
import Header from "../../components/organism/Header/Header.tsx";
import Angry from "../../assets/angry.gif";
import Sad from "../../assets/sad.gif";
import Bored from "../../assets/bored.gif";
import Happy from "../../assets/happy.gif";
import Surprised from "../../assets/surprised.gif";
import { useGetEmployees } from "../../services/getEmployees.ts";
import { useGetBanner } from "../../services/banner.ts";
import { useFeedbackSubmit } from "../../services/feedbackSubmit.ts";

const emojiMap = {
  Angry: 1,
  Sad: 2,
  Bored: 3,
  Happy: 4,
  Surprised: 5,
};

const emojiImages = { Angry, Sad, Bored, Happy, Surprised };

export default function Home() {
  const { user } = useContext(UserContext);
  const [firstName] = user.fullName ? user.fullName.split(' ') : ['User'];
  const history = useNavigate();
  const { getEmployees } = useGetEmployees();
  const { getBanner } = useGetBanner();
  const { feedbackSubmit } = useFeedbackSubmit();

  const [bannerData, setBannerData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [dailyRating, setDailyRating] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [milestone, setMilestone] = useState(null);

  const { employees, setEmployees } = useContext(EmployeesContext);

  useEffect(() => {
    if (!user) {
      history("/login");
    }
  }, [user, history]);

  const calculateMilestone = () => {
    const joiningDate = moment(user.joiningDate);
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
  }, []);

  const navigateToOnboarding = () => {
    if (milestone) {
      history(`/onboarding`, {
        state: {
          days: milestone,
          defaultTab: "self",
        },
      });
    }
  };

  const fetchEmployees = async () => {
    const { data, isError } = await getEmployees(user.email);
    if (!isError) {
      setEmployees(data);
    } else {
      console.error("Error fetching employees:", isError);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchBannerData = async () => {
    const { data, isError } = await getBanner();

    if (!isError && data) {
      const formattedData = data
        .filter((item) => item.data?.length)
        .map(({ title, data }) => ({
          title: mapTitle(title),
          subtitle: mapSubtitle(title),
          data,
        }));
      setBannerData(formattedData);
    }
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  const checkDailyMoodSubmission = async () => {
    const today = new Date().toISOString().split("T")[0];
    const lastSubmissionDate = await localStorage.getItem(
      "dailyMoodSubmittedDate"
    );

    if (lastSubmissionDate !== today) {
      setModalVisible(true);
    }
  };

  useEffect(() => {
    checkDailyMoodSubmission();
  }, []);

  const mapTitle = (title) => {
    const titleMapping = {
      ANNIVERSARIES: "Let's cheer for everyone",
      TOWNHALL: "The Champion's Circle",
      EVENTS: "Events",
      BIRTHDAY: "It's Birthday Time!",
    };
    return titleMapping[title] || title;
  };

  const mapSubtitle = (title) => {
    const subtitleMapping = {
      ANNIVERSARIES: "Wish your Team mates and make them feel special",
      TOWNHALL:
        "Celebrating the top performers who set the gold standard in excellence.",
      EVENTS:
        "Stay updated and join in on exciting team activities and celebrations!",
      BIRTHDAY: "Celebrate the joy with heartfelt wishes and cheer!",
    };
    return subtitleMapping[title] || "";
  };

  const handleEmojiSelect = (emojiKey) => {
    setSelectedEmoji(emojiKey);
    setDailyRating(emojiMap[emojiKey]);
  };

  const handleDailyRatingSubmit = async () => {
    if (dailyRating === null) return;

    const { isError, data } = await feedbackSubmit(
      "dailyMood",
      "other",
      dailyRating
    );
    if (!isError) {
      setFeedbackSubmitted();
    } else {
      console.log("Error on submit:", isError);
    }
  };

  const setFeedbackSubmitted = async () => {
    setShowThankYou(true);
    const today = new Date().toISOString().split("T")[0];
    await localStorage.setItem("dailyMoodSubmittedDate", today);
  };

  return (
    <>
      <Header />
      <div className="w-full max-w-6xl mx-auto p-5 bg-white-100">
        <div>
          <HomeFeedbackCard />
          {milestone && !employees.length && (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 w-full py-2 rounded mt-5"
              onClick={navigateToOnboarding}
            >
              Begin your {milestone} days challenge
            </button>
          )}
          <HighlightedSection />
          <Banners bannerData={bannerData} />
          <EventsSection />
        </div>

        {modalVisible && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-5">
              <div>
                {showThankYou ? (
                  <ThankYouContent
                    firstName={firstName}
                    dailyRating={dailyRating}
                    onClose={() => setModalVisible(false)}
                  />
                ) : (
                  <MoodSelection
                    firstName={firstName}
                    selectedEmoji={selectedEmoji}
                    handleEmojiSelect={handleEmojiSelect}
                    handleDailyRatingSubmit={handleDailyRatingSubmit}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const MoodSelection = ({
  firstName,
  selectedEmoji,
  handleEmojiSelect,
  handleDailyRatingSubmit,
}) => (
  <div className="text-center">
    <h2 className="text-2xl font-semibold">Hey, {firstName}</h2>
    <p className="mt-2 text-gray-600">
      How are you feeling today? Let us know — your vibe sets the tone for the
      day!
    </p>
    <div className="flex justify-around mt-5">
      {Object.keys(emojiMap).map((emojiKey) => (
        <button
          key={emojiKey}
          onClick={() => handleEmojiSelect(emojiKey)}
          className={`p-2 rounded ${
            selectedEmoji === emojiKey ? "border-4 border-blue-600" : ""
          }`}
        >
          <img
            src={emojiImages[emojiKey]}
            alt={emojiKey}
            className="w-12 h-12"
          />
        </button>
      ))}
    </div>
    <button
      className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      onClick={handleDailyRatingSubmit}
    >
      Submit
    </button>
  </div>
);

const ThankYouContent = ({ firstName, dailyRating, onClose }) => {
  const legend = {
    5: "You're unstoppable right now — keep that momentum going!",
    4: "Everything's smooth sailing. No worries here.",
    3: "It's one of those days. Time for a coffee break to reset.",
    2: "Feeling drained? A quick pause might do the trick.",
    1: "Tensions are high. Step away, take a breath — maybe a walk or a fresh playlist will help.",
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold">
        Thanks, {firstName}, for the Mood Meter! ✨
      </h2>
      <p className="mt-3 text-gray-600">{legend[dailyRating]}</p>
      <button
        className="mt-5 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
        onClick={onClose}
      >
        Ok Got it
      </button>
    </div>
  );
};
