import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createOrder = createAsyncThunk('orders/createOrder', async (orderData, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://192.168.100.16:3000/orders', orderData);
    console.log('Order creation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create order error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return rejectWithValue(error.response?.data?.error || error.message || 'Failed to create order');
  }
});

export const fetchUserOrders = createAsyncThunk('orders/fetchUserOrders', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`http://192.168.100.16:3000/orders/${userId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error fetching orders');
  }
});

export const fetchAllOrders = createAsyncThunk('orders/fetchAllOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://192.168.100.16:3000/orders');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error fetching all orders');
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateOrderStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`http://192.168.100.16:3000/orders/${id}`, { status });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error updating order status');
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], allOrders: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => { state.orders.push(action.payload); state.error = null; })
      .addCase(createOrder.rejected, (state, action) => { state.error = action.payload; })
      .addCase(fetchUserOrders.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUserOrders.fulfilled, (state, action) => { state.status = 'succeeded'; state.orders = action.payload; state.error = null; })
      .addCase(fetchUserOrders.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => { state.allOrders = action.payload; state.error = null; })
      .addCase(fetchAllOrders.rejected, (state, action) => { state.error = action.payload; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.allOrders.findIndex((order) => order.id === action.payload.id);
        if (index !== -1) state.allOrders[index] = action.payload;
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => { state.error = action.payload; });
  },
});

export default ordersSlice.reducer;