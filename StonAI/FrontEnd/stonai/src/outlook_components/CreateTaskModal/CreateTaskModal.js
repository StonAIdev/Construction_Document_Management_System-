import React from "react";
import { useState, useEffect } from "react";
import CreateTaskCard from "./CreateTaskCard";
import "./CreateTaskModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@mui/material/IconButton";
import ButtonStyled from "../../Reusable Components/Buttons/ButtonStyled";
import axios from "axios";
import { url } from "../../url";
import { useSnackbar } from "notistack";
import moment from "moment";

function CreateTaskModal({
  taskModalToggle,
  setTaskModalToggle,
  selectedText,
  project,
  userInfo,
  user,
  department,
}) {
  const [projectUsers, setProjectUsers] = useState([]);
  const [TaskCard, setTaskCard] = useState(selectedText);
  console.log("model text", selectedText);
  console.log("task card", department);
  const { enqueueSnackbar } = useSnackbar();

  const getUsers = async () => {
    try {
      var res = await axios.post(
        url + "/Tasks/getUsers",
        {
          project_id: project.project_id,
        },
        {
          headers: { token: user.token },
        }
      );
      console.log("dsadsadsadsadsa", res);
      setProjectUsers(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);
  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };
  const updateKPI = async (totalTime) => {
    var date = new Date();
    var today_date = moment.utc(date).format("YYYY-MM-DD");
    console.log("today_date", today_date, url, department, project, user);
    try {
      const response = await axios.post(
        url + "/kpi/updateKPI",
        {
          userID: user.user_id,
          departmentID: department.department_id,
          projectID: project.project_id,
          searchType: "Tasks",
          todayDate: today_date,
          userPosition: "Engineer",
          totalTime: totalTime
        },
        { headers: { token: user.token } }
      );
      console.log("on submit search: ", response.data);
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  const handleSaveClick = async () => {
    for (let index = 0; index < TaskCard.length; index++) {
      console.log(
        "key",
        TaskCard[index].taskTitle,
        TaskCard[index].deadline,
        TaskCard[index].assignedTask,
        TaskCard[index].startdate
      );
      try {
        setTaskModalToggle(false);
        const res = await axios.post(
          url + "/Tasks/createTasksFromEmail",
          {
            user_id: userInfo.user_id,
            project_id: project.project_id,
            task_name: TaskCard[index].taskTitle,
            task_deadline: TaskCard[index].deadline,
            task_assigned_to: TaskCard[index].assignedTask,
            task_startdate: TaskCard[index].startdate,
            task_status: "In Process",
            group_name: "Created From Email",
            group_id: 210,
            department_id: department.department_id,
          },
          {
            headers: { token: user.token },
          }
        );
        updateKPI(1000);
        handleClickVariant("success", `Task ${index + 1} created Sucessfully`);

      } catch (e) {
        console.log(e);
      }
    }
  };

  //   useEffect(() => {}, [selectedText]);
  return (
    <div className="">
      {taskModalToggle ? (
        <div
          className="TaskModalContainer"
          onClick={(e) => {
            // setTaskModalToggle();
          }}
        >
          <div
            className="TaskModal"
            onClick={(e) => {
              // e.stopPropagation();
            }}
          >
            <div className="Popup">
              <div className="TaskHead">
                <h4>Tasks</h4>
              </div>

              <div className="TaskBody">
                <IconButton
                  className="p-0 d-flex"
                  style={{ marginLeft: "auto" }}
                >
                  <div className="AddIcon">
                    <FontAwesomeIcon
                      icon={faAdd}
                      onClick={() => {
                        setTaskCard([...TaskCard, { taskTitle: "" }]);
                      }}
                    />
                  </div>
                </IconButton>
                <div className="scrollableSection">
                  {/* ------------------------------- */}
                  {TaskCard.map((x, i) => {
                    return (
                      <CreateTaskCard
                        taskNumber={i}
                        project={project}
                        projectUsers={projectUsers}
                        setTaskCard={setTaskCard}
                        TaskCard={TaskCard}
                        index={i}
                        userInfo={userInfo}
                      />
                    );
                  })}

                  {/* 0000000000000000000000000000000 */}
                </div>
              </div>

              <div className="TaskFooter">
                <IconButton className="p-0" style={{ marginRight: "-5px" }}>
                  <ButtonStyled
                    paddingInline=".8rem"
                    paddingBlock="0.3rem"
                    borderRadius="8px"
                    width="fit-content"
                    style={{ cursor: "pointer" }}
                    className="FiltersClicked mx-1"
                    onClick={handleSaveClick}
                  >
                    Save
                  </ButtonStyled>
                </IconButton>
                <IconButton className="m-0">
                  <ButtonStyled
                    paddingInline=".8rem"
                    paddingBlock="0.3rem"
                    borderRadius="8px"
                    width="fit-content"
                    style={{ cursor: "pointer" }}
                    className="FiltersUnclicked"
                    onClick={(e) => {
                      setTaskModalToggle(false);
                    }}
                  >
                    Close
                  </ButtonStyled>
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* </div> */}
    </div>
  );
}

export default CreateTaskModal;
