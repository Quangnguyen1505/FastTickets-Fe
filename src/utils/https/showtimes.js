import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const getShowTimeByMovieId = (movie_id, show_date, controller) => {
    console.log("show_date : ", show_date)
    const url = `${baseUrl}/v1/api/showtimes/movies/${movie_id}?show_date=${show_date}`;    
    return axios.get(url, { signal: controller.signal });
};

export const getPriceShowTimeBySeatTypeId = (seat_type_id, show_time_id, controller) => {
    const url = `${baseUrl}/v1/api/showtimes/${show_time_id}/tickets/${seat_type_id}`;
    return axios.get(url, { signal: controller.signal });
};