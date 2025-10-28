import { useState, useRef } from "react";
import {
  Box,
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
  const [currentPassword, setCurrentPassword] = useState("");
  const [changePassword, setChangePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
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
  };

  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };

  const handlePasswordChange = async (event) => {
    if (changePassword !== confirmPassword) {
      alert("New password and Confirm password do not match");
      return;
    }

    try {
      await axios
        .post(
          url + "/userinfo/changePassword",
          {
            userId: props.user.user_id,
            username: props.user.username,
            currentPassword: currentPassword,
            changePassword: changePassword,
            confirmPassword: confirmPassword,
          },
          {
            headers: { token: props.user.token },
          }
        )
        .then((response) => {
          if (response.data === "Password not matched") {
            alert("Password do not match, User not updated");
          } else {
            putFileToS3(file);
            handleClickVariant("success", "User updated success");
            setProfileEdit(true);
          }
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
                Edit Password
              </Heading1>
            </div>

            <Divider />
            <CardContent>
              <Grid container spacing={3} className="">
                <Grid item md={6} xs={12} className="">
                  <h6 style={{ fontWeight: 750, color: "#696969" }}>
                    Change Password
                  </h6>
                </Grid>
                <Grid item md={6} xs={12} className=""></Grid>
                <Grid item md={6} xs={12} className="">
                  <TextField
                    required
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                    }}
                    value={currentPassword}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="New Password"
                    name="changePassword"
                    onChange={(e) => {
                      setChangePassword(e.target.value);
                    }}
                    value={changePassword}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Confirm new Password"
                    name="confirmPassword"
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                    value={confirmPassword}
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
              <Button
                variant="contained"
                onClick={handlePasswordChange}
                // disabled={currentPassword && currentPassword.length > 0 ? false : true}
              >
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
