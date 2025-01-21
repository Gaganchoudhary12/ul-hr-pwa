import React, { useState, useEffect, useContext } from "react";
import DownIcon from "../../assets/down_icon.svg"; // Assuming the icon is available for web as well
import DepartmentModal from "./DepartmentModal.tsx";
import { useIdeaSubmit } from "../../services/ideasSubmit.ts";
import { UserContext } from "../../state/UserProvider.js";
import HeaderWithBackButton from "../../components/organism/HeaderWithBackButton.tsx/HeaderWithBackButton.tsx";

const Idea = () => {
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  const [ideas, setIdeas] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const { ideaSubmit } = useIdeaSubmit();
  const { user } = useContext(UserContext);

  const departments = [
    { id: 1, name: "Technology" },
    { id: 2, name: "Human Resource" },
    { id: 3, name: "Sales" },
    { id: 4, name: "Business Development" },
    { id: 5, name: "Product" },
    { id: 6, name: "Digital Marketing" },
    { id: 7, name: "Others" },
  ];

  useEffect(() => {
    setIsSubmitDisabled(!selectedDepartments.length || ideas.trim() === "");
  }, [selectedDepartments, ideas]);

  const handleSubmit = async () => {
    const selectedDepartment = selectedDepartments[0];
    const { data, isError } = await ideaSubmit(
      user.email,
      selectedDepartment,
      ideas
    );
    if (!selectedDepartments.length) {
      alert("Error: No departments selected.");
      return;
    }
    if (data && !isError) {
      alert(
        "Thanks for your idea! We’ll review it soon.The best idea of the month wins a prie, so keep those ideas flowing!"
      );
      setSelectedDepartments([]);
      setIdeas("");
      setWordCount(0);
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const selectEmployee = (department) => {
    setSelectedDepartments([department]);
    toggleModal();
  };

  const handleTextChange = (text) => {
    setIdeas(text);
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
  };

  return (
    <>
      <HeaderWithBackButton title="Idea" />
      <div className="flex flex-col pt-2 bg-white rounded-3xl px-6">
        <div className="flex items-center justify-between p-4 rounded-md bg-[#D9ECFF] w-full h-[120px] my-6 self-center">
          <div className="max-w-[171px]">
            <h2 className="text-[#333333] text-sm font-normal">
              The Innovation Hub
            </h2>
            <p className="text-[#333333] text-sm font-semibold">
              Your space to share ideas that drive change.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="https://cdn.universityliving.com/files/1729769428545amazoncard.webp"
              alt="Innovation"
              className="w-[120px] h-[118px]"
            />
          </div>
        </div>

        <div className="relative z-10">
          <div className="my-5 cursor-pointer" onClick={toggleModal}>
            <div className="relative w-full">
              <label className="absolute top-[-8px] left-2 text-xs text-[#7B7A80] bg-white px-1">
                Select Department
              </label>
              <div className="h-[52px] border border-[#E8E8E8] rounded-lg bg-white px-5 py-3 text-[#AEAEBC] text-base font-semibold w-full">
                <p className="placeholder">Eg product</p>
              </div>
              <div className="absolute right-4 top-4 cursor-pointer">
                <img src={DownIcon} alt="Down Icon" width={24} height={24} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap">
            {selectedDepartments.map((dept, index) => (
              <div
                key={index}
                className={`flex items-center bg-#D9ECFF rounded-3xl px-4 py-1 mr-2 mb-2 border ${
                  index === 0
                    ? "bg-[#D9ECFF] border-[#1E90FF]"
                    : "border-[#DCDCDC]"
                }`}
              >
                <p
                  className={`text-lg font-normal ${
                    index === 0 ? "text-[#0D0C10]" : "text-[#333333]"
                  }`}
                >
                  {dept}
                </p>
              </div>
            ))}
          </div>
        </div>

        {selectedDepartments.length > 0 && (
          <div className="mt-8 w-full">
            <h3 className="text-sm font-semibold text-[#333333]">
              What’s your idea?
            </h3>
            <textarea
              className="w-full h-[120px] border border-[#E8E8E8] rounded-lg mt-3 p-3 text-base text-[#333333]"
              value={ideas}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Share your ideas"
            />
            <div className="flex justify-between mt-2">
              <p className="text-xs text-[#AEAEB2]">Word Limit</p>
              <p className="text-xs text-[#333333]">{wordCount}/100</p>
            </div>
          </div>
        )}

        <button
          className={`bg-[#007AFF] text-white font-semibold text-lg py-3 rounded-lg w-full mt-6 cursor-pointer ${
            isSubmitDisabled ? "bg-[#A9A9A9] cursor-not-allowed" : ""
          }`}
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          {selectedDepartments.length > 0
            ? `Submit idea for ${selectedDepartments[0]}`
            : "Submit"}
        </button>

        <DepartmentModal
          visible={modalVisible}
          onClose={toggleModal}
          departments={departments}
          selectedValue={selectedDepartments}
          selectEmployee={selectEmployee}
        />
      </div>
    </>
  );
};

export default Idea;
