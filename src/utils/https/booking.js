import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const getCheckout = (show_time_id, user_order, controller) => {
    const body = {
        user_order
    }
    const url = `${baseUrl}/v1/api/bookings/checkout/${show_time_id}`;
    return axios.post(url, body, 
        { signal: controller.signal });
};