import React, { useState } from "react";
import "./ButtonTabs.css";

function ButtonTabs({ activeTab, setActiveTab, num, tabtitle }) {
  const [tabToggle, settabToggle] = useState(true);
  return (
    <div className="tabDiv">
      <hr
        className={`${
          tabToggle ? "p-0 m-0 tabLine" : "p-0 m-0 tabLine lineClicked"
        }`}
      />
      <input
        type="button"
        value={tabtitle}
        className={`${tabToggle ? "tabbody" : "tabbody tabclicked"}`}
        onClick={(e) => {
          settabToggle(!tabToggle);
        }}
      />
    </div>
  );
}

export default ButtonTabs;
