import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../src/config/apiConfig';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/cart/${userId}`);
    console.log(`[fetchCart] Fetched cart for userId=${userId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[fetchCart] Error fetching cart for userId=${userId}:`, error.message);
    return rejectWithValue(error.response?.data?.error || 'Error fetching cart');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ userId, book }, { dispatch, rejectWithValue }) => {
  try {
    const bookId = book.id.toString(); // Ensure consistent type
    const response = await axios.post(`${BASE_URL}/cart`, { userId, bookId, quantity: 1 });
    console.log(`[addToCart] Added bookId=${bookId} to cart for userId=${userId}:`, response.data);
    const updatedCart = await dispatch(fetchCart(userId)).unwrap();
    return updatedCart;
  } catch (error) {
    console.error(`[addToCart] Error adding to cart for userId=${userId}:`, error.message);
    return rejectWithValue(error.response?.data?.error || 'Error adding to cart');
  }
});

export const increaseQuantity = createAsyncThunk('cart/increaseQuantity', async ({ userId, bookId }, { getState, dispatch, rejectWithValue }) => {
  const { cart } = getState().cart;
  const item = cart.find((i) => i.book.id.toString() === bookId.toString());
  if (!item) return rejectWithValue('Item not found in cart');
  if (item.quantity >= item.book.stock) return rejectWithValue('Cannot exceed stock limit');
  try {
    const newQuantity = item.quantity + 1;
    await axios.put(`${BASE_URL}/cart/${userId}/${bookId}`, { quantity: newQuantity });
    return await dispatch(fetchCart(userId)).unwrap();
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error increasing quantity');
  }
});

export const decreaseQuantity = createAsyncThunk('cart/decreaseQuantity', async ({ userId, bookId }, { getState, dispatch, rejectWithValue }) => {
  const { cart } = getState().cart;
  const item = cart.find((i) => i.book.id.toString() === bookId.toString());
  if (!item) return rejectWithValue('Item not found in cart');
  if (item.quantity <= 1) return rejectWithValue('Quantity cannot be less than 1');
  try {
    const newQuantity = item.quantity - 1;
    await axios.put(`${BASE_URL}/cart/${userId}/${bookId}`, { quantity: newQuantity });
    return await dispatch(fetchCart(userId)).unwrap();
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error decreasing quantity');
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ userId, bookId }, { dispatch, rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/cart/${userId}/${bookId}`);
    return await dispatch(fetchCart(userId)).unwrap();
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error removing from cart');
  }
});

export const checkout = createAsyncThunk('cart/checkout', async (userId, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.delete(`${BASE_URL}/cart/${userId}`);
    console.log('[checkout] Checkout response:', response.data);
    const updatedCart = await dispatch(fetchCart(userId)).unwrap();
    return updatedCart;
  } catch (error) {
    console.error('[checkout] Checkout error:', error.message);
    const updatedCart = await dispatch(fetchCart(userId)).unwrap();
    return updatedCart;
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { cart: [], error: null, status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchCart.fulfilled, (state, action) => { state.status = 'succeeded'; state.cart = action.payload; state.error = null; })
      .addCase(fetchCart.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(addToCart.fulfilled, (state, action) => { state.cart = action.payload; state.error = null; })
      .addCase(addToCart.rejected, (state, action) => { state.error = action.payload; })
      .addCase(increaseQuantity.fulfilled, (state, action) => { state.cart = action.payload; state.error = null; })
      .addCase(increaseQuantity.rejected, (state, action) => { state.error = action.payload; })
      .addCase(decreaseQuantity.fulfilled, (state, action) => { state.cart = action.payload; state.error = null; })
      .addCase(decreaseQuantity.rejected, (state, action) => { state.error = action.payload; })
      .addCase(removeFromCart.fulfilled, (state, action) => { state.cart = action.payload; state.error = null; })
      .addCase(removeFromCart.rejected, (state, action) => { state.error = action.payload; })
      .addCase(checkout.fulfilled, (state, action) => { state.cart = action.payload; state.error = null; })
      .addCase(checkout.rejected, (state, action) => { state.error = action.payload; });
  },
});

export default cartSlice.reducer;