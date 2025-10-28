import React, { useEffect, useState } from "react";
import Heading1 from "../../../../Reusable Components/Headings/Heading1";
import { Box, Container, Grid, IconButton } from "@material-ui/core";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { CircularProgress } from "@mui/material";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Alert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import ButtonStyled from "../../../../Reusable Components/Buttons/ButtonStyled";
import { url } from "../../../../url";
import axios from "axios";
import {
  faFont,
  faBars,
  faBuilding,
  faComments,
  faCopy,
  faFileAlt,
  faFilter,
  faHashtag,
  faPaperPlane,
  faSearch,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableCardChips from '../../../../components/search/Contracts/TableCardChips';
import DrawerSkeleton from "../../../../Reusable Components/Skeleton/DrawerSkeleton";

var totalPages = 0;
var startFrom = 0;

function Contracts({ extractedFeilds, user, userInfo, project }) {
  const [expanded, setExpanded] = React.useState(false);
  const [BoqResult, setBoqResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);

  const getDocData = async () => {
    try {
      const res = await axios.post(
        url + "/Document/getBOQDoc",
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
      setBoqResult(res.data.hits);
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
        url + "/Document/getNextBOQDoc",
        {
          document_id: extractedFeilds.document_id,
          startFrom: startFrom,
        },
        {
          headers: { token: user.token },
        }
      );

      setBoqResult(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  useEffect(() => {
    startFrom = 0;
    totalPages = 0;
    getDocData();
    console.log("responsibilityData", extractedFeilds);
  }, []);

  var boqData = BoqResult.map((row, i) => (
    <div style={{ marginBottom: "15px" }} className='TableCard'>
      <div className='d-flex align-items-center w-100 justify-content-between'>
        <div className='d-flex flex-column' style={{ rowGap: "5px" }}>
          <Heading1
            color="grey"
            paddingBlock=""
            size="1.08rem"
            weight="520"
            JFcontent="left"
            marginBottom="0px"
          >
            <FontAwesomeIcon
              icon={faFileAlt}
              style={{ color: "var(--green)", marginRight: "8px" }}
            />
            {row.name}
          </Heading1>
        </div>
      </div>
      <div className='d-flex flex-wrap w-100' style={{ columnGap: "10px", rowGap: "10px", marginTop: ".5em" }}>
        {row.Columns.map((attribute) => {
          return (
            <TableCardChips row={row} attribute={attribute} />

          );
        })}
      </div>
    </div>
  ))

  const paginationTag =
    <Stack spacing={2}>
      <Pagination count={totalPages} page={pageNo} onChange={handlePageChange} />
    </Stack>;

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      {!isLoading ? (
        <>
          {boqData}
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

export default Contracts;

const ContractData = [
  {
    id: 1,
    FieldTitle: "Field Title",
    Details: "D E T A I L S",
  },

  {
    id: 2,
    FieldTitle: "Field Title",
    Details: "D E T A I L S",
  },

  {
    id: 3,
    FieldTitle: "Field Title",
    Details: "D E T A I L S",
  },

  {
    id: 4,
    FieldTitle: "Field Title",
    Details: "D E T A I L S",
  },

  {
    id: 5,
    FieldTitle: "Field Title",
    Details: "D E T A I L S",
  },

  {
    id: 6,
    FieldTitle: "Field Title",
    Details: "D E T A I L S",
  },

  {
    id: 7,
    FieldTitle: "Field Title",
    Details: "D E T A I L S",
  },

  {
    id: 8,
    FieldTitle: "Field Title",
    Details: "D E T A I L S",
  },

  {
    id: 9,
    FieldTitle: "Field Title",
    Details: "D E T A I L S",
  },

  {
    id: 10,
    FieldTitle: "Field Title",
    Details: "D E T A I L S",
  },
];
