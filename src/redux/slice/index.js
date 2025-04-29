import { combineReducers } from "@reduxjs/toolkit";

import userSlice from "./users";
import orderSlice from "./order";
import buyFastTicketsSlice from "./buyFastTicket";

const reducers = combineReducers({
  user: userSlice,
  order: orderSlice,
  fastTickets: buyFastTicketsSlice,
});

export default reducers;
