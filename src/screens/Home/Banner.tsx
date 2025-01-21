import React, { useState, useEffect } from 'react';

const reactionsList = ["👍", "❤️", "🎉"];

const SectionCarousel = ({ title, data, subTitle }) => {
  const [reactions, setReactions] = useState({});
  const [activeReaction, setActiveReaction] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the currently displayed banner
  const [startX, setStartX] = useState(null);

  const handleReaction = (index, reaction) => {
    setActiveReaction(reaction);
    setReactions((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [reaction]: (prev[index]?.[reaction] || 0) + 1,
      },
    }));
  };

  // Auto-scroll functionality (optional, can be removed for manual swipe control)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex < data.length - 1) {
          return prevIndex + 1;
        } else {
          return 0; // Loop back to the first item
        }
      });
    }, 3000); // Change banner every 3 seconds

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [data.length]);

  // Handle touch start for swipe gesture
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  // Handle touch move and swipe gesture logic
  const handleTouchMove = (e) => {
    if (!startX) return;

    const currentX = e.touches[0].clientX;
    if (startX - currentX > 50) {
      // Swipe left
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, data.length - 1));
      setStartX(null);
    } else if (currentX - startX > 50) {
      // Swipe right
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      setStartX(null);
    }
  };

  return (
    <div className="mb-5">
      <h2 className="text-2xl font-semibold text-black text-left">{title}</h2>
      <p className="text-xs font-normal text-gray-700 mt-1">{subTitle}</p>
      <div className="mt-2 w-full overflow-hidden">
        <div
          className="flex justify-start items-center relative transition-transform duration-300"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`, // Move the carousel items horizontally
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {data.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-48 bg-gray-300 rounded-xl"
            >
              <img
                src={item.image}
                alt={`carousel-item-${index}`}
                className="h-full w-full rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots to show current carousel index */}
      <div className="flex justify-center items-center mt-2">
        {data.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full mx-1 cursor-pointer ${
              currentIndex === index ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)} // Navigate to clicked dot
          ></div>
        ))}
      </div>

      <div className="flex flex-row items-center w-full mt-2">
        {reactionsList.map((reaction, reactionIndex) => (
          <button
            key={reactionIndex}
            className={`p-2 rounded-full bg-transparent border-none cursor-pointer ${
              activeReaction === reaction ? 'transform scale-125' : ''
            }`}
            onClick={() => handleReaction(0, reaction)}
          >
            <span className="text-lg text-red-500">{reaction}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const Banners = ({ bannerData }) => (
  <div className="flex flex-col items-center mt-2">
    {bannerData.map((section, index) => (
      <SectionCarousel
        key={index}
        title={section.title}
        data={section.data}
        subTitle={section.subtitle}
      />
    ))}
  </div>
);

export default Banners;
