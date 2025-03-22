import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const response = await axios.get(`http://192.168.100.16:3000/auth/user/${userId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error fetching profile');
  }
});

export const updateProfile = createAsyncThunk('profile/updateProfile', async (profileData, { dispatch }) => {
  const userId = await AsyncStorage.getItem('userId');
  await axios.put(`http://192.168.100.16:3000/auth/profile/${userId}`, profileData);
  await dispatch(fetchProfile());
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: { email: '', name: '', photo: null },
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.error = null;
      });
  },
});

export default profileSlice.reducer;