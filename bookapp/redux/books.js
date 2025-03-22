import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBooks = createAsyncThunk('books/fetchBooks', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://192.168.100.16:3000/books');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error fetching books');
  }
});

export const createBook = createAsyncThunk('books/createBook', async (bookData, { dispatch }) => {
  await axios.post('http://192.168.100.16:3000/books', bookData);
  await dispatch(fetchBooks());
});

export const updateBook = createAsyncThunk('books/updateBook', async ({ id, bookData }, { dispatch }) => {
  await axios.put(`http://192.168.100.16:3000/books/${id}`, bookData);
  await dispatch(fetchBooks());
});

export const deleteBook = createAsyncThunk('books/deleteBook', async (id, { dispatch }) => {
  await axios.delete(`http://192.168.100.16:3000/books/${id}`);
  await dispatch(fetchBooks());
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
      .addCase(updateBook.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state) => {
        state.error = null;
      });
  },
});

export default bookSlice.reducer;