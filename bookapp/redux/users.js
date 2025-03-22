import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://192.168.100.16:3000/auth/users');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error fetching users');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;