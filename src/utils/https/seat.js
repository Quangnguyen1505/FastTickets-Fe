import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const getAllSeatByRoomId = (room_id, show_time_id, controller) => {
    console.log("show_time_id : ", show_time_id)
    const url = `${baseUrl}/v1/api/seats?room_id=${room_id}&showtime_id=${show_time_id}`;
    return axios.get(url, { signal: controller.signal });
};

export const updateSeatStatus = (userId, token, status, seat_id, showtime_id, controller) => {
    const body = {
        seat_status: status,
        showtime_id: showtime_id
    }
    const url = `${baseUrl}/v1/api/seats/${seat_id}`;
    return axios.put(
        url, 
        body,
        { 
            signal: controller.signal ,
            headers: {
                "authorization": `Bearer ${token}`,
                "x-client-id": userId
            }
        }
    );
}

export const lockSeat = (userId, token, seat_id, showtime_id, time, controller) => {
    const url = `${baseUrl}/v1/api/seats/hold-seat`;
    const body = {
        seatId: seat_id,
        showTimeId: showtime_id,
        expireTime: time
    }
    return axios.post(
        url, 
        body,
        { 
            signal: controller.signal,
            headers: {
                "authorization": `Bearer ${token}`,
                "x-client-id": userId
            }
        }
    );
}

export const unlockSeat = (userId, token, seat_id, showtime_id, controller) => {
    const url = `${baseUrl}/v1/api/seats/release-seat`;
    const body = {
        seatId: seat_id,
        showTimeId: showtime_id
    }
    return axios.post(
        url,
        body,
        {
            signal: controller.signal,
            headers: {
                "authorization": `Bearer ${token}`,
                "x-client-id": userId
            }
        }
    );
}
