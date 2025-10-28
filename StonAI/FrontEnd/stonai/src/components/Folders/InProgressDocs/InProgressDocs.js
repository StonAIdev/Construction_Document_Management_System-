import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import { url } from "../../../url";
import axios from "axios";
import { CircularProgress, Box } from "@mui/material";

function InProgressDocs({ user }) {
  var [files, setFiles] = useState([]);
  var [isLoading, setLoading] = useState(false);

  const getFilesFromDatabase = async () => {
    console.log("getfiles", isLoading);
    setLoading(true);
    const res = await axios.get(url + "/Document/get", {
      headers: { token: user.token },
    });

    const files_db = res.data;
    var arr = [];

    const getfilesurl = async (element) => {
      const response = await axios(
        "https://g0ajndudsk.execute-api.ap-south-1.amazonaws.com/default/getPresignedURLGetObject?fileName=" +
          element.document_name
      );
      element["urls"] = response.data.uploadURL;
      return element;
    };
    for (const element of files_db) {
      const ele = await getfilesurl(element);
      arr.push(ele);
    }
    setFiles(arr);
    console.log("beforeSetloading", files);
    setLoading((isLoading = false));
  };

  useEffect(() => {
    getFilesFromDatabase();
  }, []);
  console.log(files);
  return (
    <>
      {!isLoading ? (
        files.length > 0 ? (
          <DataTable user={user} files={files} />
        ) : (
          "nothing in the folder"
        )
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
    </>
  );
}

export default InProgressDocs;
