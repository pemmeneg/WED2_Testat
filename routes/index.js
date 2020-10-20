import express from 'express';
const router = express.Router();
import {home, newNote, createNote, getNote, editNote} from '../controllers/noteController.js';




router.get('/', home);
router.get('/home', home);
router.post('/home', createNote);
router.get('/newnote', newNote)
router.get('/edit', getNote);



export default router;
