import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './router/transactionsRoute.js';

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

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;

    // Decimal(10,2)
    // 10 digits total
    // 2 digits after the decimal point
    // ex: 9999999999.99

    console.log('Database initialized successfully');
  } catch (error) {
    console.log('Error initializing DB', error);
    process.exit(1); // status code 1 means failure, 0 success
  }
}

app.get('/', (req, res) => {
  res.send('its working');
});

app.use('/api/transactions', transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is up and running on PORT: ${PORT}`);
  });
});
