import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId, { rejectWithValue }) => {
  try {
    console.log('Fetching cart for userId:', userId);
    const response = await axios.get(`http://192.168.100.16:3000/cart/${userId}`);
    console.log('Fetched cart data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch cart error:', error.response?.data || error.message);
    return rejectWithValue(error.response?.data?.error || 'Error fetching cart');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ userId, book }, { dispatch, rejectWithValue }) => {
  try {
    const bookId = parseInt(book.id);
    console.log('Adding to cart:', { userId, bookId, quantity: 1 });
    await axios.post('http://192.168.100.16:3000/cart', { userId, bookId, quantity: 1 });
    const result = await dispatch(fetchCart(userId)).unwrap();
    return result;
  } catch (error) {
    console.error('Add to cart error:', error.response?.data || error.message);
    return rejectWithValue(error.response?.data?.error || 'Error adding to cart');
  }
});

export const increaseQuantity = createAsyncThunk('cart/increaseQuantity', async ({ userId, bookId }, { getState, dispatch, rejectWithValue }) => {
  const { cart } = getState().cart;
  const item = cart.find((i) => i.book.id === bookId);
  if (!item) {
    return rejectWithValue('Item not found in cart');
  }
  if (item.quantity >= item.book.stock) {
    return rejectWithValue('Cannot exceed stock limit');
  }
  try {
    const newQuantity = item.quantity + 1;
    await axios.put(`http://192.168.100.16:3000/cart/${userId}/${bookId}`, { quantity: newQuantity });
    const result = await dispatch(fetchCart(userId)).unwrap();
    return result;
  } catch (error) {
    console.error('Increase quantity error:', error.response?.data || error.message);
    return rejectWithValue(error.response?.data?.error || 'Error increasing quantity');
  }
});

export const decreaseQuantity = createAsyncThunk('cart/decreaseQuantity', async ({ userId, bookId }, { getState, dispatch, rejectWithValue }) => {
  const { cart } = getState().cart;
  const item = cart.find((i) => i.book.id === bookId);
  if (!item) {
    return rejectWithValue('Item not found in cart');
  }
  if (item.quantity <= 1) {
    return rejectWithValue('Quantity cannot be less than 1');
  }
  try {
    const newQuantity = item.quantity - 1;
    await axios.put(`http://192.168.100.16:3000/cart/${userId}/${bookId}`, { quantity: newQuantity });
    const result = await dispatch(fetchCart(userId)).unwrap();
    return result;
  } catch (error) {
    console.error('Decrease quantity error:', error.response?.data || error.message);
    return rejectWithValue(error.response?.data?.error || 'Error decreasing quantity');
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ userId, bookId }, { dispatch, rejectWithValue }) => {
  try {
    await axios.delete(`http://192.168.100.16:3000/cart/${userId}/${bookId}`);
    const result = await dispatch(fetchCart(userId)).unwrap();
    return result;
  } catch (error) {
    console.error('Remove from cart error:', error.response?.data || error.message);
    return rejectWithValue(error.response?.data?.error || 'Error removing from cart');
  }
});

export const checkout = createAsyncThunk('cart/checkout', async (userId, { dispatch, rejectWithValue }) => {
  try {
    await axios.delete(`http://192.168.100.16:3000/cart/${userId}`);
    const result = await dispatch(fetchCart(userId)).unwrap();
    return result;
  } catch (error) {
    console.error('Checkout error:', error.response?.data || error.message);
    return rejectWithValue(error.response?.data?.error || 'Error during checkout');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
    error: null,
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(increaseQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(decreaseQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;