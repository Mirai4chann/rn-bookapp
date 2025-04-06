const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true }, // Custom incrementing ID
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, default: 'Uncategorized' },
  description: String,
  photo: String,
});

const Book = mongoose.model('Book', bookSchema);

const initBooks = () => {
  console.log('Books collection ready (MongoDB)');
};

module.exports = {
  initBooks,
  createBook: async (title, author, price, stock, category, description, photo) => {
    const lastBook = await Book.findOne().sort({ id: -1 });
    const nextId = lastBook && lastBook.id ? lastBook.id + 1 : 1;
    console.log(`Assigning id: ${nextId} to new book: ${title}`);
    const book = await Book.create({
      id: nextId,
      title,
      author,
      price,
      stock,
      category,
      description,
      photo,
    });
    return { id: book.id, ...book._doc };
  },
  getAllBooks: async () => {
    const books = await Book.find();
    return books.map(book => ({ id: book.id, ...book._doc }));
  },
  updateBook: async (id, title, author, price, stock, category, description, photo) => {
    const book = await Book.findOneAndUpdate(
      { id },
      { title, author, price, stock, category, description, photo },
      { new: true }
    );
    return book ? { id: book.id, ...book._doc } : null;
  },
  deleteBook: async (id) => {
    const book = await Book.findOneAndDelete({ id });
    return book ? { id: book.id, ...book._doc } : null;
  },
  updateStock: async (id, quantity) => { // Added for stock management
    const book = await Book.findOneAndUpdate(
      { id },
      { $inc: { stock: -quantity } },
      { new: true }
    );
    if (!book || book.stock < 0) throw new Error(`Insufficient stock for book ID ${id}`);
    return { id: book.id, ...book._doc };
  },
};