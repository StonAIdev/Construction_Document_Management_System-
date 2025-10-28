import React, { useState } from "react";
import Heading1 from "../../../Reusable Components/Headings/Heading1";

function TableCardChips({ row, attribute }) {
  var property = " and typesetting";
  const [seemorepressed, setseemorepressed] = useState(false);

  function Handleseemore() {
    setseemorepressed(!seemorepressed);
  }

  return (
    <div className=" TableCardChips chips" >
      <Heading1
        size="14px"
        color="white"
        weight="400"
        JFcontent="left"
        width="fit-content"
        display="inline"
        marginBottom="0px"
        style={{ float: "left" }}
      >
        <Heading1
          size="14px"
          color="white"
          weight="550"
          JFcontent="left"
          width="fit-content"
          marginBottom="0px"
          style={{ float: "left", marginRight: "10px" }}
        >
          {attribute}
        </Heading1>

        {row[attribute]?.length > 80 ? (
          <>
            {seemorepressed ? (
              <>
                {row[attribute]}
                <button className="seemoreButton" onClick={Handleseemore}>
                  See less
                </button>
              </>
            ) : (
              <>
                {row[attribute]?.slice(0, 80) + "..."}
                <button className="seemoreButton" onClick={Handleseemore}>
                  See more
                </button>
              </>
            )}
          </>
        ) : (
          <> {row[attribute]}</>
        )}
      </Heading1>
    </div>
  );
}

export default TableCardChips;
