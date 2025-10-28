import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Heading1 from "../../../../Reusable Components/Headings/Heading1";
import ButtonStyled from "../../../../Reusable Components/Buttons/ButtonStyled";
import {
  faBars,
  faBuilding,
  faComments,
  faFileAlt,
  faFont,
  faHashtag,
  faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import { CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TenderCard from "./TenderCard";
import { Box, Container, Grid, IconButton } from "@material-ui/core";
import { url } from "../../../../url";
import axios from "axios";
import { truncate } from "lodash";
import DrawerSkeleton from "../../../../Reusable Components/Skeleton/DrawerSkeleton";
// getTenderAddendaDoc

var totalPages = 0;
var startFrom = 0;

function MOM({ extractedFeilds, user, userInfo, project }) {
  const [momData, setMOMData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);

  const getDocData = async () => {
    try {
      const res = await axios.post(
        url + "/Document/getMOM",
        {
          document_id: extractedFeilds.document_id,
        },
        {
          headers: { token: user.token },
        }
      );
      var decimalCheck = (res.data.totalHits / 5) % 1
      if (decimalCheck == 0) {
        totalPages = res.data.totalHits / 5;
      } else {
        totalPages = (parseInt(res.data.totalHits / 5) + 1);
      }
      setMOMData(res.data.hits);
      setIsLoading(false);
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  const handlePageChange = async (event, page) => {
    setPageNo(page);
    setIsLoading(true);
    startFrom = (page * 5) - 5;
    try {
      const res = await axios.post(
        url + "/Document/getNextMOM",
        {
          document_id: extractedFeilds.document_id,
          startFrom: startFrom,
        },
        {
          headers: { token: user.token },
        }
      );

      setMOMData(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  }

  useEffect(() => {
    startFrom = 0;
    totalPages = 0;
    getDocData();
    console.log("responsibilityData", extractedFeilds);
  }, []);

  const momCardContainer = momData.map((data) => {
    return <>
      <div className="tenderCardContainer">
        <div className="tenderCardTextarea">
          <div className="d-flex">
            <FontAwesomeIcon
              icon={faHashtag}
              style={{
                float: "left",
                color: "var(--warningRed)",
                marginRight: "10px",
                marginTop: "1px",
              }}
            />
            <div>
              <Heading1
                size="1.1em"
                weight="400"
                JFcontent="left"
                width="fit-content"
                display="inline"
                style={{ float: "left" }}
              >
                <Heading1
                  size="1.2em"
                  weight="600"
                  JFcontent="left"
                  width="fit-content"
                  style={{ float: "left", margin: "-3px", marginRight: "10px" }}
                >
                  {data["Label"]}
                </Heading1>
              </Heading1>
            </div>
          </div>
          <div className="d-flex">
            <FontAwesomeIcon
              icon={faQuestionCircle}
              style={{
                float: "left",
                color: "var(--blue)",
                marginRight: "10px",
                marginTop: "1px",
              }}
            />
            <div>
              <Heading1
                size="1.1em"
                weight="400"
                JFcontent="left"
                width="fit-content"
                display="inline"
                style={{ float: "left" }}
              >
                <Heading1
                  size="1.2em"
                  weight="600"
                  JFcontent="left"
                  width="fit-content"
                  style={{ float: "left", margin: "-3px", marginRight: "10px" }}
                >
                  {data["Text"]}
                </Heading1>
              </Heading1>
            </div>
          </div>
        </div>
      </div>
    </>
  });

  const paginationTag =
    <Stack spacing={2}>
      <Pagination count={totalPages} page={pageNo} onChange={handlePageChange} />
    </Stack>;

  return (
    <div>
      {!isLoading ? (
        <>
          {momCardContainer}
          {paginationTag}
        </>
      ) : (
        <DrawerSkeleton />
      )}
      {/* <div className="d-flex flex-column" style={{ rowGap: "10px" }}>
        <Stack sx={{ width: "100%", background: "#eaf8ff" }} spacing={2}>
          <Alert variant="outlined" severity="info">
            This Document has more data. To view all data please press export
            button.
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
      </div> */}
    </div>
  );
}

export default MOM;
