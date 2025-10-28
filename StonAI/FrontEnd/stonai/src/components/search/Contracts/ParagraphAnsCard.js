import React from "react";
import Heading1 from "../../../Reusable Components/Headings/Heading1";

function ParagraphAnsCard({ para }) {
  return (
    <div className="AnsCard">
      <Heading1 color="grey" size="1.1em" JFcontent="left">
        {para}
      </Heading1>
    </div>
  );
}

export default ParagraphAnsCard;
