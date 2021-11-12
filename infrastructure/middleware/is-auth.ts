import { Request, Response, NextFunction } from 'express';
import { MiddlewareFn } from 'type-graphql';
import { AppContext } from '../contexts/app-context';
import { AuthenticationError } from 'apollo-server-express';
import firebase from '../db/firebase';
export const IsAuth: MiddlewareFn<AppContext> = async ({ context }, next) => {
  if (!context.req.session?.idToken) {
    throw new AuthenticationError('Not Authenticated');
  } else {
    const { user_id, email, email_verified } = await firebase.auth().verifyIdToken(context.idToken);

    context.req.session.user = {
      user_id,
      email,
      email_verified,
    };
  }
  return next();
};

export const Authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.session?.idToken) {
    res.status(401).send('Not Authenticated');
  } else {
    const { user_id, email, email_verified } = await firebase
      .auth()
      .verifyIdToken(req.session?.idToken);

    req.session.user = {
      user_id,
      email,
      email_verified,
    };
  }
  next();
};
