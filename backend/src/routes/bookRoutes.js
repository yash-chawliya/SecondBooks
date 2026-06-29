import express from 'express';
import { 
  getBooks, getBookById, updateBook, getBulkBooks, 
  getBooksByExamSubject, addBook, searchBooks 
} from '../controllers/bookController.js';

const router = express.Router();

router.get('/books', getBooks);
router.get('/alterbook/:bookId', getBookById);
router.put('/alterbook/:bookId', updateBook);
router.post('/books/bulk', getBulkBooks);
router.get('/exam/:exam/:subject', getBooksByExamSubject);
router.post('/add/book', addBook);
router.get('/search', searchBooks);
router.get('/books/:bookId', getBookById);

export default router;
