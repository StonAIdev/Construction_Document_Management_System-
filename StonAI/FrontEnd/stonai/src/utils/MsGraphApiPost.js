import { loginRequest } from "../authConfig";
import { msalInstance } from "../App";

export async function callMsGraphEndpointPost(endPoint) {
  const account = msalInstance.getActiveAccount();
  if (!account) {
    throw Error(
      "No active account! Verify a user has been signed in and setActiveAccount has been called."
    );
  }

  const response = await msalInstance.acquireTokenSilent({
    ...loginRequest,
    account: account,
  });

  const headers = new Headers();
  const bearer = `Bearer ${response.accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "POST",
    headers: headers,
  };

  return fetch(endPoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
