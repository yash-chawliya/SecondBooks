import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  bookId: { type: String, required: true, unique: true },
  bookDescription: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  tags: { type: [String], required: true },
  author: { type: [String], required: true, trim: true },
  publisher: { type: String, required: true, trim: true },
  imageUrls: { type: [String], required: true },
  class: { type: [Number], required: true },
  exam: { type: String, required: true, trim: true },
  newPrice: { type: Number, required: true },
  newPriceDiscount: { type: Number, required: true },
  preOwnedPrice: { type: Number, required: true },
  preOwnedPriceDiscount: { type: Number, required: true },
  details: { type: String },
  language: { type: String, required: true }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;
