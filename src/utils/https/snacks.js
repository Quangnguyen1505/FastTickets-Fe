import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const getSnacks = (controller) => {
    const url = `${baseUrl}/v1/api/snacks`;    
    return axios.get(url, { signal: controller.signal });
};

export const getSnackById = (snack_id, controller) => {
    const url = `${baseUrl}/v1/api/snacks/${snack_id}`;
    return axios.get(url, { signal: controller.signal });
};