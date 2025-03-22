import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import cartReducer from './cart';
import bookReducer from './books';
import userReducer from './users';
import profileReducer from './profile';

export default configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    books: bookReducer,
    users: userReducer,
    profile: profileReducer,
  },
});