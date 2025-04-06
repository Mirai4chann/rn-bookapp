import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../src/config/apiConfig';

export const createReview = createAsyncThunk('reviews/createReview', async (reviewData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error creating review');
  }
});

export const fetchBookReviews = createAsyncThunk('reviews/fetchBookReviews', async (bookId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/reviews/book/${bookId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error fetching reviews');
  }
});

export const fetchUserReviews = createAsyncThunk('reviews/fetchUserReviews', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/reviews/user/${userId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error fetching user reviews');
  }
});

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: { reviews: [], bookReviews: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createReview.fulfilled, (state, action) => { state.reviews.push(action.payload); state.error = null; })
      .addCase(createReview.rejected, (state, action) => { state.error = action.payload; })
      .addCase(fetchBookReviews.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchBookReviews.fulfilled, (state, action) => { state.status = 'succeeded'; state.bookReviews = action.payload; state.error = null; })
      .addCase(fetchBookReviews.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(fetchUserReviews.fulfilled, (state, action) => { state.reviews = action.payload; state.error = null; })
      .addCase(fetchUserReviews.rejected, (state, action) => { state.error = action.payload; });
  },
});

export default reviewsSlice.reducer;