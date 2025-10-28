import { loginRequest } from "../authConfig";
import { msalInstance } from "../App";

export async function callMsGraphEndpoint(endPoint, userInfo) {
  const account = msalInstance.getActiveAccount();
  console.log("accounnttt", account);

  if (!account) {
    await msalInstance
      .loginPopup(loginRequest)
      .then(function (response) {
        console.log("signed in sucess", response);
        if (
          userInfo.email_address?.toLowerCase() ===
          response.account.username?.toLowerCase()
        ) {
          window.location.reload();
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
    console.log(response.accessToken);
    headers.append("Authorization", bearer);
    headers.append("Prefer", "outlook.body-content-type='text'");

    const options = {
      method: "GET",
      headers: headers,
    };

    const graphData = await fetch(endPoint, options)
      .then((response) => response.json())
      .catch((error) => console.log(error));
    return graphData;
  } else {
    return "nodata";
  }
}
