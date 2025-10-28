import { useState, useRef } from "react";
import {
  Box,
  Avatar,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
} from "@material-ui/core";
import Heading1 from "../../Reusable Components/Headings/Heading1";

import axios from "axios";
import { url } from "../../url";
import { useSnackbar } from "notistack";

const AccountProfileDetails = (props) => {
  let { ProfileEdit, setProfileEdit } = props;

  const [file, setFile] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleClickVariant2 = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };
  const putFileToS3 = async (pic) => {
    const response = await axios(
      "https://cgwhfo8k3m.execute-api.ap-south-1.amazonaws.com/default/getPresignedURL?fileName=" +
        props.user.user_id
    );
    const url = response.data.uploadURL;

    var config = {
      headers: { "content-type": pic.type },
    };
    await axios.put(url, pic, config);
    handleClickVariant2("success", "profile picture  updated");
  };

  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };

  const handleUserDetailsChange = async (event) => {
    try {
      await axios
        .post(
          url + "/userinfo/updateUser",
          {
            // username: props.user.username,
            firstName: props.values.firstName,
            lastName: props.values.lastName,
            phone: props.values.phone,
            country: props.values.country,
            userId: props.user.user_id,
          },
          {
            headers: { token: props.user.token },
          }
        )
        .then((response) => {
          handleClickVariant("success", "User updated success");
          setProfileEdit(true);
        })
        .catch((error) => {
          console.log("There was an error!", error);
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {!ProfileEdit && (
        <form autoComplete="off" noValidate {...props}>
          <Card>
            <div style={{ marginLeft: "0.8em", marginTop: "0.5em" }}>
              <Heading1
                color="var(--blue)"
                width="fit-content"
                size="1.3em"
                weight="500"
              >
                Edit Details
              </Heading1>
            </div>

            <Divider />
            <CardContent>
              <Grid container spacing={3} className="">
                <Grid item md={12} xs={12} className="d-flex">
                  <div>
                    <Avatar
                      src={props.values.image}
                      sx={{
                        height: 160,
                        width: 160,
                        boxShadow: "rgba(0, 0, 0, 0.35) 1px 2px 10px",
                      }}
                    />
                  </div>

                  <div style={{ marginTop: "7em", marginLeft: "2em" }}>
                    <Button
                      variant="contained"
                      onClick={handleClick}
                      width="fit-content"
                      style={{ cursor: "pointer", color: "var(--blue)" }}
                      className="FiltersClicked m-0"
                    >
                      Change Profile Picture
                    </Button>
                    <input
                      //style={{color:"blue",backgroundColor:"blue"}}
                      style={{ display: "none" }}
                      ref={hiddenFileInput}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files.length !== 0) {
                          const selectedFile = e.target.files[0]; // Directly use the file from the event
                          setFile(selectedFile); // Update the state
                          props.setValues({
                            ...props.values,
                            image: URL.createObjectURL(selectedFile), // Use the selected file for the preview
                          });
                          console.log("file is ", selectedFile);
                          putFileToS3(selectedFile);
                          // Use the selected file for uploading
                        }
                      }}
                    />
                  </div>
                </Grid>
                <Grid item md={12} xs={12} className="">
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <h6 style={{ fontWeight: 750, color: "#696969" }}>
                      Account Details
                    </h6>
                  </div>
                </Grid>

                <Grid item md={6} xs={12} className="">
                  <TextField
                    fullWidth
                    label="First name"
                    name="firstName"
                    onChange={(e) => {
                      props.setValues({
                        ...props.values,
                        firstName: e.target.value,
                      });
                    }}
                    value={props.values.firstName}
                    size="="
                    small
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Last name"
                    name="lastName"
                    onChange={(e) => {
                      props.setValues({
                        ...props.values,
                        lastName: e.target.value,
                      });
                    }}
                    value={props.values.lastName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    onChange={(e) => {
                      props.setValues({
                        ...props.values,
                        phone: e.target.value,
                      });
                    }}
                    value={props.values.phone}
                    type="text"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    onChange={(e) => {
                      props.setValues({
                        ...props.values,
                        country: e.target.value,
                      });
                    }}
                    value={props.values.country}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: 2,
              }}
            >
              <Button variant="contained" onClick={handleUserDetailsChange}>
                UPDATE
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </>
  );
};

export default AccountProfileDetails;
