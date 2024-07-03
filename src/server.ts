import process from 'node:process';
import { createServer } from 'node:http';
import consola from 'consola';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { mw as requestIp } from 'request-ip';
import { Server } from 'socket.io';
import { logger } from './utils/logger';
import { errorHandler, handle404Error } from '@/utils/errors';
import routes from '@/routes/routes';
import '@/utils/env';

const { PORT } = process.env;

const app = express();
const server = createServer(app); // Create a server using the http module
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(cors());
app.use(requestIp());
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 50,
    handler: (req, res) => {
      consola.warn(`DDoS Attempt from ${req.ip}`);
      res.status(429).json({
        error: 'Too many requests in a short time. Please try in a minute.',
      });
    },
  }),
);

app.use(logger);

app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to the API!',
  });
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
io.on('connection', (socket) => {
  consola.info('A user connected');
  socket.on('disconnect', () => {
    consola.info('A user disconnected');
  });

  socket.on('example_event', (data) => {
    consola.info('Received example_event with data:', data);
  });
});

app.listen(PORT, () => {
  consola.info(`Server running at http://localhost:${PORT}`);
});
