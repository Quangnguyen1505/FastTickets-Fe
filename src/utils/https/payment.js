import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const genUrlPaymentMomo = (userId, accessToken, show_time_id, user_order_book, snacks_order, controller, discount_id = null) => {
    const body = {
        show_time_id,
        user_order_book,
        snacks_order,
        discount_id
    }
    const url = `${baseUrl}/v1/api/payment`;
    return axios.post(url, body, 
        { 
            signal: controller.signal,
            headers: { 
                authorization: `Bearer ${accessToken}`,
                "x-client-id": userId,
            },
        }
    );
};

export const checkStatusPayment = async (orderId, controller) => {
    const data = {
        orderId
    }
    const url = `${baseUrl}/v1/api/payment/check-status-transaction`;
    return axios.post(url, data, 
        { signal: controller.signal });
};