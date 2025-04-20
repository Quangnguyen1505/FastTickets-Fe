import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_GO_ID;

export const createContactMessage = (formBody, controller) => {
    const url = `${baseUrl}/v1/2024/contact-messages`;
    return axios.post(url, formBody, {
      signal: controller.signal,
    });
};