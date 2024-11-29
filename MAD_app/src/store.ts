import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  username: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.username = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
