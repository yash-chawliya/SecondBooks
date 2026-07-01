import express from 'express';
import { 
  getBooks, getBookById, updateBook, getBulkBooks, 
  getBooksByExamSubject, addBook, searchBooks 
} from '../controllers/bookController.js';

const router = express.Router();

router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/exam/:exam/:subject', getBooksByExamSubject);
router.post('/bulk', getBulkBooks);
router.post('/add', addBook);
router.get('/:bookId', getBookById);
router.put('/:bookId', updateBook);

export default router;
