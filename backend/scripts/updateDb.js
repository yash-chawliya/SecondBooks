import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from '../src/models/Book.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function updateDb() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const books = await Book.find({});
    let updatedCount = 0;

    for (const book of books) {
      let needsUpdate = false;
      const newImageUrls = book.imageUrls.map(url => {
        if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')) {
          needsUpdate = true;
          return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
        return url;
      });

      if (needsUpdate) {
        book.imageUrls = newImageUrls;
        await book.save();
        updatedCount++;
      }
    }

    console.log(`Updated ${updatedCount} books.`);
  } catch (err) {
    console.error('Error updating DB:', err);
  } finally {
    mongoose.connection.close();
  }
}

updateDb();
