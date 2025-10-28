import { Link as RouterLink, useNavigate } from "react-router-dom";
import React, { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet";
import TextTruncate from 'react-text-truncate';
import * as Yup from "yup";
import axios from "axios";


import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  IconButton,
} from "@mui/material";

import InputLabel from "@mui/material/InputLabel";
import { Divider } from "@mui/material";
import FacebookIcon from "../icons/Facebook";
import GoogleIcon from "../icons/Google";
import { url } from "../url";
import countryList from "react-select-country-list";
import TransferList from "../components/TransferList";
import { Link } from "react-router-dom";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddSubcontractor from "../components/ProjectEntities/AddSubcontractor"
import AdminCard from "../components/admin/AdminCard";
import Fade from "react-reveal/Fade";
import ButtonStyled from "../Reusable Components/Buttons/ButtonStyled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import SubcontractorCard from "../components/ProjectEntities/SubcontractorCard";




const ProjectEntities = ({ user, userInfo, project }) => {

  const AdminCardData = [
    {
      id: 1,
      folderName: "Subcontractor",
      image: "",
      pageUrl: "/app/addsubcontractor",
    },
  ];



  const [selectedTab, setselectedTab] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [FiltersClicked, setFiltersClicked] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [subContractors, setSubcontractors] = React.useState([]);

  const handleSelectedTab = (id) => {
    console.log("selected tab", selectedTab);

    if (id === 1) {
      subContractorapi();
    }

    setselectedTab(id);
  };

  const subContractorapi = async () => {

    try {
      const res = await axios.get(
        url + `/Project/getSubcontractors?project_id=${project.project_id}`,
        {
          headers: { token: user.token },
        }
      );
      console.log("subcontractors--->", res.data)
      setSubcontractors(res.data);
      setLoading(false);

    } catch (error) {
      console.log(error.response);
      return error.response;
    }

    //  Sub contractor AIP call goes here 


  }

  useEffect(() => {
    if (selectedTab === 1) {
      subContractorapi();
    }
  }, [isLoading])

  const dynamicFilters = () => {
    if (selectedTab === 1) {
      return (
        <div
          className="d-flex flex-wrap align-items-center   w-100 ml-1"
          style={{ columnGap: "8px", rowGap: "8px", marginTop: "0em" }}
        >
          <div
            className="fadein"
            style={{
              animationDelay: "0.2s",
              width: 170,
            }}
          >
            FILTERS GO HERE
          </div>

          <div
            className="fadein"
            style={{
              animationDelay: "0.25s",
              width: 150,
            }}
          >
            FIKTER
          </div>

          <div
            className="fadein SRdatesize"
            style={{
              animationDelay: "0.3s",
              width: 130,
            }}
          >
            DATE FILTER
          </div>



          <div
            className="fadein"
            style={{
              marginRight: "5px",
              animationDelay: ".4s",
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              width: "fit-content",
            }}
          >
            <Button
              variant="contained"
              size="small"
              color="info"
              sx={{ background: "var(--blue)" }}
              className="MUIButtonsize"
              // onClick={handleProjectFilter}
              endIcon={<FontAwesomeIcon icon={faFilter} />}
            >
              APPLY
            </Button>
          </div>
          <div
            className="fadein"
            style={{
              marginRight: "10px",
              animationDelay: ".4s",
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              width: "fit-content",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              color="info"
              // onClick={handleFilterClearProject}
              className="MUIButtonsize"
              disabled={false}
              endIcon={<FontAwesomeIcon icon={faTimes} />}
            >
              CLEAR
            </Button>
          </div>
        </div>
      );
    }
  }


  const handlePageUrl = () => {
    if (selectedTab === 1) {
      return "/app/addsubcontractor";
    }
  };

  const DisplayLabel = () => {

    if (selectedTab === 1) {
      return (
        <div className="HeaderLabel">
          <div className="seaarchresultDivision" style={{ width: "40%" }}>Subcontractor Name</div>
          <div className="seaarchresultDivision" style={{ width: "25%" }}>Scope of Contract</div>
          <div className="seaarchresultDivision" style={{ width: "25%" }}>Contract Type</div>
          <div className="seaarchresultDivision" style={{ width: "10%" }}></div>
        </div>)
    }

  }
  
  const CardToDisplayView = () => {

    if (selectedTab === 1) {
      return subContractors.filter(
        (f) =>
          f?.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          f?.scope
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          f?.contract_type
            ?.toLowerCase()
            .includes(search.toLowerCase())
      ).map((sub) => (
        <SubcontractorCard
          user={user}
          project={project}
          setRefresh={setRefresh}
          refresh={refresh}
          userInfo={userInfo}
          name={sub.name}
          scope={sub.scope}
          contract_type={sub.contract_type}
          date={sub.created_on}
          sub={sub}
          setLoading={setLoading}

        //  proj={proj}
        />
      ));
    }
  }

  return (
    <>
      <Helmet>
        <title>Project Entities | StonAi</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
          px: 2,
        }}
      >

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexWrap: "wrap"
          }}>
          {AdminCardData.map((data) => {
            return (
              <AdminCard
                id={data.id}
                folderName={data.folderName}
                image={data.image}
                fadeDelay={data.fadeDelay}
                selectedTab={selectedTab}
                handleSelectedTab={handleSelectedTab}
                pageUrl={data.pageUrl}
              />
            );
          })}

        </Box>

        {!isLoading ? (
          <>
            <br />

            <Fade right>
              <div className="filtersContainer">
                <Grid container direction="column" spacing={0.5}>
                  <Grid
                    container
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                  >
                    <Grid container style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                      <Grid item xs style={{ flexGrow: "0" }}>
                        <TextField
                          id="searchbox"
                          label="Search"
                          type="search"
                          size="small"
                          style={{ width: "20rem" }}
                          className="searchbox "
                          onChange={(event) => { setSearch(event.target.value) }}
                        />
                      </Grid>
                      {/* <Grid item xs style={{ flexGrow: "0" }}>
                        <ButtonStyled
                          paddingInline=".8rem"
                          paddingBlock="0.3rem"
                          borderRadius="8px"
                          width="fit-content"
                          style={{ cursor: "pointer" }}
                          className={`${FiltersClicked
                            ? "FiltersClicked mx-1"
                            : "FiltersUnclicked mx-1"
                            }`}
                          onClick={(e) => {
                            setFiltersClicked(!FiltersClicked);
                          }}
                        >
                          Filters
                        </ButtonStyled>
                      </Grid> */}
                    </Grid>

                    {/* <Grid item>{FiltersClicked && dynamicFilters()}</Grid> */}


                    <Grid
                      item
                      xs
                      style={{
                        position: "absolute",
                        marginLeft: "auto",
                        top: "0",
                        right: "0",
                        padding: "16px",
                      }}
                    >
                      <Fab
                        color="primary"
                        aria-label="add"
                        size="small"
                        style={{}}
                        onClick={() =>
                          navigate(handlePageUrl(), { replace: true })
                        }
                      >
                        <AddIcon />
                      </Fab>
                    </Grid>

                  </Grid>
                </Grid>
              </div>
            </Fade>

            <div className="seaarchresultContainer ">
              {/* <SubcontractorCard
                user={user}
                project={project}
                setRefresh={setRefresh}
                refresh={refresh}
                userInfo={userInfo}

              //  proj={proj}
              /> */}
              
              {DisplayLabel()}

              {CardToDisplayView()}
            </div>
          </>
        ) : (
          <Box
            sx={{
              position: "absolute",
              top: "60%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularProgress />
          </Box>
        )}

      </Box>
    </>
  );
};

export default ProjectEntities;
