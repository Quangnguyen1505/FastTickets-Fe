import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const getNotifications = (userId, accessToken, controller) => {
    const url = `${baseUrl}/v1/api/noti/${userId}`;
    return axios.get(url, {
        headers: { 
            authorization: `Bearer ${accessToken}`,
            "x-client-id": userId
        },
        signal: controller.signal
    });
};