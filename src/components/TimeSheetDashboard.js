import React, { useState } from 'react';
import moment from 'moment';
import './TimeSheetDashboard.css';
import axios from 'axios';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [calendar, setCalendar] = useState(generateCalendar(currentDate));
  const [selectedDay, setSelectedDay] = useState(null);
  const [workDetails, setWorkDetails] = useState('');
  const [thankYou, setThankYou] = useState(false);
  const [viewWork, setViewWork] = useState(false);
  const [userProfile] = useState({
    name: 'savi',
    profilePic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzg5N686jvlIDt6ZXHyk1yvDPAYQ48Kjrxsw&s',
  });

  function generateCalendar(date) {
    const daysInMonth = date.daysInMonth();
    const startDay = date.startOf('month').day();
    const endDay = date.endOf('month').day();
    const previousMonthDays = Array.from(
      { length: startDay },
      (_, i) => date.clone().subtract(1, 'months').daysInMonth() - startDay + i + 1
    );
    const nextMonthDays = Array.from({ length: 6 - endDay }, (_, i) => i + 1);
    const daysArray = [
      ...previousMonthDays.map((day) => ({ day, status: 'greyedOut' })),
      ...Array.from({ length: daysInMonth }).map((_, i) => ({
        day: i + 1,
        status: 'notFilled',
        displayText: '',
      })),
      ...nextMonthDays.map((day) => ({ day, status: 'greyedOut' })),
    ];
    return daysArray;
  }

  const changeMonth = (direction) => {
    const newDate = currentDate.clone().add(direction, 'months');
    setCurrentDate(newDate);
    setCalendar(generateCalendar(newDate));
  };

  const handleDateClick = (index) => {
    if (calendar[index].status !== 'greyedOut') {
      setSelectedDay(index);
    }
  };

  const handleWorkSubmit = () => {
    const updatedCalendar = [...calendar];
    updatedCalendar[selectedDay].workDetails = workDetails;
    updatedCalendar[selectedDay].status = 'filled';

    setCalendar(updatedCalendar);

    saveToJSON({
      date: currentDate.clone().date(updatedCalendar[selectedDay].day).format('YYYY-MM-DD'),
      workDetails,
    });

    setSelectedDay(null);
    setWorkDetails('');
    setThankYou(true);
    setTimeout(() => {
      setThankYou(false);
    }, 1000);
  };

  const saveToJSON = async (task) => {
    try {
      const response = await axios.post('http://localhost:3000/tasks', task, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Task saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const statusColors = {
    filled: '#4caf50',
    notFilled: '#C9E6F0',
    greyedOut: '#FB4141',
  };

  const absenceDays = calendar.filter((day) => day.status === 'notFilled').length;
  const completedTargets = calendar.filter((day) => day.status === 'filled').length;
  const completedTargetsInMonth = calendar.filter(
    (day) =>
      day.status === 'filled' &&
      currentDate.clone().date(day.day).month() === currentDate.month()
  ).length;
  return (
    <div className="calendar-container">
      {!viewWork ? (
        <>
          <div className="calendar-header">
            <button onClick={() => changeMonth(-1)}>&lt;</button>
            <h2>{currentDate.format('MMMM YYYY')}</h2>
            <button onClick={() => changeMonth(1)}>&gt;</button>
          </div>
          <div className="calendar">
            {weekdays.map((weekday) => (
              <div key={weekday} className="calendar-cell weekday">
                {weekday}
              </div>
            ))}
            {calendar.map((day, index) => (
              <div
                key={index}
                className={`calendar-cell ${day.status}`}
                onClick={() => handleDateClick(index)}
                style={{
                  backgroundColor: statusColors[day.status],
                }}
              >
                {day.day}
                {day.displayText && <div className="display-text">{day.displayText}</div>}
              </div>
            ))}
          </div>
          <button className="view-work-button" onClick={() => setViewWork(true)}>
            Check Work Details
          </button>
          {selectedDay !== null && (
            <div className="modal">
              <div className="modal-content">
                <h3>Update Work Details</h3>
                <textarea
                  value={workDetails}
                  onChange={(e) => setWorkDetails(e.target.value)}
                  placeholder="Enter your work details"
                />
                <button onClick={handleWorkSubmit}>Submit</button>
                <button onClick={() => setSelectedDay(null)}>Cancel</button>
              </div>
            </div>
          )}
          {thankYou && (
            <div className="thank-you">
              <h2>Thank You!</h2>
            </div>
          )}
        </>
      ) : (
        <div className="work-details-view">
          <h2>Work Details</h2>
          <div className="user-profile">
            <h3>User Profile</h3>
            <img
              src={userProfile.profilePic}
              alt="User Profile"
              className="profile-pic"
            />
            <p>
              <strong>Name:</strong> {userProfile.name}
            </p>
          </div>
          <div className="summary-boxes">
            <div className="summary-box">
              <h4>Days Present</h4>
              <p>{completedTargets}</p>
            </div>
            <div className="summary-box">
              <h4>Days Absent</h4>
              <p>{absenceDays}</p>
            </div>
            <div className="summary-box">
              <h4>Target Month</h4>
              <p>{completedTargetsInMonth}</p>
            </div>
          </div>
          <table className="details-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {calendar
                .filter((day) => day.workDetails)
                .map((day, index) => (
                  <tr key={index}>
                    <td>{currentDate.clone().date(day.day).format('YYYY-MM-DD')}</td>
                    <td>{day.workDetails}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button className="back-button" onClick={() => setViewWork(false)}>
            Back to Calendar
          </button>
        </div>
      )}
    </div>
  );
  
};

export default Calendar;
