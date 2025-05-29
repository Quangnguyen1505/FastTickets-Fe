import { register, login } from "@/utils/https/auth";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  isLoading: false,
  isRejected: false,
  isFulfilled: false,
  err: null,
};

// Định nghĩa thunk cho Register
export const storeRegister = createAsyncThunk(
  "auth/register",
  async ({ response }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = response;
      return fulfillWithValue(data.metadata);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Định nghĩa thunk cho Login
export const storeLogin = createAsyncThunk(
  "auth/login",
  async ({ response }, { rejectWithValue, fulfillWithValue }) => {
    try {
      // const response = await login(email, password, controller);
      const { data } = response;
      return fulfillWithValue(data.metadata);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const storeOauthLogin = createAsyncThunk(
  "auth/oauthLogin",
  async ({ userData }, { fulfillWithValue, rejectWithValue }) => {
    try {
      return fulfillWithValue(userData);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);


// Slice dùng chung cho cả Register và Login
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProfile: (prevState, action) => {
      return {
        ...prevState,
        data: {
          ...prevState.data,
          first_name: action.payload.first_name,
          last_name: action.payload.last_name,
          email: action.payload.email,
          image: action.payload.image,
          phone: action.payload.phone,
          points: action.payload.point || 0,
        },
      };
    },
    editProfile: (prevState, action) => {
      return {
        ...prevState,
        data: {
          ...prevState.data,
          first_name: action.payload.first_name,
          last_name: action.payload.last_name,
          image: action.payload.image || prevState.data.image,
          phone: action.payload.phone,
        },
      };
    },
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Xử lý Register
      .addCase(storeRegister.pending, (state) => {
        state.isLoading = true;
        state.isRejected = false;
        state.isFulfilled = false;
      })
      .addCase(storeRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFulfilled = true;
        state.data = action.payload;
      })
      .addCase(storeRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.isRejected = true;
        state.err = action.payload;
      })
      // Xử lý Login
      .addCase(storeLogin.pending, (state) => {
        state.isLoading = true;
        state.isRejected = false;
        state.isFulfilled = false;
      })
      .addCase(storeLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFulfilled = true;
        state.data = action.payload;
      })
      .addCase(storeLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isRejected = true;
        state.err = action.payload;
      })
      // Xử lý storeOauthLogin
      .addCase(storeOauthLogin.pending, (state) => {
            state.isLoading = true;
            state.isRejected = false;
            state.isFulfilled = false;
      })
      .addCase(storeOauthLogin.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isFulfilled = true;
          state.data = action.payload;
      })
      .addCase(storeOauthLogin.rejected, (state, action) => {
          state.isLoading = false;
          state.isRejected = true;
          state.err = action.payload;
      });
  },
});

export const usersAction = {
  ...authSlice.actions,
  storeRegister,
  storeLogin,
};

export default authSlice.reducer;
