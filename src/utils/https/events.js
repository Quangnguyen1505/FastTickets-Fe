import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_GO_ID;

export const getEvents = (params, controller) => {
    const { limit = 4, page = 1 } = params;
    const url = `${baseUrl}/v1/2024/events?limit=${limit}&page=${page}`;
     console.log("url events:", url);
    return axios.get(url, { signal: controller.signal });
};

export const getEventById = (id, controller) => {
    const url = `${baseUrl}/v1/2024/events/${id}`;
    return axios.get(url, { signal: controller.signal });
}