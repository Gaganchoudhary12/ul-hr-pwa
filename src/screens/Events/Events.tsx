import React from 'react';
import EventList from '../../components/molecules/EventList/EventList.tsx';
import HeaderWithBackButton from '../../components/organism/HeaderWithBackButton.tsx/HeaderWithBackButton.tsx';

const Events = () => {
  return (
    <div className="flex flex-col p-5 bg-white rounded-2xl mt-[-20px] pb-10">
      <HeaderWithBackButton title="EVENTS" />
      <div className="flex-1 mt-[-32px]">
        <EventList showAll={true} />
      </div>
    </div>
  );
};

export default Events;
