import React, { useState, useRef, useEffect } from "react";
import { DayPilot, DayPilotScheduler } from "daypilot-pro-react";

export const SchedulerRow = ({ row }) => {
  const style = {
    width: "10px",
    height: "10px",
    backgroundRepeat: "no-repeat",
    position: "absolute",
    top: "3px",
    cursor: "pointer",
  };
  return (
    <div
      className="scheduler_default_rowheader_inner_indent"
      style={{ marginLeft: "0px", position: "relative" }}
    >
      <div
        className="scheduler_default_tree_image_collapse"
        style={style}
        onClick={() => (row.data.expanded ? row.collapse() : row.expand())}
      ></div>
      <div
        className="scheduler_default_rowheader_inner_text"
        style={{ marginLeft: "15px" }}
      >
        {row.name}
      </div>
    </div>
  );
};

const Scheduler = () => {
  const [config] = useState({
    startDate: "2023-11-01",
    days: 31,
    scale: "Day",
    timeHeaders: [{ groupBy: "Month" }, { groupBy: "Day", format: "d" }],
    cellWidthSpec: "Auto",
    cellWidth: 50,
    durationBarVisible: false,
    treeEnabled: true,
    rowHeaderColumns: [
      { name: "Car" },
      { name: "Seats", display: "seats", width: 50 },
      { name: "Doors", display: "doors", width: 50 },
      { name: "Transmission", display: "transmission", width: 90 },
    ],
    onBeforeRowHeaderDomAdd: function (args) {
      if (args.row.level === 0) {
        args.target = "Cell";
        args.element = <SchedulerRow row={args.row} />;
      }
    },
    onEventMoved: (args) => {
      console.log(
        "Event moved: ",
        args.e.data.id,
        args.newStart,
        args.newEnd,
        args.newResource
      );
      getScheduler().message("Event moved: " + args.e.data.text);
    },
    onEventResized: (args) => {
      console.log(
        "Event resized: ",
        args.e.data.id,
        args.newStart,
        args.newEnd
      );
      getScheduler().message("Event resized: " + args.e.data.text);
    },
    onTimeRangeSelected: (args) => {
      DayPilot.Modal.prompt("New event name", "Event").then((modal) => {
        getScheduler().clearSelection();
        if (!modal.result) {
          return;
        }
        getScheduler().events.add({
          id: DayPilot.guid(),
          text: modal.result,
          start: args.start,
          end: args.end,
          resource: args.resource,
        });
      });
    },
    onBeforeEventRender: (args) => {
      if (!args.data.backColor) {
        args.data.backColor = "#93c47d";
      }
      args.data.borderColor = "darker";
      args.data.fontColor = "white";

      args.data.areas = [];
      if (args.data.locked) {
        args.data.areas.push({
          right: 4,
          top: 8,
          height: 18,
          width: 18,
          symbol: "icons/daypilot.svg#padlock",
          fontColor: "white",
        });
      } else if (args.data.plus) {
        args.data.areas.push({
          right: 4,
          top: 8,
          height: 18,
          width: 18,
          symbol: "icons/daypilot.svg#plus-4",
          fontColor: "white",
        });
      }
    },
  });

  const schedulerRef = useRef();

  const getScheduler = () => schedulerRef.current.control;

  const loadData = (args) => {
    const resources = [
      {
        name: "Convertible",
        id: "G2",
        expanded: true,
        children: [
          {
            name: "MINI Cooper",
            seats: 4,
            doors: 2,
            transmission: "Automatic",
            id: "A",
          },
          {
            name: "BMW Z4",
            seats: 4,
            doors: 2,
            transmission: "Automatic",
            id: "B",
          },
          {
            name: "Ford Mustang",
            seats: 4,
            doors: 2,
            transmission: "Automatic",
            id: "C",
          },
          {
            name: "Mercedes-Benz SL",
            seats: 2,
            doors: 2,
            transmission: "Automatic",
            id: "D",
          },
        ],
      },
      {
        name: "SUV",
        id: "G1",
        expanded: true,
        children: [
          {
            name: "BMW X1",
            seats: 5,
            doors: 4,
            transmission: "Automatic",
            id: "E",
          },
          {
            name: "Jeep Wrangler",
            seats: 5,
            doors: 4,
            transmission: "Automatic",
            id: "F",
          },
          {
            name: "Range Rover",
            seats: 5,
            doors: 4,
            transmission: "Automatic",
            id: "G",
          },
        ],
      },
    ];

    const events = [
      {
        id: 101,
        text: "Reservation 101",
        start: "2023-11-02T00:00:00",
        end: "2023-11-05T00:00:00",
        resource: "A",
      },
      {
        id: 102,
        text: "Reservation 102",
        start: "2023-11-06T00:00:00",
        end: "2023-11-10T00:00:00",
        resource: "A",
      },
      {
        id: 103,
        text: "Reservation 103",
        start: "2023-11-03T00:00:00",
        end: "2023-11-10T00:00:00",
        resource: "C",
        backColor: "#6fa8dc",
        locked: true,
      },
      {
        id: 104,
        text: "Reservation 104",
        start: "2023-11-02T00:00:00",
        end: "2023-11-08T00:00:00",
        resource: "E",
        backColor: "#f6b26b",
        plus: true,
      },
      {
        id: 105,
        text: "Reservation 105",
        start: "2023-11-03T00:00:00",
        end: "2023-11-09T00:00:00",
        resource: "G",
      },
      {
        id: 106,
        text: "Reservation 106",
        start: "2023-11-02T00:00:00",
        end: "2023-11-07T00:00:00",
        resource: "B",
      },
    ];

    getScheduler().update({
      resources,
      events,
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return <DayPilotScheduler {...config} ref={schedulerRef} />;
};

export default Scheduler;
