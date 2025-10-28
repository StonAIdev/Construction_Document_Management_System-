import React from "react";
import Heading1 from "../../Reusable Components/Headings/Heading1";
import { IconButton } from "@material-ui/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import "./Admin.css";

import ProjectDrawer from "./Drawers/ProjectDrawer";
import { url } from "../../url";

import axios from "axios";
import { useSnackbar } from "notistack";

function AdminProjectCard({
  proj,
  user,
  refresh,
  setRefresh,
  userInfo,
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

  const handleDelete = async (projID) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const res1 = await axios.post(
        url + "/Project/deleteProject",
        {
          project_id: projID,
        },
        {
          headers: { token: user.token },
        }
      );
      handleClickVariant("success", "Project deleted sucessfully");

      setRefresh(!refresh);
    } else {
    }
  };
  return (
    <>
      <ProjectDrawer
        openDrawer={open}
        setOpenDrawer={setOpen}
        refresh={refresh}
        setRefresh={setRefresh}
        user={user}
        proj={proj}
        userInfo={userInfo}
      />
      <div className="SearchResultCard">
        <div className="seaarchresultDivision" style={{ width: "30%" }}>
          Project Name
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {" "}
            {proj.project_name}
          </Heading1>
        </div>
        <div className="seaarchresultDivision" style={{ width: "20%" }}>
          Project Type
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {" "}
            {proj.project_type}
          </Heading1>
        </div>

        <div className="seaarchresultDivision" style={{ width: "20%" }}>
          Docs Uploaded
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            2
          </Heading1>
        </div>
        <div className="seaarchresultDivision" style={{ width: "15%" }}>
          Start Date
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {" "}
            {proj.start_date?.slice(0, 10)}
          </Heading1>
        </div>
        <div className="seaarchresultDivision" style={{ width: "15%" }}>
          End Date
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {" "}
            {proj.end_date?.slice(0, 10)}
          </Heading1>
        </div>
        <div className="seaarchresultDivision" style={{ width: "8%" }}>
          <Heading1 color="grey" weight="700" JFcontent="left">
            {permisions.canupdateprojectsdetailsprojects ? (
              <IconButton onClick={handleDrawerOpen}>
                {" "}
                <EditIcon style={{ color: "var(--green)" }} />
              </IconButton>
            ) : null}
            {permisions.candeleteprojectsprojects ? (
              <IconButton onClick={() => handleDelete(proj.project_id)}>
                <DeleteForeverIcon style={{ color: "var(--warningRed)" }} />
              </IconButton>
            ) : null}
          </Heading1>
        </div>
      </div>
    </>
  );
}

export default AdminProjectCard;
