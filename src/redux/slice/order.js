const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  user_order: [], // [{ type: "vip", location: "D1" }]
  snacks_order: [], // [{ snack_id: 1, quantity: 1 }]
  show_time_id: null,
  checkoutPrice: null,
  expirationTime: null
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
        snacks_order,
        expirationTime
      } = action.payload;

      state.checkoutPrice = checkoutPrice;
      state.show_time_id = show_time_id;
      state.user_order = user_order || []; // danh sách ghế đã chọn
      state.snacks_order = snacks_order || []; // danh sách đồ uống đã chọn
      state.expirationTime = expirationTime;
    },

    resetOrder: () => {
      return initialState;
    },
  },
});

export const orderAction = { ...orderSlice.actions };
export default orderSlice.reducer;
