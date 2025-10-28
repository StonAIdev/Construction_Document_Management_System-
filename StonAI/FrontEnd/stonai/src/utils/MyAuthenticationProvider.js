import { InteractionRequiredAuthError, InteractionType } from "@azure/msal-browser";
import { Client } from '@microsoft/microsoft-graph-client';
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";

export class MyAuthenticationProvider {

    /**
     * This method will get called before every request to the ms graph server
     * This should return a Promise that resolves to an accessToken (in case of success) or rejects with error (in case of failure)
     * Basically this method will contain the implementation for getting and refreshing accessTokens
     */
    getAccessToken(instance) {
        return new Promise(async (resolve, reject) => {
            const account = instance.getActiveAccount();
            let response;

            if (!account) {
                throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
            }

            response = await instance.acquireTokenSilent({
                account: account,
                scopes: ["Mail.ReadBasic", "Mail.Read"]
            });

            if (response.accessToken) {
                resolve(response.accessToken);
            } else {
                reject(Error('Failed to acquire an access token'));
            }
        });
    }
}

