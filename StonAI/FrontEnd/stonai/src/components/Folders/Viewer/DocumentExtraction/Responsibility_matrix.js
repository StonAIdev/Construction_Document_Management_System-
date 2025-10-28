import React, { useEffect, useState } from "react";
import Heading1 from "../../../../Reusable Components/Headings/Heading1";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Chip from "@mui/material/Chip";
import { CircularProgress } from "@mui/material";
import { Box, Container, Grid, IconButton } from "@material-ui/core";
import { url } from "../../../../url";
import ButtonStyled from "../../../../Reusable Components/Buttons/ButtonStyled";
import axios from "axios";

function Responsibility_matrix({
  extractedFeilds,
  user,
  userInfo,
  project,
  update,
}) {
  const [responsibilityData, setResponsibilityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [json_keys, setJsonKeys] = useState([]);
  const getDocData = async () => {
    try {
      const res = await axios.post(
        url + "/Document/getResponsabilityMatrixDoc",
        {
          document_id: extractedFeilds.document_id,
        },
        {
          headers: { token: user.token },
        }
      );

      setJsonKeys(Object.keys(res.data));
      setResponsibilityData(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };
  useEffect(() => {
    getDocData();
    console.log("responsibilityData", extractedFeilds);
  }, []);

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  let content = [];
  for (let i = 0; i < 10; i++) {
    content.push(<Chip label={"Company " + i} className="chips" />);
  }

  return (
    <div style={{ height: "89vh" }}>

      <div>
        {!isLoading ? (
          json_keys?.map((key) => {
            return (
              <Accordion
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 5px",
                  marginBottom: "10px",
                }}
              >
                <AccordionSummary
                  className="metal"
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Heading1 size="1.2em" weight="500" JFcontent="left">
                    S/N: {key}
                  </Heading1>
                </AccordionSummary>

                <AccordionDetails>
                  {responsibilityData[key]?.map((data) => {
                    return (
                      <Accordion
                        style={{
                          boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 5px",
                          marginBottom: "10px",
                        }}
                      >
                        <AccordionSummary
                          className="metal"
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          expandIcon={<ExpandMoreIcon />}
                        >
                          <Heading1 size="1.2em" weight="500" JFcontent="left">
                            {data["S/N"]}: {data.ACTIVITY}
                          </Heading1>
                        </AccordionSummary>

                        <AccordionDetails>
                          <Box sx={{ marginBottom: "1em" }}>
                            <div
                              scope="row"
                              className=" d-flex flex-wrap"
                              style={{ columnGap: "8px", rowGap: "10px" }}
                            >
                              {data?.Responsible.map((responsi) => {
                                return (
                                  <Chip
                                    label={"Company " + responsi}
                                    className="chips"
                                  />
                                );
                              })}
                            </div>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
            );
          })
        ) : (
          <Box
            sx={{
              position: "relative",
              // backgroundColor: "blue",
              height: "100%",
              width: "100%",

              transform: "translate(50%,500%)",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </div>

      <div className="d-flex flex-column" style={{ rowGap: "10px" }}>
        <Stack sx={{ width: "100%", background: "#eaf8ff" }} spacing={2}>
          <Alert variant="outlined" severity="info">
            This Document has more data To view all data please Export
          </Alert>
        </Stack>

        <ButtonStyled
          paddingInline=".8rem"
          paddingBlock="0.3rem"
          borderRadius="8px"
          width="fit-content"
          className="FiltersUnclicked "
          style={{ marginLeft: "auto" }}
        >
          Export
        </ButtonStyled>
      </div>
    </div>
  );
}

export default Responsibility_matrix;
