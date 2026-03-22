import express from 'express';
import cors from 'cors';
import urlRoutes from './routes/urlRoutes';
import { redirectHandler } from './controllers/urlController';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', urlRoutes);
app.get('/:shortCode', redirectHandler);

app.get('/health', (req, res) => {
  res.json({
    code: 200,
    message: 'Server is running',
    data: {
      timestamp: new Date().toISOString()
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
