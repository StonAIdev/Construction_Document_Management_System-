import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import axios from "axios";
import "./Mails.css";
import EmailsList from "../components/mails/pc/EmailsList";
import EmailsListMobile from "../components/mails/mobile/EmailsListMobile";
import CircularProgress from "@mui/material/CircularProgress";
import { Card, Grid, Container, Typography, Badge, Chip } from "@mui/material";
import { url } from "../url";
import { SignOutButton } from "../outlook_components/SignOutButton";
import WelcomeName from "../outlook_components/WelcomeName.jsx";
import MailIcon from "@mui/icons-material/Mail";
import Search from "../components/mails/pc/Search";
import NoData from "./Assets/NoData";

export const Mails = ({
  graphData,
  title,
  user,
  project,
  userInfo,
  department,
  readCount,
  setReadCount
}) => {
  const [emails, setEmails] = useState(null);
  const [isLoading, setIsloading] = useState(true);

  // const [projectUsers, setProjectUsers] = useState([]);
  var [searchBarVal, setSearchBarVal] = useState("");
  // const [outlookRecv, setoutlookRecv] = useState("");

  const [isFilter, setIsFilter] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [filterOrData, setFilterOrData] = useState(false);
  console.log("filter lga ya nai", filterOrData);
  const handleClick = () => {
    console.info("You clicked the Chip.");
  };

  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  const postToDatabase = async () => {
    var messagesDB = [];
    graphData.value.map((g, i) => {
      // g.toRecipients.map((a) => console.log(a.emailAddress.name));

      const obj = {
        id: g.id,
        subject: g.subject,
        sender: g.sender,
        attachment: g.hasAttachments,
        body: g.body.content,
        isDraft: g.isDraft,
        fromAdress: g.from.emailAddress.address,
        read: false,
        toRecipients: g.toRecipients,
        from: g.from.emailAddress.name,
        to: g.createdDateTime,
        mailType: title,
        user_id: user.user_id,
        // sentTo: g.toRecipients.map((a) => a.emailAddress.name),
      };

      messagesDB.push(obj);
    });
    const messagesLen = messagesDB.length;
    console.log("lenhyjdfsdfsdfsdfsdfsdf", messagesDB);

    if (messagesLen !== 0) {
      await axios.post(
        url + "/Email/create",
        { emails: messagesDB },
        {
          headers: { token: user.token, "Access-Control-Allow-Origin": "*" },
        }
      );
    }
  };
  const getFromDatabase = async () => {
    if (filterOrData) {
      setEmails(filterData);
    } else {
      var count = 0;

      console.log("gettetetewgewgweg");
      const response = await axios.post(
        url + "/Email/getMails",
        { user_id: user.user_id, title: title },
        {
          headers: { token: user.token },
        }
      );

      console.log("recvv", response.data);
      response.data.map((g, i) => {
        // g.toRecipients.map((a) => console.log(a.emailAddress.name));

        if (!g.is_read) {
          count = count + 1;
        }
      });
      setReadCount(count);
      setEmails(response.data);
      setIsloading(false);
    }
  };

  const asyncDbAPIs = async () => {
    if (filterOrData) {
      await getFromDatabase();
    } else {
      await postToDatabase();
      // await getUsers();
      // await getReceivers();
      await getFromDatabase();
    }
  };

  const handleSearch = (event) => {
    setSearchBarVal((searchBarVal = event.target.value));
  };
  useEffect(() => {
    console.log("calleedddd");
    asyncDbAPIs();
    // const responseRec = await axios.get(url + "/Email/getRec");
    // response.data.rows.map((g) => {
    //   const obj = {
    //     id: g.email_id,
    //     address: g.email_address,
    //   };
    // });
  }, [filterOrData, filterData, isFilter]);

  console.log("isFilter", isFilter);

  return (
    <div>
      {!isLoading ? (
        <div>
          <Card
            style={{ paddingTop: 10, marginTop: 10 }}
            className=" px-1 mx-1"
          >
            <Grid container spacing={1} className="">
              <Grid
                item
                style={{ marginTop: 12, textAlign: "left", marginLeft: 10 }}
              >
                <Typography
                  variant="h4"
                  component="div"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  {title.toUpperCase()}
                </Typography>
              </Grid>
              {filterOrData ? (
                <Grid item style={{ marginTop: 12 }}>
                  {" "}
                  <Chip
                    label="Filters applied"
                    // onClick={handleClick}
                    // onDelete={handleDelete}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                </Grid>
              ) : null}

              <Grid item style={{ marginTop: 10, marginRight: "auto" }}>
                <Badge badgeContent={readCount} color="primary">
                  <MailIcon color="action" />
                </Badge>
              </Grid>
              <Grid
                item
                xs={6}
                style={{ textAlign: "center" }}
                className="mailsearchbox "
              >
                <Search
                  handleSearch={handleSearch}
                  // outlookRecv={outlookRecv}
                  user={user}
                  isFilter={isFilter}
                  setIsFilter={setIsFilter}
                  setFilterData={setFilterData}
                  filterOrData={filterOrData}
                  setFilterOrData={setFilterOrData}
                  readCount={readCount}
                  setReadCount={setReadCount}
                />
              </Grid>

              <Grid item style={{ marginTop: 12, marginLeft: "auto" }}>
                <WelcomeName />
              </Grid>
              <Grid item style={{ marginTop: 1 }}>
                <SignOutButton title="validAccount" />
              </Grid>
            </Grid>
          </Card>

          <Box sx={{ mt: 1, ml: 1, mr: 1 }} className="mobileview">
            <EmailsListMobile
              emails={emails}
              title={title}
              project={project}
              userInfo={userInfo}
              user={user}
              searchBarVal={searchBarVal}
              setSearchBarVal={setSearchBarVal}
              department={department}
              setEmails={setEmails}
              readCount={readCount}
              setReadCount={setReadCount}
            />
          </Box>
          <Box sx={{ mt: 1, ml: 1, mr: 1 }} className="desktopView">
            {emails.length > 0 ? (
              <EmailsList
                emails={emails}
                title={title}
                project={project}
                userInfo={userInfo}
                // projectUsers={projectUsers}
                user={user}
                searchBarVal={searchBarVal}
                setSearchBarVal={setSearchBarVal}
                department={department}
                setEmails={setEmails}
                filterOrData={filterOrData}
                readCount={readCount}
                setReadCount={setReadCount}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <NoData />
              </Box>
            )}
          </Box>
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </div>
  );
};

export default Mails;
