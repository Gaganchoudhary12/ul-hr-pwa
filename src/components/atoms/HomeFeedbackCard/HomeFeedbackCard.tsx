import React, { useState, useEffect } from "react";
import StarRating from "react-star-rating-component";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Suggestion } from "../../../assets/suggestion.svg";
import { ReactComponent as Complaint } from "../../../assets/complaint.svg";
import { ReactComponent as Feedback } from "../../../assets/feedback.svg";
import { ReactComponent as LeaderBoard } from "../../../assets/leaderBoard.svg";
import { useFeedbackSubmit } from "../../../services/feedbackSubmit.ts";
import { useFeedbackQuestions } from "../../../services/feedbackQuestions.ts";

const HomeFeedbackCard = () => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [comment, setComment] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestionComments, setSuggestionComments] = useState("");
  const [complaintComments, setComplaintComments] = useState("");
  const [feedbackQuestions, setFeedBackQuestions] = useState({});
  const history = useNavigate();
  const { feedBackQuestions } = useFeedbackQuestions();
  const { feedbackSubmit } = useFeedbackSubmit();
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const fetchFeedBackQuestion = async () => {
      const { data, isError } = await feedBackQuestions();
      if (!isError && data) setFeedBackQuestions(data);
      else console.error("Error fetching question:", isError);
    };
    fetchFeedBackQuestion();
  }, []);

  useEffect(() => {
    const checkDailyMoodSubmitted = async () => {
      try {
        const storedDate = await localStorage.getItem("dailyMoodSubmittedDate");
        const today = new Date().toISOString().split("T")[0];
        setFormVisible(storedDate !== today);
      } catch (error) {
        console.error("Error checking daily mood submission:", error);
      }
    };

    checkDailyMoodSubmitted();
  }, [feedBackQuestions]);

  useEffect(() => {
    if (modalVisible) {
      // Disable background scroll when modal is visible
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable background scroll when modal is closed
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalVisible]);

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetFormStates();
    setShowThankYou(false);
  };

  const handleModalSubmit = async () => {
    setIsSubmitting(true);
    let response;

    const commentToSubmit =
      modalType === "feedback"
        ? comment
        : modalType === "suggestion"
        ? suggestionComments
        : complaintComments;

    if (!commentToSubmit.trim()) {
      setIsSubmitting(false);
      return;
    }

    response = await feedbackSubmit(
      modalType,
      commentToSubmit,
      modalType === "feedback"
        ? selectedRating
          ? selectedRating
          : 1
        : undefined
    );
    const { isError } = response;
    console.log(response);

    if (!isError) {
      setShowThankYou(true);
    } else {
      console.log("Error on submit:", isError);
    }

    setIsSubmitting(false);
  };

  const resetFormStates = () => {
    setSuggestionComments("");
    setComplaintComments("");
    setComment("");
    setSelectedRating(null);
    setWordCount(0);
  };

  const handleTextChange = (text, type) => {
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    if (type === "suggestion") setSuggestionComments(text);
    else if (type === "complaint") setComplaintComments(text);
    else setComment(text);
  };

  const isSubmitDisabled = () => {
    const commentToCheck =
      modalType === "feedback"
        ? comment
        : modalType === "suggestion"
        ? suggestionComments
        : complaintComments;
    return !commentToCheck.trim();
  };

  return (
    <>
      <div
        className="flex gap-4 px-0 py-2 overflow-x-auto scrollbar-none"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        <div
          className="flex-shrink-0 bg-white rounded-lg p-4 text-center cursor-pointer border border-gray-300 flex flex-col items-center justify-center"
          style={{ width: "33.33%" }} // Set equal width for each box
          onClick={() => openModal("suggestion")}
        >
          <Suggestion width={24} height={24} />
          <p className="text-xs font-semibold text-gray-600 mt-2">
            Suggestion Box
          </p>
        </div>
        <div
          className="flex-shrink-0 bg-white rounded-lg p-4 text-center cursor-pointer border border-gray-300 flex flex-col items-center justify-center"
          style={{ width: "33.33%" }}
          onClick={() => openModal("complaint")}
        >
          <Complaint width={24} height={24} />
          <p className="text-xs font-semibold text-gray-600 mt-2">
            Complaint Box
          </p>
        </div>
        <div
          className="flex-shrink-0 bg-white rounded-lg p-4 text-center cursor-pointer border border-gray-300 flex flex-col items-center justify-center"
          style={{ width: "33.33%" }}
          onClick={() => openModal("feedback")}
        >
          <Feedback width={24} height={24} />
          <p className="text-xs font-semibold text-gray-600 mt-2">Feedback</p>
        </div>
        <div
          className="flex-shrink-0 bg-white rounded-lg p-4 text-center cursor-pointer border border-gray-300 flex flex-col items-center justify-center"
          style={{ width: "33.33%" }}
          onClick={() => history("/leaderboard")}
        >
          <LeaderBoard width={24} height={24} />
          <p className="text-xs font-semibold text-gray-600 mt-2">
            Leader Board
          </p>
        </div>
      </div>

      {modalVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-lg w-full mx-3"
            onClick={(e) => e.stopPropagation()}
          >
            {!showThankYou ? (
              <>
                <h3 className="text-center text-sm font-bold mb-4">
                  {modalType === "complaint"
                    ? "Got a gripe? Let’s hear so we can fix it!"
                    : modalType === "suggestion"
                    ? "Have a suggestion? We’re all ears!"
                    : "Got Ideas, Thoughts, or Kudos? Drop Em Here!"}
                </h3>
                {modalType === "feedback" ? (
                  <div>
                    <h4 className="font-semibold mb-2 text-xs">
                      {feedbackQuestions?.question}
                    </h4>
                    {feedbackQuestions?.question && (
                      <StarRating
                        name="feedbackRating"
                        starCount={5}
                        value={selectedRating}
                        onStarClick={(nextValue) =>
                          setSelectedRating(nextValue)
                        }
                      />
                    )}
                    <textarea
                      className="w-full h-36 p-2 border border-gray-300 rounded-lg mt-2 text-xs"
                      placeholder="Write freely! It's always anonymous!"
                      value={comment}
                      onChange={(e) =>
                        handleTextChange(e.target.value, "feedback")
                      }
                    />
                  </div>
                ) : (
                  <textarea
                    className="w-full h-36 p-2 border border-gray-300 rounded-lg text-xs"
                    placeholder="Write freely! It's always anonymous!"
                    value={
                      modalType === "suggestion"
                        ? suggestionComments
                        : complaintComments
                    }
                    onChange={(e) =>
                      handleTextChange(e.target.value, modalType)
                    }
                  />
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Word Limit</span>
                  <span className="text-xs font-semibold text-gray-800">
                    {wordCount}/100
                  </span>
                </div>
                <button
                  className={`mt-4 w-full px-4 py-2 rounded-lg text-xs text-white ${
                    isSubmitDisabled() || isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={handleModalSubmit}
                  disabled={isSubmitDisabled() || isSubmitting}
                >
                  Submit
                </button>
              </>
            ) : (
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">
                  {modalType === "suggestion"
                    ? "Thanks for Your Suggestion!"
                    : "Got Your Concern!"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {modalType === "suggestion"
                    ? "We appreciate your input and can't wait to put it into action! 🚀"
                    : "Your message is in, and we'll look into it soon. Thanks for letting us know!"}
                </p>
                <button
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  onClick={closeModal}
                >
                  OK, Got it
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HomeFeedbackCard;
