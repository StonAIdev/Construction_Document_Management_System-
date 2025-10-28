import React, { useState, useEffect } from "react";
import Heading1 from "../../Reusable Components/Headings/Heading1";
import { IconButton } from "@material-ui/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import "./Admin.css";
import { url } from "../../url";

import DepartmentDrawer from "./Drawers/DepartmentDrawer";
import axios from "axios";
import { useSnackbar } from "notistack";

function AdminDepartmentCard({
  name,
  resposibility,
  created_by,
  created_on,
  project,
  user,
  userInfo,
  depID,
  setRefresh,
  refresh,
  head_of_department,
  permisions,
}) {
  const [open, setOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDelete = async (depID) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      const res1 = await axios.post(
        url + "/Department/deleteDepartment",
        {
          department_id: depID,
        },
        {
          headers: { token: user.token },
        }
      );
      handleClickVariant("success", "Department deleted sucessfully");
      setRefresh(!refresh);
    } else {
    }
  };

  return (
    <>
      <DepartmentDrawer
        open={open}
        setOpen={setOpen}
        user={user}
        userInfo={userInfo}
        project={project}
        name={name}
        resp={resposibility}
        dep_id={depID}
        setRefresh={setRefresh}
        refresh={refresh}
      />

      <div className="SearchResultCard">
        {/* <div className="seaarchresultDivision">
          <img
            className="SRImage"
            src="https://image.freepik.com/free-vector/businessman-profile-cartoon_18591-58479.jpg"
            alt=""
          />
        </div> */}
        <div className="seaarchresultDivision" style={{ width: "15%" }}>
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {" "}
            {name}
          </Heading1>
        </div>
        <div className="seaarchresultDivision" style={{ width: "15%" }}>
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {project.project_name}
          </Heading1>
        </div>

        <div className="seaarchresultDivision" style={{ width: "25%" }}>
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {resposibility}
          </Heading1>
        </div>
        <div className="seaarchresultDivision" style={{ width: "15%" }}>
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {created_by?.slice(0, 10)}
          </Heading1>
        </div>
        <div className="seaarchresultDivision" style={{ width: "15%" }}>
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {created_on?.slice(0, 10)}
          </Heading1>
        </div>
        <div className="seaarchresultDivision" style={{ width: "10%" }}>
          <Heading1 color="grey" weight="700" JFcontent="left">
            {permisions.canupdatedepartmentsdepartments ? (
              <IconButton onClick={handleDrawerOpen}>
                <EditIcon style={{ color: "var(--green)" }} />
              </IconButton>
            ) : null}

            {permisions.candeletedepartmentsdepartments ? (
              <IconButton onClick={() => handleDelete(depID)}>
                <DeleteForeverIcon style={{ color: "var(--warningRed)" }} />
              </IconButton>
            ) : null}
          </Heading1>
        </div>
      </div>
    </>
  );
}

export default AdminDepartmentCard;
