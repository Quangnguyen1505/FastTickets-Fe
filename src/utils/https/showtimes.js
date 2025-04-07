import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const getShowTimeByMovieId = (movie_id, controller) => {
    const url = `${baseUrl}/v1/api/showtimes/movies/${movie_id}`;
    return axios.get(url, { signal: controller.signal });
};