// server/src/types.d.ts
// Crucial: This import makes sure this file is treated as a module
// and connects the augmentation to the 'express' module itself.
import { Request } from 'express';
import { IUser } from './models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Add user property to Request object
    }
  }
}