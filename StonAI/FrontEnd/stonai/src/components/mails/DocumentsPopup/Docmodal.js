import React, { useState } from "react";
import ButtonStyled from "../../../Reusable Components/Buttons/ButtonStyled";
import "./DocModal.css";
import Folder from "./FolderEmail";

const Docmodal = ({
  docmodal,
  setdocmodal,
  user,
  userInfo,
  project,
  files,
  setFiles,
  stonAiAttachments,
  setStonAiAttachments,
}) => {
  let [checkedDocs, setCheckedDocs] = useState([]);
  const [name, setName] = React.useState("");
  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleAttachFiles = async () => {
    console.log("newCheckedDocs", checkedDocs);
    const convertedFiles = [];

    for (const docs of checkedDocs) {
      let response = await fetch(docs.urls);
      let data = await response.blob();
      let metadata = {
        type: docs.document_type,
      };
      let file = new File([data], docs.document_name, metadata);
      convertedFiles.push(file);
    }
    console.log("converted files", convertedFiles);
    setStonAiAttachments(convertedFiles);
    setCheckedDocs([]);
    setdocmodal(false);
  };
  return (
    <div className=" ">
      {docmodal ? (
        <div className="docmodalContainer">
          <div
            className="Docmodal "
            onClick={(e) => {
              // e.stopPropagation();
            }}
          >
            <div className="Popup">
              <div className="docmodalHead">
                <h4>Documents list</h4>
              </div>
              <div
                className="docBody"
                style={{
                  marginTop: "15px",
                  marginRight: "10px",
                  marginLeft: "10px",
                }}
              >
                <div>
                  <Folder
                    project={project}
                    userInfo={userInfo}
                    user={user}
                    checkedDocs={checkedDocs}
                    setCheckedDocs={setCheckedDocs}
                    name={name}
                    setName={setName}
                  />
                </div>
              </div>

              <div className="docmodalfooter">
                <div className="p-0" style={{ marginRight: "-5px" }}>
                  <ButtonStyled
                    paddingInline=".8rem"
                    paddingBlock="0.3rem"
                    borderRadius="8px"
                    width="fit-content"
                    style={{ cursor: "pointer" }}
                    className="FiltersClicked mx-1"
                    onClick={handleAttachFiles}
                  >
                    Attach
                  </ButtonStyled>
                </div>
                <div className="p-0" style={{ marginRight: "-5px" }}>
                  <ButtonStyled
                    paddingInline=".8rem"
                    paddingBlock="0.3rem"
                    borderRadius="8px"
                    width="fit-content"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "var(--blueGradiant)",
                      color: "white",
                    }}
                    className="mx-1"
                    onClick={(e) => {
                      setdocmodal(false);
                    }}
                  >
                    Close
                  </ButtonStyled>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Docmodal;
