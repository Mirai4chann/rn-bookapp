import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../src/config/apiConfig';

export const fetchBooks = createAsyncThunk('books/fetchBooks', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/books`);
    console.log('Fetched books:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch books error:', error.response?.data);
    return rejectWithValue(error.response?.data?.error || 'Error fetching books');
  }
});

export const createBook = createAsyncThunk('books/createBook', async (bookData, { dispatch, rejectWithValue }) => {
  try {
    console.log('Sending book data:', bookData);
    const response = await axios.post(`${BASE_URL}/books`, bookData);
    await dispatch(fetchBooks());
    return response.data;
  } catch (error) {
    console.error('Create book error:', error.response?.data);
    return rejectWithValue(error.response?.data?.error || 'Error creating book');
  }
});

export const updateBook = createAsyncThunk('books/updateBook', async ({ id, bookData }, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.put(`${BASE_URL}/books/${id}`, bookData);
    await dispatch(fetchBooks());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error updating book');
  }
});

export const deleteBook = createAsyncThunk('books/deleteBook', async (id, { dispatch, rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/books/${id}`);
    await dispatch(fetchBooks());
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error deleting book');
  }
});

const bookSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.books = action.payload;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createBook.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(createBook.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateBook.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state) => {
        state.error = null;
      });
  },
});

export default bookSlice.reducer;