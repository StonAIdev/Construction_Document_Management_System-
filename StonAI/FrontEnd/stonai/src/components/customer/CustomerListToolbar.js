import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Grid,
  InputAdornment,
  SvgIcon,
} from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";
import React, { useState } from "react";
import Answer from "../search/Answer";
import Context from "../search/Context";
import axios from "axios";

const CustomerListToolbar = (props) => {
  const [name, setName] = useState("");
  const [print, setPrint] = useState("");
  const [show, setShow] = useState(false);
  const [data, setData] = useState();
  const [render, setRender] = useState(true);

  const DisplayPeople = ({ people }) => {
    return (
      <>
        <Box
          sx={{
            backgroundColor: "background.default",
            minHeight: "100%",
            py: 3,
          }}
        >
          <Container maxWidth={false}>
            <Grid container spacing={3}>
              {people.data.map((value) => (
                <Grid item lg={3} sm={6} xl={3} xs={12}>
                  <Answer item={value} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        <Box
          sx={{
            backgroundColor: "background.default",
            minHeight: "100%",
            py: 3,
          }}
        >
          <Container maxWidth={false}>
            <Grid container spacing={3}>
              <>
                {data.data.map((value) => (
                  <Grid item lg={12} sm={12} xl={12} xs={12}>
                    <Context item={value} />
                  </Grid>
                ))}
              </>
            </Grid>
          </Container>
        </Box>
      </>
    );
  };

  const sendSentence = async (sentence) => {
    const text = sentence;
    const response = await axios.post("http://127.0.0.1:5000/getAnswer", {
      text,
    });
    setData(response.data);
    setRender(false);
  };

  function onChangeHandler(val) {
    setName(val.target.value);
    setShow(false);
  }
  const clickButtonHandler = async () => {
    const res = await sendSentence(name);
  };

  return (
    <Box {...props}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={clickButtonHandler}
        >
          Search Answer
        </Button>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500 }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                onChange={onChangeHandler}
                placeholder="Ask Something"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      {data ? <DisplayPeople people={data} /> : null}
    </Box>
  );
};

export default CustomerListToolbar;
