import { useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Login } from "./Login";

// Msal imports
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";
import {
  InteractionStatus,
  InteractionType,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import EmailError from "./EmailError";

// Sample app imports
import { Loading } from "./Loading";
import { ErrorComponent } from "./ErrorComponent";
import { callMsGraphEndpoint } from "../utils/MSGraphEndPointCall";
import { msalInstance } from "../App";

import Mails from "../pages/Mails";

const EmailContent = ({ user, project, userInfo, department }) => {
  const { instance, inProgress } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const [isRegisterAccount, setisRegisterAccount] = useState(false);
  const account = msalInstance.getActiveAccount();
  const [readCount, setReadCount] = useState(0);

  useEffect(() => {
    if (!graphData) {
      callMsGraphEndpoint(
        "https://graph.microsoft.com/v1.0/me/mailFolders/JunkEmail/messages?$top=50",
        userInfo
      )
        .then((response) => {
          console.log("respEmails", response);

          if (response !== "nodata") {
            setGraphData(response);
          } else {
            console.log("checkVlaid", response);
            setisRegisterAccount(true);
          }
        })
        .catch((e) => {
          if (e instanceof InteractionRequiredAuthError) {
            instance.acquireTokenRedirect({
              ...loginRequest,
              account: instance.getActiveAccount(),
            });
          }
        });
    }
  }, []);
  console.log("graphdata", graphData);

  return (
    <div>
      {graphData && !isRegisterAccount ? (
        <Mails
          graphData={graphData}
          user={user}
          title="junk"
          project={project}
          userInfo={userInfo}
          department={department}
          readCount={readCount}
          setReadCount={setReadCount}
        />
      ) : !isRegisterAccount ? (
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
      ) : (
        <EmailError userInfo={userInfo} account={account} />
      )}
    </div>
  );
};

export function Junk({ user, project, userInfo, department }) {
  const authRequest = {
    ...loginRequest,
  };

  return (
    <EmailContent
      user={user}
      project={project}
      userInfo={userInfo}
      department={department}
    />
  );
}
