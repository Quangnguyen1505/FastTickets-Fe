import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const getGenre = (controller) => {
  const url = `${baseUrl}/genre`;
  return axios.get(url, { signal: controller.signal });
};

export const getMovies = (params, controller) => {
  const { limit, page = 1, movieStatus = "", sort = "" } = params;
  console.log("akak ", { limit, page, movieStatus, sort });
  
  const url = `${baseUrl}/v1/api/movies?limit=${limit}&page=${page}&movie_status=${movieStatus}`;
  return axios.get(url, { signal: controller.signal });
};

export const getMovieDetails = (movieId, controller) => {
  console.log("movieId ", movieId);
  
  const url = `${baseUrl}/v1/api/movies/${movieId}`;
  return axios.get(url, { signal: controller.signal });
};

export const getStudioTime = (info, controller) => {
  const url = `${baseUrl}/teather?open_date=${info}`;
  console.log(url);
  return axios.get(url, { signal: controller.signal });
};
