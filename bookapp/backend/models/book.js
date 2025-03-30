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
    // Find the highest existing id and increment it
    const lastBook = await Book.findOne().sort({ id: -1 }); // Get book with highest id
    const nextId = lastBook && lastBook.id ? lastBook.id + 1 : 1; // Start at 1 if no books exist

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
    return { id: book.id, ...book._doc }; // Return id as number
  },
  getAllBooks: async () => {
    const books = await Book.find();
    return books.map(book => ({ id: book.id, ...book._doc })); // Use numeric id
  },
  updateBook: async (id, title, author, price, stock, category, description, photo) => {
    const book = await Book.findOneAndUpdate(
      { id }, // Find by custom id
      { title, author, price, stock, category, description, photo },
      { new: true }
    );
    return book ? { id: book.id, ...book._doc } : null;
  },
  deleteBook: async (id) => {
    const book = await Book.findOneAndDelete({ id }); // Delete by custom id
    return book ? { id: book.id, ...book._doc } : null;
  },
};