import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../../services/events.ts';
import NoEvents from '../../../assets/noEventsImage.png';

const formatDateForBox = (dateString) => {
  const options = { day: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const formatDateForSubtitle = (dateString) => {
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const EventList = ({ showAll = false, onPressViewMore }) => {
  const history = useNavigate();
  const { getEvents } = useEvents();
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('upcoming');

  const fetchEvents = async () => {
    try {
      const { data, isError } = await getEvents();
      if (isError) throw new Error('Error fetching events');

      const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEventsData(sortedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center">Error: {error}</div>;
  }

  const today = new Date().setHours(0, 0, 0, 0);
  const upcomingEvents = eventsData.filter((event) => new Date(event.date) >= today);
  const pastEvents = eventsData.filter((event) => new Date(event.date) < today);

  const dataToShow =
    tab === 'upcoming'
      ? showAll
        ? upcomingEvents
        : upcomingEvents.slice(0, 5)
      : pastEvents;

  const renderItem = (item) => (
    <div
      className="flex items-center mb-4 p-4 h-20 rounded border border-gray-200 bg-white cursor-pointer"
      onClick={() =>
        history('/events-description', {
          state: {
            title: item.title,
            description: item.description,
            image: item.image,
          },
        })
      }
    >
      <div className="flex items-center justify-center w-10 h-10 bg-orange-100 text-orange-700 text-sm font-bold text-center">
        {formatDateForBox(item.date)}
      </div>
      <div className="ml-5 flex-1">
        <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
        <p className="text-xs font-semibold text-gray-600 mt-1">On {formatDateForSubtitle(item.date)}</p>
      </div>
    </div>
  );

  const noEventsView = (
    <div className="text-center my-5">
      <img
        src="https://cdn.universityliving.com/files/17297684915983dtrophycupwithfloatinggiftheartgeometricshapespurplebackgroundcelebrationwinn-1.webp"
        alt="No events"
        className="mx-auto w-40 h-44"
      />
      <p className="text-sm text-gray-700 mt-3">
        {tab === 'upcoming'
          ? "No events this month, but stay tuned! We're planning some exciting ones just for you."
          : "No past events found for this month, but stay tuned! We're planning some exciting ones just for you."}
      </p>
    </div>
  );

  return (
    <>
      <div className="flex justify-center gap-4 bg-gray-200 rounded-lg p-1 w-56 mx-auto mt-5 mb-5">
        <div
          className={`flex-1 text-center py-1 cursor-pointer rounded-md ${
            tab === 'upcoming' ? 'bg-white shadow' : ''
          }`}
          onClick={() => setTab('upcoming')}
        >
          <p className={`text-sm ${tab === 'upcoming' ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>Upcoming Events</p>
        </div>
        <div
          className={`flex-1 text-center py-1 cursor-pointer rounded-md ${
            tab === 'past' ? 'bg-white shadow' : ''
          }`}
          onClick={() => setTab('past')}
        >
          <p className={`text-sm ${tab === 'past' ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>Past</p>
        </div>
      </div>

      {dataToShow.length === 0 ? (
        noEventsView
      ) : (
        <div className="pb-5">
          {dataToShow.map(renderItem)}
        </div>
      )}

      {!showAll && tab === 'upcoming' && upcomingEvents.length > 5 && (
        <div
          className="flex items-center justify-center border border-blue-500 w-80 h-11 mx-auto rounded-lg mb-5 cursor-pointer"
          onClick={onPressViewMore}
        >
          <p className="text-blue-500 text-sm">View all events</p>
        </div>
      )}
    </>
  );
};

export default EventList;
