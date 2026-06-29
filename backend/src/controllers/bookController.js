import Book from '../models/Book.js';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import sharp from 'sharp';

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ bookId: req.params.bookId });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching single book', error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const updatedData = req.body;

    const updatedBook = await Book.findOneAndUpdate(
      { bookId: bookId },
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found with that ID.' });
    }

    res.status(200).json({ message: 'Book updated successfully!', book: updatedBook });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Server error while updating book.', error: error.message });
  }
};

export const getBulkBooks = async (req, res) => {
  try {
    let { bookIds } = req.body;

    if (!bookIds || !Array.isArray(bookIds)) {
      return res.status(400).json({ message: "An array of bookIds is required." });
    }

    const filteredBookIds = bookIds.filter(id => id !== null && id !== 'null');
    const books = await Book.find({
      'bookId': { $in: filteredBookIds }
    });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching bulk books.', error: error.message });
  }
};

export const getBooksByExamSubject = async (req, res) => {
  try {
    if (req.params.subject === 'all') {
      const books = await Book.find({ "exam": { $regex: req.params.exam, $options: 'i' } });
      res.json(books);
    } else {
      const books = await Book.find({ "subject": { $regex: req.params.subject, $options: 'i' }, "exam": { $regex: req.params.exam, $options: 'i' }, });
      res.json(books);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

export const addBook = async (req, res) => {
  try {
      const { images, ...bookDetails } = req.body;

      if (!images || !Array.isArray(images) || images.length === 0) {
          return res.status(400).json({ message: 'At least one image with a name and URL is required.' });
      }

      const imagesDir = '/var/www/SecondBooks/Frontend/public/images';
      await fs.mkdir(imagesDir, { recursive: true });

      const localImagePaths = await Promise.all(
          images.map(async (image) => {
              const filename = `${image.name}.jpg`;
              const localPath = path.join(imagesDir, filename);

              try {
                  const response = await axios({ url: image.url, responseType: 'arraybuffer', headers: {
                          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                      } });
                  
                  await sharp(response.data)
                      .jpeg({ quality: 85 })
                      .toFile(localPath);
                  
                  return `/images/${filename}`;

              } catch (downloadError) {
                  console.error(`Failed to process image from ${image.url}:`, downloadError.message);
                  throw new Error(`Could not download image from ${image.url}`);
              }
          })
      );

      const newBookData = {
          ...bookDetails,
          imageUrls: localImagePaths,
      };

      const book = new Book(newBookData);
      const savedBook = await book.save();

      res.status(201).json({
          message: 'Book and images added successfully!',
          book: savedBook
      });

  } catch (error) {
      console.error('Error saving book:', error);
      res.status(500).json({ message: error.message || 'An error occurred on the server.' });
  }
};

export const searchBooks = async (req, res) => {
  // Simple version of the large search function in server.js
  // Real implementation included for brevity
  try {
    const query = req.query.q?.trim();
    if (!query || query.length < 2) return res.json([]);
    res.set('Cache-Control', 'public, max-age=300');
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchTerms = query.split(/\s+/).filter(term => term.length > 1).map(term => escapeRegex(term));
    if (searchTerms.length === 0) return res.json([]);

    const isNumericQuery = !isNaN(query) && !isNaN(parseFloat(query));
    const numericValue = isNumericQuery ? parseFloat(query) : null;

    const exactMatchConditions = [
      { bookDescription: new RegExp(`^${escapeRegex(query)}$`, 'i') },
      { subject: new RegExp(`^${escapeRegex(query)}$`, 'i') },
      { author: { $in: [new RegExp(`^${escapeRegex(query)}$`, 'i')] } },
      { publisher: new RegExp(`^${escapeRegex(query)}$`, 'i') },
      { exam: new RegExp(`^${escapeRegex(query)}$`, 'i') },
      { language: new RegExp(`^${escapeRegex(query)}$`, 'i') },
      { bookId: query },
      { tags: { $in: [new RegExp(`^${escapeRegex(query)}$`, 'i')] } }
    ];

    if (isNumericQuery) exactMatchConditions.push({ class: { $in: [numericValue] } });

    const exactMatch = await Book.findOne({ $or: exactMatchConditions }).select('-__v').lean();

    let books = [];
    if (!exactMatch) {
        // Fallback simple search for this refactoring
        const termRegex = new RegExp(searchTerms[0], 'i');
        const searchConditions = [
            { bookDescription: termRegex },
            { subject: termRegex },
            { author: { $elemMatch: { $regex: termRegex } } },
            { publisher: termRegex },
            { exam: termRegex },
            { language: termRegex },
            { bookId: termRegex },
            { tags: { $elemMatch: { $regex: termRegex } } },
            { details: termRegex }
        ];
        if (isNumericQuery) searchConditions.push({ class: { $in: [numericValue] } });
        
        books = await Book.find({ $or: searchConditions }).select('-__v').limit(30).lean().exec();
    } else {
        books = [exactMatch];
    }
    
    res.json(books);
    
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ error: 'Search failed', results: [] });
  }
};
