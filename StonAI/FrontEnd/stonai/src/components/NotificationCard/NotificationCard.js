import { milliseconds } from "date-fns";
import React, { useEffect, useState } from "react";
import Heading1 from "../../Reusable Components/Headings/Heading1";
import "./NotificationCard.css";
import { faList, faFileAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTasks } from "@fortawesome/free-solid-svg-icons";

function NotificationCard({ item }) {
  var datePrev = new Date(item.initiated_date);
  var dateNow = new Date();

  var secondsTemp = Math.floor((dateNow - datePrev) / 1000);
  var minutesTemp = Math.floor(secondsTemp / 60);
  var hoursTemp = Math.floor(minutesTemp / 60);
  var daysTemp = Math.floor(hoursTemp / 24);

  hoursTemp = hoursTemp - daysTemp * 24;
  minutesTemp = minutesTemp - daysTemp * 24 * 60 - hoursTemp * 60;
  secondsTemp =
    secondsTemp -
    daysTemp * 24 * 60 * 60 -
    hoursTemp * 60 * 60 -
    minutesTemp * 60;

  const { hours, minutes, seconds } = {
    hours: hoursTemp,
    minutes: minutesTemp,
    seconds: secondsTemp,
  };

  const getDaysAgo = (initiated_date) => {
    var notificationDate = new Date(initiated_date);
    var week = getWeek(notificationDate);
    var date = notificationDate.getDate();
    var fullDate = notificationDate.toDateString();
    var dayName = getDayName(notificationDate.getDay());
    var monthName = getMonthName(notificationDate.getMonth());
    var year = notificationDate.getFullYear();
    var timeIn12HourFormat = get12HourFormat(notificationDate);
    return {
      notificationDate: date,
      notificationFullDate: fullDate,
      notificationDayName: dayName,
      notificationWeek: week,
      notificationMonthName: monthName,
      notificationYear: year,
      notificationTime: timeIn12HourFormat,
    };
  };

  const getWeek = (date) => {
    let onejan = new Date(date.getFullYear(), 0, 1);
    let week = Math.ceil(
      ((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7
    );
    return week;
  };

  const getDayName = (dayOfTheWeek) => {
    if (dayOfTheWeek == 0) {
      return "Sun";
    } else if (dayOfTheWeek == 1) {
      return "Mon";
    } else if (dayOfTheWeek == 2) {
      return "Tue";
    } else if (dayOfTheWeek == 3) {
      return "Wed";
    } else if (dayOfTheWeek == 4) {
      return "Thu";
    } else if (dayOfTheWeek == 5) {
      return "Fri";
    } else if (dayOfTheWeek == 6) {
      return "Sat";
    }
  };

  const getMonthName = (month) => {
    if (month == 0) {
      return "Jan";
    } else if (month == 1) {
      return "Feb";
    } else if (month == 2) {
      return "Mar";
    } else if (month == 3) {
      return "Apr";
    } else if (month == 4) {
      return "May";
    } else if (month == 5) {
      return "Jun";
    } else if (month == 6) {
      return "Jul";
    } else if (month == 7) {
      return "Aug";
    } else if (month == 8) {
      return "Sep";
    } else if (month == 9) {
      return "Oct";
    } else if (month == 10) {
      return "Nov";
    } else if (month == 11) {
      return "Dec";
    }
  };

  const get12HourFormat = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  var time;
  var tempTime = getDaysAgo(item.initiated_date);
  var currentDate = new Date().toDateString();
  var currentWeek = getWeek(new Date());
  var currentYear = new Date().getFullYear();

  if (tempTime.notificationFullDate == currentDate) {
    if (hours != 0) {
      time = hours + " hours";
    } else if (minutes != 0) {
      time = minutes + " minutes";
    } else if (seconds != 0) {
      time = seconds + " seconds";
    }
  } else if (tempTime.notificationWeek == currentWeek) {
    time = tempTime.notificationDayName + " at " + tempTime.notificationTime;
  } else if (tempTime.notificationYear == currentYear) {
    time =
      tempTime.notificationDate +
      " " +
      tempTime.notificationMonthName +
      " at " +
      tempTime.notificationTime;
  } else {
    time =
      tempTime.notificationDate +
      " " +
      tempTime.notificationMonthName +
      " " +
      tempTime.notificationYear;
  }

  let deleteIndex = item.initiators_name.indexOf("@");
  var icon;
  if (item.type === "Task") {
    icon = <FontAwesomeIcon icon={faTasks} />;
  } else if (item.type === "Doc") {
    icon = <FontAwesomeIcon icon={faFileAlt} />;
  }

  return (
    <div className="d-flex flex-column">
      <div className="NotificationContainer">
        <div
          className={`${item.notification_status == "Read"
            ? "UnreadMarker Read"
            : "UnreadMarker UnRead"
            }`}
        ></div>
        <div
          className={`${item.type == "Task"
            ? "notificationAvatarTask"
            : "notificationAvatarDocument"
            }`}
        >
          {icon}
        </div>
        <div className="p-1 w-100">
          <div className="">
            <Heading1
              color="dark"
              paddingInline=""
              paddingBlock=""
              size=".8rem"
              weight="500"
              JFcontent="left"
              marginBottom="5px"
              display="block"
              className="Textwrap"
              style={{ marginRight: "5px" }}

              className={`${item.notification_status == "Read"
                ? ""
                : "UnreadText"
                }`}

            >
              {/* {item.initiators_name}{" "} */}
              {item.initiators_name}
            </Heading1>

            <Heading1
              color="grey"
              paddingInline=""
              paddingBlock=""
              size=".8rem"
              weight="400"
              JFcontent="left"
              marginBottom="5px"
              display="block"

              className={`${item.notification_status == "Read"
                ? "Textwrap"
                : "UnreadText Textwrap"
                }`}

            >
              {item.is_deadline_remainder ? <span> Your task <span style={{ color: "#D61C4E" }}>{item.message}</span> is due in 24 hours </span> : item.message}
            </Heading1>
          </div>

          <div className="d-flex justify-content-end flex-wrap w-100">
            <Heading1
              color="grey"
              paddingInline=""
              paddingBlock=""
              size=".8rem"
              weight="500"
              marginBottom="0px"
              display="block"
              width="fit-content"

              className={`${item.notification_status == "Read"
                ? ""
                : "UnreadText"
                }`}
            >
              {tempTime.notificationFullDate == currentDate ? (
                <>
                  {time}
                  <span style={{ display: "inline", fontWeight: "500" }}>
                    {" "}
                    ago
                  </span>{" "}
                </>
              ) : (
                <>{time}</>
              )}
            </Heading1>
          </div>
        </div>
      </div>
      <div className="">
        <hr className="NotificationDivider" />
      </div>
    </div>
  );
}

export default NotificationCard;
