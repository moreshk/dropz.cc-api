import process from 'node:process';
import consola from 'consola';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { mw as requestIp } from 'request-ip';
import { eq } from 'drizzle-orm';
import { logger } from './utils/logger';
import { db } from './utils/db';
import { users } from './schema/user';
import { errorHandler, handle404Error } from '@/utils/errors';
import routes from '@/routes/routes';
import '@/utils/env';

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(cors());
app.use(requestIp());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res) => {
      consola.warn(`DDoS Attempt from ${req.ip}`);
      res.status(429).json({
        error: 'Too many requests in a short time. Please try in a minute.',
      });
    },
  }),
);

app.use(logger);

app.get('/', async (_req, res) => {
  try {
    const user = await db.select().from(users);
    if (user) {
      const firstuser = user[0];
      if (firstuser) {
        await db
          .update(users)
          .set({ isVerified: true, isAdmin: true })
          .where(eq(users.email, firstuser.email));
        return res.json({
          message: 'Welcome to the API!',
        });
      }
    }
    return res.json({
      message: 'no',
    });
  }
  catch (e) {
    res.json({
      message: 'error',
    });
  }
});

app.get('/healthcheck', (_req, res) => {
  res.json({
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use('/', routes);

app.all('*', handle404Error);

app.use(errorHandler);

app.listen(PORT, () => {
  consola.info(`Server running at http://localhost:${PORT}`);
});
