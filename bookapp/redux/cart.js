import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`http://192.168.100.16:3000/cart/${userId}`);
    return response.data.map(item => ({ book: { ...item, id: item.id }, quantity: item.quantity }));
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error fetching cart');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ userId, book }, { dispatch }) => {
  await axios.post('http://192.168.100.16:3000/cart', { userId, bookId: book.id, quantity: 1 });
  await dispatch(fetchCart(userId));
  return book;
});

export const increaseQuantity = createAsyncThunk('cart/increaseQuantity', async ({ userId, bookId }, { getState, dispatch }) => {
  const { cart } = getState().cart;
  const item = cart.find((i) => i.book.id === bookId);
  if (item && item.quantity < item.book.stock) {
    await axios.put(`http://192.168.100.16:3000/cart/${userId}/${bookId}`, { quantity: item.quantity + 1 });
    await dispatch(fetchCart(userId));
  }
});

export const decreaseQuantity = createAsyncThunk('cart/decreaseQuantity', async ({ userId, bookId }, { getState, dispatch }) => {
  const { cart } = getState().cart;
  const item = cart.find((i) => i.book.id === bookId);
  if (item && item.quantity > 1) {
    await axios.put(`http://192.168.100.16:3000/cart/${userId}/${bookId}`, { quantity: item.quantity - 1 });
    await dispatch(fetchCart(userId));
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ userId, bookId }, { dispatch }) => {
  await axios.delete(`http://192.168.100.16:3000/cart/${userId}/${bookId}`);
  await dispatch(fetchCart(userId));
});

export const checkout = createAsyncThunk('cart/checkout', async (userId) => {
  await axios.delete(`http://192.168.100.16:3000/cart/${userId}`);
  return [];
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(increaseQuantity.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(decreaseQuantity.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.error = null;
      });
  },
});

export default cartSlice.reducer;