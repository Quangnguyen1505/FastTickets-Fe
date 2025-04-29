const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  date: null,
  show_time: null,
  movieId: null,
};

const buyFastTicketsSlice = createSlice({
  name: "fastTickets",
  initialState,
  reducers: {
    addDataFastTickets: (state, action) => {
      const {
        date,
        show_time,
        movieId
      } = action.payload;

      state.date = date;
      state.show_time = show_time;
      state.movieId = movieId;
    },

    resetFastTickets: () => {
      return initialState;
    },
  },
});

export const FastTicketsAction = { ...buyFastTicketsSlice.actions };
export default buyFastTicketsSlice.reducer;
