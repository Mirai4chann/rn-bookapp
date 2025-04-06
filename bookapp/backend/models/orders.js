const mongoose = require('mongoose');
const { updateStock } = require('./book');

const orderSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  order_items: [{
    book: { 
      type: mongoose.Schema.Types.Mixed, // Allow flexibility, or use specific type below
      // id: { type: String, required: true }, // Explicitly expect string ID (MongoDB ObjectId)
      required: true 
    },
    quantity: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  payment_method: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  date: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = {
  createOrder: async (orderData) => {
    try {
      console.log('Creating order with data:', orderData);
      const order = await Order.create(orderData);
      for (const item of orderData.order_items) {
        if (!item.book || !item.book.id) {
          throw new Error('Invalid book data in order items');
        }
        // Ensure updateStock handles string IDs
        await updateStock(item.book.id, item.quantity);
      }
      return order;
    } catch (err) {
      console.error('Order creation failed:', err.message);
      throw err;
    }
  },
  getUserOrders: (userId) => Order.find({ userId }),
  getAllOrders: () => Order.find(),
  updateOrderStatus: (id, status) => Order.findOneAndUpdate({ id }, { status }, { new: true }),
};