import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/free-solid-svg-icons";
import { Box, Checkbox } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import "./NotificationModel.css";
import ButtonStyled from "../../Reusable Components/Buttons/ButtonStyled";
import { Formik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { url } from "../../url";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function NotificationModel({
  homeslider,
  sethomeslider,
  Notify,
  documentToNotify,
  user,
  project,
}) {
  const [selectedContacts, setSelectedContacts] = useState();
  const [action, setAction] = useState();
  const handleCloseModel = () => {
    setSelectedContacts(null);
    setAction(null);
  };
  const handleSelectedUserChange = (e, option) => {
    setSelectedContacts(option);
  };
  const handleActionChange = (e, value) => {
    console.log("logo", value);
    setAction(value?.label);
  };
  const [users, setUsers] = useState();

  const getProjectUsers = async () => {
    try {
      const res = await axios.post(
        url + "/userInfo/getProjectUsers",
        {
          project_id: project.project_id,
        },
        {
          headers: { token: user.token },
        }
      );
      setUsers(res.data);
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };
  useEffect(() => {
    getProjectUsers();
    console.log("documentToNotify", documentToNotify);
  }, []);
  return (
    <Formik
      initialValues={{
        action: "",
        message: ""
      }}

      // validationSchema={Yup.object().shape({
      //   action: Yup.string().required("Required"),
      //   message: Yup.string().required("Required")
      // })}

      onSubmit={async (values, { resetForm }) => {


        values.receivers = selectedContacts;
        values.action = action;
        values.document_id = documentToNotify;
        Notify(values);
        handleCloseModel();
        resetForm();
        sethomeslider(false);


      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form onSubmit={handleSubmit}>
          {" "}
          <div className="">
            {/* <div className="home_area w-100 p-0 m-0"> */}
            {homeslider && (
              <div
                className="PopupDiv"
                onClick={(e) => {
                  sethomeslider(false);
                }}
              >
                <div
                  className="PopupBody"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="">
                    <div className="popupHead">
                      <h4>Document Notify</h4>

                    </div>

                    <div className="popupBody">
                      <div className="d-flex justify-content-between my-2">
                        <Autocomplete
                          style={{ width: "100%" }}
                          onChange={(e, option) => {
                            handleSelectedUserChange(e, option);
                          }}
                          multiple
                          id="checkboxes-tags-demo"
                          options={users}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option.username}
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                              />
                              {option.username}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Contacts"
                              placeholder="Favorites"
                             
                            />
                          )}
                        />
                      </div>

                      <div className="d-flex justify-content-between my-2">
                        <Autocomplete
                          disablePortal
                          name="action"
                          value={action}
                          helperText={touched.action && errors.action}
                          onChange={(e, value) => {
                            console.log("vale", value);
                            handleActionChange(e, value);
                          }}
                          style={{ width: "100%" }}
                          id="combo-box-demo"
                          options={actions}
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField {...params} label="Action" />
                          )}
                        />
                      </div>

                      <div className="my-2">
                        <TextField
                          error={Boolean(touched.message && errors.message)}
                          helperText={touched.message && errors.message}
                          id="BodyText"
                          label="Message"
                          multiline
                          name="message"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.message}
                          rows={10}
                          style={{
                            width: "100%",
                          }}
                        />
                      </div>

                      {/* <div className='scrollableSection' >
                                  Scroll data
                              </div> */}
                    </div>

                    <div>
                      <div className="popupFooter">
                        <ButtonStyled
                          border="2px solid var(--blue)"
                          paddingInline=".7rem"
                          paddingBlock="0.2rem"
                          borderRadius="8px"
                          width="20%"
                          color="var(--blue)"
                          style={{ cursor: "pointer" }}
                          className="mx-1"
                          onClick={(e) => {
                            handleCloseModel();
                          }}
                        >
                          Cancel
                        </ButtonStyled>

                        <ButtonStyled
                          backgroundColor="var(--blue)"
                          border="2px solid var(--blue)"
                          paddingInline=".7rem"
                          paddingBlock="0.2rem"
                          borderRadius="8px"
                          width="20%"
                          color="white"
                          style={{ cursor: "pointer" }}
                          className="mx-1"
                          onClick={handleSubmit}
                        >
                          Send
                        </ButtonStyled>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* </div> */}
          </div>
        </form>
      )}
    </Formik>
  );
}

const actions = [
  { label: "Infomation", id: 1 },
  { label: "Approve", id: 2 },
  { label: "Reject", id: 3 },
];

export default NotificationModel;
