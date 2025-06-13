import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import './CalenderUI.css'; // Your custom CSS styles
import 'react-calendar/dist/Calendar.css';
import './CalTheme.css'; // Custom theme styles
import './Compose.css'

import deleteIcon from '../assets/delete.png'
import composeIcon from '../assets/pen.svg';
import './fontCss.css'; // Custom font styles

// --- API Configuration ---
const API_BASE_URL = 'http://127.0.0.1:8000'; // FastAPI backend URL

// --- Utility Functions for API Calls (Simplified) ---
const api = {
  // Helper to handle API responses
  handleResponse: async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    // Handle 204 No Content for DELETE
    if (response.status === 204) {
      return null;
    }
    return response.json();
  },

  // Fetch events for a specific date/month/year
  fetchEvents: async (dateParams) => {
    const params = new URLSearchParams(dateParams);
    const response = await fetch(`${API_BASE_URL}/events/?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return api.handleResponse(response);
  },

  // Create an event
  createEvent: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    return api.handleResponse(response);
  },

  // Update an event
  updateEvent: async (eventId, eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    return api.handleResponse(response);
  },

  // Delete an event
  deleteEvent: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'DELETE',
    });
    return api.handleResponse(response);
  }
};

function Calender() {
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]); // All events for the current month/year
  const [eventsOnSelectedDate, setEventsOnSelectedDate] = useState([]); // Events specifically on the selected date

  const [showEventModal, setShowEventModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null); // For editing, null for adding
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');

  // --- Event Fetching ---
  const fetchMonthEvents = useCallback(async (dateToFetch) => {
    try {
      const month = dateToFetch.getMonth() + 1; // getMonth is 0-indexed
      const year = dateToFetch.getFullYear();
      const fetchedEvents = await api.fetchEvents({ month, year });
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error.message);
      setErrorMessage("Error fetching events: " + error.message);
    }
  }, []); // No authentication dependency needed

  useEffect(() => {
    fetchMonthEvents(selectedDate);
  }, [selectedDate, fetchMonthEvents]);

  // Filter events for the selected date
  useEffect(() => {
    const formattedSelectedDate = selectedDate.toISOString().split('T')[0];
    const dailyEvents = events.filter(event =>
      event.event_date === formattedSelectedDate
    ).sort((a, b) => {
      // Sort events by start time
      const timeA = a.start_time ? new Date(a.start_time).getTime() : 0;
      const timeB = b.start_time ? new Date(b.start_time).getTime() : 0;
      return timeA - timeB;
    });
    setEventsOnSelectedDate(dailyEvents);
  }, [selectedDate, events]);

  // --- Event Modal & CRUD Handlers ---
  const openAddEventModal = () => {
    setCurrentEvent(null); // No event to edit
    setEventTitle('');
    setEventDescription('');
    setEventStartTime('');
    setEventEndTime('');
    setShowEventModal(true);
  };

  const openEditEventModal = (event) => {
    setCurrentEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description || '');
    // Format datetime strings for input fields (e.g., "14:30")
    setEventStartTime(event.start_time ? new Date(event.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }) : '');
    setEventEndTime(event.end_time ? new Date(event.end_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }) : '');
    setShowEventModal(true);
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setCurrentEvent(null);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const eventData = {
      title: eventTitle,
      description: eventDescription,
      event_date: selectedDate.toISOString().split('T')[0], //YYYY-MM-DD
      // Combine selectedDate with time inputs to form full ISO 8601 strings
      start_time: eventStartTime ? `${selectedDate.toISOString().split('T')[0]}T${eventStartTime}:00Z` : null, // Add Z for UTC
      end_time: eventEndTime ? `${selectedDate.toISOString().split('T')[0]}T${eventEndTime}:00Z` : null,     // Add Z for UTC
    };

    try {
      if (currentEvent) {
        await api.updateEvent(currentEvent.id, eventData);
        alert('Event updated successfully!');
      } else {
        await api.createEvent(eventData);
        alert('Event created successfully!');
      }
      fetchMonthEvents(selectedDate); // Re-fetch events for the month
      closeEventModal();
    } catch (error) {
      setErrorMessage("Error saving event: " + error.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setErrorMessage('');
      try {
        await api.deleteEvent(eventId);
        alert('Event deleted successfully!');
        fetchMonthEvents(selectedDate); // Re-fetch events for the month
      } catch (error) {
        setErrorMessage("Error deleting event: " + error.message);
      }
    }
  };

  // Function to render dots on calendar tiles for dates with events
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = date.toISOString().split('T')[0];
      const eventsForTile = events.filter(event => event.event_date === formattedDate);
      return (
        <div style={{ position: 'absolute', bottom: '5px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          {eventsForTile.length > 0 && <span className=""></span>}
          {eventsForTile.slice(0,1).map(event => ( // Show first event title for brevity
            <span key={event.id} className="event-tile-title">{event.title}</span>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="app-container">
    

      {errorMessage && (
        <div className="error-message" role="alert">
          <strong>Error!</strong>
          <span> {errorMessage}</span>
          <span className="close-button" onClick={() => setErrorMessage('')}>
            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.697l-2.651 3.152a1.2 1.2 0 1 1-1.697-1.697L8.303 10 5.152 7.348a1.2 1.2 0 0 1 1.697-1.697L10 8.303l2.651-3.152a1.2 1.2 0 1 1 1.697 1.697L11.697 10l3.152 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}

      <div className="authenticated-layout"> {/* This layout is now always shown */}
  

        <div className="calendar-events-grid">
          {/* Calendar Section */}
          <div className="calendar-section">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              onClickMonth={(value) => fetchMonthEvents(value)}
              onActiveStartDateChange={({ activeStartDate, view }) => {
                  if (view === 'month') {
                      fetchMonthEvents(activeStartDate);
                  }
              }}
              tileContent={tileContent}
            />
          </div>

          {/* Event List Section */}
          <div className="events-section">
            <h3>Events on {selectedDate.toDateString()}</h3>
            <button
              onClick={openAddEventModal}
              className="add-event-button"
            >
              Add New Event
            </button>

            {eventsOnSelectedDate.length === 0 ? (
              <p className="no-events">No events for this date.</p>
            ) : (
              <ul className="events-list">
                {eventsOnSelectedDate.map(event => (
                  <li key={event.id}>
                    <div className="event-item-header">
                      <div>
                        <h4>{event.title}</h4>
                        {event.start_time && event.end_time ? (
                          <p className="event-time">
                            {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })} -
                            {new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}
                          </p>
                        ) : event.start_time ? (
                          <p className="event-time">
                              Starts: {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}
                          </p>
                        ) : null}
                      </div>
                      <div className="event-actions">
                        <button onClick={() => openEditEventModal(event)}> <img src={composeIcon} alt="Edit" className="edit-btn"  /> </button>
                        <button className="delete-btn" onClick={() => handleDeleteEvent(event.id)}> <img src={deleteIcon} alt="Delete"  className="delete-btn"  /> </button>
                      </div>
                    </div>
                    {event.description && (
                      <p className="event-description">{event.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{currentEvent ? 'Edit Event' : 'New Event'}</h3>
            <form onSubmit={handleSaveEvent} className="modal-form">
              <div>
                {/* <label htmlFor="event-title" >Title:</label> */}
                <input
                  id="event-title"
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className='aoT border-bottom'
                  placeholder="Title"
                  required
                />
              </div>
              <div>
                {/* <label htmlFor="event-description">Description:</label> */}
                <textarea
                  id="event-description"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  rows="3"
                  placeholder="Description"
                  className='aoT'
                ></textarea>
              </div>
              <div>
                <label htmlFor="event-start-time">Start Time:</label>
                <input
                  id="event-start-time"
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="event-end-time">End Time:</label>
                <input
                  id="event-end-time"
                  type="time"
                  value={eventEndTime}
                  onChange={(e) => setEventEndTime(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeEventModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {currentEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calender;
