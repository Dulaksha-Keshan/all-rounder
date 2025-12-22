import express, { type Request, type Response } from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();
import {achievementModel} from './models/achievementModel.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// MongoDB Connection eka hdnna methant 
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));


//MEKAT oyage test eka hdnna obeject ekak widiyat


// METHANIN THAMAI ROUTES TIKA ptn GANNE
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server is running' });
});

// MEKA POST EKA PATHUMI
app.post('/test', async (req: Request, res: Response) => {
  try {
    const doc = await achievementModel.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// GET ALL EKA 
app.get('/test', async (req: Request, res: Response) => {
  try {
    const docs = await achievementModel.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET EKA  EKKENEKTA
app.get('/test/:id', async (req: Request, res: Response) => {
  try {
    const doc = await achievementModel.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// MEKA PUT 
app.put('/test/:id', async (req: Request, res: Response) => {
  try {
    const doc = await achievementModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

//PATHUMI MEKE DELETE HODE
app.delete('/test/:id', async (req: Request, res: Response) => {
  try {
    const doc = await achievementModel.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
