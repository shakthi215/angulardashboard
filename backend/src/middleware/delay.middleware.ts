import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to simulate API delay for async processing demonstration.
 * Usage: Add ?delay=2000 to any API request to simulate a 2-second delay.
 * Maximum allowed delay is 10 seconds for safety.
 */
export const delayMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const delayParam = req.query['delay'];
  const delayMs = delayParam ? parseInt(delayParam as string, 10) : 0;

  if (delayMs > 0) {
    const safeDelay = Math.min(delayMs, 10000); // Cap at 10 seconds
    console.log(`⏳ Simulating ${safeDelay}ms delay for ${req.method} ${req.path}`);
    setTimeout(() => {
      res.setHeader('X-Simulated-Delay', safeDelay.toString());
      next();
    }, safeDelay);
  } else {
    next();
  }
};
