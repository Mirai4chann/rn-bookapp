import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { fetchCart } from './cart'; // Import fetchCart

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://192.168.100.16:3000/auth/login', { email, password });
    await AsyncStorage.setItem('userId', response.data.userId.toString());
    await AsyncStorage.setItem('isAdmin', response.data.isAdmin.toString());
    await AsyncStorage.setItem('jwtToken', response.data.token);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Login failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { getState }) => {
  const { userId } = getState().auth;
  await axios.post('http://192.168.100.16:3000/auth/logout', { userId });
  await AsyncStorage.multiRemove(['userId', 'isAdmin', 'jwtToken']);
});

export const initializeAuth = createAsyncThunk('auth/initializeAuth', async (_, { dispatch }) => {
  const userId = await AsyncStorage.getItem('userId');
  const isAdmin = await AsyncStorage.getItem('isAdmin');
  const jwtToken = await AsyncStorage.getItem('jwtToken');
  if (userId && jwtToken) {
    if (isAdmin !== '1') {
      await dispatch(fetchCart(userId)).unwrap(); // Ensure fetchCart completes
    }
    return { userId, isAdmin: isAdmin === '1', token: jwtToken };
  }
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    isAdmin: false,
    userId: null,
    token: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.isAdmin = action.payload.isAdmin;
        state.userId = action.payload.userId;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.isAdmin = false;
        state.userId = null;
        state.token = null;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.isLoggedIn = true;
          state.isAdmin = action.payload.isAdmin;
          state.userId = action.payload.userId;
          state.token = action.payload.token;
          state.error = null;
        }
      });
  },
});

export default authSlice.reducer;