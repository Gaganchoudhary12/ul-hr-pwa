import React from 'react';
import HeaderWithBackButton from '../../components/organism/HeaderWithBackButton.tsx/HeaderWithBackButton.tsx';
import { useLocation } from 'react-router-dom';

const EventsDescription = () => {
  const location = useLocation();
  const { image, title, description } = location.state;
 
  return (
    <>
      <HeaderWithBackButton title="About Event" />
      <div className="flex flex-col mt-[-10px] pb-10 pt-7 bg-white rounded-t-2xl">
        <p className="text-center text-lg font-semibold text-black">{title}</p>
        <div className="flex justify-center my-4 mx-1 w-[360px] mx-auto">
          <img src={image} alt={title} className="h-[200px] w-[350px]" />
        </div>
        <p className="text-center text-base font-normal text-black">{description}</p>
      </div>
    </>
  );
};

export default EventsDescription;
