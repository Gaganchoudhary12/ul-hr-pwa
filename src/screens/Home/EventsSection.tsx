import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventList from '../../components/molecules/EventList/EventList.tsx';

const EventsSection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col mx-4 pb-5 mt-4">
      <h2 className="text-xl font-semibold text-gray-800 text-left">The Monthly Roundup</h2>
      <p className="text-sm font-normal mt-1 text-gray-800 leading-5">
        Stay in the loop—celebrate milestones and key updates in this month’s Event Calendar!
      </p>
      <EventList onPressViewMore={() => navigate('/events')} />
    </div>
  );
};

export default EventsSection;
