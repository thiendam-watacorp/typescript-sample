import { Request, Response } from 'express';

export interface AppContext {
  req: Request & { session: { user?: unknown } };
  res: Response;
  idToken: string;
}
