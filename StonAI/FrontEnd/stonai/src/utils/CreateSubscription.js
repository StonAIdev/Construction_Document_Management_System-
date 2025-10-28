import { getToken } from "./GetToken";

export const createSubscription = async () => {
  const res = await getToken();
  let date = new Date();
  date.setDate(date.getDate() + 2.9375);
  const header2 = new Headers();
  header2.append("Authorization", res);
  header2.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    changeType: "created",
    notificationUrl:
      "https://primaryfunction.azurewebsites.net/api/HttpTrigger1?",
    resource: "/me/messages",
    expirationDateTime: date,
    clientState: "fab4afd2-c6db-4e42-9b77-7a7f54550d77",
    latestSupportedTlsVersion: "v1_2",
  });

  var requestOptions = {
    method: "POST",
    headers: header2,
    body: raw,
    redirect: "follow",
  };

  return fetch(
    "https://graph.microsoft.com/v1.0/subscriptions/",
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
};
