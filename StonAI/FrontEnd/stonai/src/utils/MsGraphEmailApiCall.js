import { loginRequest, graphConfig } from "../authConfig";
import { msalInstance } from "../App";

export async function callMsGraph(userInfo) {
  const account = msalInstance.getActiveAccount();
  console.log("msalInstaceHere", msalInstance);
  console.log("accounnttt", account);
  if (!account) {
    await msalInstance
      .loginPopup(loginRequest)
      .then(function (response) {
        console.log(
          "signed in sucess",
          response,
          userInfo.email_address,
          response.account.username
        );
        if (
          userInfo.email_address?.toLowerCase() ===
          response.account.username?.toLowerCase()
        ) {
          // window.location.reload();
        } else {
        }

        // success response
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  if (
    userInfo.email_address?.toLowerCase() === account?.username?.toLowerCase()
  ) {
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: account,
    });

    const headers = new Headers();
    const bearer = `Bearer ${response.accessToken}`;

    headers.append("Authorization", bearer);
    headers.append("Prefer", "outlook.body-content-type='text'");

    console.log("tokeennnn", response.accessToken);

    const options = {
      method: "GET",
      headers: headers,
    };

    const graphData = await fetch(graphConfig.graphMailEndpoint, options)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    console.log("graphDataChanged", graphData);

    return graphData;
  } else {
    return "nodata";
  }
}
