import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the User state type
interface UserState {
  username: string | null;
  token: string | null;
  isLoggedIn: boolean;
}

// Initial state for the user
const initialState: UserState = {
  username: null,
  token: null,
  isLoggedIn: false,
};

// Create the user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Modify the login action to accept an object containing username and token
    login: (state, action: PayloadAction<{ username: string; token: string }>) => {
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.username = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

// Export actions
export const { login, logout } = userSlice.actions;

// Configure the Redux store
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

// Type definitions for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
