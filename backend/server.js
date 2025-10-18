import express from 'express';
import dotenv from 'dotenv';

import rateLimiter from './src/middleware/rateLimiter.js';
import transactionsRoute from './src/router/transactionsRoute.js';
import { initDB } from './src/config/db.js';

dotenv.config();

const app = express();
// middleware, read json from req body
app.use(rateLimiter);
app.use(express.json());

// custom simple middleware
// app.use((req, res, next) => {
//   console.log('Hey we hit a req, the method is', req.method);
//   next();
// });

const PORT = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.send('its working');
});

app.use('/api/transactions', transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is up and running on PORT: ${PORT}`);
  });
});
