import React, { useState } from "react";
import { Box, Stack, Button } from "@mui/material";
import ButtonStyled from "../../../Reusable Components/Buttons/ButtonStyled";
import LoadingButton from '@mui/lab/LoadingButton';
import axios from "axios";
import { url } from "../../../url";
import "./DocModal.css";
import Folder from "./FolderEmail";

const Docmodal = ({
  docmodal,
  handleClose,
  user,
  userInfo,
  project,
  files,
  setFiles,
  stonAiAttachments,
  setStonAiAttachments,
  permisions,
  value,
  task_id,
  loading,
  setLoading,
  handleClickVariant


}) => {
  let [checkedDocs, setCheckedDocs] = useState([]);
  const [name, setName] = React.useState("");
  const handleChange = (event) => {
    setName(event.target.value);
  };


  const handleAttachFiles = async () => {
    console.log("newCheckedDocs", checkedDocs);
    setLoading(true);
    for (const file of checkedDocs) {

      const res = await axios.post(url + "/Tasks/uploadAttachments", {
        task_id: task_id,
        project_id: project.project_id,
        name: file.name,
        type: file.type,
        size: file.size,

      }, { headers: { token: user.token } });
      console.log("res", res.data);

      const response = await axios(
        "https://cgwhfo8k3m.execute-api.ap-south-1.amazonaws.com/default/getPresignedURL?fileName=" +
        res.data + "task"
      );
      const uploadURL = response.data.uploadURL;

      var config = {
        headers: { "content-type": file.type },

      };
      await axios.put(uploadURL, file, config);
      setLoading(false);

    }

    handleClickVariant("success", "Files Attached Successfully")


    setFiles([]);
    setCheckedDocs([]);
    // handleClose();
  };
  return (


    <Folder
      project={project}
      userInfo={userInfo}
      user={user}
      checkedDocs={checkedDocs}
      setCheckedDocs={setCheckedDocs}
      name={name}
      setName={setName}
      permisions={permisions}
      value={value}
      handleAttachFiles={handleAttachFiles}
      handleClose={handleClose}
      loading={loading}
    />





  );
};

export default Docmodal;
