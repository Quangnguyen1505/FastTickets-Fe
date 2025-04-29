import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const ApiloginSuccess = (id, oauth_hash_confirm, controller) => {
    const body = {
        id: id,
        oauth_hash_confirm: oauth_hash_confirm,
    };
    const url = `${baseUrl}/v1/api/oauth/login-success`;
    return axios.post(url, body, {
      signal: controller.signal,
    });
};