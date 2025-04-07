import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const getAllSeatByRoomId = (room_id, controller) => {
    const url = `${baseUrl}/v1/api/seats?room_id=${room_id}`;
    return axios.get(url, { signal: controller.signal });
};