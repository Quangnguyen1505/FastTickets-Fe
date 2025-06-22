import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const getCheckout = (show_time_id, user_order, snacks_order, controller, discount_id = null) => {
    const body = {
        user_order,
        snacks_order,
        discount_id
    }
    const url = `${baseUrl}/v1/api/bookings/checkout/${show_time_id}`;
    return axios.post(url, body, 
        { signal: controller.signal });
};

export const getBookingHistory = (userId, accessToken, params, controller) => {
    console.log("params booking history", params)
    console.log("userId booking history", userId)  
    console.log("accessToken booking history", accessToken)
    const { limit = 10, page = 1 } = params;
    const url = `${baseUrl}/v1/api/bookings/history/users`;
    return axios.get(url, {
        headers: { 
            authorization: `Bearer ${accessToken}`,
            "x-client-id": userId
        },
        params: {
            limit,
            page,
        },
        signal: controller.signal,
    });
}

export const updateBookingStatus = (bookingId, accessToken, userId) => {
    const url = `${baseUrl}/v1/api/bookings/${bookingId}`;
    return axios.put(url, {}, {
        headers: {
            authorization: `Bearer ${accessToken}`,
            "x-client-id": userId
        }
    });
}