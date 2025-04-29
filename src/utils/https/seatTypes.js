import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const getAllSeatTypes = (controller) => {
    const url = `${baseUrl}/v1/api/seat-types`;
    return axios.get(url, { signal: controller.signal });
};