import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../src/config/apiConfig';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      throw new Error('No user ID found');
    }
    const response = await axios.get(`${BASE_URL}/auth/user/${userId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message || 'Error fetching profile');
  }
});

export const updateProfile = createAsyncThunk('profile/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      throw new Error('No user ID found');
    }
    
    const cleanedData = {
      name: profileData.name,
      email: profileData.email,
      photo: profileData.photo,
      ...(profileData.currentPassword && { currentPassword: profileData.currentPassword }),
      ...(profileData.newPassword && { newPassword: profileData.newPassword })
    };

    const response = await axios.put(`${BASE_URL}/auth/profile/${userId}`, cleanedData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message || 'Error updating profile');
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: { email: '', name: '', photo: null },
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = profileSlice.actions;
export default profileSlice.reducer;