import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);
dayjs.locale("fr");

function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [view, setView] = useState("week");

  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem("calendarEvents");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const goToToday = () => setCurrentDate(dayjs());
  const goToPrevious = () =>
    setCurrentDate(prev => view === "month" ? prev.subtract(1, "month") : prev.subtract(1, "week"));
  const goToNext = () =>
    setCurrentDate(prev => view === "month" ? prev.add(1, "month") : prev.add(1, "week"));

  const addEvent = (dateOrDayIndex, hour = null) => {
    const title = prompt("Titre de l'événement :");
    if (title) {
      let eventDate;

      if (view === "week") {
        const startOfWeek = currentDate.startOf("isoWeek");
        eventDate = startOfWeek.add(dateOrDayIndex, "day").hour(hour).minute(0);
      } else {
        eventDate = dateOrDayIndex;
      }

      setEvents([...events, { title, date: eventDate.toISOString() }]);
    }
  };

  const handleEventClick = (eventToEdit) => {
    const action = prompt(
      `Modifier l'événement :\n- Laisser vide pour supprimer\n- Ou entrer un nouveau titre`,
      eventToEdit.title
    );
    if (action === null) return;

    if (action === "") {
      setEvents(events.filter(ev => !(ev.title === eventToEdit.title && ev.date === eventToEdit.date)));
    } else {
      setEvents(events.map(ev =>
        ev.title === eventToEdit.title && ev.date === eventToEdit.date
          ? { ...ev, title: action }
          : ev
      ));
    }
  };

  const renderWeekView = () => {
    const startOfWeek = currentDate.startOf("isoWeek");
    const days = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <>
        {/* En-tête : jours */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-gray-100 font-semibold text-center border-b">
          <div></div>
          {days.map((day, idx) => {
            const isToday = day.isSame(dayjs(), "day");
            return (
              <div
                key={idx}
                className={`p-2 border-b ${isToday ? "bg-blue-200 text-blue-900" : ""}`}
              >
                {day.format("dddd D")}
              </div>
            );
          })}
        </div>

        {/* Grille horaire */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] border-l border-b bg-white">
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="border-t border-r p-2 text-sm text-right pr-2">
                {hour}h
              </div>
              {days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="border-t border-r h-16 relative hover:bg-blue-50 cursor-pointer"
                  onClick={() => addEvent(dayIndex, hour)}
                >
                  {events
                    .filter(e => {
                      const eventDate = dayjs(e.date);
                      return eventDate.isSame(day, "day") && eventDate.hour() === hour;
                    })
                    .map((e, i) => (
                      <div
                        key={i}
                        className="absolute left-1 right-1 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow cursor-pointer"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleEventClick(e);
                        }}
                      >
                        {e.title}
                      </div>
                    ))}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </>
    );
  };

  const renderMonthView = () => {
    const startOfMonth = currentDate.startOf("month");
    const startDate = startOfMonth.startOf("isoWeek");
    const days = Array.from({ length: 42 }, (_, i) => startDate.add(i, "day"));

    return (
      <>
        <div className="grid grid-cols-7 border-b font-semibold text-center">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <div key={day} className="border p-2 bg-gray-100">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 divide-x border bg-white">
          {days.map((date, idx) => {
            const isCurrentMonth = date.month() === currentDate.month();
            const isToday = date.isSame(dayjs(), "day");

            return (
              <div
                key={idx}
                className={`border-r p-2 min-h-[120px] hover:bg-blue-50 cursor-pointer ${
                  !isCurrentMonth ? "bg-gray-100 text-gray-400" : ""
                } ${isToday ? "bg-blue-100" : ""}`}
                onClick={() => addEvent(date)}
              >
                <div className="font-bold text-sm">{date.format("D")}</div>
                {events
                  .filter(e => dayjs(e.date).isSame(date, "day"))
                  .map((e, i) => (
                    <div
                      key={i}
                      className="mt-1 text-xs bg-blue-500 text-white px-2 py-1 rounded cursor-pointer"
                      onClick={(eClick) => {
                        eClick.stopPropagation();
                        handleEventClick(e);
                      }}
                    >
                      {e.title}
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4">
      {/* En-tête */}
      <div className="flex justify-between items-center px-6 py-3 border-b bg-white shadow-md rounded-lg mb-4">
        <button onClick={goToPrevious} className="px-4 py-2 border rounded-full">◀</button>
        <button onClick={goToToday} className="px-4 py-2 border rounded-full">Aujourd'hui</button>
        <button onClick={goToNext} className="px-4 py-2 border rounded-full">▶</button>
        <h2 className="text-lg font-semibold">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="px-4 py-2 border rounded-full"
        >
          <option value="week">Semaine</option>
          <option value="month">Mois</option>
        </select>
      </div>

      {/* Vue dynamique */}
      {view === "week" ? renderWeekView() : renderMonthView()}
    </div>
  );
}

export default EventCalendar;
