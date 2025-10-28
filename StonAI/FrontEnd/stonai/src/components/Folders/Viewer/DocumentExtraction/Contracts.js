import React, { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Heading1 from "../../../../Reusable Components/Headings/Heading1";
import { Box, Container, Grid, IconButton } from "@material-ui/core";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { CircularProgress } from "@mui/material";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import ButtonStyled from "../../../../Reusable Components/Buttons/ButtonStyled";
import { url } from "../../../../url";
import axios from "axios";

function Contracts({ extractedFeilds, user, userInfo, project, update }) {
  const listInnerRef = useRef();
  const [expanded, setExpanded] = React.useState(false);
  const [contractData, setContractData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startFrom, setStartFrom] = useState(0);
  const [endOfDocument, setEndOfDocument] = useState(false);

  var skeletonTag = <Skeleton count={5} height="30px" />;
  var contractDataAccordian = contractData.map((data) => {
    return (
      <Accordion
        aria-controls="panel1a-content"
        id="panel1a-header"
        style={{
          boxShadow: " rgba(0, 0, 0, 0.15) 0px 2px 5px",
          marginBottom: "10px",
        }}
      >
        <AccordionSummary className="metal" expandIcon={<ExpandMoreIcon />}>
          <Heading1 size="1.2em" weight="500" JFcontent="left">
            {data.Heading}
          </Heading1>
        </AccordionSummary>

        <AccordionDetails>
          <Heading1
            size="1.1em"
            weight="600"
            width="fit-content"
            JFcontent="left"
          >
            {data.Text}
          </Heading1>
        </AccordionDetails>
      </Accordion>
    );
  });

  const getDocData = async () => {
    try {
      const res = await axios.post(
        url + "/Document/getPdfContractDoc",
        {
          document_id: extractedFeilds.document_id,
        },
        {
          headers: { token: user.token },
        }
      );
      console.log("res.data", res.data);
      setContractData(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  const getNextDocData = async () => {
    try {
      const res = await axios.post(
        url + "/Document/getNextPdfContractDoc",
        {
          document_id: extractedFeilds.document_id,
          startFrom: startFrom,
          endOfDocument: endOfDocument,
        },
        {
          headers: { token: user.token },
        }
      );
      if (res.data.length === 0) {
        setEndOfDocument(true);
      } else {
        res.data.forEach((item) => {
          contractData.push(item);
        });
        console.log(contractData);
        setContractData(contractData);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  const onScroll = () => {
    if (!endOfDocument) {
      if (listInnerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
        if (scrollTop + clientHeight === scrollHeight) {
          console.log("reached bottom");
          if (isLoading == false) {
            setIsLoading(true);
            setStartFrom(startFrom + 5);
            getNextDocData();
          }
        }
      }
    }
  };

  useEffect(() => {
    getDocData();
    console.log("responsibilityData", extractedFeilds);
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <div
        onScroll={onScroll}
        ref={listInnerRef}
        style={{ height: "89vh", overflow: "auto" }}
      >
        {!isLoading ? (
          <>{contractDataAccordian}</>
        ) : (
          // contractData.map((data) => {
          //   return (
          //     <Accordion
          //       aria-controls="panel1a-content"
          //       id="panel1a-header"
          //       style={{
          //         boxShadow: " rgba(0, 0, 0, 0.15) 0px 2px 5px",
          //         marginBottom: "10px",
          //       }}
          //     >
          //       <AccordionSummary
          //         className="metal"
          //         expandIcon={<ExpandMoreIcon />}
          //       >
          //         <Heading1 size="1.2em" weight="500" JFcontent="left">
          //           {data.Heading}
          //         </Heading1>
          //       </AccordionSummary>

          //       <AccordionDetails>
          //         <Heading1
          //           size="1.1em"
          //           weight="600"
          //           width="fit-content"
          //           JFcontent="left"
          //         >
          //           {data.Text}
          //         </Heading1>
          //       </AccordionDetails>
          //     </Accordion>
          //   );
          // })
          <>
            {contractDataAccordian}
            {skeletonTag}
          </>
        )}
        {endOfDocument ? (
          <Stack sx={{ width: "100%", background: "#eaf8ff" }} spacing={2}>
            <Alert variant="outlined" severity="info">
              You have reached the end of document.
            </Alert>
          </Stack>
        ) : null}

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
