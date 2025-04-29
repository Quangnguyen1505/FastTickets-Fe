const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  user_order: [], // [{ type: "vip", location: "D1" }]
  show_time_id: null,
  checkoutPrice: null
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addDataBookNow: (state, action) => {
      const {
        checkoutPrice,
        show_time_id,
        user_order,
      } = action.payload;

      state.checkoutPrice = checkoutPrice;
      state.show_time_id = show_time_id;
      state.user_order = user_order || []; // danh sách ghế đã chọn
    },

    resetOrder: () => {
      return initialState;
    },
  },
});

export const orderAction = { ...orderSlice.actions };
export default orderSlice.reducer;
