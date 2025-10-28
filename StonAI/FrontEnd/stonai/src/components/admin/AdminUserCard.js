import React, { useRef } from "react";
import Heading1 from "../../Reusable Components/Headings/Heading1";
import { IconButton } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import "./Admin.css";
import { getDefaultPermissionWithUserPermissionsData } from "../../defaultPermissionsData";
import UserDrawer from "./Drawers/UserDrawer";
import { useSnackbar } from "notistack";
import { url } from "../../url";

import axios from "axios";

function AdminUserCard({
  firstName,
  lastName,
  username,
  createdBy,
  role,
  refresh,
  setRefresh,
  user,
  user_id,
  permisions,
  project,
  department,
}) {
  const [open, setOpen] = React.useState(false);
  var defaultPermisions = useRef();
  const { enqueueSnackbar } = useSnackbar();
  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };

  const handleDrawerOpen = async () => {
    defaultPermisions.current =
      await getDefaultPermissionWithUserPermissionsData(
        role,
        user_id,
        user,
        project
      );

    setOpen(true);
  };

  const handleDelete = async (user_id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const res1 = await axios.post(
        url + "/userInfo/deleteUser",
        {
          user_id: user_id,
        },
        {
          headers: { token: user.token },
        }
      );
      handleClickVariant("success", "User deleted sucessfully");

      setRefresh(!refresh);
    } else {
    }
  };
  return (
    <>
      {open && (
        <UserDrawer
          open={open}
          setOpen={setOpen}
          refresh={refresh}
          setRefresh={setRefresh}
          user_role={role}
          user={user}
          permisions={permisions}
          user_id={user_id}
          project={project}
          defaultPermisions={defaultPermisions}
          department={department}
        />
      )}

      <div className="SearchResultCard" style={{ wordBreak: "break-all" }}>
        <div className="seaarchresultDivision">
          <img
            className="SRImage"
            src="https://image.freepik.com/free-vector/businessman-profile-cartoon_18591-58479.jpg"
            alt=""
          />
        </div>
        <div className="seaarchresultDivision" style={{ width: "16%" }}>
          {/* First Name */}
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {firstName}
          </Heading1>
        </div>
        <div className="seaarchresultDivision" style={{ width: "16%" }}>
          {/* Last Name */}
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {lastName}
          </Heading1>
        </div>
        <div className="seaarchresultDivision" style={{ width: "16%" }}>
          {/* Username */}
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {username}
          </Heading1>
        </div>
        <div className="seaarchresultDivision" style={{ width: "16%" }}>
          {/* Project */}
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {project.project_name}
          </Heading1>
        </div>
        <div className="seaarchresultDivision" style={{ width: "16%" }}>
          {/* Role */}
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {" "}
            {role}
          </Heading1>
        </div>

        <div className="seaarchresultDivision" style={{ width: "16%" }}>
          {/* Created By */}
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {" "}
            {createdBy}
          </Heading1>
        </div>

        <div className="seaarchresultDivision">
          <Heading1 color="grey" weight="700" JFcontent="left">
            {permisions.canupdateusersdetailsusers ? (
              <IconButton onClick={handleDrawerOpen}>
                {" "}
                <EditIcon style={{ color: "var(--green)" }} />
              </IconButton>
            ) : null}
            {permisions.candeleteusersusers ? (
              <IconButton onClick={() => handleDelete(user_id)}>
                <DeleteForeverIcon style={{ color: "var(--warningRed)" }} />
              </IconButton>
            ) : null}
          </Heading1>
        </div>
      </div>
    </>
  );
}

export default AdminUserCard;
