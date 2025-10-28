import React, { useState, useEffect } from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import startOfDecade from "date-fns/startOfDecade";
import { url } from "../../url";
import TextTruncate from 'react-text-truncate';
import axios from "axios";
import { useSnackbar } from "notistack";
import SubcontractorDrawer from "./SubcontractorDrawer";
import Heading1 from "../../Reusable Components/Headings/Heading1";


const SubcontractorCard = ({
  proj,
  user,
  refresh,
  setRefresh,
  userInfo,
  permisions,
  project,
  name,
  scope,
  contract_type,
  sub,
  setLoading
}) => {


  const [open, setOpen] = React.useState(false);
  const [subContractorInfo, setSubContractorInfo] = React.useState({});
  const { enqueueSnackbar } = useSnackbar();
  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };

  const getSubcontractors = async () => {

  };
  const handleDrawerOpen = (subcontractor) => {
    setSubContractorInfo(subcontractor);
    setOpen(true);
  };

  useEffect(() => {
    getSubcontractors()
  }, [refresh]);

  const handleDelete = async (sub_id) => {
    // if (window.confirm("Are you sure you want to delete this project?")) {
    //   const res1 = await axios.post(
    //     url + "/Project/deleteProject",
    //     {
    //       project_id: projID,
    //     },
    //     {
    //       headers: { token: user.token },
    //     }
    //   );
    //   handleClickVariant("success", "Project deleted sucessfully");

    //   setRefresh(!refresh);
    // } else {
    //   // Do nothing!
    //   console.log("Delete canceled");
    // }

    if (window.confirm("Are you sure you want to delete this subcontractor?")) {
      const res1 = await axios.delete(
        url + `/Project/deleteSubcontractor?sub_id=${sub_id}`,
        {
          headers: { token: user.token },
        }
      );
      handleClickVariant("success", "Subcontractor deleted sucessfully");
      setLoading(true);
      setRefresh(!refresh);
    } else {
      // Do nothing!
      console.log("Delete canceled");
    }
  };


  return (
    <>
      {subContractorInfo && Object.keys(subContractorInfo).length > 0 ?
        <SubcontractorDrawer
          openDrawer={open}
          setOpenDrawer={setOpen}
          refresh={refresh}
          setRefresh={setRefresh}
          user={user}
          proj={proj}
          userInfo={userInfo}
          subContractor={subContractorInfo}
          sub_id={sub.sub_id}
          setLoading={setLoading}
        />
        : null}


      <div className="SearchResultCard">


        <div className="seaarchresultDivision" style={{ width: "40%" }}>
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {name?.length > 35 ? (
              <Tooltip title={name} placement="top">
                <div>
                  <TextTruncate
                    line={1}
                    element="span"
                    truncateText="…"
                    text={name}
                    style={{ color: "grey" }}
                  />
                </div>
              </Tooltip>
            ) : (
              <>{name} </>)
            }

          </Heading1>
        </div>
        <div className="seaarchresultDivision" style={{ width: "25%" }}>
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >
            {scope?.length > 20 ? (
              <Tooltip title={scope} placement="top">
                <div>
                  <TextTruncate
                    line={1}
                    element="span"
                    truncateText="…"
                    text={scope}
                    style={{ color: "grey" }}
                  />
                </div>
              </Tooltip>
            ) : (
              <>{scope} </>)
            }

          </Heading1>
        </div>

        <div className="seaarchresultDivision" style={{ width: "25%" }}>
          <Heading1
            color="grey"
            weight="700"
            JFcontent="left"
            paddingBlock="5px"
          >

            {scope?.length > 25 ? (
              <Tooltip title={contract_type} placement="top">
                <div>
                  <TextTruncate
                    line={1}
                    element="span"
                    truncateText="…"
                    text={contract_type}
                    style={{ color: "grey" }}
                  />
                </div>
              </Tooltip>
            ) : (
              <>{contract_type} </>)
            }
          </Heading1>
        </div>

        <div className="seaarchresultDivision " style={{ width: "10%", marginLeft: "auto" }}>
          <Heading1 color="grey" weight="700" JFcontent="right" style={{ alignItems: "center" }} >

            <Tooltip title="Edit" placement="top">
              <IconButton onClick={() => handleDrawerOpen(sub)}>
                <EditIcon style={{ color: "var(--green)" }} />
              </IconButton>
            </Tooltip>


            <Tooltip title="Delete" placement="top">
              <IconButton onClick={() => handleDelete(sub.sub_id)}>
                <DeleteForeverIcon style={{ color: "var(--warningRed)" }} />
              </IconButton>
            </Tooltip>

          </Heading1>
        </div>
      </div>

    </>
  )
}

export default SubcontractorCard