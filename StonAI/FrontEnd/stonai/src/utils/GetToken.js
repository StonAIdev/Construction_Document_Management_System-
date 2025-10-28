import { loginRequest, graphConfig } from "../authConfig";
import { msalInstance } from "../App";

export async function getToken() {
  const account = msalInstance.getActiveAccount();
  console.log("account", account);
  if (!account) {
    msalInstance
      .loginPopup(loginRequest)
      .then(function (response) {
        // success response
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  if (account) {
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: account,
    });

    const headers = new Headers();
    // const bearer = `Bearer ${response.accessToken}`;
    const token = response.accessToken;
    console.log("tokenGet", token);

    return token;
  }
}
